import { Details, getDetails } from '../../data/details';
import { copyToClipboard } from '../../tools/copy';
import { getBlankIconElement, setGlyph } from '../icons';

const symbolSection = document.querySelector('.css_symbol_section') as HTMLElement;

const symbolStageElement = symbolSection.querySelector('.css_symbol_stage') as HTMLElement;
const symbolGlyphElement = symbolStageElement.querySelector('.css_symbol_glyph') as HTMLElement;
const symbolGlyphActionsElement = symbolStageElement.querySelector('.css_symbol_glyph_actions') as HTMLElement;

const symbolInfoElement = symbolSection.querySelector('.css_symbol_info') as HTMLElement;
const symbolCategory = symbolInfoElement.querySelector('.css_symbol_similar_symbols') as HTMLElement;
const symbolNameElement = symbolInfoElement.querySelector('.css_symbol_name') as HTMLElement;
const symbolDescription = symbolInfoElement.querySelector('.css_symbol_similar_symbols') as HTMLElement;
const keywordsElement = symbolInfoElement.querySelector('.css_symbol_keywords') as HTMLElement;

let previousSymbolName: string = '';
let previousSimilarSymbols: Details['similarSymbols'] = [];

function updateSymbolSection(symbolName: string, details: Details): void {
  function updateGlyph(symbolName: string): void {
    setGlyph(symbolGlyphElement, symbolName);
  }

  function updateCopyButton(symbolName: string): void {
    // copySymbolName(symbolName);
  }

  function updateCategory(): void {}

  function updateName(): void {}

  function updateDescription(): void {}

  function updateKeywords(): void {}

  if (previousSymbolName !== symbolName) {
    updateIcon(symbolName);
    updateName(symbolName);
    updateCopyButton(symbolName);
    updateKeywords(details.keywords);
  }

  const similarSymbolsQuantity = details.similarSymbols.length;

  const similarSymbolElements = Array.from(similarSymbolsElement.querySelectorAll('.css_symbol_similar_symbol'));
  const currentSimilarSymbolElementsLength = similarSymbolElements.length;
  if (similarSymbolsQuantity !== currentSimilarSymbolElementsLength) {
    const difference = currentSimilarSymbolElementsLength - similarSymbolsQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSimilarSymbolElement = generateElementOfRelatedSymbol();
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
  updateSymbolSection(symbolName, details);
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

async function copySymbolName(symbolName: string) {
  const copy = await copyToClipboard(symbolName);
  if (copy) {
    rightButtonElement.setAttribute('copied', 'true');
    setTimeout(function () {
      rightButtonElement.setAttribute('copied', 'false');
    }, 1000);
  }
}
