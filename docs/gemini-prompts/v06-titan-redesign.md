# Gemini Prompt: V0.6 Titan DS Visual Redesign

请在这个仓库工作：

```text
https://github.com/wolf359-ncc-1701/LCARS-CloudTerminal
```

这次你只负责前端实现，不负责架构设计、需求扩展、资源策略和最终合并。

请先拉取最新 `main`，然后创建并切换到分支：

```text
ai/gemini-v06-titan-redesign
```

严格阅读并执行：

```text
docs/ai-tasks/TASK-002-v06-titan-ds-visual-redesign.md
```

你的目标是做 V0.6：把当前界面从普通 LCARS-inspired dashboard 提升为更接近 meWho Titan DS 风格的高密度操作台。重点是外框、左侧控制列、右侧模块栈、顶部状态轨、底部遥测条、主显示区 SVG/CSS 图形和大量轻微动效。

请注意分工：

- 你只写前端实现。
- 不要修改包管理器、Vite、TypeScript 配置、GitHub 设置。
- 不要新增后端。
- 不要把所有组件塞回单个 `App.tsx`。
- 不要直接复制 Titan.DS 原站图片、SVG 艺术资产、MP3、JS chunk 或截图。
- 可以参考 Titan DS 的布局语法、CSS 动效思路和界面元素类型，但生产代码要重写成项目自己的组件和 CSS。
- 字体已经放在 `src/assets/fonts/microgramma-d-extended-bold.otf`，CSS family 是 `"LCARS Microgramma"`，请优先用于标题、数字和模块标签。

允许重点修改：

```text
src/app/App.tsx
src/components/lcars/*
src/components/dashboard/*
src/styles/*.css
src/data/mock.ts
```

完成后请运行：

```text
npm run build
```

如果构建通过，请提交：

```text
feat(ui): implement V0.6 Titan DS inspired high-density interface
```

然后推送分支 `ai/gemini-v06-titan-redesign`。不要合并到 `main`。完成后告诉我 commit hash 和你改了哪些文件，我会让 Codex 审查。
