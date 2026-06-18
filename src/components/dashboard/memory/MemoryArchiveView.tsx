import React, { useState, useEffect } from "react";
import { MemoryToolbar } from "./MemoryToolbar";
import { MemoryBrowserPanel } from "./MemoryBrowserPanel";
import { MemoryReaderPanel } from "./MemoryReaderPanel";
import type { ManualManifest, ProjectManifest, FileNode } from "./memoryTypes";
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

  // Fetch static manifests on mount
  useEffect(() => {
    fetch("/library/tng-manual-manifest.json")
      .then(res => res.json())
      .then(data => setManualManifest(data))
      .catch(err => console.error("Error loading manual manifest:", err));

    fetch("/library/project-file-manifest.json")
      .then(res => res.json())
      .then(data => {
        setProjectManifest(data);
        if (data && data.files) {
          const tree = buildFileTree(data.files);
          setProjectTree(tree);
        }
      })
      .catch(err => console.error("Error loading project manifest:", err));
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
      setOpenedItemId("manual-root");
      if (manualManifest && manualManifest.chapters.length > 0) {
        const firstChapter = manualManifest.chapters[0];
        setSelectedNodeId(firstChapter.id);
        setActivePage(firstChapter.page);
        setSelectedPath(firstChapter.sourceFile);
      }
    } else {
      // Find first readable file in project files
      const firstReadableFile = projectManifest?.files.find(f => f.readable);
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

  return (
    <div className="memory-archive panel-enter" style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
      <MemoryToolbar
        source={source}
        setSource={setSource}
        query={query}
        setQuery={setQuery}
        openedItemId={openedItemId}
        onCloseReader={handleCloseReader}
        onOpenIndex={handleOpenIndex}
      />

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {openedItemId === null ? (
          <MemoryBrowserPanel
            source={source}
            setSource={setSource}
            manualManifest={manualManifest}
            projectManifest={projectManifest}
            query={query}
            onOpenFile={handleOpenFile}
            projectTree={projectTree}
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
  );
};
