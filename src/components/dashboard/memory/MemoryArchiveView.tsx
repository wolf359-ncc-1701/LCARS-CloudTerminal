import React, { useState, useEffect } from "react";
import { MemoryBrowserPanel } from "./MemoryBrowserPanel";
import { MemoryReaderPanel } from "./MemoryReaderPanel";
import { MemoryTree } from "./MemoryTree";
import type { ManualManifest, ProjectManifest, FileNode, ManualChapter, ProjectFile } from "./memoryTypes";
import { buildFileTree } from "./memoryData";

interface MemoryArchiveViewProps {
  source: "manual" | "project";
  setSource: (source: "manual" | "project") => void;
  openedItemId: string | null;
  setOpenedItemId: (itemId: string | null) => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (nodeId: string | null) => void;
  activePage: number | null;
  setActivePage: (page: number | null) => void;
  query: string;
  setQuery: (query: string) => void;
  selectedPath: string | null;
  setSelectedPath: (path: string | null) => void;
  isFileOpen: boolean;
  setIsFileOpen: (open: boolean) => void;
}

type ManualTreeNode = ManualChapter & { children?: ManualTreeNode[] };

const buildManualTree = (outline: ManualChapter[]) => {
  const tree: ManualTreeNode[] = [];
  let currentChapter: ManualTreeNode | null = null;

  outline.forEach((item) => {
    if (item.level === 0) {
      currentChapter = { ...item, children: [] };
      tree.push(currentChapter);
    } else if (currentChapter) {
      currentChapter.children?.push({ ...item });
    } else {
      tree.push({ ...item });
    }
  });

  return tree;
};

