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
  // Render Manual Outline Node
  const renderManualNode = (node: ManualTreeNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedNodes[node.id];
    const isActive = selectedNodeId === node.id;

    return (
      <div key={node.id} className="tree-node-group">
        <div
          className={`memory-tree-node ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          onClick={() => {
            onSelectNode(node.id, node.page, node.sourceFile, false);
            if (hasChildren) {
              onToggleExpand(node.id);
            }
          }}
        >
          {hasChildren ? (
            <span className="node-icon toggle-icon" style={{ transform: isExpanded ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.15s ease" }}>
              ▶
            </span>
          ) : (
            <span className="node-icon">📄</span>
          )}
          <span className="node-label">{node.title}</span>
          <span className="node-page-badge" style={{ marginLeft: "auto", fontSize: "0.65rem", opacity: 0.6 }}>
            P.{node.page}
          </span>
        </div>

        {hasChildren && isExpanded && node.children?.map(child => renderManualNode(child))}
      </div>
    );
  };

  // Render Project File Node
  const renderProjectNode = (node: FileNode) => {
    const isDir = node.type === "directory";
    const isExpanded = !!expandedNodes[node.id];
    const isActive = selectedNodeId === node.id;

    return (
      <div key={node.id} className="tree-node-group">
        <div
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
          {isDir ? (
            <span className="node-icon" style={{ transform: isExpanded ? "rotate(90deg)" : "none", display: "inline-block", transition: "transform 0.15s ease", marginRight: "6px" }}>
              ▶
            </span>
          ) : (
            <span className="node-icon" style={{ marginRight: "6px" }}>
              {node.extension === "md" ? "📝" : node.extension === "json" ? "⚙️" : "📄"}
            </span>
          )}
          <span className="node-label" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {node.name}
          </span>
        </div>

        {isDir && isExpanded && node.children?.map(child => renderProjectNode(child))}
      </div>
    );
  };

  return (
    <div className="memory-tree-scroll">
      {source === "manual" ? (
        manualOutline.map(node => renderManualNode(node))
      ) : (
        projectTree.map(node => renderProjectNode(node))
      )}
    </div>
  );
};
