import { PageData } from '../content/contentLoader';
import TranslationStatusSection from './translationStatusSection';
import TranslationOverallStatusRow from './translationOverallStatusRow';
import useTranslationStatusSettings from '../contexts/translationStatusSettings';
import { FilterSate } from '../contexts/translationStatusSettings';
import { DocumentationSections } from '../contexts/translationStatusSettings';

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

const availableSectionsMeta: Record<
  DocumentationSections,
  {
    title: string;
    anchor: string;
  }
> = {
  [DocumentationSections.css]: { title: 'CSS', anchor: 'CSS' },
  [DocumentationSections.html]: { title: 'HTML', anchor: 'HTML' },
  [DocumentationSections.javascript]: {
    title: 'JavaScript',
    anchor: 'JavaScript',
  },
  [DocumentationSections.svg]: { title: 'SVG', anchor: 'SVG' },
  [DocumentationSections.guide]: { title: 'Посібники', anchor: 'Posibnyky' },
  [DocumentationSections.glossary]: { title: 'Глосарій', anchor: 'Hlosarii' },
};

const availableSectionsNames = Object.values(DocumentationSections);

export default function TranslationStatus({ allPages }: Params) {
  const [filterState, dispatch] = useTranslationStatusSettings();
  const { activeSections, displayedRating, sort } = filterState;

  const supportedSections: Record<
    DocumentationSections,
    (PageWithPopularityData & { currentPopularity?: number })[]
  > = {
    css: [],
    html: [],
    javascript: [],
    svg: [],
    guide: [],
    glossary: [],
  };

  if (displayedRating !== 'none') {
    allPages.forEach((page) => {
      const { popularity } = page;

      const currentPopularity = parseFloat(
        popularity[displayedRating === 'wd' ? 'wd' : 'mdn'].toFixed(
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

  for (const sectionName of availableSectionsNames) {
    supportedSections[sectionName].sort(
      sort === 'byRating'
        ? (a, b) => (b.currentPopularity || 0) - (a.currentPopularity || 0)
        : (a, b) => (a.title || '').localeCompare(b.title || '')
    );
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
              <th></th>
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
            {availableSectionsNames.map((sectionName) => (
              <TranslationOverallStatusRow
                key={`TranslationOverallStatusRow_${sectionName}`}
                allPages={supportedSections[sectionName]}
                title={availableSectionsMeta[sectionName].title}
                anchor={availableSectionsMeta[sectionName].anchor}
                isChecked={activeSections.includes(sectionName)}
                onToggle={() =>
                  dispatch({
                    type: 'toggleDocumentationSection',
                    value: sectionName,
                  })
                }
              />
            ))}

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

      {availableSectionsNames.map((sectionName) => (
        <TranslationStatusSection
          key={`TranslationStatusSection_${sectionName}`}
          anchor={availableSectionsMeta[sectionName].anchor}
          title={availableSectionsMeta[sectionName].title}
          sectionName={sectionName}
          pages={filterPages(supportedSections[sectionName], filterState)}
          includePopularity={displayedRating !== 'none'}
        />
      ))}
    </>
  );
}
