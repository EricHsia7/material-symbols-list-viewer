import { getSearchIndex } from './data/apis/get-search-index';
import { getSimilarity } from './data/apis/get-similarity';
import { initializeSearch } from './data/search';
import { initializeSymbol } from './interface/index';
import { getQueryParameter } from './tools/query-parameter';
import { getManifest } from './data/apis/get-manifest';
import { initializeSearchEvents } from './interface/search';

import './interface/theme.css';

import './interface/index.css';

import './interface/icons/index.css';

import './interface/search/index.css';
import './interface/search/panel.css';
import './interface/search/input.css';
import './interface/search/results.css';

import './interface/symbol/index.css';
import './interface/symbol/stage.css';
import './interface/symbol/info.css';

import './interface/related-symbols/index.css';
import './interface/related-symbols/head.css';
import './interface/related-symbols/body.css';

interface AppWindow extends Window {
  app: {
    initialize: Function;
  };
}

(window as unknown as AppWindow).app = {
  initialize: async function () {
    await getManifest();
    await Promise.all([getSearchIndex(), getSimilarity()]);
    await initializeSearch();

    initializeSymbol(getQueryParameter('symbol') || 'interests');

    window.addEventListener('popstate', function () {
      initializeSymbol(getQueryParameter('symbol') || 'interests');
    });
  }
};

export default (window as unknown as AppWindow).app;
