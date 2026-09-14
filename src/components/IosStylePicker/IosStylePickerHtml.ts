import getRange from './utils/getRange';

const classNames = {
  wrapper: 'ios-style-picker',
  optionList: 'ios-style-picker__option-list',
  optionItem: 'ios-style-picker__option-item',
  highlight: 'ios-style-picker__highlight',
  highlightList: 'ios-style-picker__highlight-list',
  highlightItem: 'ios-style-picker__highlight-item',
};

type IosStylePickerHtmlOptions = {
  container: HTMLElement;
  isInfinite: boolean;
  wheelCount: number;
  source: { text: string }[];
  itemAngle: number;
  itemHeight: number;
  radius: number;
};
class IosStylePickerHtml {
  private _container: HTMLElement;
  private _optionList: HTMLElement;
  /** option item elements, ordered by their (contiguous) data-index */
  private _optionItems: HTMLElement[];
  /** data-index of `_optionItems[0]` (negative in infinite mode) */
  private _firstItemIndex: number;
  /**
   * Inclusive range of item indices that are currently visible.
   * `null` until the first `scroll()` call, which writes every item once
   * (identical to the original implementation's initial pass).
   */
  private _visibleRange: { from: number; to: number } | null = null;
  private _highlightList: HTMLElement;
  private _highlightItems: HTMLElement[];

  private _source: { text: string }[];
  private _isInfinite: boolean;
  private wheelCount: number;
  private itemAngle: number;
  private itemHeight: number;
  private radius: number;

  constructor({
    container,
    source,
    isInfinite,
    wheelCount,
    itemAngle,
    itemHeight,
    radius,
  }: IosStylePickerHtmlOptions) {
    this._container = container;

    this._source = source;
    this._isInfinite = isInfinite;
    this.wheelCount = wheelCount;
    this.itemAngle = itemAngle;
    this.itemHeight = itemHeight;
    this.radius = radius;

    const optionListHtml = this._getOptionItems();

    const highListHtml = this._getHighlightItems();

    this._container.innerHTML = `
      <div class="${classNames.wrapper}">
        <ul
          class="${classNames.optionList}"
          style="transform: translate3d(0, 0, ${-this.radius}px) rotateX(0deg);"
        >
          ${optionListHtml}
        </ul>
        <div
          class="${classNames.highlight}"
          style="height: ${this.itemHeight}px; line-height: ${
      this.itemHeight
    }px;"
        >
          <ul class="${classNames.highlightList}">
            ${highListHtml}
          </ul>
        </div>
      </div>`;

    const optionList = this._container.querySelector<HTMLElement>(
      `.${classNames.optionList}`
    );
    if (!optionList) {
      throw new Error('optionList does not exists');
    }
    this._optionList = optionList;

    const optionsItems = this._container.querySelectorAll<HTMLElement>(
      `.${classNames.optionItem}`
    );
    if (!optionsItems) {
      throw new Error('optionList does not exists');
    }
    // Cache elements and their numeric indices once, instead of reading
    // `dataset.index` on every animation frame.
    this._optionItems = [...optionsItems];
    this._firstItemIndex = this._optionItems.length
      ? this._readIndex(this._optionItems[0])
      : 0;
    this._optionItems.forEach((itemElem, i) => {
      if (this._readIndex(itemElem) !== this._firstItemIndex + i) {
        throw new Error('option item indices must be contiguous');
      }
    });

    const highlightList = this._container.querySelector<HTMLElement>(
      `.${classNames.highlightList}`
    );
    if (!highlightList) {
      throw new Error(`highlightList does not exists.`);
    }
    if (isInfinite) {
      highlightList.style.top = `${-this.itemHeight}px`;
    }
    this._highlightList = highlightList;
    this._highlightItems = [
      ...highlightList.querySelectorAll<HTMLElement>(
        `.${classNames.highlightItem}`
      ),
    ];
  }

  /**
   * Replaces the rendered labels in place (e.g. AM/PM after a locale change)
   * without touching layout, scroll position or visibility.
   * `source` must have the same length as the source used at render time.
   */
  updateText(source: { text: string }[]) {
    if (source.length !== this._source.length) {
      throw new Error('updateText: source length must not change');
    }
    this._source = source;
    const len = source.length;
    const textAt = (i: number) => source[(i + len) % len].text;

    this._optionItems.forEach((itemElem, i) => {
      itemElem.textContent = textAt(this._firstItemIndex + i);
    });
    const firstHighlightIndex = this._isInfinite ? -1 : 0;
    this._highlightItems.forEach((itemElem, i) => {
      itemElem.textContent = textAt(firstHighlightIndex + i);
    });
  }

