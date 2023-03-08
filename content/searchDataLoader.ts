import { promises as fs } from 'fs';

const fileExists = async (path: string) => {
  try {
    await fs.access(path);
  } catch {
    return false;
  }

  return true;
};

interface AnalyticRecords {
  url: string;
  clicks: number;
}

export default class SearchDataLoader {
  public static getAll = async (): Promise<AnalyticRecords[]> => {
    const analyticsFile = process.env?.analyticsFile || '';

    if (!analyticsFile) {
      throw new Error('Analytics file is not set!');
    }

    if (!(await fileExists(analyticsFile))) {
      throw new Error('Analytics is missing!');
    }

    const content = (await fs.readFile(analyticsFile)).toString();

    const records = JSON.parse(content);

    return records;
  };
}
