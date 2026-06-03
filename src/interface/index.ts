import { getDetails } from '../data/details';
import { updateRelatedSymbolsSection } from './related-symbols';
import { updateSymbolSection } from './symbol';

export async function initializeSymbol(symbolName: string) {
  const details = await getDetails(symbolName);
  updateSymbolSection(symbolName, details);
  updateRelatedSymbolsSection(details.similarSymbols);
}
