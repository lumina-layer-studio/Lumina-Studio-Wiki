import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { isPolymakerLogoAuthorized } from '../src/components/PolymakerLogo/authorization';

test('the static Wiki checks the authorization at browser render time', () => {
  assert.equal(isPolymakerLogoAuthorized(new Date('2026-11-18T04:58:37Z')), false);
  assert.equal(isPolymakerLogoAuthorized(new Date('2026-11-18T04:58:38Z')), true);
  assert.equal(isPolymakerLogoAuthorized(new Date('2027-11-18T04:58:37Z')), true);
  assert.equal(isPolymakerLogoAuthorized(new Date('2027-11-18T04:58:38Z')), false);
  assert.equal(isPolymakerLogoAuthorized(new Date('invalid')), false);
  const component = readFileSync('src/components/PolymakerLogo/index.tsx', 'utf8');
  assert.match(component, /<BrowserOnly/);
  assert.match(component, /https:\/\/luminastudio\.com\.cn\/logos\/polymaker-teal\.svg/);
});

test('both sponsor pages include the same Panchroma PLA collaboration', () => {
  for (const path of [
    'docs/project/sponsors/sponsors.mdx',
    'i18n/en/docusaurus-plugin-content-docs/current/project/sponsors/sponsors.mdx',
  ]) {
    const source = readFileSync(path, 'utf8');
    const row = source.split('\n').find((line) => line.includes('Panchroma PLA'));
    assert.ok(row, `${path} needs the Panchroma PLA row`);
    assert.match(row, /<PolymakerLogo \/>/);
    assert.match(row, /适配中|In progress/);
    assert.doesNotMatch(row, /已适配|Adapted|CMYK/);
    assert.match(source, /认证或保证|certification or a guarantee/);
  }
});
