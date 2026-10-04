# 新视觉工作

此流程用于新界面或替换视觉身份。PRODUCT.md 负责产品事实，DESIGN.md 负责长期视觉决策，界面简报保存仅属于某一路由或产物的策略。缺少 PRODUCT.md 时先完成 [init.md](init.md)；缺少 DESIGN.md 不应返回 init。

获选视觉稿的区域映射命令与 schema 见 [region-map.md](region-map.md)。

## 1. 确认哪些事实已经成立

阅读 DESIGN.md、代表性代码、token、组件和资源。

- **重新设计：** 保留产品事实、内容、功能、约束和明确品牌承诺；替换旧视觉世界，而非精修旧外观。旧外观只证明主题是什么，不决定它应变成什么。
- **既有世界：** 继承它。没有 DESIGN.md 并不会抹掉代码中已有的统一身份；应记录该身份，而非发明替代品。
- **不完整品牌：** 保留已确认资产和可识别特征，再与用户一起为当前界面扩展系统。
- **无视觉权威：** 与用户共同创建新世界。

既有界面内的章节、组件、功能或状态必须继承该界面。不要把局部新增变成新的身份探索。

## 2. 询问真正会改变工作的内容

实现前通过可用的结构化提问工具获得用户回答。询问两三个相关问题；请求足够精确时只需简短确认。可以跳过已确定事实，但不能跳过确认：DESIGN.md 确定视觉世界，却不确定当前界面的目的或概念。

- **Persuade：** 谁必须行动、应相信什么、哪些真实证据/内容/资产足以建立这种相信。
- **Operate：** 任务、信息、重要状态、使用频率和约束。
- **Read：** 读者的问题、素材、结构和寻路方式。
- **Experience：** 什么主导体验、探索如何展开、哪个交互或过渡最重要。

所有模式都要询问成功的样子、不可触碰的内容，以及什么会让一个精致结果仍显得错误。不要询问 CSS 数值或套装式审美路线。

## 3. 选择适当的创意幅度

### 扩展既有界面

继承其世界与构图，只解决新增目的、内容、层级、状态、交互，以及新增部分如何连接周边体验。不举办概念竞赛；除非用户批准长期系统变更，否则不修改 DESIGN.md。

### 在既有世界中创建完整界面

固定视觉系统。根据内容、任务和用户行为推导 5–7 个实质不同的结构，按共鸣度排序。面对真正开放的整页、整屏或流程，运行：

`{{scripts_path}}/impeccable concept-seed --scope surface --mode <mode>`

脚本从候选结构中随机发三张牌；骰子决定用户看到哪三张，打破排序惯性，同时保留真实选择。决策页面以等权完整卡片展示，发牌首选使用 THE ROLL kicker，并提供 steer 与 re-roll，由用户锁定其一。界面范围不提供 canon 或 pick 卡：世界已经确定，每张卡展示的是构图，而非身份。

有图像生成且默认 comp-led 时（读取 `.impeccable/config.json`，详见下文构建路径），每张卡声明 `.impeccable/mocks/decision/` 下的 `comp`，在页面启动后按阅读顺序生成，并遵守 [visualize.md](visualize.md) 的视觉稿纪律。用代表性现有页面截图作为参考图，将每张稿锚定在既有身份；prompt 先说明新界面结构，并点名 DESIGN.md 的配色、字体和组件性格。文字转述会漂移，像素参考不会。无图像生成或默认 code-led 时，每张卡携带由页面绘制的 `wireframe` 示意（schema 见 `impeccable serve-question --schema`）。锁定卡片即构成批准并确定构建路径：锁定 comp 就以它作为获批稿进入 comp-led，且已完成 [visualize.md](visualize.md) 的三选一轮次，无需第二个批准点；锁定 wireframe 就进入 code-led，其野心由方向契约承载。局部扩展或精确狭窄请求不得运行此脚本，直接塑形即可。

### 创建或替换视觉世界

1. 用一句话描述产品独特机制、受众真实场景、文化归属，以及首个界面必须证明什么。记录本类别总会交付的页面及其可预测反面；二者都是惯性，不得进入七个候选。若简报、产品名、具名产物或主导隐喻已经画出一幅图，其字面解读也属于惯性：最多给一个候选，其余从受众世界的其他位置推导。
2. 从该文化世界列出受众熟知的七个具体视觉系统、产物、场所或仪式；每项用一行解释为何共鸣、为何能承载产品机制，并按共鸣排序。受众世界不仅包括物件，也包括每天阅读的图形与屏幕传统：记谱法、出版物、身份系统、数据图形和界面。可命名的抽象系统（海报流派、文档标准）与实物同样具体。追问“它若是实体会长什么样”“Web 出现前其世界是什么样”。近似项只算一个；若七项中超过三项属于同一材质家族，说明推导停在主题最明显的物件上，应继续挖掘直到覆盖至少三个家族。
3. 把材质发展成完整方向：每项都把可复用视觉世界连接到具体首屏体验。
4. 运行 `{{scripts_path}}/impeccable concept-seed --scope direction --mode <mode>` 并遵循输出。没有替代，也不能跳过：新建或替换世界时，在脚本运行并确认分配前写产物代码，均违反契约；roll 防止每次运行收敛到类别默认。

脚本分配要构建的方向并发出 catalog 挑战者。判断前先融合：挑战者提供形态及系统语法，产品提供全部事实，冲突时以清晰度为准。只按“受众认同”和“产品清晰度”两轴比较融合后的挑战者与分配方向。输给扎实素材是合理结果；目的在于击败单薄或工具单一文化的列表。借鉴前先裁决每个挑战者：`wins` 表示两轴都胜出并成为构建候选；`competitive` 表示守住一轴并作为完整备选；`declined` 表示两轴都输。

