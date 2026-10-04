# Android 平台

适用于发布到 Android 硬件的原生应用：Jetpack Compose、Android Views、React Native、Expo、Flutter。

在原生平台上，访客模式会限制表达可以覆盖的范围。所有模式的结构、导航和交互均由 Material Design 3 约束；品牌通过 Material 主题系统表达，包括色彩角色、字阶、形状和动效。一个同时发布到 iPhone、处处使用 Material 的跨平台应用，仍必须在 Apple 硬件上满足 iOS 保证：安全区域 inset、Reduce Motion 和边缘右滑返回。

## Android 粗糙感测试

熟练 Android 用户会信任这个应用，还是会被不合规范的组件绊住？最常见迹象是披着 Android 外皮的 iOS 应用：从 iPhone 照搬的底部导航、忽略系统 Back 手势的返回箭头、Cupertino 形态的 switch 和 dialog。Material 3 是规则手册；遵循其组件，并通过主题表达品牌。

## 布局与结构

- **按尺寸匹配 Material 导航。** 紧凑宽度使用 navigation bar（底部，3～5 个目的地）；扩展宽度使用 navigation rail 或 drawer。绝不要把手机底栏原样放到平板上。 <!-- rule:android-layout-adaptive-nav -->
- **系统 Back 始终有效。** 遵循 predictive Back 手势和 Back 按钮；绝不能困住用户或劫持手势。 <!-- rule:android-layout-system-back -->
- **全边到边并处理 window inset。** 应用状态栏、导航栏、屏幕开孔和 IME inset，避免内容被系统栏或键盘遮挡。 <!-- rule:android-layout-window-insets -->
- 用 **top app bar** 提供页面上下文；页面只有一个主要操作时搭配 FAB。 <!-- rule:android-layout-top-app-bar -->

## 触控目标

- 每个触控目标至少 **48×48 dp**，相邻目标至少间隔 8 dp。 <!-- rule:android-touch-target-48dp -->

## 排版

- 使用 **Material 字阶**：Display、Headline、Title、Body、Label，每种均有 large/medium/small。把文字映射到角色，绝不要逐页挑选字号。 <!-- rule:android-typo-type-scale -->
- **Roboto 是系统字体**；通过字阶引入品牌字体，同时保持正文、标签和控件清晰一致。 <!-- rule:android-typo-system-font -->
- 使用 **sp 单位，绝不用固定 px**，让文字跟随系统字号设置。 <!-- rule:android-typo-scalable-sp -->

## 色彩与主题

- 使用 **Material 色彩角色**（primary、on-primary、surface、surface-variant、secondary-container、outline、error）。角色 token 会自动解析浅色、深色和对比度变体；原始 hex 会破坏它们。 <!-- rule:android-color-role-tokens -->
- 合适时使用 **Dynamic Color（Material You）**：Android 12+ 从用户壁纸生成方案，并提供静态回退。 <!-- rule:android-color-dynamic-color -->
- **深色主题是一等方案。** 独立设计和测试，绝不能快速反色。 <!-- rule:android-color-dark-theme -->
- 使用**色调层级**。通过标准表面色调层级表达高度，必要时配合阴影；不要随意使用投影。 <!-- rule:android-color-tonal-elevation -->

## 组件与动效

- 使用 **Material 组件**：filled/tonal/outlined/text button、FAB、switch、chip、snackbar、bottom sheet、Material dialog、navigation bar/rail/drawer。绝不要移植 iOS 控件或自行发明替代品。 <!-- rule:android-components-material -->
- **一个 FAB 对应一个主要操作。** 不要堆叠 FAB，也不要把它用于次要任务。 <!-- rule:android-components-single-fab -->
- 临时反馈使用 **snackbar**，有用时提供操作；不要用 toast 代替。dialog 只用于必须打断的决策。 <!-- rule:android-components-snackbar -->
- 使用 **Material 动效模式**：container transform、shared-axis、fade-through，以及标准缓动和时长；系统开启 Remove animations 时改用交叉淡化或立即切换。 <!-- rule:android-motion-material-and-reduce -->

## 验证构建

- **截图必须来自模拟器或连接设备，绝不能来自浏览器。** 构建安装后使用 `adb exec-out screencap -p > <path>`；连接多个设备时使用 `adb -s <serial>` 选择目标。覆盖应用发布的每类设备，至少一台手机；若支持平板，再覆盖一台平板，并把文件写到评审流程指定位置。 <!-- rule:android-verify-emulator-capture -->
- **深色主题和字体缩放必须纳入验证。** `adb shell cmd uimode night yes` 切换主题；`adb shell settings put system font_scale 1.3` 可发现固定布局隐藏的标签裁切，完成后恢复 `1.0`。连接多个目标时，这些命令也要加截图设备的 `-s <serial>`。 <!-- rule:android-verify-theme-and-scale -->
- **模拟器提供广度；手势、刷新率和性能需要真机。** 明确说明证据来自哪一种设备。 <!-- rule:android-verify-hardware-honesty -->
