export function getIconElement(identifier: string): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  iconElement.textContent = identifier;
  return iconElement;
}

export function getBlankIconElement(): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  return iconElement;
}

export function setGlyph(parentElement: HTMLElement, identifier: string): void {
  const thisSpanElement = parentElement.querySelector('span.css_material_symbols_rounded') as HTMLElement;
  thisSpanElement.textContent = identifier;
}
