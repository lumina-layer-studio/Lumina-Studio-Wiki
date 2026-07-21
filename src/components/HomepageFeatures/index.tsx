import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type Feature = {
  key: string;
  title: ReactNode;
  description: ReactNode;
  to: string;
};

function FeatureCard({title, description, to}: Feature): ReactNode {
  return (
    <Link className={styles.card} to={to}>
      <Heading as="h2" className={styles.cardTitle}>
        {title}
      </Heading>
      <p className={styles.cardDescription}>{description}</p>
      <span className={styles.cardAction}>
        <Translate id="homepage.feature.open">查看内容</Translate>
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default function HomepageFeatures(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const base = i18n.currentLocale === 'en' ? '/en' : '/zh';
  const isEnglish = i18n.currentLocale === 'en';

  const features: Feature[] = [
    {
      key: 'getting-started',
      title: (
        <Translate id="homepage.feature.gettingStarted.title">快速开始</Translate>
      ),
      description: (
        <Translate id="homepage.feature.gettingStarted.description">
          配置切片软件、打印机和喷嘴，完成首次准备。
        </Translate>
      ),
      to: isEnglish
        ? `${base}/docs/getting-started/device-setup/`
        : `${base}/docs/使用教程2/首次使用-设备配置/`,
    },
    {
      key: 'tutorials',
      title: (
        <Translate id="homepage.feature.tutorials.title">教程与工作流</Translate>
      ),
      description: (
        <Translate id="homepage.feature.tutorials.description">
          按步骤完成色卡、切片与实际打印。
        </Translate>
      ),
      to: isEnglish
        ? `${base}/docs/tutorials/generate-and-print-gradient-cards/`
        : `${base}/docs/使用教程2/生成并打印梯度色卡/`,
    },
    {
      key: 'knowledge',
      title: (
        <Translate id="homepage.feature.knowledge.title">基础知识</Translate>
      ),
      description: (
        <Translate id="homepage.feature.knowledge.description">
          了解耗材、TD/HEX、色彩校准与打印精度。
        </Translate>
      ),
      to: isEnglish
        ? `${base}/docs/td-and-hex-values/`
        : `${base}/docs/TD值/`,
    },
    {
      key: 'releases',
      title: (
        <Translate id="homepage.feature.releases.title">版本进展</Translate>
      ),
      description: (
        <Translate id="homepage.feature.releases.description">
          查看公开版本历史和 2.0 开发月报。
        </Translate>
      ),
      to: isEnglish ? `${base}/docs/changelog/` : `${base}/docs/更新日志/`,
    },
  ];

  return (
    <section className={styles.features} aria-label="Wiki sections">
      <div className={styles.grid}>
        {features.map((feature) => (
          <FeatureCard key={feature.key} {...feature} />
        ))}
      </div>
    </section>
  );
}
