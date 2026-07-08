import { fetchInflate } from '../loader';
import { getManifest } from './get-manifest';

export type DescriptionDictionary = string;

export type DescriptionDelimiters = Array<string>;

export type DescriptionSymbolKey = string;

export type DescriptionSymbolDescription = string;

export type DescriptionSymbols = Record<DescriptionSymbolKey, DescriptionSymbolDescription>;

export interface Description {
  dictionary: DescriptionDictionary;
  delimiters: DescriptionDelimiters;
  descriptions: DescriptionSymbols;
}

const variableCache_description = {
  available: false,
  data: {}
};

export async function getDescription(): Promise<Description> {
  if (variableCache_description.available) {
    return variableCache_description.data as Description;
  }
  const manifest = await getManifest();
  const url = `${manifest.description.compressed}?_=${manifest.description.sha256}`;
  const inflatedData = await fetchInflate(url);
  const data = JSON.parse(new TextDecoder().decode(inflatedData)) as Description;
  variableCache_description.available = true;
  variableCache_description.data = data;
  return data;
}
