import { getSearchIndex } from './apis/get-search-index';
import { getSimilarity } from './apis/get-similarity';

export interface Details {
  keywords: Array<string>;
  similarSymbols: Array<string>;
}

export async function getDetails(symbolName: string): Promise<Details> {
  const searchIndex = await getSearchIndex();
  const similarity = await getSimilarity();

  const dictionary = searchIndex.dictionary.split(',');
  const symbolNameComponents = symbolName.split('_');
  for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
    symbolNameComponents.splice(i, 1, dictionary.indexOf(symbolNameComponents[i]).toString(36));
  }
  const symbolKey = symbolNameComponents.join('_');
  if (!searchIndex.symbols.hasOwnProperty(symbolKey)) {
    return {
      keywords: [],
      similarSymbols: []
    };
  }

  const keywords: Array<string> = searchIndex.symbols[symbolKey].split(',');
  for (let i = keywords.length - 1; i >= 0; i--) {
    keywords.splice(i, 1, dictionary[parseInt(keywords[i], 36)]);
  }

  let similarSymbols: Array<string> = [];
  const symbols = similarity.symbols.split(',');
  const symbolKey1 = symbols.indexOf(symbolName);
  if (similarity.similarity.hasOwnProperty(symbolKey1)) {
    similarSymbols = similarity.similarity[symbolKey1].split(',');
    for (let i = similarSymbols.length - 1; i >= 0; i--) {
      similarSymbols.splice(i, 1, symbols[parseInt(similarSymbols[i], 36)]);
    }
  }

  return {
    keywords,
    similarSymbols
  };
}
