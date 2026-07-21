#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { createHash, createPublicKey, verify } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SHA256 = /^[0-9a-f]{64}$/;
const SAFE_ID = /^[a-z0-9][a-z0-9-]{1,79}$/;
const GITHUB_LOGIN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const IMAGE_PATH = /^static\/media\/[a-z0-9][a-z0-9/_-]*\.(?:webp|png|jpe?g)$/i;
const ZH_DOCUMENT = /^docs\/tutorials\/[a-z0-9][a-z0-9/_-]*\.mdx?$/;
const EN_DOCUMENT = /^i18n\/en\/docusaurus-plugin-content-docs\/current\/tutorials\/[a-z0-9][a-z0-9/_-]*\.mdx?$/;
const ALLOWED_RIGHTS = new Set([
  'project-owned',
  'contributor-authorized',
  'permissive-license',
  'third-party-interface',
]);
const ALLOWED_KINDS = new Set(['image', 'video', 'subtitle', 'model', 'project']);
const ALLOWED_VIDEO_HOSTS = {
  youtube: new Set(['youtube.com', 'www.youtube.com', 'youtu.be']),
  bilibili: new Set(['bilibili.com', 'www.bilibili.com']),
};
const PRIVATE_MARKERS = [
  /\/Users\//i,
  /\/Volumes\//i,
  /[A-Za-z]:\\Users\\/i,
  /(?:^|\W)\.ssh(?:[/\\]|$)/i,
  /r2\.cloudflarestorage\.com/i,
  /-----BEGIN .*PRIVATE KEY-----/i,
  /\b(?:AWS_SECRET_ACCESS_KEY|CF_API_TOKEN|CLOUDFLARE_API_TOKEN|R2_SECRET_ACCESS_KEY)\b/i,
];

export class MediaValidationError extends Error {
  constructor(rule, file = undefined) {
    super(file ? `${rule}: ${file}` : rule);
    this.name = 'MediaValidationError';
    this.rule = rule;
    this.file = file;
  }
}

function canonicalValue(value) {
  if (Array.isArray(value)) {
    return value.map(canonicalValue);
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => key !== 'signature')
        .sort()
        .map((key) => [key, canonicalValue(value[key])]),
    );
  }
  return value;
}

export function canonicalize(value) {
  return JSON.stringify(canonicalValue(value));
}

function requireObject(value, rule, file) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new MediaValidationError(rule, file);
  }
  return value;
}

function requireString(value, rule, file) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new MediaValidationError(rule, file);
  }
  return value.trim();
}

function safeRelativePath(value, pattern, rule, file) {
  const candidate = requireString(value, rule, file);
  if (
    candidate.startsWith('/') ||
    candidate.includes('\\') ||
    candidate.split('/').includes('..') ||
    !pattern.test(candidate)
  ) {
    throw new MediaValidationError(rule, file);
  }
  return candidate;
}

function assertPublicSafe(value, file) {
  const serialized = JSON.stringify(value);
  if (PRIVATE_MARKERS.some((pattern) => pattern.test(serialized))) {
    throw new MediaValidationError('private_marker', file);
  }
}

function assertSha256(value, rule, file) {
  const candidate = requireString(value, rule, file);
  if (!SHA256.test(candidate)) {
    throw new MediaValidationError(rule, file);
  }
  return candidate;
}

async function existsAsFile(root, relative) {
  const rootPath = path.resolve(root);
  const target = path.resolve(rootPath, relative);
  if (target !== rootPath && !target.startsWith(`${rootPath}${path.sep}`)) {
    return false;
  }
  try {
    return (await stat(target)).isFile();
  } catch {
    return false;
  }
}

async function fileSha256(root, relative) {
  const data = await readFile(path.resolve(root, relative));
  return createHash('sha256').update(data).digest('hex');
}

