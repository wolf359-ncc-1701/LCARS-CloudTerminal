import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";

const PORT = Number(process.env.LCARS_API_PORT || 8787);
const WORKSPACE_ROOT = path.resolve(process.env.LCARS_WORKSPACE_ROOT || process.cwd());
const MANUAL_ROOT = path.join(WORKSPACE_ROOT, "external", "stcn-docs", "docs", "docs", "tng-technical-manual");
const MANUAL_ASSET_ROOT = path.join(WORKSPACE_ROOT, "external", "stcn-docs", "docs", "assets", "img", "TNGTM");
const MANUAL_MANIFEST = path.join(WORKSPACE_ROOT, "public", "library", "tng-manual-manifest.json");

const EXCLUDED_DIRS = new Set([".git", "node_modules", "dist", "external", "tmp", "output"]);
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
]);
const MAX_READ_BYTES = 1024 * 1024;
const MAX_SEARCH_FILES = 240;
const MAX_SEARCH_RESULTS = 80;

function json(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "access-control-allow-headers": "content-type",
    "content-type": "application/json; charset=utf-8",
  });
  res.end(body);
}

function notFound(res) {
  json(res, 404, { error: "not_found" });
}

function fail(res, status, message) {
  json(res, status, { error: message });
}

function binary(res, status, bytes, contentType) {
  res.writeHead(status, {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, OPTIONS",
    "content-type": contentType,
    "cache-control": "public, max-age=3600",
  });
  res.end(bytes);
}

function relativeFor(absPath, root = WORKSPACE_ROOT) {
  const rel = path.relative(root, absPath).replaceAll(path.sep, "/");
  return rel === "" ? "." : rel;
}

function safeResolveWorkspace(inputPath = ".") {
  if (typeof inputPath !== "string") {
    throw new Error("invalid_path");
  }

  const normalized = inputPath.replaceAll("\\", "/").replace(/^\/+/, "");
  if (normalized.includes("\0") || path.isAbsolute(normalized)) {
    throw new Error("invalid_path");
  }

  const resolved = path.resolve(WORKSPACE_ROOT, normalized);
  if (resolved !== WORKSPACE_ROOT && !resolved.startsWith(WORKSPACE_ROOT + path.sep)) {
    throw new Error("path_outside_workspace");
  }
  return resolved;
}

function safeResolveManual(sourceFile = "") {
  if (typeof sourceFile !== "string" || !sourceFile.endsWith(".md")) {
    throw new Error("invalid_manual_file");
  }

  const normalized = sourceFile.replaceAll("\\", "/").replace(/^\/+/, "");
  const resolved = path.resolve(MANUAL_ROOT, normalized);
  if (!resolved.startsWith(MANUAL_ROOT + path.sep)) {
    throw new Error("manual_path_outside_root");
  }
  return resolved;
}

function safeResolveManualAsset(assetFile = "") {
  if (typeof assetFile !== "string") {
    throw new Error("invalid_asset_file");
  }

  const normalized = assetFile.replaceAll("\\", "/").replace(/^\/+/, "").replace(/^assets\/img\/TNGTM\//, "");
  if (!/\.(png|jpe?g|gif|webp)$/i.test(normalized)) {
    throw new Error("unsupported_asset_type");
  }

  const resolved = path.resolve(MANUAL_ASSET_ROOT, normalized);
  if (!resolved.startsWith(MANUAL_ASSET_ROOT + path.sep)) {
    throw new Error("asset_path_outside_root");
  }
  return resolved;
}

function isTextFile(filePath) {
  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function classifyRole(relPath, isDirectory) {
  if (isDirectory) return "directory";
  if (relPath.startsWith("docs/")) return "documentation";
  if (relPath.startsWith("src/")) return "source";
  if (relPath.startsWith("public/")) return "asset";
  if (relPath.endsWith(".json")) return "manifest";
  return "workspace";
}

async function fileMeta(absPath, root = WORKSPACE_ROOT) {
  const stat = await fs.stat(absPath);
  const isDirectory = stat.isDirectory();
  const rel = relativeFor(absPath, root);
  return {
    path: rel,
    name: path.basename(absPath),
    type: isDirectory ? "directory" : "file",
    extension: isDirectory ? "" : path.extname(absPath).replace(/^\./, ""),
    bytes: stat.size,
    role: classifyRole(rel, isDirectory),
    readable: !isDirectory && isTextFile(absPath) && stat.size <= MAX_READ_BYTES,
    modifiedAt: stat.mtime.toISOString(),
  };
}

async function buildTree(absRoot, depth = 0, maxDepth = 7) {
  const entries = await fs.readdir(absRoot, { withFileTypes: true });
  const nodes = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) continue;

    const abs = path.join(absRoot, entry.name);
    const meta = await fileMeta(abs);
    const node = {
      id: Buffer.from(meta.path).toString("base64url").slice(0, 18),
      ...meta,
    };

    if (entry.isDirectory() && depth < maxDepth) {
      node.children = await buildTree(abs, depth + 1, maxDepth);
    }
    nodes.push(node);
  }

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

async function readWorkspaceFile(inputPath) {
  const abs = safeResolveWorkspace(inputPath);
  const meta = await fileMeta(abs);
  if (meta.type !== "file") {
    throw new Error("path_is_not_file");
  }
  if (!meta.readable) {
    return { ...meta, content: null, encoding: null };
  }
  const content = await fs.readFile(abs, "utf8");
  return { ...meta, content, encoding: "utf8" };
}

async function readManifest() {
  return JSON.parse(await fs.readFile(MANUAL_MANIFEST, "utf8"));
}

function stripFrontMatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/, "");
}

