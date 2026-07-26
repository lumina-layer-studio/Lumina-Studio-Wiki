import {execFileSync} from 'node:child_process';
import {mkdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

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
  title: string;
  slug: string;
  url?: string;
}

const CHINESE_ROOT = 'docs/';
const ENGLISH_ROOT =
  'i18n/en/docusaurus-plugin-content-docs/current/';
const PUBLIC_ROOTS = [CHINESE_ROOT, ENGLISH_ROOT] as const;
const DOCUMENT_PATTERN = /\.mdx?$/i;
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
  return localeRoot(filePath) !== undefined && DOCUMENT_PATTERN.test(filePath);
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

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function frontMatterValue(source: string, field: 'title' | 'slug'): string | undefined {
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontMatter) return undefined;

  const match = frontMatter[1]?.match(
    new RegExp(`^${field}:\\s*(.+?)\\s*$`, 'm'),
  );
  return match?.[1] ? unquote(match[1]) : undefined;
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

function metadataFromDocument(
  repoRoot: string,
  commit: string,
  filePath: string,
  linkable: boolean,
): PageMetadata | undefined {
  const location = localeRoot(filePath);
  if (!location || !DOCUMENT_PATTERN.test(filePath)) return undefined;

  const source = readFileAtCommit(repoRoot, commit, filePath);
  if (!source) return undefined;
  const title = frontMatterValue(source, 'title');
  const slug = frontMatterValue(source, 'slug');
  if (!title || !slug) return undefined;

  const normalizedSlug = normalizeSlug(slug);
  return {
    locale: location.locale,
    title,
    slug: normalizedSlug,
    ...(linkable ? {url: publicUrl(location.locale, normalizedSlug)} : {}),
  };
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
      '--name-only',
      commit,
      '--',
      directory,
    ]);
  } catch {
    return [];
  }

  return output
    .split(/\r?\n/)
    .filter(
      (candidate) =>
        DOCUMENT_PATTERN.test(candidate) &&
        path.posix.dirname(candidate) === directory,
    );
}

function metadataBySlugAt(
  repoRoot: string,
  commit: string,
  locale: Locale,
  slug: string,
  linkable: boolean,
): PageMetadata | undefined {
  const root = locale === 'zh' ? CHINESE_ROOT : ENGLISH_ROOT;
  let output: string;
  try {
    output = runGit(repoRoot, [
      'ls-tree',
      '-r',
      '--name-only',
      commit,
      '--',
      root,
    ]);
  } catch {
    return undefined;
  }

  for (const candidate of output.split(/\r?\n/)) {
    if (!isPublicDocumentPath(candidate)) continue;
    const metadata = metadataFromDocument(
      repoRoot,
      commit,
      candidate,
      linkable,
    );
    if (metadata?.locale === locale && metadata.slug === slug) {
      return metadata;
    }
  }
  return undefined;
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
  );
  return metadata ? {metadata, action} : undefined;
}

function pageSortKey(pageChange: RecentChangePage): string {
  const localeCount = Number(Boolean(pageChange.zh)) + Number(Boolean(pageChange.en));
  const page = pageChange.zh ?? pageChange.en;
  return `${2 - localeCount}:${page?.url ?? page?.title ?? ''}`;
}

function changesForCommit(
  repoRoot: string,
  commit: string,
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
    {action?: RecentChangeAction; zh?: LocalizedPage; en?: LocalizedPage}
  >();

  for (const change of parseNullDelimitedChanges(diff)) {
    const resolved = changeMetadata(repoRoot, commit, change);
    if (!resolved) continue;

    const {metadata, action} = resolved;
    const logicalKey = metadata.slug;
    const existing = grouped.get(logicalKey) ?? {};
    existing.action = strongerAction(existing.action, action);
    existing[metadata.locale] = {
      title: metadata.title,
      ...(metadata.url ? {url: metadata.url} : {}),
    };
    grouped.set(logicalKey, existing);
  }

  for (const [slug, pageChange] of grouped) {
    const lookupCommit =
      pageChange.action === 'removed' ? `${commit}^` : commit;
    for (const locale of ['zh', 'en'] as const) {
      if (pageChange[locale]) continue;
      const metadata = metadataBySlugAt(
        repoRoot,
        lookupCommit,
        locale,
        slug,
        pageChange.action !== 'removed',
      );
      if (metadata) {
        pageChange[locale] = {
          title: metadata.title,
          ...(metadata.url ? {url: metadata.url} : {}),
        };
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
  const entries = commits
    .map((commit) => {
      const pages = changesForCommit(repoRoot, commit);
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
