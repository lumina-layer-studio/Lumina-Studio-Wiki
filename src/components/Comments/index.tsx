import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import type ArtalkInstance from 'artalk';
import 'artalk/Artalk.css';

import {resolveLegacyPageKey} from '@site/src/lib/legacyPageKeys';

import {bindArtalkLifecycle} from './artalkLifecycle';
import styles from './styles.module.css';

type LoadState = 'idle' | 'loading' | 'ready' | 'failed';

export default function Comments(): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const server = String(siteConfig.customFields?.artalkServer ?? '').replace(
    /\/$/,
    '',
  );
  const site = String(
    siteConfig.customFields?.artalkSite ?? 'Lumina Studio Wiki',
  );
  const isEnglish = pathname.startsWith('/en/');
  const artalkLocale = isEnglish ? 'en-US' : 'zh-CN';
  const pageKey = resolveLegacyPageKey(pathname);

  useEffect(() => {
    if (!server || !containerRef.current) {
      setLoadState('idle');
      return undefined;
    }

    let disposed = false;
    let instance: ArtalkInstance | undefined;
    let unbindLifecycle: (() => void) | undefined;
    setLoadState('loading');

    void import('artalk')
      .then(({default: Artalk}) => {
        if (disposed || !containerRef.current) return;
        const markReady = () => {
          if (!disposed) setLoadState('ready');
        };
        instance = Artalk.init({
          el: containerRef.current,
          pageKey,
          pageTitle: document.title,
          server,
          site,
          locale: artalkLocale,
          remoteConfModifier: (remoteConf) => {
            remoteConf.locale = artalkLocale;
          },
          darkMode: 'auto',
        });
        unbindLifecycle = bindArtalkLifecycle(instance, {
          onReady: markReady,
          onFailed: () => {
            if (!disposed) setLoadState('failed');
          },
        });
      })
      .catch(() => {
        if (!disposed) setLoadState('failed');
      });

    return () => {
      disposed = true;
      unbindLifecycle?.();
      instance?.destroy();
    };
  }, [artalkLocale, pageKey, server, site]);

  if (!server) return null;

  return (
    <section
      className={styles.comments}
      aria-label={isEnglish ? 'Comments' : '评论'}
    >
      <h2>{isEnglish ? 'Comments' : '评论'}</h2>
      {loadState === 'loading' && (
        <p className={styles.status} role="status">
          {isEnglish ? 'Loading comments…' : '正在加载评论…'}
        </p>
      )}
      {loadState === 'failed' && (
        <p className={styles.status} role="status">
          {isEnglish
            ? 'Comments are temporarily unavailable. The documentation remains available.'
            : '评论暂时不可用，文档正文不受影响。'}
        </p>
      )}
      <div
        ref={containerRef}
        className={loadState === 'failed' ? styles.hidden : undefined}
      />
    </section>
  );
}
