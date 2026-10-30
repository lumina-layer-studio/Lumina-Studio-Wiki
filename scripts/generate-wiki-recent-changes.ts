import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
// Keep historical document routes consistent with the pinned docs plugin.
import getDocSlug from '@docusaurus/plugin-content-docs/lib/slug.js';
import {
  DefaultNumberPrefixParser,
  stripPathNumberPrefixes,
} from '@docusaurus/plugin-content-docs/lib/numberPrefix.js';
import type {DocFrontMatter} from '@docusaurus/plugin-content-docs';
import {DocFrontMatterSchema} from '@docusaurus/plugin-content-docs/lib/frontMatter.js';
import {parseMarkdownContentTitle} from '@docusaurus/utils';
import {parseFileContentFrontMatter} from '@docusaurus/utils/lib/markdownUtils.js';

export type RecentChangeAction = 'added' | 'updated' | 'moved' | 'removed';

export interface LocalizedPage {
  title: string;
  url?: string;
}

export interface RecentChangePage {
  action: RecentChangeAction;
  zh?: LocalizedPage;
  en?: LocalizedPage;
}

export interface RecentChangeEntry {
  timestamp: string;
  pages: RecentChangePage[];
}

export interface GenerateOptions {
  repoRoot: string;
  baseline: string;
  head?: string;
  outputFile?: string;
}

type Locale = 'zh' | 'en';
type GitStatus = 'A' | 'M' | 'D' | 'R';

interface GitChange {
  status: GitStatus;
  oldPath?: string;
  path: string;
}

interface PageMetadata {
  locale: Locale;
  docId: string;
  sourcePath: string;
  relativePath: string;
  title: string;
  slug: string;
  url?: string;
}

interface VisibilityContext {
  head: string;
  hiddenPaths: Map<string, boolean>;
  metadata: Map<string, PageMetadata | null>;
  indexes: Map<string, Map<string, PageMetadata>>;
}

const CHINESE_ROOT = 'docs/';
const ENGLISH_ROOT =
  'i18n/en/docusaurus-plugin-content-docs/current/';
const PUBLIC_ROOTS = [CHINESE_ROOT, ENGLISH_ROOT] as const;
const DOCUMENT_PATTERN = /\.mdx?$/;
const DEFAULT_BASELINE = 'df344dccf3edb046f91110e2564145f1822d0428';
const DEFAULT_OUTPUT = 'src/generated/wikiRecentChanges.ts';

