import { Details, getDetails } from '../../data/details';
import { setIcon } from '../icons';

const symbolField = document.querySelector('.css_symbol_field') as HTMLElement;
const headElement = symbolField.querySelector('.css_symbol_head') as HTMLElement;
const leftButtonElement = headElement.querySelector('.css_symbol_head_button_left') as HTMLElement;
const rightButtonElement = headElement.querySelector('.css_symbol_head_button_right') as HTMLElement;
const bodyElement = symbolField.querySelector('.css_symbol_body') as HTMLElement;
const symbolElement = bodyElement.querySelector('.css_symbol_symbol') as HTMLElement;
const symbolIconElement = symbolElement.querySelector('.css_symbol_symbol_icon') as HTMLElement;
const symbolNameElement = symbolElement.querySelector('.css_symbol_symbol_name') as HTMLElement;

leftButtonElement.onclick = function () {
  closeSymbol();
};

let previousSymbolName: string = '';

function updateSymbolField(symbolName: string, details: Details): void {
  function updateIcon(symbolName: string): void {
    setIcon(symbolIconElement, symbolName);
  }

  function updateName(symbolName: string): void {
    symbolNameElement.innerText = symbolName;
  }

  function updateSimilarSymbolIcon(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string): void {
    const iconElement = thisSimilarSymbolElement.querySelector('.css_symbol_similar_symbol_icon') as HTMLElement;
    setIcon(iconElement, similarSymbolName);
  }

  function updateSimilarSymbolName(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string): void {
    const nameElement = thisSimilarSymbolElement.querySelector('.css_symbol_similar_symbol_name') as HTMLElement;
    nameElement.innerText = similarSymbolName;
  }

  if (previousSymbolName !== symbolName) {
    updateIcon(symbolName);
    updateName(symbolName);
  }
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
