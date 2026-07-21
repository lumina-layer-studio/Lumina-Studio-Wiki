import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import OriginalFooter from '@theme-original/DocItem/Footer';
import Comments from '@site/src/components/Comments';
import styles from './styles.module.css';

type Props = React.ComponentProps<typeof OriginalFooter>;

function ContentLicenseNotice(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const isEnglish = i18n.currentLocale === 'en';
  const policyUrl = isEnglish
    ? '/en/docs/project/content-license/'
    : '/zh/docs/project/content-license/';

  return (
    <aside
      className={styles.licenseNotice}
      aria-label={isEnglish ? 'Content license' : '内容许可'}>
      <p>
        {isEnglish
          ? 'Unless otherwise noted, original material on this page for which Lumina Studio holds the rights is licensed under CC BY-NC-SA 4.0. Third-party and specially attributed material is excluded. '
          : '除另有说明外，本页中由 Lumina Studio 创作并享有权利的内容采用 CC BY-NC-SA 4.0 许可；第三方及特别标注素材除外。'}{' '}
        <Link to={policyUrl}>
          {isEnglish ? 'Read the full policy.' : '查看完整说明。'}
        </Link>
      </p>
    </aside>
  );
}

export default function DocItemFooter(props: Props): ReactNode {
  return (
    <>
      <OriginalFooter {...props} />
      <ContentLicenseNotice />
      <Comments />
    </>
  );
}
