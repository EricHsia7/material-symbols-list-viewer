import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch } from './data/search';
import { initializeGalleryField } from './interface/gallery';
import { initializeSearchField } from './interface/search';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/gallery/field.css';
import './interface/gallery/head.css';
import './interface/gallery/body.css';
import './interface/gallery/symbols.css';

import './interface/search/field.css';
import './interface/search/head.css';
import './interface/search/body.css';
import './interface/search/results.css';

window.viewer = {
  initialize: async function () {
    await initializeGalleryField();
    await Promise.all([getSearchIndex(), getSimilarity()]);
    await initializeSearch();
    await initializeSearchField();
  }
};

export default window.viewer;
