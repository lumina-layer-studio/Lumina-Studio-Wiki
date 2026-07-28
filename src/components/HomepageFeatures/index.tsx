import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import styles from './styles.module.css';

type Feature = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  to: string;
};

type FeatureCardProps = Omit<Feature, 'id'>;

function FeatureCard({title, description, to}: FeatureCardProps): ReactNode {
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

  const features: Feature[] = [
    {
      id: 'getting-started',
      title: (
        <Translate id="homepage.feature.gettingStarted.title">快速开始</Translate>
      ),
      description: (
        <Translate id="homepage.feature.gettingStarted.description">
          配置切片软件、打印机和喷嘴，完成首次准备。
        </Translate>
      ),
      to: `${base}/docs/getting-started/device-setup/`,
    },
    {
      id: 'tutorials',
      title: (
        <Translate id="homepage.feature.tutorials.title">教程与工作流</Translate>
      ),
      description: (
        <Translate id="homepage.feature.tutorials.description">
          按步骤完成色卡、切片与实际打印。
        </Translate>
      ),
      to: `${base}/docs/tutorials/gradient-card-generate-print/`,
    },
    {
      id: 'knowledge',
      title: (
        <Translate id="homepage.feature.knowledge.title">基础知识</Translate>
      ),
      description: (
        <Translate id="homepage.feature.knowledge.description">
          了解耗材、TD/HEX、色彩校准与打印精度。
        </Translate>
      ),
      to: `${base}/docs/knowledge/td-hex-values/`,
    },
    {
      id: 'releases',
      title: (
        <Translate id="homepage.feature.releases.title">版本进展</Translate>
      ),
      description: (
        <Translate id="homepage.feature.releases.description">
          查看公开版本历史和 2.0 开发月报。
        </Translate>
      ),
      to: `${base}/docs/releases/overview/`,
    },
  ];

  return (
    <section className={styles.features} aria-label="Wiki sections">
      <div className={styles.grid}>
        {features.map(({id, title, description, to}) => (
          <FeatureCard
            key={id}
            title={title}
            description={description}
            to={to}
          />
        ))}
      </div>
    </section>
  );
}