export const MemoryArchiveView: React.FC<MemoryArchiveViewProps> = ({
  source,
  setSource,
  openedItemId,
  setOpenedItemId,
  selectedNodeId,
  setSelectedNodeId,
  activePage,
  setActivePage,
  query,
  setQuery,
  selectedPath,
  setSelectedPath,
  isFileOpen,
  setIsFileOpen,
}) => {
  const [manualManifest, setManualManifest] = useState<ManualManifest | null>(null);
  const [projectManifest, setProjectManifest] = useState<ProjectManifest | null>(null);
  const [projectTree, setProjectTree] = useState<FileNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string | null>(null);

  // Fetch static or API data on mount
  useEffect(() => {
    // 1. Fetch manual outline
    fetch("/api/archive/manuals/tng-technical-manual-cn/outline")
      .then((res) => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then((data) => setManualManifest(data))
      .catch(() => {
        fetch("/library/tng-manual-manifest.json")
          .then((res) => res.json())
          .then((data) => setManualManifest(data))
          .catch((err) => console.error("Error loading manual manifest:", err));
      });

    // 2. Fetch project files manifest
    fetch("/library/project-file-manifest.json")
      .then((res) => res.json())
      .then((data) => setProjectManifest(data))
      .catch((err) => console.error("Error loading project manifest:", err));

    // 3. Fetch project tree
    fetch("/api/files/tree")
      .then((res) => {
        if (!res.ok) throw new Error("API Offline");
        return res.json();
      })
      .then((data) => {
        if (data && data.children) {
          setProjectTree(data.children);
        }
      })
      .catch(() => {
        fetch("/library/project-file-manifest.json")
          .then((res) => res.json())
          .then((data) => {
            if (data && data.files) {
              const tree = buildFileTree(data.files);
              setProjectTree(tree);
            }
          })
          .catch((err) => console.error("Error loading project tree:", err));
      });
  }, []);

  const handleCloseReader = () => {
    setOpenedItemId(null);
    setSelectedNodeId(null);
    setActivePage(null);
    setSelectedPath(null);
    setIsFileOpen(false);
  };

  const handleOpenIndex = () => {
    if (source === "manual") {
      if (manualManifest && manualManifest.chapters.length > 0) {
        const firstChapter = manualManifest.chapters[0];
        setOpenedItemId("manual-root");
        setSelectedNodeId(firstChapter.id);
        setActivePage(firstChapter.page);
        setSelectedPath(firstChapter.sourceFile);
        setIsFileOpen(false);
      }
    } else {
      const firstReadableFile = projectManifest?.files.find((f) => f.readable);
      if (firstReadableFile) {
        setOpenedItemId(firstReadableFile.id);
        setSelectedNodeId(firstReadableFile.id);
        setSelectedPath(firstReadableFile.path);
        setIsFileOpen(true);
      }
    }
  };

  const handleOpenFile = (itemId: string, page?: number, path?: string, isFile?: boolean) => {
    setOpenedItemId(itemId);
    setSelectedNodeId(itemId);
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

  const handleSourceChange = (nextSource: "manual" | "project") => {
    setSource(nextSource);
    setOpenedItemId(null);
    setSelectedNodeId(null);
    setActivePage(null);
    setSelectedPath(null);
    setIsFileOpen(false);
    setSelectedFolderFilter(null);
  };

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const handleSelectNode = (nodeId: string, page?: number, nextPath?: string, nextIsFile?: boolean) => {
    setSelectedNodeId(nodeId);
    if (page !== undefined) setActivePage(page);
    if (nextPath !== undefined) setSelectedPath(nextPath);
    if (nextIsFile !== undefined) {
      setIsFileOpen(nextIsFile);
      if (nextIsFile) {
        setOpenedItemId(nodeId);
      }
    } else {
      setOpenedItemId("manual-root");
    }
  };

  const getFoldersList = (files: ProjectFile[]) => {
    const foldersSet = new Set<string>();
    files.forEach((file) => {
      const parts = file.path.split("/");
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i += 1) {
          foldersSet.add(parts.slice(0, i).join("/"));
        }
      }
    });
    return Array.from(foldersSet).sort();
  };

  const folders = projectManifest ? getFoldersList(projectManifest.files) : [];
  const manualTree = manualManifest ? buildManualTree(manualManifest.outline) : [];
  const isReaderOpen = openedItemId !== null;

  return (
    <div className="memory-archive panel-enter" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <div className="memory-archive-layout">
        
        {/* Left Directory / Outline / Controls Sidebar */}
        <aside className={`memory-sidebar ${isReaderOpen ? "reader-open" : ""}`} aria-label="Archive navigation">
          
          <div style={{ fontSize: "0.75rem", color: "var(--orange-light)", fontWeight: "bold", padding: "0 6px 2px 6px", fontFamily: "var(--font-lcars)" }}>
            ARCHIVE CONTROL
          </div>

          {/* Source Group Switcher */}
          {!isReaderOpen ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
              <button
                type="button"
                className={`memory-source-card ${source === "manual" ? "active" : ""}`}
                onClick={() => handleSourceChange("manual")}
              >
                <h3>TNG MANUAL</h3>
                <p>Technical Manual CN</p>
                <p style={{ fontSize: "0.6rem", opacity: 0.7 }}>CHAPTER SOURCE</p>
              </button>

              <button
                type="button"
                className={`memory-source-card ${source === "project" ? "active" : ""}`}
                onClick={() => handleSourceChange("project")}
              >
                <h3>WORKSPACE</h3>
                <p>Local project files</p>
                <p style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                  {projectManifest?.files.length || 0} FILES / STATIC
                </p>
              </button>
            </div>
          ) : (
            <div className="segmented-control" style={{ width: "100%", margin: "0 0 4px 0" }}>
              <button
                type="button"
                className={`segmented-btn ${source === "manual" ? "active" : ""}`}
                onClick={() => handleSourceChange("manual")}
                style={{ flex: 1 }}
              >
                MANUAL
              </button>
              <button
                type="button"
                className={`segmented-btn ${source === "project" ? "active" : ""}`}
                onClick={() => handleSourceChange("project")}
                style={{ flex: 1 }}
              >
                WORKSPACE
              </button>
            </div>
          )}

          {/* Search Input Box */}
          <div className="search-input-wrapper" style={{ margin: "4px 0 8px 0", width: "100%" }}>
            <span className="search-icon" style={{ fontFamily: "var(--font-lcars)", fontSize: "0.7rem", color: "var(--cyan-light)" }}>FIND</span>
            <input
              type="text"
              placeholder="FILTER ARCHIVE..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "100%", paddingLeft: "36px", boxSizing: "border-box" }}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: 0,
                  color: "var(--orange)",
                  fontFamily: "var(--font-lcars)",
                  fontSize: "0.7rem",
                  cursor: "pointer"
                }}
              >
                X
              </button>
            )}
          </div>

          {/* Directory Tree or Filter Listing */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {isReaderOpen ? (
              <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div className="memory-tree-header" style={{ fontSize: "0.7rem", padding: "4px 6px" }}>
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
              </div>
            ) : (
              <>
                {source === "project" && folders.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--cyan)", fontWeight: "bold", padding: "0 6px 4px 6px", fontFamily: "var(--font-lcars)" }}>
                      FOLDER FILTER
                    </div>
                    <button
                      type="button"
                      className={`memory-tree-node ${selectedFolderFilter === null ? "active" : ""}`}
                      style={{ fontSize: "0.72rem", padding: "4px 8px", minHeight: "24px" }}
                      onClick={() => setSelectedFolderFilter(null)}
                    >
                      [ALL] FILES
                    </button>
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                      {folders.map((folder) => (
                        <button
                          type="button"
                          key={folder}
                          className={`memory-tree-node ${selectedFolderFilter === folder ? "active" : ""}`}
                          style={{ fontSize: "0.72rem", padding: "4px 8px", paddingLeft: `${(folder.split("/").length * 8) + 8}px`, minHeight: "24px" }}
                          onClick={() => setSelectedFolderFilter(folder)}
                        >
                          DIR {folder.split("/").pop()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {source === "manual" && manualManifest && (
                  <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <div style={{ fontSize: "0.7rem", color: "var(--cyan)", fontWeight: "bold", padding: "0 6px 4px 6px", fontFamily: "var(--font-lcars)" }}>
                      CHAPTERS OUTLINE
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                      {manualManifest.chapters.map((ch) => (
                        <button
                          type="button"
                          key={ch.id}
                          className="memory-tree-node"
                          style={{ fontSize: "0.72rem", padding: "4px 8px", minHeight: "24px" }}
                          onClick={() => handleOpenFile("manual-root", ch.page, ch.sourceFile, false)}
                        >
                          CH {ch.title.split(" ")[0]} - {ch.title.replace(/^[0-9.]+\s+/, "")}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Memory Internal Control Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px", borderTop: "2px solid var(--gray-dark)", paddingTop: "8px" }}>
            {isReaderOpen && (
              <button
                type="button"
                className="reader-control-btn"
                onClick={handleCloseReader}
                style={{ background: "var(--orange)", color: "#000", fontWeight: "bold", width: "100%", padding: "6px 0", fontFamily: "var(--font-lcars)", border: 0, cursor: "pointer", fontSize: "0.75rem" }}
              >
                CLOSE READER
              </button>
            )}
            <button
              type="button"
              className="reader-control-btn"
              onClick={handleOpenIndex}
              style={{ background: "var(--cyan-dark)", color: "var(--gray-white)", fontWeight: "bold", width: "100%", padding: "6px 0", fontFamily: "var(--font-lcars)", border: 0, cursor: "pointer", fontSize: "0.75rem" }}
            >
              OPEN INDEX
            </button>
            <button
              type="button"
              className="reader-control-btn"
              onClick={() => {
                setQuery("");
                setSelectedFolderFilter(null);
              }}
              style={{ background: "var(--gray-dark)", color: "var(--gray-white)", width: "100%", padding: "6px 0", fontFamily: "var(--font-lcars)", border: 0, cursor: "pointer", fontSize: "0.75rem" }}
            >
              FILTER RESET
            </button>
          </div>

        </aside>

        {/* Right Main Stage Content area */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          {!isReaderOpen ? (
            <MemoryBrowserPanel
              source={source}
              setSource={setSource}
              manualManifest={manualManifest}
              projectManifest={projectManifest}
              query={query}
              onOpenFile={handleOpenFile}
              projectTree={projectTree}
              selectedFolderFilter={selectedFolderFilter}
            />
          ) : (
            <MemoryReaderPanel
              source={source}
              manualManifest={manualManifest}
              projectManifest={projectManifest}
              selectedNodeId={selectedNodeId}
              setSelectedNodeId={setSelectedNodeId}
              openedItemId={openedItemId}
              onCloseReader={handleCloseReader}
              activePage={activePage}
              setActivePage={setActivePage}
              projectTree={projectTree}
              selectedPath={selectedPath}
              setSelectedPath={setSelectedPath}
              isFileOpen={isFileOpen}
              setIsFileOpen={setIsFileOpen}
            />
          )}
        </div>

      </div>
    </div>
  );
};
