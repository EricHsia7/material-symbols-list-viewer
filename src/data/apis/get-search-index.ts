
/**
 * base-36 indices concatentated with underscores, where indices represent the location of words in the dictionary (0_1_2_3)
 */
export type SearchIndexSymbolKey = string 

/**
 * a stringified array of base-36 indices, where indices represent the location of words in the dictionary (0,1,2,3,...)
 */
export type SearchIndexSymbolKeywords = string

/**
 * a key-value paired object that maps symbol keys to keywords
 */
export type SearchIndexSymbols = Record<SearchIndexSymbolKey, SearchIndexSymbolKeywords>;

/**
 * a stringified array of words (word_1,word_2,word_3,...)
 */
export type SearchIndexDictionary = string


export interface SearchIndex {
  dictionary: SearchIndexDictionary;
  symbols: SearchIndexSymbols;
}

async function getSearchIndex() {}
