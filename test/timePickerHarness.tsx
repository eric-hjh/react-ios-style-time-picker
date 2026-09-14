import { act } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { vi } from 'vitest';

// The engine derives item height from offsetHeight, which jsdom reports as 0.
export const PICKER_HEIGHT = 150;
export const ITEM_HEIGHT = (PICKER_HEIGHT * 3) / 20;

export function setupDom() {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get: () => PICKER_HEIGHT,
  });
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  vi.useFakeTimers({ now: new Date(2025, 0, 1, 9, 0, 0) });
}

export function teardownDom() {
  vi.useRealTimers();
  document.body.innerHTML = '';
}

export async function render(ui: React.ReactElement) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  let root!: Root;
  await act(async () => {
    root = createRoot(host);
    root.render(ui);
  });
  return {
    host,
    rerender: (next: React.ReactElement) =>
      act(async () => {
        root.render(next);
      }),
    unmount: () =>
      act(async () => {
        root.unmount();
      }),
  };
}

/** Flush the engine's setTimeout(0) init and the 100ms onChange debounce. */
export const flush = (ms = 500) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

/** Wheel columns in DOM order: [ampm?, hour, minute]. */
export const columns = (host: HTMLElement) =>
  [...host.querySelectorAll<HTMLElement>('.react-ios-style-time-picker > div')];

/** Text of the item in the center highlight, derived from the highlight list offset. */
export function selectedText(column: HTMLElement) {
  const list = column.querySelector<HTMLElement>('.ios-style-picker__highlight-list')!;
  const match = /translate3d\(0, (-?[\d.e+-]+)px, 0\)/.exec(list.style.transform);
  const scroll = match ? -Number(match[1]) / ITEM_HEIGHT : 0;
  const offset = list.style.top ? 1 : 0; // infinite lists render one leading clone
  const items = column.querySelectorAll('.ios-style-picker__highlight-item');
  return items[Math.round(scroll) + offset]?.textContent?.trim();
}

/** Simulates a mouse drag of `items` rows (positive = towards later values). */
export async function drag(column: HTMLElement, items: number) {
  const target = column.querySelector<HTMLElement>('.ios-style-picker')!;
  const fire = (type: string, clientY: number) =>
    target.dispatchEvent(
      new MouseEvent(type, { clientY, bubbles: true, cancelable: true })
    );
  await act(async () => {
    fire('mousedown', 300);
    vi.advanceTimersByTime(50);
    fire('mousemove', 300 - items * ITEM_HEIGHT);
    vi.advanceTimersByTime(50);
    fire('mousemove', 300 - items * ITEM_HEIGHT); // zero release velocity
    vi.advanceTimersByTime(50);
    fire('mouseup', 300 - items * ITEM_HEIGHT);
  });
  await flush();
}
