# Titan.DS / meWho 风格拆解

来源：
- 用户提供的 Titan.DS 截图与 CSS 文件：`C:\Users\user\Desktop\LCARS CSS`
- 参考站点：https://www.mewho.com/titan/

说明：Titan.DS 的图形、音频、字体打包资源和 Star Trek 相关视觉元素大概率受版权或商标约束。LCARS Cloud V0 应学习其交互结构、动效语言和信息密度，而不是把整站资源原封不动复制进项目。

## 关键判断

Titan.DS 不是常规 dashboard。它更像一个超大 SVG 舞台：

- 主界面是一套固定比例的大画布，当前页面通过 viewBox、scale、translate 做屏幕适配。
- CSS 通过 `html[data-*]` 状态驱动界面，例如 `data-red-alert`、`data-active-module`、`data-display-zoom`、`data-ui-soft-glow`。
- 动画主要由 CSS 完成，JS 负责切换状态、随机数据、模块懒加载和音效触发。
- 视觉上故意保持极高信息密度：数字块、刻度、伪遥测数据、状态灯、长条分区、底部和侧边控制列。
- 流畅感来自大量轻微异步动画，而不是大幅页面转场。

## 色彩系统

核心调色板可以抽象为：

- 背景：纯黑或近黑。
- 结构灰：`#1E2229`、`#2F3749`、`#52596E`、`#6D748C`、`#9EA5BA`、`#DFE1E8`。
- 警示橙红：`#EF1D10`、`#E7442A`、`#FF6753`、`#FF977B`、`#FCC59D`。
- 系统青蓝：`#002241`、`#1C3C55`、`#2A7193`、`#37A6D1`、`#67CAF0`、`#93E1FF`。

V0 不应只做橙黑。建议按功能分区：

- 舰桥/总览：灰 + 青蓝
- 能源/警报：橙红
- AI/记忆：青蓝 + 淡灰
- 家庭/环境：蓝绿少量引入
- 危险状态：红色动画层，而不是整页变红

## 字体与排版

Titan.DS 使用 Antonio 字体，窄体、硬朗、数字感强。V0 可用：

- 首选：Antonio
- 备选：Arial Narrow、Roboto Condensed、system sans-serif

排版特征：

- 大写英文很多。
- 数字块密集。
- 字距略紧。
- 小标签非常多，但不解释功能。
- 标题是“系统状态文本”，不是营销文案。

V0 中文界面建议用中文短词，不要长句：

- `主控`
- `环境`
- `能源`
- `记忆`
- `场景`
- `指令`
- `在线`
- `待机`

## 布局语法

可抽象成四层：

1. 外框层：巨大圆角 LCARS 骨架、左右侧栏、底部控制条。
2. 模块层：主显示区根据模式切换，类似 Map / DNA / WarpDrive。
3. 遥测层：数字、刻度、进度条、闪烁灯、滚动列表。
4. 状态层：红色警报、软发光、灰阶、缩放、全屏等全局模式。

V0 页面不必复制星舰图，而是把家庭中枢映射进去：

- 主显示区：住宅/房间状态图或“个人舰桥”。
- 左侧栏：系统快捷按钮与纵向状态条。
- 右侧栏：模块切换和当前指令栈。
- 底部栏：实时遥测、场景按钮、AI 运行状态。

## 动效语言

CSS 分析结果：

| 文件 | Keyframes | Animation 声明 | Transform 声明 |
| --- | ---: | ---: | ---: |
| `main-DbO-AsTm.css` | 33 | 184 | 149 |
| `starbase_css-D22QedUJ.css` | 31 | 199 | 89 |
| `warpdrive_css-BFQyqVPk.css` | 43 | 199 | 110 |
| `dna_css-DUPnJR0o.css` | 24 | 167 | 88 |
| `mod_ships_css-CHRd6zbO.css` | 18 | 148 | 94 |

V0 应实现这些基础动效 primitive：

- `blink-soft`：低频透明度闪烁，用于状态灯。
- `blink-hard`：警报/确认反馈。
- `dash-flow`：虚线/条形流动，用于数据流。
- `meter-random`：小条块高低变化，制造系统活性。
- `panel-enter`：模块面板轻微 scale + opacity 进入。
- `scan-line`：横向/纵向扫描线。
- `soft-glow`：可选滤镜模式，不默认常开。
- `red-alert`：全局警报状态，改变局部布局和色彩。

重要原则：大量小动画比一个大动画更像 Titan.DS。

## 状态模型

V0 可以学习它的 `data-*` 状态机，但用 React state 管理：

- `mode`: `bridge | home | energy | memory | map`
- `alert`: `normal | caution | red`
- `display`: `full | left | right | zoom`
- `visual`: `default | softGlow | grayscale | dim`
- `audio`: `on | off`

DOM 层仍可把状态同步到根节点：

```tsx
<main
  className="lcars-shell"
  data-mode={mode}
  data-alert={alert}
  data-visual={visual}
>
```

## 资源策略

从站点资源索引看，Titan.DS 主要资源包括：

- 主 JS：`main-B3gZ5tdv.js`
- 懒加载模块：DNA、APOD、SF47、Starbase、Enterprise、WarpDrive、Map、Snowflakes
- 字体：Antonio woff2
- 音频：beep、red alert、powering up/down、ambient bg
- 图片：starbase、galaxy、map emblems 等 WebP/PNG

LCARS Cloud V0 的策略：

- 不直接复制整站资源。
- 字体使用可合法引入的 Antonio 或本地等价字体。
- 图标用自制 CSS/SVG primitive。
- 音效先用 Web Audio API 合成 beep、confirm、alert，不用原站 mp3。
- 星舰/星图改成家庭/系统抽象图，避免直接使用 Star Trek 版权图形。

## V0 可借鉴但需原创化的点

- 超宽控制台感。
- 左右侧栏和底部遥测栏常驻。
- 模块切换时主画面变化，边框和控制条保持连续。
- 用随机数字/灯点制造“系统正在运行”的生命感。
- 红色警报不是弹窗，而是全局状态。
- 截图里的主视觉很艺术，但 V0 需要服务于“家庭智能中枢”的可读性。