被拒挑战者并未浪费：指出其系统具备而分配方向缺少的一项纪律，并在展示前把分配方向提升到同等水平。捐赠转移的是野心与系统纪律，如配色的彻底投入、网格的密度勇气、形态的结构诚实；绝不移植挑战者的外衣。搬用图案只是装扮，不是提升，一个页面只能属于一个世界。把每项提升作为独立行写入展示方向，并标注捐赠者；用户读不到的提升就没有发生。<!-- rule:skill-concept-procedure --> <!-- rule:skill-verdict-and-donation -->

5. 展示一个彻底投入、已被所击败牌组提升过的方向，提升项以具名行可见。内容包括：视觉世界、首屏、访客路径、标志交互、跨界面延展和诚实风险。按裁决路由挑战者：胜出与有竞争力者作为完整备选，附 QUALITY BAR 卡和一句理由；被拒者降级为紧凑、安静的一行，带裁决和保留的贡献，不能全尺寸展示，也不能静默丢弃，用户要求时仍可采用。裁决帮助选择，不能替用户决定；降级行是判断过程的证据。

一手牌最多容纳三个完整挑战者；roll 发出更多时，选最强三个，其余用一行记入 re-roll 池。要从牌组彻底丢弃挑战者，必须指出与产品事实冲突的原因并披露。如果自己排名最高的扎实候选不是分配方向，增加一张 kicker 为 IMPECCABLE’S PICK 的卡片；结构与其他卡一致，真实风险行在确实熟悉时说明其熟悉度。熟悉而有效是正当终点，不是胆怯；pick 卡与常驻出口提供两种深度。只能有一张 pick，不能两张，也不能展示排序列表；若骰子恰好分配首选，就不加 pick，并在分配卡说明它原本排名第一。

加入 re-roll 和可选单行 steer，提供三档：plain（同样跨度的全新一手）、safer（剩余传统扎实候选，加上对照指定竞品的 canon）、bolder（只用外来形态且彻底投入）。档位由用户在熟悉—大胆轴上选择，不能预选。回答带档位时，以 `--register <value>` 和下一次 `--reroll` 重跑 seed 并遵循输出。方向轮开启时用户说“bolder”或“safer”指这些档位，不是 bolder/harden 命令。决策页面用卡片和 board；结构化工具只展示名称与一句话，其选项依次为分配方向、pick、胜出/有竞争力挑战者和最后的常驻出口。被拒挑战者的保留项折入分配选项描述，使提升在文本通道也不丢失。<!-- rule:skill-pick-card-one-only -->

每轮方向选择都提供一个安静、永久的替代项：不加讽刺地忠实执行类别标准。它是用户的门，不是你的：不得推荐、不得拿它与 roll 比较，也不得让它削弱发出的方向；反默认约束只约束未选择的默认。当用户选择 canon、safer steer，或用自然语言要求熟悉/类似竞品的路径时，惯例成为承诺：只询问一次应与哪 2–3 个产品并列，把其工艺水平当作底线，然后完整忠实执行，不偷塞怪癖。长期偏好记录为 PRODUCT.md 中的品牌承诺。<!-- rule:skill-canon-standing-exit -->

Re-roll 淘汰此前展示过的所有方向，包括扎实候选和挑战者。连续两次后询问缺少什么特质。只有分配方向确实无法承载产品事实或任务，且能指出事实理由时才可主动 re-roll；个人品味不是理由。用户可自由 re-roll，用户或简报固定的方向始终优先。逐字段解决冲突，保留每项用户/简报固定约束；简报开放的维度仍由分配方向的拓扑、控件、状态词汇和仪式约束。只有材质与固定视觉方向或 PRODUCT.md 品牌承诺冲突时，转换材质表达并在展示中明确说明。外观不匹配不是 re-roll 理由。<!-- rule:skill-assigned-plus-reroll -->

以视觉方式呈现决策：options payload 以包含具名提升行的分配方向为首，随后是存在时的 pick、带 QUALITY BAR/裁决/保留项的挑战者、带 safer/bolder 档位的 re-roll、steer、启用的 canon，以及在图像生成可用时携带记录默认值且 `toggle: true` 的 `buildPath`。没有挑战者的降级 roll 仍使用页面，展示一张带 re-roll 的纯文本卡。

每张卡结构相同：thesis、palette、materials、first viewport、honest risk 和挑战者 case 行（精确结构见 `--schema`）。页面根据字段渲染身份并自动降级 declined 挑战者；catalog 图只作为明确标注的灵感，不承诺构建。还要编写同结构的 `canonCard`；页面会将其置于次要位置，反默认约束仍生效。运行 `{{scripts_path}}/impeccable serve-question --start --payload <file>`（先用 `--schema` 查看结构）。命令守护化后打印页面 URL 和 key 并退出；优先应用内浏览器，其次系统 opener，最后直接展示 URL。以 `--wait --key <key>` 收集选择，退出码为 3 时重复等待；ANSWER 输出 JSON。

ANSWER 为 `{"optionId":"reroll"}` 时服务保持存活，页面显示加载中的新牌。用相同 `--scope`、`--mode` 加 `--from <seed-key> --reroll <n>` 重跑 concept-seed（首次 n=1，依次递增），构建新 payload，通过 `--update --key <same key> --payload <file>` 发送，再回到同一 key 的 `--wait`。不得启动第二个服务，也不得在此回退聊天，否则已打开页面会永远等不到新牌。退出码 4 表示页面未回答就关闭：仅用结构化提问工具重现一次；仍无回答则无监督采用分配方向并说明假设。能够后台阻塞 shell 的环境可不加 `--start`，让脚本自动打开并阻塞。不要预判回退；真正运行脚本，只有启动退出码 2 才路由到结构化工具，这是一条回退路径而不是需重试的错误。<!-- rule:skill-visual-decision-page -->

图像生成可用时，每张卡（含 canon）都声明 `.impeccable/mocks/decision/` 下的 `comp` 路径。执行环境对 shell 有沙箱时，以限制最少的命令路径启动页面；沙箱 shell 无法绑定 board 端口，首次失败会令每个会话多一次重试。先提供页面，再生成视觉稿；各卡槽显示 shimmer 等待，用户可以在图片到达前作答。

