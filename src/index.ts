import { getIndex } from './data/apis/get-index';
import { getManifest } from './data/apis/get-manifest';
import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch, searchFor } from './data/search';

window.materialSymbolsListViewer = {
  initialize: async function () {
    await getManifest();
    await Promise.all([getIndex(), getSearchIndex(), getSimilarity()]);
    await initializeSearch();

    console.log(searchFor('code'));
  }
};

export default window.materialSymbolsListViewer;
