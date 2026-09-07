import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const sourceRoot = 'C:/Users/Domensan/Desktop/Scrapy';
const destination = path.resolve('public/ffs/products');
const catalog = JSON.parse(await fs.readFile(`${sourceRoot}/raw_catastro.json`, 'utf8')).products;
const manifest = JSON.parse(await fs.readFile(`${sourceRoot}/downloaded_images_manifest.json`, 'utf8'));
const filesByUrl = new Map(manifest.map(({ url, path: file }) => [url, file]));
const slug = (text) => text.normalize('NFKD').replace(/[^\w\s-]/g, '').trim().toLowerCase().replace(/[\s_]+/g, '-');
const escapeHtml = (text = '') => text.replace(/[&<>"']/g, (character) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]
);
const description = (product) => [
  `<p>Fast Fill Systems component for ${escapeHtml(product.categoria || 'fluid transfer')} applications.</p>`,
  `<p><strong>SKU:</strong> ${escapeHtml(product.importSku)}</p>`,
  product.spec_link ? `<p><a href="${escapeHtml(product.spec_link)}" target="_blank" rel="noopener noreferrer">View technical data sheet</a></p>` : '',
  product.url_producto ? `<p><a href="${escapeHtml(product.url_producto)}" target="_blank" rel="noopener noreferrer">Manufacturer information</a></p>` : ''
].join('');
const selected = catalog.filter((product) =>
  product.sku_web && product.nombre && product.image_urls?.some((url) =>
    filesByUrl.has(url) && !/logo|badge/i.test(url)
  )
).map((product) => ({
  ...product,
  importSku: product.sku_web.toLowerCase() === 'n/a'
    ? `FFS-${slug(product.nombre).slice(0, 48)}`
    : product.sku_web
}));

if (selected.length < 8) throw new Error('There are not enough products with local images for the MVP');

await fs.mkdir(destination, { recursive: true });
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
const client = await pool.connect();

try {
  await client.query('BEGIN');
  const categoryIds = new Map();

  for (const name of [...new Set(selected.map(({ categoria }) => categoria || 'Products'))]) {
    const urlKey = slug(name);
    let result = await client.query(
      `SELECT c.category_id FROM category c
       JOIN category_description d ON d.category_description_category_id = c.category_id
       WHERE d.url_key = $1`,
      [urlKey]
    );
    if (!result.rowCount) {
      result = await client.query(
        `WITH created AS (
          INSERT INTO category(status, include_in_nav, position)
          VALUES (true, true, 10) RETURNING category_id
        )
        INSERT INTO category_description(category_description_category_id, name, url_key)
        SELECT category_id, $1, $2 FROM created RETURNING category_description_category_id AS category_id`,
        [name, urlKey]
      );
    }
    categoryIds.set(name, result.rows[0].category_id);
  }

  for (const product of selected) {
    const imageUrl = product.image_urls.find((url) => filesByUrl.has(url) && !/logo|badge/i.test(url));
    const source = path.resolve(sourceRoot, filesByUrl.get(imageUrl));
    const extension = path.extname(source).toLowerCase();
    const filename = `${slug(product.importSku)}${extension}`;
    await fs.copyFile(source, path.join(destination, filename));

    const existing = await client.query('SELECT product_id FROM product WHERE sku = $1', [product.importSku]);
    let productId;
    if (existing.rowCount) {
      productId = existing.rows[0].product_id;
      await client.query(
        `UPDATE product SET status=true, category_id=$2, no_shipping_required=true, updated_at=NOW()
         WHERE product_id=$1`,
        [productId, categoryIds.get(product.categoria || 'Products')]
      );
      await client.query(
        `UPDATE product_description SET name=$2, url_key=$3,
         description=$4, meta_title=$5 WHERE product_description_product_id=$1`,
        [productId, product.nombre.replace(/^[–—-]\s*/, ''), slug(`${product.nombre}-${product.importSku}`),
          description(product),
          product.nombre.replace(/^[â€“â€”-]\s*/, '')]
      );
      await client.query('DELETE FROM product_image WHERE product_image_product_id=$1', [productId]);
    } else {
      const inserted = await client.query(
        `INSERT INTO product(status, visibility, group_id, sku, price, weight, category_id, no_shipping_required)
         VALUES (true, true, 1, $1, 0, 0, $2, true) RETURNING product_id`,
        [product.importSku, categoryIds.get(product.categoria || 'Products')]
      );
      productId = inserted.rows[0].product_id;
      const cleanName = product.nombre.replace(/^[–—-]\s*/, '');
      await client.query(
        `INSERT INTO product_description
         (product_description_product_id, name, description, url_key, meta_title, meta_description)
          VALUES ($1, $2, $3, $4, $5, $6)`,
        [productId, cleanName,
          description(product),
          slug(`${cleanName}-${product.importSku}`), cleanName,
          `${cleanName} by Fast Fill Systems`]
      );
      await client.query(
        `INSERT INTO product_inventory
         (product_inventory_product_id, qty, manage_stock, stock_availability)
         VALUES ($1, 999, false, true)`,
        [productId]
      );
    }
    await client.query(
      `INSERT INTO product_image(product_image_product_id, origin_image, is_main)
       VALUES ($1, $2, true)`,
      [productId, `public/ffs/products/${filename}`]
    );
  }

  await client.query('COMMIT');
  console.log(`MVP imported: ${selected.length} products, ${categoryIds.size} categories`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
  await pool.end();
}
