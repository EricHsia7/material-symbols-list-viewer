import { fetchData } from '../loader';
import { getNoCacheParameter } from '../tools/index';

type MaterialSymbols = string;

interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbolKey: string]: Array<number> };
}

export interface UnpackedMaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: MaterialSymbols]: Array<number> };
}

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data: UnpackedMaterialSymbolsSearchIndex = [];

function unpackMaterialSymbolsSearchIndex(data: MaterialSymbolsSearchIndex): UnpackedMaterialSymbolsSearchIndex {
  const dictionary = data.dictionary.split(',');
  for (const symbolKey in data.symbols) {
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i])]);
    }
    data.symbols[symbolNameComponents.join('_')] = data.symbols[symbolKey];
    delete data.symbols[symbolKey];
  }

  return data as UnpackedMaterialSymbolsSearchIndex;
}

export async function getMaterialSymbolsSearchIndex(): Promise<UnpackedMaterialSymbolsSearchIndex> {
  async function getData() {
    const data = await fetchData(`https://erichsia7.github.io/material-symbols-list/search-index.gz?_=${getNoCacheParameter(5000)}`);
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'material_symbols_list_search_index_cache';
  const cacheTimestamp = localStorage.getItem(0, `${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsSearchIndex(result);
    localStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime());
    localStorage.setItem(cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsSearchIndex(result);
      localStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime());
      localStorage.setItem(cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = localStorage.getItem(cacheKey);
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = JSON.parse(cache);
      }
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}