写第一张决策稿 prompt 前就加载 [visualize.md](visualize.md)，不能等到正式 comp 轮。每张卡图像都是按该文件纪律制作的高保真北极星稿：把请求界面当成真实页面，展示首屏及下一节开头；模板骨架无论套什么世界仍是模板（自己的 pick 也一样）；prompt 以结构开头，使用真实产品名与内容，不杜撰商业主张，并彻底采用卡片自身的配色、字体性格和材质世界。某轮声明尚未生成的 comps 后，`impeccable serve-question --start`、`--update` 或切换到 comp 会打印 `NEXT read <path>/visualize.md`，第一条 prompt 前必须读取。`--wait` 对缺 prompt sidecar 的已落盘图片打印 `COMP SIDECAR MISSING`，补齐后才能继续；`COMP STALE` 表示槽位残留旧轮文件，应原位重生成。

各档保真度生成耗时相同，因此草率草稿只会以完整成本换取草稿质量。卡片公平意味着各自在自己的语法中等保真、同一界面、同一宽高比，而不是一起未完成。画幅遵从界面：原生或移动优先用设备纵向视口，桌面 Web 用横向；手机横向稿是坏画幅，不是中性默认。按阅读顺序生成：分配卡、pick、完整挑战卡、canon；每张完成立即写图片及 prompt sidecar，让 re-roll 成本优先花在先阅读的卡。Declined 挑战者不生成 comp，以 catalog 缩略图作为形象。

可并行使用 sub-agent 时，每张卡分配一个 agent，最多四个并行；每次生成都调用随附资源生产 Agent，并提供单稿任务包、该卡字段、PRODUCT.md、共享画幅、visualize.md 路径和声明输出路径。Agent 返回后仍为空的槽位在当前线程重生成；用户已作答时仍为空的槽位直接放弃，无需额外监督。无并行能力时，页面启动后在主线程按同顺序生成，由环境自身显示进度，最后一张完成后再等待回答。

选择不会消耗获选 comp：comp-led 时它作为正式构图轮第一个选项；code-led 时在最终评审中作为“图像敢于表达而构建没有做到”的批评参照。未选稿保留在 `.impeccable/mocks/decision/` 作为已发牌组，不带批准也不暗示批准。无图像生成时，卡片通过配色芯片和事实表达身份，该页面仍是完整体验；页面自动把 catalog 图降级为标注缩略图，因为显著度应编码裁决，不能由是否有图偶然决定。<!-- rule:skill-decision-comps-full-fidelity --> <!-- rule:skill-salience-parity -->

执行契约（comp-led 或 code-led）是工作流偏好，不是逐界面决策，任何轮次都不直接询问。记录的默认值随每轮传递，页面 toggle 只处理例外。读取 `.impeccable/config.json` 的 `buildPath`，单机差异由 gitignore 的 `.impeccable/config.local.json` 覆盖；二者都没有且图像生成可用时，默认 comp-led。每个方向/界面 payload 都写 `buildPath: { "value": <default>, "toggle": true }`；页面页脚解释取舍，ANSWER 返回 `buildPath` 与 `buildPathFlipped`。

切换值仅约束当前会话，不写回，但有一个例外，也是轮次内唯一值得询问偏好的情况（有机会的项目已由 init 预先记录）：若 `buildPathFlipped` 为 true 且项目完全没有记录 `buildPath`，轮次结束后只问一次是否将其设为长期默认。无论回答什么都写 `.impeccable/config.json`：回答 yes 写切换后的值；“no, just this once”写被切走的值，即用户通过拒绝确认的长期默认。只有发生切换才问，未动 toggle 不表达偏好。拒绝后什么都不记录会导致下次继续问。用户用文字要求改变长期默认时，直接更新文件，不再询问。

**Comp-led：** 获选 comp 是法律；若尚不存在，构建前必须生成；最终评审核对实现与 comp。它提供最大胆构图，预期会有修复轮，不能静默跳过。**Code-led：** 不制作当前页面 comp，也无需道歉；QUALITY BAR board 继续校准工艺，野心转入书面契约的 FIRST VIEWPORT、具名标志交互和动效语法，由最终评审核查实际行为；code-led 不等于降低投入。

Code-led 轮仍为每张卡声明 comp 路径作为切换储备。用户在轮中切到 comp 时，`--wait` 返回一次 BUILD PATH FLIPPED，页面槽位 shimmer；此时逐一生成所有开放卡的 comp（lead 优先），再等待。切回不产生成本；已经渲染的 comp 在最终评审中作为批评参照。没有图像生成就不显示 toggle：code-led 是唯一选择，只用一行说明而不询问。旧的双卡执行契约轮已废弃；`followup: true` 仍用于通过 `--update` 在同一桌面提供后续轮次。<!-- rule:skill-build-path-round -->

Catalog 世界是可工作的系统，不是情绪参考。一个世界保留下来后，把其配色与材质、字体与构图、拓扑、控件与状态、响应式规则带入产品。来源本身是界面语言时，应在导航、内容、控件和状态中全面采用其原生语法。选择落定后立即打开所选世界的 QUALITY BAR board 与 hero，即便此前看过其他卡。ANSWER 行会给出所选卡图片；只能读文件或运行沙箱时，将其下载到工作区并用相对路径打开，沙箱查看器拒绝工作区外绝对路径。图片决定构建必须达到的工艺、保真与艺术指导水平，但不决定构图；当前界面服务的是本产品。

Roll 可能落到的每个方向都必须预先可行：所有关系和可视化主张真实；具备真正的配色与组件家族；有一种独特构图和一个产品专属体验；能在现有资产、工具和性能预算内扩展到整个界面。不符合事实的候选应在 roll 前替换，不能指望 roll 拯救。事实约束主张，而非演示：绿地项目可用完整保真度制作概念所需的示意材料；只要访客可能误认其为真实，就标为合成，并向用户列出需要替换的真实素材。绝不能虚构商业或事实主张：价格、客户、基准、端点和产品并不具备的能力。以“演示数据尚不存在”为由拒绝大胆方向，是披着诚实外衣的胆怯。<!-- rule:skill-truth-binds-claims -->

