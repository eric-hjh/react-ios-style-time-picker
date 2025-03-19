import { LOCALE_MAP } from './TimePickerSource';
export type TimePickerProps = {
    onChange: (hour: number, minute: number) => void;
    initTime?: Date;
    infinite?: boolean;
    className?: string;
    hourFormat?: '12' | '24';
    locale?: keyof typeof LOCALE_MAP;
};
declare const TimePicker: ({ onChange, initTime: _initTime, infinite, className: _className, hourFormat, locale, }: TimePickerProps) => import("react/jsx-runtime").JSX.Element;
export default TimePicker;
