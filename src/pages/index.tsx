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
  const firstUsePath = `${base}/docs/getting-started/device-setup/`;

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

function HomepageSupport(): ReactNode {
  return (
    <section className={styles.support} aria-labelledby="homepage-support-title">
      <Heading
        as="h2"
        id="homepage-support-title"
        className={styles.supportTitle}
      >
        <Translate id="homepage.support.title">支持 Lumina Studio</Translate>
      </Heading>
      <p className={styles.supportDescription}>
        <Translate id="homepage.support.description">
          Wiki 免费公开。如果这些内容对您有帮助，可以选择适合所在地区的平台支持项目持续开发。
        </Translate>
      </p>
      <div className={styles.supportActions}>
        <Link
          className="button button--secondary button--lg"
          to="https://ifdian.net/a/MMMINNN"
        >
          <Translate id="homepage.support.afdian">
            中国大陆 · 爱发电
          </Translate>
        </Link>
        <Link
          className="button button--secondary button--lg"
          to="https://www.patreon.com/cw/Lumina_studio"
        >
          <Translate id="homepage.support.patreon">
            海外 · Patreon
          </Translate>
        </Link>
      </div>
    </section>
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
        <HomepageSupport />
        <p className={styles.publicNote}>
          <Translate id="homepage.publicNote">
            免费公开 · 中英文 · 持续更新
          </Translate>
        </p>
      </main>
    </Layout>
  );
}
