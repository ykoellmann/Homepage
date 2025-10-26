import type { BasePageMeta, Searchable } from "../../../lib/basePage.ts";

// Common Feature interface used by all project pages
export interface Feature extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    icon: string;
    title: string;
    description: string;
    category?: string; // Optional category for filtering features
}

// Tech Stack interface with unified category types
export interface TechStack extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    name: string;
    category: 'engine' | 'library' | 'tool' | 'assets' | 'data';
}

// Code Example interface for IDE plugins
export interface CodeExample extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    title: string;
    description: string;
    code: string;
    explanation: string;
    highlight?: string;
}

// Keyboard Shortcut interface for IDE plugins
export interface Shortcut extends Searchable {
    _searchableId: string;
    _searchWeight?: number;
    action: string;
    keys: string;
    description: string;
}

// Base ProjectPageMeta interface that all project pages extend
export interface ProjectPageMeta extends BasePageMeta {
    features: Feature[];
    githubUrl?: string;
    demoUrl?: string;
}

// Extended interface for projects with tech stack
export interface ProjectWithTechStackMeta extends ProjectPageMeta {
    techStack: TechStack[];
}

// Extended interface for IDE plugins
export interface IDEPluginProjectMeta extends ProjectPageMeta {
    version: string;
    downloads?: string;
    codeExamples?: CodeExample[];
    shortcuts?: Shortcut[];
}
