# Gemini Prompt: V0.7 Style System Cleanup

请在这个仓库工作：

```text
https://github.com/wolf359-ncc-1701/LCARS-CloudTerminal
```

请先拉取最新 `main`，然后创建并切换到分支：

```text
ai/gemini-v07-style-system
```

这次你只负责前端实现，不负责架构设计、需求扩展、资源策略和最终合并。

请严格阅读并执行：

```text
docs/ai-tasks/TASK-003-v07-style-system-redesign.md
docs/v0.7-reference-analysis.md
docs/style-roadmap-v05-v09.md
```

V0.7 的目标不是继续堆功能，而是把视觉规范收敛出来：

- 修复字体不统一的问题。
- 把方方的 tabs 和 cards 改成更 LCARS 的圆角、胶囊、elbow、segment 形态。
- 修复右上标题超出、遮挡、和选项卡重叠的问题。
- 修复重色导致看不清的问题。
- 把 `COMMAND` 模式改成 `ACTIONS` 或等价的直接动作面板。
- 不要再做命令行输入框，不要让用户输入命令后再 Execute。
- 使用项目内的音频文件做点击、确认、警报、处理、滚动、资料访问等响应音。
- 根据用户 PPT/视频参考更新动画库，但不要把界面改成和 PPT 一模一样。

重点要求：

1. 用户面对的 `COMMAND` 必须消失，改成直接点击的 Action Matrix。
2. 顶部 tabs 必须重新设计，不能继续是普通方块选项卡。
3. 右上标题必须有安全区，不能再和右侧模块栈或 tab strip 重叠。
4. 字体要用角色类管理，例如 `.type-display-title`、`.type-module-label`、`.type-numeric`。
5. 音频必须尊重 `audioEnabled`，不能自动播放，不能 hover 乱响。
6. 不要引入外部 CDN，不要新增大型 UI 框架，不要改 package.json，除非绝对必要并解释。

允许重点修改：

```text
src/app/App.tsx
src/app/modes.ts
src/components/lcars/*
src/components/dashboard/*
src/hooks/useSynthAudio.ts
src/hooks/usePersistentSettings.ts
src/styles/*.css
src/data/mock.ts
docs/dev-log.md
```

完成后请运行：

```text
npm run build
```

如果构建通过，请提交：

```text
feat(ui): implement V0.7 LCARS style system cleanup
```

然后推送分支 `ai/gemini-v07-style-system`。不要合并到 `main`。完成后告诉我 commit hash 和你改了哪些文件，我会让 Codex 审查。
