const toastElement = document.querySelector('.css_toast') as HTMLElement;
const toastGlyphElement = toastElement.querySelector('.css_toast_glyph') as HTMLElement;
const toastGlyphSpanElement = toastGlyphElement.querySelector('span.css_material_symbols_rounded') as HTMLElement;
const toastMessageElement = toastElement.querySelector('.css_toast_message') as HTMLElement;
const toastButtonElement = toastElement.querySelector('.css_toast_button') as HTMLElement;

export interface ToastButton {
  text: string;
  action: Function;
}

export function showToast(glyph: string, message: string, button?: ToastButton | null): void {
  const toastElementAnimations = toastElement.getAnimations();
  const toastIconSpanElementAnimations = toastGlyphSpanElement.getAnimations();

  for (const animation of toastElementAnimations) {
    animation.cancel();
    animation.play();
  }

  for (const animation of toastIconSpanElementAnimations) {
    animation.cancel();
    animation.play();
  }

  toastGlyphSpanElement.textContent = glyph;
  toastMessageElement.textContent = message;

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      toastButtonElement.textContent = button.text;
      toastButtonElement.addEventListener(
        'click',
        function () {
          button.action();
        },
        { once: true }
      );
      toastElement.appendChild(toastButtonElement);
      toastElement.setAttribute('button', 'true');
    } else {
      toastElement.setAttribute('button', 'false');
    }
  } else {
    toastElement.setAttribute('button', 'false');
  }

  toastElement.addEventListener(
    'animationend',
    function () {
      toastElement.setAttribute('displayed', 'false');
    },
    { once: true }
  );

  toastElement.setAttribute('displayed', 'true');
}
