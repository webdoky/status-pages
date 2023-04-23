import { promises as fs } from 'fs';
import path from 'path';
import { DocumentationSections } from '../contexts/translationStatusSettings';

const contentCachePath = 'cache';
const mainIndexFile = 'mainIndex.json';
const pageFileName = 'index.json';
const pagesPath = `${contentCachePath}/files`;

// TODO: merge types
interface ExtractedSample {
  src: string;
  id: string;
  content: {
    js?: string;
    css?: string;
    html?: string;
  };
}

export interface IndexFileObject {
  index: MainIndexData[];
  liveSamples: ExtractedSample[];
  internalDestinations: string[];
}

export interface MainIndexData {
  slug: string;
  title: string;
  path: string;
  hasContent: boolean;
}

export interface PageData {
  title: string;
  path: string;
  slug: string;
  section: DocumentationSections;
  hasContent: boolean;
  originalPath: string;
  updatesInOriginalRepo: string[];
  // translationLastUpdatedAt?: string;
}

const defaultFields: (keyof PageData)[] = [
  'title',
  'path',
  'slug',
  'section',
  'hasContent',
  'originalPath',
  'updatesInOriginalRepo',
];

const readIndex = async (): Promise<IndexFileObject> => {
  const file = await fs.readFile(
    path.resolve(contentCachePath, mainIndexFile),
    'utf-8'
  );
  return JSON.parse(file);
};

export default class WdContentLoader {
  static async getAll(
    fields: (keyof PageData)[] = defaultFields
  ): Promise<Partial<PageData>[]> {
    const mainIndex = await readIndex();
    const pages: Partial<PageData>[] = [];
    const paths = mainIndex.index.map(({ slug }) => slug);

    await Promise.all(
      paths.map(async (slug, index) => {
        const file = await fs.readFile(
          path.resolve(pagesPath, slug, pageFileName),
          'utf-8'
        );
        const pageData = JSON.parse(file) as PageData;
        const selectedPageData: any = {}; // TODO:

        fields.forEach((key) => {
          selectedPageData[key] = pageData[key];
        });

        pages[index] = selectedPageData;
      })
    );

    return pages;
  }

  static async getBySlug(slug: string): Promise<PageData> {
    const file = await fs.readFile(
      path.resolve(pagesPath, slug, pageFileName),
      'utf-8'
    );
    const pageData = JSON.parse(file) as PageData;
    return pageData;
  }
}
