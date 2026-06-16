# Gemini Prompt: V0.75 Visual Regression Polish

请在本地这个仓库工作，不要推送 GitHub：

```text
C:\Users\user\Documents\LCARS
```

请基于当前 V0.7 分支创建本地分支：

```text
ai/gemini-v075-visual-polish
```

这次是 V0.75 修复型视觉迭代，不是新增功能。请严格阅读并执行：

```text
docs/ai-tasks/TASK-004-v075-visual-regression-polish.md
docs/v0.75-screenshot-regression-analysis.md
```

需要彻底解决这些截图问题：

1. 第一、二张：log / event 文字字体不统一，窄面板里一句话被折成很多行，看起来像另一套 UI。请统一字体角色，并做 compact log 样式，避免竖向 word stack。
2. 第三张：Energy / Power 页的核心图意义不明，像一个黑洞。请改成原创的智能家居 power distribution / energy bus diagram，有电源总线、电容/断路器、输出轨、负载门和清晰标签。
3. 第四、五张：青色、橙色、灰色面板上的文字对比度不够，看不清。请严格使用 text-on-cyan / text-on-orange / dark-panel text 规则。
4. 左上角圆角：LCARS elbow 缺了一块。请修成连续圆角骨架，不能被裁切。
5. 右上标题：不能再显示省略号，不能再出现 `LCARS CLOUD T...`、`COMMAND MOD...`。桌面端必须完整显示短标题：`LCARS CLOUD`、`HOME`、`ENERGY`、`MEMORY`、`ACTIONS`。
6. 右侧菜单栏：不同选项下菜单块大小要一致，active 只变颜色不变尺寸。`RESUME NORMAL`、`CINEMA MODE` 不能被裁切。

约束：

- 不要推送 GitHub。
- 不要合并 main。
- 不要改 package.json、Vite、TS 配置。
- 不要新增外部依赖。
- 不要重新引入命令输入框。
- 不要删除音频支持。
- 不要把界面改成和 PPT 一模一样。

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

但不要 push。完成后告诉我 commit hash 和修改文件，我会让 Codex 审查。
