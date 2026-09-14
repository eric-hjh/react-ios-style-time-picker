// @vitest-environment jsdom
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

describe('TimePicker (existing props)', () => {
  it('selects initTime and reports it once on mount (12h)', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker onChange={onChange} initTime={new Date(2025, 0, 1, 14, 35)} />
    );
    await flush();
    const [ampm, hour, minute] = columns(host);
    expect([selectedText(ampm), selectedText(hour), selectedText(minute)]).toEqual([
      'PM',
      '2',
      '35',
    ]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(14, 35);
  });

  it('reports user drags as 24h hours (12h format)', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker onChange={onChange} initTime={new Date(2025, 0, 1, 14, 35)} />
    );
    await flush();
    const [, hour, minute] = columns(host);
    await drag(hour, 3); // 2 PM -> 5 PM
    expect(onChange).toHaveBeenLastCalledWith(17, 35);
    await drag(minute, -5);
    expect(onChange).toHaveBeenLastCalledWith(17, 30);
  });

  it('reports user drags in 24h format', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker
        onChange={onChange}
        hourFormat="24"
        initTime={new Date(2025, 0, 1, 14, 35)}
      />
    );
    await flush();
    const [hour] = columns(host);
    expect(selectedText(hour)).toBe('14');
    await drag(hour, -5); // 14 -> 9
    expect(selectedText(hour)).toBe('09');
    expect(onChange).toHaveBeenLastCalledWith(9, 35);
  });

  it('supports infinite 24h', async () => {
    const onChange = vi.fn();
    const { host } = await render(
      <TimePicker
        onChange={onChange}
        hourFormat="24"
        infinite
        initTime={new Date(2025, 0, 1, 23, 58)}
      />
    );
    await flush();
    const [hour, minute] = columns(host);
    expect([selectedText(hour), selectedText(minute)]).toEqual(['23', '58']);
    await drag(minute, 3); // wraps 58 -> 01
    expect(selectedText(minute)).toBe('01');
    expect(onChange).toHaveBeenLastCalledWith(23, 1);
  });
});
