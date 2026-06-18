import React, { useState } from "react";
import type { ManualManifest, ProjectManifest, FileNode, ProjectFile } from "./memoryTypes";
import { formatBytes } from "./memoryData";

interface MemoryBrowserPanelProps {
  source: "manual" | "project";
  setSource: (source: "manual" | "project") => void;
  manualManifest: ManualManifest | null;
  projectManifest: ProjectManifest | null;
  query: string;
  onOpenFile: (itemId: string, page?: number, path?: string, isFile?: boolean) => void;
  projectTree: FileNode[];
  selectedFolderFilter?: string | null;
}

export const MemoryBrowserPanel: React.FC<MemoryBrowserPanelProps> = ({
  source,
  manualManifest,
  projectManifest,
  query,
  onOpenFile,
  selectedFolderFilter = null,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

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

  return (
    <div className="memory-grid-container" style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
      {source === "manual" ? (
        <div className="memory-chapters-grid">
          {filteredChapters.map((chapter, index) => {
            const accentColor = index % 2 === 0 ? "cyan" : "orange";
            return (
              <button
                type="button"
                className="memory-chapter-tile"
                key={chapter.id}
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
        <div className="memory-files-list" style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
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
  );
};
