import easing from '../src/components/IosStylePicker/utils/easing';
import normalize from '../src/components/IosStylePicker/utils/normalize';

export type Renderer = { scroll(scrollCount: number): void };
export type RendererCtor = new (options: {
  container: HTMLElement;
  isInfinite: boolean;
  wheelCount: number;
  source: { text: string }[];
  itemAngle: number;
  itemHeight: number;
  radius: number;
}) => Renderer;

/** Same geometry IosStylePicker computes for the default CSS (150px height, count 20). */
export const COUNT = 20;
export const WHEEL_COUNT = COUNT - (COUNT % 4);
const ITEM_HEIGHT = (150 * 3) / COUNT;
const ITEM_ANGLE = 360 / COUNT;
const RADIUS = ITEM_HEIGHT / Math.tan((ITEM_ANGLE * Math.PI) / 180);

export const makeSource = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    value: from + i,
    text: String(from + i).padStart(2, '0'),
  }));

/** Mirrors IosStylePicker._create: infinite sources are repeated up to wheelCount / 2. */
export const expandSource = <T,>(source: T[], infinite: boolean) => {
  if (!infinite) return source;
  let concat = [...source];
  while (concat.length < WHEEL_COUNT / 2) concat = concat.concat(source);
  return concat;
};

/**
 * Counts every assignment to `style.visibility` on elements inside `root`
 * by shadowing the CSSStyleDeclaration accessor on each item's style object.
 */
export function countVisibilityWrites(root: HTMLElement) {
  const counter = { writes: 0 };
  root.querySelectorAll<HTMLElement>('li[data-index]').forEach((li) => {
    const style = li.style;
    let proto: object | null = Object.getPrototypeOf(style);
    let desc: PropertyDescriptor | undefined;
    while (proto && !desc) {
      desc = Object.getOwnPropertyDescriptor(proto, 'visibility');
      proto = Object.getPrototypeOf(proto);
    }
    if (!desc?.set || !desc.get) {
      throw new Error('cannot find style.visibility accessor');
    }
    const { get, set } = desc;
    Object.defineProperty(style, 'visibility', {
      configurable: true,
      get() {
        return get.call(style);
      },
      set(v: string) {
        counter.writes++;
        set.call(style, v);
      },
    });
  });
  return counter;
}

export function mount(
  Ctor: RendererCtor,
  source: { text: string }[],
  infinite: boolean
) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const renderer = new Ctor({
    container,
    source,
    isInfinite: infinite,
    wheelCount: WHEEL_COUNT,
    itemAngle: ITEM_ANGLE,
    itemHeight: ITEM_HEIGHT,
    radius: RADIUS,
  });
  const counter = countVisibilityWrites(container);
  return { container, renderer, counter };
}

export const visibilities = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('li[data-index]')].map(
    (li) => `${li.dataset.index}:${li.style.visibility}`
  );

/**
 * 60 frames of an easeOutQuart flick, the same curve IosStylePicker
 * uses in _animateToScroll. Infinite positions are normalized like _moveTo.
 */
export function flickFrames(
  from: number,
  distance: number,
  sourceLength: number,
  infinite: boolean,
  frames = 60
) {
  return Array.from({ length: frames }, (_, i) => {
    const s = from + easing.easeOutQuart((i + 1) / frames) * distance;
    return infinite ? normalize(s, sourceLength) : s;
  });
}
