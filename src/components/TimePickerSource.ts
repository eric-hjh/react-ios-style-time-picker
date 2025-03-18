type TimePickerSourceItem = {
  value: number;
  text: string;
};

export type TimePickerSourceOptions = {
  format?: '12' | '24';
  infinite?: boolean;
};

class TimePickerSource {
  #hours: TimePickerSourceItem[];
  #minutes: TimePickerSourceItem[];
  #format: '12' | '24';
  #infinite: boolean;

  constructor({ format, infinite }: TimePickerSourceOptions = {}) {
    this.#format = format ?? '12';
    this.#infinite = infinite ?? false;
    this.#hours = this.#getHours();
    this.#minutes = this.#getMinutes();
  }

  #getItems(from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => ({
      value: i + from,
      text: String(i + from).padStart(2, '0'),
    }));
  }

  //개선

  #adjustTextFor12Hour(value: number): string {
    if (value < 12) {
      return String(value === 0 ? 12 : value);
    }
    return String(value - 12 === 0 ? 12 : value - 12);
  }

  #getItemsFor12Hour(from: number, to: number) {
    return Array.from({ length: to - from + 1 }, (_, i) => ({
      value: i + from,
      text: this.#adjustTextFor12Hour(i + from),
    }));
  }

  #getHours() {
    if (this.#format === '12') {
      if (this.#infinite) {
        return this.#getItemsFor12Hour(0, 23);
      }

      return this.#getItemsFor12Hour(1, 12);
    }

    return this.#getItems(0, 23);
  }

  #getMinutes() {
    return this.#getItems(0, 59);
  }

  get hours() {
    return this.#hours;
  }

  get minutes() {
    return this.#minutes;
  }
}

export default TimePickerSource;
