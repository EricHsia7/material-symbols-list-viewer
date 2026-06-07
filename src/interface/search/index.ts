import { initializeSymbol } from '..';
import { searchFor, SearchResult, SearchResultArray } from '../../data/search';
import { getBlankIconElement, setGlyph } from '../icons';

const searchElement = document.querySelector('.css_search') as HTMLElement;
const searchPanelElement = searchElement.querySelector('.css_search_panel') as HTMLElement;
const searchInputElement = searchPanelElement.querySelector('.css_search_input input[type="text"]') as HTMLInputElement;
const searchResultsElement = searchPanelElement.querySelector('.css_search_results') as HTMLElement;

let initialized: boolean = false;
let previousQuery: string = '';
let previousSearchResults: SearchResultArray = [];

export function initializeSearchEvents(): void {
  if (initialized) {
    return;
  }
  initialized = true;

  searchElement.addEventListener('click', function (event: Event) {
    event.stopPropagation();

    if (event.target === searchElement) {
      hideSearch();
    }
  });

  searchInputElement.addEventListener('selectionchange', function () {
    updateSearch();
  });

  searchInputElement.addEventListener('keyup', function () {
    updateSearch();
  });

  searchInputElement.addEventListener('paste', function () {
    updateSearch();
  });

  searchInputElement.addEventListener('cut', function () {
    updateSearch();
  });

  document.addEventListener('keydown', function (event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      showSearch();
    }
    if (event.key === 'Escape') {
      hideSearch();
    }
  });
}

function generateElementOfSearchResult(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_search_result');

  const glyphElement = document.createElement('div');
  glyphElement.classList.add('css_search_result_glyph');
  glyphElement.appendChild(getBlankIconElement());

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_search_result_name');

  element.appendChild(glyphElement);
  element.appendChild(nameElement);
  return element;
}

function updateSearch(): void {
  const query = searchInputElement.value;
  if (query === previousQuery) {
    return;
  }

  const searchResults = searchFor(query);
  updateSearchResults(searchResults);
  previousQuery = query;
}

function updateSearchResults(searchResults: SearchResultArray): void {
  function updateSearchResult(thisElement: HTMLElement, thisSearchResult: SearchResult, previousSearchResult: SearchResult | null): void {
    function updateSymbol(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
      const symbolElement = thisElement.querySelector('.css_search_result_glyph') as HTMLElement;
      setGlyph(symbolElement, thisSearchResult[0]);
    }

    function updateSymbolName(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
      const symbolNameElement = thisElement.querySelector('.css_search_result_name') as HTMLElement;
      symbolNameElement.innerText = thisSearchResult[0];
    }

    function updateOnclick(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
      thisElement.onclick = function () {
        hideSearch();
        initializeSymbol(thisSearchResult[0]);
      };
    }

    if (previousSearchResult) {
      if (thisSearchResult[0] !== previousSearchResult[0]) {
        updateSymbol(thisElement, thisSearchResult);
        updateSymbolName(thisElement, thisSearchResult);
        updateOnclick(thisElement, thisSearchResult);
      }
    } else {
      updateSymbol(thisElement, thisSearchResult);
      updateSymbolName(thisElement, thisSearchResult);
      updateOnclick(thisElement, thisSearchResult);
    }
  }

  const searchResultsQuantity = searchResults.length;

  searchPanelElement.style.setProperty('--m-visible-search-results-quantity', Math.min(searchResultsQuantity, 10).toString());

  const searchResultElements = Array.from(searchResultsElement.querySelectorAll('.css_search_result'));
  const currentSearchResultElementsLength = searchResultElements.length;
  if (searchResultsQuantity !== currentSearchResultElementsLength) {
    const difference = currentSearchResultElementsLength - searchResultsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSearchResultElement = generateElementOfSearchResult();
        fragment.appendChild(newSearchResultElement);
        searchResultElements.push(newSearchResultElement);
      }
      searchResultsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentSearchResultElementsLength - 1, q = currentSearchResultElementsLength - difference - 1; p > q; p--) {
        searchResultElements[p].remove();
        searchResultElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < searchResultsQuantity; i++) {
    const thisElement = searchResultElements[i] as HTMLElement;
    const thisSymbol = searchResults[i];

    if (previousSearchResults[i]) {
      const previousSymbol = previousSearchResults[i];
      updateSearchResult(thisElement, thisSymbol, previousSymbol);
    } else {
      updateSearchResult(thisElement, thisSymbol, null);
    }
  }

  previousSearchResults = searchResults;
}

export function showSearch(): void {
  searchElement.setAttribute('displayed', 'true');
  searchElement.addEventListener(
    'animationend',
    function () {
      searchElement.classList.add('css_search_faded_in');
      searchPanelElement.classList.add('css_search_panel_faded_in');

      searchElement.classList.remove('css_search_fade_in');
      searchPanelElement.classList.remove('css_search_panel_fade_in');

      searchInputElement.focus();
    },
    { once: true }
  );

  searchElement.classList.add('css_search_fade_in');
  searchPanelElement.classList.add('css_search_panel_fade_in');
}

export function hideSearch(): void {
  searchInputElement.blur();

  searchElement.addEventListener(
    'animationend',
    function () {
      searchElement.setAttribute('displayed', 'false');

      searchElement.classList.remove('css_search_faded_in');
      searchPanelElement.classList.remove('css_search_panel_faded_in');

      searchElement.classList.remove('css_search_fade_out');
      searchPanelElement.classList.remove('css_search_panel_fade_out');
    },
    { once: true }
  );

  searchElement.classList.add('css_search_fade_out');
  searchPanelElement.classList.add('css_search_panel_fade_out');
}

export function searchKeyword(keyword: string): void {
  showSearch();
  searchInputElement.value = keyword;
  updateSearch();
}
