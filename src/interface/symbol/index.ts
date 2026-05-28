const symbolField = document.querySelector('.css_symbol_field') as HTMLElement;

export function showSymbol(): void {
  symbolField.setAttribute('displayed', 'true');
}

export function hideSymbol(): void {
  symbolField.setAttribute('displayed', 'false');
}

export function openSymbol(): void {
  showSymbol();
}

export function closeSymbol(): void {
  hideSymbol();
}
