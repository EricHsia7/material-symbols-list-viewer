/**
 * direct link to the data
 */
export type ManifestDataURL = string;

/**
 * hash of the raw data
 */
export type ManifestDataHash = string;

export interface ManifestData {
  raw: ManifestDataURL;
  compressed: ManifestDataURL;
  md5: ManifestDataHash;
  sha256: ManifestDataHash;
  sha512: ManifestDataHash;
}

export type ManifestDataType = 'search_index' | 'index' | 'similarity' | 'description';

export type Manifest = Record<ManifestDataType, ManifestData>;

const variableCache_manifest = {
  available: false,
  data: {}
};

export async function getManifest(): Promise<Manifest> {
  if (variableCache_manifest.available) {
    return variableCache_manifest.data as Manifest;
  }
  const url = `https://erichsia7.github.io/material-symbols-list/manifest.json?_${new Date().getTime()}`;
  const response = await fetch(url);
  const json = (await response.json()) as Manifest;

  variableCache_manifest.available = true;
  variableCache_manifest.data = json;
  return json;
}
