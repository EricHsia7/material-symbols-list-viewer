import { fetchInflate } from '../loader';
import { getManifest } from './get-manifest';

export interface Index {
  list: string;
}

const variableCache_index = {
  available: false,
  data: {}
};

export async function getIndex(): Promise<Index> {
  if (variableCache_index.available) {
    return variableCache_index.data as Index;
  }
  const manifest = await getManifest();
  const url = `${manifest.index.compressed}?_=${manifest.index.sha256}`;
  const inflatedData = await fetchInflate(url);
  const data = JSON.parse(new TextDecoder().decode(inflatedData)) as Index;
  variableCache_index.available = true;
  variableCache_index.data = data;
  return data;
}
