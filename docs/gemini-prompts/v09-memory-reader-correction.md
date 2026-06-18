# Gemini Prompt: V0.9 Memory Reader Correction

请在这个仓库工作：

https://github.com/wolf359-ncc-1701/LCARS-CloudTerminal

先拉取当前分支并基于最新代码继续：

```powershell
git fetch origin
git switch ai/gemini-v09-memory-archive
git pull
```

## 背景

Codex 已经审查了 V0.9 Memory Archive 原型，并补了一个只读本地后端：

- `npm run api` 启动 `http://127.0.0.1:8787`
- Vite dev server 会把 `/api` 代理到这个后端
- 后端提供 TNG 手册章节 Markdown、手册目录、项目文件树、文件读取、文件搜索

你只负责前端视觉和交互，不要改后端 API 的安全边界。

## 这次必须纠正的问题

1. 不要把 `TNG MANUAL` 和 `PROJECT FILES` 做成两个割裂的并列大标签页。
   - 它们应该属于同一个 Memory Archive 文件管理系统的两个 source group。
   - 左侧目录/操作区负责显示 source group、文件树、过滤和打开索引。
   - 中央/右侧阅读区负责显示当前打开的文档或文件。

2. 不要直接显示 PDF，不要使用 `<iframe>`、`object`、浏览器内置 PDF 阅读器或 Edge PDF 插件。
   - 使用 `/api/archive/manuals/tng-technical-manual-cn/chapter?file=xxx.md` 获取章节 Markdown。
   - 在 LCARS 自建阅读器中渲染章节标题、段落、列表和索引。
   - 视觉参考可以看 `https://docs.startrekcn.cn/docs/tng-technical-manual/uss-enterprise-introduction.html` 的信息结构，但 UI 必须是本项目 LCARS 规范，不要照搬网站皮肤。

3. 操作按钮不要放到右侧全局 rail。
   - 右侧 rail 应保持全局模式导航：BRIDGE / HABITAT / POWER / MEMORY / ACTIONS。
   - Memory 的操作按钮必须在 Memory 面板内部，优先放在左侧目录/操作区：SOURCE、OPEN INDEX、CLOSE READER、FILTER RESET、SEARCH。

4. 文件未打开时：
   - Memory 主区域应像文件管理器一样占满可用空间。
   - 左侧是 source / folder / collection 控制区。
   - 右侧或中央是章节/文件列表。

5. 文件打开时：
   - 左侧自动压缩成目录树。
   - 右侧变成 LCARS 阅读器。
   - 手册章节阅读用 Markdown 文本渲染；项目文件阅读用 `/api/files/read?path=...` 返回的文本。

## 不能做

- 不要恢复 PDF iframe。
- 不要把 Memory 专属操作塞回 `App.tsx` 的右侧 rail。
- 不要引入大型 UI 框架。
- 不要添加写文件/删文件能力；V0.9 后端是只读。
- 不要用 emoji 图标，避免 Windows/多 agent 转码乱码；使用 `[DIR]`、`[FILE]`、`MD`、`JSN`、`BIN` 等 LCARS 文本标记。

## 可用后端接口

- `GET /api/health`
- `GET /api/archive/manuals`
- `GET /api/archive/manuals/tng-technical-manual-cn/outline`
- `GET /api/archive/manuals/tng-technical-manual-cn/chapter?file=computer-systems.md`
- `GET /api/files/tree`
- `GET /api/files/meta?path=src/app/App.tsx`
- `GET /api/files/read?path=src/app/App.tsx`
- `GET /api/search?q=Memory`

## 验收标准

- `npm run build` 通过。
- `npm run api -- --check` 通过。
- Memory 页面没有 PDF 浏览器插件痕迹。
- 右侧 rail 只显示全局模式导航，不显示 Memory 文件操作。
- Memory 操作在左侧目录/操作区或 Memory 面板内部。
- 手册章节能显示为 LCARS 风格正文，而不是 Edge/PDF 阅读器。
- 所有按钮文字可见，没有右侧溢出和乱码。
- 修改完成后 commit，但不要合并 main。