对 **Persuade**，开场必须让产品价值可理解且有吸引力，展示清晰操作，并证明只有本产品能证明的内容。转化必须存在于形式自身的语言中：一句击中的 hook、可见主操作、清晰阅读顺序。隐藏产品价值或操作的投入形式仍未完成转换。<!-- rule:skill-persuade-conversion-in-form --> 对 **Operate**，表达不得遮蔽任务、状态或熟悉 affordance。对 **Read**，保持理解和寻路。对 **Experience**，作品从首屏就应主导体验。

## 4. 提交视觉世界

先选择色彩策略，再选择具体颜色：Restrained（中性色加一个强调色，是 Operate/Read 的默认）；Committed（一个饱和色覆盖界面 30–60%）；Full palette（3–4 个具名角色）；Drenched（界面本身就是颜色）。Persuade 与 Experience 可采用更大胆策略，简报允许时就使用。颜色要在页面尺度上投入，以整块区域为色域，而非在中性底上散落强调色。深色或浅色从来不是默认：用一句话写清谁在何地、何种光线下使用，让物理场景强迫答案。<!-- rule:skill-color-strategy -->

像从主题世界挑选物件一样选字体，并符合界面模式。Operate/Read 适合系统字体栈和可靠 UI 字体；Persuade/Experience 需要有观点的字体。以下训练数据默认字体意味着停止寻找：Fraunces、Playfair Display、Cormorant、Lora、Crimson、Newsreader、Syne、Space Grotesk、Space Mono、IBM Plex、Inter-as-display、DM Sans、DM Serif、Outfit、Plus Jakarta Sans、Instrument Sans。仍选其中之一时，必须有其他字体无法满足的理由；“书籍需要衬线”“书店需要手写”“科技需要等宽”等主题联想绝不是理由，这份清单正为打破它们而存在。<!-- rule:skill-typo-reflex-faces -->

校准：无论主题为何，AI 界面常聚集到少数外观——暖奶油底、高对比衬线标题、陶土或信号红强调；近黑底、单一霓虹强调与发光边缘；报刊式细线、斜体衬线标题和小号宽字距等宽标签。简报要求时它们都合理；审美开放时落入其中表示自检失败。如果只凭类别，或“类别 + 避开什么”，就能猜中审美，应返工到二者都不明显。<!-- rule:skill-calibration-saturated-looks --> 活力不等于不可信：简报中的“不要游戏化、不要炒作”等负约束只排除这些手法，不排除充沛表达；描述产品行为的“安静支持、平静辅导”也不决定界面能量。<!-- rule:skill-constraints-rule-out-devices-not-energy -->

书卷气、温暖或面向儿童的主题也不豁免校准：书布、线、封套、环衬与书架杂物覆盖完整饱和光谱，奶油纸只是极小一角。书籍主题落在“奶油 + 衬线”只是穿着主题外衣的默认。<!-- rule:skill-book-subject-not-cream-license --> 简报固定的是整个世界，不是其最柔和版本；该世界完整材质范围仍可使用。若任何模型都会为此世界产出同一表现，失败发生在执行自检，而非方向选择。<!-- rule:skill-pinned-world-not-default-rendition -->

<claude>
你的已测默认倾向：温暖、书卷、家庭和儿童主题会变成奶油底、带斜体强调的衬线标题和灯光，即使分配方向没有要求。把第一套配色视为已经用过。写代码前重读 OWN-WORLD：若 Persuade 界面在简报未固定时出现 cream、paper、parchment、ivory 或 lamplight，表现已经失败，应先从该世界的饱和材质重新设计。其他模型会把同一主题表现为书布、线、封套和环衬颜色；主题本身不要求你的默认。
</claude>

## 5. 记录决策

编码前，在相关界面简报的 `## Direction contract` 下记录选定方向，作为仅供开发使用的契约。方向契约是长期路由/产物策略；即使没有其他界面策略要持久化，也要新建或更新简报。使用六个短块，总计约 150 词，无需调用工具计数：

- THESIS：当前界面唯一拥有的理念，以及拒绝的类别默认布局。
- OWN-WORLD：配色与组件语言；即使删除所有内容也足以辨认。
- STORY：访客理解什么、相信什么、做什么。
- FIRST VIEWPORT：精确构图、各元素位置与尺度，以及主操作位置。
- FORM：选定形式、它在有序列表中的位置和脚本输出的 seed key。
- FINISH：逐字写入 `unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`。

界面简报是后续 agent 跨编辑、跨会话重载的提醒。FINISH 尚未完成时，外观再完整也不是完成，只是倒在终点线。任何块若读起来只是情绪，说明方向尚未决定；最终评审会对照此契约检查渲染。<!-- rule:skill-decide-then-build -->

绝不能把方向契约复制进实现源码或任何浏览器交付产物，包括 HTML/框架注释、隐藏 DOM、`<template>`、`data-*` 属性、渲染后的 JSX/TSX、序列化 props/state、React Server Component payload、客户端 bundle、metadata/JSON-LD、仅无障碍文字，或与产物一起提供的文件。不能把编译器或优化器删除开发元数据当作安全边界。评审 Agent 和文档 Agent 从界面简报读取契约。

新建或替换视觉世界时，DESIGN.md 在结束阶段由随附文档 Agent 根据实际构建结果编写（第 7 节）。先写规则书会导致实现为规则辩护而不描述现实，还会给设计系统检测器一个不稳定目标。新世界缺少 DESIGN.md 仍是未完成运行。普通扩展不重写 DESIGN.md。<!-- rule:skill-design-md-from-the-build -->

更新前读取现有界面简报：

`{{scripts_path}}/impeccable surface-brief read <primary-target>`

`{{scripts_path}}/impeccable surface-brief write <primary-target> <body-file> [related-target ...]`

