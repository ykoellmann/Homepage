/**
 * Awards Page Data
 */

import type { BasePageData } from "../../lib/pageTypes.ts";

export const awardsPageData: BasePageData = {
    slug: 'awards',
    category: 'About',
    icon: '🏆',
    keywords: ['Auszeichnungen', 'Awards', 'Erfolge', 'Preise'],
};

export type AwardsPageData = typeof awardsPageData;
