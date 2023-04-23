import useTranslationStatusSettings, {
  DisplayedRating,
  SortingBy,
} from '../contexts/translationStatusSettings';
import Select from './select';

const ratingDisplayOptions: { label: string; value: DisplayedRating }[] = [
  {
    label: 'Аналітики вебсайту ВебДоки',
    value: 'wd',
  },
  {
    label: 'Аналітики вебсайту MDN WebDocs',
    value: 'mdn',
  },
  {
    label: 'Не показувати рейтинг',
    value: 'none',
  },
];

const sortingOptions: { label: string; value: SortingBy }[] = [
  {
    label: 'За рейтингом',
    value: 'byRating',
  },
  {
    label: 'Алфавітно',
    value: 'alphabetically',
  },
];

export default function TranslationStatusSettings() {
  const [filterState, dispatch] = useTranslationStatusSettings();
  const { displayedRating, sort } = filterState;

  const selectedDisplayedRatingOption = ratingDisplayOptions.find(
    (entry) => entry.value === displayedRating
  );

  const selectedSortByOption = sortingOptions.find(
    (entry) => entry.value === sort
  );

  return (
    <>
      <div className="mb-3 flex-col flex">
        <label className="inline-flex justify-start items-center">
          Показувати рейтинг сторінок:
          <Select
            className="ml-3"
            options={ratingDisplayOptions}
            value={selectedDisplayedRatingOption}
            onChange={(option) => {
              dispatch({
                type: 'setDisplayedRating',
                value: option.value as DisplayedRating,
              });
            }}
          />
        </label>

        <label className="inline-flex justify-start items-center mt-3">
          Сортувати:
          <Select
            className="ml-3"
            options={sortingOptions}
            value={selectedSortByOption}
            onChange={(option) => {
              dispatch({
                type: 'setSortByValue',
                value: option.value as SortingBy,
              });
            }}
          />
        </label>
      </div>
      <hr />
    </>
  );
}
