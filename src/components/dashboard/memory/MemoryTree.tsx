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
          {hasChildren ? (
            <span
              className="toggle-arrow"
              style={{
                display: "inline-block",
                transform: isExpanded ? "rotate(90deg)" : "none",
                marginRight: "4px",
                transition: "transform 0.15s ease",
                fontFamily: "var(--font-lcars)",
                fontSize: "0.75rem",
                width: "8px"
              }}
            >
              &gt;
            </span>
          ) : (
            <span style={{ display: "inline-block", width: "12px" }} />
          )}
          <span className="node-icon" style={{ marginRight: "6px" }}>
            {hasChildren ? "DIR" : "MD"}
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

    const getBadge = () => {
      if (isDir) return "DIR";
      const ext = (node.extension || "").toLowerCase();
      if (ext === "md") return "MD";
      if (ext === "json") return "JSN";
      if (["ts", "tsx", "js", "mjs"].includes(ext)) return "SRC";
      if (["css", "html"].includes(ext)) return "CSS";
      return node.readable ? "TXT" : "BIN";
    };

    const badge = getBadge();

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
          {isDir ? (
            <span
              className="toggle-arrow"
              style={{
                display: "inline-block",
                transform: isExpanded ? "rotate(90deg)" : "none",
                marginRight: "4px",
                transition: "transform 0.15s ease",
                fontFamily: "var(--font-lcars)",
                fontSize: "0.75rem",
                width: "8px"
              }}
            >
              &gt;
            </span>
          ) : (
            <span style={{ display: "inline-block", width: "12px" }} />
          )}
          <span className="node-icon" style={{ marginRight: "6px" }}>
            {badge}
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
