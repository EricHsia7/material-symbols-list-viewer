import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch } from './data/search';
import { initializeSymbol } from './interface/index';
import { getQueryParameter } from './tools/query-parameter';

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

import './interface/related-symbols/index.css';
import './interface/related-symbols/head.css';
import './interface/related-symbols/body.css';

window.app = {
  initialize: async function () {
    await Promise.all([getSearchIndex(), getSimilarity()]);
    await initializeSearch();
    initializeSymbol(getQueryParameter('symbol') || 'interests');
  }
};

export default window.app;
