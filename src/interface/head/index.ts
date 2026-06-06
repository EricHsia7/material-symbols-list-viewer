import { showSearch } from '../search';

const headElement = document.querySelector('.css_head') as HTMLElement;
const headContainerElement = headElement.querySelector('.css_head_container') as HTMLElement;
const headSearchElement = headContainerElement.querySelector('.css_head_search') as HTMLElement;

export function initializeHeadEvents(): void {
  headSearchElement.addEventListener('click', function () {
    showSearch();
  });
}
