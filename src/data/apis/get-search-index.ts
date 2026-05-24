import { fetchData } from '../loader';
import { getManifest } from './get-manifest';

/**
 * base-36 indices concatentated with underscores, where indices represent the location of words in the dictionary (0_1_2_3)
 */
export type SearchIndexSymbolKey = string;

/**
 * a stringified array of base-36 indices, where indices represent the location of words in the dictionary (0,1,2,3,...)
 */
export type SearchIndexSymbolKeywords = string;

/**
 * a key-value paired object that maps symbol keys to keywords
 */
export type SearchIndexSymbols = Record<SearchIndexSymbolKey, SearchIndexSymbolKeywords>;

/**
 * a stringified array of words (word_1,word_2,word_3,...)
 */
export type SearchIndexDictionary = string;

export interface SearchIndex {
  dictionary: SearchIndexDictionary;
  symbols: SearchIndexSymbols;
}

const variableCache_searchIndex = {
  available: false,
  data: {}
};

export async function getSearchIndex(): Promise<SearchIndex> {
  if (variableCache_searchIndex.available) {
    return variableCache_searchIndex.data as SearchIndex;
  }
  const manifest = await getManifest();
  const url = `${manifest.search_index.compressed}?_=${manifest.search_index.sha256}`;
  const data = (await fetchData(url)) as SearchIndex;
  variableCache_searchIndex.available = true;
  variableCache_searchIndex.data = data;
  return data;
}
