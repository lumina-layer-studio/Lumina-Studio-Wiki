import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function localeBase(currentLocale: string): '/zh' | '/en' {
  return currentLocale === 'en' ? '/en' : '/zh';
}

function HomepageHeader(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const base = localeBase(i18n.currentLocale);
  const firstUsePath =
    i18n.currentLocale === 'en'
      ? `${base}/docs/getting-started/device-setup/`
      : `${base}/docs/使用教程2/首次使用-设备配置/`;

  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroContent}>
        <Heading as="h1" className={styles.heroTitle}>
          Lumina Studio Wiki
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.hero.subtitle">
            从首次配置到完整打印工作流，按步骤查找需要的内容。
          </Translate>
        </p>
        <Link className="button button--primary button--lg" to={firstUsePath}>
          <Translate id="homepage.hero.cta">第一次使用</Translate>
        </Link>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const description = translate({
    id: 'homepage.meta.description',
    message: 'Lumina Studio 官方 Wiki，提供中英文教程、工作流和版本记录。',
  });

  return (
    <Layout title="Lumina Studio Wiki" description={description}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <p className={styles.publicNote}>
          <Translate id="homepage.publicNote">
            免费公开 · 中英文 · 持续更新
          </Translate>
        </p>
      </main>
    </Layout>
  );
}
