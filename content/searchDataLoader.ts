import { promises as fs } from 'fs';
import { PopularityMap } from './mdnPopularitiesLoader';

const fileExists = async (path: string) => {
  try {
    await fs.access(path);
  } catch {
    return false;
  }

  return true;
};

interface AnalyticRecords {
  slug: string;
  popularity: number;
}

export default class SearchDataLoader {
  public static getPopularityMap = async (): Promise<PopularityMap> => {
    const analyticsFile = process.env?.analyticsFile || '';

    if (!analyticsFile) {
      throw new Error('Analytics file is not set!');
    }

    if (!(await fileExists(analyticsFile))) {
      throw new Error('Analytics is missing!');
    }

    const content = (await fs.readFile(analyticsFile)).toString();

    const records = JSON.parse(content);

    const popularityMap: PopularityMap = {};

    records.forEach((record: AnalyticRecords) => {
      popularityMap[record.slug] = record.popularity;
    });

    return popularityMap;
  };
}
