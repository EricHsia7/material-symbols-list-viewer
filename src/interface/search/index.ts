const searchField = document.querySelector('.css_search_field') as HTMLElement;
const searchHeadElement = searchField.querySelector('.css_search_head') as HTMLElement;
const searchHeadLeftButtonElement = searchHeadElement.querySelector('.css_search_head_button_left') as HTMLElement;

let initialized: boolean = false;

export async function initializeSearchField() {
  if (initialized) {
    return;
  }
  initialized = true;

  searchHeadLeftButtonElement.onclick = function () {
    closeSearch();
  };
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
