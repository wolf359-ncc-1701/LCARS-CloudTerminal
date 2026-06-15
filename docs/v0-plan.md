# LCARS Cloud Terminal V0 计划

目标：做出一个可运行的静态原型，验证 “LCARS 舰桥界面 + meWho/Titan.DS 式高密度动效 + 个人智能中枢” 是否成立。

V0 不接真实设备、不做账号、不做云部署、不集成语音模型。所有数据先 mock。

## 体验定义

打开应用后，用户看到的不是 landing page，而是自己的“家庭舰桥”：

- 左侧是常驻 LCARS 控制栏。
- 中间是主显示区：家庭/个人系统总览。
- 右侧是模块切换与指令队列。
- 底部是遥测、场景、AI 状态、系统参数。

首屏应该像一个正在运行的系统，而不是空白 UI。

## 技术栈

- Vite
- React
- TypeScript
- CSS Modules 或普通分层 CSS
- Mock data
- Web Audio API 合成基础音效

暂不引入后端。后续 V1 再接 FastAPI/WebSocket/MQTT。

## 页面模块

### 1. Bridge / 主控

展示：

- 当前时间
- 系统在线状态
- 房间摘要
- AI 状态
- 今日事件
- 4 个场景按钮：`观影`、`睡眠`、`离家`、`回家`

这是默认首页。

### 2. Home / 房间

展示：

- 客厅、卧室、工作区、入口
- 每个房间有温度、湿度、灯光、运动状态
- 伪设备列表：灯、空调、窗帘、电视、插座

交互：

- 点击房间切换主显示焦点
- 点击设备改变 mock 状态

### 3. Energy / 能源

展示：

- 今日功耗
- 插座负载
- 空调/照明占比
- 类 Titan.DS 的条形遥测和流动线

### 4. Memory / 记忆与日志

展示：

- 系统日志
- AI 建议
- 最近场景执行
- 用户偏好片段

这一块承接 meWho 的“个人 AI 中枢”感觉。

### 5. Command / 指令

展示：

- 命令输入框
- 最近指令
- 解析结果

V0 只做本地规则：

- `观影模式`
- `睡眠模式`
- `打开客厅灯`
- `关闭所有灯`
- `红色警报`
- `恢复正常`

## 组件清单

- `LcarsShell`
- `LcarsSidebar`
- `LcarsTopRail`
- `LcarsBottomTelemetry`
- `LcarsButton`
- `LcarsSegment`
- `LcarsMeter`
- `LcarsStatusDots`
- `LcarsPanel`
- `CommandConsole`
- `RoomMap`
- `EventLog`
- `SystemDiagram`

## CSS 架构

建议文件：

- `src/styles/tokens.css`：颜色、字体、间距、动画时间
- `src/styles/lcars.css`：LCARS 基础形状
- `src/styles/animations.css`：动效 primitive
- `src/styles/layout.css`：整体布局
- `src/styles/responsive.css`：手机/平板适配

根节点状态：

```html
<main data-mode="bridge" data-alert="normal" data-visual="default">
```

核心动画：

- `blink-soft`
- `blink-hard`
- `dash-flow`
- `meter-pulse`
- `scan-line`
- `panel-enter`
- `red-alert-bars`
- `ambient-shift`

## Mock 数据

建议文件：

- `src/data/rooms.ts`
- `src/data/devices.ts`
- `src/data/events.ts`
- `src/data/scenes.ts`
- `src/data/telemetry.ts`

数据每 1-3 秒轻微变化：

- 温度小幅波动
- 湿度小幅波动
- 状态灯随机闪烁
- 遥测条随机变化
- 日志偶尔新增一条 mock event

## V0 交付标准

- 桌面端第一屏完整，视觉上接近 Titan.DS 的系统密度。
- 手机端能用，不要求完全复刻超宽布局。
- 所有按钮都有 hover/active 状态。
- 模块切换有平滑动效。
- 红色警报可开启/关闭。
- 有基础 beep/alert 合成音效，可静音。
- 没有真实网络依赖。

## 后续演进

V1：FastAPI + WebSocket + SQLite + mock 设备 API  
V2：接 Home Assistant / MQTT  
V3：语音识别和 TTS  
V4：PWA、远程访问、权限、备份

## 从 meWho 开发日志吸收的路线

Titan.DS 的开发日志说明，这类界面的成功不是一次性堆视觉，而是逐步建立“可持续运行的显示系统”。

V0/V1 应优先吸收这些做法：

- 先做可运行的半静态显示，再逐步增加模块。Titan.DS 很多模块都是后续加入，而不是一开始全做完。
- 每个模块都应该有自己的 intro/loading 动画，让模块切换像“系统正在载入子程序”。
- 设置系统很重要。至少预留：音频开关、软发光、灰阶、屏幕边距、动画强度、Auto Mode 开关。
- 做一个内置 User Manual / Info Overlay。不要在主界面写说明文字，但可以用帮助层标出可交互区域。
- Auto Mode 是核心气质：空闲后自动执行轻微随机任务、切换模块、偶发警报，让屏幕像活着。
- 本地自包含很重要。Titan.DS 后面做了 Electron/Wallpaper Engine，说明这类项目天然适合“网页 + 本地应用 + 大屏壁纸”多形态。
- 性能要早考虑。日志里多次提到纯 SVG/CSS/JS 在高分辨率动画下可能吃力，复杂星图/粒子/大面积线动画应考虑 Canvas/WebGL。

V0 因此增加两个明确目标：

1. 建立 `AutoMode` 的最小版本：60 秒无操作后，自动切换一个模块或触发一次遥测动画；任意点击/键盘输入退出。
2. 建立 `SettingsOverlay` 和 `InfoOverlay` 的骨架，即使设置项先很少，也要先把系统形状做出来。
