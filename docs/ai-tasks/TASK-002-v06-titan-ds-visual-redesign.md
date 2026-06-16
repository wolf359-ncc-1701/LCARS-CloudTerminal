# TASK-002: V0.6 Titan DS High-Density Visual Redesign

## 角色分工

Gemini / Antigravity 只负责前端实现。不要改项目架构、包管理器、后端接口、构建配置和 Git 历史策略。

Codex / GPT 负责架构、任务拆分、资源边界、审查和合并。

## 背景

V0.5 已经完成组件拆分和基础 LCARS 风格，但视觉还偏普通 dashboard，没有 Titan DS 那种高密度、舞台式、机械面板式的味道。

V0.6 的目标是把界面从“LCARS inspired dashboard”推进到“Titan DS inspired cloud terminal”。重点是视觉语法、信息密度和动效节奏，而不是新增业务功能。

## 参考对象

- 用户截图中的 meWho Titan DS / Titan.DS 风格。
- 仓库文档：`docs/titan-ds-style-analysis.md`
- 仓库文档：`docs/v0.5-lcars-grammar.md`
- 仓库文档：`docs/resource-policy.md`
- 当前组件结构：`src/components/lcars/*` 和 `src/components/dashboard/*`

## 资源和版权边界

可以高相似度模仿这些“界面语法”：

- 巨大的圆角 LCARS 外框和 elbow。
- 黑底高密度信息面板。
- 左侧竖向色块控制列。
- 右侧模块切换栈。
- 顶部双轨横条和状态点阵。
- 底部遥测条、滑块、刻度、短线矩阵。
- 装饰性编号、假数据、闪烁状态点。
- 扫描线、dash flow、meter random、soft glow 等 CSS 动效。
- 原创 SVG 系统图、云节点图、终端拓扑图。

不要直接提交这些内容：

- meWho / Titan.DS 原站图片、SVG 艺术资产、MP3、JS chunk。
- Star Trek 官方 ship diagram、舰名标识、徽章、阵营 logo。
- 直接复制的大段原站 CSS，除非已经重写为项目自己的组件语法，并且不包含原站资源引用。

如果参考 CSS，请只学习布局方法、尺寸关系和动效 primitive，然后改写成项目自己的 class、tokens 和组件。

## 字体要求

仓库已加入用户提供字体：

- `src/assets/fonts/microgramma-d-extended-bold.otf`
- CSS font-family: `"LCARS Microgramma"`

使用规则：

- 主标题、数字、按钮、模块标签优先使用 `"LCARS Microgramma"`。
- 长正文、说明文字可以继续用 fallback，避免全页面难读。
- 不要引入 Google Fonts 或外部字体 CDN。
- 不要改字体文件名。

## V0.6 视觉目标

V0.6 首页第一屏应明显更接近 Titan DS：

1. 外框更像一个固定比例的操作台，而不是普通网页容器。
2. 左侧 rail 必须有大圆角 elbow、竖向仪表、色块按钮矩阵和小编号块。
3. 顶部必须有双轨横条、标题区、状态点阵和模块编号。
4. 右侧必须是窄而密的模块栈，不要变成普通导航。
5. 底部必须有遥测条、刻度条、微型进度条、短线矩阵和状态 readout。
6. 主显示区必须有原创的 cloud terminal / home core / memory core 图形，而不是空洞大卡片。
7. 页面要有大量小元素在轻微闪烁、流动、随机变化，但不能影响可读性。

## 必须实现的组件或样式 primitive

优先复用并扩展现有组件。可以新增组件，但不要重写整个 app。

### LCARS 外框

新增或改造：

- `LcarsShell`
- `LcarsRail`
- `LcarsFrame`
- `LcarsTopRail`
- `LcarsBottomTelemetry`

这些组件可以放在 `src/components/lcars/`。

外框要求：

- 使用大圆角、厚边、黑色负空间。
- 顶部和左侧要形成连续结构。
- 视觉上像固定舞台，不像普通响应式卡片网格。

### 左侧控制列

左侧需要包含：

