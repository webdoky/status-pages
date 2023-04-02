import { createContext, useContext, useReducer } from 'react';
type FilterAction =
  | 'toggleNotTranslated'
  | 'toggleUpToDate'
  | 'toggleTranslated'
  | 'togglePriority'
  | 'enablePriorityMdn'
  | 'enablePriorityWd'
  // TODO:///
  | 'setSortingByAnalytics';

type PriorityType = 'mdn' | 'wd' | 'none';

interface SortByAnalyticsAction {
  type: 'setSortingByAnalytics';
  value: PriorityType;
}

type TranslationStatusAction =
  | SortByAnalyticsAction
  | { type: Exclude<FilterAction, 'setSortingByAnalytics'> };

function reducer(
  state: FilterSate,
  action: TranslationStatusAction
): FilterSate {
  console.log('dispatch called', action);
  switch (action.type) {
    case 'toggleNotTranslated':
      return { ...state, showNotTranslated: !state.showNotTranslated };
    case 'toggleUpToDate':
      return { ...state, showUpToDate: !state.showUpToDate };
    case 'toggleTranslated':
      return { ...state, showTranslated: !state.showTranslated };
    case 'togglePriority':
      return { ...state, priorityOnly: false };
    case 'enablePriorityMdn':
      return { ...state, priorityOnly: true, priorityType: 'mdn' };
    case 'enablePriorityWd':
      return { ...state, priorityOnly: true, priorityType: 'wd' };
    case 'setSortingByAnalytics':
      return { ...state, priorityType: action.value };
    default:
      throw new Error();
  }
}

export interface FilterSate {
  showNotTranslated: boolean;
  showUpToDate: boolean;
  showTranslated: boolean;
  priorityOnly: boolean;
  priorityType: PriorityType;
}

const defaultFilterState: FilterSate = {
  showNotTranslated: true,
  showUpToDate: true,
  showTranslated: true,
  priorityOnly: true,
  priorityType: 'wd',
};

const TranslationStatusContext = createContext<
  [FilterSate, (_: TranslationStatusAction) => void]
>([defaultFilterState, (_: any) => {}]);

export const TraslationStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filterState, dispatch] = useReducer(reducer, defaultFilterState);

  return (
    <TranslationStatusContext.Provider value={[filterState, dispatch]}>
      {children}
    </TranslationStatusContext.Provider>
  );
};

const useTranslationStatusSettings = () => useContext(TranslationStatusContext);

export default useTranslationStatusSettings;
