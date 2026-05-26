export function getIconElement(identifier: string): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  iconElement.innerText = identifier;
  return iconElement;
}

export function getBlankIconElement(): HTMLSpanElement {
  const iconElement = document.createElement('span');
  iconElement.classList.add('css_material_symbols_rounded');
  return iconElement;
}

export function setIcon(parentElement: HTMLElement, identifier: string): void {
  const thisSpanElement = parentElement.querySelector('span.css_material_symbols_rounded') as HTMLElement;
  thisSpanElement.innerText = identifier;
}
