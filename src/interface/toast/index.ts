import { setGlyph } from '../icons';

const toastElement = document.querySelector('.css_toast') as HTMLElement;
const toastGlyphElement = toastElement.querySelector('.css_toast_glyph') as HTMLElement;
const toastMessageElement = toastElement.querySelector('.css_toast_message') as HTMLElement;
const toastButtonElement = toastElement.querySelector('.css_toast_button') as HTMLElement;

export interface ToastButton {
  text: string;
  action: Function;
}

export function showToast(glyph: string, message: string, button?: ToastButton | null): void {
  setGlyph(toastGlyphElement, glyph);
  toastMessageElement.innerText = message;

  if (typeof button === 'object' && button !== null && button !== undefined) {
    if (typeof button?.action === 'function') {
      toastButtonElement.innerText = button.text;
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
    function (event: AnimationEvent) {
      toastElement.setAttribute('displayed', 'false');
      toastElement.classList.remove('css_toast_fade_in');
    },
    { once: true }
  );

  toastElement.setAttribute('displayed', 'true');
  toastElement.classList.add('css_toast_fade_in');
}
