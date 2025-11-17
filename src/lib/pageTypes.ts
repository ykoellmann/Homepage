/**
 * Base types for all pages and projects
 *
 * Pages/Projects that are "runnable" (have url/debugUrl) automatically
 * provide RunConfig data without extra exports.
 */

// ============================================================================
// Run Configuration (for IDE run controls)
// ============================================================================

/**
 * RunConfig defines whether a page/project is "runnable" in IDE controls
 * Just add url/debugUrl to your page data and it becomes runnable!
 */
export interface RunConfig {
    url?: string;           // Production/Live URL (appears as "▶ Start")
    debugUrl?: string;      // Debug/Dev URL (appears as "🐛 Debug", usually GitHub)
}

// ============================================================================
// Base Page Data (static, non-translated)
// ============================================================================

/**
 * All pages/projects extend this.
 * RunConfig is included, so any page with url/debugUrl is automatically runnable.
 */
export interface BasePageData extends RunConfig {
    slug: string;
    category: string;
    icon: string;
    keywords?: string[];
}

// ============================================================================
// Base Translation Interface (from JSON)
// ============================================================================

/**
 * Minimum translations every page/project needs.
 * Extend this for page-specific translations.
 */
export interface BasePageTranslations {
    name: string;
    description: string;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Check if page data is runnable (has url or debugUrl)
 */
export function isRunnable(pageData: BasePageData): boolean {
    return !!(pageData.url || pageData.debugUrl);
}

/**
 * Get RunConfig from page data with translated name
 * Only returns config if page is actually runnable
 */
export function getRunConfig(
    pageData: BasePageData & Partial<BasePageTranslations>
): (RunConfig & { name: string }) | null {
    if (!isRunnable(pageData)) {
        return null;
    }

    return {
        name: pageData.name || pageData.slug,
        url: pageData.url,
        debugUrl: pageData.debugUrl,
    };
}
