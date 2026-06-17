# Gemini Prompt: V0.77 Left Rail Regression Fix

请在这个本地仓库工作：

```text
C:\Users\user\Documents\LCARS
```

当前分支：

```text
ai/gemini-v077-right-rail-habitat
```

不要 push GitHub，不要合并 main。

Codex 审查当前提交：

```text
0b389d5 fix(ui): align V0.77 corner dev label with Titan reference
```

左上角转角方向已经接近正确：`DEV V.0.77` 现在放在灰色结构块里，而不是黑色空腔里，这个方向保留。

但是你引入了严重布局回归：左侧 rail 下方内容被截断、编号块变成残片，主内容挤进左栏。用户截图显示 `TITAN.LOCAL`、编号块、左侧仪表和主内容都发生错位。

## 根因提示

请重点检查并修复这些改动：

```css
--rail: 180px;
.primary-elbow { width: 300px !important; }
.left-rail > *:not(.primary-elbow) { width: 100%; }
```

问题是：全局左栏宽度和 elbow 宽度不一致。`--rail` 被缩到 180px，但 elbow 是 300px，主 grid 仍按 `--rail` 分配列宽，导致 elbow 溢出、下面元素被压窄，主内容覆盖进左栏。

## 必须修复

- 恢复左侧 rail 的稳定宽度，不要让下面的 brand block、编号块、vertical meter 被截断。
- 不要为了让 elbow 更宽而把全局 `--rail` 缩窄。
- `TITAN.LOCAL` 下方的编号块必须重新完整显示为两列，不允许只露出半块。
- 主内容区不能覆盖进左侧 rail。
- 保留当前正确方向：`DEV V.0.77` 放在灰色 elbow 结构材料里，而不是黑色空腔里。
- 保留 PPT/Titan 风格：左/下主体更宽，右/上延伸更窄。
- 如果 elbow 需要更宽，只允许它在自己的 SVG 内部表达，不要破坏 `lcars-app` 的 grid column 宽度契约。

## 推荐方案

- 把 `--rail` 恢复到 V0.76/V0.75 的稳定值，例如 `246px`，除非你能证明所有左栏子元素都在新宽度下完整显示。
- 让 `.primary-elbow` 不改变下面左栏元素的布局宽度。
- 删除或收窄 `.left-rail > *:not(.primary-elbow)` 这类会影响所有左栏子元素的规则。
- 如果需要 300px 的 elbow 视觉宽度，可以让 SVG 内部处理宽窄转角，或只让 elbow 的上横段向右视觉延伸，但不能改变左栏下面元素的可用宽度。
- 不要改 right rail、Habitat 卡片、info overlay，除非为了修这个布局回归必须做极小调整。

## 允许修改

```text
src/app/App.tsx
src/components/lcars/LcarsElbow.tsx
src/styles/layout.css
src/styles/responsive.css
src/styles/tokens.css
docs/dev-log.md
```

不要修改：

```text
package.json
package-lock.json
vite.config.ts
tsconfig*
src/assets/*
```

## 验收

运行：

```text
npm run build
```

视觉确认：

- 左上转角仍然是 Titan/PPT 风格。
- `DEV V.0.77` 在灰色结构块里。
- `TITAN.LOCAL` 完整显示。
- 左侧编号块完整显示为两列。
- 左侧 vertical meter 不被主内容覆盖。
- 主内容区不侵入左侧 rail。
- Right rail 标签仍可见。
- Quick Actions 仍已删除。
- Habitat 卡片修复不回退。

如果通过，可以本地提交：

```text
fix(ui): repair V0.77 left rail layout regression
```

不要 push。完成后告诉我 commit hash 和修改文件。
