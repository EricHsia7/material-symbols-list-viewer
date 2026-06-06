import { Details } from '../../data/details';
import { copyToClipboard } from '../../tools/copy';
import { setGlyph } from '../icons';
import { searchKeyword } from '../search';

const symbolSection = document.querySelector('.css_symbol_section') as HTMLElement;

const symbolStageElement = symbolSection.querySelector('.css_symbol_stage') as HTMLElement;
const symbolGlyphElement = symbolStageElement.querySelector('.css_symbol_glyph') as HTMLElement;

const symbolInfoElement = symbolSection.querySelector('.css_symbol_info') as HTMLElement;
const symbolCategory = symbolInfoElement.querySelector('.css_symbol_info_category') as HTMLElement;
const symbolNameElement = symbolInfoElement.querySelector('.css_symbol_info_name') as HTMLElement;
const symbolDescription = symbolInfoElement.querySelector('.css_symbol_info_description') as HTMLElement;
const keywordsElement = symbolInfoElement.querySelector('.css_symbol_info_keywords') as HTMLElement;
const symbolActionsElement = symbolInfoElement.querySelector('.css_symbol_info_actions') as HTMLElement;
const [symbolActionCopyNameElement, symbolActionShuffleElement, symbolActionCopyLinkElement] = symbolActionsElement.querySelectorAll('.css_symbol_info_action') as NodeListOf<HTMLElement>;

let previousSymbolName: string = '';
let previousKeywords: Details['keywords'] = [];

function generateElementOfKeyword(): HTMLElement {
  const element = document.createElement('div');
  element.classList.add('css_symbol_info_keyword');

  return element;
}

export function updateSymbolSection(symbolName: string, details: Details): void {
  function updateGlyph(symbolName: string): void {
    setGlyph(symbolGlyphElement, symbolName);
  }

  function updateCopyNameAction(symbolName: string): void {
    symbolActionCopyNameElement.onclick = function () {
      copySymbolName(symbolName);
    };
  }

  function updateCategory(): void {
    // TODO: details -> category
  }

  function updateName(symbolName: string): void {
    symbolNameElement.innerText = symbolName;
  }

  function updateDescription(description: Details['description']): void {
    symbolDescription.innerText = description;
  }

  function updateKeywords(keywords: Details['keywords']): void {
    function updateKeyword(thisElement: HTMLElement, thisKeyword: string, previousKeyword: string | null): void {
      function updateText(thisElement: HTMLElement, thisKeyword: string): void {
        thisElement.innerText = thisKeyword;
      }

      function updateOnclick(thisElement: HTMLElement, thisKeyword: string): void {
        thisElement.onclick = function () {
          searchKeyword(thisKeyword);
        };
      }

      if (previousKeyword) {
        if (thisKeyword !== previousKeyword) {
          updateText(thisElement, thisKeyword);
          updateOnclick(thisElement, thisKeyword);
        }
      } else {
        updateText(thisElement, thisKeyword);
        updateOnclick(thisElement, thisKeyword);
      }
    }

    const keywordsQuantity = keywords.length;

    const keywordElements = Array.from(keywordsElement.querySelectorAll('.css_symbol_info_keyword'));
    const currentKeywordElementsLength = keywordElements.length;
    if (keywordsQuantity !== currentKeywordElementsLength) {
      const difference = currentKeywordElementsLength - keywordsQuantity;
      if (difference < 0) {
        const fragment = new DocumentFragment();
        for (let o = 0; o > difference; o--) {
          const newKeywordElement = generateElementOfKeyword();
          fragment.appendChild(newKeywordElement);
          keywordElements.push(newKeywordElement);
        }
        keywordsElement.append(fragment);
      } else if (difference > 0) {
        for (let p = currentKeywordElementsLength - 1, q = currentKeywordElementsLength - difference - 1; p > q; p--) {
          keywordElements[p].remove();
          keywordElements.splice(p, 1);
        }
      }
    }

    for (let i = 0; i < keywordsQuantity; i++) {
      const thisElement = keywordElements[i] as HTMLElement;
      const thisKeyword = keywords[i];

      if (previousKeywords[i]) {
        const previousKeyword = previousKeywords[i];
        updateKeyword(thisElement, thisKeyword, previousKeyword);
      } else {
        updateKeyword(thisElement, thisKeyword, null);
      }
    }
  }

  if (previousSymbolName !== symbolName) {
    updateGlyph(symbolName);
    updateName(symbolName);
    updateCopyNameAction(symbolName);
    updateCategory();
    updateDescription(details.description);
    updateKeywords(details.keywords);
  }

  previousKeywords = details.keywords;
}

async function copySymbolName(symbolName: string) {
  const copy = await copyToClipboard(symbolName);
}
