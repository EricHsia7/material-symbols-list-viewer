import { getIntersection } from '../tools/array';
import { levenshtein } from '../tools/levenshtein';
import { SearchIndex } from './apis/get-search-index';
import { SearchResultArray, SearchStructure } from './search';

let variableCache_searchStructure_available: boolean = false;
let variableCache_searchStructure: SearchStructure = { dictionary: [], names: [], wordToSymbols: {}, symbolToWords: [] };
let initialized: boolean = false;

function initialize(searchIndex: SearchIndex) {
  if (initialized) return;
  initialized = true;

  const dictionary = searchIndex.dictionary.split(',');
  const symbols = searchIndex.symbols;
  const names = [];
  const wordToSymbols: SearchStructure['wordToSymbols'] = {}; // { w0: [0, 2], ... }
  const symbolToWords: SearchStructure['symbolToWords'] = []; // [[0, 1, 2, 3], [4, 5, 6], ...]

  let nameIndex = 0;
  for (const symbolKey in symbols) {
    // Create list of symbol names
    const symbolNameComponents = symbolKey.split('_');
    for (let i = symbolNameComponents.length - 1; i >= 0; i--) {
      symbolNameComponents.splice(i, 1, dictionary[parseInt(symbolNameComponents[i], 36)]);
    }
    const symbol = symbolNameComponents.join('_');
    names.push(symbol);
    // Build wordIndex → nameIndex mapping
    const wordIndexes = symbols[symbolKey].split(',').map((k) => parseInt(k, 36));
    for (const wordIndex of wordIndexes) {
      const key = `w${wordIndex}`;
      if (!wordToSymbols.hasOwnProperty(key)) {
        wordToSymbols[key] = [];
      }
      wordToSymbols[key].push(nameIndex);
    }
    symbolToWords.push(wordIndexes);
    nameIndex++;
  }

  variableCache_searchStructure_available = true;
  variableCache_searchStructure = { dictionary, names, wordToSymbols, symbolToWords };
}

function search(query: string, searchFrom: number = 0, skipBroadTerms: boolean = true, broadThreshold: number = 0.3): SearchResultArray {
  if (!variableCache_searchStructure_available) {
    return [];
  }

  const { dictionary, names, wordToSymbols, symbolToWords } = variableCache_searchStructure;

  const broadLength = Math.round(names.length * broadThreshold);

  // Split query
  const queryWords = Array.from(
    new Set(
      query
        .trim()
        .toLowerCase()
        .split(/[\s_\-]+/)
    )
  );
  const queryWordsLength = queryWords.length;

  // Fuzzy match words to dictionary indices
  const minDistances = new Uint8Array(queryWordsLength);
  const matchedWordIndexes = new Int16Array(queryWordsLength).fill(-1);

  for (let j = searchFrom; j < queryWordsLength; j++) {
    minDistances[j] = queryWords[j].length;
    for (let i = 0, l = dictionary.length; i < l; i++) {
      const distance = levenshtein(queryWords[j], dictionary[i]);
      if (distance <= minDistances[j]) {
        minDistances[j] = distance;
        matchedWordIndexes[j] = i;
      }
    }
  }

  // Pair words with symbols
  let indexArrays = [];
  for (let i = queryWordsLength - 1; i >= 0; i--) {
    if (matchedWordIndexes[i] < 0) continue;
    const arr = wordToSymbols[`w${matchedWordIndexes[i]}`] || [];
    if (skipBroadTerms && arr.length > broadLength) continue;
    indexArrays.push(arr);
  }

  const indexArraysLength = indexArrays.length;

  if (indexArraysLength === 0) return [];

  // Sort by length (shortest → longest)
  indexArrays.sort((a, b) => a.length - b.length);

  // Intersect
  let candidates = indexArrays[0];
  for (let i = 1; i < indexArraysLength; i++) {
    candidates = getIntersection(candidates, indexArrays[i]);
  }

  // Rank candidates
  const scored: SearchResultArray = [];
  for (let i = 0, l = candidates.length; i < l; i++) {
    let score = 0;
    for (let j = queryWordsLength - 1; j >= 0; j--) {
      if (matchedWordIndexes[j] < 0) continue;
      const symbolWordIndexes = wordToSymbols[`w${matchedWordIndexes[j]}`] || [];
      if (symbolWordIndexes.indexOf(candidates[i]) > -1) {
        score -= j + (symbolToWords[candidates[i]].indexOf(matchedWordIndexes[j]) + 1) * matchedWordIndexes[j];
        // earlier query words && higher proability = higher weight
      }
    }
    scored.push([names[candidates[i]], score]);
  }

  scored.sort((a, b) => b[1] - a[1]);
  return scored;
}

interface SearchWorkerTaskInitialize {
  type: 0;
  searchIndex: SearchIndex;
  port: any;
}

interface SearchWorkerTaskSearch {
  type: 1;
  query: string;
  searchFrom: number;
  skipBroadTerms: boolean;
  broadThreshold: number;
  port: any;
}

type SearchWorkerTask = SearchWorkerTaskInitialize | SearchWorkerTaskSearch;

const taskQueue: Array<SearchWorkerTask> = [];
let isProcessing: boolean = false;

if ('onconnect' in self) {
  self.onconnect = function (e) {
    const port = e.ports[0];

    port.onmessage = function (event) {
      const data = event.data;
      if (data.type === 0) {
        const { type, searchIndex } = data;
        taskQueue.push({ type, searchIndex, port });
        processWorkerTask();
      } else if (data.type === 1) {
        const { type, query, searchFrom, skipBroadTerms, broadThreshold } = data;
        taskQueue.push({ type, query, searchFrom, skipBroadTerms, broadThreshold, port });
        processWorkerTask();
      }
    };
  };
} else {
  const port = self;

  self.onmessage = function (event) {
    const data = event.data;
    if (data.type === 0) {
      const { type, searchIndex } = data;
      taskQueue.push({ type, searchIndex, port });
      processWorkerTask();
    } else if (data.type === 1) {
      const { type, query, searchFrom, skipBroadTerms, broadThreshold } = data;
      taskQueue.push({ type, query, searchFrom, skipBroadTerms, broadThreshold, port });
      processWorkerTask();
    }
  };
}

function processWorkerTask(): void {
  if (isProcessing || taskQueue.length === 0) return;

  isProcessing = true;
  const task = taskQueue.shift() as SearchWorkerTask;

  if (task.type === 0) {
    initialize(task.searchIndex);
    task.port.postMessage(true);
  } else if (task.type === 1) {
    const result = search(task.query, task.searchFrom, task.skipBroadTerms, task.broadThreshold);
    // Send the result back to the main thread
    task.port.postMessage(result);
  }
  isProcessing = false;
  processWorkerTask(); // Process next task in queue, if any
}