- 顶部大 elbow / bracket。
- `TITAN.LOCAL` 或 `LCARS.CLOUD` 标识。
- 2 列色块矩阵，带编号如 `44-600`、`10-667`、`82-464`。
- 至少 2 个竖向 meter，带刻度和滑块。
- Audio / Dimmer / Auto / Red Alert 控件。

### 右侧模块栈

右侧模块栈需要包含：

- `BRIDGE`
- `HABITAT`
- `POWER`
- `MEMORY`
- `COMMAND`

按钮必须是窄横条，当前项用橙色或青色强调。不要使用普通 tab 样式。

### 顶部状态轨

顶部需要包含：

- 双条或三条横向 LCARS rail。
- 一组状态点阵。
- 当前标题：`LCARS CLOUD TERMINAL`
- 右侧状态词，例如 `SYSTEM` / `LOCAL CORE` / `MEMORY BUS`

### 主显示区

Bridge 视图需要重做为高密度主屏：

- 左上大数字时间 / 本地状态。
- 中央原创 SVG 或 CSS 图形：云终端拓扑、home core 舱段图、memory array、energy bus 任一，但不能使用 Star Trek 舰船轮廓。
- 右侧 readout stack：设备在线、核心负载、环境指数、AI watch。
- 叠加小标签、十字刻度、扫描线、随机点。

Home / Power / Memory / Command 视图可以暂时复用同一外框，但主显示区要换成对应主题，不能只是空文字。

### 底部遥测条

底部需要有：

- 2 到 4 条横向 telemetry bar。
- 刻度、短线、滑块、编号。
- 至少一条持续流动动画。
- 当前模式和状态读数。

## 动效要求

必须至少包含这些 CSS keyframes 或等价实现：

- soft blink
- hard blink
- dash flow
- scan line
- meter random
- panel enter
- alert pulse

动效原则：

- 多个小动效比一个大动效更重要。
- 默认状态不要太亮。
- Red Alert 时只强化局部和边框，不要整屏变红。
- 必须尊重 `prefers-reduced-motion`，用户减少动态时关闭或弱化动效。

## 响应式要求

桌面优先，但不能移动端崩坏。

验收尺寸：

- 390px 宽：允许变成纵向滚动，不能文字重叠。
- 768px 宽：左右 rail 可以压缩或堆叠。
- 1440px 宽：必须呈现完整操作台效果。
- 1920px 宽：不能显得过空，要保持信息密度。

## 禁止事项

- 不要把页面改成营销 landing page。
- 不要引入大型 UI 框架。
- 不要引入外部 CDN。
- 不要新增后端。
- 不要删除现有 hooks 和 mock telemetry。
- 不要把所有内容塞回单个 `App.tsx`。
- 不要直接复制 Titan.DS 的整站资源。
- 不要提交 screenshots、mp3、webp、png、原站 svg 艺术文件。

## 允许修改范围

优先修改：

- `src/app/App.tsx`
- `src/components/lcars/*`
- `src/components/dashboard/*`
- `src/styles/*.css`
- `src/data/mock.ts`

谨慎修改：

- `src/hooks/*`
- `src/types.ts`

不要修改：

- `package.json`，除非必须并解释原因。
- `vite.config.ts`
- `tsconfig*`
- `.gitignore`

## 验收标准

完成后必须：

1. `npm run build` 通过。
2. 不产生 TypeScript 错误。
3. 不新增外部资源请求。
4. 视觉第一屏明显比 V0.5 更接近 Titan DS 的高密度操作台。
5. 按钮、模式切换、音频开关、红色警报仍能工作。
6. 没有明显文字重叠、按钮溢出、横向滚动失控。
7. 提交到分支 `ai/gemini-v06-titan-redesign`，不要直接合并 `main`。

## 推荐提交信息

```text
feat(ui): implement V0.6 Titan DS inspired high-density interface
```

如果分多次提交：

```text
feat(lcars): add shell rails and telemetry primitives
feat(views): redesign dashboard modules for V0.6
style(motion): add Titan DS inspired animation primitives
```
