export abstract class Setting {
    name: string;
    description: string;

    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}

export class SelectionSetting extends Setting {
    private _options: [string, string][];
    private currentIndex: number = 0;

    get options() { return structuredClone(this._options) }
    get current(): [string, string] { return structuredClone(this._options[this.currentIndex]); }

    getName(index: number) {
        return this._options[index][0];
    }

    getDescription(index: number) {
        return this._options[index][1];
    }

    constructor(name: string, description: string, options: [string, string][]) {
        super(name, description);
        this._options = options;
    }
}

export class NumericSetting extends Setting {
    min: number;
    max: number;
    value: number;

    constructor(name: string, description: string, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER, value: number = null) {
        super(name, description);
        this.min = min;
        this.max = max;
        this.value = value ?? min;
    }
}

export class TextSetting extends Setting {
    value: string;

    constructor(name: string, description: string, value: string = "") {
        super(name, description);
        this.value = value;
    }
}

export class ConstrainedTextSetting extends TextSetting {
    private constrain: RegExp;

    /**
     * Property about whether the current value is valid
     * 
     * This property should be checked before finally storing the value
     */
    get valueIsvalid() {
        return this.checkValue(this.value);
    }

    constructor(name: string, description: string, constrain: RegExp = /.*/, value: string = "") {
        super(name, description, value);
        this.constrain = constrain;
    }

    /**
     * Checks the given value with the stored Regular Expression
     * @param value 
     * @returns Whether the expression passes or not
     */
    checkValue(value: string): boolean {
        return this.constrain.test(value);
    }

}

export class BooleanSetting extends Setting {

    isSet: boolean;

    constructor(name: string, description: string, isSet: boolean = false) {
        super(name, description);
        this.isSet = isSet;
    }
}