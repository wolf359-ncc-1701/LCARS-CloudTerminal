# Gemini Prompt: V0.9 Memory Archive And Reader

请在这个仓库工作：

`https://github.com/wolf359-ncc-1701/LCARS-CloudTerminal`

请先拉取当前分支最新代码，然后创建或切换到你自己的实现分支，例如：

```text
ai/gemini-v09-memory-archive
```

这次你只负责前端实现，不负责后端。Codex 已经完成资料准备和架构拆分。

请先阅读：

```text
docs/v0.9-memory-archive-architecture.md
docs/ai-tasks/TASK-007-v09-memory-archive.md
docs/dev-log.md
```

静态数据入口已经准备好：

```text
public/library/tng-technical-manual-cn.pdf
public/library/tng-manual-manifest.json
public/library/project-file-manifest.json
```

你的目标是把 `Memory` mode 改造成 LCARS 文件管理器和阅读器。

## 必须做的事

1. 重写 `MemoryView`，不要继续使用旧的容量色块/硬件诊断占位界面。
2. Memory 没打开文件时，主内容区必须是一个完整文件管理器：
   - 左侧源栏；
   - 顶部筛选/操作条；
   - 中央文件/章节列表；
   - metadata strip。
3. 打开文件后，文件管理器自动缩成左侧目录树，右侧显示阅读器。
4. TNG 技术手册使用：
   - `/library/tng-manual-manifest.json`
   - `/library/tng-technical-manual-cn.pdf`
5. 点击手册 outline 节点时，PDF 阅读器应该跳到对应页，例如：
   - `/library/tng-technical-manual-cn.pdf#page=42`
6. 项目文件管理器使用：
   - `/library/project-file-manifest.json`
   - V0.9 先显示文件树、文件类型、大小、路径、可读状态；
   - 不要假装已经能直接读写任意本地文件，真实读取留给后端 V1。
7. 当 `mode === "memory"` 时，右侧 rail 按钮必须变成实际可操作的 Memory 动作：
   - `MANUAL ARCHIVE`
   - `PROJECT FILES`
   - `OPEN INDEX`
   - `CLOSE READER`
   - `FILTER RESET`
8. 上面这些按钮必须真的改变 Memory 状态，不要只是文字。
9. 做 browser -> reader 的切换动画：
   - 文件管理器压缩成左侧 tree；
   - reader 从右侧扫描/展开；
   - 动画要短、像 LCARS 操作界面，不要花哨。

## 严格禁止

- 不要改 V0.78 左上 elbow 几何。
- 不要破坏 V0.79 viewport containment。
- 不要重做整个 app shell。
- 不要重新引入 Quick Actions。
- 不要把界面做成普通 Mac Finder，只能借鉴 Finder 的信息架构。
- 不要新增大 UI 框架。
- 不要引入真实文件系统写操作。
- 不要删除已经生成的 PDF 和 manifest。

## 设计规范

严格遵守现有 LCARS 规范：

- 使用现有 `tokens.css` 色板。
- 使用 Microgramma 字体作为 UI 字体。
- 不出现重色看不清，例如 cyan-on-cyan、gray-on-gray。
- 使用 LCARS rail、bracket、bar、readout、meter 的视觉语法。
- 文件列表应该像 LCARS 数据条，不是普通网页 card。
- 阅读器必须看起来嵌在 LCARS 操作台里。
- 尊重 `prefers-reduced-motion`。

## 建议文件结构

可以新增：

```text
src/components/dashboard/memory/MemoryArchiveView.tsx
src/components/dashboard/memory/MemoryBrowserPanel.tsx
src/components/dashboard/memory/MemoryReaderPanel.tsx
src/components/dashboard/memory/MemoryTree.tsx
src/components/dashboard/memory/MemoryToolbar.tsx
src/components/dashboard/memory/memoryTypes.ts
src/components/dashboard/memory/memoryData.ts
```

也可以用更少文件，但请不要把所有逻辑都堆进一个超长 `MemoryView.tsx`。

## 完成后

请运行：

```text
npm run build
```

并更新：

```text
docs/dev-log.md
```

说明你做了什么、哪些数据文件被使用、哪些是真实功能、哪些留给 V1 后端。

推荐提交信息：

```text
feat(memory): implement V0.9 archive file manager prototype
```
