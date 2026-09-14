import './TimePicker.css';
import { useEffect, useRef } from 'react';

import TimePickerSource, { LOCALE_MAP } from './TimePickerSource';
import IosStylePicker from './IosStylePicker/IosStylePicker';

const ONCHANGE_TIMEOUT_DELAY = 100;

/** A time of day. `hour` is always 0-23 regardless of `hourFormat`. */
export type TimePickerValue = {
  hour: number;
  minute: number;
};

export type TimePickerLocale = keyof typeof LOCALE_MAP;

export type TimePickerProps = {
  /**
   * Called (debounced) with the selected time after the user moves a wheel.
   * `hour` is 0-23 in both formats. In uncontrolled mode it is also called
   * once after mount with the initial time, as in previous versions.
   * It is never called as a result of a `value` prop change.
   */
  onChange: (hour: number, minute: number) => void;
  /**
   * Controlled time. When this changes the wheels move to it without
   * recreating the picker and without calling `onChange`.
   */
  value?: TimePickerValue;
  /** Initial time for uncontrolled usage. Ignored when `value` is set. */
  defaultValue?: TimePickerValue;
  /**
   * @deprecated Use `defaultValue` (uncontrolled) or `value` (controlled).
   * Kept as an alias of `defaultValue` for backward compatibility.
   */
  initTime?: Date;
  infinite?: boolean;
  className?: string;
  hourFormat?: '12' | '24';
  /** AM/PM labels. Changing it updates the labels in place. */
  locale?: TimePickerLocale;
};

type TimePickerStateRef = {
  currentHour: number;
  currentMinute: number;
  currentAmPm: number;
  onChange: TimePickerProps['onChange'];
  onChangeTimeout: ReturnType<typeof setTimeout> | null;
  /** `true` while wheels are moved programmatically: engine callbacks must not emit. */
  silent: boolean;
  /** Last time known to be applied to (or picked on) the wheels, 24h. */
  time: TimePickerValue | null;
  locale: TimePickerLocale;
  /** Moves the wheels of the currently mounted engines. */
  applyTime: ((time: TimePickerValue) => void) | null;
  /** Updates AM/PM labels of the currently mounted engines. */
  applyLocale: ((locale: TimePickerLocale) => void) | null;
};

const isValidTime = (time: TimePickerValue | undefined): time is TimePickerValue =>
  !!time &&
  Number.isInteger(time.hour) &&
  Number.isInteger(time.minute) &&
  time.hour >= 0 &&
  time.hour <= 23 &&
  time.minute >= 0 &&
  time.minute <= 59;

const warnInvalid = (time: unknown) => {
  console.warn(
    '[react-ios-style-time-picker] Ignoring invalid time; expected { hour: 0-23, minute: 0-59 }:',
    time
  );
};

const resolveInitialTime = (
  value: TimePickerValue | undefined,
  defaultValue: TimePickerValue | undefined,
  initTime: Date | undefined
): TimePickerValue => {
  for (const candidate of [value, defaultValue]) {
    if (candidate === undefined) continue;
    if (isValidTime(candidate)) return { ...candidate };
    warnInvalid(candidate);
  }
  const date = initTime ?? new Date();
  return { hour: date.getHours(), minute: date.getMinutes() };
};

