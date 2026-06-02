import { getBlankIconElement, setGlyph } from '../icons';

function generateElementOfRelatedSymbol(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_related_symbol');

  const glyphElement = document.createElement('div');
  glyphElement.classList.add('css_related_symbol_glyph');
  glyphElement.appendChild(getBlankIconElement());

  const nameElement = document.createElement('div');
  nameElement.classList.add('css_related_symbol_name');

  element.appendChild(glyphElement);
  element.appendChild(nameElement);
  return element;
}

function updateRelatedSymbolsSection(): void {
  function updateRelatedSymbol(thisSimilarSymbolElement: HTMLElement, similarSymbolName: string, previousSimilarSymbolName: string | null): void {
    function updateGlyph(thisElement: HTMLElement, similarSymbolName: string): void {
      const glyphElement = thisElement.querySelector('.css_related_symbol_glyph') as HTMLElement;
      setGlyph(glyphElement, similarSymbolName);
    }

    function updateName(thisElement: HTMLElement, similarSymbolName: string): void {
      const nameElement = thisElement.querySelector('.css_related_symbol_name') as HTMLElement;
      nameElement.innerText = similarSymbolName;
    }

    function updateOnclick(thisElement: HTMLElement, similarSymbolName: string): void {
      thisElement.onclick = function () {
        openSymbol(similarSymbolName);
      };
    }

    if (previousSimilarSymbolName) {
      if (previousSimilarSymbolName !== similarSymbolName) {
        updateGlyph(thisSimilarSymbolElement, similarSymbolName);
        updateName(thisSimilarSymbolElement, similarSymbolName);
        updateOnclick(thisSimilarSymbolElement, similarSymbolName);
      }
    } else {
      updateGlyph(thisSimilarSymbolElement, similarSymbolName);
      updateName(thisSimilarSymbolElement, similarSymbolName);
      updateOnclick(thisSimilarSymbolElement, similarSymbolName);
    }
  }
}
