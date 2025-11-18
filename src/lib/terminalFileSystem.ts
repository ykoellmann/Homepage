import type { PageEntry } from './buildFileTree';
import projectsEn from '../i18n/locales/en/projects.json';

export interface TerminalFile {
    name: string;
    type: 'file' | 'directory';
    path: string;
    content?: string;
    metadata?: any;
    children?: TerminalFile[];
}

export interface FileSystemNode {
    name: string;
    type: 'file' | 'directory';
    path: string;
    content?: string;
    metadata?: any;
    children: Map<string, FileSystemNode>;
}

export class TerminalFileSystem {
    private root: FileSystemNode;
    private currentPath: string[];

    constructor(pages: PageEntry[]) {
        this.root = {
            name: '/',
            type: 'directory',
            path: '/',
            children: new Map()
        };
        this.currentPath = [];
        this.buildFileSystem(pages);
    }

    private buildFileSystem(pages: PageEntry[]) {
        // Create home directory
        const home = this.createDirectory(this.root, 'home');

        // Create projects directory directly in home
        const projects = this.createDirectory(home, 'projects');

        pages.forEach(page => {
            const pathParts = page.path.split('/').filter(p => p);
            let current = projects;

            // Navigate/create directory structure
            for (let i = 0; i < pathParts.length - 1; i++) {
                const part = pathParts[i];
                if (!current.children.has(part)) {
                    current = this.createDirectory(current, part);
                } else {
                    current = current.children.get(part)!;
                }
            }

            // Create the file
            const fileName = pathParts[pathParts.length - 1] + '.md';
            this.createFile(current, fileName, this.generateFileContent(page), page);
        });

        // Set initial path to /home
        this.currentPath = ['home'];
    }

    private createDirectory(parent: FileSystemNode, name: string): FileSystemNode {
        const dir: FileSystemNode = {
            name,
            type: 'directory',
            path: this.joinPath(parent.path, name),
            children: new Map()
        };
        parent.children.set(name, dir);
        return dir;
    }

    private createFile(parent: FileSystemNode, name: string, content: string, metadata?: any): FileSystemNode {
        const file: FileSystemNode = {
            name,
            type: 'file',
            path: this.joinPath(parent.path, name),
            content,
            metadata,
            children: new Map()
        };
        parent.children.set(name, file);
        return file;
    }

    private joinPath(base: string, name: string): string {
        if (base === '/') return '/' + name;
        return base + '/' + name;
    }

