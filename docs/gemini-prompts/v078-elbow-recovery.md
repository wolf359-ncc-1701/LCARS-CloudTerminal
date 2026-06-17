# V0.78 Gemini 修复指令：恢复左上 LCARS 转角，但保留结构边界

请在这个仓库工作：

`C:\Users\user\Documents\LCARS`

当前问题来自 V0.77 后续补丁：Codex 为了阻止左栏和主舞台互相覆盖，把 `.primary-elbow` 收回到了 `var(--rail)`，同时把主 grid 的桌面列间距改成了 `56px`。这解决了主舞台压进左栏的问题，但副作用是左上角 LCARS 转角被砍断了：顶部灰色横条无法自然跨向主舞台，转角右侧出现硬断裂，视觉不像 Titan DS / PPT 参考里的连续 LCARS elbow。

## 目标

做 V0.78 左上转角恢复：恢复 LCARS 顶部转角的连续视觉，让左上角看起来像一整块下宽右窄的 LCARS 弯管，但不能再次造成左栏、主舞台、品牌块、数字块互相覆盖。

## 必须保留

- 保留 `--rail: 246px`，不要缩窄左栏。
- 保留左栏下面所有模块的正常宽度：`TITAN.LOCAL`、数字块、vertical meter 不允许被压窄、不允许被主舞台遮挡。
- 保留 `.lcars-app` 的结构级列间距思路。左栏和主舞台之间必须有真实黑色安全通道，不要重新用 `.main-stage padding-left` 伪造间距。
- 保留 `DEV V.0.77` 在灰色 elbow 材料内部的位置，不要放回黑色空腔。
- 保留右侧菜单栏、Habitat 卡片、Quick Actions 删除状态，不要修改这些区域。

## 当前失败点

当前代码大致是：

```css
.lcars-app {
  --stage-column-gap: 56px;
  grid-template-columns: var(--rail) minmax(0, 1fr) 278px;
  column-gap: var(--stage-column-gap);
}

.primary-elbow {
  width: var(--rail) !important;
  max-width: var(--rail) !important;
}
```

这会让 elbow 只画在左栏 246px 内部，顶部横向延展被截断，因此截图里转角右侧是断的。

## 推荐实现方案

优先使用“视觉层覆盖，不参与布局”的方案：

1. 保持 `.left-rail` grid column 宽度为 `var(--rail)`。
2. 让 `.primary-elbow` 可以视觉上向右绘制，但不要影响左栏下方元素布局。
3. 可以给 `.primary-elbow` 设置类似：

```css
.primary-elbow {
  width: calc(var(--rail) + 96px) !important;
  max-width: none !important;
  pointer-events: none;
}
```

4. 但是必须配合安全规则：
   - `.left-rail` 保持 `z-index` 高于 `.main-stage`。
   - `.primary-elbow` 只能覆盖顶部转角区域，不能覆盖 `TITAN.LOCAL` 和数字块。
   - `.elbow-dev-label-group` 仍然只能在 `width: var(--rail)` 范围内，不要跟着扩展到右侧。
   - 如果需要防止 elbow 遮挡主舞台控件，可给 `.main-stage` 或 `.mode-strip` 提供更高局部层级，但不要导致 display-window 压住左栏。

可选更稳方案：

- 把 LcarsElbow 的 SVG 宽度扩展，但只让右侧横条绘制到主舞台前方，左侧竖块仍严格对齐 `var(--rail)`。
- 或增加一个单独的 `.elbow-extension` 伪元素，仅绘制顶部灰色延展条，而不改变 elbow SVG 主体宽度。

## 禁止事项

- 不要把 `--rail` 改成 180px、300px 或其他值。
- 不要再加 `.left-rail > *:not(.primary-elbow)` 这种会影响所有左栏子元素的宽度覆盖规则。
- 不要改 `.rail-numbers` 的列数、宽度或文字缩放来掩盖布局问题。
- 不要把 `.display-window` 或 `.main-stage` 绝对定位到左栏上面。
- 不要新增大型布局重构，不要改业务组件，不要改数据结构。
- 不要推送 GitHub。只本地 commit。

## 允许修改文件

- `src/styles/layout.css`
- `src/styles/responsive.css`
- 如确实需要：`src/app/App.tsx`
- 如确实需要修 elbow SVG 参数：`src/components/lcars/LcarsElbow.tsx`
- `docs/dev-log.md`

## 验收标准

- 左上角转角视觉连续，不再像被砍掉一块。
- `DEV V.0.77` 仍在灰色 elbow 材料内部，可读，不与 `BRIDGE` tab 或红色横条重叠。
- `TITAN.LOCAL`、数字块、vertical meter 全部完整显示，宽度稳定。
- 左栏和主舞台之间仍然存在明显黑色安全通道。
- display-window 的左侧圆角/边框不再压进左栏。
- 右侧菜单栏文字仍然可见。
- Habitat 页面 bright/dark 卡片文字仍然可读。
- `npm run build` 必须通过。

## 完成后

请 commit，commit message 使用：

`fix(ui): restore V0.78 left elbow continuity`

不要 push。