function validateRights(rightsValue, file) {
  const rights = requireObject(rightsValue, 'incomplete_rights', file);
  if (!ALLOWED_RIGHTS.has(rights.status)) {
    throw new MediaValidationError('invalid_rights_status', file);
  }
  requireString(rights.author, 'incomplete_rights', file);
  requireString(rights.attribution, 'incomplete_rights', file);
  if (rights.source_url !== undefined) {
    const source = requireString(rights.source_url, 'invalid_rights_source', file);
    let url;
    try {
      url = new URL(source);
    } catch {
      throw new MediaValidationError('invalid_rights_source', file);
    }
    if (url.protocol !== 'https:') {
      throw new MediaValidationError('invalid_rights_source', file);
    }
  }
  if (rights.status === 'permissive-license') {
    requireString(rights.license, 'incomplete_rights', file);
    requireString(rights.source_url, 'incomplete_rights', file);
  }
}

function validateVideoExternal(externalValue, file) {
  const external = requireObject(externalValue, 'invalid_video_url', file);
  const platform = requireString(external.platform, 'invalid_video_url', file);
  const allowedHosts = ALLOWED_VIDEO_HOSTS[platform];
  if (!allowedHosts) {
    throw new MediaValidationError('invalid_video_url', file);
  }
  let url;
  try {
    url = new URL(requireString(external.url, 'invalid_video_url', file));
  } catch {
    throw new MediaValidationError('invalid_video_url', file);
  }
  if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname.toLowerCase())) {
    throw new MediaValidationError('invalid_video_url', file);
  }
}

function validateReceiptShape(receiptValue, manifestFile) {
  const receipt = requireObject(receiptValue, 'invalid_receipt', manifestFile);
  if (receipt.version !== 1) {
    throw new MediaValidationError('unsupported_receipt_version', manifestFile);
  }
  requireString(receipt.key_id, 'invalid_receipt_key', manifestFile);
  if (!UUID.test(receipt.submission_id)) {
    throw new MediaValidationError('invalid_submission_id', manifestFile);
  }
  if (receipt.repository !== 'lumina-layer-studio/Lumina-Studio-Wiki') {
    throw new MediaValidationError('invalid_receipt_repository', manifestFile);
  }
  if (!Number.isSafeInteger(receipt.pull_request) || receipt.pull_request < 1) {
    throw new MediaValidationError('invalid_pull_request', manifestFile);
  }
  if (!GITHUB_LOGIN.test(receipt.contributor_github ?? '')) {
    throw new MediaValidationError('invalid_contributor', manifestFile);
  }
  if (Number.isNaN(Date.parse(receipt.issued_at))) {
    throw new MediaValidationError('invalid_receipt_time', manifestFile);
  }
  if (!Array.isArray(receipt.assets) || receipt.assets.length === 0) {
    throw new MediaValidationError('missing_receipt_assets', manifestFile);
  }
  const logicalIds = new Set();
  for (const assetValue of receipt.assets) {
    const asset = requireObject(assetValue, 'invalid_receipt_asset', manifestFile);
    if (!UUID.test(asset.asset_id ?? '')) {
      throw new MediaValidationError('invalid_asset_id', manifestFile);
    }
    if (!SAFE_ID.test(asset.logical_id ?? '') || logicalIds.has(asset.logical_id)) {
      throw new MediaValidationError('invalid_logical_id', manifestFile);
    }
    logicalIds.add(asset.logical_id);
    if (!ALLOWED_KINDS.has(asset.kind)) {
      throw new MediaValidationError('invalid_asset_kind', manifestFile);
    }
    const filename = requireString(
      asset.original_filename,
      'invalid_original_filename',
      manifestFile,
    );
    if (
      filename.length > 128 ||
      filename.includes('/') ||
      filename.includes('\\') ||
      filename === '.' ||
      filename === '..'
    ) {
      throw new MediaValidationError('invalid_original_filename', manifestFile);
    }
    assertSha256(asset.original_sha256, 'invalid_original_sha256', manifestFile);
    if (!Number.isSafeInteger(asset.original_size) || asset.original_size < 1) {
      throw new MediaValidationError('invalid_original_size', manifestFile);
    }
    requireString(asset.original_media_type, 'invalid_original_media_type', manifestFile);
  }
  requireString(receipt.signature, 'invalid_receipt_signature', manifestFile);
  return receipt;
}

