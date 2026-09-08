import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

async function copyRoutes(source, destination) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyRoutes(sourcePath, destinationPath);
    } else if (entry.name === 'route.json') {
      await mkdir(dirname(destinationPath), { recursive: true });
      await cp(sourcePath, destinationPath);
      console.log(`Copied ${relative('.', destinationPath)}`);
    }
  }
}

await copyRoutes('extensions/ffs_quote/src', 'extensions/ffs_quote/dist');
await copyRoutes('extensions/ffs_blog/src', 'extensions/ffs_blog/dist');

const themeScss = 'pages/all/ffs.scss';
await mkdir(dirname(join('themes/ffs/dist', themeScss)), { recursive: true });
await cp(join('themes/ffs/src', themeScss), join('themes/ffs/dist', themeScss));
