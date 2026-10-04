# 区域映射

区域映射在资源生产前，为已批准设计稿中实际可见的内容命名。它不是页面构建，也不是资源审批。

1. 运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --grid`，打开原图和网格图。
2. 运行 `{{scripts_path}}/impeccable comp-spec --schema` 查看 JSON 字段。编写包含 `regions` 数组的 `regions.json`。每个区域需要稳定的 `id`、`kind`、`note`，并且只能包含 `pixelBox`、归一化 `box` 或 `grid` 之一。使用原始设计稿尺寸。
3. 运行 `{{scripts_path}}/impeccable comp-spec --comp <comp.png> --regions regions.json --inspect-map`。输出会指向报告、叠加图、精确裁剪图和带遮罩参考的 `COMPARE` 对比图。默认输出发现；`--json` 输出完整报告，对比图路径位于 `comparisonSheets`。
4. 先打开对比图，一起检查受影响裁剪，再按需打开单张裁剪查看细节。将边界与原图比较，同时检查被排除的前景像素和几何错误。每个相互重叠的非容器代码框都会被完整遮罩，包括框内空白。分别框选独立文字元素，让间隙中的图稿保持可见；容器只描述布局范围，绝不能替代其子项。修正映射并重新检查，每轮使用新的输出目录。零错误不代表裁剪一定准确。覆盖率警告只是提示，不是完整性的证明。

如果请求止于映射，输出映射、检查报告和未解决发现后停止。若继续构建，使用 `comp-spec --comp <comp.png> --regions regions.json` 测量已检查映射，并遵循 [new-work.md](new-work.md)。

`--auto` 只生成水平分区骨架，不识别元素。它是可选辅助，不能代替人工编写映射。

## 包含关系

`parentId` 指向一个带有 `container: true` 的包围区域。父项与子项保留各自 ID 和裁剪图。包含关系绝不传递审批结果。

## 独立变化的内容

按照可以独立变化的内容拆分区域：网站会替换的内容（房间照片、商品、人物）、运动部件（hover 或标志性交互会移动的对象）和结构（框架、围边、装饰）。一扇打开百叶窗、能看到房间的窗户包含三类区域：带透明开口的外框 plate、其下方作为 image 区域的房间，以及每片独立的百叶窗 plate。重叠区域在页面中合成。`comp-spec` 会标记 note 同时描述框架及其所打开视野的栅格区域（`baked-composite`），计划与资源评审会优先展示它。

## 绘制材质

测量时，`comp-spec` 会标记裁剪结果像绘制内容（`painted-pixels`：颜色丰富、渐变柔和）的 `text`、`control` 或 `chrome` 区域，包括容器，并在摘要中列出。计划与资源评审会优先展示这些区域，以及标为 `codeDrawn` 的区域（你选择用代码绘制的材质）。不要把识别责任留给用户：如果区域是绘制材质，如人物、照片、金属或纸张表面，现在就将它归类为 `plate`、`image` 或 `texture`。

设计稿裁剪只能作为参考证据，绝不能用作生产资源。映射检查器会将其 PNG 标记为来自设计稿。
