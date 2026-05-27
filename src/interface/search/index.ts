import { searchFor } from '../../data/search';

const searchField = document.querySelector('.css_search_field') as HTMLElement;
const searchHeadElement = searchField.querySelector('.css_search_head') as HTMLElement;
const searchHeadLeftButtonElement = searchHeadElement.querySelector('.css_search_head_button_left') as HTMLElement;
const searchHeadSearchInputElement = searchHeadElement.querySelector('.css_search_head_search_input input[type="text"]') as HTMLInputElement;

let initialized: boolean = false;

export async function initializeSearchField() {
  if (initialized) {
    return;
  }
  initialized = true;

  searchHeadLeftButtonElement.onclick = function () {
    closeSearch();
  };

  searchHeadSearchInputElement.addEventListener('selectionchange', function () {
    updateSearchResults();
  });

  searchHeadSearchInputElement.addEventListener('keyup', function () {
    updateSearchResults();
  });

  searchHeadSearchInputElement.addEventListener('paste', function () {
    updateSearchResults();
  });

  searchHeadSearchInputElement.addEventListener('cut', function () {
    updateSearchResults();
  });
}

function updateSearchResults(): void {
  console.log(searchFor(searchHeadSearchInputElement.value));
}

export function showSearch(): void {
  searchField.setAttribute('displayed', 'true');
}

export function hideSearch(): void {
  searchField.setAttribute('displayed', 'false');
}

export function openSearch(): void {
  showSearch();
}

export function closeSearch(): void {
  hideSearch();
}
