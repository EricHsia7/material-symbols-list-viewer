import { getIndex } from '../../data/apis/get-index';
import { getBlankIconElement, setIcon } from '../icons';
import { openSearch } from '../search';
import { openSymbol } from '../symbol';

const galleryField = document.querySelector('.css_gallery_field') as HTMLElement;
const galleryHeadElement = galleryField.querySelector('.css_gallery_head') as HTMLElement;
const galleryLeftButtonElement = galleryHeadElement.querySelector('.css_gallery_head_button_left') as HTMLElement;
const galleryRightButtonElement = galleryHeadElement.querySelector('.css_gallery_head_button_right') as HTMLElement;

const galleryBodyElement = galleryField.querySelector('.css_gallery_body') as HTMLElement;
const gallerySymbolsElement = galleryBodyElement.querySelector('.css_gallery_symbols') as HTMLElement;

galleryRightButtonElement.onclick = function () {
  openSearch();
};

let previousSymbols: Array<string> = [];
let previousSkeletonScreen: boolean = false;

function generateElementOfSymbol(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_gallery_symbols_symbol');
  element.appendChild(getBlankIconElement());
  return element;
}

function updateGalleryField(symbols: Array<string>, skeletonScreen: boolean): void {
  function updateSymbol(thisElement: HTMLElement, thisSymbol: string, previousSymbol: string | null) {
    function updateIcon(thisElement: HTMLElement, thisSymbol: string): void {
      setIcon(thisElement, thisSymbol);
    }

    function updateOnclick(thisElement: HTMLElement, thisSymbol: string): void {
      thisElement.onclick = function () {
        openSymbol(thisSymbol);
      };
    }

    function updateSkeletonScreen(thisElement: HTMLElement, skeletonScreen: boolean): void {
      thisElement.setAttribute('skeleton-screen', skeletonScreen ? 'true' : 'false');
    }

    if (thisSymbol !== previousSymbol) {
      updateIcon(thisElement, thisSymbol);
      updateOnclick(thisElement, thisSymbol);
    }
    if (previousSkeletonScreen !== skeletonScreen) {
      updateSkeletonScreen(thisElement, skeletonScreen);
    }
  }

  const symbolQuantity = symbols.length;

  const symbolElements = Array.from(gallerySymbolsElement.querySelectorAll('.css_gallery_symbols_symbol'));
  const currentSymbolElementsLength = symbolElements.length;
  if (symbolQuantity !== currentSymbolElementsLength) {
    const difference = currentSymbolElementsLength - symbolQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSymbolElement = generateElementOfSymbol();
        fragment.appendChild(newSymbolElement);
        symbolElements.push(newSymbolElement);
      }
      gallerySymbolsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentSymbolElementsLength - 1, q = currentSymbolElementsLength - difference - 1; p > q; p--) {
        symbolElements[p].remove();
        symbolElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < symbolQuantity; i++) {
    const thisElement = symbolElements[i] as HTMLElement;
    const thisSymbol = symbols[i];

    if (previousSymbols[i]) {
      const previousSymbol = previousSymbols[i];
      updateSymbol(thisElement, thisSymbol, previousSymbol);
    } else {
      updateSymbol(thisElement, thisSymbol, null);
    }
  }

  previousSymbols = symbols;
  previousSkeletonScreen = skeletonScreen;
}

export async function initializeGalleryField() {
  updateGalleryField(new Array(64).fill(''), true);
  const index = await getIndex();
  const symbols = index.list.split(',');
  updateGalleryField(symbols, false);
}

export function showGallery(): void {
  galleryField.setAttribute('displayed', 'true');
}

export function hideGallery(): void {
  galleryField.setAttribute('displayed', 'false');
}

export function openGallery(): void {
  showGallery();
  initializeGalleryField();
}

export function closeGallery(): void {
  hideGallery();
}
