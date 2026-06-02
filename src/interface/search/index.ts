// import { searchFor, SearchResult, SearchResultArray } from '../../data/search';
// import { getBlankIconElement, setGlyph } from '../icons';
// import { showSymbol } from '../symbol';

// const searchLightboxElement = document.querySelector('.css_search_lightbox') as HTMLElement;
// const searchField = document.querySelector('.css_search_field') as HTMLElement;
// const searchHeadElement = searchField.querySelector('.css_search_head') as HTMLElement;
// const searchHeadLeftButtonElement = searchHeadElement.querySelector('.css_search_head_button_left') as HTMLElement;
// const searchHeadSearchInputElement = searchHeadElement.querySelector('.css_search_head_search_input input[type="text"]') as HTMLInputElement;
// const searchBodyElement = searchField.querySelector('.css_search_body') as HTMLElement;
// const searchResultsElement = searchBodyElement.querySelector('.css_search_results') as HTMLElement;

// let initialized: boolean = false;
// let previousQuery: string = '';
// let previousSearchResults: SearchResultArray = [];

// export async function initializeSearchField() {
//   if (initialized) {
//     return;
//   }
//   initialized = true;

//   searchHeadLeftButtonElement.onclick = function () {
//     closeSearch();
//   };

//   searchHeadSearchInputElement.addEventListener('selectionchange', function () {
//     updateSearch();
//   });

//   searchHeadSearchInputElement.addEventListener('keyup', function () {
//     updateSearch();
//   });

//   searchHeadSearchInputElement.addEventListener('paste', function () {
//     updateSearch();
//   });

//   searchHeadSearchInputElement.addEventListener('cut', function () {
//     updateSearch();
//   });
// }

// function generateElementOfSearchResult(): HTMLElement {
//   const element = document.createElement('div');
//   element.classList.add('css_search_result');

//   const iconElement = document.createElement('div');
//   iconElement.classList.add('css_search_result_symbol');
//   iconElement.appendChild(getBlankIconElement());

//   const symbolNameElement = document.createElement('div');
//   symbolNameElement.classList.add('css_search_result_symbol_name');

//   element.appendChild(iconElement);
//   element.appendChild(symbolNameElement);
//   return element;
// }

// function updateSearch(): void {
//   const query = searchHeadSearchInputElement.value;
//   if (query === previousQuery) {
//     return;
//   }

//   const searchResults = searchFor(query);
//   updateSearchResults(searchResults);
//   previousQuery = query;
// }

// function updateSearchResults(searchResults: SearchResultArray): void {
//   function updateSearchResult(thisElement: HTMLElement, thisSearchResult: SearchResult, previousSearchResult: SearchResult | null): void {
//     function updateSymbol(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
//       const symbolElement = thisElement.querySelector('.css_search_result_symbol') as HTMLElement;
//       setGlyph(symbolElement, thisSearchResult[0]);
//     }

//     function updateSymbolName(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
//       const symbolNameElement = thisElement.querySelector('.css_search_result_symbol_name') as HTMLElement;
//       symbolNameElement.innerText = thisSearchResult[0];
//     }

//     function updateOnclick(thisElement: HTMLElement, thisSearchResult: SearchResult): void {
//       thisElement.onclick = function () {
//         showSymbol(thisSearchResult[0]);
//       };
//     }

//     if (previousSearchResult) {
//       if (thisSearchResult[0] !== previousSearchResult[0]) {
//         updateSymbol(thisElement, thisSearchResult);
//         updateSymbolName(thisElement, thisSearchResult);
//         updateOnclick(thisElement, thisSearchResult);
//       }
//     } else {
//       updateSymbol(thisElement, thisSearchResult);
//       updateSymbolName(thisElement, thisSearchResult);
//       updateOnclick(thisElement, thisSearchResult);
//     }
//   }

//   const searchResultsQuantity = searchResults.length;

//   const searchResultElements = Array.from(searchResultsElement.querySelectorAll('.css_search_result'));
//   const currentSearchResultElementsLength = searchResultElements.length;
//   if (searchResultsQuantity !== currentSearchResultElementsLength) {
//     const difference = currentSearchResultElementsLength - searchResultsQuantity;
//     if (difference < 0) {
//       const fragment = new DocumentFragment();
//       for (let o = 0; o > difference; o--) {
//         const newSearchResultElement = generateElementOfSearchResult();
//         fragment.appendChild(newSearchResultElement);
//         searchResultElements.push(newSearchResultElement);
//       }
//       searchResultsElement.append(fragment);
//     } else if (difference > 0) {
//       for (let p = currentSearchResultElementsLength - 1, q = currentSearchResultElementsLength - difference - 1; p > q; p--) {
//         searchResultElements[p].remove();
//         searchResultElements.splice(p, 1);
//       }
//     }
//   }

//   for (let i = 0; i < searchResultsQuantity; i++) {
//     const thisElement = searchResultElements[i] as HTMLElement;
//     const thisSymbol = searchResults[i];

//     if (previousSearchResults[i]) {
//       const previousSymbol = previousSearchResults[i];
//       updateSearchResult(thisElement, thisSymbol, previousSymbol);
//     } else {
//       updateSearchResult(thisElement, thisSymbol, null);
//     }
//   }

//   previousSearchResults = searchResults;
// }

// export function showSearch(): void {
//   searchField.setAttribute('displayed', 'true');
//   searchLightboxElement.setAttribute('displayed', 'true');
// }

// export function hideSearch(): void {
//   searchField.setAttribute('displayed', 'false');
//   searchLightboxElement.setAttribute('displayed', 'false');
// }

// export function openSearch(): void {
//   showSearch();
// }

// export function closeSearch(): void {
//   hideSearch();
// }
