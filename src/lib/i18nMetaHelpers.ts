import type { TFunction } from 'i18next';
import type { ProjectWithTechStackMeta, IDEPluginProjectMeta, Feature, Shortcut } from '../pages/src/shared/types';

// Helper to generate Cryptborne meta data from translations
export function getCryptborneMeta(t: TFunction): ProjectWithTechStackMeta {
    return {
        name: t('projects:cryptborne.name'),
        slug: 'cryptborne',
        description: t('projects:cryptborne.description'),
        keywords: t('projects:cryptborne.keywords', { returnObjects: true }) as string[],
        category: 'Projects',
        icon: '⚔️',
        url: 'https://jy-studios.github.io/cryptborne/',
        debugUrl: 'https://github.com/JY-Studios/cryptborne',
        features: [
            {
                _searchableId: 'feature-procedural-dungeons',
                _searchWeight: 10,
                icon: '🏰',
                title: t('projects:cryptborne.features.proceduralDungeons.title'),
                description: t('projects:cryptborne.features.proceduralDungeons.description'),
            },
            {
                _searchableId: 'feature-weapon-variety',
                _searchWeight: 9,
                icon: '⚔️',
                title: t('projects:cryptborne.features.weaponVariety.title'),
                description: t('projects:cryptborne.features.weaponVariety.description'),
            },
            {
                _searchableId: 'feature-enemy-ai',
                _searchWeight: 8,
                icon: '👾',
                title: t('projects:cryptborne.features.enemyAi.title'),
                description: t('projects:cryptborne.features.enemyAi.description'),
            },
            {
                _searchableId: 'feature-inventory',
                _searchWeight: 7,
                icon: '🎒',
                title: t('projects:cryptborne.features.inventory.title'),
                description: t('projects:cryptborne.features.inventory.description'),
            },
            {
                _searchableId: 'feature-smooth-movement',
                _searchWeight: 8,
                icon: '🎮',
                title: t('projects:cryptborne.features.smoothMovement.title'),
                description: t('projects:cryptborne.features.smoothMovement.description'),
            },
            {
                _searchableId: 'feature-medieval-aesthetic',
                _searchWeight: 6,
                icon: '🎨',
                title: t('projects:cryptborne.features.medievalAesthetic.title'),
                description: t('projects:cryptborne.features.medievalAesthetic.description'),
            },
        ],
        techStack: [
            {
                _searchableId: 'tech-unity6',
                _searchWeight: 10,
                name: t('projects:cryptborne.techStack.unity6'),
                category: 'engine',
            },
            {
                _searchableId: 'tech-csharp',
                _searchWeight: 9,
                name: t('projects:cryptborne.techStack.csharp'),
                category: 'engine',
            },
            {
                _searchableId: 'tech-kaykit',
                _searchWeight: 7,
                name: t('projects:cryptborne.techStack.kaykit'),
                category: 'assets',
            },
            {
                _searchableId: 'tech-procedural-gen',
                _searchWeight: 8,
                name: t('projects:cryptborne.techStack.proceduralGen'),
                category: 'library',
            },
        ],
    };
}

