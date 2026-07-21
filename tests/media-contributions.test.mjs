import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  MediaValidationError,
  canonicalize,
  validateManifest,
  validateRepository,
} from '../scripts/media-contributions.mjs';

const REPOSITORY = 'lumina-layer-studio/Lumina-Studio-Wiki';
const KEY_ID = 'test-v1';

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function webp(chunks = [{ type: 'VP8 ', payload: Buffer.from([0]) }]) {
  const body = [Buffer.from('WEBP')];
  for (const chunk of chunks) {
    const size = Buffer.alloc(4);
    size.writeUInt32LE(chunk.payload.length);
    body.push(Buffer.from(chunk.type), size, chunk.payload);
    if (chunk.payload.length % 2 === 1) body.push(Buffer.from([0]));
  }
  const payload = Buffer.concat(body);
  const riffSize = Buffer.alloc(4);
  riffSize.writeUInt32LE(payload.length);
  return Buffer.concat([Buffer.from('RIFF'), riffSize, payload]);
}

function fixtureKeys() {
  return generateKeyPairSync('ed25519');
}

function signedReceipt(privateKey, overrides = {}) {
  const receipt = {
    version: 1,
    key_id: KEY_ID,
    submission_id: '018f53c2-97ce-7d44-aea0-9cb662f92fc8',
    repository: REPOSITORY,
    pull_request: 42,
    contributor_github: 'example-user',
    issued_at: '2026-07-21T10:00:00Z',
    assets: [
      {
        asset_id: '018f53c2-b4da-7df5-947e-5a7e5066124b',
        logical_id: 'result-photo',
        kind: 'image',
        original_filename: 'result-photo.jpg',
        original_sha256: sha256('original image'),
        original_size: 14,
        original_media_type: 'image/jpeg',
      },
    ],
    ...overrides,
  };
  receipt.signature = sign(
    null,
    Buffer.from(canonicalize(receipt), 'utf8'),
    privateKey,
  ).toString('base64url');
  return receipt;
}

function imageManifest(privateKey, publicImage, overrides = {}) {
  const receipt = signedReceipt(privateKey);
  return {
    schema_version: 1,
    tutorial_id: 'sample-workflow',
    documents: {
      zh: 'docs/tutorials/sample-workflow.md',
      en: 'i18n/en/docusaurus-plugin-content-docs/current/tutorials/sample-workflow.md',
    },
    contributor: {
      github: 'example-user',
      display_name: 'Example User',
    },
    submission_id: receipt.submission_id,
    receipt,
    assets: [
      {
        logical_id: 'result-photo',
        kind: 'image',
        original_sha256: receipt.assets[0].original_sha256,
        published_path: 'static/media/sample-workflow/result-photo.webp',
        published_sha256: sha256(publicImage),
        rights: {
          status: 'contributor-authorized',
          author: 'Example User',
          attribution: 'Photo provided by Example User.',
        },
        ai_disclosure: 'none',
      },
    ],
    ...overrides,
  };
}

async function makeRepository() {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-media-test-'));
  const publicImage = webp();
  const zh = path.join(root, 'docs/tutorials/sample-workflow.md');
  const en = path.join(
    root,
    'i18n/en/docusaurus-plugin-content-docs/current/tutorials/sample-workflow.md',
  );
  const image = path.join(root, 'static/media/sample-workflow/result-photo.webp');
  await mkdir(path.dirname(zh), { recursive: true });
  await mkdir(path.dirname(en), { recursive: true });
  await mkdir(path.dirname(image), { recursive: true });
  await writeFile(zh, '# 中文教程\n');
  await writeFile(en, '# English tutorial\n');
  await writeFile(image, publicImage);
  return { root, publicImage };
}

async function expectRule(promise, rule) {
  await assert.rejects(
    promise,
    (error) => error instanceof MediaValidationError && error.rule === rule,
  );
}

test('canonicalize recursively sorts keys and omits only receipt signature', () => {
  const value = {
    z: 1,
    signature: 'not-signed',
    nested: { z: 2, a: 1 },
    a: [{ y: 2, x: 1 }],
  };

  assert.equal(
    canonicalize(value),
    '{"a":[{"x":1,"y":2}],"nested":{"a":1,"z":2},"z":1}',
  );
});

test('accepts a signed bilingual image contribution', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const manifest = imageManifest(privateKey, publicImage);

  await validateManifest(manifest, {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  });
});

test('treats GitHub login casing as equivalent', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const manifest = imageManifest(privateKey, publicImage);
  manifest.contributor.github = 'Example-User';

  await validateManifest(manifest, {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  });
});

