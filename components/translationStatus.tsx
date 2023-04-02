import { PageData } from '../content/contentLoader';
import TranslationStatusSection from './translationStatusSection';
import TranslationOverallStatusRow from './translationOverallStatusRow';
import useTranslationStatusSettings from '../contexts/translationStatusContext';
import { FilterSate } from '../contexts/translationStatusContext';

const NUMBER_OF_SIGNIFICANT_DIGITS = 4;

export interface PagePopularityData {
  mdn: number;
  wd: number;
}

export type PageWithPopularityData = PageData & {
  popularity: PagePopularityData;
};

interface Params {
  allPages: PageWithPopularityData[];
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

export default function TranslationStatus({ allPages }: Params) {
  const [filterState, dispatch] = useTranslationStatusSettings();
  const { priorityType } = filterState;

  const supportedSections: Record<
    string,
    (PageWithPopularityData & { currentPopularity?: number })[]
  > = {
    css: [],
    html: [],
    javascript: [],
    svg: [],
    guide: [],
    glossary: [],
  };

  if (priorityType !== 'none') {
    allPages.forEach((page) => {
      const { popularity } = page;

      const currentPopularity = parseFloat(
        popularity[priorityType === 'wd' ? 'wd' : 'mdn'].toFixed(
          NUMBER_OF_SIGNIFICANT_DIGITS
        )
      );

      if (currentPopularity > 0 && page && page.section) {
        const { section } = page;
        supportedSections[section].push({
          ...page,
          currentPopularity,
        });
      }
    });
  } else {
    allPages.forEach((page) => {
      const { section } = page;
      if (section in supportedSections) {
        supportedSections[section].push(page);
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
