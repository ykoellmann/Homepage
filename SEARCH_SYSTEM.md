# Search System Documentation

## Übersicht

Das neue Search System ermöglicht eine JetBrains-ähnliche "Search Everywhere" Funktionalität, die alle Inhalte der Website durchsucht - von Pages über Experiences bis hin zu beliebigen benutzerdefinierten Daten.

## Architektur

### 1. Base Page System (`src/lib/basePage.ts`)

#### `BasePageMeta` Interface
Alle Pages müssen dieses Interface implementieren:

```typescript
export interface BasePageMeta {
    name: string;         // Pflicht: Name der Page
    slug: string;         // Pflicht: URL-Slug
    description: string;  // Pflicht: Beschreibung

    keywords?: string[];  // Optional: Suchbegriffe
    category?: string;    // Optional: Kategorie
    icon?: string;        // Optional: Emoji/Icon
    url?: string;        // Optional: Live URL
    debugUrl?: string;   // Optional: Debug/GitHub URL
}
```

#### `Searchable` Interface
Objekte, die durchsuchbar sein sollen, implementieren dieses Interface:

```typescript
export interface Searchable {
    _searchableId: string;      // Eindeutige ID
    _searchWeight?: number;     // Gewichtung (höher = wichtiger)
    [key: string]: any;        // Beliebige weitere Felder
}
```

**Wichtig:** Felder mit `_` Präfix werden von der Suche ignoriert.

### 2. Search Service (`src/lib/searchService.ts`)

Der `SearchService` ist ein Singleton, der alle durchsuchbaren Pages registriert und die Suche durchführt.

#### Hauptfunktionen

##### `registerPage(pageMeta: BasePageMeta)`
Registriert eine Page im Search Service:

```typescript
searchService.registerPage(aboutPageMeta);
```

##### `searchEverywhere(query: string): SearchResult[]`
Durchsucht alle registrierten Pages und deren Inhalte:

- Durchsucht Page-Meta (name, description, keywords, etc.)
- Durchsucht alle Properties der Page rekursiv
- Findet Arrays von `Searchable` Objekten automatisch
- Berechnet Relevanz-Scores
- Sortiert Ergebnisse nach Relevanz

#### Relevanz-Berechnung

Die Suche bewertet Treffer nach verschiedenen Kriterien:

- Exakte Übereinstimmung: **20 Punkte**
- Beginnt mit Suchbegriff: **15 Punkte**
- Endet mit Suchbegriff: **12 Punkte**
- Ganzes Wort: **10 Punkte**
- Enthält Suchbegriff: **7 Punkte**
- Alle Wörter enthalten (Multi-Word): **5 Punkte**

Die finale Relevanz wird zusätzlich mit `_searchWeight` multipliziert.

### 3. Search UI Component (`src/components/SearchEverywhere.tsx`)

#### Keyboard Shortcuts

- **`Ctrl/Cmd + Shift + A`**: Öffnet die Suche
- **`ESC`**: Schließt die Suche
- **`↑` / `↓`**: Navigation durch Ergebnisse
- **`Enter`**: Öffnet ausgewähltes Ergebnis

#### Features

- Modal-Overlay mit Fokus auf Suche
- Echtzeit-Suche während der Eingabe
- Tastatur-Navigation
- Anzeige von:
  - Titel und Untertitel
  - Beschreibung
  - Page-Kategorie und Icon
  - Gematchte Felder
  - Relevanz-Score

## Usage Examples

### Beispiel 1: About Page mit Experiences

```typescript
// src/pages/about/meta.ts
import type {BasePageMeta, Searchable} from "../../lib/basePage.ts";

export interface Experience extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    type: 'work' | 'education';
    company: string;
    position: string;
    startMonth: string;
    endMonth: string;
    skills: string[];
    // ... beliebige weitere Felder
}

export interface AboutPageMeta extends BasePageMeta {
    experiences: Experience[];
}

export const aboutPageMeta: AboutPageMeta = {
    name: "About Me",
    slug: "about",
    description: "Mein beruflicher Werdegang",
    keywords: ["CV", "Karriere"],
    category: "About",
    icon: "👤",

    experiences: [
        {
            _searchableId: 'exp-monari-2024',
            _searchWeight: 10,
            type: 'work',
            company: 'monari GmbH',
            position: 'IT-Entwickler',
            startMonth: 'Jan. 2024',
            endMonth: 'Heute',
            skills: ['C#', 'ASP.NET Core'],
        },
    ],
};
```

