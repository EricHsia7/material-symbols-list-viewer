import { joinByDelimiters, splitByDelimiter } from '../tools/split';
import { getDescription } from './apis/get-description';
import { getSearchIndex } from './apis/get-search-index';
import { getSimilarity } from './apis/get-similarity';

export interface Details {
  keywords: Array<string>;
  similarSymbols: Array<string>;
  description: string;
}

export async function getDetails(symbolName: string): Promise<Details> {
  const searchIndex = await getSearchIndex();
  const similarity = await getSimilarity();
  const description = await getDescription();

  const searchIndexDictionary = searchIndex.dictionary.split(',');
  const searchIndexSymbolNameComponents = symbolName.split('_');
  for (let i = searchIndexSymbolNameComponents.length - 1; i >= 0; i--) {
    searchIndexSymbolNameComponents.splice(i, 1, searchIndexDictionary.indexOf(searchIndexSymbolNameComponents[i]).toString(36));
  }
  const searchIndexSymbolKey = searchIndexSymbolNameComponents.join('_');
  if (!searchIndex.symbols.hasOwnProperty(searchIndexSymbolKey)) {
    return {
      keywords: [],
      similarSymbols: [],
      description: ''
    };
  }

  const keywords: Array<string> = searchIndex.symbols[searchIndexSymbolKey].split(',');
  for (let i = keywords.length - 1; i >= 0; i--) {
    keywords.splice(i, 1, searchIndexDictionary[parseInt(keywords[i], 36)]);
  }

  let similarSymbols: Array<string> = [];
  const symbols = similarity.symbols.split(',');
  const symbolKey1 = symbols.indexOf(symbolName).toString(36);
  if (similarity.similarity.hasOwnProperty(symbolKey1)) {
    similarSymbols = similarity.similarity[symbolKey1].split(',');
    for (let i = similarSymbols.length - 1; i >= 0; i--) {
      similarSymbols.splice(i, 1, symbols[parseInt(similarSymbols[i], 36)]);
    }
  }

  let thisDescription: string = '';
  const descriptionDictionary = description.dictionary.split(',');
  const descriptionSymbolNameComponents = symbolName.split('_');
  for (let i = descriptionSymbolNameComponents.length - 1; i >= 0; i--) {
    descriptionSymbolNameComponents.splice(i, 1, descriptionDictionary.indexOf(descriptionSymbolNameComponents[i]).toString(36));
  }
  const descriptionSymbolKey = descriptionSymbolNameComponents.join('_');
  if (description.descriptions.hasOwnProperty(descriptionSymbolKey)) {
    const { result: wordKeys, delimiters } = splitByDelimiter(description.descriptions[descriptionSymbolKey], description.delimiters);
    for (let i = wordKeys.length - 1; i >= 0; i--) {
      wordKeys.splice(i, 1, descriptionDictionary[parseInt(wordKeys[i], 36)]);
    }
    thisDescription = joinByDelimiters(wordKeys, delimiters);
  }

  return {
    keywords: keywords,
    similarSymbols: similarSymbols,
    description: thisDescription
  };
}