写入后再读一次，确认六个契约块与 seed key 齐全，再开始构建。保持简报精简：范围与访客模式；受众、任务、操作/目标、证据/内容、约束；选定方向与记忆点；未决事项。不要复制全局产品事实或 DESIGN.md token。

Comp-led 构建中，只要任何图像生成方式可用（环境原生工具或 `impeccable context` 报告的 API 回退），锁定方向就必须在构建前可视化，不得跳过：加载 [visualize.md](visualize.md)，把三个构图选项交给用户批准，即获选卡的决策稿加两个变体。此步骤被证明能产出最具构图感与野心的工作。Code-led 按契约跳过该轮，不是流程漂移；原本由视觉稿承载的野心写在方向契约 FIRST VIEWPORT 块和具名标志交互中，并由最终评审核查行为。<!-- rule:skill-visualize-before-build -->

若命令为 `shape`，把选定方向返回 [shape.md](shape.md)，在持久化或实现前停止。

## 6. 彻底投入地构建

构建分配方向，不要实现一个更安全的解释。形式提供结构、阅读顺序、组件惯例和原生动效；产品提供全部事实。每个原子都要投入：导航、按钮、输入框、链接都用该形式的词汇重建，在投入形式中使用通用组件就是失误。第一版就要彻底投入；后续轮次用于让它更清晰有效，绝不用于稀释。无人值守工作中，安全表现本身就是已知风险。<!-- rule:skill-commit-every-atom -->

### Comp-led：视觉稿是可测量契约

获批视觉稿存在时，它是空间契约，不是 mood board；只有用户能以明确文字降低其权威。模型常误以为 HTML/CSS/SVG 已成功复刻图像，因此构建以磁盘状态机运行，由门禁测量屏幕与视觉稿，而非依赖记忆。只启动一次，让状态机告诉你下一步：

选择方向后立即运行 `{{scripts_path}}/impeccable build-phase start --direction <seed key> --kind <assigned|pick|challenger|canon> --artifact <entry file>`（这也是选择 ping，roll 会输出精确命令）；若界面轮已锁定视觉稿，运行 `start --comp <approved comp> --artifact <entry file>`。

然后依次执行以下阶段，每阶段由 `{{scripts_path}}/impeccable build-phase advance` 关闭（下列动词都以 `{{scripts_path}}/impeccable <verb>` 运行；退出码 2 表示门禁失败并说明原因，修复后再次 advance；前一门禁开放时，不得写后一阶段内容）：

0. **comps。** 执行 [visualize.md](visualize.md) 的构图轮：在目标真实视口生成三张 `.impeccable/mocks/` 下、各有 prompt sidecar 的视觉稿，一并交给用户；获选稿 sidecar 写 `"approved": true`。门禁计数并读取批准。`start --comp` 表示这一步已发生，因而跳过。Comp-led 属于前沿模型任务：构建者要维持测量布局、按 box 放 plate，并在多轮尝试中响应数值读数。较小或更快模型往往只能做出可辨页面，却卡在 hero 门禁；若当前模型属于此类，在方向轮前说明并采用 code-led，否则预期流程会以未满足读数停在 hero。

1. **spec。** 用 `impeccable comp-spec --comp <comp> --grid` 在视觉稿上生成坐标网格并打开。用 regions 文件按网格跨度命名每个显著区域；text/control 只有在保留该跨度至少 95% 对比像素时才可缩到墨迹簇，尤其检查复合控件与多行文字裁剪。`snap: false` 保留跨度，显式 `box` 按原样采用。

所有绘制内容——插画、照片、人物、产品物件与材质纹理——标为 `plate` / `image` / `texture`；代码绘制内容标为 `text` / `control` / `chrome`。每个区域携带描述视觉稿内容的 `note`，plate prompt 与门禁消息会读取它。运行 `impeccable comp-spec --comp <comp> --regions <file>`；spec 保存各区域 box、采样配色与媒介，后续以 `impeccable comp-spec --print` 为构建参考。

字体必须测量，不能猜。`impeccable font-match --measure <text region>` 从像素读取大写高度、宽度类别和字重；`impeccable font-match --rank <region> --text "..."` 从 Google Fonts 指纹索引中选取最接近裁剪形态的字体，加上 `--candidates` 指定名称，以同一大写高度和区域文字渲染，再按指纹距离排序，其 `USE` 行就是 CSS。浏览器不可解析时，记录 catalog 最近字体并注明字号估算，仍以此为构建选择。不得为了排序安装浏览器，不得手工向 spec 写 `chosen` 字体；门禁只接受 font-match 写入结果。主文字区域未完成测量和排序时，spec 门禁拒绝关闭。

若 code kind 区域的 note 描述图表、绘画、照片、纹理等绘制材质，spec 会拒绝；应改为 plate，或在确由代码绘制时改写 note。Regions 文件若留下未命名墨迹也会被拒绝，因为没被命名的内容永远无法判定缺失。超过视觉稿四分之一大小的 `text` / `control` / `chrome` 也会被拒绝：那是列，不是元素。应分别命名内部元素；`container: true` 只用于真正不可分割的单一元素。

所有需要绘画技巧的内容都是 plate：超过图标预算的内联 SVG（图解、记谱、带箭头引线、艺术品“快速近似”）会在 hero 阶段被拒绝；64px 以下、路径很少的图标 SVG 可以；页面按实时数据绘制的 chart 是图表，不是插画。注释绘画的引线与箭头属于该绘画 plate，只有标签作为 text。按 [region-map.md](region-map.md) 的独立变化原则拆分区域；带框视图由 frame plate 覆盖独立 image 区域。

