import { initializeSymbol } from '..';
import { Details } from '../../data/details';
import { getBlankIconElement, setGlyph } from '../icons';

const relatedSymbolsSection = document.querySelector('.css_related_symbols_section') as HTMLElement;
const bodyElement = relatedSymbolsSection.querySelector('.css_related_symbol_body') as HTMLElement;

let previousSymbolNames: Details['similarSymbols'] = [];

function generateElementOfSymbol(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_related_symbol');

  const glyphElement = document.createElement('div');
  glyphElement.classList.add('css_related_symbol_glyph');
  glyphElement.appendChild(getBlankIconElement());

  const textElement = document.createElement('div');
  textElement.classList.add('css_related_symbol_text');

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_related_symbol_name');

  const descriptionElement = document.createElement('div');
  descriptionElement.classList.add('css_related_symbol_description');

  element.appendChild(glyphElement);
  textElement.appendChild(nameElement);
  textElement.appendChild(descriptionElement);
  element.appendChild(textElement);
  return element;
}

export function updateRelatedSymbolsSection(symbolNames: Details['similarSymbols']): void {
  function updateSymbol(thisElement: HTMLElement, thisSymbolName: string, previousSymbolName: string | null): void {
    function updateGlyph(thisElement: HTMLElement, thisSymbolName: string): void {
      const glyphElement = thisElement.querySelector('.css_related_symbol_glyph') as HTMLElement;
      setGlyph(glyphElement, thisSymbolName);
    }

    function updateName(thisElement: HTMLElement, thisSymbolName: string): void {
      const textElement = thisElement.querySelector('.css_related_symbol_text') as HTMLElement;
      const nameElement = textElement.querySelector('.css_related_symbol_name') as HTMLElement;
      nameElement.innerText = thisSymbolName;
    }

    function updateDescription(thisElement: HTMLElement): void {}

    function updateOnclick(thisElement: HTMLElement, thisSymbolName: string): void {
      thisElement.onclick = function () {
        initializeSymbol(thisSymbolName);
      };
    }

    if (previousSymbolName) {
      if (previousSymbolName !== thisSymbolName) {
        updateGlyph(thisElement, thisSymbolName);
        updateName(thisElement, thisSymbolName);
        updateOnclick(thisElement, thisSymbolName);
      }
    } else {
      updateGlyph(thisElement, thisSymbolName);
      updateName(thisElement, thisSymbolName);
      updateOnclick(thisElement, thisSymbolName);
    }
  }

  const symbolNamesQuantity = symbolNames.length;

  const symbolElements = Array.from(bodyElement.querySelectorAll('.css_related_symbol'));
  const currentSymbolElementsLength = symbolElements.length;
  if (symbolNamesQuantity !== currentSymbolElementsLength) {
    const difference = currentSymbolElementsLength - symbolNamesQuantity;
    if (difference < 0) {
      const fragment = new DocumentFragment();
      for (let o = 0; o > difference; o--) {
        const newSymbolElement = generateElementOfSymbol();
        fragment.appendChild(newSymbolElement);
        symbolElements.push(newSymbolElement);
      }
      bodyElement.append(fragment);
    } else if (difference > 0) {
      for (let p = currentSymbolElementsLength - 1, q = currentSymbolElementsLength - difference - 1; p > q; p--) {
        symbolElements[p].remove();
        symbolElements.splice(p, 1);
      }
    }
  }

  for (let i = 0; i < symbolNamesQuantity; i++) {
    const thisElement = symbolElements[i] as HTMLElement;
    const thisSymbolName = symbolNames[i];

    if (previousSymbolNames[i]) {
      const previousSymbolName = previousSymbolNames[i];
      updateSymbol(thisElement, thisSymbolName, previousSymbolName);
    } else {
      updateSymbol(thisElement, thisSymbolName, null);
    }
  }

  previousSymbolNames = symbolNames;
}
