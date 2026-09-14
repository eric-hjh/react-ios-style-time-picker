[![npm](https://img.shields.io/npm/v/react-ios-style-time-picker)](https://www.npmjs.com/package/react-ios-style-time-picker)

# React iOS Style Time Picker

![React iOS style time picker demo](assets/example.gif)

A lightweight, customizable **iOS-style rolling wheel time picker** component for your next **React** app — supports 12/24-hour format, infinite scroll, and multiple locales.

## Demo

Check out the live demo here: [Live Demo](https://eric-hjh.github.io/react-ios-style-time-picker/?path=/story/timepicker--default)

## install

```
npm i react-ios-style-time-picker
```

## Usage

### 12 hours format

<img width="312" alt="12 hours format" src="assets/12-hours-format.png" />

```tsx
import { useState } from 'react';
import { TimePicker } from 'react-ios-style-time-picker';
import 'react-ios-style-time-picker/style.css';

function App() {
  const [time, setTime] = useState<{ hour: number; minute: number }>({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });

  const handleTimeChange = (hour: number, minute: number) => {
    setTime({ hour, minute });
  };

  return (
    <div>
      <TimePicker onChange={handleTimeChange} hourFormat='12' />
    </div>
  );
}
```

### 24 hours format

<img width="312" alt="24 hours format" src="assets/24-hours-format.png" />

```tsx
import { useState } from 'react';
import { TimePicker } from 'react-ios-style-time-picker';
import 'react-ios-style-time-picker/style.css';

function App() {
  const [time, setTime] = useState<{ hour: number; minute: number }>({
    hour: new Date().getHours(),
    minute: new Date().getMinutes(),
  });

  const handleTimeChange = (hour: number, minute: number) => {
    setTime({ hour, minute });
  };

  return (
    <div>
      <TimePicker onChange={handleTimeChange} hourFormat='24' />
    </div>
  );
}
```

### Controlled

Pass `value` and update it from `onChange`, like a React `<input>`. Changing `value`
from outside (buttons, API responses, resets) moves the wheels without recreating
the picker and without calling `onChange`.

```tsx
import { useState } from 'react';
import { TimePicker, type TimePickerValue } from 'react-ios-style-time-picker';
import 'react-ios-style-time-picker/style.css';

function App() {
  const [time, setTime] = useState<TimePickerValue>({ hour: 9, minute: 0 });

  return (
    <div>
      <TimePicker
        value={time}
        onChange={(hour, minute) => setTime({ hour, minute })}
      />
      <button onClick={() => setTime({ hour: 18, minute: 30 })}>6:30 PM</button>
    </div>
  );
}
```

### Uncontrolled

```tsx
<TimePicker
  defaultValue={{ hour: 7, minute: 30 }}
  onChange={(hour, minute) => console.log(hour, minute)}
/>
```

## Props

| Prop           | Type                                     | Required | Default      | Description                                                                                          |
| :------------- | :--------------------------------------- | :------- | :----------- | :--------------------------------------------------------------------------------------------------- |
| `onChange`     | `(hour: number, minute: number) => void` | ✅       | -            | Called (debounced 100ms) when the user changes the time. `hour` is always `0`-`23`                    |
| `value`        | `{ hour: number; minute: number }`       | ❌       | `undefined`  | Controlled time (`hour` `0`-`23`, `minute` `0`-`59`). Changes move the wheels without firing `onChange` |
| `defaultValue` | `{ hour: number; minute: number }`       | ❌       | current time | Initial time for uncontrolled usage. Ignored when `value` is set                                     |
| `initTime`     | `Date`                                   | ❌       | `new Date()` | **Deprecated** — alias of `defaultValue`, kept for backward compatibility                            |
| `infinite`     | `boolean`                                | ❌       | `false`      | Enables infinite scroll style                                                                        |
| `className`    | `string`                                 | ❌       | `undefined`  | Custom class name for styling                                                                        |
| `hourFormat`   | `'12'` \| `'24'`                         | ❌       | `'12'`       | Time format (12-hour/24-hour)                                                                        |
| `locale`       | `'en'` \| `'ko'` \| `'ja'` \| `'zh'`     | ❌       | `'en'`       | Language for AM/PM (English, Korean, Japanese, Chinese). Changes are applied in place               |

Exported types: `TimePickerProps`, `TimePickerValue`, `TimePickerLocale`.

### Behavior notes

- **Initial value priority:** `value` → `defaultValue` → `initTime` → current time.
  `defaultValue` / `initTime` are read on mount only.
- **`onChange` on mount:** in uncontrolled mode `onChange` is called once after mount with
  the initial time (same as previous versions). In controlled mode it is not.
- **Controlled mode:** user gestures move the wheels immediately and report through
  `onChange`; update `value` with the reported time. Setting `value` to the time the
  picker already shows is a no-op, so echoing `onChange` back never loops. If you do not
  update `value`, the wheels keep the user's selection until `value` changes. A `value`
  change during a drag is overridden when the drag ends. Invalid values are ignored with
  a console warning.
- **Rebuilds:** changing `hourFormat` or `infinite` re-renders the wheels (their DOM
  structure differs) and keeps the currently selected time. `locale` only swaps the
  AM/PM labels and does not rebuild.

### Migrating from `initTime`

`initTime` still works but is deprecated and may be removed in a future major version.

```diff
- <TimePicker initTime={new Date(2025, 0, 1, 7, 30)} onChange={handleChange} />
+ <TimePicker defaultValue={{ hour: 7, minute: 30 }} onChange={handleChange} />
```

## Performance

While a wheel moves, only items that enter or leave the visible range have their
visibility updated, instead of every item on every animation frame. For a 60-item
minute wheel, a 60-frame flick went from 3,600 to 60 `style.visibility` writes.
See [BENCHMARK.md](BENCHMARK.md) for the method, all scenarios and how to reproduce.

## Time Format (`hourFormat`)

- `12`: Displays AM/PM notation
- `24`: Displays 0-23 hour format

## Get involved!

We appreciate your feedback and contributions. If you have feature requests, questions, or want to contribute code or config files, please don't hesitate to use the GitHub Issue tracker.

We welcome all individual contributors, regardless of their level of experience or skill set. Your contributions are valuable, and we are excited to see what you can accomplish in this collaborative and supportive environment.

## Reference

Inspired by [ios-style-picker](https://www.npmjs.com/package/ios-style-picker?activeTab=readme)

It's forked from [this gist](https://gist.github.com/wjpeters/876a8fe4040a2bb4b4eb28d2270620a5)

## License

The MIT License.
