interface MaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbolKey: string]: string };
}

export interface UnpackedMaterialSymbolsSearchIndex {
  dictionary: string;
  symbols: { [symbol: string]: Array<number> };
}

let MaterialSymbolsAPIVariableCache_available: boolean = false;
let MaterialSymbolsAPIVariableCache_data = {} as UnpackedMaterialSymbolsSearchIndex;

function unpackMaterialSymbolsSearchIndex(data: MaterialSymbolsSearchIndex): UnpackedMaterialSymbolsSearchIndex {
  const unpackedData: UnpackedMaterialSymbolsSearchIndex = {
    dictionary: data.dictionary,
    symbols: {}
  };
  const dictionary = data.dictionary.split(',');
  for (const symbolKey in data.symbols) {
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i], 36)]);
    }
    unpackedData.symbols[symbolNameComponents.join('_')] = data.symbols[symbolKey].split(',').map((k) => parseInt(k, 36));
  }
  return unpackedData as UnpackedMaterialSymbolsSearchIndex;
}

export async function getMaterialSymbolsSearchIndex(): Promise<UnpackedMaterialSymbolsSearchIndex> {
  async function getData(): Promise<MaterialSymbolsSearchIndex> {
    const url = `https://erichsia7.github.io/material-symbols-list/search-index.json?_=${new Date().getTime()}`;
    const response = await fetch(url);
    const data = (await response.json()) as MaterialSymbolsSearchIndex;
    return data;
  }

  const cacheTimeToLive = 60 * 60 * 24 * 7 * 1000;
  const cacheKey = 'material_symbols_search_index_cache';
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);
  if (cacheTimestamp === null) {
    const result = await getData();
    const unpacked = unpackMaterialSymbolsSearchIndex(result);
    localStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());
    localStorage.setItem(cacheKey, JSON.stringify(unpacked));
    if (!MaterialSymbolsAPIVariableCache_available) {
      MaterialSymbolsAPIVariableCache_available = true;
      MaterialSymbolsAPIVariableCache_data = unpacked;
    }
    return unpacked;
  } else {
    if (new Date().getTime() - parseInt(cacheTimestamp, 10) > cacheTimeToLive) {
      const result = await getData();
      const unpacked = unpackMaterialSymbolsSearchIndex(result);
      localStorage.setItem(`${cacheKey}_timestamp`, new Date().getTime().toString());
      localStorage.setItem(cacheKey, JSON.stringify(unpacked));
      if (!MaterialSymbolsAPIVariableCache_available) {
        MaterialSymbolsAPIVariableCache_available = true;
        MaterialSymbolsAPIVariableCache_data = unpacked;
      }
      return unpacked;
    } else {
      if (!MaterialSymbolsAPIVariableCache_available) {
        const cache = localStorage.getItem(cacheKey);
        if (cache) {
          MaterialSymbolsAPIVariableCache_available = true;
          MaterialSymbolsAPIVariableCache_data = JSON.parse(cache);
        }
      }
      return MaterialSymbolsAPIVariableCache_data;
    }
  }
}