function verifyReceipt(receipt, keys, manifestFile) {
  const key = keys.get(receipt.key_id);
  if (!key) {
    throw new MediaValidationError('unknown_receipt_key', manifestFile);
  }
  let signature;
  try {
    signature = Buffer.from(receipt.signature, 'base64url');
  } catch {
    throw new MediaValidationError('invalid_receipt_signature', manifestFile);
  }
  const valid = verify(
    null,
    Buffer.from(canonicalize(receipt), 'utf8'),
    key,
    signature,
  );
  if (!valid) {
    throw new MediaValidationError('invalid_receipt_signature', manifestFile);
  }
}

export async function validateManifest(manifestValue, options) {
  const { root, manifestPath, keys } = options;
  const manifestFile = manifestPath;
  const manifest = requireObject(manifestValue, 'invalid_manifest', manifestFile);
  assertPublicSafe(manifest, manifestFile);
  if (manifest.schema_version !== 1) {
    throw new MediaValidationError('unsupported_manifest_version', manifestFile);
  }
  if (!SAFE_ID.test(manifest.tutorial_id ?? '')) {
    throw new MediaValidationError('invalid_tutorial_id', manifestFile);
  }

  const documents = requireObject(manifest.documents, 'missing_documents', manifestFile);
  const zh = safeRelativePath(
    documents.zh,
    ZH_DOCUMENT,
    'invalid_document_path',
    manifestFile,
  );
  const en = safeRelativePath(
    documents.en,
    EN_DOCUMENT,
    'invalid_document_path',
    manifestFile,
  );
  for (const document of [zh, en]) {
    if (!(await existsAsFile(root, document))) {
      throw new MediaValidationError('missing_document', manifestFile);
    }
  }
  const zhRelative = zh.slice('docs/tutorials/'.length).replace(/\.mdx?$/u, '');
  const enRelative = en
    .slice('i18n/en/docusaurus-plugin-content-docs/current/tutorials/'.length)
    .replace(/\.mdx?$/u, '');
  if (zhRelative !== enRelative) {
    throw new MediaValidationError('locale_pair_mismatch', manifestFile);
  }

  const contributor = requireObject(
    manifest.contributor,
    'invalid_contributor',
    manifestFile,
  );
  if (!GITHUB_LOGIN.test(contributor.github ?? '')) {
    throw new MediaValidationError('invalid_contributor', manifestFile);
  }
  if (!UUID.test(manifest.submission_id ?? '')) {
    throw new MediaValidationError('invalid_submission_id', manifestFile);
  }

  const receipt = validateReceiptShape(manifest.receipt, manifestFile);
  verifyReceipt(receipt, keys, manifestFile);
  if (
    manifest.submission_id !== receipt.submission_id ||
    contributor.github !== receipt.contributor_github
  ) {
    throw new MediaValidationError('receipt_manifest_mismatch', manifestFile);
  }

  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new MediaValidationError('missing_assets', manifestFile);
  }
  const receiptAssets = new Map(receipt.assets.map((asset) => [asset.logical_id, asset]));
  const manifestIds = new Set();
  const publishedPaths = new Set();
  for (const assetValue of manifest.assets) {
    const asset = requireObject(assetValue, 'invalid_asset', manifestFile);
    if (!SAFE_ID.test(asset.logical_id ?? '') || manifestIds.has(asset.logical_id)) {
      throw new MediaValidationError('invalid_logical_id', manifestFile);
    }
    manifestIds.add(asset.logical_id);
    const receiptAsset = receiptAssets.get(asset.logical_id);
    if (
      !receiptAsset ||
      receiptAsset.kind !== asset.kind ||
      receiptAsset.original_sha256 !== asset.original_sha256
    ) {
      throw new MediaValidationError('receipt_asset_mismatch', manifestFile);
    }
    validateRights(asset.rights, manifestFile);
    requireString(asset.ai_disclosure, 'missing_ai_disclosure', manifestFile);

    if (asset.kind === 'image') {
      const publishedPath = safeRelativePath(
        asset.published_path,
        IMAGE_PATH,
        'invalid_published_path',
        manifestFile,
      );
      const declaredHash = assertSha256(
        asset.published_sha256,
        'invalid_published_sha256',
        manifestFile,
      );
      if (!(await existsAsFile(root, publishedPath))) {
        throw new MediaValidationError('missing_published_asset', manifestFile);
      }
      if ((await fileSha256(root, publishedPath)) !== declaredHash) {
        throw new MediaValidationError('published_hash_mismatch', manifestFile);
      }
      publishedPaths.add(publishedPath);
    } else if (asset.kind === 'video') {
      validateVideoExternal(asset.external, manifestFile);
      if (asset.published_path !== undefined) {
        throw new MediaValidationError('local_video_forbidden', manifestFile);
      }
    } else if (asset.published_path !== undefined || asset.external !== undefined) {
      throw new MediaValidationError('invalid_original_only_asset', manifestFile);
    }
  }
  if (manifestIds.size !== receiptAssets.size) {
    throw new MediaValidationError('receipt_asset_mismatch', manifestFile);
  }
  return { assets: manifest.assets.length, publishedPaths };
}

