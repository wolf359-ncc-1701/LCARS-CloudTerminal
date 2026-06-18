import React, { useState, useEffect } from "react";
import type { ManualManifest, ProjectManifest, FileNode, ManualChapter } from "./memoryTypes";
import { MemoryTree } from "./MemoryTree";
import { formatBytes } from "./memoryData";

interface MemoryReaderPanelProps {
  source: "manual" | "project";
  manualManifest: ManualManifest | null;
  projectManifest: ProjectManifest | null;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
  openedItemId: string | null;
  onCloseReader: () => void;
  activePage: number | null;
  setActivePage: (page: number | null) => void;
  projectTree: FileNode[];
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
  isFileOpen: boolean;
  setIsFileOpen: (open: boolean) => void;
}

export const MemoryReaderPanel: React.FC<MemoryReaderPanelProps> = ({
  source,
  manualManifest,
  projectManifest,
  selectedNodeId,
  setSelectedNodeId,
  openedItemId,
  onCloseReader,
  activePage,
  setActivePage,
  projectTree,
  selectedPath,
  setSelectedPath,
  isFileOpen,
  setIsFileOpen,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  // Parse manual outline flat structure to nested tree
  const buildManualTree = (outline: ManualChapter[]) => {
    const tree: any[] = [];
    let currentChapter: any = null;

    outline.forEach(item => {
      if (item.level === 0) {
        currentChapter = { ...item, children: [] };
        tree.push(currentChapter);
      } else if (currentChapter) {
        currentChapter.children.push({ ...item });
      } else {
        tree.push({ ...item });
      }
    });

    return tree;
  };

  const manualTree = manualManifest ? buildManualTree(manualManifest.outline) : [];

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Node selection handler inside tree
  const handleSelectNode = (nodeId: string, page?: number, path?: string, isFile?: boolean) => {
    setSelectedNodeId(nodeId);
    if (page !== undefined) {
      setActivePage(page);
    }
    if (path !== undefined) {
      setSelectedPath(path);
    }
    if (isFile !== undefined) {
      setIsFileOpen(isFile);
    }
  };

  // Page navigation helpers
  const handlePrevPage = () => {
    if (activePage !== null && activePage > 1) {
      setActivePage(activePage - 1);
    }
  };

  const handleNextPage = () => {
    if (activePage !== null && manualManifest && activePage < manualManifest.pageCount) {
      setActivePage(activePage + 1);
    }
  };

  // Helper to generate mock project file previews
  const getMockFileContent = (path: string, name: string) => {
    if (path.endsWith(".md")) {
      return `# ${name}\n\n[LCARS SECURE SYSTEM ARCHIVE]\n\nThis is a static preview of ${path}.\n\nBackend filesystem integration (API V1) is required to retrieve and write live local workspace contents.\n\n---\nDOCUMENT ROLE: DOCUMENTATION\nINTEGRITY STATUS: NOMINAL\nENCRYPTION: LEVEL 3 PASS-THROUGH\n\n## LCARS System Logs\n[10:22:13] Node initialized.\n[10:22:14] Manifest loaded successfully.`;
    }
    if (path.endsWith(".json")) {
      return `{\n  "name": "${name.replace(".json", "")}",\n  "version": "1.0.0",\n  "description": "LCARS Database Node",\n  "status": "PROTOTYPE-V0.9-OFFLINE",\n  "path": "${path}",\n  "engine": "VITE/REACT"\n}`;
    }
    if (path.endsWith(".css")) {
      return `/* LCARS Style Primitive: ${name} */\n:root {\n  --primitive-path: "${path}";\n  --status: "V0.9-READONLY";\n}\n\n.lcars-terminal-node {\n  color: var(--cyan-bright);\n  font-family: var(--font-lcars);\n  font-weight: bold;\n}`;
    }
    if (path.endsWith(".ts") || path.endsWith(".tsx")) {
      return `// LCARS Source Module: ${name}\n// Path: ${path}\n\nimport React from "react";\nimport { useLcars } from "../lcars";\n\nexport const ${name.replace(/\.tsx?$/, "")}: React.FC = () => {\n  const { beep } = useLcars();\n  \n  return (\n    <div className="lcars-module-node">\n      <span>Prototype node offline. API V1 required.</span>\n    </div>\n  );\n};`;
    }
    return `// LCARS Binary/Source Module: ${name}\n// Path: ${path}\n\nfunction initializeArchiveNode() {\n  console.log("Archive node offline. API V1 required.");\n}`;
  };

  const activeManualOutlineNode = manualManifest?.outline.find(n => n.id === selectedNodeId);
  const activeProjectFile = projectManifest?.files.find(f => f.id === selectedNodeId);

  // Set default page / file when opened item is empty
  useEffect(() => {
    if (source === "manual" && activePage === null) {
      setActivePage(6); // default to first page
    }
  }, [source, activePage, setActivePage]);

  return (
    <div className="memory-reader-layout">
      {/* Left Sidebar Tree */}
      <aside className="memory-tree-pane">
        <div className="memory-tree-header">
          {source === "manual" ? "MANUAL OUTLINE" : "WORKSPACE DIRECTORY"}
        </div>
        <MemoryTree
          source={source}
          manualOutline={manualTree}
          projectTree={projectTree}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
        />
      </aside>

      {/* Right Main Reader */}
      <div className="memory-reader-pane">
        <header className="memory-reader-header">
          <div className="reader-title">
            {source === "manual" 
              ? `PDF: TNG TECHNICAL MANUAL CN ${activeManualOutlineNode ? `> ${activeManualOutlineNode.title}` : ""}`
              : `FILE: ${selectedPath || "SELECT FILE TO VIEW"}`
            }
          </div>
          
          <div className="reader-controls">
            {source === "manual" && (
              <>
                <button type="button" className="reader-control-btn" onClick={handlePrevPage} disabled={activePage === 1}>
                  ◀ PREV
                </button>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-lcars)", color: "var(--cyan)" }}>
                  PAGE {activePage} / {manualManifest?.pageCount || 168}
                </span>
                <button type="button" className="reader-control-btn" onClick={handleNextPage} disabled={activePage === manualManifest?.pageCount}>
                  NEXT ▶
                </button>
              </>
            )}
            <button type="button" className="reader-control-btn" onClick={onCloseReader} style={{ background: "var(--orange)", color: "#000", fontWeight: "bold" }}>
              CLOSE ✕
            </button>
          </div>
        </header>

        <div className="memory-reader-content">
          {source === "manual" ? (
            <iframe
              title="TNG Technical Manual CN Reader"
              src={`/library/tng-technical-manual-cn.pdf#page=${activePage || 6}`}
              className="pdf-viewer-frame"
            />
          ) : (
            // Project File mode
            activeProjectFile ? (
              activeProjectFile.readable ? (
                <div className="text-viewer-container">
                  <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--gray-dark)", paddingBottom: "10px", marginBottom: "14px", color: "var(--gray-light)", fontSize: "0.72rem" }}>
                    <span>FILE ID: {activeProjectFile.id}</span>
                    <span>SIZE: {formatBytes(activeProjectFile.bytes)}</span>
                    <span>TYPE: {activeProjectFile.extension.toUpperCase()}</span>
                  </div>
                  <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {getMockFileContent(activeProjectFile.path, activeProjectFile.name)}
                  </pre>
                </div>
              ) : (
                <div className="binary-fallback-container">
                  <span className="binary-fallback-icon">⚠️</span>
                  <div style={{ fontFamily: "var(--font-lcars)", fontWeight: "bold", fontSize: "1rem" }}>
                    BINARY ARCHIVE DETECTED
                  </div>
                  <p style={{ maxWidth: "400px", fontSize: "0.75rem", color: "var(--gray-light)", margin: 0 }}>
                    File {activeProjectFile.name} contains compiled binary or media formats. Direct text stream rendering is offline.
                  </p>
                  <div style={{ fontSize: "0.7rem", color: "var(--cyan)", background: "var(--panel)", padding: "10px 18px", border: "1px dashed var(--gray)" }}>
                    SIZE: {formatBytes(activeProjectFile.bytes)} | INTEGRATION STATE: FS-API-V1 REQUIRED
                  </div>
                </div>
              )
            ) : (
              <div className="binary-fallback-container">
                <span className="binary-fallback-icon">📂</span>
                <div style={{ fontFamily: "var(--font-lcars)", fontWeight: "bold", fontSize: "1rem" }}>
                  NO FILE OPEN
                </div>
                <p style={{ maxWidth: "400px", fontSize: "0.75rem", color: "var(--gray-light)", margin: 0 }}>
                  Select a readable file from the left workspace directory tree to display its static prototype preview.
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
