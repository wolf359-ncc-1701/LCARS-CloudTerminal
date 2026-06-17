# Gemini Prompt: V0.77 Right Rail And Habitat Polish

请在这个本地仓库工作：

```text
C:\Users\user\Documents\LCARS
```

不要 push GitHub，不要合并 main。

请基于当前 V0.76 本地状态，创建或切换到分支：

```text
ai/gemini-v077-right-rail-habitat
```

请先阅读任务文件：

```text
docs/ai-tasks/TASK-006-v077-right-rail-and-habitat-polish.md
```

这次是 V0.77 的窄范围修复，只解决右侧栏和 Habitat 卡片问题，不要重新设计整个 dashboard。

用户最新截图指出三个问题：

1. `QUICK ACTIONS` 区块仍然很糟糕，文字被裁切，而且功能意义不强。请直接从右侧栏删除它。
2. 右侧 mode 选项栏仍然只有色块，没有文字。必须让 `BRIDGE / HABITAT / POWER / MEMORY / ACTIONS` 这些标签在 inactive 和 active 状态下都清楚可见。
3. Habitat 页房间卡片仍然有重色、字体和可读性问题，尤其是黑色圆形百分比、橙色/青色/灰色卡片文字、`SLEEP QUARTERS` 和 `NOMINAL-03` 这类文本布局。

具体要求：

- 删除右下角 `QUICK ACTIONS` 面板。
- 可以移除它对应的 UI 和未使用 CSS，但不要删除底层 scene/action 函数，除非确认没有任何地方引用。
- 右侧 mode rail 不要再出现“色块在但字没了”。
- 不要只改 `color`，要检查文字是否被 `justify-content`、`overflow`、宽度、z-index 或父容器裁切推出可视区域。
- 如果 `LcarsElement` 的通用样式和右栏冲突，可以给右栏单独写更明确的结构，比如内部加 `.right-menu-label`，或者右栏专用 button。
- active 状态只改变配色和对比度，不改变尺寸。
- 右栏标签可以居中或左对齐，优先保证可见、稳定、像 LCARS 控制块。

Habitat 卡片要求：

- 不要继续大量使用 inline style 控制关键文字颜色。请把 HomeView 的关键排版迁移到 CSS class。
- 房间标题、编号、传感器标签、百分比、温度、湿度、sparkline 标签、meter 标签和值都必须可读。
- 黑色圆形 dial 里的百分比必须是浅色，不能再黑字压在黑圈上。
- 青色/橙色亮色卡片上主要文字用深色。
- 深灰卡片上主要文字用浅色。
- `SLEEP QUARTERS` 不能丑陋断行；可以改成更适合窄卡片的显示，比如 `SLEEP QTRS`，或者用 CSS 控制为两行但要好看。
- `NOMINAL-03` 不要拆成奇怪的竖向断行。
- 温度里的乱码 degree 符号要修掉，可以显示为 `23.6 C`，不要出现 mojibake。
- 不要使用 `.xxx * { color: ... !important }` 这种会污染嵌套内容的通配规则。

必须保留：

- V0.76 左上 elbow 修复。
- V0.75 桌面标题不省略。
- 音频支持。
- 主模式导航。

允许修改：

```text
src/app/App.tsx
src/components/dashboard/HomeView.tsx
src/styles/layout.css
src/styles/responsive.css
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

完成后运行：

```text
npm run build
```

如果通过，可以本地提交：

```text
fix(ui): polish V0.77 right rail and habitat cards
```

不要 push。完成后告诉我 commit hash 和修改文件，并确认：

- QUICK ACTIONS 已删除
- 右侧 mode rail 标签可见
- Habitat 卡片文字和颜色可读
- 黑色 dial 里的百分比可见
- 没有破坏 V0.76 左上 elbow
