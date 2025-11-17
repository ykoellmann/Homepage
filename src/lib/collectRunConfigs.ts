import { getRunConfig, type BasePageData, type BasePageTranslations } from "./pageTypes";

// Import all meta.ts files
const modules = import.meta.glob("../pages/**/meta.ts", { eager: true }) as Record<
    string,
    any
>;

/**
 * Collect all runnable page configurations.
 * Looks for *Data exports (e.g., cryptborneData, homepageData) that extend BasePageData.
 * If they have url/debugUrl, they're automatically runnable.
 */
export const runConfigs = Object.values(modules)
    .flatMap((module) => {
        // Find all exports that might be page data (typically end with "Data")
        const dataExports = Object.keys(module)
            .filter(key => key.endsWith('Data') || key === 'data')
            .map(key => module[key])
            .filter((exp): exp is BasePageData & Partial<BasePageTranslations> => {
                return exp && typeof exp === 'object' && 'slug' in exp;
            });

        // Extract run configs from runnable pages
        return dataExports
            .map(data => getRunConfig(data))
            .filter((config): config is NonNullable<typeof config> => config !== null);
    });