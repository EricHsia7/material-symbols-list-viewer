import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch } from './data/search';
import { showSymbol } from './interface/symbol';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

// import './interface/search/lightbox.css';
// import './interface/search/field.css';
// import './interface/search/head.css';
// import './interface/search/body.css';
// import './interface/search/results.css';

import './interface/symbol/index.css';
import './interface/symbol/stage.css';
import './interface/symbol/info.css';

window.app = {
  initialize: async function () {
    await Promise.all([getSearchIndex(), getSimilarity()]);
    await initializeSearch();
    showSymbol('interests');
  }
};

export default window.app;
