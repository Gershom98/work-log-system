import { usePage } from '@inertiajs/react';
import { useCallback } from 'react';
import sw from './sw';

const dictionaries = { en: {}, sw };

export function translate(locale, text, replacements) {
    const dictionary = dictionaries[locale] ?? {};
    let output = dictionary[text] ?? text;

    if (replacements) {
        // Longest key first so ":total" is replaced before ":to".
        const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

        for (const key of keys) {
            output = output.split(`:${key}`).join(String(replacements[key]));
        }
    }

    return output;
}

export function useI18n() {
    const locale = usePage().props.locale ?? 'en';
    const t = useCallback((text, replacements) => translate(locale, text, replacements), [locale]);

    return { t, locale };
}
