import React, {useEffect, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import type MeowCommentsInstance from 'meow-comment-ui';
import 'meow-comment-ui/MeowCommentUI.css';

import {createMeowCommentOptions} from './meowCommentOptions';
import styles from './styles.module.css';

type LoadState = 'idle' | 'loading' | 'ready' | 'failed';

export default function Comments(): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const server = String(
    siteConfig.customFields?.meowCommentServer ?? '',
  ).replace(/\/+$/, '');
  const isEnglish = pathname.startsWith('/en/');

  useEffect(() => {
    if (!server || !containerRef.current) {
      setLoadState('idle');
      return undefined;
    }

    let disposed = false;
    let instance: MeowCommentsInstance | undefined;
    setLoadState('loading');

    void import('meow-comment-ui')
      .then(({default: MeowComments}) => {
        if (disposed || !containerRef.current) return;
        instance = new MeowComments({
          el: containerRef.current,
          ...createMeowCommentOptions({
            server,
            pathname,
            pageTitle: document.title,
          }),
        });
        if (!disposed) setLoadState('ready');
      })
      .catch(() => {
        if (!disposed) setLoadState('failed');
      });

    return () => {
      disposed = true;
      instance?.destroy();
    };
  }, [pathname, server]);

  if (!server) return null;

  return (
    <section
      className={styles.comments}
      aria-label={isEnglish ? 'Submit feedback' : '提交反馈'}
    >
      <h2>{isEnglish ? 'Submit feedback' : '提交反馈'}</h2>
      <p className={styles.description}>
        {isEnglish
          ? 'Your feedback is sent privately to the Wiki maintainers and is not displayed publicly on this page.'
          : '反馈会直接发送给 Wiki 维护者，不会在本页公开显示。'}
      </p>
      {loadState === 'loading' && (
        <p className={styles.status} role="status">
          {isEnglish ? 'Loading the feedback form…' : '正在加载反馈表单…'}
        </p>
      )}
      {loadState === 'failed' && (
        <p className={styles.status} role="status">
          {isEnglish
            ? 'The feedback form is temporarily unavailable. The documentation remains available.'
            : '反馈表单暂时不可用，文档正文不受影响。'}
        </p>
      )}
      <div
        ref={containerRef}
        className={loadState === 'failed' ? styles.hidden : undefined}
      />
    </section>
  );
}
