import {createHash} from 'node:crypto';
import {readFileSync, readdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  buildDocument, extractBlocks, normalizeBlock, parseDocument, readMiddleware, writeMiddleware,
  type MiddlewareDocument,
} from '@neko_vecter/i18n-toolkit';

const digest = (source: string): string => createHash('sha256').update(source).digest('hex');

/** Check the upstream AST catalogue before any English output is overwritten. */
export function validateCatalogue(source: string, catalogue: MiddlewareDocument, file: string): string {
  if (catalogue.metadata.reviewed_source !== digest(source)) {
    throw new Error(`${file}: source changed; review its TOML translations, then run yarn i18n:review ${file}`);
  }
  const blocks = extractBlocks(parseDocument(source));
  const expected = blocks.map(({key, type, composite}) => [key, type, composite]);
  const actual = catalogue.blocks.map(({key, type, composite}) => [key, type, composite === true]);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error(`${file}: missing or stale blocks; run yarn i18n:extract first`);
  }
  if (blocks.some((block, index) => normalizeBlock(block.template ?? block.origin) !== normalizeBlock(catalogue.blocks[index].origin))) {
    throw new Error(`${file}: block origin differs from source; run yarn i18n:extract, do not edit origin`);
  }
  const rendered = buildDocument(source, {middleware: catalogue});
  parseDocument(rendered, file);
  return rendered;
}

/** A translator explicitly records that the current source has been reviewed. */
export function reviewCatalogue(source: string, catalogue: MiddlewareDocument): MiddlewareDocument {
  const reviewed = {...catalogue, metadata: {...catalogue.metadata, reviewed_source: digest(source)}};
  validateCatalogue(source, reviewed, 'document');
  return reviewed;
}

function main(): void {
  const [command, ...inputs] = process.argv.slice(2);
  if (!['check', 'validate', 'review'].includes(command)) throw new Error('Expected check, validate, or review');
  if (command === 'review' && inputs.length === 0) throw new Error('Review requires explicit docs/file.mdx paths');
  const files = inputs.length ? inputs : readdirSync('docs', {recursive: true, encoding: 'utf8'})
    .filter((file) => /\.mdx?$/.test(file)).sort().map((file) => path.join('docs', file));
  const prepared = files.map((file) => {
    const relative = path.relative(path.resolve('docs'), path.resolve(file));
    if (relative.startsWith('..') || path.isAbsolute(relative) || !/\.mdx?$/.test(relative)) {
      throw new Error(`Expected a Markdown document under docs/: ${file}`);
    }
    const output = path.join('i18n/en/docusaurus-plugin-content-docs/current', relative);
    const middlewarePath = output.replace(/\.mdx?$/, '.toml');
    const source = readFileSync(file, 'utf8');
    const existing = readMiddleware(middlewarePath);
    if (!('blocks' in existing)) throw new Error(`${middlewarePath}: expected an AST block catalogue`);
    const catalogue = command === 'review' ? reviewCatalogue(source, existing) : existing;
    const rendered = validateCatalogue(source, catalogue, file);
    if (command === 'check' && rendered !== readFileSync(output, 'utf8')) {
      throw new Error(`${output}: differs from its TOML; run yarn i18n:build (edit TOML, not generated MDX)`);
    }
    return {middlewarePath, catalogue};
  });
  // Preflight every selected page before writing any review stamps.
  if (command === 'review') for (const item of prepared) writeMiddleware(item.middlewarePath, item.catalogue);
  console.log(`i18n ${command}: ${prepared.length} English documents verified`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
