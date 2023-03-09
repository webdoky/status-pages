import Layout from '../components/layout';
import contentLoader, { PageData } from '../content/contentLoader';
import PopularitiesLoader, {
  PopularityItem,
} from '../content/mdnPopularitiesLoader';
import TranslationStatus from '../components/translationStatus';
import MetaHead from '../components/metaHead';
import SearchDataLoader, { AnalyticRecords } from '../content/searchDataLoader';

export async function getStaticProps() {
  const pages = await contentLoader.getAll();
  const allPopularities = PopularitiesLoader.getAll();
  const searchAnalytics = await SearchDataLoader.getAll();

  return {
    props: {
      basePath: process.env.BASE_PATH,
      pages,
      allPopularities,
      searchAnalytics,
    },
  };
}

export default function IndexPage({
  basePath,
  allPopularities,
  pages: allPages,
  searchAnalytics,
}: {
  basePath: string;
  allPopularities: PopularityItem[];
  pages: PageData[];
  searchAnalytics: AnalyticRecords[];
}) {
  return (
    <main className="wd-main-page">
      <MetaHead
        title="Стан перекладу пріоритетних сторінок | ВебДоки"
        description="Тут наведена порівняльна таблиця стану перекладу документації
        за розділами, у розрізі їхньої популярності."
        canonicalUrl={`${basePath}/translation-status-priority`}
        basePath={`${basePath}`}
      />
      <Layout
        currentPage={{ path: '/translation-status-priority' }}
        sidebarSections={[]}
      >
        <div className="flex flex-wrap items-start justify-start">
          <div className="order-1 w-full md:w-2/3">
            <div className="wd-content">
              <h1 id="пара-слів-про-нас">
                <a href="#Стан-перекладу-документації" aria-hidden="true">
                  <span className="icon icon-link"></span>
                </a>
                Статус перекладу сторінок
              </h1>
              <h2 id="як-зявився-цей-проєкт">
                <a href="#Огляд" aria-hidden="true">
                  <span className="icon icon-link"></span>
                </a>
                Огляд
              </h2>
              <p>
                Популярність різних сторінок береться з аналітики MDN, де ця
                інформація застосовується для ранжування пошуку (докладніше про
                це{' '}
                <a href="https://github.com/mdn/yari/blob/main/docs/popularities.md">
                  тут
                </a>
                ). Ми її використовуємо як орієнтир для вибору сторінок, які
                слід перекласти в першу чергу.
              </p>
              <p>
                Індекс популярності за MDN вже нормалізований, і коливається між
                0 та 1. Більший рейтинг означає вищий пріоритет перекладу.
              </p>
              <p>
                Наш індекс популярності поки ненормалізований, і представлений
                просто додатнім числом. Більше число означає вищу популярність
                сторінки.
              </p>

              <TranslationStatus
                allPopularities={allPopularities}
                allPages={allPages}
                searchAnalytics={searchAnalytics}
              />
            </div>
          </div>
        </div>
      </Layout>
    </main>
  );
}
