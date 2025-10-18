import React, {useMemo, useState} from "react";
import {ChevronDown, ChevronRight, File as FileIcon, Folder as FolderIcon, FolderOpen} from "lucide-react";
import {cn} from "../lib/utils.ts";

export type FileNode = {
  name: string;
  type: "file" | "folder";
  path?: string; // optional full path for files
  children?: FileNode[]; // for folders
};

type FileExplorerProps = {
  data: FileNode[];
  onOpenFile?: (node: FileNode) => void;
  className?: string;
};

function sortNodes(nodes: FileNode[]): FileNode[] {
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1; // folders first
    return a.name.localeCompare(b.name);
  });
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ data, onOpenFile, className }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const toggle = (key: string) => setExpanded(s => ({...s, [key]: !s[key]}));

  const handleClick = (key: string, node: FileNode) => {
    setSelected(key);
    if (node.type === "folder") {
      toggle(key);
    }
  };

  const handleDoubleClick = (node: FileNode) => {
    if (node.type === "file") onOpenFile?.(node);
  };

  const Tree: React.FC<{nodes: FileNode[]; prefix?: string}> = ({nodes, prefix = ""}) => {
    const sorted = useMemo(() => sortNodes(nodes), [nodes]);
    return (
      <ul className="m-0 p-0 list-none">
        {sorted.map((n, idx) => {
          const key = `${prefix}${n.name}-${idx}`;
          const isOpen = !!expanded[key];
          const isSel = selected === key;
          return (
            <li key={key}>
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-0.5 cursor-default select-none",
                  isSel ? "bg-[#43454A] text-white" : "hover:bg-[#3a3c3f] hover:text-white text-[#A5A7AC]"
                )}
                onClick={() => handleClick(key, n)}
                onDoubleClick={() => handleDoubleClick(n)}
                title={n.name}
              >
                {/* Disclosure */}
                {n.type === "folder" ? (
                  isOpen ? <ChevronDown className="icon"/> : <ChevronRight className="icon"/>
                ) : (
                  <span className="w-[18px] h-[18px]"/>
                )}
                {/* Icon */}
                {n.type === "folder" ? (
                  isOpen ? <FolderOpen className="icon"/> : <FolderIcon className="icon"/>
                ) : (
                  <FileIcon className="icon"/>
                )}
                <span className="truncate">{n.name}</span>
              </div>
              {/* Children */}
              {n.type === "folder" && isOpen && n.children && n.children.length > 0 && (
                <div className="pl-4 border-l border-[#3a3c3f]">
                  <Tree nodes={n.children} prefix={`${key}/`}/>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={cn(
      "h-full w-[260px] bg-[var(--panel-bg)] border-r border-[var(--panel-border)] text-sm overflow-auto",
      className
    )}>
      {/* Tool window header (Rider-like) */}
      <div className="sticky top-0 z-10 bg-[#313338] border-b border-[var(--panel-border)] px-2 py-1 text-[12px] tracking-normal text-[#d7d7d9] font-semibold">
        Project
      </div>
      <div className="py-1">
        <Tree nodes={data} />
      </div>
    </div>
  );
};