  _getOptionItems() {
    const optionIndices = this._isInfinite
      ? getRange(
          -this.wheelCount / 4,
          this._source.length + this.wheelCount / 4
        )
      : getRange(0, this._source.length);

    const optionListItems = optionIndices.map((i) => ({
      rotateX: -this.itemAngle * i,
      index: i,
      text: this._source[(i + this._source.length) % this._source.length].text,
    }));

    return optionListItems.reduce(
      (acc, item) =>
        `${acc}
        <li
          class="${classNames.optionItem}"
          style="
            top: ${this.itemHeight * -0.5}px;
            height: ${this.itemHeight}px;
            line-height: ${this.itemHeight}px;
            transform: rotateX(${item.rotateX}deg) translate3d(0, 0, ${
          this.radius
        }px);
          "
          data-index="${item.index}"
        >
          ${item.text}
        </li>`,
      ''
    );
  }

  _getHighlightItems() {
    const indices = this._isInfinite
      ? getRange(-1, this._source.length + 1)
      : getRange(0, this._source.length);

    const items = indices.map((i) => ({
      text: this._source[(i + this._source.length) % this._source.length].text,
    }));

    return items.reduce(
      (acc, item) =>
        `${acc}
        <li
          class="${classNames.highlightItem}"
          style="height: ${this.itemHeight}px;"
        >
          ${item.text}
        </li>`,
      ''
    );
  }

  scroll(scrollCount: number) {
    const dz = -this.radius;
    const rotateX = this.itemAngle * scrollCount;
    this._optionList.style.transform = `translate3d(0, 0, ${dz}px) rotateX(${rotateX}deg)`;

    const dy = -scrollCount * this.itemHeight;
    this._highlightList.style.transform = `translate3d(0, ${dy}px, 0)`;

    this._updateVisibility(scrollCount);
  }

  private _readIndex(itemElem: HTMLElement) {
    if (itemElem.dataset.index === undefined) {
      throw new Error('itemElem.dataset.index does not exists');
    }
    return +itemElem.dataset.index;
  }

  /** Same rule as the original implementation. */
  private _isVisible(index: number, scrollCount: number) {
    return !(Math.abs(index - scrollCount) > this.wheelCount / 4);
  }

  /**
   * Inclusive [from, to] range of item indices satisfying `_isVisible`,
   * clamped to the rendered items. Visible indices always form one
   * contiguous run because the rule is `|index - scrollCount| <= wheelCount / 4`.
   * The estimate is corrected with the exact predicate so floating point
   * rounding can never make the result differ from a full scan.
   */
  private _getVisibleRange(scrollCount: number) {
    const first = this._firstItemIndex;
    const last = first + this._optionItems.length - 1;
    const half = this.wheelCount / 4;

    if (Number.isNaN(scrollCount)) {
      // `Math.abs(NaN) > half` is false, so the original rule shows every item
      return { from: first, to: last };
    }
    if (!Number.isFinite(scrollCount)) {
      // |index - ±Infinity| is Infinity, so every item is hidden
      return { from: 0, to: -1 };
    }

    // clamp the estimates so the correction loops stay within the items
    let from = Math.min(last + 1, Math.max(first, Math.ceil(scrollCount - half)));
    while (from > first && this._isVisible(from - 1, scrollCount)) from--;
    while (from <= last && !this._isVisible(from, scrollCount)) from++;

    let to = Math.max(first - 1, Math.min(last, Math.floor(scrollCount + half)));
    while (to < last && this._isVisible(to + 1, scrollCount)) to++;
    while (to >= first && !this._isVisible(to, scrollCount)) to--;

    // No visible item: represent as an empty range
    if (!(from <= to)) {
      return { from: 0, to: -1 };
    }
    return { from, to };
  }

  private _setVisibility(index: number, visible: boolean) {
    this._optionItems[index - this._firstItemIndex].style.visibility = visible
      ? 'visible'
      : 'hidden';
  }

  private _updateVisibility(scrollCount: number) {
    const next = this._getVisibleRange(scrollCount);
    const prev = this._visibleRange;
    this._visibleRange = next;

    if (prev === null) {
      // First pass: every item gets an explicit value.
      this._optionItems.forEach((_, i) => {
        const index = this._firstItemIndex + i;
        this._setVisibility(index, index >= next.from && index <= next.to);
      });
      return;
    }

    // Items that left the visible range
    for (let index = prev.from; index <= prev.to; index++) {
      if (index < next.from || index > next.to) {
        this._setVisibility(index, false);
      }
    }
    // Items that entered the visible range
    for (let index = next.from; index <= next.to; index++) {
      if (index < prev.from || index > prev.to) {
        this._setVisibility(index, true);
      }
    }
  }

  addEventListener(
    eventName: 'touchstart' | 'touchmove' | 'touchend',
    listener: (evt: TouchEvent) => void
  ) {
    this._container.addEventListener(eventName, listener);
  }

  removeEventListener(
    eventName: 'touchstart' | 'touchmove' | 'touchend',
    listener: (evt: TouchEvent) => void
  ) {
    this._container.removeEventListener(eventName, listener);
  }

  equalOrContains(target: EventTarget | null) {
    return (
      this._container?.contains(target as Node) || this._container === target
    );
  }

  clear() {
    this._container.innerHTML = '';
  }

  get container() {
    return this._container;
  }
}

export default IosStylePickerHtml;
