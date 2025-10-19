import {FileExplorer, type FileNode} from '../file-explorer';

interface ExplorerProps {
    tree: FileNode[];
    width: number;
    onResizeStart: (e: React.MouseEvent) => void;
    onFileOpen: (path: string) => void;
}

export function Explorer({
                             tree,
                             width,
                             onResizeStart,
                             onFileOpen
                         }: ExplorerProps) {

    function handleFileOpen(node: FileNode) {
        const isTxt = node.name.toLowerCase().endsWith('.txt');

        if (node.path) {
            const path = node.path.replace(/\.(txt|md|html|tsx|ts|js)$/i, '').replace(/^\/+/, '');
            onFileOpen(`/${path}`);
            return;
        }

        if (isTxt) {
            const base = node.name.replace(/\.[^.]+$/, '');
            onFileOpen(`/${base}`);
            return;
        }
    }

    return (
        <div className="explorer" style={{width}}>
            <div className="explorer-content">
                <FileExplorer
                    data={tree}
                    onOpenFile={handleFileOpen}
                />
            </div>
            <div
                onMouseDown={onResizeStart}
                className="resize-handle"
                title="Resize"
            />
        </div>
    );
}