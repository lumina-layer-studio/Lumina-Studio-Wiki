import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';

import wikiRecentChanges from '@site/src/generated/wikiRecentChanges';

import {
  copyForLocale,
  formatRecentChangeTimestamp,
  localizePage,
} from './model';
import styles from './styles.module.css';

const DISPLAY_LIMIT = 30;

export default function WikiRecentChanges(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale;
  const copy = copyForLocale(locale);
  const entries = wikiRecentChanges.slice(0, DISPLAY_LIMIT);

  return (
    <section className={styles.root} aria-labelledby="wiki-recent-changes-title">
      <div className={styles.heading}>
        <Heading as="h2" id="wiki-recent-changes-title">
          {copy.title}
        </Heading>
        <p>{copy.description}</p>
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>{copy.empty}</p>
      ) : (
        <ol className={styles.entries}>
          {entries.map((entry) => (
            <li className={styles.entry} key={entry.timestamp}>
              <time
                className={styles.timestamp}
                dateTime={entry.timestamp}
              >
                {formatRecentChangeTimestamp(entry.timestamp, locale)}
              </time>
              <ul className={styles.pages}>
                {entry.pages.map((page, pageIndex) => {
                  const localizedPage = localizePage(page, locale);
                  const label = copy.actions[page.action];
                  const key = `${page.action}-${localizedPage.url ?? localizedPage.title}-${pageIndex}`;

                  return (
                    <li className={styles.page} key={key}>
                      <span
                        className={`${styles.badge} ${styles[page.action]}`}
                      >
                        {label}
                      </span>
                      {localizedPage.url ? (
                        <Link to={localizedPage.url}>
                          {localizedPage.title}
                        </Link>
                      ) : (
                        <span>{localizedPage.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
