import classNames from 'classnames';
import {
  GithubIcon,
  GlobeIcon,
  CopyIcon,
  TerminalIcon,
  FileCodeIcon,
} from './icons';
import CopyToClipboard from './copyToClipboard';
import { PageData } from '../content/contentLoader';

interface Params {
  page: Partial<PageData & { currentPopularity: number }>;
  includePopularity: boolean;
}

const escapeHtml = (str: string) => {
  return str.replaceAll('<', '&lt;');
};

const parseUpdatesList = (
  data: string[]
): {
  commit: string;
  date: string;
}[] =>
  data.map((entry) => {
    const [commit, date] = entry.split(' - ');

    return {
      commit,
      date,
    };
  });

const webDokyBase = process.env.NEXT_PUBLIC_PROJECT_HOME;

export default function TranslationStatusRow({
  page,
  includePopularity,
}: Params) {
  const {
    title = '',
    updatesInOriginalRepo = [],
    originalPath = '',
    slug,
    currentPopularity,
    hasContent,
  } = page;
  const linkToRawOriginalGithubContent = `https://raw.githubusercontent.com/mdn/content/main/files/en-us${originalPath}`;
  const baseRepoPath = 'files/uk';
  const tree = originalPath.replace('/index.html', '').replace('/index.md', '');

  const updates = parseUpdatesList(updatesInOriginalRepo);

  const bashCommand = `mkdir -p ${baseRepoPath}${tree} && wget -O ${baseRepoPath}${originalPath} ${linkToRawOriginalGithubContent}`;

  const changes = updates.length
    ? `\n\nНові зміни:\n${updates
        .map(
          ({ commit }) =>
            `- [mdn/content@${commit.slice(
              0,
              7
            )}](https://github.com/mdn/content/commit/${commit})`
        )
        .join('\n')}`
    : '';

  const noteOnUpdate = `Оригінальний вміст: [${escapeHtml(
    title
  )}@MDN](https://developer.mozilla.org/en-us/docs/${slug}), [сирці ${escapeHtml(
    title
  )}@GitHub](https://github.com/mdn/content/blob/main/files/en-us${originalPath})${changes}`;

  const gitDiffCommand = updates.length
    ? `git diff ${updates[updates.length - 1].commit}^..${
        updates[0].commit
      } ./files/en-us${originalPath}`
    : '';

  return (
    <tr>
      {includePopularity && <td>{currentPopularity}</td>}
      <td
        className={classNames({
          'doc-status--not-translated': !hasContent,
          'doc-status--translated': hasContent,
          'doc-status--up-to-date': !updatesInOriginalRepo.length,
        })}
      >
        <div className="flex flex-row justify-between">
          <span className={`mb-0 ${includePopularity ? '' : 'pl-4'}`}>
            <a
              className="text-ui-typo"
              href={`${webDokyBase}${page.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.title}
            </a>
            {updatesInOriginalRepo.length ? (
              <span>
                {' '}
                (нові зміни:{' '}
                {updatesInOriginalRepo.map((commit, index) => (
                  <a
                    key={commit}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/mdn/content/commit/${
                      commit.split(' - ')[0]
                    }`}
                  >
                    {`${commit.slice(0, 7)}${
                      updatesInOriginalRepo.length - 1 > index ? ',' : ''
                    }`}{' '}
                  </a>
                ))}
                )
              </span>
            ) : null}
          </span>
          {page.hasContent && (
            <a
              className="text-ui-typo px-2"
              title="Переглянути сирці перекладеної сторінки на GitHub"
              href={`https://github.com/webdoky/content/tree/master/files/uk${page.originalPath}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon size={1.7} />
            </a>
          )}
        </div>
      </td>
      <td className="pt-2 pb-2">
        <div className="flex flex-row">
          <a
            className="text-ui-typo px-2"
            title="Переглянути оригінальний текст на MDN"
            href={`https://developer.mozilla.org/en-us/docs/${page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlobeIcon size={1.7} />
          </a>
          <a
            className="text-ui-typo px-2"
            title="Переглянути сирці оригінальної сторінки на GitHub"
            href={`https://github.com/mdn/content/blob/main/files/en-us${originalPath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={1.7} />
          </a>
        </div>
      </td>
      <td>
        <div className="flex flex-row">
          {updatesInOriginalRepo.length ? (
            <>
              <CopyToClipboard
                text={noteOnUpdate}
                className={'px-2'}
                title={'Cкопіювати перелік комітів зі змінами'}
              >
                <CopyIcon size={1.7} />
              </CopyToClipboard>

              <CopyToClipboard
                text={gitDiffCommand}
                className={'px-2'}
                title={'Cкопіювати команду Git для перегляду всіх змін'}
              >
                <FileCodeIcon size={1.7} />
              </CopyToClipboard>
            </>
          ) : null}

          {!hasContent && (
            <>
              <CopyToClipboard
                text={bashCommand}
                className={'px-2'}
                title={
                  'Cкопіювати bash скрипт для ініціалізації файлу перекладу (скопіювати і виконати в корені репозиторію)'
                }
              >
                <TerminalIcon size={1.7} />
              </CopyToClipboard>

              <CopyToClipboard
                text={noteOnUpdate}
                className={'px-2'}
                title={'Cкопіювати заголовок для коміт-повідомлення'}
              >
                <CopyIcon size={1.7} />
              </CopyToClipboard>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