    private generateFileContent(page: PageEntry): string {
        const meta = page.meta;

        if (!meta) {
            return this.generateBasicContent(page);
        }

        // Try to get translation data
        const projectKey = page.name.toLowerCase();
        const translations = (projectsEn as any)[projectKey];

        let content = '';

        // Header with title
        const title = translations?.name || meta.title || page.name;
        content += `╔═══════════════════════════════════════════════════════════════════╗\n`;
        content += `║  ${title.padEnd(63)}║\n`;
        content += `╚═══════════════════════════════════════════════════════════════════╝\n\n`;

        // Description
        const description = translations?.description || meta.description;
        if (description) {
            content += `DESCRIPTION\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;
            content += this.wrapText(description, 67);
            content += `\n\n`;
        }

        // About section
        if (translations?.about) {
            content += `${translations.about.title}\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;
            if (translations.about.paragraph1) {
                content += this.wrapText(translations.about.paragraph1, 67) + '\n\n';
            }
            if (translations.about.paragraph2) {
                content += this.wrapText(translations.about.paragraph2, 67) + '\n\n';
            }
        }

        // Features section
        if (translations?.features) {
            content += `${translations.features.title || '✨ Features'}\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;

            Object.entries(translations.features).forEach(([key, feature]: [string, any]) => {
                if (key === 'title') return;
                if (feature.title && feature.description) {
                    content += `\n• ${feature.title}\n`;
                    content += `  ${this.wrapText(feature.description, 65).split('\n').join('\n  ')}\n`;
                }
            });
            content += `\n`;
        }

        // Tech Stack
        if (translations?.techStack) {
            content += `${translations.techStack.title || '🛠️ Tech Stack'}\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;

            Object.entries(translations.techStack).forEach(([key, value]: [string, any]) => {
                if (key === 'title') return;
                if (typeof value === 'string') {
                    content += `  • ${value}\n`;
                }
            });
            content += `\n`;
        }

        // Run Configuration
        if (meta.runConfig) {
            content += `PROJECT LINKS\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;

            if (meta.runConfig.url) {
                content += `🌐 Live Demo:\n   ${meta.runConfig.url}\n\n`;
            }

            if (meta.runConfig.debugUrl) {
                content += `💻 Source Code:\n   ${meta.runConfig.debugUrl}\n\n`;
            }
        }

        // Keywords
        if (translations?.keywords && Array.isArray(translations.keywords)) {
            content += `KEYWORDS\n`;
            content += `───────────────────────────────────────────────────────────────────\n`;
            content += translations.keywords.join(', ') + '\n\n';
        }

        // Technical Information
        content += `FILE INFORMATION\n`;
        content += `───────────────────────────────────────────────────────────────────\n`;
        content += `📁 Path:     ${page.path}\n`;
        content += `📄 Filename: ${page.name}.md\n`;

        if (meta.runConfig?.name) {
            content += `🏷️  Project:  ${meta.runConfig.name}\n`;
        }

        content += `\n`;

        // Footer with hints
        content += `───────────────────────────────────────────────────────────────────\n`;
        content += `💡 TIP: Use 'grep' to search within files\n`;
        content += `   Example: cat ${page.name}.md | grep "Unity"\n`;

        return content;
    }

    private generateBasicContent(page: PageEntry): string {
        let content = '';
        content += `╔═══════════════════════════════════════════════════════════════════╗\n`;
        content += `║  ${page.name.padEnd(63)}║\n`;
        content += `╚═══════════════════════════════════════════════════════════════════╝\n\n`;
        content += `No detailed information available for this page.\n\n`;
        content += `Path: ${page.path}\n`;
        return content;
    }

    private wrapText(text: string, maxWidth: number): string {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            if (currentLine.length + word.length + 1 > maxWidth) {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            } else {
                currentLine += (currentLine ? ' ' : '') + word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.join('\n');
    }

    // Navigation methods
    getCurrentPath(): string {
        if (this.currentPath.length === 0) return '/';
        return '/' + this.currentPath.join('/');
    }

    changeDirectory(path: string): { success: boolean; error?: string } {
        const targetPath = this.resolvePath(path);
        const node = this.getNodeByPath(targetPath);

        if (!node) {
            return { success: false, error: `cd: no such file or directory: ${path}` };
        }

        if (node.type !== 'directory') {
            return { success: false, error: `cd: not a directory: ${path}` };
        }

        this.currentPath = targetPath.filter(p => p);
        return { success: true };
    }

    listDirectory(path?: string, showAll: boolean = false, longFormat: boolean = false): { success: boolean; entries?: string[]; error?: string } {
        const targetPath = path ? this.resolvePath(path) : this.currentPath;
        const node = this.getNodeByPath(targetPath);

        if (!node) {
            return { success: false, error: `ls: cannot access '${path}': No such file or directory` };
        }

        if (node.type !== 'directory') {
            return { success: true, entries: [node.name] };
        }

        const entries: string[] = [];

        if (showAll) {
            entries.push('.');
            entries.push('..');
        }

        node.children.forEach((child, name) => {
            if (longFormat) {
                const type = child.type === 'directory' ? 'd' : '-';
                const size = child.content ? child.content.length : 0;
                entries.push(`${type}rwxr-xr-x 1 user user ${size.toString().padStart(8)} ${name}${child.type === 'directory' ? '/' : ''}`);
            } else {
                entries.push(name + (child.type === 'directory' ? '/' : ''));
            }
        });

        return { success: true, entries: entries.sort() };
    }

    readFile(path: string): { success: boolean; content?: string; error?: string } {
        const targetPath = this.resolvePath(path);
        const node = this.getNodeByPath(targetPath);

        if (!node) {
            return { success: false, error: `cat: ${path}: No such file or directory` };
        }

        if (node.type === 'directory') {
            return { success: false, error: `cat: ${path}: Is a directory` };
        }

        return { success: true, content: node.content || '' };
    }

    findFiles(pattern: string, searchPath?: string): { success: boolean; files?: string[]; error?: string } {
        const targetPath = searchPath ? this.resolvePath(searchPath) : this.currentPath;
        const node = this.getNodeByPath(targetPath);

        if (!node) {
            return { success: false, error: `find: '${searchPath}': No such file or directory` };
        }

        const results: string[] = [];
        const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));

        const search = (current: FileSystemNode, currentPath: string) => {
            if (regex.test(current.name)) {
                results.push(currentPath);
            }

            if (current.type === 'directory') {
                current.children.forEach((child, name) => {
                    search(child, this.joinPath(currentPath, name));
                });
            }
        };

        search(node, this.getCurrentNodePath(targetPath));
        return { success: true, files: results };
    }

    getTree(path?: string, maxDepth: number = -1): { success: boolean; tree?: string; error?: string } {
        const targetPath = path ? this.resolvePath(path) : this.currentPath;
        const node = this.getNodeByPath(targetPath);

        if (!node) {
            return { success: false, error: `tree: ${path}: No such file or directory` };
        }

        const lines: string[] = [];
        const buildTree = (current: FileSystemNode, prefix: string = '', depth: number = 0) => {
            if (maxDepth !== -1 && depth > maxDepth) return;

            const entries = Array.from(current.children.values()).sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === 'directory' ? -1 : 1;
            });

            entries.forEach((child, index) => {
                const isLast = index === entries.length - 1;
                const connector = isLast ? '└── ' : '├── ';
                const icon = child.type === 'directory' ? '📁' : '📄';
                lines.push(`${prefix}${connector}${icon} ${child.name}`);

                if (child.type === 'directory') {
                    const newPrefix = prefix + (isLast ? '    ' : '│   ');
                    buildTree(child, newPrefix, depth + 1);
                }
            });
        };

        lines.push(`📁 ${node.name}`);
        buildTree(node);

        return { success: true, tree: lines.join('\n') };
    }

    private resolvePath(path: string): string[] {
        if (path.startsWith('/')) {
            // Absolute path
            return path.split('/').filter(p => p);
        }

        // Relative path
        const parts = [...this.currentPath];
        const pathParts = path.split('/').filter(p => p);

        for (const part of pathParts) {
            if (part === '..') {
                parts.pop();
            } else if (part !== '.') {
                parts.push(part);
            }
        }

        return parts;
    }

    private getNodeByPath(pathParts: string[]): FileSystemNode | null {
        let current = this.root;

        for (const part of pathParts) {
            if (!current.children.has(part)) {
                return null;
            }
            current = current.children.get(part)!;
        }

        return current;
    }

    private getCurrentNodePath(pathParts: string[]): string {
        if (pathParts.length === 0) return '/';
        return '/' + pathParts.join('/');
    }

    getAllFiles(): FileSystemNode[] {
        const files: FileSystemNode[] = [];

        const collect = (node: FileSystemNode) => {
            if (node.type === 'file') {
                files.push(node);
            }
            node.children.forEach(child => collect(child));
        };

        collect(this.root);
        return files;
    }
}
