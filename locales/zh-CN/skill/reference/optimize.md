性能是一项功能。找到当前界面的真实瓶颈，修复后再测量。不要优化并不慢的部分。

## 评估性能问题

了解当前性能并识别问题：

1. **测量当前状态**：
   - **Core Web Vitals**：LCP、INP、CLS 分数
   - **加载时间**：可交互时间、首次内容绘制
   - **Bundle 大小**：JavaScript、CSS、图片体积
   - **运行时性能**：帧率、内存和 CPU 使用率
   - **网络**：请求数量、载荷大小、瀑布图

2. **识别瓶颈**：
   - 哪里慢？首次加载、交互还是动画？
   - 原因是什么？大图片、昂贵 JavaScript 还是布局抖动？
   - 严重程度如何？可以感知、令人烦躁还是完全阻塞？
   - 影响谁？全部用户、仅移动端，还是慢速网络用户？

**关键要求**：优化前后都要测量。过早优化会浪费时间，只优化真正重要的问题。

## 优化策略

制定系统化改进计划：

### 加载性能

**优化图片**：
- 使用现代格式（WebP、AVIF）
- 使用正确尺寸，不要为 300px 显示区域加载 3000px 图片
- 首屏以下图片延迟加载
- 使用响应式图片（`srcset`、`picture` 元素）
- 压缩图片，80%～85% 的质量损失通常难以察觉
- 使用 CDN 加速交付

```html
<img
  src="hero.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
  sizes="(max-width: 400px) 400px, (max-width: 800px) 800px, 1200px"
  loading="lazy"
  alt="Hero image"
/>
```

**缩减 JavaScript Bundle**：
- 按路由或组件拆分代码
- Tree shaking，删除未使用代码
- 删除未使用依赖
- 延迟加载非关键代码
- 大型组件使用动态 import

```javascript
// Lazy load heavy component
const HeavyChart = lazy(() => import('./HeavyChart'));
```

**优化 CSS**：
- 删除未使用 CSS
- 内联关键 CSS，其余异步加载
- 压缩 CSS 文件
- 独立区域使用 CSS containment

**优化字体**：
- 使用 `font-display: swap` 或 `optional`
- 对字体做字符子集化
- 预加载关键字体
- 适当使用系统字体
- 限制加载的字重数量

```css
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
  unicode-range: U+0020-007F; /* Basic Latin only */
}
```

**优化加载策略**：
- 关键资源优先，非关键内容使用 async/defer
- 预加载关键资源
- 预取可能访问的下一页面
- 使用 Service Worker 提供离线与缓存
- 使用 HTTP/2 或 HTTP/3 多路复用

### 渲染性能

**避免布局抖动**：
```javascript
// ❌ Bad: Alternating reads and writes (causes reflows)
elements.forEach(el => {
  const height = el.offsetHeight; // Read (forces layout)
  el.style.height = height * 2; // Write
});

// ✅ Good: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // All reads
elements.forEach((el, i) => {
  el.style.height = heights[i] * 2; // All writes
});
```

**优化渲染**：
- 独立区域使用 CSS `contain`
- 减少 DOM 深度，结构越平性能越好
- 缩小 DOM 规模
- 长列表使用 `content-visibility: auto`
- 超长列表使用虚拟滚动，如 react-window、TanStack Virtual

**减少绘制与合成成本**：
- 使用 `transform` 和 `opacity` 实现可靠移动；当 blur、filter、mask、clip-path、shadow 和颜色变化能带来有意义的精修时，也可以使用
- 不要随意动画化 `width`、`height`、`top`、`left` 和 margin 等驱动布局的属性
- 仅为已知昂贵操作谨慎使用 `will-change`
- 把 blur/filter/shadow 的昂贵绘制限制在较小、隔离的区域

### 动画性能

**GPU 加速**：
```css
/* ✅ GPU-accelerated (fast) */
.animated {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ CPU-bound (slow) */
.animated {
  left: 100px;
  width: 300px;
}
```

**流畅 60fps**：
- 每帧目标 16ms（60fps）
- JavaScript 动画使用 `requestAnimationFrame`
- 对 scroll handler 使用 debounce/throttle
- 可行时使用 CSS 动画
- 动画期间避免长时间运行的 JavaScript

**Intersection Observer**：
```javascript
// Efficiently detect when elements enter viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Element is visible, lazy load or animate
    }
  });
});
```

### React/框架优化

**React 专项**：
- 对昂贵组件使用 `memo()`
- 对昂贵计算使用 `useMemo()` 和 `useCallback()`
- 虚拟化长列表
- 按路由拆分代码
- 避免在 render 中创建内联函数
- 使用 React DevTools Profiler

**框架无关**：
- 减少重新渲染
- 对昂贵操作使用 debounce
- 缓存计算结果
- 延迟加载路由和组件

### 网络优化

**减少请求**：
- 合并小文件
- 图标使用 SVG sprite
- 内联较小的关键资源
- 删除未使用的第三方脚本

**优化 API**：
- 使用分页，不要加载全部数据
- 使用 GraphQL 只请求需要的字段
- 压缩响应（gzip、brotli）
- 设置 HTTP 缓存头
- 静态资源使用 CDN

**优化慢速网络体验**：
- 根据连接情况自适应加载（navigator.connection）
- 使用乐观 UI 更新
- 设置请求优先级
- 使用渐进增强

## Core Web Vitals 优化

### Largest Contentful Paint（LCP < 2.5s）
- 优化 Hero 图片
- 内联关键 CSS
- 预加载关键资源
- 使用 CDN
- 使用服务端渲染

### Interaction to Next Paint（INP < 200ms）
- 拆分长任务
- 推迟非关键 JavaScript
- 用 Web Worker 处理繁重计算
- 减少 JavaScript 执行时间

### Cumulative Layout Shift（CLS < 0.1）
- 为图片和视频设置尺寸
- 不要在已有内容上方注入内容
- 使用 CSS `aspect-ratio`
- 为广告和嵌入内容预留空间
- 避免引发布局偏移的动画

```css
/* Reserve space for image */
.image-container {
  aspect-ratio: 16 / 9;
}
```

## 性能监控

**使用工具**：
- Chrome DevTools（Lighthouse、Performance 面板）
- WebPageTest
- Core Web Vitals（Chrome UX Report）
- Bundle 分析器（webpack-bundle-analyzer）
- 性能监控（Sentry、DataDog、New Relic）

**关键指标**：
- LCP、INP、CLS（Core Web Vitals；INP 于 2024 年 3 月取代 FID）
- Time to Interactive（TTI）
- First Contentful Paint（FCP）
- Total Blocking Time（TBT）
- Bundle 大小
- 请求数量

**重要要求**：在真实设备和真实网络条件下测量。高速连接下的桌面 Chrome 不具有代表性。

**绝对不要**：
- 未测量就优化
- 为性能牺牲无障碍
- 优化过程中破坏功能
- 到处使用 `will-change`，它会创建新图层并消耗内存
- 延迟加载首屏内容
- 忽略重大问题却优化微小细节，应先处理最大瓶颈
- 忘记移动端性能，其设备和网络往往更慢

## 验证改进

确认优化确实有效：

- **优化前后指标**：比较 Lighthouse 分数
- **真实用户监控**：跟踪真实用户所获改善
- **不同设备**：测试低端 Android，而不只是旗舰 iPhone
- **慢速网络**：限制为 3G 并测试体验
- **无回归**：确认功能仍然正常
- **用户感知**：实际感受是否更快？

当用户可感知的指标真正改善后，交给 `{{command_prefix}}impeccable polish` 完成最终精修。
