# V0.79 Gemini 修复指令：视口内收纳与出屏元素修复

请在这个仓库工作：

`C:\Users\user\Documents\LCARS`

当前版本的左上 elbow 几何已经由 Opus 修到正确状态，请不要再动它。V0.79 只解决截图中红圈标出的“元素超出浏览器可视范围”问题。

## 开始前必须先复盘

动手前，请先阅读 `docs/dev-log.md` 中 V0.77 到 V0.78 的记录，尤其是这些段落：

- `V0.77 Codex Structural Left Clearance Patch`
- `V0.78 Left Elbow Recovery Handoff`
- `V0.78 Left Elbow Continuity Fix`
- `V0.78 Codex Elbow Regression Repair`
- `V0.78 Codex Rail Width Containment Patch`
- `V0.78 Elbow Bottom Edge Alignment`

请在你的回复或 implementation plan 里用中文简短复盘：

1. 为什么 `position: absolute + placeholder` 的 elbow 修法是错误方向。
2. 为什么只把 `.primary-elbow` 收回 `var(--rail)` 会砍掉转角或触发 SVG 缩放。
3. 为什么 Opus 的 `calc(var(--rail) + 40px)` 是正确的：它满足 `railWidth + innerRadius = 246 + 40 = 286px`，避免 `LcarsElbow.tsx` 的防御缩放。
4. 为什么 V0.79 不能再碰 elbow 几何，而应该只处理 viewport containment。

复盘完成后再开始修改。不要跳过这一步。

## 当前问题

用户截图显示两个明显出屏区域：

1. **右侧 rail / SYSTEM INDEX 区域超出右侧浏览器边界**
   - `SYSTEM INDEX / AL...` 标题和右侧菜单区域靠得太右。
   - 右侧 rail 的部分内容在视口右边界外，用户无法完整看到。

2. **底部内容超出下方浏览器边界**
   - 左侧 vertical meter 的底部延伸到视口外。
   - 主舞台底部/日志区域也接近或超过视口下边界。
   - 当前 `.lcars-app` 是 `height: 100vh` + `overflow: hidden`，所以超出的部分直接被裁掉。

## 绝对不要修改

请不要修改以下已经修好的 V0.78 elbow 几何：

- 不要改 `--rail: 246px`
- 不要改 `LcarsElbow.tsx`
- 不要改 `App.tsx` 里的 `LcarsElbow` 参数
- 不要改 `.primary-elbow` 的核心宽度逻辑：
  - `width: calc(var(--rail) + 40px)`
  - `max-width: calc(var(--rail) + 40px)`
- 不要改 `.primary-elbow::after` 的基本思路
- 不要恢复 `.primary-elbow-placeholder`
- 不要使用 `position: absolute` 把 elbow 主体脱离布局流

V0.79 的任务不是重做左上角，是把现有布局装回浏览器视口内。

## 允许修改文件

优先只修改：

- `src/styles/layout.css`
- `src/styles/responsive.css`
- `docs/dev-log.md`

除非绝对必要，不要修改 React 组件。

## 推荐修复方向

### 1. 根布局必须保证三栏都在视口内

检查 `.lcars-app`：

```css
.lcars-app {
  grid-template-columns: var(--rail) minmax(0, 1fr) 278px;
  column-gap: var(--stage-column-gap);
  padding: 24px 28px 22px;
  overflow: hidden;
}
```

请确保：

- 右侧 rail 不会被推出 `100vw`。
- 所有 grid children 都有 `min-width: 0`，尤其是 `.right-rail`。
- 如果 `--stage-column-gap: 56px` 太宽导致右侧内容紧贴边缘，可以适度下调，例如 `44px` 或 `48px`，但不要影响左上 elbow 视觉。
- 右侧列宽可以从 `278px` 改为更稳的 `clamp(220px, 14vw, 278px)` 或类似写法。
- `.lcars-app` 的左右 padding 可适度收紧，例如从 `28px` 降到 `20px` 或用 `clamp()`。

### 2. 右侧标题和菜单必须可见

检查：

```css
.right-rail {}
.module-title {}
.right-stack {}
.right-menu-button {}
```

要求：

- `.right-rail` 必须 `min-width: 0; overflow: hidden;`
- `.module-title` 必须不能把右栏撑出视口：
  - 可以使用 `font-size: clamp(...)`
  - 可以 `white-space: nowrap; overflow: hidden; text-overflow: clip;`
  - 也可以让标题在右栏宽度内缩小，但不要省略到只剩几个字。
- `.right-stack` 和 `.right-menu-button` 宽度必须是 `100%`，不能有超出右栏的固定宽度。

### 3. 底部内容不能被裁掉

检查：

```css
.left-rail {
  grid-template-rows: 148px 72px auto 1fr auto;
}

.main-stage {
  grid-template-rows: 96px 52px minmax(0, 1fr) 118px;
}

.vertical-meter {}
.bottom-telemetry {}
.bridge-log {}
```

要求：

- 在常见桌面视口（至少 1365x768、1440x900、1920x1080）下，左侧 meter 和主舞台底部不能被裁出视口。
- 可以压缩底部区域高度：
  - `.main-stage` 最后一行 `118px` 可降到 `88px` 或 `96px`
  - `.top-rail` 96px 可适度降到 86px
  - `.left-rail` 第一行/品牌行/数字块 min-height 可以轻微压缩，但不要破坏 LCARS 比例。
- `.vertical-meter` 应该被限制在可见区域内：
  - 可以加 `min-height: 0`
  - 可以让 meter 本体 `height: 100%; max-height: 100%`
  - 不要让它因为内部 bars 超出 `.left-rail` 底部。
- `.bridge-log` 或日志区域如果内容太多，应该内部滚动或裁剪，而不是撑破主舞台。

### 4. 不要用页面滚动作为主要解决方案

桌面版应该仍然是一屏 LCARS console。不要简单把 `body { overflow: auto; }` 当作修复。  
如果非常小的高度确实容不下，可以在 responsive breakpoint 里允许滚动，但普通桌面视口应完整显示。

## 验收标准

请至少检查以下视口：

- 1365 x 768
- 1440 x 900
- 1920 x 1080

验收：

- 右侧 `SYSTEM INDEX / AL...` 和菜单按钮完全在浏览器范围内。
- 右侧按钮不出屏、不被裁切。
- 左侧 vertical meter 底部不出屏。
- 主舞台底部内容不出屏。
- 左上 elbow 保持当前正确形态，不被重新破坏。
- `TITAN.LOCAL`、数字块、主舞台显示框保持对齐。
- `npm run build` 通过。

## 完成后

请更新 `docs/dev-log.md`，记录 V0.79 视口收纳修复内容。

本地 commit：

`fix(ui): contain V0.79 viewport overflow`

不要 push。
