import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

test('revalidates HTML while keeping fingerprinted assets immutable', async () => {
  const headers = await readFile(new URL('../static/_headers', import.meta.url), {
    encoding: 'utf8',
  });

  assert.doesNotMatch(headers, /max-age=43200/);
  assert.equal(
    headers.match(/Cache-Control: public, max-age=0, must-revalidate/g)?.length,
    4,
  );
  assert.equal(
    headers.match(
      /Cache-Control: public, max-age=31556952, immutable/g,
    )?.length,
    2,
  );
});
