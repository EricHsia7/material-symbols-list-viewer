import { getDetails } from '../data/details';
import { setQueryParameter } from '../tools/query-parameter';
import { updateRelatedSymbolsSection } from './related-symbols';
import { updateSymbolSection } from './symbol';

export async function initializeSymbol(symbolName: string) {
  const details = await getDetails(symbolName);
  updateSymbolSection(symbolName, details);
  updateRelatedSymbolsSection(details.similarSymbols);
  setQueryParameter('symbol', symbolName);
}