const TimePicker = ({
  onChange,
  value,
  defaultValue,
  initTime,
  infinite = false,
  className: _className,
  hourFormat = '12',
  locale = 'en',
}: TimePickerProps) => {
  const className =
    'react-ios-style-time-picker' + (_className ? ` ${_className}` : '');

  const isControlled = value !== undefined;
  const valueHour = value?.hour;
  const valueMinute = value?.minute;

  const ref = useRef<TimePickerStateRef>({
    currentHour: 0,
    currentMinute: 0,
    currentAmPm: 1,
    onChange,
    onChangeTimeout: null,
    silent: false,
    time: null,
    locale,
    applyTime: null,
    applyLocale: null,
  }).current;

  // Resolved once; later changes of defaultValue / initTime are ignored like
  // `defaultValue` of native inputs.
  if (ref.time === null) {
    ref.time = resolveInitialTime(value, defaultValue, initTime);
  }

  const isControlledRef = useRef(isControlled);

  useEffect(() => {
    ref.onChange = onChange;
    isControlledRef.current = isControlled;
  });

  const ampmPickerRef = useRef<HTMLDivElement>(null);
  const hourPickerRef = useRef<HTMLDivElement>(null);
  const minutePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = new TimePickerSource({
      hourFormat,
      infinite,
      locale: ref.locale,
    });

    const emitChange = () => {
      if (ref.silent) {
        return;
      }
      ref.time = { hour: ref.currentHour, minute: ref.currentMinute };
      if (ref.onChangeTimeout) {
        clearTimeout(ref.onChangeTimeout);
      }
      ref.onChangeTimeout = setTimeout(() => {
        ref.onChangeTimeout = null;
        ref.onChange(ref.currentHour, ref.currentMinute);
      }, ONCHANGE_TIMEOUT_DELAY);
    };

    const updateHourSource = () => {
      hourSelector.selectByCurrentHour(ref.currentHour);
    };

    // Engine constructors select their first item and fire callbacks; those
    // intermediate values must not be reported or remembered.
    ref.silent = true;

    const ampmSelector =
      hourFormat === '12' &&
      new IosStylePicker(ampmPickerRef.current!, {
        variant: 'normal',
        source: source.ampm,
        currentData: ref.currentAmPm,
        onChange: (selected) => {
          const changed = ref.currentAmPm !== selected.value;

          if (selected.value === 1) {
            ref.currentHour = ref.currentHour % 12;
          } else if (selected.value === 2) {
            ref.currentHour = (ref.currentHour % 12) + 12;
          }
          ref.currentAmPm = selected.value;

          if (changed) {
            if (infinite === true) {
              updateHourSource();
            }
            emitChange();
          }
        },
      });

    const hourSelector = new IosStylePicker(hourPickerRef.current!, {
      variant: infinite ? 'infinite' : 'normal',
      source: source.hours,
      onChange: (selected) => {
        const changed = ref.currentHour !== selected.value;

        // AM/PM only applies to the 12h wheel; in 24h mode the value is the hour.
        if (hourFormat === '12' && ref.currentAmPm === 2 && selected.value < 12) {
          ref.currentHour = selected.value + 12;
        } else if (
          hourFormat === '12' &&
          ref.currentAmPm === 1 &&
          selected.value === 12
        ) {
          ref.currentHour = 0;
        } else {
          ref.currentHour = selected.value;
        }
        if (changed) {
          emitChange();
        }
      },
      onSelect: (currentIndex) => {
        if (infinite === true && hourFormat === '12') {
          if (currentIndex.value < 12) {
            if (ampmSelector) {
              ampmSelector.updateAmPm(1);
              ref.currentAmPm = 1;
            }
          } else if (currentIndex.value >= 12) {
            if (ampmSelector) {
              ampmSelector.updateAmPm(2);
              ref.currentAmPm = 2;
            }
          }
        }
      },
    });

    const minuteSelector = new IosStylePicker(minutePickerRef.current!, {
      variant: infinite ? 'infinite' : 'normal',
      source: source.minutes,
      onChange: (selected) => {
        const changed = ref.currentMinute !== selected.value;
        ref.currentMinute = selected.value;

        if (changed) {
          emitChange();
        }
      },
    });

    ref.silent = false;

    let destroyed = false;

    const applyTime = ({ hour, minute }: TimePickerValue) => {
      if (destroyed) return;
      const amPm = hour < 12 ? 1 : 2;
      const wheelHour = hourFormat === '12' && !infinite ? hour % 12 || 12 : hour;

      const wasSilent = ref.silent;
      ref.silent = true;
      try {
        if (ampmSelector) {
          ampmSelector.select(amPm);
        }
        hourSelector.select(wheelHour);
        minuteSelector.select(minute);
      } finally {
        ref.silent = wasSilent;
      }
      ref.currentHour = hour;
      ref.currentMinute = minute;
      ref.currentAmPm = amPm;
      ref.time = { hour, minute };
    };

    ref.applyTime = applyTime;
    ref.applyLocale = (nextLocale) => {
      if (destroyed || !ampmSelector) return;
      ampmSelector.updateSourceText(
        new TimePickerSource({ hourFormat, infinite, locale: nextLocale }).ampm
      );
    };

    // Deferred like before so the wheels are laid out before the first select.
    const initTimeout = setTimeout(() => {
      applyTime(ref.time!);
      if (!isControlledRef.current) {
        // Previous versions reported the initial time once after mount.
        emitChange();
      }
    }, 0);

    return () => {
      destroyed = true;
      clearTimeout(initTimeout);
      if (ref.applyTime === applyTime) {
        ref.applyTime = null;
        ref.applyLocale = null;
      }
      if (ampmSelector) {
        ampmSelector.destroy();
      }
      hourSelector.destroy();
      minuteSelector.destroy();
    };
  }, [infinite, hourFormat, ref]);

  // Controlled value -> wheels, without recreating the engines.
  useEffect(() => {
    if (valueHour === undefined && valueMinute === undefined) return;
    const next = { hour: valueHour!, minute: valueMinute! };
    if (!isValidTime(next)) {
      warnInvalid(next);
      return;
    }
    const current = ref.time;
    if (current && current.hour === next.hour && current.minute === next.minute) {
      return; // e.g. the parent echoing our own onChange
    }
    // A pending onChange from a gesture is superseded by the parent's value.
    if (ref.onChangeTimeout) {
      clearTimeout(ref.onChangeTimeout);
      ref.onChangeTimeout = null;
    }
    ref.time = next;
    // If the engines are still initializing, their init reads `ref.time`.
    ref.applyTime?.(next);
  }, [valueHour, valueMinute, ref]);

  // Locale -> AM/PM labels, updated in place.
  useEffect(() => {
    if (ref.locale === locale) return;
    ref.locale = locale;
    ref.applyLocale?.(locale);
  }, [locale, ref]);

  return (
    <div className={className}>
      {hourFormat === '12' && <div ref={ampmPickerRef} />}
      <div ref={hourPickerRef} />
      <div ref={minutePickerRef} />
    </div>
  );
};

export default TimePicker;