function extractMarkdownToc(markdown, sourceFile) {
  return stripFrontMatter(markdown)
    .split(/\r?\n/)
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => /^#{1,4}\s+/.test(line))
    .map(({ line, index }) => {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const title = line.replace(/^#{1,6}\s+/, "").trim();
      return {
        id: `${sourceFile}:${index}`,
        title,
        level,
        sourceFile,
        line: index + 1,
      };
    });
}

async function readManualChapter(sourceFile) {
  const abs = safeResolveManual(sourceFile);
  const markdown = stripFrontMatter(await fs.readFile(abs, "utf8"));
  return {
    sourceFile,
    title: sourceFile.replace(/\.md$/, "").replaceAll("-", " ").toUpperCase(),
    markdown,
    outline: extractMarkdownToc(markdown, sourceFile),
  };
}

async function listManualChapters() {
  const manifest = await readManifest();
  return {
    id: manifest.id,
    title: manifest.title,
    sourceRepository: manifest.sourceRepository,
    chapters: manifest.chapters,
    outline: manifest.outline,
  };
}

async function searchWorkspace(query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];

  const results = [];
  let scanned = 0;

  async function walk(absDir) {
    if (scanned >= MAX_SEARCH_FILES || results.length >= MAX_SEARCH_RESULTS) return;
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    for (const entry of entries) {
      if (results.length >= MAX_SEARCH_RESULTS) break;
      if (entry.name.startsWith(".") && entry.name !== ".gitignore") continue;
      if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) continue;

      const abs = path.join(absDir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }

      scanned += 1;
      const meta = await fileMeta(abs);
      if (meta.path.toLowerCase().includes(q)) {
        results.push({ ...meta, match: "path" });
        continue;
      }

      if (meta.readable) {
        const content = await fs.readFile(abs, "utf8");
        const idx = content.toLowerCase().indexOf(q);
        if (idx >= 0) {
          results.push({
            ...meta,
            match: "content",
            snippet: content.slice(Math.max(0, idx - 80), idx + 180),
          });
        }
      }
    }
  }

  await walk(WORKSPACE_ROOT);
  return results;
}

async function route(req, res) {
  if (req.method === "OPTIONS") {
    json(res, 204, {});
    return;
  }
  if (req.method !== "GET") {
    fail(res, 405, "method_not_allowed");
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host || "127.0.0.1"}`);

  try {
    if (url.pathname === "/api/health") {
      json(res, 200, {
        status: "nominal",
        service: "lcars-readonly-archive-api",
        workspaceRoot: WORKSPACE_ROOT,
      });
      return;
    }

    if (url.pathname === "/api/files/tree") {
      const rootPath = safeResolveWorkspace(url.searchParams.get("path") || ".");
      const rootMeta = await fileMeta(rootPath);
      if (rootMeta.type !== "directory") {
        fail(res, 400, "path_is_not_directory");
        return;
      }
      json(res, 200, { root: rootMeta, children: await buildTree(rootPath) });
      return;
    }

    if (url.pathname === "/api/files/read") {
      json(res, 200, await readWorkspaceFile(url.searchParams.get("path") || ""));
      return;
    }

    if (url.pathname === "/api/files/meta") {
      json(res, 200, await fileMeta(safeResolveWorkspace(url.searchParams.get("path") || ".")));
      return;
    }

    if (url.pathname === "/api/search") {
      json(res, 200, { query: url.searchParams.get("q") || "", results: await searchWorkspace(url.searchParams.get("q") || "") });
      return;
    }

    if (url.pathname === "/api/archive/manuals") {
      json(res, 200, { manuals: [await listManualChapters()] });
      return;
    }

    if (url.pathname === "/api/archive/manuals/tng-technical-manual-cn/outline") {
      json(res, 200, await listManualChapters());
      return;
    }

    if (url.pathname === "/api/archive/manuals/tng-technical-manual-cn/chapter") {
      json(res, 200, await readManualChapter(url.searchParams.get("file") || "uss-enterprise-introduction.md"));
      return;
    }

    if (url.pathname.startsWith("/api/archive/manuals/tng-technical-manual-cn/assets/")) {
      const file = decodeURIComponent(url.pathname.replace("/api/archive/manuals/tng-technical-manual-cn/assets/", ""));
      const abs = safeResolveManualAsset(file);
      const ext = path.extname(abs).toLowerCase();
      const type = ext === ".png" ? "image/png" : ext === ".gif" ? "image/gif" : ext === ".webp" ? "image/webp" : "image/jpeg";
      binary(res, 200, await fs.readFile(abs), type);
      return;
    }

    notFound(res);
  } catch (error) {
    fail(res, 400, error instanceof Error ? error.message : "request_failed");
  }
}

async function check() {
  const manifest = await readManifest();
  const firstChapter = manifest.chapters[0]?.sourceFile || "uss-enterprise-introduction.md";
  const chapter = await readManualChapter(firstChapter);
  const rootMeta = await fileMeta(WORKSPACE_ROOT);
  return {
    status: "ok",
    workspaceRoot: rootMeta.path,
    manual: manifest.title,
    firstChapter,
    firstChapterHeadings: chapter.outline.length,
  };
}

if (process.argv.includes("--check")) {
  check()
    .then((result) => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
} else {
  http.createServer(route).listen(PORT, "127.0.0.1", () => {
    console.log(`LCARS archive API listening on http://127.0.0.1:${PORT}`);
  });
}
