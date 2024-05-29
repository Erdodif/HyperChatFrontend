import { CustomStore } from "./CustomStore";
import { BooleanSetting, NumericSetting, ConstrainedTextSetting, SelectionSetting, Setting } from "$lib/classes/Settings";
import BitField from "bitfield";
import { locale as GlobalLocale, locales as GlobalLocales } from "svelte-i18n";

export type PreferenceJson = { flags: bigint | BigInt, message_grouping_timeout: number, layout: number, text_size: number, locale: string }

/**
 * returns the UserPreference flags (may be used in stylesheet)
 * 
 * The flags' order specified by the API reference
 */
export const PREFERENCE_FLAGS = [
    "render-attachments",
    "autoplay-gifs"
]

/**
 * Singleton to represent the user's settings
 * 
 * The values specified here shall be stored on the server and do match with the API's specification
 */
export class UserPreferences {
    get settings(): Setting[] {
        return [this.messageGroupingTimeout, this.layout, this.textSize, this.locale, ...this.flags];
    }

    /**
     * Boolean values that together holds one value (as it is stored as a bitfield on the server)
     * 
     * The flags order shall match the order specified in the API's documentation, 
     * since the server's numeric representation is order-sensitive
     */
    readonly flags: BooleanSetting[] = [
        new BooleanSetting("settings.flags.render_attachments"),
        new BooleanSetting("settings.flags.autoplay_gifs")
    ];

    /**
     * The time period in which consecutive messages from the same member are grouped together
     * only showing the timestamp and the sender on the first occurence, if the client supports message grouping.
     * 
     * Server default is 60, there is no upper bound yet.
     * Negative values is not allowed and shall be treated as zero (letting the client show message time at al times).
     */
    messageGroupingTimeout: NumericSetting = new NumericSetting("settings.message_grouping_timeout", 0, 600);

    /**
     * Layout spacing setting
     * 
     * The current possible settings in order are: Compact | Normal | Comfy
     * 
     * Note that not all clients implement this setting the same way if even
     * */
    layout: SelectionSetting = new SelectionSetting("settings.layout", [
        "settings.layout.compact",
        "settings.layout.normal",
        "settings.layout.comfy",
    ]);

    /**
     * Sets the base font size, if applicable.
     * 
     * Message font size shall be treated as the base font size, headings, comments shall be adjusted accordingly
     */
    textSize: NumericSetting = new NumericSetting("settings.font_size", 8, 36);

    /**
     * Sets the language of the UI
     * 
     * Server default is `en_US`
     * 
     * If the client does not support the locale, it'll fall back to en_US
     */
    locale: ConstrainedTextSetting = new ConstrainedTextSetting("settings.locale", /^[a-z]{2}(?:_[A-Z]{2})?$/);

    constructor(flagsValue: bigint, messageGroupingTimout: number, layout: number, locale: string, textSize: number) {
        let flags = UserPreferences.flagFromBigInt(flagsValue);
        for (let i = 0; i < this.flags.length; i++) {
            this.flags[i].isSet = flags.get(i);
        }
        this.messageGroupingTimeout.value = messageGroupingTimout;
        this.layout.current = this.layout.options[layout];
        this.locale.value = locale;
        this.textSize.value = textSize;
        GlobalLocales.subscribe((locales) => {
            if ((locales as Array<string>).includes(this.locale.value.replace(/[_.]/, '-'))) {
                GlobalLocale.set(this.locale.value.replace(/[_.]/, '-'));
            }
        });
    };

    static flagFromBigInt(value: bigint): BitField {
        let field = new BitField(0, { grow: Infinity });
        let i = 0;
        while (value !== 0n) {
            field.set(i, value % 2n == 0n);
            value /= 2n;
            i++;
        }
        return field;
    }

    get flagsBigInt(): bigint {
        let value = 0n;
        for (const flag of this.flags) {
            value *= 2n;
            value += flag.isSet ? 1n : 0n;
        }
        return value;
    }

    /**
     * Fills the UserPreferences from the given Json Object
     * @param data The server's Preference response
     */
    static fromJson(data: PreferenceJson) {
        return new UserPreferences(
            BigInt(data.flags as bigint),
            data.message_grouping_timeout,
            data.layout,
            data.locale,
            data.text_size
        );
    }


    /**
     * Represents all the flags value as a single positive number
     * 
     * The flags order shall match the order specified in the API's documentation
     */
    get flagsValue(): BitField {
        let sum = new BitField(this.flags.length);
        for (let i = 0; i < this.flags.length; i++) {
            sum.set(i, this.flags[i].isSet);
        }
        return sum;
    }

    /**
     * Exports the current settings instance into a Json object ready to ship to the server
     * @returns An API compatible Json representation of the UserPreference
     */
    exportSettings(): PreferenceJson {
        return {
            flags: this.flagsBigInt,
            message_grouping_timeout: this.messageGroupingTimeout.value,
            layout: this.layout.options.indexOf(this.layout.current),
            text_size: this.textSize.value,
            locale: this.locale.value
        }
    }

    /**
     * Creates a deep copy of this preference bundle
     */
    copy(): UserPreferences {
        return new UserPreferences(
            this.flagsBigInt.valueOf(),
            this.messageGroupingTimeout.value.valueOf(),
            this.layout.currentIndex.valueOf(),
            this.locale.value.repeat(1),
            this.textSize.value.valueOf()
        );
    }

    /**
     * Applies the current settings in the stylesheet's root element
     * 
     * All flags are fed into whethet the client's currently using that information or not
     * 
     * Some behavioral settings may not appear in the stylesheet, those values are irrelevant for styling
     */
    applyStyleSettings() {
        if (!document) {
            throw new Error("User preferences cannot be applied outside the client's scope! (there is no document to apply style variables)");
        }
        document.documentElement.style.setProperty("--layout", this.styleLayout);
        document.documentElement.style.setProperty("--font-size", `${this.textSize.value + 6}px`);
        //Set flags, if a CSS variable present, it's corresponding setting is considered as set
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i].isSet) {
                document.documentElement.style.setProperty(`--flag-${PREFERENCE_FLAGS[i]}`, "1");
            }
        }
    }

    /**
     * The current layout preset in string representation
     */
    get styleLayout() {
        return ["compact", "normal", "comfy"][this.layout.currentIndex];
    }

    /**
     * Compares each setting instance and returns how many are different
     * 
     * -1 means that the two preference objects' settings[] are different
     * @param prefs
     */
    compare(prefs: UserPreferences) {
        if (prefs.settings.length !== this.settings.length) return -1;
        let diff = 0;
        for (let i = 0; i < this.settings.length; i++) {
            if (!this.settings[i].equals(prefs.settings[i])) {
                console.warn(`At (${i}):`);
                console.log(this.settings[i]);
                console.log(prefs.settings[i]);
                diff += 1;
            }
        }
        return diff;
    }

}

export class PreferenceStore extends CustomStore<UserPreferences> {
    constructor() {
        super(null);
    }

    fromJson(json: any, applyStyle: boolean = false) {
        this._value = UserPreferences.fromJson(json);
        if (applyStyle) {
            this._value.applyStyleSettings();
        }
        this.notify();
    }

    set(value: UserPreferences) {
        this._value = value;
        this.notify();
    }
}

const userPreferences = new PreferenceStore();

export default userPreferences;