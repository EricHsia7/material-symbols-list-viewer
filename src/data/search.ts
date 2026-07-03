import { getSearchIndex } from './apis/get-search-index';

export type SearchResult = [symbolName: string, score: number];
export type SearchResultArray = Array<SearchResult>;

export type wordIndexKey = string;

export interface SearchStructure {
  dictionary: Array<string>;
  names: Array<string>;
  wordToSymbols: Record<wordIndexKey, Array<number>>;
  symbolToWords: Array<Array<number>>;
}

const searchWorkerResolution: Array<Function> = [];
let port;

// Check if SharedWorker is supported, and fall back to Worker if not
if (typeof SharedWorker !== 'undefined') {
  const searchSharedWorker = new SharedWorker(new URL('./search-worker.ts', import.meta.url)); // Reusable shared worker
  port = searchSharedWorker.port; // Access the port for communication
  port.start(); // Start the port (required by some browsers)
} else {
  const searchWorker = new Worker(new URL('./search-worker.ts', import.meta.url)); // Fallback to standard worker
  port = searchWorker; // Use Worker directly for communication
}

// Handle messages from the worker
port.onmessage = function (e) {
  const result = e.data;
  const resolve = searchWorkerResolution.shift();
  if (resolve) {
    resolve(result); // Resolve the correct promise
  }
};

// Handle errors
// port.onerror = function (e) {
//   const reject = searchWorkerRejection.shift();
//   if (reject) {
//     reject(e);
//   }
//   console.error(e);
// };

export async function initializeSearch(): Promise<true> {
  const searchIndex = await getSearchIndex();

  const result = await new Promise((resolve, reject) => {
    searchWorkerResolution.push(resolve); // Store the resolve function

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage({ type: 0, searchIndex }); // Send the task to the worker
  });

  return result;
}

export async function searchFor(query: string, searchFrom: number = 0, skipBroadTerms: boolean = true, broadThreshold: number = 0.3): Promise<SearchResultArray> {
  const result = await new Promise((resolve, reject) => {
    searchWorkerResolution.push(resolve); // Store the resolve function

    port.onerror = function (e) {
      reject(e.message);
    };

    port.postMessage({ type: 1, query, searchFrom, skipBroadTerms, broadThreshold }); // Send the task to the worker
  });

  return result;
}
