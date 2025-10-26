// Feature ist durchsuchbar
import type {BasePageMeta, Searchable} from "../../../lib/basePage.ts";

export interface Feature extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    icon: string;
    title: string;
    description: string;
    category: 'cte-management' | 'execute-from-here' | 'productivity';
}

// Code Example ist durchsuchbar
export interface CodeExample extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    title: string;
    description: string;
    code: string;
    explanation: string;
    highlight?: string; // Wo der Cursor platziert werden soll
}

// Shortcut ist durchsuchbar
export interface Shortcut extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    action: string;
    keys: string;
    description: string;
}

// Project Page Meta - erweitert BasePageMeta
export interface ProjectPageMeta extends BasePageMeta {
    features: Feature[];
    codeExamples: CodeExample[];
    shortcuts: Shortcut[];
    version: string;
    downloads?: string;
}

export const cteXecutorPageMeta: ProjectPageMeta = {
    // BasePageMeta Pflichtfelder
    name: "cteXecutor",
    slug: "ctexecutor",
    description: "Execute and manage Common Table Expressions (CTEs) with ease in DataGrip and IntelliJ-based IDEs",
    keywords: ["CTE", "SQL", "DataGrip", "IntelliJ", "Plugin", "Database", "Query", "Productivity"],
    category: "Projects",
    icon: "🚀",

    url: "https://plugins.jetbrains.com/plugin/27835-ctexecutor/",
    debugUrl: "https://github.com/ykoellmann/cteXecutor",

    // Project-spezifische Daten
    version: "2.0.0",
    downloads: "100+",

    // Features
    features: [
        {
            _searchableId: 'feature-cte-detection',
            _searchWeight: 10,
            icon: '🎯',
            title: 'Automatische CTE-Erkennung',
            description: 'Erkennt alle CTEs in deiner SQL WITH-Klausel automatisch und zeigt sie in einem interaktiven Popup an.',
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-visual-highlighting',
            _searchWeight: 9,
            icon: '✨',
            title: 'Visuelle Hervorhebung',
            description: 'Hebt ausgewählte CTEs im Editor visuell hervor für bessere Übersichtlichkeit beim Arbeiten.',
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-smart-execution',
            _searchWeight: 10,
            icon: '⚡',
            title: 'Intelligente Ausführung',
            description: 'Führt die gewählte SQL-Query direkt in der Datenbank-Konsole aus mit automatischer Bereinigung.',
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-copy-clipboard',
            _searchWeight: 7,
            icon: '📋',
            title: 'In Zwischenablage kopieren',
            description: 'Kopiere jede CTE-Query schnell in die Zwischenablage zur Verwendung an anderer Stelle.',
            category: 'cte-management',
        },
        {
            _searchableId: 'feature-execute-from-here',
            _searchWeight: 10,
            icon: '🎯',
            title: 'Execute from Here (NEU!)',
            description: 'Führe SQL von überall aus - nicht nur CTEs! Funktioniert mit jedem Subselect in deinem SQL.',
            category: 'execute-from-here',
        },
        {
            _searchableId: 'feature-dependency-resolution',
            _searchWeight: 9,
            icon: '🔗',
            title: 'Automatische Abhängigkeitsauflösung',
            description: 'Inkludiert automatisch alle benötigten CTEs - erkennt Abhängigkeiten in CTEs, Subqueries und SELECT-Statements.',
            category: 'execute-from-here',
        },
        {
            _searchableId: 'feature-smart-detection',
            _searchWeight: 8,
            icon: '🧠',
            title: 'Intelligente Erkennung',
            description: 'Findet Abhängigkeiten automatisch in CTEs, Subqueries und finalen SELECT-Statements.',
            category: 'execute-from-here',
        },
        {
            _searchableId: 'feature-keyboard-shortcuts',
            _searchWeight: 8,
            icon: '⌨️',
            title: 'Keyboard Shortcuts',
            description: 'Blitzschneller Workflow mit praktischen Tastenkombinationen für alle wichtigen Funktionen.',
            category: 'productivity',
        },
        {
            _searchableId: 'feature-minimal-ui',
            _searchWeight: 6,
            icon: '🎨',
            title: 'Minimales UI',
            description: 'Bleibt aus dem Weg - stört nicht beim Arbeiten und integriert sich nahtlos in deine IDE.',
            category: 'productivity',
        },
        {
            _searchableId: 'feature-auto-cleanup',
            _searchWeight: 7,
            icon: '🧹',
            title: 'Automatische Bereinigung',
            description: 'Eingefügtes SQL wird nach der Ausführung automatisch entfernt - kein manuelles Aufräumen nötig.',
            category: 'productivity',
        },
        {
            _searchableId: 'feature-lightweight',
            _searchWeight: 6,
            icon: '🪶',
            title: 'Leichtgewichtig',
            description: 'Keine Performance-Einbußen - das Plugin läuft effizient im Hintergrund ohne die IDE zu verlangsamen.',
            category: 'productivity',
        },
    ],

    // Code Examples
    codeExamples: [
        {
            _searchableId: 'example-basic-cte',
            _searchWeight: 10,
            title: 'Beispiel 1: Basis CTE-Ausführung',
            description: 'Führe eine einzelne CTE mit allen Abhängigkeiten aus',
            code: `WITH 
  sales AS (SELECT * FROM orders WHERE year = 2024),
  customers AS (SELECT * FROM users WHERE active = true)
SELECT * FROM sales 
JOIN customers ON sales.user_id = customers.id;`,
            explanation: '1. Platziere Cursor in `sales` CTE\n2. Drücke `Ctrl+#` → `Space`\n3. Wähle "sales" aus dem Popup\n4. Führt aus: `WITH sales AS (...) SELECT * FROM sales`',
            highlight: 'sales',
        },
        {
            _searchableId: 'example-execute-from-here',
            _searchWeight: 10,
            title: 'Beispiel 2: Execute from Here (NEU!)',
            description: 'Starte die Ausführung von einem beliebigen Subquery aus',
            code: `WITH 
  sales AS (SELECT * FROM orders WHERE year = 2024),
  revenue AS (
    SELECT 
      product_id,
      SUM(amount) as total
    FROM sales  -- Cursor hier platzieren
    GROUP BY product_id
  )
SELECT * FROM revenue WHERE total > 1000;`,
            explanation: '1. Platziere Cursor im Subquery innerhalb der `revenue` CTE\n2. Drücke `Ctrl+#` → `Enter`\n3. Plugin erkennt, dass `sales` CTE benötigt wird\n4. Führt den Subquery mit allen Abhängigkeiten automatisch aus!',
            highlight: 'FROM sales',
        },
        {
            _searchableId: 'example-complex-dependencies',
            _searchWeight: 9,
            title: 'Beispiel 3: Komplexe Abhängigkeiten',
            description: 'Automatische Auflösung mehrerer verschachtelter CTEs',
            code: `WITH 
  base AS (SELECT * FROM data),
  filtered AS (SELECT * FROM base WHERE active = true),
  aggregated AS (
    SELECT category, COUNT(*) as count 
    FROM filtered 
    GROUP BY category
  )
SELECT * FROM aggregated ORDER BY count DESC;`,
            explanation: '1. Platziere Cursor irgendwo in `aggregated`\n2. Drücke `Ctrl+#` → `Enter`\n3. Inkludiert automatisch `base` und `filtered` CTEs (alle Abhängigkeiten)\n4. Saubere, abhängigkeitsbewusste Ausführung!',
            highlight: 'aggregated',
        },
    ],

    // Shortcuts
    shortcuts: [
        {
            _searchableId: 'shortcut-run-ct-query',
            _searchWeight: 10,
            action: 'Run CT-Query',
            keys: 'Ctrl+# → Space',
            description: 'CTE auswählen und ausführen',
        },
        {
            _searchableId: 'shortcut-execute-from-here',
            _searchWeight: 10,
            action: 'Execute from Here',
            keys: 'Ctrl+# → Enter',
            description: 'Von aktueller Position aus mit Abhängigkeiten ausführen',
        },
        {
            _searchableId: 'shortcut-copy-sql',
            _searchWeight: 8,
            action: 'Copy CT-Query SQL',
            keys: 'Ctrl+# → C',
            description: 'SQL in Zwischenablage kopieren',
        },
        {
            _searchableId: 'shortcut-edit-and-run',
            _searchWeight: 8,
            action: 'Edit and Run SQL',
            keys: 'Ctrl+# → W',
            description: 'Query bearbeiten und ausführen (z.B. WHERE-Klauseln hinzufügen)',
        },
    ],
};

// Export for backward compatibility
export const runConfig = {
    name: cteXecutorPageMeta.name,
    slug: cteXecutorPageMeta.slug,
    description: cteXecutorPageMeta.description,
    icon: cteXecutorPageMeta.icon,
    url: cteXecutorPageMeta.url,
    debugUrl: cteXecutorPageMeta.debugUrl,
};