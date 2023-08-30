import { CustomStore } from "./CustomStore";
import type { ConstrainedTextSetting, NumericSetting, SelectionSetting } from "$lib/classes/Settings";
//TODO : docs, json conversion, sync with server, default values

export class UserPreferences {
    get flags() {
        return []
    }
    messageGroupingTimeout: NumericSetting;
    layout: SelectionSetting;
    textSize: NumericSetting;
    locale: ConstrainedTextSetting;

    constructor() {
        throw new Error("Not implemented");
    }

    static fromJson(data:any):UserPreferences{
        throw new Error("Not implemented");
    }

    exportSettings():JSON{
        throw new Error("Not implemented");
    }
}

export class PreferenceStore extends CustomStore<UserPreferences>{
    constructor(preferences: UserPreferences) {
        super(preferences);
    }
}

const userPreferences = new PreferenceStore(new UserPreferences());

export default userPreferences;