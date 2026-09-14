// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import TimePicker from '../src/components/TimePicker';
import {
  columns,
  drag,
  flush,
  render,
  selectedText,
  setupDom,
  teardownDom,
} from './timePickerHarness';

beforeEach(setupDom);
afterEach(teardownDom);

const texts = (host: HTMLElement) => columns(host).map(selectedText);

describe('TimePicker controlled value', () => {
  it('moves the wheels when value changes, without onChange and without recreating', async () => {
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} value={{ hour: 9, minute: 15 }} />
    );
    await flush();
    expect(texts(host)).toEqual(['AM', '9', '15']);
    expect(onChange).not.toHaveBeenCalled();

    const wheelsBefore = host.querySelectorAll('.ios-style-picker');

    await rerender(<TimePicker onChange={onChange} value={{ hour: 18, minute: 40 }} />);
    await flush();
    expect(texts(host)).toEqual(['PM', '6', '40']);

    await rerender(<TimePicker onChange={onChange} value={{ hour: 0, minute: 0 }} />);
    await flush();
    expect(texts(host)).toEqual(['AM', '12', '00']);

    await rerender(<TimePicker onChange={onChange} value={{ hour: 12, minute: 59 }} />);
    await flush();
    expect(texts(host)).toEqual(['PM', '12', '59']);

    expect(onChange).not.toHaveBeenCalled();
    const wheelsAfter = host.querySelectorAll('.ios-style-picker');
    wheelsAfter.forEach((el, i) => expect(el).toBe(wheelsBefore[i]));
  });

  it('reports gestures and does not loop when the parent echoes the value', async () => {
    const onChange = vi.fn();
    let value = { hour: 14, minute: 35 };
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} value={value} />
    );
    await flush();
    onChange.mockImplementation((hour: number, minute: number) => {
      value = { hour, minute };
    });

    await drag(columns(host)[1], 2); // 2 PM -> 4 PM
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(16, 35);

    await rerender(<TimePicker onChange={onChange} value={{ ...value }} />);
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(texts(host)).toEqual(['PM', '4', '35']);
  });

  it.each([
    { hourFormat: '24' as const, infinite: false },
    { hourFormat: '24' as const, infinite: true },
    { hourFormat: '12' as const, infinite: true },
  ])('applies value changes ($hourFormat h, infinite=$infinite)', async (props) => {
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} {...props} value={{ hour: 23, minute: 5 }} />
    );
    await flush();
    await rerender(
      <TimePicker onChange={onChange} {...props} value={{ hour: 7, minute: 50 }} />
    );
    await flush(2000);
    const cols = texts(host);
    if (props.hourFormat === '24') {
      expect(cols).toEqual(['07', '50']);
    } else {
      expect(cols).toEqual(['AM', '7', '50']);
    }
    expect(onChange).not.toHaveBeenCalled();
  });

  it('ignores invalid values with a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} value={{ hour: 10, minute: 10 }} />
    );
    await flush();
    await rerender(<TimePicker onChange={onChange} value={{ hour: 25, minute: 10 }} />);
    await flush();
    expect(texts(host)).toEqual(['AM', '10', '10']);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('works under StrictMode', async () => {
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <StrictMode>
        <TimePicker onChange={onChange} value={{ hour: 21, minute: 12 }} />
      </StrictMode>
    );
    await flush();
    expect(texts(host)).toEqual(['PM', '9', '12']);
    await rerender(
      <StrictMode>
        <TimePicker onChange={onChange} value={{ hour: 3, minute: 3 }} />
      </StrictMode>
    );
    await flush();
    expect(texts(host)).toEqual(['AM', '3', '03']);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('TimePicker uncontrolled', () => {
  it('uses defaultValue and reports it once on mount (like initTime)', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker onChange={onChange} defaultValue={{ hour: 1, minute: 0 }} />
    );
    await flush();
    expect(texts(host)).toEqual(['AM', '1', '00']);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(1, 0);
  });

  it('prefers defaultValue over the deprecated initTime', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker
        onChange={onChange}
        defaultValue={{ hour: 20, minute: 1 }}
        initTime={new Date(2025, 0, 1, 5, 5)}
      />
    );
    await flush();
    expect(texts(host)).toEqual(['PM', '8', '01']);
  });

  it('keeps the selected time when hourFormat / infinite change', async () => {
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} defaultValue={{ hour: 16, minute: 20 }} />
    );
    await flush();
    await drag(columns(host)[2], 5); // minute 20 -> 25
    await rerender(
      <TimePicker onChange={onChange} hourFormat="24" defaultValue={{ hour: 16, minute: 20 }} />
    );
    await flush();
    expect(texts(host)).toEqual(['16', '25']);
    await rerender(
      <TimePicker
        onChange={onChange}
        hourFormat="12"
        infinite
        defaultValue={{ hour: 16, minute: 20 }}
      />
    );
    await flush(2000);
    expect(texts(host)).toEqual(['PM', '4', '25']);
    expect(onChange).toHaveBeenLastCalledWith(16, 25);
  });
});

describe('TimePicker locale', () => {
  it('updates AM/PM labels in place when locale changes', async () => {
    const onChange = vi.fn();
    const { host, rerender } = await render(
      <TimePicker onChange={onChange} value={{ hour: 15, minute: 0 }} locale="en" />
    );
    await flush();
    expect(texts(host)[0]).toBe('PM');
    const wheel = host.querySelector('.ios-style-picker');

    await rerender(
      <TimePicker onChange={onChange} value={{ hour: 15, minute: 0 }} locale="ko" />
    );
    expect(texts(host)[0]).toBe('오후');
    expect(host.querySelector('.ios-style-picker')).toBe(wheel);
    const options = [...host.querySelectorAll('.ios-style-picker__option-item')]
      .slice(0, 2)
      .map((el) => el.textContent);
    expect(options).toEqual(['오전', '오후']);

    await rerender(
      <TimePicker onChange={onChange} value={{ hour: 9, minute: 0 }} locale="ja" />
    );
    await flush();
    expect(texts(host)).toEqual(['午前', '9', '00']);

    // the new locale survives an engine rebuild
    await rerender(
      <TimePicker onChange={onChange} value={{ hour: 9, minute: 0 }} locale="ja" infinite />
    );
    await flush(2000);
    expect(texts(host)).toEqual(['午前', '9', '00']);
    expect(onChange).not.toHaveBeenCalled();
  });
});
