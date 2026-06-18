import type { FileNode, ProjectFile } from "./memoryTypes";

export function buildFileTree(files: ProjectFile[]): FileNode[] {
  const root: FileNode[] = [];
  
  files.forEach(file => {
    const parts = file.path.split("/");
    let currentLevel = root;
    
    parts.forEach((part, index) => {
      const isLast = index === parts.length - 1;
      const currentPath = parts.slice(0, index + 1).join("/");
      
      let existingNode = currentLevel.find(node => node.name === part);
      
      if (!existingNode) {
        existingNode = {
          id: isLast ? file.id : currentPath,
          name: part,
          path: currentPath,
          type: isLast ? "file" : "directory",
          children: isLast ? undefined : [],
          extension: isLast ? file.extension : undefined,
          bytes: isLast ? file.bytes : undefined,
          role: isLast ? file.role : undefined,
          readable: isLast ? file.readable : undefined
        };
        currentLevel.push(existingNode);
      }
      
      if (!isLast && existingNode.children) {
        currentLevel = existingNode.children;
      }
    });
  });
  
  const sortTree = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
    nodes.forEach(node => {
      if (node.children) {
        sortTree(node.children);
      }
    });
  };
  
  sortTree(root);
  return root;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}
