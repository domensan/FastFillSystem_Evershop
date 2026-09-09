import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

async function copyMatching(source, destination, isMatch) {
  for (const entry of await readdir(source, { withFileTypes: true })) {
    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyMatching(sourcePath, destinationPath, isMatch);
    } else if (isMatch(entry.name)) {
      await mkdir(dirname(destinationPath), { recursive: true });
      await cp(sourcePath, destinationPath);
      console.log(`Copied ${relative('.', destinationPath)}`);
    }
  }
}

const isRouteFile = (name) => name === 'route.json';
const isScssFile = (name) => name.endsWith('.scss');

await copyMatching('extensions/ffs_quote/src', 'extensions/ffs_quote/dist', isRouteFile);
await copyMatching('extensions/ffs_blog/src', 'extensions/ffs_blog/dist', isRouteFile);

await copyMatching('themes/ffs/src', 'themes/ffs/dist', isScssFile);
