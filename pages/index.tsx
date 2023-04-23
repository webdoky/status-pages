import Layout from '../components/layout';
import contentLoader, { PageData } from '../content/contentLoader';
import PopularitiesLoader from '../content/mdnPopularitiesLoader';
import TranslationStatus, {
  PageWithPopularityData,
} from '../components/translationStatus';
import MetaHead from '../components/metaHead';
import SearchDataLoader from '../content/searchDataLoader';
import { EqualizerIcon } from '../components/icons';
import { useState } from 'react';
import TranslationStatusSettings from '../components/translationSettings';
import { TraslationStatusProvider } from '../contexts/translationStatusSettings';
import { PagePopularityData } from '../components/translationStatus';

export async function getStaticProps() {
  const pages = await contentLoader.getAll();
  const popularitiesMdn = PopularitiesLoader.getPopularityMap();
  const popularitiesWd = await SearchDataLoader.getPopularityMap();

  return {
    props: {
      basePath: process.env.BASE_PATH,
      pages: pages.map((page) => ({
        ...page,
        popularity: {
          mdn: page.path ? popularitiesMdn[page.path] || 0 : 0,
          wd: page.path ? popularitiesWd[page.path] || 0 : 0,
        },
      })),
    },
  };
}

export default function IndexPage({
  basePath,
  pages: allPages,
}: {
  basePath: string;
  pages: PageWithPopularityData[];
}) {
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const toggleFilterPanelOpened = () => setIsFilterOpened(!isFilterOpened);

  return (
    <main className="wd-main-page">
      <MetaHead
        title="Стан перекладу пріоритетних сторінок | ВебДоки"
        description="Тут наведена порівняльна таблиця стану перекладу документації
        за розділами, у розрізі їхньої популярності."
        canonicalUrl={`${basePath}/translation-status-priority`}
        basePath={`${basePath}`}
      />
      <Layout>
        <div className="flex flex-wrap items-start justify-start">
          <div className="order-1 w-full md:w-2/3">
            <div className="wd-content">
              <h1 id="пара-слів-про-нас">
                <a href="#Стан-перекладу-документації" aria-hidden="true">
                  <span className="icon icon-link"></span>
                </a>
                Статус перекладу сторінок
              </h1>
              <TraslationStatusProvider>
                <h2 id="як-зявився-цей-проєкт">
                  <a href="#Огляд" aria-hidden="true">
                    <span className="icon icon-link"></span>
                  </a>
                  Огляд
                  <button
                    className="text-ui-typo text-base float-right"
                    onClick={toggleFilterPanelOpened}
                  >
                    <EqualizerIcon size={1.7} />
                  </button>
                </h2>
                {isFilterOpened ? <TranslationStatusSettings /> : null}
                <TranslationStatus allPages={allPages} />
              </TraslationStatusProvider>
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
