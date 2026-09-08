// Reconcile the 13 listings at https://www.fastfillsystems.com/cat/fuel-nozzles/.
// Run from the EN root with node scripts/sync-fuel-nozzles.mjs. Uses the local .env.
import 'dotenv/config';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import pg from 'pg';

const families = [
  ['Classic', 'classic', ['001-3-4']],
  ['Parts', 'fuel-nozzles-parts', ['001-3-33', '001-3-8', '001-3-6', '001-3-35']],
  ['Piston Sureloc', 'piston-sureloc', ['001-3-3']],
  ['Pitboss', 'pitboss', ['001']],
  ['SureLoc', 'sureloc', ['001-1', '001-3-2']],
  ['Titan', 'titan', ['001-3-1']]
];
// Keep the original website's separate listings and SKU identifiers; do not infer
// that the two N1000PSLp listings are interchangeable or import placeholder prices.
const additions = [
  { sku: '001', name: 'Pitboss N150PBp', slug: 'pitboss-n150pbp', image: 'pitboss-n150pbp.png',
    description: '<p>PitBoss diesel fueling nozzle with Elastodog latching and piston-driven shutoff.</p><p><a href="https://www.fastfillsystems.com/product/pitboss-n150pbp/" target="_blank" rel="noopener noreferrer">Manufacturer information and specifications</a></p>' },
  { sku: '001-3-2', name: 'Sureloc 1000 N1000PSLp', slug: 'sureloc-1000-n1000pslp', image: 'sureloc-1000.png',
    description: '<p>SureLoc 1000 fuel nozzle for use with the PLA1000 pressureless system. Confirm the complete configuration before ordering.</p><p><a href="https://www.fastfillsystems.com/product/sureloc-1000-n1000pslp/" target="_blank" rel="noopener noreferrer">Manufacturer information and specifications</a></p>' }
];
for (const item of additions) assert.ok(fs.existsSync(`public/ffs/products/${item.image}`));
const client = new pg.Client({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT), database: process.env.DB_NAME, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
await client.connect();
try {
  await client.query('BEGIN');
  const root = (await client.query(`SELECT c.category_id FROM category c JOIN category_description d ON d.category_description_category_id=c.category_id WHERE d.url_key='fuel-nozzles'`)).rows[0];
  assert.ok(root, 'Fuel Nozzles category must already exist');
  for (const item of additions) {
    let product = (await client.query('SELECT product_id FROM product WHERE sku=$1', [item.sku])).rows[0];
    if (!product) {
      product = (await client.query(`INSERT INTO product(status,visibility,group_id,sku,price,weight,category_id,no_shipping_required) VALUES(true,true,1,$1,0,0,$2,true) RETURNING product_id`, [item.sku, root.category_id])).rows[0];
      await client.query(`INSERT INTO product_description(product_description_product_id,name,description,url_key,meta_title,meta_description) VALUES($1,$2,$3,$4,$5,$6)`, [product.product_id,item.name,item.description,item.slug,item.name,item.name]);
      await client.query(`INSERT INTO product_inventory(product_inventory_product_id,qty,manage_stock,stock_availability) VALUES($1,0,false,true)`, [product.product_id]);
      await client.query(`INSERT INTO product_image(product_image_product_id,origin_image,is_main) VALUES($1,$2,true)`, [product.product_id,`public/ffs/products/${item.image}`]);
    }
  }
  for (const [name, slug, skus] of families) {
    let category = (await client.query(`SELECT c.category_id,c.parent_id FROM category c JOIN category_description d ON d.category_description_category_id=c.category_id WHERE d.url_key=$1`, [slug])).rows[0];
    if (!category) {
      category = (await client.query(`INSERT INTO category(status,include_in_nav,position,parent_id) VALUES(true,true,10,$1) RETURNING category_id`, [root.category_id])).rows[0];
      await client.query(`INSERT INTO category_description(category_description_category_id,name,url_key) VALUES($1,$2,$3)`, [category.category_id,name,slug]);
    } else {
      assert.ok(category.parent_id === null || category.parent_id === root.category_id, `Unexpected parent for ${slug}`);
      await client.query('UPDATE category SET parent_id=$1 WHERE category_id=$2', [root.category_id,category.category_id]);
    }
    const updated = await client.query(`UPDATE product SET category_id=$1,updated_at=NOW() WHERE sku=ANY($2::text[]) RETURNING sku`, [category.category_id,skus]);
    assert.equal(updated.rowCount, skus.length, `Missing expected products in ${name}`);
  }
  const expected = [...families.flatMap(([, , skus]) => skus), 'N150ATp', 'S1510', 'N1000PSLp'];
  const products = (await client.query(`WITH RECURSIVE tree AS (SELECT category_id FROM category WHERE category_id=$1 UNION ALL SELECT c.category_id FROM category c JOIN tree t ON c.parent_id=t.category_id) SELECT p.sku FROM product p WHERE p.category_id IN (SELECT category_id FROM tree) AND p.status=true AND p.visibility=true`, [root.category_id])).rows.map(p=>p.sku);
  assert.deepEqual(products.sort(), expected.sort(), 'Fuel Nozzles must contain exactly the 13 source listings');
  await client.query(`INSERT INTO url_rewrite(language,request_path,target_path,entity_uuid,entity_type)
    SELECT 'en','/'||d.url_key,'/category/'||c.uuid,c.uuid,'category' FROM category c JOIN category_description d ON d.category_description_category_id=c.category_id WHERE c.parent_id=$1
    ON CONFLICT(language,entity_uuid) DO NOTHING`, [root.category_id]);
  await client.query(`INSERT INTO url_rewrite(language,request_path,target_path,entity_uuid,entity_type)
    SELECT 'en','/'||d.url_key,'/product/'||p.uuid,p.uuid,'product' FROM product p JOIN product_description d ON d.product_description_product_id=p.product_id WHERE p.sku=ANY($1::text[])
    ON CONFLICT(language,entity_uuid) DO NOTHING`, [additions.map(p=>p.sku)]);
  await client.query('COMMIT');
  console.log(`Fuel Nozzles verified: ${products.length} listings, 6 linked subcategories.`);
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  await client.end();
}
