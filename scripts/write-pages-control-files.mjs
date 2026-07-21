import {copyFile, mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {join, resolve} from 'node:path';


function localePath(locale, slug, includeDocs) {
  const prefix = includeDocs ? `/${locale}/docs` : `/${locale}`;
  return slug === '/' ? `${prefix}/` : `${prefix}${slug}/`;
}


export function buildRedirects(routeManifest) {
  const redirects = ['/zh /zh/ 301', '/en /en/ 301'];

  for (const [locale, slugs] of Object.entries(routeManifest.locales)) {
    for (const slug of slugs) {
      if (slug === '/') continue;
      const from = localePath(locale, slug, false);
      const to = localePath(locale, slug, true);
      redirects.push(`${from.slice(0, -1)} ${to} 301`);
      redirects.push(`${from} ${to} 301`);
    }
  }

  return redirects;
}


export async function writeControlFiles({
  root,
  buildDirectory,
  routeManifestPath,
}) {
  const repositoryRoot = resolve(root);
  const output = resolve(buildDirectory);
  const routeManifest = JSON.parse(
    await readFile(resolve(routeManifestPath), 'utf8'),
  );
  const redirects = buildRedirects(routeManifest);

  await mkdir(output, {recursive: true});
  await writeFile(join(output, '_redirects'), `${redirects.join('\n')}\n`, 'utf8');
  await copyFile(join(repositoryRoot, 'static', '_headers'), join(output, '_headers'));
  await copyFile(
    join(repositoryRoot, 'static', '_routes.json'),
    join(output, '_routes.json'),
  );
}


const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  const root = fileURLToPath(new URL('..', import.meta.url));
  await writeControlFiles({
    root,
    buildDirectory: join(root, 'build'),
    routeManifestPath: join(root, 'data', 'routes', 'legacy-routes.json'),
  });
}
