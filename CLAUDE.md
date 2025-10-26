# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website (homepage) built with React, TypeScript, and Vite that features an IDE-like interface inspired by VS Code. The site showcases projects, experience, and contact information through a tabbed interface with file explorer navigation.

## Development Commands

### Core Commands
- **Start dev server**: `npm run dev` - Launches Vite dev server with HMR at http://localhost:5173
- **Build**: `npm run build` - Runs TypeScript compiler (`tsc -b`) followed by Vite production build
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Deploy**: `npm run deploy` - Deploys to GitHub Pages using gh-pages

### Important Notes
- The build process requires TypeScript compilation to pass before Vite bundling
- Deployment publishes the `dist` directory to the gh-pages branch
- Homepage is configured for `https://koellmann.dev`

## Architecture Overview

### Tab-Based Navigation System
The application uses a **hybrid routing approach** combining React Router with a custom tab system that mimics VS Code:

1. **Dynamic Page Discovery**: Pages are auto-discovered from the file system using Vite's `import.meta.glob()` pattern in `src/lib/buildFileTree.ts`
2. **Tab State Management**: Tab state persists in `sessionStorage` (key: `'tabs_state'`) to survive page reloads
3. **URL ↔ Tab Mapping**: React Router manages URLs while the custom `useNavigation` hook maps URLs to tabs
4. **Browser History Integration**: Back/forward navigation works through the Window History API

### Key Components

**Layout Structure**:
- `App.tsx`: Root component managing explorer visibility, width, and current page state
- `Header.tsx`: Navigation controls (back/forward), project selector, run controls
- `Sidebar.tsx`: Collapsible sidebar with explorer toggle
- `Explorer.tsx`: File tree display with resizable width
- `TabSystem.tsx`: VS Code-like tab interface with support for future split-pane layouts
- `BreadcrumbFooter.tsx`: Shows current navigation path

**Tab System** (`src/components/tabs/`):
- `TabSystem.tsx`: Main controller managing layout and tab groups
- `TabGroup.tsx`: Renders tab bar and content area
- `TabBar.tsx` + `TabItem.tsx`: Individual tab UI with drag-and-drop support
- `TabContent.tsx`: Displays active tab's page content

### Page Organization

Pages are organized under `src/pages/` with a **convention-based structure**:

```
src/pages/
  ├── about/
  │   ├── index.tsx      # Page component
  │   └── meta.ts        # Page metadata (title, run config)
  ├── src/
  │   ├── cryptborne/
  │   └── SatTrack/
  └── contact/
```

Each page directory contains:
- `index.tsx`: The React component to render
- `meta.ts`: Metadata including `runConfig` (name, slug, URL, debugUrl, description)

### Custom Hooks

- `useNavigation()` (`src/hooks/useNavigation.ts`): Provides `navigateTo(path)` function and page lookup from file tree
- `useTabPersistence()` (`src/hooks/useTabPersistance.ts`): Restores tab state from sessionStorage
- `useHistoryStatus()` (`src/hooks/useHistoryStatus.ts`): Tracks browser history availability for back/forward buttons
- `useClickOutside()`: Detects clicks outside elements for dropdown/modal closing

### Run Configurations

Projects can define "run configurations" in their `meta.ts` files:

```typescript
export const runConfig: RunConfigMeta = {
  name: "Project Name",
  slug: "project-slug",
  url: "https://live-url.com",
  debugUrl: "https://debug-url.com",  // optional
  description: "Project description"
};
```

These configurations populate the run controls dropdown in the header, providing quick links to live projects and debug resources.

## Adding New Pages

To add a new page to the portfolio:

1. Create a new directory under `src/pages/` (e.g., `src/pages/new-project/`)
2. Add `index.tsx` with your React component
3. Add `meta.ts` with metadata and optional run configuration
4. The page will automatically appear in the file explorer and be navigable via tabs

The file tree is built dynamically at runtime, so no route registration is needed.

## State Management

The application uses **React hooks and component state** instead of a central state manager:

- **App.tsx**: Manages explorer visibility/width and current page
- **TabSystem**: Manages tab layout, drag state, and component mapping
- **sessionStorage**: Persists tab state across page reloads
- Custom hooks distribute state management across features

## Styling

- **Tailwind CSS 4.x** via `@tailwindcss/vite` plugin
- **Global styles**: `src/App.css` and `src/index.css`
- **Component styles**: Inline Tailwind classes
- **Interactive elements**: Custom hover effects and animated backgrounds

## Future Extensibility

The codebase is designed to support future IDE-like features:

- **Split-pane layouts**: The `LayoutNode` structure supports `type: 'split'` with recursive children
- **Drag-and-drop tabs**: Infrastructure exists for tab reordering between groups
- **Multiple tab groups**: Currently uses single group, but prepared for side-by-side views