视觉稿裁剪永远不是 plate；它只是生成 plate 的参考，plates 门禁会拒绝对原区域重采样。Plate box 必须留边并完整容纳艺术品；spec 会测量艺术品与边缘接触，拒绝切穿作品的 box。只有页面确实在那里裁切时才用 `bleed: true`，否则 `object-fit: cover` 会丢掉 box 已切失的一侧。Spec 没有的内容就不能出现在页面：不得增加视觉稿未展示的边框、分隔线、容器或 chrome。只有三类让步：最接近且可获得的字体；足够接近的图标 glyph（用户指定图标库则精确匹配，但只覆盖 pictogram，不覆盖控件 chrome，chevron、arrow、dropdown 边框/填充、button 形状仍服从视觉稿）；以及拼写错误等真实视觉稿缺陷。<!-- rule:skill-comp-spec -->

制作资源前检查拟定 map：`impeccable comp-spec --comp <comp> --regions <file> --inspect-map` 会生成编号 overlay、精确裁剪、前景 mask 预览和汇总报告，但不修改 spec 或构建状态。同时检查边界和被排除像素；空参考意味着几何需修正。`parentId` 只命名包围它的 `container`，不会删除区域或批准资源。报告诊断几何，不证明语义完整。

2. **plates。** 每个栅格区域都以 plate 交付：插画、照片或人物根据视觉稿裁剪，以资源分辨率重新生成，删除 UI 文字并写入其 `plate` 路径；孤立墨迹、人物、物件使用原生透明 PNG，置于页面自身底色上；照片和纹理保持不透明。纸、布、颗粒等纹理优先从区域干净补丁镜像平铺，只有不存在干净补丁时才生成。

`impeccable comp-spec --crop <id>` 写参考裁剪；抠图时把 `impeccable comp-spec --plate-prompt <id> --background transparent` 保存为 prompt 文件，其他情况使用 `--background opaque`。优先把裁剪与 prompt 交给原生图像工具，再执行 `impeccable embed-prompt <plate> --prompt-file <prompt.txt>`。API 回退为 `impeccable generate-image --ref <crop.png> --prompt-file <prompt.txt> --out <plate.png> --size <WxH> --quality high --background transparent`，全幅资源改用 opaque；先创建输出目录。在明暗背景上检查真实 alpha、白色前景、细边和透明孔洞，不要对原生输出做色键抠图。Plate 门禁会与视觉稿评分，也应目视检查位置与尺度。

可并行时，生成随附资源生产 Agent（`impeccable-asset-producer`；Codex 为 `impeccable_asset_producer`；Cursor 为 `/impeccable-asset-producer`；GitHub Copilot 指令为“Use the impeccable-asset-producer agent”），传入 spec 路径并让其产出全部资源；无 sub-agent 时在当前线程生成。裁剪只是参考，绝不能成为交付像素。门禁检查每个 plate 存在、至少为区域尺寸 1.5 倍且看起来就是该区域。

页面代码等待此门禁：plate 未存在前写页面，结果必然会用 CSS 绘制其材质。单文件交付也不例外：同样生产 plate，再内联为 data URI。`--force` 只允许一种情况：用户用明确文字降低 comp 权威，并把原话写入 `--reason`；其他理由一律拒绝。<!-- rule:skill-plates-before-page --> 在评审打开前先给 plate 评分。`build-phase advance` 只剩待评审时，执行 [component-review.md](component-review.md) 的计划与资源评审，让用户检查 plate 及哪些区域由代码绘制。批准后替换任何 plate 都要重开一轮。用户接受前不得写页面代码，`build-phase advance` 会拒绝。<!-- rule:skill-human-component-review -->

3. **hero。** 先运行 `impeccable build-phase scaffold`，生成测量布局 CSS 自定义属性（`.impeccable/build/scaffold/layout.css` 中的 `--r-<id>-x/y/w/h`，值为视觉稿百分比，并在已测量时包含大写高度、字号、字体、字重）和参考页 `hero-reference.html`，其中每个区域位于其 box、每个 plate 已放置。把数值绑定到自己的语义结构，每个区域一个元素；参考页只用于核对位置，不是最终页面，重叠 box 就应重叠。

随后只构建视觉稿尺寸的首屏，逐字复制获批稿文案；用户批准的是这张带这些文字的图，改写只能在 hero 通过后明确决定，不能在阶段中静默发生。每个文字区域以测得大写高度定字号并使用排序字体。Plate 优先：在任何文字或控件前，把每个 plate 放到 spec box，可使用 `object-fit: cover`、`<img>`、背景图或以资源名标识的 data URI。捕获到 `.impeccable/review/hero-repro.png`，先运行一次 `impeccable build-phase record hero`，确认没有文字时 plate 区域已经匹配，再按 spec 配色和 box 叠加语义层并 advance。

门禁先拒绝源码未引用的任何 plate，再运行 `impeccable comp-diff`，向 `.impeccable/review/diff/hero/` 写入并排图、热图、逐区域成对裁剪和 `report.json`；`raw-report.json` 保留未解释测量。报告和裁剪标签使用门禁 verdict；即使区域标为 drift，`gate.reasons` 仍列剩余阻断。若 plate 文件、测量区域或 comp 改变，已接受 plate 也会重验。

总体达到 72% 且无硬否决才通过。硬否决包括缺失区域、与稿件矛盾的 plate/text block、SVG 插画、被裁 plate，以及任何分数下的杜撰墨迹块。过线后数值读数变成随通过一起打印的建议，应在 responsive 前的 polish 阶段修复：门禁对照视觉稿读取每个文字区域的大写高度、行数、字重、墨色、位置，chrome 条的高度，以及视觉稿安静位置里出现的墨迹（kicker、多余导航项、分隔线），并以数值说明偏差，如“实现大写高度 78px，视觉稿 103px”；这些数字就是修改依据。

失败时先按顺序打开列出的区域裁剪再编辑：`missing` 需补材质；`contradicted` 需从 spec box 重新推导结构；`drift` 才是尺寸与间距调整。重复尝试不会消除未解决阻断。三次失败后，不再盲目迭代，而是展示 [component-review.md](component-review.md) 的首屏评审。用户接受首屏后，只要捕获仍匹配，总体阈值、配色检查和数值读数均降为建议；缺失/未引用 plate、SVG 插画、有机裁剪、被裁 plate、杜撰墨迹和渲染存在性失败仍会阻断。捕获偏离用户接受版本时应恢复；该评审已经关闭，永不再次请求。这一步决定本轮野心成败：在这里重试花几分钟，结束时收到 rebuild 则损失整轮。<!-- rule:skill-hero-gate -->