async function loadLegacyAssets(root) {
  const relative = 'data/media-contributions/legacy-assets.json';
  let raw;
  try {
    raw = JSON.parse(await readFile(path.join(root, relative), 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return new Map();
    throw new MediaValidationError('invalid_legacy_media_registry', relative);
  }
  if (raw?.schema_version !== 1 || raw.assets === null || typeof raw.assets !== 'object') {
    throw new MediaValidationError('invalid_legacy_media_registry', relative);
  }
  const assets = new Map();
  for (const [assetPath, digest] of Object.entries(raw.assets)) {
    const safePath = safeRelativePath(
      assetPath,
      IMAGE_PATH,
      'invalid_legacy_media_registry',
      relative,
    );
    assets.set(safePath, assertSha256(digest, 'invalid_legacy_media_registry', relative));
  }
  return assets;
}

async function validateLegacyRegistryLock(root, baseRef) {
  const relative = 'data/media-contributions/legacy-assets.json';
  let baseText;
  let currentText;
  try {
    const result = await execFileAsync(
      'git',
      ['show', `${baseRef}:${relative}`],
      { cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
    );
    baseText = result.stdout;
    currentText = await readFile(path.join(root, relative), 'utf8');
  } catch {
    try {
      await execFileAsync(
        'git',
        ['cat-file', '-e', `${baseRef}:scripts/media-contributions.mjs`],
        { cwd: root, encoding: 'utf8' },
      );
    } catch {
      return;
    }
    throw new MediaValidationError('legacy_media_registry_unavailable', relative);
  }
  if (baseText !== currentText) {
    throw new MediaValidationError('legacy_media_registry_modified', relative);
  }
}

async function validateChangedMediaPaths(root, baseRef) {
  let output;
  try {
    const result = await execFileAsync(
      'git',
      ['diff', '--name-only', baseRef, '--'],
      { cwd: root, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 },
    );
    output = result.stdout;
  } catch {
    throw new MediaValidationError('changed_media_scan_failed');
  }
  for (const changedPath of output.split('\n').filter(Boolean)) {
    const isImage = /\.(?:gif|jpe?g|png|svg|webp)$/iu.test(changedPath);
    const isDocumentationAsset =
      changedPath.startsWith('static/') ||
      changedPath.startsWith('docs/') ||
      changedPath.startsWith('i18n/');
    if (
      isImage &&
      isDocumentationAsset &&
      !changedPath.startsWith('static/media/')
    ) {
      throw new MediaValidationError('new_media_outside_media_root', changedPath);
    }
  }
}

async function listFiles(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(target)));
    } else if (entry.isFile()) {
      files.push(target);
    }
  }
  return files;
}

