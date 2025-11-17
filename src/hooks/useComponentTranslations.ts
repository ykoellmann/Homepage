import { useTranslation } from 'react-i18next';

/**
 * Generic hook for typed component translations.
 *
 * Usage:
 * 1. Define an interface for your component's translations
 * 2. Call this hook with the path to your translations in the JSON
 * 3. Get back a fully typed translation object
 *
 * @example
 * interface MyComponentTranslations {
 *   title: string;
 *   subtitle: string;
 * }
 *
 * const t = useComponentTranslations<MyComponentTranslations>('components.MyComponent');
 * // t.title and t.subtitle are now available with full type safety
 */
export function useComponentTranslations<T>(path: string, namespace: string = 'common'): T {
    const { t } = useTranslation(namespace);
    return t(path, { returnObjects: true }) as T;
}
