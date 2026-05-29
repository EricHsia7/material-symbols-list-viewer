import { Details, getDetails } from '../../data/details';
import { getBlankIconElement, setIcon } from '../icons';

const symbolField = document.querySelector('.css_symbol_field') as HTMLElement;
const headElement = symbolField.querySelector('.css_symbol_head') as HTMLElement;
const leftButtonElement = headElement.querySelector('.css_symbol_head_button_left') as HTMLElement;
const rightButtonElement = headElement.querySelector('.css_symbol_head_button_right') as HTMLElement;
const bodyElement = symbolField.querySelector('.css_symbol_body') as HTMLElement;
const symbolElement = bodyElement.querySelector('.css_symbol_symbol') as HTMLElement;
const symbolIconElement = symbolElement.querySelector('.css_symbol_symbol_icon') as HTMLElement;
const symbolNameElement = symbolElement.querySelector('.css_symbol_symbol_name') as HTMLElement;
const similarSymbolsElement = bodyElement.querySelector('.css_symbol_similar_symbols') as HTMLElement;

let previousSymbolName: string = '';
let previousSimilarSymbols: Details['similarSymbols'] = [];

leftButtonElement.onclick = function () {
  closeSymbol();
};

function generateElementOfSimilarSymbol(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_symbol_similar_symbol');

  const iconElement = document.createElement('div');
  iconElement.classList.add('css_symbol_similar_symbol_icon');
  iconElement.appendChild(getBlankIconElement());

  const symbolNameElement = document.createElement('div');
  symbolNameElement.classList.add('css_symbol_similar_symbol_name');

  element.appendChild(iconElement);
  element.appendChild(symbolNameElement);
  return element;
}

function updateSymbolField(symbolName: string, details: Details): void {
  function updateIcon(symbolName: string): void {
    setIcon(symbolIconElement, symbolName);
  }

  function updateName(symbolName: string): void {
    symbolNameElement.innerText = symbolName;
  }

  function updateSimilarSymbol(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string, previousSimilarSymbolName: string | null): void {
    function updateSimilarSymbolIcon(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string): void {
      const iconElement = thisSimilarSymbolElement.querySelector('.css_symbol_similar_symbol_icon') as HTMLElement;
      setIcon(iconElement, similarSymbolName);
    }

    function updateSimilarSymbolName(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string): void {
      const nameElement = thisSimilarSymbolElement.querySelector('.css_symbol_similar_symbol_name') as HTMLElement;
      nameElement.innerText = similarSymbolName;
    }

    if (previousSimilarSymbolName) {
      if (previousSimilarSymbolName !== similarSymbolName) {
        updateSimilarSymbolIcon(thisSimilarSymbolElement, similarSymbolName);
        updateSimilarSymbolName(thisSimilarSymbolElement, similarSymbolName);
      }
    } else {
      updateSimilarSymbolIcon(thisSimilarSymbolElement, similarSymbolName);
      updateSimilarSymbolName(thisSimilarSymbolElement, similarSymbolName);
    }
  }

  if (previousSymbolName !== symbolName) {
    updateIcon(symbolName);
    updateName(symbolName);
  }

  const similarSymbolsQuantity = details.similarSymbols.length;

  const similarSymbolElements = Array.from(similarSymbolsElement.querySelectorAll('.css_symbol_similar_symbol'));
  const currentSimilarSymbolElementsLength = similarSymbolElements.length;
  if (similarSymbolsQuantity !== currentSimilarSymbolElementsLength) {
    const difference = currentSimilarSymbolElementsLength - similarSymbolsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSimilarSymbolElement = generateElementOfSimilarSymbol();
        fragment.appendChild(newSimilarSymbolElement);
        similarSymbolElements.push(newSimilarSymbolElement);
      }
      similarSymbolsElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentSimilarSymbolElementsLength - 1, q = currentSimilarSymbolElementsLength - difference - 1; p > q; p--) {
        similarSymbolElements[p].remove();
        similarSymbolElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < similarSymbolsQuantity; i++) {
    const thisElement = similarSymbolElements[i] as HTMLElement;
    const thisSymbol = details.similarSymbols[i];

    if (previousSimilarSymbols[i]) {
      const previousSimilarSymbol = previousSimilarSymbols[i];
      updateSimilarSymbol(thisElement, thisSymbol, previousSimilarSymbol);
    } else {
      updateSimilarSymbol(thisElement, thisSymbol, null);
    }
  }

  previousSimilarSymbols = details.similarSymbols;
}

async function initializeSymbol(symbolName: string) {
  const details = await getDetails(symbolName);
  updateSymbolField(symbolName, details);
}

export function showSymbol(): void {
  symbolField.setAttribute('displayed', 'true');
}

export function hideSymbol(): void {
  symbolField.setAttribute('displayed', 'false');
}

export function openSymbol(symbolName: string): void {
  showSymbol();
  initializeSymbol(symbolName);
}

export function closeSymbol(): void {
  hideSymbol();
}
