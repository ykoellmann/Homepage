import type { TerminalFileSystem } from './terminalFileSystem';

export interface CommandResult {
    output: string;
    error?: string;
}

export class TerminalCommands {
    private fs: TerminalFileSystem;
    private history: string[] = [];

    constructor(fs: TerminalFileSystem) {
        this.fs = fs;
    }

    execute(input: string): CommandResult {
        if (!input.trim()) {
            return { output: '' };
        }

        this.history.push(input);

        // Check for pipes
        if (input.includes('|')) {
            return this.executePipeline(input);
        }

        return this.executeCommand(input);
    }

    private executePipeline(input: string): CommandResult {
        const commands = input.split('|').map(cmd => cmd.trim());
        let currentOutput = '';

        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            const result = i === 0
                ? this.executeCommand(cmd)
                : this.executeCommand(cmd, currentOutput);

            if (result.error) {
                return result;
            }

            currentOutput = result.output;
        }

        return { output: currentOutput };
    }

    private executeCommand(input: string, pipeInput?: string): CommandResult {
        const parts = this.parseCommand(input);
        const command = parts[0];
        const args = parts.slice(1);

        switch (command) {
            case 'ls':
            case 'dir':
                return this.ls(args);
            case 'cd':
                return this.cd(args);
            case 'pwd':
                return this.pwd();
            case 'tree':
                return this.tree(args);
            case 'cat':
                return this.cat(args);
            case 'head':
                return this.head(args, pipeInput);
            case 'tail':
                return this.tail(args, pipeInput);
            case 'less':
            case 'more':
                return this.less(args);
            case 'grep':
                return this.grep(args, pipeInput);
            case 'find':
                return this.find(args);
            case 'wc':
                return this.wc(args, pipeInput);
            case 'history':
                return this.historyCmd(args);
            case 'help':
                return this.help(args);
            case 'clear':
                return { output: '__CLEAR__' };
            default:
                return { output: '', error: `${command}: command not found. Type 'help' for available commands.` };
        }
    }

    private parseCommand(input: string): string[] {
        const parts: string[] = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    parts.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }

        if (current) {
            parts.push(current);
        }

        return parts;
    }

    // Navigation commands
    private ls(args: string[]): CommandResult {
        let path: string | undefined;
        let showAll = false;
        let longFormat = false;

        for (const arg of args) {
            if (arg === '-a') showAll = true;
            else if (arg === '-l') longFormat = true;
            else if (arg === '-la' || arg === '-al') {
                showAll = true;
                longFormat = true;
            } else if (!arg.startsWith('-')) {
                path = arg;
            }
        }

        const result = this.fs.listDirectory(path, showAll, longFormat);

        if (!result.success) {
            return { output: '', error: result.error };
        }

        return { output: result.entries!.join('\n') };
    }

    private cd(args: string[]): CommandResult {
        const path = args[0] || '~';
        const actualPath = path === '~' ? '/home' : path;

        const result = this.fs.changeDirectory(actualPath);

        if (!result.success) {
            return { output: '', error: result.error };
        }

        return { output: '' };
    }

    private pwd(): CommandResult {
        return { output: this.fs.getCurrentPath() };
    }

    private tree(args: string[]): CommandResult {
        let path: string | undefined;
        let maxDepth = -1;

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-L' && i + 1 < args.length) {
                maxDepth = parseInt(args[i + 1]);
                i++;
            } else if (!args[i].startsWith('-')) {
                path = args[i];
            }
        }

        const result = this.fs.getTree(path, maxDepth);

        if (!result.success) {
            return { output: '', error: result.error };
        }

        return { output: result.tree! };
    }

    // File content commands
    private cat(args: string[]): CommandResult {
        if (args.length === 0) {
            return { output: '', error: 'cat: missing file operand' };
        }

        const outputs: string[] = [];

        for (const file of args) {
            const result = this.fs.readFile(file);
            if (!result.success) {
                return { output: '', error: result.error };
            }
            outputs.push(result.content!);
        }

        return { output: outputs.join('\n\n') };
    }

    private head(args: string[], pipeInput?: string): CommandResult {
        let lines = 10;
        let file: string | undefined;

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && i + 1 < args.length) {
                lines = parseInt(args[i + 1]);
                i++;
            } else if (args[i].startsWith('-') && !isNaN(parseInt(args[i].substring(1)))) {
                lines = parseInt(args[i].substring(1));
            } else {
                file = args[i];
            }
        }

        let content: string;

        if (pipeInput) {
            content = pipeInput;
        } else if (file) {
            const result = this.fs.readFile(file);
            if (!result.success) {
                return { output: '', error: result.error };
            }
            content = result.content!;
        } else {
            return { output: '', error: 'head: missing file operand' };
        }

        const contentLines = content.split('\n');
        return { output: contentLines.slice(0, lines).join('\n') };
    }

    private tail(args: string[], pipeInput?: string): CommandResult {
        let lines = 10;
        let file: string | undefined;

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-n' && i + 1 < args.length) {
                lines = parseInt(args[i + 1]);
                i++;
            } else if (args[i].startsWith('-') && !isNaN(parseInt(args[i].substring(1)))) {
                lines = parseInt(args[i].substring(1));
            } else {
                file = args[i];
            }
        }

        let content: string;

        if (pipeInput) {
            content = pipeInput;
        } else if (file) {
            const result = this.fs.readFile(file);
            if (!result.success) {
                return { output: '', error: result.error };
            }
            content = result.content!;
        } else {
            return { output: '', error: 'tail: missing file operand' };
        }

        const contentLines = content.split('\n');
        return { output: contentLines.slice(-lines).join('\n') };
    }

    private less(args: string[]): CommandResult {
        if (args.length === 0) {
            return { output: '', error: 'less: missing file operand' };
        }

        const result = this.fs.readFile(args[0]);
        if (!result.success) {
            return { output: '', error: result.error };
        }

        return {
            output: result.content! + '\n\n(End of file - Press any key to continue)'
        };
    }

    private grep(args: string[], pipeInput?: string): CommandResult {
        if (args.length === 0) {
            return { output: '', error: 'grep: missing pattern' };
        }

        const pattern = args[0];
        let ignoreCase = false;
        let lineNumbers = false;
        let files: string[] = [];

        for (let i = 1; i < args.length; i++) {
            if (args[i] === '-i') ignoreCase = true;
            else if (args[i] === '-n') lineNumbers = true;
            else files.push(args[i]);
        }

        const results: string[] = [];

        if (pipeInput) {
            const lines = pipeInput.split('\n');
            lines.forEach((line, index) => {
                // Create new regex for each line to avoid state issues
                const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
                if (regex.test(line)) {
                    if (lineNumbers) {
                        results.push(`${index + 1}:${line}`);
                    } else {
                        results.push(line);
                    }
                }
            });
        } else {
            for (const file of files) {
                const result = this.fs.readFile(file);
                if (!result.success) {
                    return { output: '', error: result.error };
                }

                const lines = result.content!.split('\n');
                lines.forEach((line, index) => {
                    // Create new regex for each line to avoid state issues
                    const regex = new RegExp(pattern, ignoreCase ? 'i' : '');
                    if (regex.test(line)) {
                        const prefix = files.length > 1 ? `${file}:` : '';
                        const lineNum = lineNumbers ? `${index + 1}:` : '';
                        results.push(`${prefix}${lineNum}${line}`);
                    }
                });
            }
        }

        return { output: results.join('\n') };
    }

    private find(args: string[]): CommandResult {
        let searchPath = '.';
        let pattern = '*';

        for (let i = 0; i < args.length; i++) {
            if (args[i] === '-name' && i + 1 < args.length) {
                pattern = args[i + 1];
                i++;
            } else if (!args[i].startsWith('-')) {
                if (i === 0) {
                    searchPath = args[i];
                }
            }
        }

        const result = this.fs.findFiles(pattern, searchPath !== '.' ? searchPath : undefined);

        if (!result.success) {
            return { output: '', error: result.error };
        }

        return { output: result.files!.join('\n') };
    }

    // Utility commands
    private wc(args: string[], pipeInput?: string): CommandResult {
        let countLines = true;
        let countWords = true;
        let countChars = true;
        let files: string[] = [];

        for (const arg of args) {
            if (arg === '-l') {
                countLines = true;
                countWords = false;
                countChars = false;
            } else if (arg === '-w') {
                countWords = true;
                countLines = false;
                countChars = false;
            } else if (arg === '-c') {
                countChars = true;
                countLines = false;
                countWords = false;
            } else if (!arg.startsWith('-')) {
                files.push(arg);
            }
        }

        let content: string;

        if (pipeInput) {
            content = pipeInput;
        } else if (files.length > 0) {
            const result = this.fs.readFile(files[0]);
            if (!result.success) {
                return { output: '', error: result.error };
            }
            content = result.content!;
        } else {
            return { output: '', error: 'wc: missing file operand' };
        }

        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w).length;
        const chars = content.length;

        const results: string[] = [];
        if (countLines) results.push(`${lines} lines`);
        if (countWords) results.push(`${words} words`);
        if (countChars) results.push(`${chars} characters`);

        return { output: results.join(', ') };
    }

    private historyCmd(args: string[]): CommandResult {
        const count = args[0] ? parseInt(args[0]) : this.history.length;
        const historyItems = this.history.slice(-count);

        return {
            output: historyItems.map((cmd, i) => {
                const index = this.history.length - historyItems.length + i + 1;
                return `${index.toString().padStart(4)} ${cmd}`;
            }).join('\n')
        };
    }

    private help(_args: string[]): CommandResult {
        const helpText = `╔═══════════════════════════════════════════════════════════════════╗
║                    Portfolio Terminal - Help                      ║
╚═══════════════════════════════════════════════════════════════════╝

┌─ NAVIGATION & DISPLAY ────────────────────────────────────────────┐
│                                                                    │
│  ls [path] [-a] [-l]       List files and directories             │
│                            -a: Show all files including hidden     │
│                            -l: Long format with details            │
│                                                                    │
│  cd <path>                 Change directory                        │
│                            Use ~ for home, .. for parent           │
│                                                                    │
│  pwd                       Print working directory                 │
│                                                                    │
│  tree [path] [-L n]        Display directory tree                 │
│                            -L n: Limit depth to n levels           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ FILE CONTENT ────────────────────────────────────────────────────┐
│                                                                    │
│  cat <file...>             Display file contents                  │
│                                                                    │
│  head [-n num] <file>      Show first lines (default: 10)         │
│                                                                    │
│  tail [-n num] <file>      Show last lines (default: 10)          │
│                                                                    │
│  less <file>               View file with pagination              │
│                                                                    │
│  grep <pattern> <file>     Search for pattern in files            │
│       [-i]                 Case insensitive search                │
│       [-n]                 Show line numbers                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ FILE SEARCH ─────────────────────────────────────────────────────┐
│                                                                    │
│  find [path] -name <pat>   Search for files matching pattern      │
│                            Use * for wildcards                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ UTILITIES ───────────────────────────────────────────────────────┐
│                                                                    │
│  wc <file>                 Count lines, words, and characters     │
│     [-l]                   Count lines only                       │
│     [-w]                   Count words only                       │
│     [-c]                   Count characters only                  │
│                                                                    │
│  history [n]               Show command history (last n commands) │
│                                                                    │
│  clear                     Clear terminal screen                  │
│                                                                    │
│  help                      Show this help message                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ PIPE SUPPORT ────────────────────────────────────────────────────┐
│                                                                    │
│  Use | to chain commands together                                 │
│                                                                    │
│  Examples:                                                         │
│    cat file.md | grep "keyword"                                   │
│    ls -l | grep "projects"                                        │
│    cat file.md | head -5                                          │
│    find . -name "*.md" | wc -l                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌─ KEYBOARD SHORTCUTS ──────────────────────────────────────────────┐
│                                                                    │
│  Ctrl+C                    Cancel current input                   │
│  Ctrl+L                    Clear terminal screen                  │
│  Tab                       Auto-completion                        │
│  ↑/↓                       Navigate command history               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

TIP: Paths can be absolute (/home/user/projects) or relative (../src)
     Type 'tree' to see the full directory structure
     Type 'ls projects' to see all available projects`;

        return { output: helpText };
    }

    getHistory(): string[] {
        return [...this.history];
    }

    getCurrentPath(): string {
        return this.fs.getCurrentPath();
    }

    // Autocomplete for paths
    autocomplete(input: string): string[] {
        const parts = input.trim().split(/\s+/);
        if (parts.length === 0) return [];

        const command = parts[0];
        const lastArg = parts[parts.length - 1];

        // Only autocomplete for commands that take paths
        const pathCommands = ['cd', 'ls', 'cat', 'head', 'tail', 'less', 'more', 'grep', 'find', 'tree'];
        if (!pathCommands.includes(command)) return [];

        // Get all possible paths
        const isAbsolutePath = lastArg.startsWith('/');
        const searchPath = isAbsolutePath ? lastArg : lastArg || '.';

        // Get directory listing
        const pathParts = searchPath.split('/').filter(p => p);
        const searchDir = pathParts.length > 0 ? pathParts.slice(0, -1).join('/') : '.';
        const prefix = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';

        const result = this.fs.listDirectory(searchDir || '.', false, false);
        if (!result.success || !result.entries) return [];

        // Filter entries that start with prefix
        const matches = result.entries
            .filter(entry => entry.toLowerCase().startsWith(prefix.toLowerCase()))
            .map(entry => {
                const basePath = searchDir && searchDir !== '.' ? searchDir + '/' : '';
                return (isAbsolutePath ? '/' : '') + basePath + entry;
            });

        return matches;
    }
}
