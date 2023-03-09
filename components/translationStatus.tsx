import { PageData } from '../content/contentLoader';
import TranslationStatusSection from './translationStatusSection';
import { useReducer } from 'react';
import TranslationOverallStatusRow from './translationOverallStatusRow';
import { AnalyticRecords } from '../content/searchDataLoader';

const NUMBER_OF_SIGNIFICANT_DIGITS = 4;

interface Params {
  allPopularities: { link: string; popularity: number }[];
  allPages: PageData[];
  priorityOnly?: boolean;
  searchAnalytics: AnalyticRecords[];
}

const filterPages = (pages: PageData[], data: FilterSate) => {
  const { showNotTranslated, showUpToDate, showTranslated } = data;
  return pages.filter(
    (page) =>
      (showNotTranslated && !page.hasContent) ||
      (showUpToDate && page.hasContent && !page.updatesInOriginalRepo.length) ||
      (showTranslated && page.hasContent && page.updatesInOriginalRepo.length)
  );
};

type FilterAction =
  | 'toggleNotTranslated'
  | 'toggleUpToDate'
  | 'toggleTranslated'
  | 'togglePriority'
  | 'enablePriorityMdn'
  | 'enablePriorityWd';

type PriorityType = 'mdn' | 'wd';

function reducer(
  state: FilterSate,
  action: { type: FilterAction }
): FilterSate {
  switch (action.type) {
    case 'toggleNotTranslated':
      return { ...state, showNotTranslated: !state.showNotTranslated };
    case 'toggleUpToDate':
      return { ...state, showUpToDate: !state.showUpToDate };
    case 'toggleTranslated':
      return { ...state, showTranslated: !state.showTranslated };
    case 'togglePriority':
      return { ...state, priorityOnly: false };
    case 'enablePriorityMdn':
      return { ...state, priorityOnly: true, priorityType: 'mdn' };
    case 'enablePriorityWd':
      return { ...state, priorityOnly: true, priorityType: 'wd' };
    default:
      throw new Error();
  }
}

interface FilterSate {
  showNotTranslated: boolean;
  showUpToDate: boolean;
  showTranslated: boolean;
  priorityOnly: boolean;
  priorityType: PriorityType;
}

