export type MemorySource = "manual" | "project";
export type MemoryLayout = "browser" | "reader";

export interface ManualChapter {
  id: string;
  title: string;
  level: number;
  sourceFile: string;
  page: number;
}

export interface ManualManifest {
  id: string;
  title: string;
  sourceRepository: string;
  sourceRoot: string;
  pdfUrl: string;
  pdfLocalPath: string;
  pageCount: number;
  chapters: ManualChapter[];
  outline: ManualChapter[];
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  extension: string;
  bytes: number;
  role: string;
  readable: boolean;
}

export interface ProjectManifest {
  id: string;
  title: string;
  mode: string;
  generatedFor: string;
  root: string;
  files: ProjectFile[];
}

export interface FileNode {
  id: string;
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
  extension?: string;
  bytes?: number;
  role?: string;
  readable?: boolean;
}
