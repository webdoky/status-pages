import { PageData } from '../content/contentLoader';

interface Params {
  title?: string;
  anchor?: string;
  allPages: Partial<PageData>[];
}

export default function TranslationOverallStatusRow({
  title = '',
  anchor = '',
  allPages,
}: Params) {
  const allPageCount = allPages.length;
  const translatedPageCount = allPages.filter((node) => node.hasContent).length;

  const translatedPagePercent =
    Math.round(
      (allPageCount > 0 ? translatedPageCount / allPageCount : 0) * 100 * 100
    ) / 100; // toFixed(2)
  const obsoletePages = allPages.filter(
    (node) => (node.updatesInOriginalRepo || []).length
  ).length;

  const translationsUpToDateCount = translatedPageCount - obsoletePages;
  const translationsUpToDatePercent = (
    (allPageCount > 0 ? translationsUpToDateCount / allPageCount : 0) * 100
  ).toFixed(2);

  return (
    <tr>
      <td>
        {anchor ? (
          <a href={`#${title}`} className="text-ui-typo">
            {' '}
            {title}{' '}
          </a>
        ) : (
          <span>{title}</span>
        )}
      </td>
      <td>{allPageCount}</td>
      <td className="doc-status--translated">
        {translatedPageCount} ({translatedPagePercent}%)
      </td>
      <td className="doc-status--translated doc-status--up-to-date">
        {translationsUpToDateCount} ({translationsUpToDatePercent}%)
      </td>
      <td className="doc-status--not-translated">
        {allPageCount - translatedPageCount} (
        {allPageCount > 0 ? 100 - translatedPagePercent : 0}%)
      </td>
    </tr>
  );
}
