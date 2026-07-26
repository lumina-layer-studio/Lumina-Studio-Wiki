import type {ReactNode} from 'react';
import {useLocation} from '@docusaurus/router';
import OriginalBlogPostItems from '@theme-original/BlogPostItems';
import type {Props} from '@theme/BlogPostItems';

import WikiRecentChanges from '@site/src/components/WikiRecentChanges';
import {isUpdatesRootPath} from '@site/src/components/WikiRecentChanges/model';

export default function BlogPostItems(props: Props): ReactNode {
  const {pathname} = useLocation();

  return (
    <>
      {isUpdatesRootPath(pathname) ? <WikiRecentChanges /> : null}
      <OriginalBlogPostItems {...props} />
    </>
  );
}
