import { PageData } from '../content/contentLoader';
import { DocumentationSections } from '../contexts/translationStatusSettings';
import TranslationStatusRow from './translationStatusRow';
import useTranslationStatusSettings from '../contexts/translationStatusSettings';
import useTheme from '../contexts/theme';
import classNames from 'classnames';

interface Params {
  title: string;
  anchor: string;
  sectionName: DocumentationSections;
  pages: Partial<PageData>[];
  includePopularity: boolean;
}

export default function TranslationStatusSection({
  title = '',
  anchor = '',
  pages,
  includePopularity,
  sectionName,
}: Params) {
  const [filterState, dispatch] = useTranslationStatusSettings();
  const [isDarkMode] = useTheme();
  const { activeSections } = filterState;

  const isSectionEnabled = activeSections.includes(sectionName);

  return (
    <>
      <h3 id={anchor}>
        <a href={`#${anchor}`} aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        {title}
      </h3>
      <div className="wd-table-scroll">
        {isSectionEnabled ? (
          <table className="table table-bordered w-full doc-status__table">
            <thead>
              <tr>
                {includePopularity && <th>Рейтинг</th>}
                <th>Сторінка</th>
                <th>Оригінал</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {pages.length ? (
                pages.map((page) => (
                  <TranslationStatusRow
                    key={page.path}
                    page={page}
                    includePopularity={includePopularity}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    Порожньо
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <button
            className={classNames(
              'border border-x-0 p-3 w-full',
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            )}
            onClick={() =>
              dispatch({
                type: 'toggleDocumentationSection',
                value: sectionName,
              })
            }
          >
            Розгорнути
          </button>
        )}
      </div>
    </>
  );
}
