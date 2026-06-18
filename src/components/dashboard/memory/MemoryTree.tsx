import React from "react";
import type { FileNode } from "./memoryTypes";

interface ManualTreeNode {
  id: string;
  title: string;
  level: number;
  sourceFile: string;
  page: number;
  children?: ManualTreeNode[];
}

interface MemoryTreeProps {
  source: "manual" | "project";
  manualOutline: ManualTreeNode[];
  projectTree: FileNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string, page?: number, path?: string, isFile?: boolean) => void;
  expandedNodes: Record<string, boolean>;
  onToggleExpand: (nodeId: string) => void;
}

export const MemoryTree: React.FC<MemoryTreeProps> = ({
  source,
  manualOutline,
  projectTree,
  selectedNodeId,
  onSelectNode,
  expandedNodes,
  onToggleExpand,
}) => {
  const renderManualNode = (node: ManualTreeNode) => {
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = Boolean(expandedNodes[node.id]);
    const isActive = selectedNodeId === node.id;

    return (
      <div key={node.id} className="tree-node-group">
        <button
          type="button"
          className={`memory-tree-node ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => {
            onSelectNode(node.id, node.page, node.sourceFile, false);
            if (hasChildren) onToggleExpand(node.id);
          }}
        >
          <span
            className="node-icon toggle-icon"
            style={{ transform: hasChildren && isExpanded ? "rotate(90deg)" : "none" }}
          >
            {hasChildren ? ">" : "MD"}
          </span>
          <span className="node-label">{node.title}</span>
          <span className="node-page-badge" style={{ marginLeft: "auto", fontSize: "0.65rem", opacity: 0.6 }}>
            P.{node.page}
          </span>
        </button>

        {hasChildren && isExpanded && node.children?.map((child) => renderManualNode(child))}
      </div>
    );
  };

  const renderProjectNode = (node: FileNode) => {
    const isDir = node.type === "directory";
    const isExpanded = Boolean(expandedNodes[node.id]);
    const isActive = selectedNodeId === node.id;
    const icon = isDir ? ">" : node.extension === "md" ? "MD" : node.extension === "json" ? "JSN" : "FILE";

    return (
      <div key={node.id} className="tree-node-group">
        <button
          type="button"
          className={`memory-tree-node ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${node.path.split("/").length * 12 + 4}px` }}
          onClick={() => {
            if (isDir) {
              onToggleExpand(node.id);
            } else {
              onSelectNode(node.id, undefined, node.path, true);
            }
          }}
        >
          <span
            className="node-icon toggle-icon"
            style={{ transform: isDir && isExpanded ? "rotate(90deg)" : "none", marginRight: "6px" }}
          >
            {icon}
          </span>
          <span className="node-label" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {node.name}
          </span>
        </button>

        {isDir && isExpanded && node.children?.map((child) => renderProjectNode(child))}
      </div>
    );
  };

  return (
    <div className="memory-tree-scroll">
      {source === "manual" ? manualOutline.map((node) => renderManualNode(node)) : projectTree.map((node) => renderProjectNode(node))}
    </div>
  );
};
