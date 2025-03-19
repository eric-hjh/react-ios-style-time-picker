import { default as easing } from './utils/easing';
type IosStylePickerVariant = 'infinite' | 'normal';
export interface IosStylePickerSourceItem {
    value: number;
    text: string;
}
export interface IosStylePickerOptions {
    variant?: IosStylePickerVariant;
    source: IosStylePickerSourceItem[];
    onChange?: (selected: IosStylePickerSourceItem) => void;
    onSelect?: (selected: IosStylePickerSourceItem) => void;
    count?: number;
    sensitivity?: number;
    value?: number;
    currentData?: number;
}
declare class IosStylePicker {
    private variant;
    private source;
    private selected;
    private currentData;
    private onChange?;
    private onSelect?;
    private sensitivity;
    private wheelCount;
    private exceedA;
    private moveT;
    private moving;
    private targetElement;
    private html;
    private events;
    private itemHeight;
    private itemAngle;
    private radius;
    private scroll;
    private touchData;
    constructor(targetElement: HTMLElement, options: IosStylePickerOptions);
    private _createEventListener;
    private _touchstart;
    private _touchmove;
    private _getInitV;
    private _touchend;
    private _create;
    private _moveTo;
    _animateMoveByInitV(initV: number): Promise<void>;
    _animateToScroll(initScroll: number, finalScroll: number, t: number, easingName?: keyof typeof easing): Promise<void> | undefined;
    private _stop;
    private _selectByScroll;
    selectByCurrentHour(currentHour: number): void;
    select(value: number): void;
    updateAmPm(value: number): Promise<void>;
    destroy(): void;
}
export default IosStylePicker;