4. **sections。** 在 spec 系统内构建其余界面：保持同一圆角语言、线宽和配色，不加入视觉稿未展示的内容。视觉稿未覆盖的区域继承已记录系统。
5. **motion。** 统一编排一次标志性交互、揭示与动效，而非散落各处。
6. **responsive。** 完成其他视口，并检查常见桌面宽度 1280–1600 下的首屏，而不只检查 comp 精确尺寸：使用流式列，不能让固定像素网格窄一百像素就换行。将 1440 宽全页 `desktop.png` 和 390 宽 `mobile.png` 写入 `.impeccable/review/`；门禁将桌面捕获与 comp 比较，拒绝只能在 comp 原宽度成立的首屏。移动优先界面应以纵向 comp 开始，其 plate 也是为该画幅生成。

### Code-led

没有 comp，也无需道歉：野心存在于方向契约的 FIRST VIEWPORT 块和具名标志交互中，最终评审会在实际行为中核查这些承诺。获选决策稿作为批评参照送入最终评审。

### 两条路径都适用

- **首屏是论点，不是页头。** 立即以该形式在真实生活中的尺度演示机制，不要把概念困在标准 hero 或 card 外壳。记忆测试：访客看完一个视口就离开，一小时后会描述什么？诚实答案若只是一种情绪，概念还未真正投入。
- **证明，不要宣称。** 展示主题如何工作：运行中的界面、被戏剧化的机制、竞品无法复制粘贴的细节。演示数据是设计材料，可以完整保真地创作并标为合成；事实主张仍不可杜撰。
- **创作资源，绝不拿 chrome 顶替。** 优秀界面建立在精心制作的名称、条目、文案、封面、缩略图和纹理之上。绿地项目中，询问轮留下的每个空白都由你以生产级保真度补全：内容可创作，主张可标注，没有章节可以省略。该放原创资源却使用渐变、玻璃、通用图标块或多顶点 `clip-path` 多边形，只是给缺口穿上 chrome；检测器会标记后两类。<!-- rule:skill-author-assets-not-chrome -->
- **发挥形式的 Web 优势。** 选定世界若点名 canvas、WebGL、view transitions 或生成式动效，就实现技术本身，而非静态模仿。
- **像工作室一样安排滚动节奏。** 在同一语法中变化密度、尺度、图像、动效与留白；密集段落要换来安静段落，页面以真正收束结尾。全页使用同一间距节奏，标题上方空间大于下方。
- **简报暗示真实图像时，使用真实且已验证的图片。** 搜索主题实体而非类别；一张决定性照片胜过五张平庸照片。验证素材 URL 可访问。
- **把动效当作材质创作。** 只集中编排一次该形式原生的动效，而非散落 hover 效果。限制高成本效果，默认保持内容可见。

保留语义、无障碍、性能、响应式、项目惯例和有效行为。

## 7. 检查并完成

用一轮批量截图检查目标尺寸：Web 包含桌面和移动端；原生平台（`ios` / `android` / `adaptive`）按对应平台参考中“Verifying the build”的方式，从模拟器/仿真器捕获各 OS 要求的设备类别。若执行环境报告用户实际视口（应用内浏览器尺寸或指定分辨率），将该宽度加入集合；最先破坏的宽度就是用户最先看到的宽度。

对照用户请求和方向契约评审渲染，成批修复材质缺口，再用最后一轮确认。两轮是上限，不能为每个微调奖励一次截图。Comp-led 构建运行 `{{scripts_path}}/impeccable comp-diff --comp <approved comp> --build .impeccable/review/desktop.png --spec .impeccable/build/spec.json --out-dir .impeccable/review/diff/final`，把区域行与成对裁剪作为评审依据。并排图提供构建线程自己永远不会拥有的视角；任何 `missing` 或 `contradicted` 区域都必须修复，无论凭记忆看起来多好。不能用单张全页缩略图判断保真度，它恰好隐藏最重要的失败。Persuade 界面还要验证模式是否达成任务：首次访客应能在数秒内用该形式自身词汇明白这是什么、为何重要、下一步做什么。

截图只有有效时才是证据，发送前必须验证。先让入场动效结束或关闭；因动画时序隐藏的元素会被误判为缺失，修复反而造成回归。全页截图从文档顶部开始；comp 对比按 comp 原始像素尺寸捕获。每个文件都打开一次，确认内容与文件名一致：不能黑屏、空白、文件名正确但展示错误章节，也不能半加载。畸形截图会浪费整轮；评审器只返回 `disposition: recapture`，此前审查不产生约束。<!-- rule:skill-capture-validity -->

第二轮检查后，构建线程的精修结束：不要继续搜缺陷、写微调脚本或在这里重建；剩余问题交给新上下文，发现更准确且成本更低。Web 环境若没有 design hook，在变更目标上运行一次 `{{scripts_path}}/impeccable detect --json`，修复机械性问题，将剩余发现交给评审器；无 hook 又跳过检测会把所有 hook 本应用于捕获的痕迹一起发布。原生平台完全跳过检测器，因为它只读 HTML/CSS，无法判断原生代码；评审器的质量底线检查是唯一粗糙度门禁，输入包必须说明。

截图写入 `.impeccable/review/`，每个视口一个文件。Web 为 `desktop.png`、`mobile.png`，用户视口参与检查时另加 `user-<width>.png`；原生每种设备类别一个，如 `phone.png`、`tablet.png`，adaptive 时按 OS 加后缀。环境未创建目录时自行创建。传给评审器的路径就是其规范；输入包明确列出每个已检查视口为 required，路径缺失时评审器也会在此目录查找。

