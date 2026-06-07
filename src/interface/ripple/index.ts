export class Ripple {
  color: string;
  duration: number;
  _handlers: WeakMap<HTMLElement, Function>;

  constructor(color: string = 'var(--m-cssvar-main-color-15)', duration: number = 600): void {
    this.color = color;
    this.duration = duration;
    this._handlers = new WeakMap();
  }

  add(element: HTMLElement) {
    if (this._handlers.has(element)) return; // avoid double-binding
    const handler = (event: PointerEvent) => this._render(element, event);
    element.addEventListener('pointerdown', handler);
    this._handlers.set(element, handler);
  }

  remove(element: HTMLElement): void {
    const handler = this._handlers.get(element);
    if (handler) {
      element.removeEventListener('pointerdown', handler);
      this._handlers.delete(element);
    }
    // Remove any leftover overlays and temporary styling.
    element.querySelectorAll('svg[data-ripple]').forEach((svg) => svg.remove());
    element.style.removeProperty('overflow');
    if (element.dataset.rippleSetPosition) {
      element.style.removeProperty('position');
      delete element.dataset.rippleSetPosition;
    }
  }

  _render(element: HTMLElement, event: PointerEvent): void {
    const scroll_x = document.documentElement.scrollLeft;
    const scroll_y = document.documentElement.scrollTop;
    const x = event.pageX;
    const y = event.pageY;
    const elementRect = element.getBoundingClientRect();
    const elementX = elementRect.x + scroll_x;
    const elementY = elementRect.y + scroll_y;
    const elementWidth = element.clientWidth;
    const elementHeight = element.clientHeight;
    const relativeX = x - elementX;
    const relativeY = y - elementY;
    const rippleSize = Math.max(elementWidth, elementHeight);
    const distanceTop = relativeY - 0;
    const distanceLeft = relativeX - 0;
    const distanceRight = elementWidth - relativeX;
    const distanceBottom = elementHeight - relativeY;
    const distanceTopLeftCorner = Math.sqrt(Math.pow(distanceTop, 2) + Math.pow(distanceLeft, 2));
    const distanceTopRightCorner = Math.sqrt(Math.pow(distanceTop, 2) + Math.pow(distanceRight, 2));
    const distanceBottomLeftCorner = Math.sqrt(Math.pow(distanceBottom, 2) + Math.pow(distanceLeft, 2));
    const distanceBottomRightCorner = Math.sqrt(Math.pow(distanceBottom, 2) + Math.pow(distanceRight, 2));
    const rippleScale = Math.max(2, Math.max(distanceTopLeftCorner, distanceTopRightCorner, distanceBottomLeftCorner, distanceBottomRightCorner) / (rippleSize / 2));

    // 3. render — apply temporary styling to the host element
    const computed = getComputedStyle(element);
    if (computed.position === 'static') {
      element.style.position = 'relative';
      element.dataset.rippleSetPosition = 'true';
    }
    element.style.overflow = 'clip';

    // 3. render — create an SVG that spans the same area as the target element
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.dataset.ripple = 'true';
    svg.setAttribute('width', elementWidth.toString());
    svg.setAttribute('height', elementHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${elementWidth} ${elementHeight}`);
    Object.assign(svg.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: `${elementWidth}px`,
      height: `${elementHeight}px`,
      pointerEvents: 'none',
      overflow: 'visible'
    });

    // 3. render — animated circle that ripples out from the pointer center
    const circle = document.createElementNS(svgns, 'circle');
    circle.setAttribute('cx', relativeX.toString());
    circle.setAttribute('cy', relativeY.toString());
    circle.setAttribute('r', (rippleSize / 2).toString());
    circle.setAttribute('fill', this.color);
    circle.style.transformBox = 'fill-box';
    circle.style.transformOrigin = 'center';
    circle.style.transform = 'scale(0)';
    circle.style.opacity = '1';
    circle.style.transition = `transform ${this.duration}ms ease-out, opacity ${this.duration}ms ease-out`;

    svg.appendChild(circle);
    element.appendChild(svg);

    // Trigger the animation on the next frame so the transition runs.
    requestAnimationFrame(() => {
      circle.style.transform = `scale(${rippleScale})`;
      circle.style.opacity = '0';
    });

    // Clean up the overlay once the animation ends.
    const cleanup = () => svg.remove();
    circle.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, this.duration + 50); // safety fallback
  }
}
