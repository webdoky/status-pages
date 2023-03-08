import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { google } from 'googleapis';
import nextSettings from '../next.config';

dotenv.config({ path: '.env.local' });

const { GOOGLE_KEY } = process.env;
const { analyticsFile } = nextSettings.env || {};

const keyFile = './key.json';
const scopes = ['https://www.googleapis.com/auth/webmasters.readonly'];

const getYYYYMMDD = (date: Date) =>
  `${date.getUTCFullYear()}-${`${date.getUTCMonth() + 1}`.padStart(
    2,
    '0'
  )}-${`${date.getUTCDate()}`.padStart(2, '0')}`;

const aWeek = 7 * 24 * 60 * 60 * 1000;

interface AnalyticsRecord {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

const fileExists = async (path: string) => {
  try {
    await fs.access(path);
  } catch {
    return false;
  }

  return true;
};

(async function () {
  if (!GOOGLE_KEY) {
    throw new Error('Google key file is missing!');
  }

  if (!analyticsFile) {
    throw new Error('Analytics file is not set');
  }

  // Prepare key file
  if (await fileExists(keyFile)) {
    await fs.rm(keyFile);
  }

  await fs.writeFile(keyFile, GOOGLE_KEY);

  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes,
  });

  // Getting analytics from Google
  const authClient = await auth.getClient();

  const searchConsoleClient = google.webmasters({
    version: 'v3',
    auth: authClient,
  });

  const endTimestamp = new Date().getTime() - aWeek;
  const startTimestamp = endTimestamp - 4 * aWeek;

  const response = await searchConsoleClient.searchanalytics.query({
    siteUrl: 'sc-domain:webdoky.org',
    requestBody: {
      startDate: getYYYYMMDD(new Date(startTimestamp)),
      endDate: getYYYYMMDD(new Date(endTimestamp)),
      dimensions: ['PAGE'],
    },
  });

  const records = (response.data?.rows || []) as AnalyticsRecord[];

  // Processing and saving analytics data
  const weights: { url: string; clicks: number }[] = [];

  for (const record of records) {
    const { keys, clicks } = record;
    for (const key of keys) {
      weights.push({ url: key, clicks });
    }
  }

  if (await fileExists(analyticsFile)) {
    await fs.rm(analyticsFile);
  }

  await fs.writeFile(analyticsFile, JSON.stringify(weights));

  // remove credentials after processing
  await fs.rm(keyFile);
})();
