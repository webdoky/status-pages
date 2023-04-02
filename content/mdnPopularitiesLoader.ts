import readJsonDependency from '../utils/readJsonDependency';

const popularitiesJson = readJsonDependency('@mdn/yari/popularities.json');

export interface PopularityMap {
  [key: string]: number;
}

const sourceLocale = process.env.SOURCE_LOCALE;
const targetLocale = process.env.TARGET_LOCALE;

export default class PopularitiesLoader {
  static getPopularityMap(): PopularityMap {
    const popularities = popularitiesJson;

    if (!sourceLocale) {
      throw new Error('No source locale provided!');
    }

    const popularityMap: PopularityMap = {};

    Object.keys(popularitiesJson)
      .filter((key) => key.includes(sourceLocale))
      .forEach((key) => {
        popularityMap[key.replace(`/${sourceLocale}/`, `/${targetLocale}/`)] =
          popularities[key];
      });

    return popularityMap;
  }
}
