import './TimePicker.css';
import { useEffect, useRef } from 'react';

import TimePickerSource from './TimePickerSource';
import IosStylePicker from './IosStylePicker/IosStylePicker';

const ONCHANGE_TIMEOUT_DELAY = 100;

export type TimePickerProps = {
  onChange: (hour: number, minute: number) => void;
  initTime?: Date;
  infinite?: boolean;
  className?: string;
  format?: '12' | '24';
};

type TimePickerStateRef = {
  currentHour: number;
  currentMinute: number;
  source: TimePickerSource;
  onChange: TimePickerProps['onChange'];
  onChangeTimeout: NodeJS.Timeout | null;
  isAm: boolean;
};

//개선 format 개선
const TimePicker = ({
  onChange,
  initTime: _initTime = new Date(),
  infinite = false,
  className: _className,
  format = '12',
}: TimePickerProps) => {
  const className =
    'react-ios-style-time-picker' + (_className ? ` ${_className}` : '');

  const ref = useRef<TimePickerStateRef>({
    currentHour:
      format === '12' && !infinite
        ? _initTime.getHours() % 12 || 12
        : _initTime.getHours(),
    currentMinute: _initTime.getMinutes(),
    source: new TimePickerSource({
      format: format,
      infinite: infinite,
    }),
    onChange,
    onChangeTimeout: null,
    isAm: _initTime.getHours() < 12,
  }).current;

  const ampmPickerRef = useRef<HTMLDivElement>(null);
  const hourPickerRef = useRef<HTMLDivElement>(null);
  const minutePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.onChange = onChange;
  }, [onChange]);

  useEffect(() => {
    const onChange = () => {
      if (ref.onChangeTimeout) {
        clearTimeout(ref.onChangeTimeout);
      }
      ref.onChangeTimeout = setTimeout(() => {
        ref.onChange(ref.currentHour, ref.currentMinute);
        ref.onChangeTimeout = null;
      }, ONCHANGE_TIMEOUT_DELAY);
    };

    const updateHourSource = () => {
      hourSelector.updateSource(ref.currentHour);
    };

    const ampmSelector =
      format === '12' &&
      new IosStylePicker(ampmPickerRef.current!, {
        variant: 'normal',
        source: [
          { value: 1, text: '오전' },
          { value: 2, text: '오후' },
        ],
        onChange: (selected) => {
          const changed = ref.isAm !== (selected.value === 1);

          if (format === '12') {
            if (selected.value === 1) {
              ref.currentHour = ref.currentHour % 12;
              ref.isAm = true;
            } else if (selected.value === 2) {
              ref.currentHour = (ref.currentHour % 12) + 12;
              ref.isAm = false;
            }
          }

          if (changed) {
            if (infinite === true) {
              updateHourSource();
            }
            onChange();
          }
        },
      });

    const hourSelector = new IosStylePicker(hourPickerRef.current!, {
      variant: infinite ? 'infinite' : 'normal',
      source: ref.source.hours,
      onChange: (selected) => {
        const changed = ref.currentHour !== selected.value;

        if (ref.isAm === false && selected.value < 12) {
          ref.currentHour = selected.value + 12;
        } else if (ref.isAm === true && selected.value === 12) {
          ref.currentHour = 0;
        } else {
          ref.currentHour = selected.value;
        }
        if (changed) {
          onChange();
        }
      },
      onSelect: (currentIndex) => {
        if (infinite === true && format === '12') {
          if (currentIndex.value < 12) {
            if (ampmSelector) {
              ampmSelector.updateAmPm(1);
              ref.isAm = true;
            }
          } else if (currentIndex.value >= 12) {
            if (ampmSelector) {
              ampmSelector.updateAmPm(2);
              ref.isAm = false;
            }
          }
        }
      },
    });

    const minuteSelector = new IosStylePicker(minutePickerRef.current!, {
      variant: infinite ? 'infinite' : 'normal',
      source: ref.source.minutes,
      onChange: (selected) => {
        const changed = ref.currentMinute !== selected.value;
        ref.currentMinute = selected.value;

        if (changed) {
          onChange();
        }
      },
    });

    setTimeout(() => {
      const initHour =
        format === '12' && !infinite
          ? _initTime.getHours() % 12 || 12
          : _initTime.getHours();
      const initMinute = _initTime.getMinutes();
      const initAmPm = _initTime.getHours() < 12 ? 1 : 2;

      if (format === '12' && ampmSelector) {
        ampmSelector.select(initAmPm);
      }

      hourSelector.select(initHour);
      minuteSelector.select(initMinute);
    }, 0);

    return () => {
      if (ampmSelector) {
        ampmSelector.destroy();
      }
      hourSelector.destroy();
      minuteSelector.destroy();
    };
  }, [infinite, format]);

  return (
    <div className={className}>
      {format === '12' && <div ref={ampmPickerRef} />}
      <div ref={hourPickerRef} />
      <div ref={minutePickerRef} />
    </div>
  );
};

export default TimePicker;