function runGit(repoRoot: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function hasCommit(repoRoot: string, commit: string): boolean {
  try {
    runGit(repoRoot, ['cat-file', '-e', `${commit}^{commit}`]);
    return true;
  } catch {
    return false;
  }
}

function recoverShallowHistory(repoRoot: string): void {
  const isShallow =
    runGit(repoRoot, ['rev-parse', '--is-shallow-repository']).trim() ===
    'true';
  if (!isShallow) return;

  runGit(repoRoot, ['fetch', '--quiet', '--unshallow', 'origin']);
}

function localeRoot(filePath: string): {locale: Locale; root: string} | undefined {
  if (filePath.startsWith(CHINESE_ROOT)) {
    return {locale: 'zh', root: CHINESE_ROOT};
  }
  if (filePath.startsWith(ENGLISH_ROOT)) {
    return {locale: 'en', root: ENGLISH_ROOT};
  }
  return undefined;
}

export function isPublicDocumentPath(filePath: string): boolean {
  const location = localeRoot(filePath);
  return (
    location !== undefined &&
    DOCUMENT_PATTERN.test(filePath) &&
    !filePath.slice(location.root.length).split('/').some((part) => part.startsWith('_'))
  );
}

function parseNullDelimitedChanges(output: string): GitChange[] {
  const fields = output.split('\0').filter(Boolean);
  const changes: GitChange[] = [];

  for (let index = 0; index < fields.length; ) {
    const rawStatus = fields[index++];
    if (!rawStatus) break;

    if (rawStatus.startsWith('R')) {
      const oldPath = fields[index++];
      const newPath = fields[index++];
      if (oldPath && newPath) {
        changes.push({status: 'R', oldPath, path: newPath});
      }
      continue;
    }

    const filePath = fields[index++];
    const status = rawStatus[0] as GitStatus | undefined;
    if (filePath && status && ['A', 'M', 'D'].includes(status)) {
      changes.push({status, path: filePath});
    }
  }

  return changes;
}

function readFileAtCommit(
  repoRoot: string,
  commit: string,
  filePath: string,
): string | undefined {
  try {
    return runGit(repoRoot, ['show', `${commit}:${filePath}`]);
  } catch {
    return undefined;
  }
}

function normalizeSlug(slug: string): string {
  const withLeadingSlash = slug.startsWith('/') ? slug : `/${slug}`;
  if (withLeadingSlash === '/') return '/';
  return withLeadingSlash.replace(/\/+$/, '');
}

function publicUrl(locale: Locale, slug: string): string {
  const normalized = normalizeSlug(slug);
  const localeBase = locale === 'en' ? '/en' : '/zh';
  return normalized === '/'
    ? `${localeBase}/docs/`
    : `${localeBase}/docs${normalized}/`;
}

function parseDocument(source: string): {
  frontMatter: DocFrontMatter;
  content: string;
} | undefined {
  try {
    const parsed = parseFileContentFrontMatter(source);
    // Apply Docusaurus' schema without logging historical front matter on error.
    const {value, error} = DocFrontMatterSchema.validate(parsed.frontMatter, {
      convert: true,
      allowUnknown: true,
      abortEarly: false,
    });
    return error ? undefined : {...parsed, frontMatter: value};
  } catch {
    // A historical revision may have invalid metadata even if HEAD is valid.
    return undefined;
  }
}

function isHiddenAtHead(
  repoRoot: string,
  filePath: string,
  visibility: VisibilityContext,
): boolean {
  const cached = visibility.hiddenPaths.get(filePath);
  if (cached !== undefined) return cached;
  const current = readFileAtCommit(repoRoot, visibility.head, filePath);
  const parsed = current ? parseDocument(current) : undefined;
  const hidden = current !== undefined &&
    (!parsed || parsed.frontMatter.draft === true || parsed.frontMatter.unlisted === true);
  visibility.hiddenPaths.set(filePath, hidden);
  return hidden;
}

function metadataFromDocument(
  repoRoot: string,
  commit: string,
  filePath: string,
  linkable: boolean,
  visibility: VisibilityContext,
): PageMetadata | undefined {
  const location = localeRoot(filePath);
  if (!location || !isPublicDocumentPath(filePath)) return undefined;
  const cacheKey = `${commit}\0${filePath}`;
  if (visibility.metadata.has(cacheKey)) {
    const cached = visibility.metadata.get(cacheKey);
    return cached ? {...cached, ...(linkable ? {} : {url: undefined})} : undefined;
  }
  const source = readFileAtCommit(repoRoot, commit, filePath);
  const parsed = source ? parseDocument(source) : undefined;
  if (!parsed || parsed.frontMatter.draft || parsed.frontMatter.unlisted ||
      isHiddenAtHead(repoRoot, filePath, visibility)) {
    visibility.metadata.set(cacheKey, null);
    return undefined;
  }
  const {frontMatter, content} = parsed;
  const docPath = filePath.slice(location.root.length);
  const sourceDirName = path.posix.dirname(docPath);
  const filename = path.posix.parse(docPath).name;
  const parseNumberPrefixes = frontMatter.parse_number_prefixes ?? true;
  const baseID = frontMatter.id ??
    (parseNumberPrefixes ? DefaultNumberPrefixParser(filename).filename : filename);
  const directoryId = sourceDirName === '.' ? undefined :
    parseNumberPrefixes
      ? stripPathNumberPrefixes(sourceDirName, DefaultNumberPrefixParser)
      : sourceDirName;
  const docId = [directoryId, baseID].filter(Boolean).join('/');
  const title = frontMatter.title ?? parseMarkdownContentTitle(content).contentTitle ?? baseID;
  let normalizedSlug: string;
  try {
    normalizedSlug = normalizeSlug(getDocSlug({
      baseID,
      frontMatterSlug: frontMatter.slug,
      source: docPath,
      sourceDirName,
      stripDirNumberPrefixes: parseNumberPrefixes,
    }));
  } catch {
    visibility.metadata.set(cacheKey, null);
    return undefined;
  }
  const metadata: PageMetadata = {
    locale: location.locale,
    docId,
    sourcePath: filePath,
    relativePath: docPath,
    title,
    slug: normalizedSlug,
    url: publicUrl(location.locale, normalizedSlug),
  };
  visibility.metadata.set(cacheKey, metadata);
  return linkable ? metadata : {...metadata, url: undefined};
}

function directDocumentsAt(
  repoRoot: string,
  commit: string,
  directory: string,
): string[] {
  let output: string;
  try {
    output = runGit(repoRoot, [
      'ls-tree',
      '-r',
      '-z',
      '--name-only',
      commit,
      '--',
      directory,
    ]);
  } catch {
    return [];
  }

  return output
    .split('\0')
    .filter(
      (candidate) =>
        isPublicDocumentPath(candidate) &&
        path.posix.dirname(candidate) === directory,
    );
}

function metadataByIdAt(
  repoRoot: string,
  commit: string,
  locale: Locale,
  docId: string,
  visibility: VisibilityContext,
): PageMetadata | undefined {
  const cacheKey = `${commit}\0${locale}`;
  const cached = visibility.indexes.get(cacheKey);
  if (cached) return cached.get(docId);
  const root = locale === 'zh' ? CHINESE_ROOT : ENGLISH_ROOT;
  let output: string;
  try {
    output = runGit(repoRoot, [
      'ls-tree',
      '-r',
      '-z',
      '--name-only',
      commit,
      '--',
      root,
    ]);
  } catch {
    return undefined;
  }

  const index = new Map<string, PageMetadata>();
  for (const candidate of output.split('\0')) {
    if (!isPublicDocumentPath(candidate)) continue;
    const metadata = metadataFromDocument(
      repoRoot,
      commit,
      candidate,
      true,
      visibility,
    );
    if (metadata?.locale === locale) index.set(metadata.docId, metadata);
  }
  visibility.indexes.set(cacheKey, index);
  return index.get(docId);
}

function correspondingMetadataAt(
  repoRoot: string,
  commit: string,
  locale: Locale,
  paths: Set<string>,
  ids: Set<string>,
  slugs: Set<string>,
  visibility: VisibilityContext,
): PageMetadata | undefined {
  // Populate once, then match the translated source path before legacy IDs.
  metadataByIdAt(repoRoot, commit, locale, ids.values().next().value ?? '', visibility);
  const index = visibility.indexes.get(`${commit}\0${locale}`);
  if (!index) return undefined;
  const candidates = [...index.values()];
  return candidates.find((metadata) => paths.has(metadata.relativePath)) ??
    candidates.find((metadata) => ids.has(metadata.docId)) ??
    candidates.find((metadata) => slugs.has(metadata.slug));
}

function owningDocumentAt(
  repoRoot: string,
  commit: string,
  assetPath: string,
): string | undefined {
  const location = localeRoot(assetPath);
  if (!location) return undefined;

  let directory = path.posix.dirname(assetPath);
  const rootDirectory = location.root.replace(/\/$/, '');
  while (
    directory === rootDirectory ||
    directory.startsWith(`${rootDirectory}/`)
  ) {
    const candidates = directDocumentsAt(repoRoot, commit, directory);
    if (candidates.length > 0) {
      const directoryName = path.posix.basename(directory);
      return (
        candidates.find(
          (candidate) =>
            path.posix.basename(candidate).replace(DOCUMENT_PATTERN, '') ===
            directoryName,
        ) ??
        candidates.find((candidate) =>
          /^index\.mdx?$/i.test(path.posix.basename(candidate)),
        ) ??
        (candidates.length === 1 ? candidates[0] : undefined)
      );
    }

    if (directory === rootDirectory) break;
    directory = path.posix.dirname(directory);
  }
  return undefined;
}

function actionForStatus(status: GitStatus, documentChanged: boolean): RecentChangeAction {
  if (!documentChanged) return 'updated';
  if (status === 'A') return 'added';
  if (status === 'D') return 'removed';
  if (status === 'R') return 'moved';
  return 'updated';
}

const ACTION_PRIORITY: Record<RecentChangeAction, number> = {
  updated: 0,
  added: 1,
  moved: 2,
  removed: 3,
};

function strongerAction(
  current: RecentChangeAction | undefined,
  candidate: RecentChangeAction,
): RecentChangeAction {
  if (!current) return candidate;
  return ACTION_PRIORITY[candidate] > ACTION_PRIORITY[current]
    ? candidate
    : current;
}

function changeMetadata(
  repoRoot: string,
  commit: string,
  change: GitChange,
  visibility: VisibilityContext,
): {metadata: PageMetadata; action: RecentChangeAction} | undefined {
  const documentChanged = isPublicDocumentPath(change.path);
  const sourceCommit = change.status === 'D' ? `${commit}^` : commit;
  const sourcePath = documentChanged
    ? change.path
    : owningDocumentAt(repoRoot, sourceCommit, change.path);
  if (!sourcePath) return undefined;

  const action = actionForStatus(change.status, documentChanged);
  const metadata = metadataFromDocument(
    repoRoot,
    sourceCommit,
    sourcePath,
    action !== 'removed',
    visibility,
  );
  return metadata ? {metadata, action} : undefined;
}

function pageSortKey(pageChange: RecentChangePage): string {
  const localeCount = Number(Boolean(pageChange.zh)) + Number(Boolean(pageChange.en));
  const page = pageChange.zh ?? pageChange.en;
  return `${2 - localeCount}:${page?.url ?? page?.title ?? ''}`;
}

function localizedChange(
  repoRoot: string,
  metadata: PageMetadata,
  action: RecentChangeAction,
  visibility: VisibilityContext,
): LocalizedPage {
  const current = metadataFromDocument(
    repoRoot,
    visibility.head,
    metadata.sourcePath,
    true,
    visibility,
  );
  // A vanished document may have been renamed and made unlisted; Git cannot
  // reliably identify a rename when its content was rewritten at the same time.
  const title = current
    ? current.title
    : metadata.locale === 'zh' ? '已不可用的文档' : 'Unavailable document';
  return {
    title,
    ...(action !== 'removed' && current?.url ? {url: current.url} : {}),
  };
}

function changesForCommit(
  repoRoot: string,
  commit: string,
  visibility: VisibilityContext,
): RecentChangePage[] {
  const diff = runGit(repoRoot, [
    'diff-tree',
    '--no-commit-id',
    '--name-status',
    '-r',
    '-M',
    '-z',
    commit,
    '--',
    ...PUBLIC_ROOTS,
  ]);
  const grouped = new Map<
    string,
    {action?: RecentChangeAction; zh?: LocalizedPage; en?: LocalizedPage; paths: Set<string>; ids: Set<string>; slugs: Set<string>}
  >();
  const groupsByPath = new Map<string, string>();
  const groupsById = new Map<string, string>();
  const groupsBySlug = new Map<string, string>();

  for (const change of parseNullDelimitedChanges(diff)) {
    const resolved = changeMetadata(repoRoot, commit, change, visibility);
    if (!resolved) continue;

    const {metadata, action} = resolved;
    const logicalKey = groupsByPath.get(metadata.relativePath) ??
      groupsById.get(metadata.docId) ??
      groupsBySlug.get(metadata.slug) ??
      `${metadata.locale}:${metadata.relativePath}`;
    const existing = grouped.get(logicalKey) ?? {
      paths: new Set<string>(), ids: new Set<string>(), slugs: new Set<string>(),
    };
    existing.action = strongerAction(existing.action, action);
    existing[metadata.locale] = localizedChange(repoRoot, metadata, action, visibility);
    existing.paths.add(metadata.relativePath);
    existing.ids.add(metadata.docId);
    existing.slugs.add(metadata.slug);
    grouped.set(logicalKey, existing);
    groupsByPath.set(metadata.relativePath, logicalKey);
    groupsById.set(metadata.docId, logicalKey);
    groupsBySlug.set(metadata.slug, logicalKey);
  }

  for (const pageChange of grouped.values()) {
    const lookupCommit =
      pageChange.action === 'removed' ? `${commit}^` : commit;
    for (const locale of ['zh', 'en'] as const) {
      if (pageChange[locale]) continue;
      const metadata = correspondingMetadataAt(
        repoRoot,
        lookupCommit,
        locale,
        pageChange.paths,
        pageChange.ids,
        pageChange.slugs,
        visibility,
      );
      if (metadata) {
        pageChange[locale] = localizedChange(
          repoRoot,
          metadata,
          pageChange.action ?? 'updated',
          visibility,
        );
      }
    }
  }

  return [...grouped.values()]
    .filter(
      (
        pageChange,
      ): pageChange is {
        action: RecentChangeAction;
        zh?: LocalizedPage;
        en?: LocalizedPage;
        paths: Set<string>;
        ids: Set<string>;
        slugs: Set<string>;
      } => pageChange.action !== undefined,
    )
    .map(({action, zh, en}) => ({
      action,
      ...(zh ? {zh} : {}),
      ...(en ? {en} : {}),
    }))
    .sort((left, right) => pageSortKey(left).localeCompare(pageSortKey(right)));
}

function generatedModule(entries: RecentChangeEntry[]): string {
  const serialized = JSON.stringify(entries, null, 2).replace(/</g, '\\u003c');
  return `// Generated by scripts/generate-wiki-recent-changes.ts.
// Do not edit this file directly.

export type WikiRecentChangeAction =
  | 'added'
  | 'updated'
  | 'moved'
  | 'removed';

export interface WikiRecentChangePage {
  action: WikiRecentChangeAction;
  zh?: {title: string; url?: string};
  en?: {title: string; url?: string};
}

export interface WikiRecentChangeEntry {
  timestamp: string;
  pages: WikiRecentChangePage[];
}

const wikiRecentChanges: WikiRecentChangeEntry[] = ${serialized};

export default wikiRecentChanges;
`;
}

export function generateRecentChanges({
  repoRoot,
  baseline,
  head = 'HEAD',
  outputFile,
}: GenerateOptions): RecentChangeEntry[] {
  if (!hasCommit(repoRoot, baseline)) {
    try {
      recoverShallowHistory(repoRoot);
    } catch {
      // The actionable baseline error below is clearer than transport details.
    }
  }

  if (!hasCommit(repoRoot, baseline)) {
    throw new Error(
      `Wiki recent changes baseline ${baseline} is unavailable. Fetch full Git history before building.`,
    );
  }

  const commitOutput = runGit(repoRoot, [
    'rev-list',
    '--reverse',
    '--topo-order',
    `${baseline}..${head}`,
    '--',
    ...PUBLIC_ROOTS,
  ]);
  const commits = commitOutput.split(/\r?\n/).filter(Boolean);
  const visibility: VisibilityContext = {
    head,
    hiddenPaths: new Map(),
    metadata: new Map(),
    indexes: new Map(),
  };
  const entries = commits
    .map((commit) => {
      const pages = changesForCommit(repoRoot, commit, visibility);
      if (pages.length === 0) return undefined;
      const timestamp = runGit(repoRoot, [
        'show',
        '-s',
        '--format=%cI',
        commit,
      ]).trim();
      return {timestamp, pages};
    })
    .filter((entry): entry is RecentChangeEntry => entry !== undefined)
    .reverse();

  if (outputFile) {
    mkdirSync(path.dirname(outputFile), {recursive: true});
    writeFileSync(outputFile, generatedModule(entries), 'utf8');
  }
  return entries;
}

function runCli(): void {
  const repoRoot = process.cwd();
  const outputFile = path.join(repoRoot, DEFAULT_OUTPUT);
  const entries = generateRecentChanges({
    repoRoot,
    baseline: process.env.WIKI_RECENT_CHANGES_BASELINE ?? DEFAULT_BASELINE,
    outputFile,
  });
  process.stdout.write(
    `Generated ${entries.length} Wiki recent-change entries.\n`,
  );
}

const isDirectExecution =
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  runCli();
}
