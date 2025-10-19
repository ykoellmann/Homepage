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
    pages[relative].meta = {
      runConfig: meta.runConfig ?? undefined,
      title: meta.title ?? undefined,
      description: meta.description ?? undefined,
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
