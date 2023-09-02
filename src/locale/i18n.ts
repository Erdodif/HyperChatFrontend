import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

const fallbackLocale: string = 'en-US';
const lngs: string[] = [fallbackLocale, 'hu-HU'];

register('en-US', () => import('./en_US.json'));
register('hu-HU', () => import('./hu_HU.json'));

locale.subscribe((lng) => {
    if (lng) localStorage.setItem('svelte-i18n-locale', lng);
});

let initialLocale: string;
const detectedLocale: string = localStorage.getItem('svelte-i18n-locale') || getLocaleFromNavigator();

if (lngs.indexOf(detectedLocale) > -1) initialLocale = detectedLocale;

if (!initialLocale && detectedLocale.indexOf('-') > 0) {
    const foundLng = lngs.find((l) => detectedLocale.indexOf(l + '-') === 0);
    if (foundLng) initialLocale = foundLng;
}

if (!initialLocale) initialLocale = fallbackLocale;

init({
    fallbackLocale,
    initialLocale
});