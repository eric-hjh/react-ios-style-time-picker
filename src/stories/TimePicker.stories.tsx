import { useState } from 'react';
import { StoryFn } from '@storybook/react';
import TimePicker, {
  TimePickerLocale,
  TimePickerProps,
  TimePickerValue,
} from '../components/TimePicker';

export default {
  title: 'TimePicker',
  component: TimePicker,
};

const Template: StoryFn<TimePickerProps> = (args: TimePickerProps) => (
  <TimePicker {...args} />
);

export const Default = Template.bind({});
export const DefaultInfinite = Template.bind({});
DefaultInfinite.args = {
  infinite: true,
};
export const TwentyFourHourFormat = Template.bind({});
TwentyFourHourFormat.args = {
  hourFormat: '24',
};
export const TwentyFourHourFormatInfinite = Template.bind({});
TwentyFourHourFormatInfinite.args = {
  infinite: true,
  hourFormat: '24',
};

const pad = (n: number) => String(n).padStart(2, '0');

const PRESETS: { label: string; value: TimePickerValue }[] = [
  { label: '00:00', value: { hour: 0, minute: 0 } },
  { label: '07:30', value: { hour: 7, minute: 30 } },
  { label: '12:00', value: { hour: 12, minute: 0 } },
  { label: '18:45', value: { hour: 18, minute: 45 } },
  { label: '23:59', value: { hour: 23, minute: 59 } },
];

const ControlledTemplate: StoryFn<Omit<TimePickerProps, 'onChange' | 'value'>> = (
  args
) => {
  const [value, setValue] = useState<TimePickerValue>({ hour: 9, minute: 0 });
  const [lastOnChange, setLastOnChange] = useState<string>('-');

  const shift = (minutes: number) =>
    setValue(({ hour, minute }) => {
      const total = (((hour * 60 + minute + minutes) % 1440) + 1440) % 1440;
      return { hour: Math.floor(total / 60), minute: total % 60 };
    });

  return (
    <div style={{ width: 320, fontFamily: 'sans-serif' }}>
      <TimePicker
        {...args}
        value={value}
        onChange={(hour, minute) => {
          setLastOnChange(`${pad(hour)}:${pad(minute)}`);
          setValue({ hour, minute });
        }}
      />
      <p>
        value: <strong>{`${pad(value.hour)}:${pad(value.minute)}`}</strong> · last
        onChange: <strong>{lastOnChange}</strong>
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {PRESETS.map((preset) => (
          <button key={preset.label} onClick={() => setValue(preset.value)}>
            {preset.label}
          </button>
        ))}
        <button onClick={() => shift(-15)}>-15m</button>
        <button onClick={() => shift(15)}>+15m</button>
        <button
          onClick={() => {
            const now = new Date();
            setValue({ hour: now.getHours(), minute: now.getMinutes() });
          }}
        >
          Now
        </button>
      </div>
    </div>
  );
};

/** External buttons drive `value`; wheel gestures report through `onChange`. */
export const Controlled = ControlledTemplate.bind({});
Controlled.args = {
  hourFormat: '12',
  infinite: false,
};

const LOCALES: TimePickerLocale[] = ['en', 'ko', 'ja', 'zh'];

const LocaleSwitchingTemplate: StoryFn<Omit<TimePickerProps, 'onChange' | 'locale'>> = (
  args
) => {
  const [locale, setLocale] = useState<TimePickerLocale>('en');
  const [time, setTime] = useState('-');

  return (
    <div style={{ width: 320, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {LOCALES.map((code) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            style={{ fontWeight: code === locale ? 700 : 400 }}
          >
            {code}
          </button>
        ))}
      </div>
      <TimePicker
        {...args}
        locale={locale}
        onChange={(hour, minute) => setTime(`${pad(hour)}:${pad(minute)}`)}
      />
      <p>
        locale: <strong>{locale}</strong> · onChange: <strong>{time}</strong>
      </p>
    </div>
  );
};

/** Switching `locale` updates the AM/PM labels in place, keeping the selection. */
export const LocaleSwitching = LocaleSwitchingTemplate.bind({});
LocaleSwitching.args = {
  defaultValue: { hour: 15, minute: 30 },
  hourFormat: '12',
};
