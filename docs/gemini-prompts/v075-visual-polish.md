# Gemini Prompt: V0.75 Visual Regression Polish

请在这个本地仓库工作，不要 push GitHub：

```text
C:\Users\user\Documents\LCARS
```

请基于当前 V0.7 实现分支创建本地修复分支：

```text
ai/gemini-v075-visual-polish
```

这次是 V0.75 的视觉回归修复，不是新增功能。请严格先阅读并执行：

```text
docs/ai-tasks/TASK-004-v075-visual-regression-polish.md
docs/v0.75-screenshot-regression-analysis.md
```

这次除了原有问题，还要额外检查一个新的阻塞问题：

1. 右侧栏不能再出现“色块还在，但文字消失了”的情况。现在用户截图里右栏菜单和右下快捷操作区出现了空白化/不可读问题。
2. 不要只看布局尺寸，要同时检查文字颜色、继承链、overflow、active state、亮色底和暗色字的组合是否正确。
3. 重点排查是否有过宽的通配规则把嵌套面板文字颜色统一改坏，比如亮色 bracket 内部的深色小卡片、右侧菜单文字、快捷操作按钮文字。
4. 修复后右栏必须满足：
   - 菜单项文字始终可见
   - active 只改变配色，不改变尺寸
   - 各项高度一致
   - `RED ALERT` / `RESUME NORMAL` / `CINEMA MODE` 不裁切、不消失

需要彻底解决这些截图问题：

1. log / event 字体角色不统一，窄面板里一句话被折成很多竖行。
2. Energy / Power 页的核心图意不明，像一个黑洞。
3. 青色、橙色、灰色面板上的文字对比度不够。
4. 左上角 LCARS elbow 缺块，不连续。
5. 右上标题不能再显示省略号，不能再出现 `LCARS CLOUD T...` 或 `COMMAND MOD...`。
6. 右侧菜单栏和快捷操作栏在不同状态下尺寸、对齐、可读性都要稳定。

约束：

- 不要 push GitHub
- 不要合并 main
- 不要改 `package.json`、Vite、TS 配置
- 不要新增外部依赖
- 不要重新引入命令输入框交互
- 不要删除音频支持

允许修改：

```text
src/app/App.tsx
src/app/modes.ts
src/components/dashboard/*
src/components/lcars/*
src/styles/*.css
docs/dev-log.md
```

完成后运行：

```text
npm run build
```

如果构建通过，可以本地提交：

```text
fix(ui): polish V0.75 visual regressions
```

但不要 push。完成后告诉我 commit hash 和修改文件，我会让 Codex 做审查。
