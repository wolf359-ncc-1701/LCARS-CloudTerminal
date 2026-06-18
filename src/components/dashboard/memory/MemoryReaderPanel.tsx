import React, { useEffect, useState } from "react";
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

type ManualTreeNode = ManualChapter & { children?: ManualTreeNode[] };

interface ReaderDocument {
  title: string;
  content: string;
  encoding?: string | null;
  bytes?: number;
  readable?: boolean;
}

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

const cleanMarkdownLine = (line: string) =>
  line
    .replace(/<Badge[^>]*\/>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\[\[toc\]\]/gi, "")
    .trim();

const renderMarkdown = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];

  lines.forEach((rawLine, index) => {
    const line = cleanMarkdownLine(rawLine);
    if (!line || line.startsWith(":::")) return;

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const headingText = heading[2];
      if (level === 1) {
        blocks.push(
          <h2 key={`${index}-${line}`} className={`lcars-reader-heading level-${level}`}>
            {headingText}
          </h2>,
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={`${index}-${line}`} className={`lcars-reader-heading level-${level}`}>
            {headingText}
          </h3>,
        );
      } else {
        blocks.push(
          <h4 key={`${index}-${line}`} className={`lcars-reader-heading level-${level}`}>
            {headingText}
          </h4>,
        );
      }
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      blocks.push(
        <div key={`${index}-${line}`} className="lcars-reader-bullet">
          <span className="bullet-mark" />
          <span>{line.replace(/^[-*]\s+/, "")}</span>
        </div>,
      );
      return;
    }

    blocks.push(
      <p key={`${index}-${line}`} className="lcars-reader-paragraph">
        {line}
      </p>,
    );
  });

  return blocks;
};

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
  const [readerDocument, setReaderDocument] = useState<ReaderDocument | null>(null);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerBusy, setReaderBusy] = useState(false);

  const manualTree = manualManifest ? buildManualTree(manualManifest.outline) : [];
  const activeManualOutlineNode = manualManifest?.outline.find((node) => node.id === selectedNodeId);
  const activeProjectFile = projectManifest?.files.find((file) => file.id === selectedNodeId);
  const manualSourceFile = selectedPath || activeManualOutlineNode?.sourceFile || manualManifest?.chapters[0]?.sourceFile || "uss-enterprise-introduction.md";

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
    if (nextIsFile !== undefined) setIsFileOpen(nextIsFile);
  };

  const handlePrevPage = () => {
    if (activePage !== null && activePage > 1) setActivePage(activePage - 1);
  };

  const handleNextPage = () => {
    if (activePage !== null && manualManifest && activePage < manualManifest.pageCount) {
      setActivePage(activePage + 1);
    }
  };

  useEffect(() => {
    if (source === "manual" && activePage === null) {
      setActivePage(manualManifest?.chapters[0]?.page || 6);
    }
  }, [source, activePage, manualManifest, setActivePage]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadDocument() {
      setReaderBusy(true);
      setReaderError(null);

      try {
        if (source === "manual") {
          const response = await fetch(`/api/archive/manuals/tng-technical-manual-cn/chapter?file=${encodeURIComponent(manualSourceFile)}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`manual_api_${response.status}`);
          const payload = await response.json();
          if (!cancelled) {
            setReaderDocument({
              title: payload.title || activeManualOutlineNode?.title || manualSourceFile,
              content: payload.markdown || "",
              readable: true,
            });
          }
          return;
        }

        if (selectedPath) {
          const response = await fetch(`/api/files/read?path=${encodeURIComponent(selectedPath)}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`file_api_${response.status}`);
          const payload = await response.json();
          if (!cancelled) {
            setReaderDocument({
              title: payload.path || selectedPath,
              content: payload.content || "",
              encoding: payload.encoding,
              bytes: payload.bytes,
              readable: payload.readable,
            });
          }
          return;
        }

        setReaderDocument(null);
      } catch (error) {
        if (!cancelled && error instanceof Error && error.name !== "AbortError") {
          setReaderError("READ-ONLY ARCHIVE API OFFLINE OR DOCUMENT UNAVAILABLE");
          setReaderDocument(null);
        }
      } finally {
        if (!cancelled) setReaderBusy(false);
      }
    }

    loadDocument();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [source, manualSourceFile, selectedPath, activeManualOutlineNode]);

  return (
    <div className="memory-reader-layout">
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

      <div className="memory-reader-pane">
        <header className="memory-reader-header">
          <div className="reader-title">
            {source === "manual"
              ? `LCARS MANUAL READER > ${activeManualOutlineNode?.title || readerDocument?.title || manualSourceFile}`
              : `WORKSPACE FILE > ${selectedPath || "SELECT FILE TO VIEW"}`}
          </div>

          <div className="reader-controls">
            {source === "manual" && (
              <>
                <button type="button" className="reader-control-btn" onClick={handlePrevPage} disabled={activePage === 1}>
                  PREV REF
                </button>
                <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-lcars)", color: "var(--cyan)" }}>
                  PAGE REF {activePage} / {manualManifest?.pageCount || 168}
                </span>
                <button type="button" className="reader-control-btn" onClick={handleNextPage} disabled={activePage === manualManifest?.pageCount}>
                  NEXT REF
                </button>
              </>
            )}
            <button type="button" className="reader-control-btn" onClick={onCloseReader} style={{ background: "var(--orange)", color: "#000", fontWeight: "bold" }}>
              CLOSE
            </button>
          </div>
        </header>

        <div className="memory-reader-content">
          {readerBusy ? (
            <div className="binary-fallback-container">
              <div style={{ fontFamily: "var(--font-lcars)", fontWeight: "bold", fontSize: "1rem" }}>
                ACCESSING LIBRARY COMPUTER DATA
              </div>
            </div>
          ) : readerError ? (
            <div className="binary-fallback-container">
              <span className="binary-fallback-icon">API</span>
              <div style={{ fontFamily: "var(--font-lcars)", fontWeight: "bold", fontSize: "1rem" }}>
                {readerError}
              </div>
              <p style={{ maxWidth: "480px", fontSize: "0.75rem", color: "var(--gray-light)", margin: 0 }}>
                Start the local backend with npm run api, then reload Memory mode.
              </p>
            </div>
          ) : source === "manual" ? (
            <article className="lcars-document-reader">
              {readerDocument ? renderMarkdown(readerDocument.content) : null}
            </article>
          ) : activeProjectFile && readerDocument?.readable ? (
            <div className="text-viewer-container">
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--gray-dark)", paddingBottom: "10px", marginBottom: "14px", color: "var(--gray-light)", fontSize: "0.72rem" }}>
                <span>FILE ID: {activeProjectFile.id}</span>
                <span>SIZE: {formatBytes(readerDocument.bytes || activeProjectFile.bytes)}</span>
                <span>TYPE: {activeProjectFile.extension.toUpperCase()}</span>
              </div>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {readerDocument.content}
              </pre>
            </div>
          ) : (
            <div className="binary-fallback-container">
              <span className="binary-fallback-icon">{isFileOpen ? "BIN" : "FILE"}</span>
              <div style={{ fontFamily: "var(--font-lcars)", fontWeight: "bold", fontSize: "1rem" }}>
                {openedItemId ? "BINARY OR UNREADABLE ARCHIVE DETECTED" : "NO FILE OPEN"}
              </div>
              <p style={{ maxWidth: "400px", fontSize: "0.75rem", color: "var(--gray-light)", margin: 0 }}>
                Select a readable project file from the left directory tree to stream it through the read-only archive API.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
