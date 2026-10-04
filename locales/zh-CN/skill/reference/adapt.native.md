> **还需要补充的上下文**：目标平台、设备和使用情境。

将已有的**原生**设计（`ios` / `android` / `adaptive`）适配到不同情境：其他设备类别、方向、平台或来源。常见陷阱是把适配理解为缩放。真正的任务是在 [ios.md](ios.md) / [android.md](android.md) 的平台惯例内，为新情境重新思考体验；如果 Setup 尚未读取目标平台参考，规划前先读取。

## 评估适配挑战

1. **来源情境**：原设计面向什么，又依赖哪些假设？仅手机、仅竖屏、某个平台惯例，还是网站？
2. **目标情境**：设备类别（手机、平板、折叠屏）、方向、平台和使用姿势是什么（移动中单手，还是静止时双手）？
3. **哪里会失效**：导航是否不适合目标平台？布局是否只被拉伸而未重构？是否使用目标平台不存在的手势或控件？

## 适配策略

### 手机 → 平板（iPad / 大屏）

- **重构，不要拉伸。** 放大的手机界面是平板适配的失败形态。使用 size classes（iOS）或 window size classes（Android）切换结构。
- **导航改变形态**：iPad 上 tab bar 可保留或变为侧栏；Android navigation bar 在扩展宽度下变为 rail 或 drawer。
- **利用宽度**：使用 split view / master-detail（列表与详情并排）、多列网格；手机上的 sheet 可改为 popover。
- **多任务是一种尺寸，不是边缘情况**：iPad Split View 和 Android 多窗口可能在平板上提供手机宽度窗口；由 size class 驱动的布局可以自然处理两者。

### 方向与折叠屏

- 横屏应重构为并排窗格或重新定位控件，绝不能裁切或加黑边。只有任务确实要求时才锁定方向。
- 折叠屏（Android）：通过 window size classes 响应姿态和铰链；测试折叠、展开和桌面式姿态。

### 平台 → 平台（iOS ↔ Android）

翻译惯例，绝不要直接移植：

| iOS | Android |
|---|---|
| Tab bar | Navigation bar / rail / drawer |
| 边缘右滑返回、返回箭头 | Predictive Back 手势 / 按钮 |
| Switch、segmented control、系统 picker | Material switch、chips、Material picker |
| Action sheet | Bottom sheet / Material dialog |
| SF Symbols、SF Pro、Dynamic Type | Material Symbols、Roboto、sp 缩放 |
| 语义系统色、materials | Material 色彩角色、色调层级 |
| 系统 push/sheet 转换 | Container transform、shared-axis、fade-through |

用目标平台的语言重建导航和控件；通过目标平台主题系统延续品牌表达层，包括色板意图、字体强调和动效个性。

### Web → 原生（移植网站或 Web 应用）

重新遵循平台，而不是只重排。把 Web 导航换成平台导航模型，把 HTML 形态控件换成平台控件，把依赖 hover 的可供性换成触控优先方案，并把 px 字体换成 Dynamic Type / sp。然后按完整平台参考处理结果；其中的 slop test 就是验收标准。

## 实现与验证

- 让结构由 **size classes / window size classes** 驱动，绝不要检测设备型号。
- 在每种新配置中尊重安全区域和窗口 inset，包括刘海、铰链、状态栏和键盘。
- 先用模拟器覆盖广度，再用真机确认事实：每个发布平台至少一台手机和一台平板，覆盖两个方向，并在支持时测试分屏。

适配结果在每种情境下都像原生体验后，交给 `{{command_prefix}}impeccable polish` 完成最终精修。

**绝对不要**：
- 在平板上发布拉伸后的手机布局
- 把一个平台的控件或导航移植到另一个平台
- 在小设备上隐藏核心功能；重要功能必须可用
- 为逃避布局问题而锁定方向
- 只相信模拟器；姿态、手势和性能需要真机验证
