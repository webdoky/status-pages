import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
type FilterAction =
  | 'toggleNotTranslated'
  | 'toggleUpToDate'
  | 'toggleTranslated'
  | 'setDisplayedRating'
  | 'toggleDocumentationSection'
  | 'setSortByValue'
  | 'restorePreviousState';

export type SortingBy = 'byRating' | 'alphabetically';
export type DisplayedRating = 'mdn' | 'wd' | 'none';

interface SetDisplayedRatingAction {
  type: 'setDisplayedRating';
  value: DisplayedRating;
}

interface SetSortByValueAction {
  type: 'setSortByValue';
  value: SortingBy;
}

interface ToggleSectionAction {
  type: 'toggleDocumentationSection';
  value: DocumentationSections;
}

interface RestorePreviousState {
  type: 'restorePreviousState';
  value: FilterSate;
}

type TranslationStatusAction =
  | SetSortByValueAction
  | SetDisplayedRatingAction
  | ToggleSectionAction
  | RestorePreviousState
  | {
      type: Exclude<
        FilterAction,
        | 'setSortByValue'
        | 'setDisplayedRating'
        | 'toggleDocumentationSection'
        | 'restorePreviousState'
      >;
    };

function reducer(
  state: FilterSate,
  action: TranslationStatusAction
): FilterSate {
  switch (action.type) {
    case 'toggleNotTranslated':
      return { ...state, showNotTranslated: !state.showNotTranslated };
    case 'toggleUpToDate':
      return { ...state, showUpToDate: !state.showUpToDate };
    case 'toggleTranslated':
      return { ...state, showTranslated: !state.showTranslated };
    case 'setDisplayedRating':
      return { ...state, displayedRating: action.value };
    case 'setSortByValue':
      return { ...state, sort: action.value };
    case 'toggleDocumentationSection':
      return {
        ...state,
        activeSections: state.activeSections.includes(action.value)
          ? state.activeSections.filter((section) => section !== action.value)
          : [...state.activeSections, action.value],
      };
    case 'restorePreviousState':
      return {
        ...state,
        showNotTranslated: action.value.showNotTranslated,
        showUpToDate: action.value.showUpToDate,
        showTranslated: action.value.showTranslated,
        displayedRating: action.value.displayedRating,
        sort: action.value.sort,
        activeSections: action.value.activeSections,
      };
    default:
      throw new Error();
  }
}

export enum DocumentationSections {
  css = 'css',
  html = 'html',
  javascript = 'javascript',
  svg = 'svg',
  guide = 'guide',
  glossary = 'glossary',
}

export interface FilterSate {
  showNotTranslated: boolean;
  showUpToDate: boolean;
  showTranslated: boolean;
  displayedRating: DisplayedRating;
  sort: SortingBy;
  activeSections: DocumentationSections[];
}

const defaultFilterState: FilterSate = {
  showNotTranslated: true,
  showUpToDate: true,
  showTranslated: true,
  displayedRating: 'wd',
  sort: 'byRating',
  activeSections: [
    DocumentationSections.css,
    DocumentationSections.html,
    DocumentationSections.javascript,
    DocumentationSections.svg,
    DocumentationSections.guide,
    DocumentationSections.glossary,
  ],
};

const FILTER_STATE_STORAGE_KEY = '_wd-filter-state';

const TranslationStatusSettingsContext = createContext<
  [FilterSate, (_: TranslationStatusAction) => void]
>([defaultFilterState, (_: any) => {}]);

export const TraslationStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [filterState, dispatch] = useReducer(reducer, defaultFilterState);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      const serializedPreviousFilterState = localStorage.getItem(
        FILTER_STATE_STORAGE_KEY
      );
      isFirstRender.current = false;

      if (serializedPreviousFilterState) {
        try {
          const previousFilterState = JSON.parse(serializedPreviousFilterState);

          dispatch({
            type: 'restorePreviousState',
            value: previousFilterState,
          });
        } catch {}
      }
    } else {
      localStorage.setItem(
        FILTER_STATE_STORAGE_KEY,
        JSON.stringify(filterState)
      );
    }
  }, [filterState]);

  return (
    <TranslationStatusSettingsContext.Provider value={[filterState, dispatch]}>
      {children}
    </TranslationStatusSettingsContext.Provider>
  );
};

const useTranslationStatusSettings = () =>
  useContext(TranslationStatusSettingsContext);

export default useTranslationStatusSettings;
