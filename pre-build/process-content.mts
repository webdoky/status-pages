import { promises as fs } from 'fs';
import path from 'path';

import * as dotenv from 'dotenv';

// @ts-ignore // TODO:
import { Runner } from '@webdoky/content-processor/dist/main.js';

dotenv.config({ path: '.env.local' });

const readRedirects = async (
  pathToContent: string
): Promise<Record<string, string>> => {
  const targetLocale = process.env.TARGET_LOCALE;
  const sourceLocale = process.env.SOURCE_LOCALE;
  const file = await fs.readFile(
    path.resolve(pathToContent, '_redirects.txt'),
    'utf-8'
  );
  const contents = file.split('\n');
  const redirectionDirectives = contents.filter(
    (maybeDirective) =>
      maybeDirective && // empty strings are not valid redirects
      !maybeDirective.startsWith('#') // hash-started string is considered a comment
  );

  return Object.fromEntries(
    redirectionDirectives.map((directiveString) => {
      const parts = directiveString.split('\t').filter(Boolean);
      if (parts.length !== 2) {
        throw new Error(
          `Parsing error, expected 2 parts, but got ${parts.length}`
        );
      }
      return parts.map((entry) =>
        entry.replace(`/${sourceLocale}/`, `/${targetLocale}/`)
      );
    })
  );
};

const processContent = async () => {
  const pathToLocalizedContent = process.env.PATH_TO_LOCALIZED_CONTENT;
  const pathToOriginalContent = process.env.PATH_TO_ORIGINAL_CONTENT;
  const targetLocale = process.env.TARGET_LOCALE;
  const sourceLocale = process.env.SOURCE_LOCALE;
  let redirectMap = {};

  try {
    redirectMap = await readRedirects(
      `${pathToOriginalContent}/${sourceLocale?.toLowerCase()}`
    );
  } catch (error) {
    console.warn(error, "Failed to read redirects map, assuming it's empty...");
  }

  const runner = new Runner({
    pathToLocalizedContent,
    pathToOriginalContent,
    pathToCache: 'cache',
    sourceLocale,
    targetLocale,
    redirectMap,
  });

  await runner.init();

  console.log('Finished processing files');
};

processContent();
