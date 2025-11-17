import { useTranslation } from 'react-i18next';

/**
 * Universal hook for loading page data with translations
 *
 * Combines static metadata with translated content from JSON files.
 *
 * @example
 * // In meta.ts:
 * export const aboutPageData = {
 *   slug: 'about' as const,
 *   icon: '👤',
 *   category: 'Pages' as const,
 *   experiences: [...], // Static data
 * };
 *
 * export interface AboutPageTranslations {
 *   name: string;
 *   description: string;
 * }
 *
 * // In component:
 * const data = usePageData(aboutPageData, 'common.pages.about');
 * // Returns: { slug: 'about', icon: '👤', name: "About Me", description: "...", experiences: [...] }
 */
export function usePageData<
  TStatic extends Record<string, any>,
  TTranslations extends Record<string, any> = Record<string, any>
>(
  staticData: TStatic,
  translationPath?: string,
  namespace: string = 'common'
): TStatic & TTranslations {
  const { t } = useTranslation(namespace);

  // If no translation path provided, return only static data
  if (!translationPath) {
    return staticData as TStatic & TTranslations;
  }

  // Load translations
  const translations = t(translationPath, { returnObjects: true }) as TTranslations;

  // Merge static data with translations
  return {
    ...staticData,
    ...translations,
  } as TStatic & TTranslations;
}
