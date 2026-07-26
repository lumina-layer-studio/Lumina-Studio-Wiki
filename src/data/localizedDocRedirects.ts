export const localizedDocSlugPairs = [
  ['/使用教程2/首次使用-设备配置', '/getting-started/device-setup'],
  ['/校准板校色', '/color-chart-calibration'],
  ['/耗材选择', '/filament-selection'],
  ['/TD值', '/td-and-hex-values'],
  ['/部署安装', '/installation'],
  ['/使用教程', '/user-guide-1x'],
  ['/使用教程2', '/user-guide-2x'],
  ['/关于我们', '/about'],
  ['/开发者动态', '/development-updates'],
  ['/常见问题QA', '/faq'],
  ['/赞助支持', '/sponsors-and-support'],
  ['/更新日志/1.x-history', '/changelog/1.x-history'],
  ['/更新日志/2026-03', '/changelog/2026-03'],
  ['/更新日志/2026-04', '/changelog/2026-04'],
  ['/更新日志/2026-05', '/changelog/2026-05'],
  ['/更新日志/2026-06', '/changelog/2026-06'],
  ['/更新日志/2026-07', '/changelog/2026-07'],
  ['/更新日志', '/changelog'],
  [
    '/使用教程2/拍摄并提取梯度卡',
    '/tutorials/photograph-and-extract-gradient-cards',
  ],
  [
    '/使用教程2/生成并打印梯度色卡',
    '/tutorials/generate-and-print-gradient-cards',
  ],
  ['/切片教程', '/slicer-guide'],
] as const;

export const retiredTutorialPaths = [
  '/docs/tutorials/keychain-loop/',
  '/docs/tutorials/transparent-coating/',
] as const;

function docPath(slug: string): string {
  return `/docs/${slug.replace(/^\/|\/$/g, '')}/`;
}

const localizedDocPathPairs = localizedDocSlugPairs.map(
  ([zhSlug, enSlug]) => [docPath(zhSlug), docPath(enSlug)] as const,
);

export function createLocalizedDocRedirects(
  existingPath: string,
): string[] | undefined {
  if (existingPath === '/docs/tutorials/') {
    return [...retiredTutorialPaths];
  }

  for (const [zhPath, enPath] of localizedDocPathPairs) {
    if (existingPath === zhPath) return [enPath];
    if (existingPath === enPath) return [zhPath];
  }

  return undefined;
}