test('rejects disguised images and embedded identifying metadata', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root } = await makeRepository();
  const imagePath = path.join(
    root,
    'static/media/sample-workflow/result-photo.webp',
  );
  const options = {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  };

  const disguised = Buffer.from('not a web image');
  await writeFile(imagePath, disguised);
  await expectRule(
    validateManifest(imageManifest(privateKey, disguised), options),
    'published_type_mismatch',
  );

  const withExif = webp([
    { type: 'VP8 ', payload: Buffer.from([0]) },
    { type: 'EXIF', payload: Buffer.from('device and location') },
  ]);
  await writeFile(imagePath, withExif);
  await expectRule(
    validateManifest(imageManifest(privateKey, withExif), options),
    'published_metadata_forbidden',
  );
});

test('accepts an external video while rejecting local video payloads', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root } = await makeRepository();
  const receipt = signedReceipt(privateKey, {
    assets: [
      {
        asset_id: '018f53c2-b4da-7df5-947e-5a7e5066124b',
        logical_id: 'walkthrough-video',
        kind: 'video',
        original_filename: 'walkthrough-video.mp4',
        original_sha256: sha256('video master'),
        original_size: 12,
        original_media_type: 'video/mp4',
      },
    ],
  });
  const manifest = {
    schema_version: 1,
    tutorial_id: 'sample-workflow',
    documents: {
      zh: 'docs/tutorials/sample-workflow.md',
      en: 'i18n/en/docusaurus-plugin-content-docs/current/tutorials/sample-workflow.md',
    },
    contributor: { github: 'example-user' },
    submission_id: receipt.submission_id,
    receipt,
    assets: [
      {
        logical_id: 'walkthrough-video',
        kind: 'video',
        original_sha256: receipt.assets[0].original_sha256,
        external: {
          platform: 'youtube',
          url: 'https://www.youtube.com/watch?v=abc123',
        },
        rights: {
          status: 'project-owned',
          author: 'Lumina Studio',
          attribution: 'Lumina Studio tutorial video.',
        },
        ai_disclosure: 'AI-assisted translation; manually reviewed.',
      },
    ],
  };

  await validateManifest(manifest, {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  });

  manifest.assets[0].external.url = 'static/media/sample-workflow/tutorial.mp4';
  await expectRule(
    validateManifest(manifest, {
      root,
      manifestPath: 'data/media-contributions/sample-workflow.json',
      keys: new Map([[KEY_ID, publicKey]]),
    }),
    'invalid_video_url',
  );
});

test('rejects receipt tampering and unknown signing keys', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const manifest = imageManifest(privateKey, publicImage);
  manifest.receipt.contributor_github = 'another-user';

  await expectRule(
    validateManifest(manifest, {
      root,
      manifestPath: 'data/media-contributions/sample-workflow.json',
      keys: new Map([[KEY_ID, publicKey]]),
    }),
    'invalid_receipt_signature',
  );

  manifest.receipt.key_id = 'unknown-key';
  await expectRule(
    validateManifest(manifest, {
      root,
      manifestPath: 'data/media-contributions/sample-workflow.json',
      keys: new Map([[KEY_ID, publicKey]]),
    }),
    'unknown_receipt_key',
  );
});

test('rejects unsafe paths, missing locale peers, and wrong public hashes', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const options = {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  };

  const unsafe = imageManifest(privateKey, publicImage);
  unsafe.assets[0].published_path = '../private/result.webp';
  await expectRule(validateManifest(unsafe, options), 'invalid_published_path');

  const missingPeer = imageManifest(privateKey, publicImage);
  missingPeer.documents.en = 'i18n/en/docusaurus-plugin-content-docs/current/tutorials/missing.md';
  await expectRule(validateManifest(missingPeer, options), 'missing_document');

  const unrelatedEnPath = path.join(
    root,
    'i18n/en/docusaurus-plugin-content-docs/current/tutorials/unrelated.md',
  );
  await writeFile(unrelatedEnPath, '# Unrelated tutorial\n');
  const unrelatedPeer = imageManifest(privateKey, publicImage);
  unrelatedPeer.documents.en =
    'i18n/en/docusaurus-plugin-content-docs/current/tutorials/unrelated.md';
  await expectRule(validateManifest(unrelatedPeer, options), 'locale_pair_mismatch');

  const wrongHash = imageManifest(privateKey, publicImage);
  wrongHash.assets[0].published_sha256 = '0'.repeat(64);
  await expectRule(validateManifest(wrongHash, options), 'published_hash_mismatch');
});

