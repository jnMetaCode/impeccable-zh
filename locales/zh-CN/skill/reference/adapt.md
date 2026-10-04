> **还需要补充的上下文**：目标平台、设备和使用情境。

把已有设计适配到不同情境：其他屏幕尺寸、设备、平台或用途。陷阱是把适配当作缩放；真正的任务是为新情境重新思考体验。

**仅适用于 Web**，包括移动 Web。原生平台（`ios` / `android` / `adaptive`）应改用 [adapt.native.md](adapt.native.md)；项目为原生应用时立即切换。

---

## 评估适配挑战

理解为什么适配以及需要适配什么：

1. **识别来源情境**：原本为桌面 Web 还是移动应用设计？依赖大屏、鼠标或高速网络等哪些假设？哪些部分在当前情境表现良好？
2. **理解目标情境**：
   - **设备**：手机、平板、桌面、电视、手表还是打印？
   - **输入方式**：触控、鼠标、键盘、语音还是手柄？
   - **屏幕约束**：尺寸、分辨率、方向？
   - **连接**：高速 Wi-Fi、慢速 3G、离线？
   - **使用情境**：移动中还是桌前，快速扫视还是专注阅读？
   - **用户预期**：用户对该平台有何惯例预期？
3. **识别挑战**：哪些内容、导航或功能放不下？哪些 hover、微小触控目标无法工作？哪些模式不适合目标平台？

**关键要求**：适配是为新情境重新思考体验，不是缩放像素。

## 规划适配策略

### 移动端适配（桌面 → 移动）

**布局策略**：多栏改为单栏；并排改为垂直堆叠；固定宽度改为全宽；顶部/侧边导航改为底部导航。

**交互策略**：触控目标至少 44×44px，不依赖 hover；适当使用滑动手势；dropdown 改为 bottom sheet；控件置于拇指可达范围；扩大点击区域和间距。

**内容策略**：使用渐进披露；优先主要内容，次要内容放入 tab/accordion；文案更精简；正文至少 16px。

**导航策略**：使用汉堡菜单或底部导航；降低导航复杂度；用 sticky header 保持上下文；在导航流程中提供返回按钮。

### 平板适配（混合方式）

**布局策略**：使用两栏而不是单栏或三栏；次要内容放侧面板；使用 master-detail；根据横竖屏自适应。

**交互策略**：同时支持触控和 pointer；触控目标仍为 44×44px，但可比手机更密集；使用侧边导航 drawer；适合时采用多列表单。

### 桌面适配（移动 → 桌面）

**布局策略**：使用多栏和水平空间；侧边导航持续可见；同时展示多个信息面板；设置 max-width，不能无限拉伸到 4K。

**交互策略**：用 hover 提供补充信息；支持键盘快捷键、右键菜单、有意义的拖放，以及 Shift/Cmd 多选。

**内容策略**：提前展示更多信息，减少渐进披露；使用多列数据表、丰富可视化和更详细说明。

### 打印适配（屏幕 → 打印）

**布局策略**：在合理位置分页；移除导航、页脚和交互元素；使用黑白或有限色彩；为装订保留适当边距。

**内容策略**：展开缩略内容，显示完整 URL 和隐藏区块；添加页码、页眉、页脚和打印日期、页面标题等元数据；把图表转换为打印友好版本。

### 邮件适配（Web → 邮件）

**布局策略**：最大宽度 600px；只用单栏；内联 CSS；为邮件客户端兼容性使用 table 布局。

**交互策略**：使用大而明确的 CTA 按钮，不用文字链接；不依赖 hover；复杂交互深链到 Web 应用。

## 实现适配

### 响应式断点

可使用：移动端 320～767px；平板 768～1023px；桌面 1024px 以上；或在设计实际损坏的位置使用内容驱动断点。

### 布局适配技术

- **CSS Grid/Flexbox**：自动重流布局
- **Container Query**：按容器而不是视口适配
- **`clamp()`**：在最小和最大值之间流式调整
- **Media query**：为不同情境提供样式
- **Display 属性**：按情境显示或隐藏元素

### 触控适配

- 触控目标至少 44×44px
- 增加交互元素间距
- 删除依赖 hover 的交互
- 添加 ripple、highlight 等触控反馈
- 考虑拇指区域，屏幕底部通常比顶部容易触达

### 内容适配

- 谨慎使用 `display: none`，内容仍会下载
- 渐进增强，先提供核心内容，大屏再增强
- 视口外内容延迟加载
- 使用响应式图片（`srcset`、`picture`）

### 导航适配

- 移动端把复杂导航转换为汉堡菜单/drawer
- 移动应用使用底部导航
- 桌面端保持侧边导航
- 小屏使用 breadcrumb 保持上下文

