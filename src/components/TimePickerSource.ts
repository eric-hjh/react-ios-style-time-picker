type TimePickerSourceItem = {
  value: number;
  text: string;
};

export type TimePickerSourceOptions = {
  format?: '12' | '24';
  infinite?: boolean;
  currentHour?: number;
};

class TimePickerSource {
  #hours: TimePickerSourceItem[];
  #minutes: TimePickerSourceItem[];
  #format: '12' | '24';
  #infinite: boolean;
  #currentHour: number;

  constructor({format, infinite, currentHour}: TimePickerSourceOptions = {}) {
    this.#format = format ?? '12';
    this.#infinite = infinite ?? false;
    this.#currentHour = currentHour ?? 0;
    this.#hours = this.#getHours();
    this.#minutes = this.#getMinutes();
  }

  #getItems(from: number, to: number) {
    return Array.from({length: to - from + 1}, (_, i) => ({
      value: i + from,
      text: String(i + from).padStart(2, '0'),
    }));
  }

  #adjustTextFor12Hour(value: number): string {
    if (value < 12) {
      return String(value === 0 ? 12 : value); // 0은 12로 표시
    }
    return String(value - 12 === 0 ? 12 : value - 12); // 12는 12로 표시
  }

  #getItemsFor12Hour(from: number, to: number) {
    return Array.from({length: to - from + 1}, (_, i) => ({
      value: i + from,
      text: this.#adjustTextFor12Hour(i + from),
    }));
  }

  #getHours() {
    if (this.#format === '12') {
      if (this.#infinite) {
        const items = this.#getItemsFor12Hour(0, 23);
        const currentHour = this.#currentHour;
        return [...items.slice(currentHour), ...items.slice(0, currentHour)];
      }

      return this.#getItemsFor12Hour(1, 12);
    }

    return this.#getItems(0, 23);
  }

  #getMinutes() {
    return this.#getItems(0, 59);
  }

  setCurrent(hour: number) {
    this.#currentHour = hour;
    this.#hours = this.#getHours();
  }

  get hours() {
    return this.#hours;
  }

  get minutes() {
    return this.#minutes;
  }
}

export default TimePickerSource;
