import type { RunConfig } from "../components/run-controls/RunControls.tsx";
import type {FileNode} from "../components/file-explorer.tsx";

export interface PageEntry {
    name: string;
    path: string;
    component?: any;
    meta?: {
        runConfig?: RunConfig;
        title?: string;
        description?: string;
    };
}

export function buildFileTreeFromGlob(basePrefix = "../pages/") {
  const pageModules = import.meta.glob("../pages/**/index.tsx", { eager: true });
  const metaModules = import.meta.glob("../pages/**/meta.ts", { eager: true });

  const pages: Record<string, PageEntry> = {};

  // 1️⃣ Index-Dateien einlesen
  for (const path in pageModules) {
    const relative = path.replace(basePrefix, "").replace("/index.tsx", ""); // z. B. "src/cryptborne"
    pages[relative] = {
      name: relative.split("/").pop()!,
      path: "/" + relative,
      component: (pageModules[path] as any).default,
    };
  }

  // 2️⃣ Meta-Dateien einlesen
  for (const path in metaModules) {
    const relative = path.replace(basePrefix, "").replace("/meta.ts", ""); // z. B. "src/cryptborne"
    if (!pages[relative]) {
      pages[relative] = { name: relative.split("/").pop()!, path: "/" + relative };
    }
    const meta = metaModules[path] as any;

    // Try to find exported data that extends BasePageData
    // Look for exports ending with "Data" (cryptborneData, satTrackData, aboutPageData, etc.)
    let pageData: any = null;

    for (const key in meta) {
      if ((key.endsWith('Data') || key.endsWith('data')) && meta[key] && typeof meta[key] === 'object') {
        pageData = meta[key];
        break;
      }
    }

    // Build runConfig from pageData if it has url/debugUrl
    let runConfig = undefined;
    if (pageData && (pageData.url || pageData.debugUrl)) {
      // Generate a readable name from slug (e.g., "cryptborne" → "Cryptborne")
      const namePart = relative.split("/").pop()!;
      const readableName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      runConfig = {
        name: pageData.name || readableName,
        url: pageData.url,
        debugUrl: pageData.debugUrl
      };
    } else if (meta.runConfig) {
      // Fallback: support legacy runConfig export
      runConfig = meta.runConfig;
    }

    pages[relative].meta = {
      runConfig,
      title: meta.title ?? pageData?.name ?? undefined,
      description: meta.description ?? pageData?.description ?? undefined,
    };
  }

  // 3️⃣ Baumstruktur aufbauen
  const root: FileNode[] = [];

  function insertPath(parts: string[], entry: PageEntry, level: FileNode[]) {
    const [head, ...rest] = parts;

    let node = level.find((n) => n.name === head);
    if (!node) {
      node = { name: head, type: rest.length > 0 ? "folder" : "file" };
      if (rest.length > 0) node.children = [];
      level.push(node);
    }

    if (rest.length === 0) {
      // letzte Ebene -> Seite einfügen
      node.type = "file";
      node.path = entry.path;
    } else {
      insertPath(rest, entry, node.children!);
    }
  }

  for (const relative in pages) {
    const parts = relative.split("/");
    insertPath(parts, pages[relative], root);
  }
  return { tree: root, pages };
}
