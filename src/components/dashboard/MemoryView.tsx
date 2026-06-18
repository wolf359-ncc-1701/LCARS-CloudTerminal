import React from "react";
import { MemoryArchiveView } from "./memory/MemoryArchiveView";

interface MemoryViewProps {
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
  actionSignal: { type: "openIndex" | "closeReader" | "filterReset"; tick: number } | null;
}

export const MemoryView: React.FC<MemoryViewProps> = (props) => {
  return <MemoryArchiveView {...props} />;
};