// Helper to generate SatTrack meta data from translations
export function getSatTrackMeta(t: TFunction): ProjectWithTechStackMeta {
    return {
        name: t('projects:sattrack.name'),
        slug: 'sattrack',
        description: t('projects:sattrack.description'),
        keywords: t('projects:sattrack.keywords', { returnObjects: true }) as string[],
        category: 'Projects',
        icon: '🚀',
        debugUrl: 'https://github.com/JanVogt06/SatTrak-SatelliteVisualization',
        features: [
            {
                _searchableId: 'feature-realtime-tracking',
                _searchWeight: 10,
                icon: '🛰️',
                title: t('projects:sattrack.features.realtimeTracking.title'),
                description: t('projects:sattrack.features.realtimeTracking.description'),
            },
            {
                _searchableId: 'feature-interactive-camera',
                _searchWeight: 9,
                icon: '📹',
                title: t('projects:sattrack.features.interactiveCamera.title'),
                description: t('projects:sattrack.features.interactiveCamera.description'),
            },
            {
                _searchableId: 'feature-famous-satellites',
                _searchWeight: 8,
                icon: '⭐',
                title: t('projects:sattrack.features.famousSatellites.title'),
                description: t('projects:sattrack.features.famousSatellites.description'),
            },
            {
                _searchableId: 'feature-orbit-visualization',
                _searchWeight: 9,
                icon: '🌍',
                title: t('projects:sattrack.features.orbitVisualization.title'),
                description: t('projects:sattrack.features.orbitVisualization.description'),
            },
            {
                _searchableId: 'feature-heatmap',
                _searchWeight: 7,
                icon: '🔥',
                title: t('projects:sattrack.features.heatmap.title'),
                description: t('projects:sattrack.features.heatmap.description'),
            },
            {
                _searchableId: 'feature-day-night',
                _searchWeight: 8,
                icon: '🌓',
                title: t('projects:sattrack.features.dayNight.title'),
                description: t('projects:sattrack.features.dayNight.description'),
            },
            {
                _searchableId: 'feature-location-search',
                _searchWeight: 7,
                icon: '🔍',
                title: t('projects:sattrack.features.locationSearch.title'),
                description: t('projects:sattrack.features.locationSearch.description'),
            },
            {
                _searchableId: 'feature-time-control',
                _searchWeight: 8,
                icon: '⏱️',
                title: t('projects:sattrack.features.timeControl.title'),
                description: t('projects:sattrack.features.timeControl.description'),
            },
            {
                _searchableId: 'feature-performance',
                _searchWeight: 7,
                icon: '⚡',
                title: t('projects:sattrack.features.performance.title'),
                description: t('projects:sattrack.features.performance.description'),
            },
        ],
        techStack: [
            {
                _searchableId: 'tech-unity',
                _searchWeight: 10,
                name: 'Unity 2022.3 LTS',
                category: 'engine',
            },
            {
                _searchableId: 'tech-cesium',
                _searchWeight: 10,
                name: 'Cesium for Unity',
                category: 'library',
            },
            {
                _searchableId: 'tech-urp',
                _searchWeight: 7,
                name: 'Universal Render Pipeline',
                category: 'engine',
            },
            {
                _searchableId: 'tech-sgp4',
                _searchWeight: 9,
                name: 'SGP4 Orbit Propagation',
                category: 'library',
            },
            {
                _searchableId: 'tech-job-system',
                _searchWeight: 8,
                name: 'Unity Job System',
                category: 'engine',
            },
            {
                _searchableId: 'tech-celestrak',
                _searchWeight: 8,
                name: 'CelesTrak TLE Data',
                category: 'data',
            },
            {
                _searchableId: 'tech-geonames',
                _searchWeight: 6,
                name: 'GeoNames Database',
                category: 'data',
            },
            {
                _searchableId: 'tech-git-lfs',
                _searchWeight: 5,
                name: 'Git LFS',
                category: 'tool',
            },
        ],
    };
}

