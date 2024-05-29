/**
 * User available, account-bound settings
 * 
 * It's key represents the `i18n` key so it's name and description shall be displayed based on that. 
 */
export abstract class Setting {
    /**
     * Simple type representation to make sure equality can be checked on raw json exports too
     */
    abstract readonly type: string;
    /**
     * Key to determine the language
     */
    localeKey: string;
    /**
     * Compares two setting objects
     * 
     * Note that only the held values are compared to determine equality
     * 
     * Only use this function to check deviation from data on the server
     * @param setting The other setting instance
     */
    abstract equals(setting: Setting): boolean;
    /**
     * Creates a deep copy of the Setting
     * 
     * The resulted setting will not be dependent to the originin by any means
     */
    abstract copy(): Setting;

    constructor(localeKey: string) {
        this.localeKey = localeKey;
    }
}

/**
 * Selection based setting, where each available option is an `i18n` locale key with name and description
 * 
 * It's value shall be either considered as a numeric index, or an enum instance
 * 
 * Server side it is stored as a non-negative integer (index)
 */
export class SelectionSetting extends Setting {
    type = "selection";
    readonly options: string[];
    private _currentIndex: number = 0;
    get currentIndex(): number { return this._currentIndex.valueOf() };
    set currentIndex(value: number) {
        if (value > -1 && value < this.options.length) this._currentIndex = value;
    }

    get current(): string { return this.options[this._currentIndex] }
    set current(value: string) {
        let index = this.options.indexOf(value);
        if (index) {
            this._currentIndex = index;
        }
    }

    constructor(localeKey: string, options: string[]) {
        super(localeKey);
        this.options = options;
    }

    equals(setting: Setting): boolean {
        if (setting.type !== this.type)
            return false;
        return (setting as SelectionSetting).currentIndex === this.currentIndex;
    }

    copy() {
        return new SelectionSetting(this.localeKey.repeat(1), this.options.map(option => option.repeat(1)));
    }
}

/**
 * Numeric setting
 * 
 * If not specified, the bounds are `Number`'s `SAFE_INTEGER` values
 */
export class NumericSetting extends Setting {
    type = "numeric";
    readonly min: number;
    readonly max: number;
    value: number;

    constructor(localeKey: string, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER, value: number = null) {
        super(localeKey);
        this.min = min;
        this.max = max;
        this.value = value ?? min;
    }

    /**
     * Indicates whether the current value is in the set bounds
     */
    get isInBounds(): boolean {
        return this.value >= this.min && this.value <= this.max;
    }

    equals(setting: Setting): boolean {
        if (setting.type !== this.type)
            return false;
        return (setting as NumericSetting).value === this.value;
    }

    copy() {
        return new NumericSetting(this.localeKey.repeat(1), this.min.valueOf(), this.max.valueOf(), this.value.valueOf());
    }
}

/**
 * Text setting
 */
export class TextSetting extends Setting {
    type = "text";
    value: string;

    constructor(localeKey: string, value: string = "") {
        super(localeKey);
        this.value = value;
    }

    equals(setting: Setting): boolean {
        if (setting.type !== this.type)
            return false;
        return (setting as TextSetting).value === this.value;
    }

    copy() {
        return new TextSetting(this.localeKey.repeat(1), this.value.repeat(1));
    }
}

/**
 * A special kind of text setting
 * 
 * It's limits are defined with a regular expression, and shall be checked before storing the final value
 */
export class ConstrainedTextSetting extends TextSetting {
    type = "constrainedText"
    private readonly constrain: RegExp;

    constructor(localeKey: string, constrain: RegExp = /.*/, value: string = "") {
        super(localeKey, value);
        this.constrain = constrain;
    }

    /**
     * Property about whether the current value is valid
     * 
     * This property should be checked before finally storing the value
     */
    get valueIsvalid() {
        return this.checkValue(this.value);
    }

    /**
     * Checks the given value with the stored Regular Expression
     * @param value 
     * @returns Whether the string passes the match or not
     */
    checkValue(value: string): boolean {
        return this.constrain.test(value);
    }

    equals(setting: Setting): boolean {
        if (setting.type !== this.type)
            return false;
        return (setting as ConstrainedTextSetting).value === this.value;
    }

    copy() {
        return new ConstrainedTextSetting(this.localeKey.repeat(1), new RegExp(this.constrain.source), this.value.repeat(1));
    }
}

/**
 * Simple toogle setting
 */
export class BooleanSetting extends Setting {
    type = "boolean";
    isSet: boolean;

    constructor(localeKey: string, isSet: boolean = false) {
        super(localeKey);
        this.isSet = isSet;
    }

    equals(setting: Setting): boolean {
        if (setting.type !== this.type)
            return false;
        return (setting as BooleanSetting).isSet === this.isSet;
    }

    copy(){
        return new BooleanSetting(this.localeKey.repeat(1), this.isSet.valueOf())
    }
}