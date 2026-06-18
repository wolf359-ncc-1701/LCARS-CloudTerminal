import React from "react";

interface MemoryToolbarProps {
  source: "manual" | "project";
  setSource: (source: "manual" | "project") => void;
  query: string;
  setQuery: (query: string) => void;
  openedItemId: string | null;
  onCloseReader: () => void;
  onOpenIndex: () => void;
}

export const MemoryToolbar: React.FC<MemoryToolbarProps> = ({
  source,
  setSource,
  query,
  setQuery,
  openedItemId,
  onCloseReader,
  onOpenIndex,
}) => {
  return (
    <div className="memory-toolbar">
      <div className="memory-toolbar-left">
        <div className="segmented-control" aria-label="Memory archive source">
          <button
            type="button"
            className={`segmented-btn ${source === "manual" ? "active" : ""}`}
            onClick={() => setSource("manual")}
          >
            TNG MANUAL
          </button>
          <button
            type="button"
            className={`segmented-btn ${source === "project" ? "active" : ""}`}
            onClick={() => setSource("project")}
          >
            PROJECT FILES
          </button>
        </div>

        <button
          type="button"
          className="reader-control-btn"
          onClick={onOpenIndex}
          style={{ background: "var(--cyan-dark)", color: "var(--gray-white)", fontWeight: "bold" }}
        >
          OPEN INDEX
        </button>

        {openedItemId && (
          <button
            type="button"
            className="reader-control-btn"
            onClick={onCloseReader}
            style={{ background: "var(--orange)", color: "#000", fontWeight: "bold" }}
          >
            CLOSE READER
          </button>
        )}
      </div>

      <div className="memory-toolbar-right">
        <div className="search-input-wrapper">
          <span className="search-icon">FIND</span>
          <input
            type="text"
            placeholder="FILTER ARCHIVE..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