// Helper to generate cteXecutor meta data from translations
export function getCteXecutorMeta(t: TFunction): IDEPluginProjectMeta {
    const features: Feature[] = [
        // CTE Management
        {
            _searchableId: 'feature-cte-detection',
            _searchWeight: 10,
            icon: '🎯',
            title: t('projects:ctexecutor.features.cteManagement.cteDetection.title'),
            description: t('projects:ctexecutor.features.cteManagement.cteDetection.description'),
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-visual-highlighting',
            _searchWeight: 9,
            icon: '✨',
            title: t('projects:ctexecutor.features.cteManagement.visualHighlighting.title'),
            description: t('projects:ctexecutor.features.cteManagement.visualHighlighting.description'),
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-smart-execution',
            _searchWeight: 10,
            icon: '⚡',
            title: t('projects:ctexecutor.features.cteManagement.smartExecution.title'),
            description: t('projects:ctexecutor.features.cteManagement.smartExecution.description'),
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-copy-clipboard',
            _searchWeight: 7,
            icon: '📋',
            title: t('projects:ctexecutor.features.cteManagement.copyClipboard.title'),
            description: t('projects:ctexecutor.features.cteManagement.copyClipboard.description'),
            category: 'cte-management',
        },
        // Execute from Here
        {
            _searchableId: 'feature-execute-from-here',
            _searchWeight: 10,
            icon: '🎯',
            title: t('projects:ctexecutor.features.executeFromHere.executeFromHere.title'),
            description: t('projects:ctexecutor.features.executeFromHere.executeFromHere.description'),
            category: 'execute-from-here',
        },
        {
            _searchableId: 'feature-dependency-resolution',
            _searchWeight: 9,
            icon: '🔗',
            title: t('projects:ctexecutor.features.executeFromHere.dependencyResolution.title'),
            description: t('projects:ctexecutor.features.executeFromHere.dependencyResolution.description'),
            category: 'execute-from-here',
        },
        {
            _searchableId: 'feature-smart-detection',
            _searchWeight: 8,
            icon: '🧠',
            title: t('projects:ctexecutor.features.executeFromHere.smartDetection.title'),
            description: t('projects:ctexecutor.features.executeFromHere.smartDetection.description'),
            category: 'execute-from-here',
        },
        // Productivity
        {
            _searchableId: 'feature-keyboard-shortcuts',
            _searchWeight: 8,
            icon: '⌨️',
            title: t('projects:ctexecutor.features.productivity.keyboardShortcuts.title'),
            description: t('projects:ctexecutor.features.productivity.keyboardShortcuts.description'),
            category: 'productivity',
        },
        {
            _searchableId: 'feature-minimal-ui',
            _searchWeight: 6,
            icon: '🎨',
            title: t('projects:ctexecutor.features.productivity.minimalUi.title'),
            description: t('projects:ctexecutor.features.productivity.minimalUi.description'),
            category: 'productivity',
        },
        {
            _searchableId: 'feature-auto-cleanup',
            _searchWeight: 7,
            icon: '🧹',
            title: t('projects:ctexecutor.features.productivity.autoCleanup.title'),
            description: t('projects:ctexecutor.features.productivity.autoCleanup.description'),
            category: 'productivity',
        },
        {
            _searchableId: 'feature-lightweight',
            _searchWeight: 6,
            icon: '🪶',
            title: t('projects:ctexecutor.features.productivity.lightweight.title'),
            description: t('projects:ctexecutor.features.productivity.lightweight.description'),
            category: 'productivity',
        },
    ];

    const shortcuts: Shortcut[] = [
        {
            _searchableId: 'shortcut-run-ct-query',
            _searchWeight: 10,
            action: t('projects:ctexecutor.shortcuts.runCtQuery.action'),
            keys: t('projects:ctexecutor.shortcuts.runCtQuery.keys'),
            description: t('projects:ctexecutor.shortcuts.runCtQuery.description'),
        },
        {
            _searchableId: 'shortcut-execute-from-here',
            _searchWeight: 10,
            action: t('projects:ctexecutor.shortcuts.executeFromHere.action'),
            keys: t('projects:ctexecutor.shortcuts.executeFromHere.keys'),
            description: t('projects:ctexecutor.shortcuts.executeFromHere.description'),
        },
        {
            _searchableId: 'shortcut-copy-sql',
            _searchWeight: 8,
            action: t('projects:ctexecutor.shortcuts.copySql.action'),
            keys: t('projects:ctexecutor.shortcuts.copySql.keys'),
            description: t('projects:ctexecutor.shortcuts.copySql.description'),
        },
        {
            _searchableId: 'shortcut-edit-and-run',
            _searchWeight: 8,
            action: t('projects:ctexecutor.shortcuts.editAndRun.action'),
            keys: t('projects:ctexecutor.shortcuts.editAndRun.keys'),
            description: t('projects:ctexecutor.shortcuts.editAndRun.description'),
        },
    ];

    return {
        name: t('projects:ctexecutor.name'),
        slug: 'ctexecutor',
        description: t('projects:ctexecutor.description'),
        keywords: t('projects:ctexecutor.keywords', { returnObjects: true }) as string[],
        category: 'Projects',
        icon: '🚀',
        url: 'https://plugins.jetbrains.com/plugin/27835-ctexecutor/',
        debugUrl: 'https://github.com/ykoellmann/cteXecutor',
        version: '2.0.0',
        downloads: '100+',
        features,
        shortcuts,
    };
}
