import type { PageEntry } from './buildFileTree';

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
        const user = this.createDirectory(home, 'user');

        // Create projects directory
        const projects = this.createDirectory(user, 'projects');

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

        // Set initial path to /home/user
        this.currentPath = ['home', 'user'];
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
            return `# ${page.name}\n\nNo metadata available.\nPath: ${page.path}\n`;
        }

        let content = '';

        // Title and description
        content += `# ${meta.title || page.name}\n\n`;

        if (meta.description) {
            content += `${meta.description}\n\n`;
        }

        // Run Configuration
        if (meta.runConfig) {
            content += `## Configuration\n\n`;
            if (meta.runConfig.name) {
                content += `**Name:** ${meta.runConfig.name}\n`;
            }
            if (meta.runConfig.url) {
                content += `**URL:** ${meta.runConfig.url}\n`;
            }
            if (meta.runConfig.debugUrl) {
                content += `**Debug URL:** ${meta.runConfig.debugUrl}\n`;
            }
            content += '\n';
        }

        // Metadata footer
        content += `---\n\n`;
        content += `**Path:** ${page.path}\n`;
        content += `**File:** ${page.name}.md\n`;

        return content;
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
