import React, { useEffect, useState } from "react";
import type { ManualManifest, ProjectManifest, FileNode, ManualChapter } from "./memoryTypes";
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

interface ReaderDocument {
  title: string;
  content: string;
  encoding?: string | null;
  bytes?: number;
  readable?: boolean;
}

const parseInlineStyles = (text: string): string => {
  let html = text
    .replace(/<Badge[^>]*\/>/g, "") // remove custom badge tags
    .replace(/\[\[toc\]\]/gi, "");  // remove toc marker
  
  // Handle bold, italics, and code tags
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  return html;
};

const renderInlineMarkdown = (text: string) => {
  return text.split(/\r?\n/).map((line, idx) => {
    const parsed = parseInlineStyles(line.trim());
    if (!parsed) return null;
    return <p key={idx} dangerouslySetInnerHTML={{ __html: parsed }} />;
  });
};

const renderMarkdown = (markdown: string) => {
  const lines = markdown.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let inWarning = false;
  let warningLines: string[] = [];
  let inDetails = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check custom warning container block
    if (trimmed.startsWith("::: warning")) {
      inWarning = true;
      warningLines = [];
      const header = trimmed.replace("::: warning", "").trim();
      if (header) warningLines.push(`**${header}**`);
      continue;
    }

    if (trimmed === ":::") {
      if (inWarning) {
        inWarning = false;
        blocks.push(
          <div className="lcars-reader-callout warning" key={`warn-${i}`}>
            <div className="callout-header">ADVISORY / SPEC DATA</div>
            <div className="callout-body">
              {renderInlineMarkdown(warningLines.join("\n"))}
            </div>
          </div>
        );
      }
      inDetails = false;
      continue;
    }

    if (trimmed.startsWith("::: details")) {
      inDetails = true;
      continue;
    }

    if (inWarning) {
      warningLines.push(rawLine);
      continue;
    }

    if (inDetails) {
      continue;
    }

    // Heading tags
    const headingMatch = rawLine.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      let title = headingMatch[2];
      title = title.replace(/<[^>]+>/g, "").trim();
      if (level === 1) {
        blocks.push(
          <h2 key={`h-${i}`} className={`lcars-reader-heading level-${level}`}>
            {title}
          </h2>
        );
      } else if (level === 2) {
        blocks.push(
          <h3 key={`h-${i}`} className={`lcars-reader-heading level-${level}`}>
            {title}
          </h3>
        );
      } else {
        blocks.push(
          <h4 key={`h-${i}`} className={`lcars-reader-heading level-${level}`}>
            {title}
          </h4>
        );
      }
      continue;
    }

    // Parse image elements
    if (trimmed.startsWith("<img") || trimmed.startsWith("![") || (trimmed.includes("<img") && trimmed.includes("src="))) {
      const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
      const src = srcMatch ? srcMatch[1] : "";
      const filename = src.split("/").pop() || "GRAPHIC";
      blocks.push(
        <div className="lcars-reader-image-box" key={`img-${i}`}>
          <div className="image-header">SYSTEM GRAPHIC REFERENCE</div>
          <div className="image-filename">{filename.toUpperCase()}</div>
          <div className="image-desc">[DATABASE OPTICAL TRANSFER MODULE]</div>
        </div>
      );
      continue;
    }

    // Parse bullet lists
    if (/^[-*]\s+/.test(trimmed)) {
      const content = trimmed.replace(/^[-*]\s+/, "");
      blocks.push(
        <div className="lcars-reader-bullet" key={`bullet-${i}`}>
          <span className="bullet-mark" />
          <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }} />
        </div>
      );
      continue;
    }

    // Paragraph elements
    if (trimmed) {
      blocks.push(
        <p className="lcars-reader-paragraph" key={`p-${i}`} dangerouslySetInnerHTML={{ __html: parseInlineStyles(trimmed) }} />
      );
    }
  }

  return blocks;
};

export const MemoryReaderPanel: React.FC<MemoryReaderPanelProps> = ({
  source,
  manualManifest,
  projectManifest,
  selectedNodeId,
  openedItemId,
  onCloseReader,
  activePage,
  setActivePage,
  selectedPath,
  setSelectedPath,
  isFileOpen,
}) => {
  const [readerDocument, setReaderDocument] = useState<ReaderDocument | null>(null);
  const [readerError, setReaderError] = useState<string | null>(null);
  const [readerBusy, setReaderBusy] = useState(false);

  // Helper to map active manual page to the corresponding markdown chapter file
  const getSourceFileForPage = (page: number): string => {
    if (!manualManifest || !manualManifest.chapters || !manualManifest.chapters.length) {
      return "uss-enterprise-introduction.md";
    }
    const eligible = manualManifest.chapters.filter((ch) => ch.page <= page);
    if (!eligible.length) return manualManifest.chapters[0].sourceFile;
    eligible.sort((a, b) => b.page - a.page);
    return eligible[0].sourceFile;
  };

  const manualSourceFile = source === "manual" ? getSourceFileForPage(activePage || 6) : "";
  const activeManualOutlineNode = manualManifest?.outline.find((node) => node.id === selectedNodeId);
  const activeProjectFile = projectManifest?.files.find((file) => file.id === selectedNodeId);

  const handlePrevPage = () => {
    if (activePage !== null && activePage > 1) {
      const nextPage = activePage - 1;
      setActivePage(nextPage);
      // Sync selected outline node if it changed
      if (manualManifest) {
        const fileForPage = getSourceFileForPage(nextPage);
        setSelectedPath(fileForPage);
      }
    }
  };

  const handleNextPage = () => {
    if (activePage !== null && manualManifest && activePage < manualManifest.pageCount) {
      const nextPage = activePage + 1;
      setActivePage(nextPage);
      // Sync selected outline node if it changed
      if (manualManifest) {
        const fileForPage = getSourceFileForPage(nextPage);
        setSelectedPath(fileForPage);
      }
    }
  };

  useEffect(() => {
    if (source === "manual" && activePage === null) {
      setActivePage(manualManifest?.chapters[0]?.page || 6);
    }
  }, [source, activePage, manualManifest, setActivePage]);

  // Load document from API endpoints
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadDocument() {
      setReaderBusy(true);
      setReaderError(null);

      try {
        if (source === "manual") {
          const fileToFetch = manualSourceFile || "uss-enterprise-introduction.md";
          const response = await fetch(`/api/archive/manuals/tng-technical-manual-cn/chapter?file=${encodeURIComponent(fileToFetch)}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error(`manual_api_${response.status}`);
          const payload = await response.json();
          if (!cancelled) {
            setReaderDocument({
              title: payload.title || activeManualOutlineNode?.title || fileToFetch,
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
    <div className="memory-reader-pane" style={{ height: "100%", margin: 0 }}>
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
  );
};
