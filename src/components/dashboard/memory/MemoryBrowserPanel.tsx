import React, { useState } from "react";
import type { ManualManifest, ProjectManifest, ProjectFile, FileNode } from "./memoryTypes";
import { formatBytes } from "./memoryData";

interface MemoryBrowserPanelProps {
  source: "manual" | "project";
  setSource: (source: "manual" | "project") => void;
  manualManifest: ManualManifest | null;
  projectManifest: ProjectManifest | null;
  query: string;
  onOpenFile: (itemId: string, page?: number, path?: string, isFile?: boolean) => void;
  projectTree: FileNode[];
}

export const MemoryBrowserPanel: React.FC<MemoryBrowserPanelProps> = ({
  source,
  setSource,
  manualManifest,
  projectManifest,
  query,
  onOpenFile,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<string | null>(null);

  const normalizedQuery = query.toLowerCase();
  const filteredChapters = manualManifest?.chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(normalizedQuery) ||
    chapter.sourceFile.toLowerCase().includes(normalizedQuery)
  ) || [];

  const filteredFiles = projectManifest?.files.filter((file) => {
    const matchesQuery =
      file.name.toLowerCase().includes(normalizedQuery) ||
      file.path.toLowerCase().includes(normalizedQuery) ||
      file.extension.toLowerCase().includes(normalizedQuery);
    const matchesFolder = selectedFolderFilter ? file.path.startsWith(selectedFolderFilter) : true;
    return matchesQuery && matchesFolder;
  }) || [];

  const selectedFile = projectManifest?.files.find((file) => file.id === selectedFileId);

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

  return (
    <div className="memory-browser">
      <aside className="memory-source-rail" aria-label="Archive navigation">
        <div style={{ fontSize: "0.75rem", color: "var(--orange-light)", fontWeight: "bold", padding: "0 6px 4px 6px", fontFamily: "var(--font-lcars)" }}>
          ARCHIVE CONTROL
        </div>

        <button
          type="button"
          className={`memory-source-card ${source === "manual" ? "active" : ""}`}
          onClick={() => {
            setSource("manual");
            setSelectedFolderFilter(null);
          }}
        >
          <h3>TNG MANUAL</h3>
          <p>Technical Manual CN</p>
          <p style={{ fontSize: "0.65rem", opacity: 0.7 }}>CHAPTER SOURCE</p>
        </button>

        <button
          type="button"
          className={`memory-source-card ${source === "project" ? "active" : ""}`}
          onClick={() => setSource("project")}
        >
          <h3>WORKSPACE</h3>
          <p>Local project files</p>
          <p style={{ fontSize: "0.65rem", opacity: 0.7 }}>
            {projectManifest?.files.length || 0} FILES / STATIC
          </p>
        </button>

        {source === "project" && folders.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "0.7rem", color: "var(--cyan)", fontWeight: "bold", padding: "0 6px 4px 6px", fontFamily: "var(--font-lcars)" }}>
              FOLDER FILTER
            </div>
            <button
              type="button"
              className={`memory-tree-node ${selectedFolderFilter === null ? "active" : ""}`}
              style={{ fontSize: "0.72rem", padding: "4px 8px" }}
              onClick={() => setSelectedFolderFilter(null)}
            >
              [ALL] FILES
            </button>
            <div style={{ maxHeight: "160px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {folders.map((folder) => (
                <button
                  type="button"
                  key={folder}
                  className={`memory-tree-node ${selectedFolderFilter === folder ? "active" : ""}`}
                  style={{ fontSize: "0.72rem", padding: "4px 8px", paddingLeft: `${(folder.split("/").length * 8) + 8}px` }}
                  onClick={() => setSelectedFolderFilter(folder)}
                >
                  [DIR] {folder.split("/").pop()}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className="memory-grid-container">
        {source === "manual" ? (
          <div className="memory-chapters-grid">
            {filteredChapters.map((chapter, index) => {
              const accentColor = index % 2 === 0 ? "cyan" : "orange";
              return (
                <button
                  type="button"
                  key={chapter.id}
                  className="memory-chapter-tile"
                  data-accent={accentColor}
                  onClick={() => onOpenFile("manual-root", chapter.page, chapter.sourceFile, false)}
                >
                  <span className="chapter-num">CHAPTER {chapter.title.split(" ")[0]}</span>
                  <span className="chapter-title">{chapter.title.replace(/^[0-9.]+\s+/, "")}</span>
                  <div className="chapter-meta">
                    <span>PAGE REF {chapter.page}</span>
                    <span style={{ textTransform: "lowercase", opacity: 0.6 }}>{chapter.sourceFile}</span>
                  </div>
                </button>
              );
            })}
            {filteredChapters.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--orange)" }}>
                NO ARCHIVE ENTRIES MATCH FILTERING CRITERIA
              </div>
            )}
          </div>
        ) : (
          <div className="memory-files-list">
            <div
              className="memory-file-row-header"
              style={{
                display: "grid",
                gridTemplateColumns: "2.5fr 1fr 1fr 1fr",
                gap: "10px",
                padding: "6px 16px",
                borderBottom: "2px solid var(--gray-dark)",
                fontSize: "0.72rem",
                fontWeight: "bold",
                color: "var(--cyan)",
                textTransform: "uppercase",
              }}
            >
              <span>File Name / Path</span>
              <span>Role</span>
              <span>Size</span>
              <span>Readable</span>
            </div>

            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
              {filteredFiles.map((file) => (
                <button
                  type="button"
                  key={file.id}
                  className={`memory-file-row ${selectedFileId === file.id ? "selected" : ""}`}
                  onClick={() => setSelectedFileId(file.id)}
                  onDoubleClick={() => onOpenFile(file.id, undefined, file.path, true)}
                >
                  <span className="file-name" title={file.path}>
                    [FILE] {file.path}
                  </span>
                  <span>{file.role}</span>
                  <span>{formatBytes(file.bytes)}</span>
                  <span style={{ color: file.readable ? "var(--success)" : "var(--orange)" }}>
                    {file.readable ? "YES" : "NO"}
                  </span>
                </button>
              ))}
              {filteredFiles.length === 0 && (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--orange)" }}>
                  NO WORKSPACE FILES MATCH FILTERING CRITERIA
                </div>
              )}
            </div>
          </div>
        )}

        <footer className="memory-metadata-strip">
          <div className="metadata-item">
            SOURCE: <strong>{source === "manual" ? "TNG TECHNICAL MANUAL" : "WORKSPACE MANIFEST"}</strong>
          </div>
          <div className="metadata-item">
            STATUS: <strong>READ-ONLY PROTOTYPE</strong>
          </div>
          {source === "manual" ? (
            <>
              <div className="metadata-item">
                PAGE MAP: <strong>{manualManifest?.pageCount || 168}</strong>
              </div>
              <div className="metadata-item">
                CHAPTERS: <strong>{manualManifest?.chapters.length || 17}</strong>
              </div>
            </>
          ) : (
            <>
              <div className="metadata-item">
                SELECTED FILE: <strong>{selectedFile ? selectedFile.name : "[NONE]"}</strong>
              </div>
              <div className="metadata-item">
                SELECTED SIZE: <strong>{selectedFile ? formatBytes(selectedFile.bytes) : "[N/A]"}</strong>
              </div>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};