### Beispiel 2: Project Page

```typescript
// src/pages/projects/meta.ts
import type {BasePageMeta, Searchable} from "../../lib/basePage.ts";

export interface Project extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
}

export interface ProjectsPageMeta extends BasePageMeta {
    projects: Project[];
}

export const projectsPageMeta: ProjectsPageMeta = {
    name: "Projects",
    slug: "projects",
    description: "Meine Projekte",
    category: "Projects",
    icon: "🚀",

    projects: [
        {
            _searchableId: 'proj-portfolio',
            _searchWeight: 10,
            title: 'Portfolio Website',
            description: 'Moderne Portfolio-Website',
            technologies: ['React', 'TypeScript'],
        },
    ],
};
```

### Beispiel 3: Registrierung in App.tsx

```typescript
// src/App.tsx
import {searchService} from './lib/searchService.ts';
import {aboutPageMeta} from './pages/about/meta.ts';
import {projectsPageMeta} from './pages/projects/meta.ts';

function App() {
    useEffect(() => {
        searchService.registerPage(aboutPageMeta);
        searchService.registerPage(projectsPageMeta);
        // ... weitere Pages
    }, []);

    // ...
}
```

## Erweiterung des Systems

### Neue durchsuchbare Typen hinzufügen

1. **Interface erstellen** (extends `Searchable`):

```typescript
export interface BlogPost extends Searchable {
    _searchableId: string;
    _searchWeight?: number;

    title: string;
    content: string;
    tags: string[];
    publishDate: string;
}
```

2. **Zu Page Meta hinzufügen**:

```typescript
export interface BlogPageMeta extends BasePageMeta {
    posts: BlogPost[];
}
```

3. **Daten hinzufügen**:

```typescript
export const blogPageMeta: BlogPageMeta = {
    name: "Blog",
    slug: "blog",
    description: "Mein Blog",

    posts: [
        {
            _searchableId: 'post-1',
            _searchWeight: 8,
            title: 'Mein erster Post',
            content: 'Lorem ipsum...',
            tags: ['TypeScript', 'React'],
            publishDate: '2024-01-01',
        },
    ],
};
```

4. **Page registrieren**:

```typescript
searchService.registerPage(blogPageMeta);
```

Das war's! Die Suche findet automatisch:
- Den Post-Titel
- Den Content
- Die Tags
- Das Datum
- Die Page selbst

## Vorteile

1. **Flexibel**: Jede Page kann beliebige durchsuchbare Objekte definieren
2. **Automatisch**: Neue Felder werden automatisch durchsucht
3. **Erweiterbar**: Einfach neue Typen hinzufügen
4. **Type-Safe**: Vollständige TypeScript-Unterstützung
5. **Performance**: Schnelle In-Memory-Suche
6. **Smart**: Intelligente Relevanz-Berechnung

## Backward Compatibility

Alle alten `runConfig` Exporte bleiben erhalten:

```typescript
export const runConfig = {
    name: pageMetaName,
    slug: pageMetaSlug,
    // ...
};
```

Dies stellt sicher, dass bestehender Code weiterhin funktioniert.

## Zukünftige Erweiterungen

Mögliche Erweiterungen:

1. **Fuzzy Search**: Tippfehler-tolerante Suche
2. **Filter**: Nach Kategorie, Typ, Datum filtern
3. **Syntax**: Spezielle Syntax wie `type:experience skills:C#`
4. **Highlights**: Markierung der gefundenen Begriffe im Text
5. **Recent Searches**: Letzte Suchanfragen speichern
6. **Shortcuts**: Schnellzugriff auf bestimmte Kategorien