async function loadKeyRegistry(root) {
  const directory = path.join(root, 'data/media-keys');
  const keys = new Map();
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return keys;
    throw error;
  }
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.pem')) continue;
    const keyId = entry.name.slice(0, -4);
    const pem = await readFile(path.join(directory, entry.name), 'utf8');
    try {
      keys.set(keyId, createPublicKey(pem));
    } catch {
      throw new MediaValidationError('invalid_public_key', `data/media-keys/${entry.name}`);
    }
  }
  return keys;
}

export async function validateRepository({ root = process.cwd(), legacyBase } = {}) {
  const repositoryRoot = path.resolve(root);
  if (legacyBase !== undefined) {
    const baseRef = requireString(legacyBase, 'invalid_base_ref');
    if (!/^(?:[0-9a-f]{40}|HEAD)$/i.test(baseRef)) {
      throw new MediaValidationError('invalid_base_ref');
    }
    await validateLegacyRegistryLock(repositoryRoot, baseRef);
    await validateChangedMediaPaths(repositoryRoot, baseRef);
  }
  const directory = path.join(repositoryRoot, 'data/media-contributions');
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') {
      entries = [];
    } else {
      throw error;
    }
  }
  const files = entries
    .filter(
      (entry) =>
        entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'legacy-assets.json',
    )
    .map((entry) => entry.name)
    .sort();
  const keys = files.length > 0 ? await loadKeyRegistry(repositoryRoot) : new Map();
  let assets = 0;
  const publishedPaths = new Set();
  for (const name of files) {
    const manifestPath = `data/media-contributions/${name}`;
    let manifest;
    try {
      manifest = JSON.parse(await readFile(path.join(directory, name), 'utf8'));
    } catch {
      throw new MediaValidationError('invalid_manifest_json', manifestPath);
    }
    const result = await validateManifest(manifest, {
      root: repositoryRoot,
      manifestPath,
      keys,
    });
    assets += result.assets;
    for (const publishedPath of result.publishedPaths) {
      publishedPaths.add(publishedPath);
    }
  }

  const legacyAssets = await loadLegacyAssets(repositoryRoot);
  const mediaRoot = path.join(repositoryRoot, 'static/media');
  for (const absolutePath of await listFiles(mediaRoot)) {
    const relative = path.relative(repositoryRoot, absolutePath).split(path.sep).join('/');
    if (publishedPaths.has(relative)) continue;
    const legacyHash = legacyAssets.get(relative);
    if (!legacyHash || (await fileSha256(repositoryRoot, relative)) !== legacyHash) {
      throw new MediaValidationError('unregistered_public_media', relative);
    }
  }
  return { manifests: files.length, assets };
}

async function main() {
  try {
    const args = process.argv.slice(2);
    let legacyBase;
    if (args.length > 0) {
      if (args.length !== 2 || args[0] !== '--base') {
        throw new MediaValidationError('invalid_arguments');
      }
      legacyBase = args[1];
    }
    const result = await validateRepository({ legacyBase });
    console.log(
      `Media contribution validation passed (${result.manifests} manifests, ${result.assets} assets)`,
    );
  } catch (error) {
    if (error instanceof MediaValidationError) {
      console.error(`Media contribution validation failed: ${error.message}`);
      process.exitCode = 1;
      return;
    }
    console.error('Media contribution validation failed: validator_error');
    process.exitCode = 2;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
