import { writable, get, derived, type Writable } from "svelte/store";
import { browser } from '$app/environment';

class Theme {
    primary: string
    primaryVariant: string
    onPrimary: string
    secondary: string
    secondaryVariant: string
    onSecondary: string
    error: string
    onError: string
    background: string
    onBackground: string
    surface: string
    onSurface: string

    constructor(colors: string[]) {
        this.primary = colors[0];
        this.primaryVariant = colors[1];
        this.onPrimary = colors[2];
        this.secondary = colors[3];
        this.secondaryVariant = colors[4];
        this.onSecondary = colors[5];
        this.error = colors[6];
        this.onError = colors[7];
        this.background = colors[8];
        this.onBackground = colors[9];
        this.surface = colors[10];
        this.onSurface = colors[11];
    }

    static defaultTheme = new Theme(
        [
            '#bb86fc', '#3700b3', '#000000',
            '#03dac6', '#018786', '#000000',
            '#cf6679', '#000000',
            '#000000', '#ffffff',
            '#161616', '#ffffff'
        ]);
}
/*tmp*/
export const onSurface = writable('#ffffff');

/*\tmp*/
//export const theme = writable<Theme>(Theme.defaultTheme);
export const theme = derived<Writable<string>,Theme>(onSurface,($onSurface)=>{
    let dflt = Theme.defaultTheme;
    dflt.onSurface = $onSurface;
    //console.log(dflt);
    return dflt;
});

function isColor(color: string) {
    return CSS.supports('color', color);
}

export function themeToStorage(theme: Theme) {
    if (!browser) {
        console.error("getTheme accessed from server scope!");
        return;
    }
    localStorage.setItem("theme", JSON.stringify(theme));
    /*console.log(theme);
    console.log(JSON.stringify(theme))*/
}

export function themeFromStorage(): Theme | null {
    if (!browser) {
        console.error("getTheme accessed from server scope!");
        return null;
    }
    if (localStorage.getItem("theme")) {
        let stored = JSON.parse(localStorage.getItem("theme")) as Theme
        if (stored === null || !Object.values(stored).every(isColor)) {
            return
        };
        return stored;
    }
    return null;
}