随后生成随附最终评审 Agent：`impeccable-finish-reviewer`（Codex 为 `impeccable_finish_reviewer`；Cursor 为 `/impeccable-finish-reviewer`；GitHub Copilot 指令为“Use the impeccable-finish-reviewer agent”）。输入包括原始请求、已确认回答、产物路径、截图路径、方向契约、已有 hook 发现、QUALITY BAR 卡和获批 comp 路径。Code-led 没有获批 comp，应在该槽位传入获选决策稿，并明确标为批评参照。

Comp-led 还要传构建状态 `.impeccable/build/state.json`、spec，以及 `.impeccable/review/diff/hero/` 和 `.impeccable/review/diff/final/`；其并排图、热图、区域对和 `report.json` 是保真证据。另传 craft-floor 参考路径。原生平台传平台参考 [ios.md](ios.md) / [android.md](android.md)，adaptive 两者都传，并用一行说明未运行检测器，使评审器按平台惯例而非 Web 规则判断。

评审器没有浏览器；未传的截图就是它无法执行的检查。生成前不要读取随附 Agent 定义，执行环境会在 spawn 时加载，只需负责完整输入包。等待 Agent 时使用一次长超时，而非循环短轮询；等待期间推进独立步骤。验证返回包含五个契约章节；recapture 返回只含一节，即重捕列表。空返回或明显失控时，用同样输入重生成一次。

此评审绝不能在构建线程内运行，也不能继承其上下文：以全新 reviewer、无 fork 对话历史生成（Codex 使用 `fork_turns: 0`）。继承转录会继承构建者的框架、乐观和抽象；评审所需一切都应随输入包传入。只有完全不具备 sub-agent 能力的环境，才能完全退出构建上下文后，从 [degraded/finish-reviewer.md](degraded/finish-reviewer.md) 执行新的线程内替代评审。无论是替代还是失败后替换，都要在结束时用一行披露，不能静默。<!-- rule:skill-finish-separate-reviewer -->

严格按 disposition 单词行动，只有四种：

- **recapture：** 失败的是证据，不是构建。按 capture-validity 规则重捕返回指定内容，再用新证据执行完整评审。无效证据上的评审没有约束力，其后不能直接执行 verdict pass。
- **rebuild：** 保真度整体失败，无法靠补丁解决。跳过修复批次，立即重建：重新推导指定区域、生成指定资源，把结果送回新的完整评审，不做 verdict pass。重建会整体替换区域，因此整个矩阵要在重捕结果上重跑。告知用户正在发生什么，而不是请求修复失败的许可。只有第二次收到 rebuild、需要并列展示两个 verdict，或重建会删除用户已批准内容时才咨询用户。
- **ship：** 无欠项；按真实范围报告结论，继续文档 Agent。
- **fix：** 把实质修复一次性应用，构建一次，并以相同文件重捕相同视口。重捕只能测位置、加载与溢出，不能判断修复是否达到发现所要求的质量；因此把新截图送回同一 reviewer，通过 Agent continuation 对每项实质修复评分 resolved、partial 或 unresolved。没有 continuation 时，从 [degraded/finish-reviewer.md](degraded/finish-reviewer.md) 的 Verdict Pass 新鲜执行评分。

Partial/unresolved 项进入下一批修复、重捕和 verdict。无人值守运行最多两轮；有人参与时由用户决定上限，因此第二轮仍有未决项时，把表格交给用户，让其选择按现状发布或投入下一轮。无论谁决定，只要某轮一个问题都未解决就立即停止。唯一工作清单是 reviewer 发现，不能重新开启自己的缺陷搜寻。不得运行第二次检测器。<!-- rule:skill-verdict-bounds-the-finish -->

Rebuild 与 fix 共享同一资源规则：两者新建或替换的栅格图仍属于 [visualize.md](visualize.md)“Produce”部分规定的资源工作，必须像所有构建栅格图一样保留**来源证据**；本轮放弃的图在同一批次删除。送回评审或 verdict 前，对产物栅格图所在目录运行 `{{scripts_path}}/impeccable embed-prompt --scan <asset-dir...>`，处理报告的每个文件：自产图嵌入精确生成 prompt，来源图、素材图或已有图嵌入 origin。Scan 只读；删除仅适用于本轮放弃的栅格图，绝不能删除 scan 标记的文件。<!-- rule:skill-late-raster-provenance -->

以 reviewer 自己的 disposition 单词、按其真实范围报告最终 verdict。Verdict pass 只评价列出的修复：“reviewer 认为三项修复均 resolved”有证据支持；“不存在实质问题”没有。仍有开放实质发现的表格绝不能宣布通过、淡化，或伪装成只评分修复清单以外的全界面批准。用户若用自己的截图或明确指出与 comp 的不匹配来反驳 ship，其证据优先于你制作的所有捕获：把用户材料加入输入包，生成新 reviewer 执行新的完整评审。内联打补丁再自我认证，只会让被拒页面发布第二次。<!-- rule:skill-user-evidence-reopens-review -->

最后一次修正后，生成随附文档 Agent `impeccable-documenter`（Codex 为 `impeccable_documenter`），输入项目根目录、产物路径、方向契约、PRODUCT.md、[document.md](document.md) 和写入边界。没有 sub-agent 时，写入前加载 [degraded/documenter.md](degraded/documenter.md) 与 [document.md](document.md)。验证结果：新世界与获批系统变更必须同时生成带 token 的 DESIGN.md 和 `.impeccable/design.json`，不能只有正文。普通扩展应把完成的构建与既有系统对比，保留其文件并报告检查证据；报告预先存在的漂移，不得未经请求修复。后续编辑后重新检查。评审和文档都完成后才能结束。<!-- rule:skill-documenter-records-the-world -->

Comp-led 构建在最终回复前运行 `{{scripts_path}}/impeccable build-phase finish --disposition <ship|fix|rebuild|recapture>`，记录最终评审 disposition。若 `ship` 被拒绝，构建尚未完成；结合 verdict 报告仍开放的阶段。
