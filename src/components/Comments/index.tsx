import React, {useEffect, useEffectEvent, useRef, useState} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';
import {useColorMode} from '@docusaurus/theme-common';
import type MeowCommentsInstance from '@neko_vecter/meow-comment-ui';
import '@neko_vecter/meow-comment-ui/MeowCommentUI.css';

import {createMeowCommentOptions} from './meowCommentOptions';
import styles from './styles.module.css';

type LoadState = 'idle' | 'loading' | 'ready' | 'failed';

export default function Comments(): React.ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<MeowCommentsInstance | null>(null);
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();
  const {colorMode} = useColorMode();
  const server = String(
    siteConfig.customFields?.meowCommentServer ?? '',
  ).replace(/\/+$/, '');
  const isEnglish = pathname.startsWith('/en/');
  const darkMode = colorMode === 'dark';
  const getDarkMode = useEffectEvent(() => darkMode);

  useEffect(() => {
    instanceRef.current?.update({darkMode});
  }, [darkMode]);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!server || !section || !container) return;

    setLoadState('idle');
    let disposed = false;
    let started = false;

    const loadEditor = () => {
      if (disposed || started) return;
      started = true;
      observer?.disconnect();
      setLoadState('loading');

      void import('@neko_vecter/meow-comment-ui')
        .then(({default: MeowComments}) => {
          if (disposed) return;
          instanceRef.current = new MeowComments({
            el: container,
            ...createMeowCommentOptions({
              server,
              pathname,
              pageTitle: document.title,
              darkMode: getDarkMode(),
            }),
          });
          setLoadState('ready');
        })
        .catch(() => {
          if (!disposed) setLoadState('failed');
        });
    };

    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) loadEditor();
        });
    if (observer) observer.observe(section);
    else loadEditor();

    return () => {
      disposed = true;
      observer?.disconnect();
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [pathname, server]);

  if (!server) return null;

  return (
    <section
      ref={sectionRef}
      className={styles.comments}
      aria-label={isEnglish ? 'Submit feedback' : '提交反馈'}
      tabIndex={loadState === 'idle' || loadState === 'loading' ? 0 : undefined}
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