test('rejects incomplete rights and unsupported video hosts', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const options = {
    root,
    manifestPath: 'data/media-contributions/sample-workflow.json',
    keys: new Map([[KEY_ID, publicKey]]),
  };

  const missingRights = imageManifest(privateKey, publicImage);
  delete missingRights.assets[0].rights.author;
  await expectRule(validateManifest(missingRights, options), 'incomplete_rights');

  const badStatus = imageManifest(privateKey, publicImage);
  badStatus.assets[0].rights.status = 'found-online';
  await expectRule(validateManifest(badStatus, options), 'invalid_rights_status');
});

test('rejects public manifests containing internal-style locations', async () => {
  const { privateKey, publicKey } = fixtureKeys();
  const { root, publicImage } = await makeRepository();
  const manifest = imageManifest(privateKey, publicImage);
  manifest.assets[0].rights.attribution = ['/', 'Users', '/example/archive'].join('');

  await expectRule(
    validateManifest(manifest, {
      root,
      manifestPath: 'data/media-contributions/sample-workflow.json',
      keys: new Map([[KEY_ID, publicKey]]),
    }),
    'private_marker',
  );
});

test('repository validation succeeds with no contribution manifests', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-empty-media-test-'));
  await mkdir(path.join(root, 'data/media-contributions'), { recursive: true });

  const result = await validateRepository({ root });

  assert.deepEqual(result, { manifests: 0, assets: 0 });
});

test('repository validation rejects unregistered new public media', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-unregistered-media-test-'));
  const media = path.join(root, 'static/media/new-image.webp');
  await mkdir(path.dirname(media), { recursive: true });
  await writeFile(media, 'new public image');

  await expectRule(validateRepository({ root }), 'unregistered_public_media');
});

test('repository validation accepts unchanged legacy media registry entries', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-legacy-media-test-'));
  const media = path.join(root, 'static/media/legacy-image.webp');
  const registry = path.join(root, 'data/media-contributions/legacy-assets.json');
  await mkdir(path.dirname(media), { recursive: true });
  await mkdir(path.dirname(registry), { recursive: true });
  await writeFile(media, 'legacy public image');
  await writeFile(
    registry,
    JSON.stringify({
      schema_version: 1,
      assets: {
        'static/media/legacy-image.webp': sha256('legacy public image'),
      },
    }),
  );

  const result = await validateRepository({ root });

  assert.deepEqual(result, { manifests: 0, assets: 0 });
});

test('pull request validation rejects changes to the legacy registry', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-legacy-lock-test-'));
  const registry = path.join(root, 'data/media-contributions/legacy-assets.json');
  const validator = path.join(root, 'scripts/media-contributions.mjs');
  await mkdir(path.dirname(registry), { recursive: true });
  await mkdir(path.dirname(validator), { recursive: true });
  await writeFile(registry, JSON.stringify({ schema_version: 1, assets: {} }));
  await writeFile(validator, '// established media contract\n');
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'base'],
    { cwd: root },
  );
  await writeFile(
    registry,
    JSON.stringify({
      schema_version: 1,
      assets: { 'static/media/added.webp': '0'.repeat(64) },
    }),
  );

  await expectRule(
    validateRepository({ root, legacyBase: 'HEAD' }),
    'legacy_media_registry_modified',
  );
});

test('legacy registry may be introduced with the media contract', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-legacy-bootstrap-test-'));
  const registry = path.join(root, 'data/media-contributions/legacy-assets.json');
  await mkdir(path.dirname(registry), { recursive: true });
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
  await writeFile(path.join(root, 'README.md'), 'base\n');
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'base'],
    { cwd: root },
  );
  await writeFile(registry, JSON.stringify({ schema_version: 1, assets: {} }));

  const result = await validateRepository({ root, legacyBase: 'HEAD' });

  assert.deepEqual(result, { manifests: 0, assets: 0 });
});

test('pull request validation rejects new tutorial images outside static media', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lumina-media-root-test-'));
  const registry = path.join(root, 'data/media-contributions/legacy-assets.json');
  const validator = path.join(root, 'scripts/media-contributions.mjs');
  await mkdir(path.dirname(registry), { recursive: true });
  await mkdir(path.dirname(validator), { recursive: true });
  await writeFile(registry, JSON.stringify({ schema_version: 1, assets: {} }));
  await writeFile(validator, '// established media contract\n');
  execFileSync('git', ['init', '-q', '-b', 'main'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', 'base'],
    { cwd: root },
  );
  const bypass = path.join(root, 'static/img/new-tutorial-image.png');
  await mkdir(path.dirname(bypass), { recursive: true });
  await writeFile(bypass, 'image');
  execFileSync('git', ['add', '.'], { cwd: root });

  await expectRule(
    validateRepository({ root, legacyBase: 'HEAD' }),
    'new_media_outside_media_root',
  );
});
