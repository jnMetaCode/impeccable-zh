# iOS 平台

适用于发布到 Apple 硬件的原生 iOS / iPadOS 应用：SwiftUI、UIKit、React Native、Expo、Flutter。

在原生平台上，访客模式会限制表达可以覆盖的范围。所有模式的结构、导航和交互均由 HIG 一致性约束；品牌只在平台开放的层面表达，如 tint、字体、动效和内容。

## iOS 粗糙感测试

熟练的 iPhone 用户会信任这个应用，还是会因不合规范的控件停顿？典型迹象是“从网站移植”：重新发明的导航栏、自定义返回手势、Web 形态按钮、依赖 hover 的可供性。默认使用平台组件；只有用户会感谢的理由才值得偏离。

## 布局与结构

- **安全区域。** 在 safe-area inset 内布局。控件不得位于刘海、灵动岛、Home 指示条或圆角下方。 <!-- rule:ios-layout-safe-area -->
- **系统导航。** 2～5 个顶级区块使用 tab bar（只能是区块，不能是操作），层级使用 navigation stack，独立任务使用 sheet。不要自定义全局导航或混用隐喻。 <!-- rule:ios-layout-standard-navigation -->
- **保留边缘右滑返回。** 左边缘返回是肌肉记忆，绝不能禁用或覆盖。 <!-- rule:ios-layout-edge-swipe-back -->
- 顶级页面使用 **Large Title**，滚动时折叠为 inline；深层详情页保持 inline。 <!-- rule:ios-layout-large-titles -->

## 触控目标

- 每个可点击控件至少 **44×44 pt**，相邻目标之间留出空间。 <!-- rule:ios-touch-target-44pt -->

## 排版

- **Dynamic Type。** 使用系统文字样式（从 Large Title 到 Caption），让文字跟随用户阅读字号。不要硬编码 point 尺寸。 <!-- rule:ios-typo-dynamic-type -->
- **San Francisco 承载界面。** 正文、标签和控件使用 SF Pro / SF Compact；品牌字体可以出现在展示时刻。 <!-- rule:ios-typo-system-font -->
- 下限为 **11 pt**；Body 为 17 pt。 <!-- rule:ios-typo-minimum-size -->

## 色彩与材质

- 使用**语义系统色**（label、secondaryLabel、systemBackground、separator、tint），它们会自动适配深色模式和增强对比度；原始 hex 会破坏适配。 <!-- rule:ios-color-semantic-system -->
- **深色模式是一等外观。** 同时设计和测试两种模式。 <!-- rule:ios-color-dark-mode -->
- 用**一种 tint 色**驱动交互元素；它不负责装饰。 <!-- rule:ios-color-single-tint -->
- bar 和 sheet 后方的模糊与透明使用**系统 material**；不要自制玻璃拟态。 <!-- rule:ios-color-system-materials -->

## 组件与控件

- 使用**平台控件**：switch、segmented control、stepper、系统 picker、action sheet、alert、context menu、swipe action。为追求风格而重新发明它们，是最常见的原生粗糙感。 <!-- rule:ios-components-native-controls -->
- 图标使用 **SF Symbols**：基线对齐、支持 Dynamic Type，并使用字重和尺寸变体。不要混入 Web 图标集。 <!-- rule:ios-components-sf-symbols -->
- **谨慎使用模态。** 可关闭的聚焦子任务使用 sheet，沉浸体验使用 full-screen cover。明确提供 Cancel/Done；除非需要防止数据丢失，否则允许下滑关闭。 <!-- rule:ios-components-modality -->
- 设置类内容使用 **grouped/inset list**，不要自制卡片堆。 <!-- rule:ios-components-grouped-lists -->

## 动效

- 使用**系统转换**。Push 滑入、sheet 上升、关闭时反向播放。与导航模型冲突的自定义转换会使用户迷失。 <!-- rule:ios-motion-system-transitions -->
- **遵循 Reduce Motion。** 用交叉淡化替代视差和大幅滑动。 <!-- rule:ios-motion-reduce-motion -->

## 验证构建

- **截图必须来自 Simulator，绝不能来自浏览器。** 构建运行后使用 `xcrun simctl io booted screenshot <path>`；同时运行多个设备时，把 `booted` 换成 `xcrun simctl list devices booted` 中目标设备的 UDID。显示名称可能重复，UDID 不会。覆盖应用发布的每类设备，至少一台 iPhone；若支持 iPad，再覆盖一台 iPad，并把文件写到评审流程指定位置。 <!-- rule:ios-verify-simulator-capture -->
- **深色模式和 Dynamic Type 必须纳入验证。** `xcrun simctl ui booted appearance dark` 切换外观；多个设备启动时继续使用截图设备的 UDID。用较大 Dynamic Type 检查可发现固定布局隐藏的截断。 <!-- rule:ios-verify-appearance-and-type -->
- **模拟器提供广度；姿态、手势和性能需要真机。** 明确说明证据来自哪一种设备。 <!-- rule:ios-verify-hardware-honesty -->
