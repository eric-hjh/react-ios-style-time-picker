type TimePickerSourceItem = {
  value: number;
  text: string;
};

export type TimePickerSourceOptions = {
  hourFormat?: '12' | '24';
  infinite?: boolean;
};

class TimePickerSource {
  #hours: TimePickerSourceItem[];
  #minutes: TimePickerSourceItem[];
  #hourFormat: '12' | '24';
  #infinite: boolean;

  constructor({ hourFormat, infinite }: TimePickerSourceOptions = {}) {
    this.#hourFormat = hourFormat ?? '12';
    this.#infinite = infinite ?? false;
    this.#hours = this.#getHours();
    this.#minutes = this.#getMinutes();
  }

  #adjustTextFor12Hour(value: number): string {
    if (value === 0) {
      return '12';
    }
    if (value > 12) {
      return String(value - 12);
    }
    return String(value);
  }

  #getItems(from: number, to: number, is12HourFormat: boolean = false) {
    return Array.from({ length: to - from + 1 }, (_, i) => {
      const value = i + from;
      const text = is12HourFormat
        ? this.#adjustTextFor12Hour(value)
        : String(value).padStart(2, '0');
      return { value, text };
    });
  }

  #getHours() {
    const is12HourFormat = this.#hourFormat === '12';
    if (this.#infinite) {
      return this.#getItems(0, 23, is12HourFormat);
    }
    return this.#getItems(
      is12HourFormat ? 1 : 0,
      is12HourFormat ? 12 : 23,
      is12HourFormat
    );
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
