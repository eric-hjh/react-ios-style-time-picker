export declare const LOCALE_MAP: {
    en: {
        AM: string;
        PM: string;
    };
    ko: {
        AM: string;
        PM: string;
    };
    ja: {
        AM: string;
        PM: string;
    };
    zh: {
        AM: string;
        PM: string;
    };
};
type TimePickerSourceItem = {
    value: number;
    text: string;
};
export type TimePickerSourceOptions = {
    hourFormat?: '12' | '24';
    infinite?: boolean;
    locale?: keyof typeof LOCALE_MAP;
};
declare class TimePickerSource {
    #private;
    constructor({ hourFormat, infinite, locale, }?: TimePickerSourceOptions);
    get ampm(): TimePickerSourceItem[];
    get hours(): TimePickerSourceItem[];
    get minutes(): TimePickerSourceItem[];
}
export default TimePickerSource;