**重要要求**：在真机上测试。DevTools 设备模拟有帮助，但并不完整。

**绝对不要**：
- 在移动端隐藏核心功能，重要功能必须可用
- 假设桌面设备一定强大，也要考虑无障碍和旧机器
- 在不同情境使用不同信息架构，避免混乱
- 打破平台用户预期
- 忘记移动端和平板横屏
- 盲目使用通用断点，应由内容驱动
- 忽略桌面触控，许多桌面设备支持触摸

## 验证适配

- **真机**：真实手机、平板、桌面
- **不同方向**：竖屏与横屏
- **不同浏览器**：Safari、Chrome、Firefox、Edge
- **不同系统**：iOS、Android、Windows、macOS
- **不同输入**：触控、鼠标、键盘
- **极端情况**：320px 小屏和 4K 大屏
- **慢速连接**：受限网络测试

**自定义控件**（slider、拖动区域、可滚动控件条）：before/after slider 可能通过所有宽度检查，却无法在 iOS 拖动；因此应在同一批检查中实际操作每个范围内控件：

- **主要手势**：点击并确认响应，再用目标输入方式拖动；拖动必须完成，不能只开始。
- **跨控件滚动**：沿页面滚动轴划过控件时，应滚动页面或容器而不激活控件；沿控件自身轴开始拖动时，应移动控件而不是页面。两种失败都不会报错，必须都测试。
- **证据**：说明证据来自模拟视口、浏览器工具合成触控、哪个浏览器引擎，或真机。截图和调整视口只能证明布局，不能证明手势。点明未测试内容后继续；无法获得硬件是需要报告的缺口，不是阻塞。

适配在每种情境下都显得自然后，交给 `{{command_prefix}}impeccable polish` 完成最终精修。

---

## 参考资料

以下内容原为 `responsive-design.md`，现内联到 adapt 流程中，集中提供深度响应式参考。

### 响应式设计

#### 正确使用移动优先

从移动端基础样式开始，用 `min-width` query 逐层增加复杂度。桌面优先的 `max-width` 会让移动端先加载不必要样式。

#### 由内容驱动断点

不要追逐设备尺寸；让内容说明何时需要断点。从窄屏开始，拉伸到设计损坏的位置再添加断点。通常三个断点足够（640、768、1024px）。流式值使用 `clamp()`，无需额外断点。

#### 检测输入方式，而不只是屏幕尺寸

**屏幕尺寸无法说明输入方式。** 笔记本可能有触屏，平板可能连接键盘。使用 pointer 和 hover query：

```css
/* Fine pointer (mouse, trackpad) */
@media (pointer: fine) {
  .button { padding: 8px 16px; }
}

/* Coarse pointer (touch, stylus) */
@media (pointer: coarse) {
  .button { padding: 12px 20px; }  /* Larger touch target */
}

/* Device supports hover */
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}

/* Device doesn't support hover (touch) */
@media (hover: none) {
  .card { /* No hover state - use active instead */ }
}
```

**关键要求**：绝不能让功能依赖 hover，触控用户无法 hover。

#### 安全区域：处理刘海

现代手机有刘海、圆角和 Home 指示条。使用 `env()`：

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* With fallback */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

在 meta tag 中**启用 viewport-fit**：
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

#### 正确使用响应式图片

##### 带宽度描述符的 srcset

```html
<img
  src="hero-800.jpg"
  srcset="
    hero-400.jpg 400w,
    hero-800.jpg 800w,
    hero-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Hero image"
>
```

工作方式：`srcset` 列出图片真实宽度，`sizes` 告诉浏览器显示宽度，浏览器结合视口宽度和设备像素比选择最佳文件。

##### 使用 Picture 元素实现艺术指导

需要不同裁剪/构图，而不仅是不同分辨率时：

```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
```

#### 布局适配模式

**导航**：移动端为汉堡菜单 + drawer，平板为紧凑横向，桌面为完整带标签导航。**表格**：移动端使用 `display: block` 和 `data-label` 转换为卡片。**渐进披露**：可折叠内容使用 `<details>/<summary>`。

#### 测试：不要只相信 DevTools

DevTools 设备模拟适合验证布局，但无法覆盖真实触控、CPU/内存约束、网络延迟模式、字体渲染差异和浏览器 chrome/键盘表现。

**至少测试**：一台真实 iPhone、一台真实 Android；相关时再加一台平板。廉价 Android 能暴露模拟器永远看不到的性能问题。

---

**避免**：桌面优先设计；用设备检测代替能力检测；维护独立移动/桌面代码库；忽略平板和横屏；假设所有移动设备性能强劲。
