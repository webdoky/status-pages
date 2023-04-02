import useTranslationStatusSettings from '../contexts/translationStatusContext';
import Select from './select';

export default function TranslationStatusSettings() {
  const [filterState, dispatch] = useTranslationStatusSettings();

  return (
    <>
      <div className="flex justify-between">
        <label></label>
        <Select
          options={['mdn', 'wd']}
          onChange={(option) => {
            console.log(option, '???');
          }}
        />
        <label>
          <input
            type="radio"
            checked={!filterState.priorityOnly}
            className="mr-2"
            onChange={() =>
              dispatch({ type: 'setSortingByAnalytics', value: 'none' })
            }
          />
          Не сортувати за пріоритетом
        </label>
        <label>
          <input
            type="radio"
            checked={
              filterState.priorityOnly && filterState.priorityType === 'mdn'
            }
            className="mr-2"
            onChange={() =>
              dispatch({ type: 'setSortingByAnalytics', value: 'mdn' })
            }
          />
          Сортувати за популярністю MDN
        </label>
        <label>
          <input
            type="radio"
            checked={
              filterState.priorityOnly && filterState.priorityType === 'wd'
            }
            className="mr-2"
            onChange={() =>
              dispatch({ type: 'setSortingByAnalytics', value: 'wd' })
            }
          />
          Сортувати за нашою аналітикою
        </label>
      </div>
      <hr />
    </>
  );
}
