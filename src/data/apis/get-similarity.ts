import { fetchInflate } from '../loader';
import { getManifest } from './get-manifest';

/**
 * a stringified array of symbol names
 */
export type SimilaritySymbols = string;

/**
 * a base-36 index that represents the location of the symbol name in symbols
 */
export type SimilaritySimilarityKey = string;

/**
 * a stringified array of base-36 indices, where indices represent the location of the symbol name in symbols
 */
export type SimilaritySimilaritySymbols = string;

export type SimilaritySimilarity = Record<SimilaritySimilarityKey, SimilaritySimilaritySymbols>;

export interface Similarity {
  symbols: SimilaritySymbols;
  similarity: SimilaritySimilarity;
}

const variableCache_similarity = {
  available: false,
  data: {}
};

export async function getSimilarity(): Promise<Similarity> {
  if (variableCache_similarity.available) {
    return variableCache_similarity.data as Similarity;
  }
  const manifest = await getManifest();
  const url = `${manifest.similarity.compressed}?_=${manifest.similarity.sha256}`;
  const inflatedData = await fetchInflate(url);
  const data = JSON.parse(new TextDecoder().decode(inflatedData)) as Similarity;
  variableCache_similarity.available = true;
  variableCache_similarity.data = data;
  return data;
}
