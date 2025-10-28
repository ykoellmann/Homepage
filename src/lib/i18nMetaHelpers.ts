import type { TFunction } from 'i18next';
import type { ProjectWithTechStackMeta, IDEPluginProjectMeta, Feature, Shortcut, TechStack } from '../pages/src/shared/types';
import { cryptborneMeta } from '../pages/src/cryptborne/meta';
import { satTrackMeta } from '../pages/src/SatTrack/meta';
import { cteXecutorMeta } from '../pages/src/cteXecutor/meta';
import { homepageMeta } from '../pages/src/homepage/meta';

/**
 * Merges structure from meta.ts with translations from JSON
 *
 * meta.ts provides:
 * - TypeScript interfaces for JSON structure (type safety)
 * - Non-translatable data (URLs, icons, search weights)
 *
 * JSON provides:
 * - All text content (translated)
 */

// ============================================================================
// Homepage
// ============================================================================

export function getHomepageMeta(t: TFunction): ProjectWithTechStackMeta {
    return {
        name: t('projects:homepage.name'),
        slug: homepageMeta.slug,
        description: t('projects:homepage.description'),
        keywords: t('projects:homepage.keywords', { returnObjects: true }) as string[],
        category: homepageMeta.category,
        icon: homepageMeta.icon,
        debugUrl: homepageMeta.debugUrl,
        features: Object.entries(homepageMeta.features).map(([id, config]): Feature => ({
            _searchableId: `feature-${id}`,
            _searchWeight: config.searchWeight,
            icon: config.icon,
            title: t(`projects:homepage.features.${id}.title`),
            description: t(`projects:homepage.features.${id}.description`),
        })),
        techStack: homepageMeta.techStack.map((tech): TechStack => ({
            _searchableId: `tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`,
            _searchWeight: tech.searchWeight,
            name: tech.name,
            category: tech.category,
        })),
    };
}

// ============================================================================
// Cryptborne
// ============================================================================

export function getCryptborneMeta(t: TFunction): ProjectWithTechStackMeta {
    return {
        name: t('projects:cryptborne.name'),
        slug: cryptborneMeta.slug,
        description: t('projects:cryptborne.description'),
        keywords: t('projects:cryptborne.keywords', { returnObjects: true }) as string[],
        category: cryptborneMeta.category,
        icon: cryptborneMeta.icon,
        url: cryptborneMeta.url,
        debugUrl: cryptborneMeta.debugUrl,
        features: Object.entries(cryptborneMeta.features).map(([id, config]): Feature => ({
            _searchableId: `feature-${id}`,
            _searchWeight: config.searchWeight,
            icon: config.icon,
            title: t(`projects:cryptborne.features.${id}.title`),
            description: t(`projects:cryptborne.features.${id}.description`),
        })),
        techStack: Object.entries(cryptborneMeta.techStack).map(([id, config]): TechStack => ({
            _searchableId: `tech-${id}`,
            _searchWeight: config.searchWeight,
            name: t(`projects:cryptborne.techStack.${id}`),
            category: config.category,
        })),
    };
}

// ============================================================================
// SatTrack
// ============================================================================

export function getSatTrackMeta(t: TFunction): ProjectWithTechStackMeta {
    return {
        name: t('projects:sattrack.name'),
        slug: satTrackMeta.slug,
        description: t('projects:sattrack.description'),
        keywords: t('projects:sattrack.keywords', { returnObjects: true }) as string[],
        category: satTrackMeta.category,
        icon: satTrackMeta.icon,
        debugUrl: satTrackMeta.debugUrl,
        features: Object.entries(satTrackMeta.features).map(([id, config]): Feature => ({
            _searchableId: `feature-${id}`,
            _searchWeight: config.searchWeight,
            icon: config.icon,
            title: t(`projects:sattrack.features.${id}.title`),
            description: t(`projects:sattrack.features.${id}.description`),
        })),
        techStack: satTrackMeta.techStack.map((tech): TechStack => ({
            _searchableId: `tech-${tech.name.toLowerCase().replace(/\s+/g, '-')}`,
            _searchWeight: tech.searchWeight,
            name: tech.name,
            category: tech.category,
        })),
    };
}

// ============================================================================
// cteXecutor
// ============================================================================

export function getCteXecutorMeta(t: TFunction): IDEPluginProjectMeta {
    // Flatten all features from categories
    const allFeatures: Feature[] = [];

    Object.entries(cteXecutorMeta.features).forEach(([category, features]) => {
        Object.entries(features).forEach(([featureId, config]) => {
            allFeatures.push({
                _searchableId: `feature-${featureId}`,
                _searchWeight: config.searchWeight,
                icon: config.icon,
                title: t(`projects:ctexecutor.features.${category}.${featureId}.title`),
                description: t(`projects:ctexecutor.features.${category}.${featureId}.description`),
                category,
            });
        });
    });

    const shortcuts: Shortcut[] = Object.entries(cteXecutorMeta.shortcuts).map(([id, config]) => ({
        _searchableId: `shortcut-${id}`,
        _searchWeight: config.searchWeight,
        action: t(`projects:ctexecutor.shortcuts.${id}.action`),
        keys: t(`projects:ctexecutor.shortcuts.${id}.keys`),
        description: t(`projects:ctexecutor.shortcuts.${id}.description`),
    }));

    return {
        name: t('projects:ctexecutor.name'),
        slug: cteXecutorMeta.slug,
        description: t('projects:ctexecutor.description'),
        keywords: t('projects:ctexecutor.keywords', { returnObjects: true }) as string[],
        category: cteXecutorMeta.category,
        icon: cteXecutorMeta.icon,
        url: cteXecutorMeta.url,
        debugUrl: cteXecutorMeta.debugUrl,
        version: cteXecutorMeta.version,
        downloads: cteXecutorMeta.downloads,
        features: allFeatures,
        shortcuts,
    };
}
