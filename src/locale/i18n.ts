import { register, init, getLocaleFromNavigator, locale } from 'svelte-i18n';

const fallbackLocale: string = 'en';
const lngs: string[] = [fallbackLocale, 'hu'];

register('en', () => import('./en.json'));
register('hu', () => import('./hu.json'));

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