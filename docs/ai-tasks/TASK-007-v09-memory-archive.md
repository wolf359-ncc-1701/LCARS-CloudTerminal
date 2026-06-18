# TASK-007: V0.9 Memory Archive And Reader

## 背景

当前 `memory` 页面还是旧的装饰性 memory diagnostics：左边是事件日志，右边是容量、buffer、色块和 meter。V0.9 要把它改成真正的 LCARS 资料库/文件管理器/阅读器模块。

参考资料已经由 Codex 准备好：

- 架构说明：`docs/v0.9-memory-archive-architecture.md`
- TNG 技术手册 PDF：`public/library/tng-technical-manual-cn.pdf`
- TNG 技术手册 manifest：`public/library/tng-manual-manifest.json`
- 当前项目文件 manifest：`public/library/project-file-manifest.json`

## Gemini 负责

你只负责前端 UI 和交互实现。

可以修改：

- `src/components/dashboard/MemoryView.tsx`
- `src/components/dashboard/index.ts`
- `src/components/dashboard/memory/*`
- `src/app/App.tsx`
- `src/styles/layout.css`
- `src/styles/lcars.css`
- `src/styles/animations.css`
- `src/styles/responsive.css`
- 必要的类型文件，例如 `src/types.ts`

不要修改：

- `docs/v0.9-memory-archive-architecture.md` 的核心架构结论，除非只是补充实现备注。
- `public/library/tng-technical-manual-cn.pdf`
- `public/library/tng-manual-manifest.json`
- `public/library/project-file-manifest.json`
- V0.78 左上 elbow 几何。
- V0.79 viewport containment 规则。
- 其他 mode 的核心布局。

## 目标

当用户进入 Memory mode：

1. 没有打开文件时，Memory 内容区是一个全屏文件管理器。
2. 打开文件后，文件管理器自动缩成左侧目录树，右侧出现阅读器。
3. 能打开 TNG 技术手册 PDF，并通过 manifest outline 跳转页码。
4. 能浏览当前项目文件 manifest。
5. 右侧 mode rail 在 Memory 激活时显示实际可点击的文件管理操作，而不是无意义占位块。

## 必须实现的 UI 状态

```ts
type MemorySource = "manual" | "project";
type MemoryLayout = "browser" | "reader";
```

状态规则：

- `openedItemId === null` 时是 `browser`。
- 有打开项时是 `reader`。
- `source = "manual"` 时显示 TNG 手册章节和 outline。
- `source = "project"` 时显示项目文件树。

## 浏览器布局

没有打开文件时，Memory 主内容区应被一个 LCARS 文件管理器占满。

需要包含：

- 顶部工具条：
  - TNG MANUAL / PROJECT FILES 分段切换；
  - 搜索或 FILTER 字段；
  - OPEN INDEX；
  - RESET FILTER。
- 左侧源栏：
  - TNG Technical Manual；
  - Project Files；
  - Recent Reads 或 Archive Index。
- 主区域：
  - manual 模式：章节 tile/list；
  - project 模式：文件和文件夹列表；
  - 每行/每块显示标题、类型、大小、状态码。
- 底部或侧边 metadata strip：
  - source；
  - selected item；
  - file count；
  - page count；
  - readonly state。

## 阅读器布局

打开文件后：

- 左侧变成目录树，宽度大约 260-340px，具体用响应式 clamp。
- 右侧是阅读窗口，占主要空间。
- manual：
  - 用 `iframe` 或 `object` 加载 `/library/tng-technical-manual-cn.pdf#page=N`。
  - tree 里显示 manifest outline。
  - 点击 outline 节点跳到对应页。
- project：
  - tree 里显示 `project-file-manifest.json` 文件树。
  - 文本文件先显示 metadata 和路径，后端读取内容留给 V1。
  - 二进制文件显示不可预览状态。

## 右侧 rail 操作

当 `mode === "memory"` 时，右侧 rail 的按钮必须换成 Memory 专用操作：

- `MANUAL ARCHIVE`：切到 manual source。
- `PROJECT FILES`：切到 project source。
- `OPEN INDEX`：打开当前 source 的第一个可读项。
- `CLOSE READER`：如果有文件打开就关闭 reader，否则 disabled/暗色。
- `FILTER RESET`：清空 query 和选择。

这些按钮必须真的调用状态逻辑。不要只是显示文字。

## 动画

需要有切换动画，但不要过度装饰：

- browser -> reader：文件管理器压缩为左侧 tree，右侧 reader 扫描展开。
- reader -> browser：reader 退出，tree 扩展回文件管理器。
- source 切换：短暂 row scan 或 fade/slide。
- 动画必须尊重 `prefers-reduced-motion`。

## 设计规范

严格遵守既有 LCARS 规范：

- 使用现有色板和 tokens。
- 使用 Microgramma 字体作为界面字体。
- 不能出现 cyan-on-cyan、gray-on-gray 等看不清的重色。
- 不要新增通用圆角卡片风格。
- 不要把 UI 做成普通 Mac Finder，只借鉴 Finder 的信息架构。
- 不要重做左上 elbow。
- 不要重做整个 app shell。

## 验收标准

- `npm run build` 通过。
- Memory 初始状态是全屏文件管理器，不再是旧色块硬件面板。
- 打开 TNG manual 后出现左树右阅读器。
- 点击 manual outline 可以改变 PDF 的 page hash。
- 切换 Project Files 后能看到当前项目文件树。
- 右侧 rail 的 Memory 动作可点击并改变状态。
- Bridge/Habitat/Power/Actions 不出现明显视觉回归。
- 桌面 1440px 和 1920px 下不横向出屏。
- 768px 下 Memory 页面可以纵向滚动或合理堆叠，不挤爆。

## 推荐提交信息

```text
feat(memory): implement V0.9 archive file manager prototype
```
