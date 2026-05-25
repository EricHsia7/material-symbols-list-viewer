import { getIndex } from './data/apis/get-index';
import { getManifest } from './data/apis/get-manifest';
import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch, searchFor } from './data/search';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/gallery/field.css';
import './interface/gallery/head.css';
import './interface/gallery/body.css';

window.viewer = {
  initialize: async function () {
    await getManifest();
    await Promise.all([getIndex(), getSearchIndex(), getSimilarity()]);
    await initializeSearch();

    console.log(searchFor('code'));
  }
};

export default window.viewer;