export default function TranslationStatus({
  allPopularities,
  allPages,
  searchAnalytics,
}: Params) {
  const [filterState, dispatch] = useReducer(reducer, {
    showNotTranslated: true,
    showUpToDate: true,
    showTranslated: true,
    priorityOnly: true,
    priorityType: 'wd',
  });

  const pathToPagesMap = Object.fromEntries(
    allPages.map((page) => [page.path, page])
  );

  const pathToPopularityMap = Object.fromEntries(
    allPopularities.map(({ link, popularity }) => [link, popularity])
  );

  const supportedSections: Record<
    string,
    (PageData & { popularity: number })[]
  > = {
    css: [],
    html: [],
    javascript: [],
    svg: [],
    guide: [],
    glossary: [],
  };

  if (filterState.priorityOnly) {
    if (filterState.priorityType === 'mdn') {
      allPopularities.forEach((entry) => {
        const { link, popularity } = entry;
        const normalizedPopularity = parseFloat(
          popularity.toFixed(NUMBER_OF_SIGNIFICANT_DIGITS)
        );
        if (normalizedPopularity > 0) {
          const page = pathToPagesMap[link];
          if (page && page.section) {
            const { section } = page;
            supportedSections[section].push({
              ...page,
              popularity: normalizedPopularity,
            });
          }
        }
      });
    } else {
      searchAnalytics.forEach((entry) => {
        const { slug, clicks: popularity } = entry;
        if (popularity > 0) {
          const page = pathToPagesMap[slug];
          if (page && page.section) {
            const { section } = page;
            supportedSections[section].push({
              ...page,
              popularity,
            });
          }
        }
      });
    }
  } else {
    allPages.forEach((page) => {
      const { section, path } = page;
      if (section in supportedSections) {
        supportedSections[section].push({
          ...page,
          popularity: pathToPopularityMap[path] || 0,
        });
      }
    });
  }

  const allSupportedPages = [
    ...supportedSections.css,
    ...supportedSections.html,
    ...supportedSections.javascript,
    ...supportedSections.svg,
    ...supportedSections.guide,
  ];

  return (
    <>
      <div className="wd-table-scroll">
        <div className="flex justify-between">
          <label>
            <input
              type="radio"
              checked={!filterState.priorityOnly}
              className="mr-2"
              onChange={() => dispatch({ type: 'togglePriority' })}
            />
            Не сортувати за пріоритетом
          </label>
          <label>
            <input
              type="radio"
              checked={
                filterState.priorityOnly && filterState.priorityType === 'mdn'
              }
              className="mr-2"
              onChange={() => dispatch({ type: 'enablePriorityMdn' })}
            />
            Сортувати за популярністю MDN
          </label>
          <label>
            <input
              type="radio"
              checked={
                filterState.priorityOnly && filterState.priorityType === 'wd'
              }
              className="mr-2"
              onChange={() => dispatch({ type: 'enablePriorityWd' })}
            />
            Сортувати за нашою аналітикою
          </label>
        </div>
        <hr />
        <table className="table table-bordered w-full doc-status__table">
          <thead>
            <tr>
              <th>Розділ</th>
              <th>Сторінки</th>
              <th>
                <label>
                  <input
                    type="checkbox"
                    checked={filterState.showTranslated}
                    className="mr-2"
                    onChange={() => dispatch({ type: 'toggleTranslated' })}
                  />
                  З них перекладено
                </label>
              </th>
              <th>
                <label>
                  <input
                    type="checkbox"
                    checked={filterState.showUpToDate}
                    className="mr-2"
                    onChange={() => dispatch({ type: 'toggleUpToDate' })}
                  />
                  З них актуально
                </label>
              </th>
              <th>
                <label>
                  <input
                    type="checkbox"
                    checked={filterState.showNotTranslated}
                    className="mr-2"
                    onChange={() => dispatch({ type: 'toggleNotTranslated' })}
                  />
                  Очікує на переклад
                </label>
              </th>
            </tr>
          </thead>
          <tbody>
            <TranslationOverallStatusRow
              allPages={supportedSections.css}
              title="CSS"
              anchor="CSS"
            />
            <TranslationOverallStatusRow
              allPages={supportedSections.html}
              title="HTML"
              anchor="HTML"
            />
            <TranslationOverallStatusRow
              allPages={supportedSections.javascript}
              title="JavaScript"
              anchor="JavaScript"
            />
            <TranslationOverallStatusRow
              allPages={supportedSections.svg}
              title="SVG"
              anchor="SVG"
            />
            <TranslationOverallStatusRow
              allPages={supportedSections.guide}
              title="Посібники"
              anchor="Посібники"
            />
            <TranslationOverallStatusRow
              allPages={supportedSections.glossary}
              title="Глосарій"
              anchor="Глосарій"
            />
            <TranslationOverallStatusRow
              allPages={allSupportedPages}
              title="Загалом"
            />
          </tbody>
        </table>
      </div>

      <h2 id="Стан-перекладу-за-розділами">
        <a href="#Стан-перекладу-за-розділами" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        Стан перекладу за розділами
      </h2>
      <h3 id="CSS">
        <a href="#CSS" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        CSS
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.css, filterState)}
          includePopularity={true}
        />
      </div>

      <h3 id="HTML">
        <a href="#HTML" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        HTML
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.html, filterState)}
          includePopularity={true}
        />
      </div>

      <h3 id="JavaScript">
        <a href="#JavaScript" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        JavaScript
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.javascript, filterState)}
          includePopularity={true}
        />
      </div>

      <h3 id="SVG">
        <a href="#SVG" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        SVG
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.svg, filterState)}
          includePopularity={true}
        />
      </div>

      <h3 id="Посібники">
        <a href="#Посібники" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        Посібники
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.guide, filterState)}
          includePopularity={true}
        />
      </div>

      <h3 id="Глосарій">
        <a href="#Глосарій" aria-hidden="true">
          <span className="icon icon-link"></span>
        </a>
        Глосарій
      </h3>
      <div className="wd-table-scroll">
        <TranslationStatusSection
          pages={filterPages(supportedSections.glossary, filterState)}
          includePopularity={true}
        />
      </div>
    </>
  );
}
