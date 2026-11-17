// === src/beat/clock.js ===
// 120 BPM Master Clock + Dimensional Art-Medium Immersion (彩画/厚涂油画/青绿山水/黑白漫画/夜视实拍/盗梦空间折叠) + Per-Slice Seam Attenuation

const BPM = 120;
const BEAT_DURATION = 60 / BPM; // 0.5s per beat
const BAR_DURATION = BEAT_DURATION * 4; // 2.0s per bar
const WORLD_SPEED = 210; // Smooth unhurried road speed in pixels/second

// Cinema 2.35:1 Widescreen Letterbox Constants (Guarantees ZERO text occlusion over artwork!)
const LETTERBOX_TOP = 52;
const LETTERBOX_BOTTOM = 52;

const TIMELINE = [
  {
    id: 'intro',
    short: '00 序幕·手稿 (10s)',
    eraNum: '00',
    year: 'CHRONO-ZERO · φ = 1.618',
    chronoTag: '【画境：达·芬奇手稿 × 盗梦空间几何折叠 | 时间原点 · 万物尺规与黄金螺线校准】',
    shootStyle: 'INCEPTION BLUEPRINT FOLD × SCI-FI HOLO-SCAN // 盗梦空间手稿折叠 × 科幻全息微距',
    genre: 'Baroque Harpsichord Fugue + Clockwork Winding Foley + Quill Scratch',
    title: '序幕 · 万物尺规与黄金螺线 · 跳入《盗梦空间》达·芬奇折叠手稿画境',
    start: 0.0,
    end: 10.0,
    shader: 0,
    vehicle: 'blueprint',
    mount: 'blueprint',
    vfxNotes: [
      {
        tag: '画境① 盗梦手稿与星盘',
        desc: '黄金螺线 φ=1.618 与天际线呈《盗梦空间》式弧形翻转折叠',
        target: 'sky_wheel',
        objName: '【这是：达·芬奇 24 齿黄金比例擒纵星盘 (φ=1.618)】',
        objSub: '控制全片 120 BPM 时钟与《盗梦空间》天际几何折叠的母体齿轮',
      },
      {
        tag: '画境② 双骨骼逆运动学',
        desc: '2-Bone Analytical IK 实时解算鹈鹕蹼足踩踏曲柄圆周轨迹',
        target: 'crank',
        objName: '【这是：双骨骼解析逆运动学 (2-Bone IK) 链条牙盘传动】',
        objSub: '大腿/小腿骨骼根据曲柄角度 θ=π·beat 实时闭式解算，零滑步',
      },
      {
        tag: '画境③ 机械发条猫与破纸门',
        desc: '发条猫背部黄铜齿轮啮合 + 前方图纸挤压燃火化作东非岩彩画境',
        target: 'cat',
        objName: '【这是：薛定谔的达·芬奇黄金发条机械猫 |ψ⟩】',
        objSub: '背部搭载旋转上弦发条钥匙，随羽毛笔沙沙声与齿轮咔哒声律动',
      },
    ],
  },
  {
    id: 'era01',
    short: '01 东非岩画 (前15000)',
    eraNum: '01',
    year: 'c. 15,000 – 4,000 BCE',
    chronoTag: '【画境：跳入远古矿物重彩岩画 | 约前 15,000 – 前 4,000 年 · 东非大裂谷】',
    shootStyle: 'OCHRE CAVE PAINTING MEDIUM × NAT-GEO SEISMOGRAPH // 矿物重彩岩画境 × 先吼后震物理同步',
    genre: 'Afro Polyrhythm Djembe + Cicada/Bird Jungle Foley + 38Hz Lion Roar & Elephant Call',
    title: '壹 · 东非大裂谷 · 跳入矿物重彩岩画境 · 先吼后震声浪、迁徙象群与剑齿猎豹猫',
    start: 10.0,
    end: 22.0,
    shader: 1,
    vehicle: 'stone_roller',
    mount: 'rock_slab',
    vfxNotes: [
      {
        tag: '画境① 先见狮吼→后闻震动',
        desc: '狮王先张巨口咆哮 → 0.2秒声波传抵镜头后触发大地震颤与碎石悬浮',
        target: 'lion',
        objName: '【这是：荣耀石咆哮雄狮王 (38Hz 次声波震源)】',
        objSub: '遵循光速/声速差：先见张嘴喷出气浪环 → 声波抵达才震动画面',
      },
      {
        tag: '画境② 迁徙巨象与矿物岩彩',
        desc: '角色与天地化作赭石重彩点画肌理，雪山下公象扬鼻喷尘领队',
        target: 'elephant',
        objName: '【这是：东非大裂谷迁徙非洲象家族 (公象+母象+幼象)】',
        objSub: '领头公象象牙弯翘、扇动大耳并高扬象鼻发出铜管般长鸣',
      },
      {
        tag: '画境③ 岩画壁与剑齿猎豹猫',
        desc: '塔西里远古狩猎岩画石壁 + 剑齿猎豹战神猫敲击金贝鼓音波',
        target: 'cat',
        objName: '【这是：荒野部落剑齿猎豹图腾战神猫】',
        objSub: '头戴三色部落羽冠、长出弯曲白象牙剑齿，拍打非洲金贝鼓',
      },
    ],
  },
  {
    id: 'era02',
    short: '02 诺亚方舟 (前2500)',
    eraNum: '02',
    year: 'c. 3,000 – 2,000 BCE',
    chronoTag: '【画境：手持红外夜视恐怖实拍 ➔ 跳入古典厚涂油画境 | 约前 2,500 年 · 诺亚方舟】',
    shootStyle: 'HANDHELD IR NIGHT-VISION CAMCORDER ➔ CLASSICAL IMPASTO OIL PAINTING // 手持夜视仪实拍 ➔ 厚涂油画境',
    genre: 'Cathedral Pipe Organ + Rolling Thunder/Rain/Seagull Foley + Deep Whale Sonar',
    title: '贰 · 《圣经》诺亚方舟 · 手持夜视仪恐怖实拍跳入厚涂油画境 · 圣洁三层金羽猫',
    start: 22.0,
    end: 34.0,
    shader: 2,
    vehicle: 'ark_ship',
    mount: 'parchment',
    vfxNotes: [
      {
        tag: '画境① 手持夜视仪恐怖实拍',
        desc: '前半场全屏红外绿磷夜视取景器、镜头雨滴、AF对焦框与闪电反色暴击',
        target: 'ark',
        objName: '【这是：《圣经》三层歌斐木诺亚方舟巨舰 (1.68x 滑动变焦)】',
        objSub: '前半场在红外夜视仪下惊雷翻涌，后半场化作立体刮刀厚涂油画巨舰',
      },
      {
        tag: '画境② 跳入古典厚涂油画境',
        desc: '后半场夜视仪关闭，瞬间跳入透纳式立体刮刀厚涂油画与柔和体积光',
        target: 'sky',
        objName: '【这是：厚涂油画云海体积光 & 衔橄榄枝白鸽】',
        objSub: '体积光严格锁定在方舟云洞内并在交界前平滑消散，绝不穿帮越界',
      },
      {
        tag: '画境③ 圣洁三层七羽白鸽猫',
        desc: '猫咪背部展开三层7根金边纯白初级飞羽与次级覆羽，头顶天使光环',
        target: 'cat',
        objName: '【这是：圣洁三层金边白鸽羽翼大航海船长猫】',
        objSub: '远近双翼共14根独立雕琢飞羽与金色羽轴，手握旋转黄金船舵',
      },
    ],
  },
  {
    id: 'era03',
    short: '03 殷商朝歌 (前1300)',
    eraNum: '03',
    year: 'c. 1,300 – 1,046 BCE',
    chronoTag: '【画境：跳入商周乌金青铜拓片与朱砂金石画境 | 约前 1,300 年 · 中国殷商朝歌】',
    shootStyle: 'SHANG BRONZE RUBBING MEDIUM × LIVE TV INTERVIEW & VARIETY FX // 乌金青铜金石画境 × 新闻采访与综艺花字',
    genre: 'Shang Bronze Bells + Oracle Fire-Crack/Furnace/Warhorse Foley + 808 Rap',
    title: '叁 · 中国殷商·朝歌四阿重屋宫城 · 跳入青铜金石拓印画境 · 现场采访与纵目青铜猫',
    start: 34.0,
    end: 46.0,
    shader: 4,
    vehicle: 'shang_chariot',
    mount: 'shang_bronze',
    vfxNotes: [
      {
        tag: '画境① 朝歌四阿重屋金石画',
        desc: '三层九级夯土崇台 + 十九级王阶 + 重檐太室主殿与天命玄鸟负日',
        target: 'horizon',
        objName: '【这是：殷商朝歌“四阿重屋”太室王宫与九级夯土崇台】',
        objSub: '含左右塾配殿、七根朱漆青铜础巨柱、青铜鸱尾与玄鸟负日图腾',
      },
      {
        tag: '画境② 错峰采访与综艺花字',
        desc: '前半场《朝歌卫视》贞人持麦采访+卜辞卷轴 → 后半场独立切换综艺花字零遮挡',
        target: 'foundry',
        objName: '【这是：司母戊大方鼎与青铜陶范熔铸巨炉】',
        objSub: '伴随甲骨烈火劈啪爆裂声、熔铜炉风箱呼啸声与战马嘶鸣环境音',
      },
      {
        tag: '画境③ 三星堆纵目青铜饕餮猫',
        desc: '绿松石铜锈神兽猫突出黄金柱状纵目，手持发光契刻龟甲',
        target: 'cat',
        objName: '【这是：三星堆/殷商黄金纵目青铜饕餮神兽猫】',
        objSub: '方尊底座、夔龙卷角、黄金柱状纵目与悬浮朱砂卜辞龟甲',
      },
    ],
  },
  {
    id: 'era04',
    short: '04 古希腊奥运 (前776)',
    eraNum: '04',
    year: '776 – 500 BCE',
    chronoTag: '【画境：跳入黑白网点热血漫画境 ➔ 雅典红绘重彩陶瓶画境 | 前 776 年 · 古希腊奥运】',
    shootStyle: 'BLACK & WHITE MANGA INK REALITY ➔ ATTIC POLYCHROME VASE // 黑白网点漫画境 ➔ 古典红绘彩画境',
    genre: 'Olympian Dual-Guitar Rock + Stadium Crowd Roar/Horn/Whip Foley + Lyre',
    title: '肆 · 古希腊雅典卫城与奥运会 · 跳入黑白热血漫画与红绘彩陶画境 · 斯巴达肌肉猫',
    start: 46.0,
    end: 58.0,
    shader: 3,
    vehicle: 'chariot',
    mount: 'greek_vase',
    vfxNotes: [
      {
        tag: '画境① 跳入黑白网点漫画境',
        desc: '前半场世界与角色化作高反差黑白漫画网点与G笔速度线，后半场绽放红绘金彩',
        target: 'horizon',
        objName: '【这是：雅典卫城帕特农神庙群与雅典娜·帕特农青铜巨像】',
        objSub: '前半场呈现黑白漫画分镜质感，后半场绽放爱琴海古典金红重彩',
      },
      {
        tag: '画境② 黄金残影与卫星测速',
        desc: '斜切黑白漫画分镜框+拟声词「轰隆隆!!」→ 奥运卫星实时激光测速仪',
        target: 'center',
        objName: '【这是：古希腊黄金飞马浮雕战车 (3道光学冲刺残影)】',
        objSub: '伴随十万观众排山倒海欢呼声浪、裁判青铜号角与战车马鞭破空声',
      },
      {
        tag: '画境③ 帕特农大理石斯巴达猫',
        desc: '倒三角八块腹肌纯白大理石战神猫披绯红战袍，高举奥运圣火',
        target: 'cat',
        objName: '【这是：帕特农纯白大理石八块腹肌斯巴达战神猫】',
        objSub: '头戴科林斯红缨金盔、身披迎风绯红战袍，高举熊熊燃烧的奥运火炬',
      },
    ],
  },
  {
    id: 'era05',
    short: '05 盛唐长安 (公元750)',
    eraNum: '05',
    year: '750 CE (天宝九载)',
    chronoTag: '【画境：跳入青绿山水长卷 ×《盗梦空间》九天折叠长安城 | 公元 750 年 · 盛唐长安】',
    shootStyle: 'BLUE-GREEN SHANSHUI SCROLL × INCEPTION DREAM-FOLDING CITY // 青绿山水画境 × 盗梦空间云端折叠长安',
    genre: 'Grand Imperial Tang Po-Zhen-Yue Symphony + Sheng/Brass/Choir + Camel Bells & Hawkers',
    title: '伍 · 盛唐长安万国来朝 · 跳入青绿山水与《盗梦空间》九天折叠长安画境 · 丝路驼队',
    start: 58.0,
    end: 70.0,
    shader: 5,
    vehicle: 'tang_floral',
    mount: 'tang_scroll',
    vfxNotes: [
      {
        tag: '画境① 青绿山水×盗梦折叠城',
        desc: '千里江山石青石绿设色 + 苍穹之上 180° 镜像倒悬《盗梦空间》云端长安宫阙',
        target: 'horizon',
        objName: '【这是：大明宫含元殿龙尾道 & 苍穹倒悬《盗梦空间》云端长安城】',
        objSub: '将“九天阊阖开宫殿”化作《盗梦空间》天地折叠奇观，配《秦王破阵乐》交响',
      },
      {
        tag: '画境② 丝绸之路胡商双峰驼队',
        desc: '粟特胡商牵引满载云锦丝绸与唐三彩的双峰骆驼队 + 驼铃与商贩吆喝',
        target: 'camel',
        objName: '【这是：丝绸之路西域粟特胡商与双峰骆驼商队】',
        objSub: '满载长安云锦与唐三彩，伴随清脆双音铜驼铃与西市胡饼美酒叫卖声',
      },
      {
        tag: '画境③ 大唐直播弹幕与飞天猫',
        desc: '顶部有序单轨弹幕流（零遮挡气泡）+ 敦煌飞天波斯猫弹奏曲颈琵琶',
        target: 'cat',
        objName: '【这是：盛唐敦煌飞天雪白波斯御猫 (怀抱四弦曲颈琵琶)】',
        objSub: '梳双环望仙髻、簪牡丹花钿，身披吴带当风七彩飞天长飘带',
      },
    ],
  },
  // ==================== 第二大部分（Act II · 第 06–10 幕：宋元明清、大航海与科学工业曙光） ====================
  {
    id: 'era06',
    short: '06 北宋汴京 (公元1000)',
    eraNum: '06',
    year: 'c. 960 – 1127 CE (北宋)',
    chronoTag: '【画境：跳入《清明上河》宣纸渗墨 × 毕昇活字立体升降画境 | 公元 1000 年 · 北宋汴京】',
    shootStyle: 'SONG XUAN-PAPER INK BLEED × CCTV MECHANICAL X-RAY LOUPE // 宣纸水墨画境 × 水运仪象台微距透视',
    genre: 'Song Literati Guqin & Xiao + Su Song Clock Tower Escapement Bell + Rain on Bamboo & Oars',
    title: '陆 · 中国北宋·汴京虹桥与水运仪象台 · 跳入宣纸渗墨与活字宋词画境 · 汝窑冰裂纹茶猫',
    start: 70.0,
    end: 82.0,
    shader: 6,
    vehicle: 'song_wheelbarrow',
    mount: 'song_scroll',
    vfxNotes: [
      {
        tag: '画境① 水运仪象台与汴京虹桥',
        desc: '苏颂三层木构水运仪象台（浑仪/浑象/枢轮实时运转）与无柱木拱虹桥横跨汴河',
        target: 'horizon',
        objName: '【这是：北宋苏颂“水运仪象台”天文钟塔 & 汴河木拱虹桥】',
        objSub: '世界最早擒纵机械天文钟塔（1088年），底层水轮驱动顶层浑仪与报时木人',
      },
      {
        tag: '画境② 毕昇胶泥活字与交子钞',
        desc: '天空悬浮升降毕昇泥活字矩阵印出苏轼宋词 + 地面飘飞北宋“交子”纸币',
        target: 'sky',
        objName: '【这是：毕昇胶泥活字印刷矩阵 & 北宋成都“交子”铜版纸币】',
        objSub: '活字印块随古琴洞箫节拍立体起伏，伴随江南潇潇春雨打竹叶与汴河摇橹声',
      },
      {
        tag: '画境③ 汝窑天青冰裂纹东坡猫',
        desc: '通体天青色汝窑瓷釉布满金丝铁线冰裂纹，戴东坡巾、捧建盏点茶吞吐茶烟',
        target: 'cat',
        objName: '【这是：北宋汝窑天青釉“金丝冰裂纹”茶道词人猫】',
        objSub: '头戴苏轼高筒东坡巾，手捧建窑兔毫盏，车首搭载宋代水罗盘（指南鱼）',
      },
    ],
  },
  {
    id: 'era07',
    short: '07 元明清运河 (1368-1700)',
    eraNum: '07',
    year: '1271 – 1700 CE (元明清)',
    chronoTag: '【画境：跳入八大山人白眼水墨木刻 ➔ 景德镇青花瓷高光釉面画境 | 元明清 · 运河与宝船】',
    shootStyle: 'BADA SHANREN WOODBLOCK INK ➔ COBALT BLUE PORCELAIN GLAZE // 八大山人木刻 ➔ 青花瓷釉画境',
    genre: 'Kunqu Flute & Peking Opera Jinghu + Rapid Abacus Bead Clicks + Zheng He Fleet Horn & Canal Foley',
    title: '柒 · 中国元明清·京杭运河与郑和宝船 · 跳入八大山人水墨与青花瓷画境 · 京剧大靠算盘猫',
    start: 82.0,
    end: 94.0,
    shader: 7,
    vehicle: 'ming_carriage',
    mount: 'ming_porcelain',
    vfxNotes: [
      {
        tag: '画境① 八大山人木刻➔青花瓷境',
        desc: '前半场化作八大山人极简白眼水墨与徽派木刻版画，后半场窑变为景德镇青花瓷釉',
        target: 'horizon',
        objName: '【这是：郑和下西洋九桅赤帆宝船舰队 & 京杭运河徽派马头墙古镇】',
        objSub: '远海九桅宝船巨舰乘风破浪，近岸粉墙黛瓦临水戏台上演元曲《牡丹亭》',
      },
      {
        tag: '画境② 户部珠算连击与戏曲台',
        desc: '右上角《大明珠算连击》实时解算三下五除二 + 运河拱桥倒影雕版木刻字',
        target: 'sky',
        objName: '【这是：明代红木七珠算盘 & 景德镇缠枝莲纹元青花大罐】',
        objSub: '伴随清脆竹算盘高速拨珠声、京剧小锣“台—台—仓”亮相与运河桨声',
      },
      {
        tag: '画境③ 八大山人白眼京剧大靠猫',
        desc: '方形翻白眼水墨神态，披青花瓷铠甲、背插四面靠旗、戴双长雉鸡翎拨黄金算盘',
        target: 'cat',
        objName: '【这是：八大山人“翻白眼”青花瓷京剧武生大靠猫】',
        objSub: '集八大山人冷眼水墨神韵与京剧武生四面靠旗、双翎子功于一身',
      },
    ],
  },
  {
    id: 'era08',
    short: '08 印加与大航海 (1492)',
    eraNum: '08',
    year: 'c. 1492 – 1600 CE (大航海)',
    chronoTag: '【画境：跳入16世纪铜版蚀刻海图 ×《盗梦空间》大西洋海天双城折叠画境 | 1492 · 印加与大航海】',
    shootStyle: 'COPPERPLATE NAUTICAL MAP × INCEPTION OCEAN-ANDES FOLD + SPYGLASS POV // 铜版海图 × 盗梦海天折叠',
    genre: 'Andean Zampoña Panpipes × Spanish Flamenco Guitar + Ship Bell, Sails & Macaw Foley',
    title: '捌 · 美洲印加太阳城与跨大西洋航线 · 跳入铜版海图与《盗梦空间》海天折叠画境 · 黄金太阳猫',
    start: 94.0,
    end: 106.0,
    shader: 8,
    vehicle: 'davinci_gear',
    mount: 'nautical_map',
    vfxNotes: [
      {
        tag: '画境① 盗梦空间海天双城折叠',
        desc: '地面是马丘比丘印加石城与玛雅金字塔，苍穹 180° 倒悬跨大西洋卡拉维尔帆船队',
        target: 'horizon',
        objName: '【这是：马丘比丘印加太阳城 & 苍穹 180° 倒悬跨大西洋帆船舰队】',
        objSub: '东西半球在《盗梦空间》式海天折叠中交汇，配阿兹特克/玛雅太阳历石盘',
      },
      {
        tag: '画境② 达·芬奇手摇木齿轮单车',
        desc: '还原《大西洋古抄本》灯笼木齿轮传动 + 右侧船长黄铜单筒望远镜光学取景器',
        target: 'crank',
        objName: '【这是：达·芬奇《大西洋古抄本》灯笼齿轮木构单车 & 航海六分仪】',
        objSub: '伴随安第斯排箫与西班牙弗拉门戈吉他共鸣、帆布猎猎风声与航海铜钟',
      },
      {
        tag: '画境③ 印加黄金太阳神羽蛇猫',
        desc: '纯金锤揲身躯佩戴16道光芒印加太阳神因蒂黄金面具，背生绿咬鹃长尾羽冠',
        target: 'cat',
        objName: '【这是：印加纯金太阳神（Inti）面具与绿咬鹃羽冠图腾猫】',
        objSub: '脸戴16道锯齿金光太阳神黄金面具，手持黄铜六分仪仰测南十字星',
      },
    ],
  },
  {
    id: 'era09',
    short: '09 工业与梵高科学 (1869)',
    eraNum: '09',
    year: 'c. 1780 – 1889 CE (工业与科学)',
    chronoTag: '【画境：维多利亚老胶片 ➔ 跳入梵高《星月夜》旋涡厚涂 × 化学周期表与细胞进化画境 | 1869】',
    shootStyle: 'VICTORIAN SEPIA FILM ➔ VAN GOGH STARRY SWIRL × BBC 400X MICROSCOPE // 梵高旋涡油画 × 显微镜实拍',
    genre: 'Victorian Brass & Romantic Strings + Steam Locomotive Chug/Whistle & Bubbling Flask Foley',
    title: '玖 · 欧洲工业革命与科学觉醒 · 跳入梵高《星月夜》旋涡油画与微观生物化学境 · 蒸汽博士猫',
    start: 106.0,
    end: 118.0,
    shader: 9,
    vehicle: 'penny_farthing',
    mount: 'van_gogh_frame',
    vfxNotes: [
      {
        tag: '画境① 梵高星月夜×进化树与元素',
        desc: '梵高《星月夜》狂野厚涂旋涡星云中演化出达尔文生命进化树与1869门捷列夫周期表',
        target: 'sky',
        objName: '【这是：梵高《星月夜》厚涂旋涡星云 × 达尔文进化树与门捷列夫元素表】',
        objSub: '艺术与科学交融：星云旋涡直接化作有机苯环分子、元素卡牌与分裂细胞',
      },
      {
        tag: '画境② 维多利亚大小轮与火车',
        desc: '60英寸巨型前轮高轮车飞驰过红砖工厂与蒸汽火车铁桥 + BBC 400倍显微镜视窗',
        target: 'horizon',
        objName: '【这是：斯蒂芬森蒸汽机车高架铁桥 & 维多利亚前大后小高轮车】',
        objSub: '伴随蒸汽火车头活塞喷气声、长鸣汽笛声与化学实验室烧瓶沸腾冒泡声',
      },
      {
        tag: '画境③ 蒸汽朋克礼帽化学博士猫',
        desc: '戴齿轮冒烟高筒礼帽与单片黄铜显微镜，一手摇晃荧光化学烧瓶、一手托细胞皿',
        target: 'cat',
        objName: '【这是：维多利亚蒸汽朋克高礼帽化学与生物疯博士猫】',
        objSub: '礼帽顶端蒸汽烟囱随节拍喷气，左眼单片显微镜实时观察有丝分裂',
      },
    ],
  },
  {
    id: 'era10',
    short: '10 电磁跨洋黎明 (1873)',
    eraNum: '10',
    year: 'c. 1831 – 1873 CE (电磁学)',
    chronoTag: '【画境：跳入法拉第铁粉磁力线蓝图 × 麦克斯韦电磁波谱实时发光场画境 | 1873 · 跨大西洋电报】',
    shootStyle: 'FARADAY MAGNETIC FLUX VISION × MORSE TELEGRAPH SPECTRUM HUD // 实时发光磁感线场 × 莫尔斯电报译码',
    genre: 'Analog Synth Arpeggio & Classical Strings + Morse Telegraph Clicks, 60Hz Hum & Harbor Foghorn',
    title: '拾 · 欧美现代工业黎明与跨大西洋电报 · 跳入法拉第与麦克斯韦发光电磁场画境 · 磁流体电报猫',
    start: 118.0,
    end: 130.0,
    shader: 10,
    vehicle: 'safety_dynamo',
    mount: 'faraday_flux',
    vfxNotes: [
      {
        tag: '画境① 麦克斯韦发光磁感线场',
        desc: '全屏浮现法拉第偶极子闭合磁力线与正交电磁波 E⊥B，麦克斯韦方程沿磁力线流淌',
        target: 'sky',
        objName: '【这是：麦克斯韦电磁方程组 (∇×E = -∂B/∂t) & 实时正交电磁波谱场】',
        objSub: '车轮紫铜线圈切割磁感线产生感应电流，点亮跨大西洋海底电报港城',
      },
      {
        tag: '画境② 安全型钻石车与海底电缆',
        desc: '红蓝N/S马蹄形巨磁铁与法拉第圆盘发电机 + 远景“大东方号”铺设大西洋海底电缆剖面',
        target: 'horizon',
        objName: '【这是：法拉第红蓝 N/S 马蹄巨磁铁发电机 & “大东方号”海底电缆剖面】',
        objSub: '伴随莫尔斯电报机清脆“滴滴答答”发报声、60Hz电磁嗡鸣与远洋轮船汽笛',
      },
      {
        tag: '画境③ 铁磁流体紫铜线圈电报猫',
        desc: '暗银色铁磁流体身躯随磁场炸起尖刺皇冠，缠绕发光紫铜螺线管飞速敲击电报机',
        target: 'cat',
        objName: '【这是：法拉第紫铜螺线管与铁磁流体（Ferrofluid）电报员猫】',
        objSub: '体表铁磁流体随磁场脉冲呈皇冠状尖刺，双爪敲击莫尔斯电报发射蓝白电弧',
      },
    ],
  },
  // ==================== 第三大部分（Act III · 第 11–15 幕：交流电、相对论与3D高斯时间千足虫、现代奥运、硅谷开源与全球互联） ====================
  {
    id: 'era11',
    short: '11 特斯拉交流电 (1895)',
    eraNum: '11',
    year: 'c. 1893 – 1901 CE (电流之战)',
    chronoTag: '【画境：跳入尼古拉·特斯拉百万伏特蓝紫电弧 × 尼亚加拉水电与不夜城画境 | 1895 · 美加交界与纽约】',
    shootStyle: 'TESLA HIGH-VOLTAGE CORONA BLOOM × NIAGARA TURBINE CUTAWAY // 高压电弧辉光 × 水轮机透视特写',
    genre: 'Tesla Singing Arc Synth + 1890s Ragtime Piano + Niagara Waterfall Roar & High-Voltage Zap Foley',
    title: '拾壹 · 美国纽约与尼亚加拉水电站 · 跳入尼古拉·特斯拉百万伏特交流电弧画境 · 法拉第笼雷电猫',
    start: 130.0,
    end: 142.0,
    shader: 11,
    vehicle: 'tesla_lightning',
    mount: 'tesla_coil',
    vfxNotes: [
      {
        tag: '画境① 沃登克里弗塔与电流之战',
        desc: '特斯拉巨型球顶无线输电塔劈出百万伏特分形蓝紫闪电，点亮芝加哥世博会与纽约摩天楼',
        target: 'sky',
        objName: '【这是：尼古拉·特斯拉沃登克里弗无线输电塔 & 百万伏特高压电弧】',
        objSub: '交流电（AC）战胜直流电点亮人类黑夜，电弧随歌唱线圈旋律实时劈裂夜空',
      },
      {
        tag: '画境② 尼亚加拉瀑布水轮发电机',
        desc: '美加交界尼亚加拉大瀑布奔涌水幕驱动威斯汀豪斯巨型多相交流水轮发电机组',
        target: 'horizon',
        objName: '【这是：美加交界尼亚加拉大瀑布 & 1895 威斯汀豪斯交流水电站】',
        objSub: '伴随尼亚加拉大瀑布震耳水声、高压电弧噼啪爆裂声与拉格泰姆钢琴律动',
      },
      {
        tag: '画境③ 法拉第笼特斯拉雷电猫',
        desc: '头戴紫铜法拉第屏蔽笼、全身环绕蓝紫色球形闪电的特斯拉实验员猫',
        target: 'cat',
        objName: '【这是：身披紫白分形电弧的“特斯拉法拉第笼雷电科学猫”】',
        objSub: '双爪托举无线感应发光真空霓虹灯管，球形闪电车轮在高压绝缘瓷瓶车架下飞驰',
      },
    ],
  },
  {
    id: 'era12',
    short: '12 相对论×时间千足虫 (1905)',
    eraNum: '12',
    year: '1905 – 1915 CE (相对论与四维时空)',
    chronoTag: '【画境：跳入爱因斯坦引力透镜弯曲时空 × 3D高斯点云“冯内古特四维时间千足虫”画境 | 1905–1915】',
    shootStyle: '3D GAUSSIAN SPLATTING 4D SPACETIME CENTIPEDE × GRAVITATIONAL LENSING // 3D高斯点云时间轨迹 × 引力透镜',
    genre: 'Einstein Solo Violin Chaconne + Cosmic Glass Armonica + Pulsar Gravitational-Wave Chirp & Alpine Wind',
    title: '拾贰 · 爱因斯坦相对论与落基山天文台 · 跳入【3D高斯点云·冯内古特四维时间千足虫】弯曲时空画境',
    start: 142.0,
    end: 154.0,
    shader: 12,
    vehicle: 'relativity_photon',
    mount: 'spacetime_grid',
    vfxNotes: [
      {
        tag: '画境① 3D高斯点云·时间千足虫',
        desc: '将视频过去每一帧姿态转成3D高斯发光点云并按时间排列在同一空间，时间化作可见长尾',
        target: 'sky',
        objName: '【这是：3D高斯点云四维世界线 · 冯内古特“时间千足虫”轨迹】',
        objSub: '高维视角下过去与现在的每个瞬间同时陈列眼前，从远古石轮到此刻拖出绚丽3D点云长尾',
      },
      {
        tag: '画境② 引力透镜与多普勒光子车',
        desc: '大质量黑洞/日食使落基山星空与路面时空网格弯曲，单车前轮蓝移、后轮红移',
        target: 'horizon',
        objName: '【这是：广义相对论引力透镜日食星场 (Gμν=8πTμν) & 落基山圆顶天文台】',
        objSub: '伴随爱因斯坦挚爱的独奏小提琴旋律、双黑洞并合引力波啾鸣声与雪山寒风',
      },
      {
        tag: '画境③ 蓬松白发爱因斯坦小提琴猫',
        desc: '顶着标志性爆炸白发与八字胡、拉奏小提琴并悬浮达利式弯曲相对论怀表的物理猫',
        target: 'cat',
        objName: '【这是：拉奏巴赫小提琴曲的“爱因斯坦相对论弯曲时钟猫”】',
        objSub: '身边环绕光速不变公式 E=mc² 与随引力场慢放膨胀的黄金飞翼怀表',
      },
    ],
  },
  {
    id: 'era13',
    short: '13 现代奥运五环 (1936-1984)',
    eraNum: '13',
    year: '20th Century CE (现代奥林匹克)',
    chronoTag: '【画境：跳入新海诚式高饱和阳光耀斑动画 × 现代奥林匹克五环和平盛典画境 | 全球五大洲连通】',
    shootStyle: 'SHINKAI ANAMORPHIC SUN-FLARE ANIME × 1000FPS SLOW-MO SPRINT TELEMETRY // 阳光耀斑动画 × 升格冲刺特写',
    genre: 'Grand Olympic Brass Fanfare + Timpani & Slap Bass Sprint + 100,000 Crowd Roar, Starter Pistol & Doves',
    title: '拾叁 · 现代奥林匹克主体育场与五大洲和平 · 跳入高饱和阳光耀斑与五环破风冲刺画境 · 奥运金牌猫',
    start: 154.0,
    end: 166.0,
    shader: 13,
    vehicle: 'carbon_olympic',
    mount: 'olympic_stadium',
    vfxNotes: [
      {
        tag: '画境① 现代奥运主火炬与五环旗',
        desc: '巨型流线型主体育场圣火熊熊燃烧，蓝黄黑绿红奥运五环升起，百羽和平白鸽振翅齐飞',
        target: 'sky',
        objName: '【这是：现代奥林匹克主火炬塔、五环和平旗帜与漫天和平白鸽】',
        objSub: 'Citius · Altius · Fortius —— 跨越国界与大洋的全球体育和平盛典',
      },
      {
        tag: '画境② 碳纤维五环破风碟轮赛车',
        desc: '前轮为奥运五环全封闭破风碟轮、后轮三刀碳纤维轮 + 1000fps 终点光电冲刺特写',
        target: 'crank',
        objName: '【这是：现代碳纤维空气动力学破风计时赛车 (五环封闭碟轮)】',
        objSub: '伴随奥运铜管交响号角、发令枪响、十万观众排山倒海欢呼与相机快门连拍声',
      },
      {
        tag: '画境③ 奥运桂冠金牌解说冠军猫',
        desc: '胸挂纯金奥运奖牌、头戴橄榄桂冠、手持发令枪与实况麦克风的金牌冠军猫',
        target: 'cat',
        objName: '【这是：胸佩纯金五环奖牌的“奥林匹克桂冠冠军解说猫”】',
        objSub: '头戴古今传承的翠绿橄榄枝桂冠，挥舞五环彩带为五大洲健儿呐喊助威',
      },
    ],
  },
  {
    id: 'era14',
    short: '14 硅谷车库与开源 (1975-1991)',
    eraNum: '14',
    year: '1975 – 1991 CE (硅谷与开源萌芽)',
    chronoTag: '【画境：泰克绿磷示波器矢量实拍 ➔ 跳入 8-Bit 复古像素游戏与 TCP/IP 万维网开源画境 | 硅谷—美加走廊】',
    shootStyle: 'TEKTRONIX P1 GREEN OSCILLOSCOPE ➔ 8-BIT PIXEL ART & TERMINAL UI // 绿磷示波器 ➔ 8-Bit像素与终端画境',
    genre: '8-Bit NES Chiptune Pulse/Triangle Synth + 56K Modem Handshake, Floppy Seek & Mechanical Keyboard Foley',
    title: '拾肆 · 美国硅谷车库与美加科研走廊 · 跳入绿磷示波器与 8-Bit 像素开源代码画境 · 极客黑客猫',
    start: 166.0,
    end: 178.0,
    shader: 14,
    vehicle: 'pixel_bmx',
    mount: 'crt_monitor',
    vfxNotes: [
      {
        tag: '画境① 绿磷示波器➔8-Bit像素境',
        desc: '前半场呈现泰克P1绿磷示波器荧光余晖，后半场全屏量子化为8-Bit复古像素与开源代码树',
        target: 'sky',
        objName: '【这是：泰克绿磷 CRT 示波器 & ARPANET / WWW 万维网开源协议树】',
        objSub: '从硅谷车库焊台、大型机磁带柜走向 TCP/IP、GNU/Linux 与 HTML 全球开源共享',
      },
      {
        tag: '画境② 绿色PCB主板与软盘单车',
        desc: '车轮由3.5英寸软盘与发光硅晶圆构成，车架是焊满IC芯片与LED灯的绿色PCB印刷电路板',
        target: 'crank',
        objName: '【这是：绿色 PCB 印刷电路板车架 & 3.5英寸软盘/硅晶圆 BMX 单车】',
        objSub: '伴随正宗8-Bit芯片音乐、56K调制解调器拨号握手音与青轴机械键盘清脆敲击声',
      },
      {
        tag: '画境③ 像素墨镜极客开源黑客猫',
        desc: '戴8-Bit像素墨镜、怀抱复古CRT显示器飞速敲击键盘提交 Hello World 开源代码的极客猫',
        target: 'cat',
        objName: '【这是：佩戴像素墨镜的“硅谷车库 8-Bit 开源极客黑客猫”】',
        objSub: '头顶弹出 `$ git commit -m "Open Source for All"` 绿色终端浮动窗口',
      },
    ],
  },
  {
    id: 'era15',
    short: '15 全球化五洲互联 (2000-2015)',
    eraNum: '15',
    year: 'c. 2000 – 2015 CE (全球化黄金时代)',
    chronoTag: '【画境：跳入极光流体毛玻璃 × 五大洲跨国高铁与全球开源地球村全息画境 | 亚·欧·美·非·拉全线点亮】',
    shootStyle: 'AURORA FLUID GLASS REALITY × 5-CONTINENT HOLOGRAPHIC TELEMETRY // 极光流体玻璃画境 × 五洲全息航线',
    genre: '5-Continent World-Fusion Symphony (Dizi + Kalimba + Cello + Prog Synth) + High-Speed Rail Whoosh Foley',
    title: '拾伍 · 全球化黄金时代大都会 · 跳入极光流体玻璃与五洲高铁开源互联画境 · 地球村领航猫',
    start: 178.0,
    end: 190.0,
    shader: 15,
    vehicle: 'aero_globe',
    mount: 'aurora_glass',
    vfxNotes: [
      {
        tag: '画境① 五洲全息地球村与极光航线',
        desc: '苍穹悬浮3D发光地球村，中国、北美、欧洲、非洲、拉美五大洲开源节点与海底光纤全线点亮',
        target: 'sky',
        objName: '【这是：五大洲开源协作全息地球村 & 跨洋光缆/航空极光数据流】',
        objSub: '五大洲地标天际线同框辉映，全球知识、贸易与开源代码零阻碍自由流动',
      },
      {
        tag: '画境② 跨国高速列车与极光光环车',
        desc: '中景双层跨国高铁复兴号/欧洲之星飞驰而过，鹈鹕骑乘无轮毂空心极光光纤通勤车',
        target: 'horizon',
        objName: '【这是：跨国流线型高速铁路廊桥 & 无轮毂空心极光光纤折叠单车】',
        objSub: '伴随竹笛、非洲拇指琴、大提琴与电子合成器的五洲大合奏及高铁呼啸进站音',
      },
      {
        tag: '画境③ 五洲全息地球仪领航员猫',
        desc: '身穿流光银白领航服、双爪托起旋转五大洲全息发光地球仪与和平羽翼的领航猫',
        target: 'cat',
        objName: '【这是：托举五洲全息地球仪的“全球开源共同体领航员猫”】',
        objSub: '地球仪周围环绕五大洲语言问候弹幕与实时跳动的全球开源贡献光点',
      },
    ],
  },
];

TIMELINE.forEach((era) => {
  era.worldStartX = era.start * WORLD_SPEED;
  era.worldEndX = era.end * WORLD_SPEED;
  era.worldWidth = era.worldEndX - era.worldStartX;
});

const TOTAL_DURATION = TIMELINE[TIMELINE.length - 1].end; // 70.0s

function hash11(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function noise1D(x) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3.0 - 2.0 * f);
  return hash11(i) * (1.0 - u) + hash11(i + 1.0) * u;
}

function getRoadY(worldX, H = 720) {
  const base = H * 0.77;
  const gentleWave = Math.sin(worldX * 0.0018) * 8 + Math.cos(worldX * 0.0042) * 3.5;
  return base + gentleWave;
}

function getEraAtWorldX(worldX) {
  for (let i = 0; i < TIMELINE.length; i++) {
    if (worldX >= TIMELINE[i].worldStartX && worldX < TIMELINE[i].worldEndX) {
      return { index: i, era: TIMELINE[i] };
    }
  }
  const last = TIMELINE.length - 1;
  return { index: last, era: TIMELINE[last] };
}

/**
 * Helper to compute slice-local progress and smooth seam boundary attenuation (`seamFade`)
 * so that Volumetric God-Rays and Broadcast UI in `era02` fade out smoothly BEFORE `era03` and NEVER pierce across the seam!
 */
function getSliceTiming(eraObj, t) {
  const dur = Math.max(0.0001, eraObj.end - eraObj.start);
  const sliceT = t - eraObj.start;
  const sliceProgress = Math.max(0, Math.min(1, sliceT / dur));
  // Smooth fade-in over first 8% and fade-out over last 10% of the era so nothing clips across seams!
  const fadeIn = Math.max(0, Math.min(1, sliceProgress / 0.08));
  const fadeOut = Math.max(0, Math.min(1, (1.0 - sliceProgress) / 0.10));
  const seamFade = fadeIn * fadeOut;
  return { sliceT, sliceProgress, seamFade };
}

function computeCinemaCamera(era, localT, localProgress, t, beatPulse) {
  let camZoom = 1.0;
  if (era.id === 'intro') {
    camZoom = 1.0 + Math.sin(localProgress * Math.PI) * 0.06;
  } else if (localProgress < 0.18) {
    camZoom = 1.0 + Math.sin((localProgress / 0.18) * Math.PI) * 0.12;
  } else if (era.id === 'era04' && localProgress > 0.38 && localProgress < 0.88) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.38) / 0.50) * Math.PI) * 0.11;
  } else if (era.id === 'era06' && localProgress > 0.32 && localProgress < 0.85) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.32) / 0.53) * Math.PI) * 0.13;
  } else if (era.id === 'era07' && localProgress > 0.34 && localProgress < 0.72) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.34) / 0.38) * Math.PI) * 0.14;
  } else if (era.id === 'era08' && localProgress > 0.25 && localProgress < 0.82) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.25) / 0.57) * Math.PI) * 0.13;
  } else if (era.id === 'era09' && localProgress > 0.28 && localProgress < 0.86) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.28) / 0.58) * Math.PI) * 0.14;
  } else if (era.id === 'era10' && localProgress > 0.30 && localProgress < 0.88) {
    camZoom = 1.0 + Math.sin(((localProgress - 0.30) / 0.58) * Math.PI) * 0.12 + beatPulse * 0.025;
  }

  let bgDollyScale = 1.0;
  let dollyActive = 0.0;
  if (era.id === 'era02') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.24 + u * 0.44;
  } else if (era.id === 'era03') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.12) / 0.76)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.05 + u * 0.16;
  } else if (era.id === 'era05') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.12) / 0.76)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.04 + u * 0.15;
  }

  // Exact Speed-of-Sound Synchronization for Era 01 Lion Roar (4.0s cycle)
  let lionJawOpen = 0.0;
  let roarWaveProgress = -1.0;
  let lionGroundTremor = 0.0;
  if (era.id === 'era01') {
    const roarCycle = localT % 4.0;
    if (roarCycle >= 0.05 && roarCycle <= 1.65) {
      lionJawOpen = Math.sin(Math.min(1, (roarCycle - 0.05) / 0.25) * (Math.PI * 0.5))
                  * Math.max(0, Math.min(1, (1.65 - roarCycle) / 0.35));
    }
    if (roarCycle >= 0.22 && roarCycle <= 2.10) {
      roarWaveProgress = (roarCycle - 0.22) / 1.88;
    }
    if (roarCycle >= 0.44 && roarCycle <= 1.84) {
      lionGroundTremor = Math.sin(((roarCycle - 0.44) / 1.40) * Math.PI);
    }
  }

  // Era 02 Handheld Night-Vision Camcorder Intensity (1.0 in first half 0..0.46, smoothly transitions to 0.0 Impasto Oil Painting in second half 0.52..1.0!)
  let nightVisionAmount = 0.0;
  let oilImpastoAmount = 0.0;
  if (era.id === 'era02') {
    nightVisionAmount = Math.max(0, Math.min(1, (0.50 - localProgress) * 8.0));
    oilImpastoAmount = Math.max(0, Math.min(1, (localProgress - 0.46) * 6.0));
  }

  // Era 04 Black-and-White Manga Ink Intensity (1.0 in first half 0.08..0.46, transitions to Full Polychrome Red-Figure in second half!)
  let mangaInkAmount = 0.0;
  if (era.id === 'era04') {
    if (localProgress > 0.05 && localProgress < 0.50) {
      mangaInkAmount = Math.sin(((localProgress - 0.05) / 0.45) * Math.PI);
    }
  }

  // Era 05 & Era 08 Inception Sky-City / Ocean-Andes Folding Intensity
  let inceptionFoldAmount = 0.0;
  if (era.id === 'intro') {
    inceptionFoldAmount = 0.65;
  } else if (era.id === 'era05' || era.id === 'era08') {
    inceptionFoldAmount = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.06) / 0.88)) * Math.PI);
  }

  // Act II Dolly Zooms & Dimensional Art-Medium Envelopes (era06..era10)
  if (era.id === 'era06') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.06 + u * 0.18;
  } else if (era.id === 'era07') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.10 + u * 0.28;
  } else if (era.id === 'era08') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.12) / 0.76)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.08 + u * 0.22;
  } else if (era.id === 'era09') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.15) / 0.75)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.06 + u * 0.20;
  } else if (era.id === 'era10') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.08 + u * 0.24;
  } else if (era.id === 'era11') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.10 + u * 0.28;
    camZoom = 1.0 + Math.sin(localProgress * Math.PI) * 0.12 + beatPulse * 0.03;
  } else if (era.id === 'era12') {
    // Einstein 4D Spacetime & 3D Gaussian Centipede Panoramic Pull-Back & Zoom!
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.08) / 0.84)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.12 + u * 0.30;
    camZoom = 1.0 + Math.sin(localProgress * Math.PI * 2) * 0.09;
  } else if (era.id === 'era13') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.12) / 0.78)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.08 + u * 0.24;
    camZoom = 1.0 + Math.sin(localProgress * Math.PI) * 0.14;
  } else if (era.id === 'era14') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.10) / 0.80)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.06 + u * 0.20;
  } else if (era.id === 'era15') {
    const u = Math.sin(Math.max(0, Math.min(1, (localProgress - 0.08) / 0.84)) * Math.PI);
    dollyActive = u;
    bgDollyScale = 1.10 + u * 0.28;
    camZoom = 1.0 + Math.sin(localProgress * Math.PI) * 0.12;
  }

  let swayX = 0;
  let swayY = 0;
  let dutchRoll = 0;
  if (era.id === 'era01') {
    const tremor = lionGroundTremor * 7.2;
    swayX = Math.sin(t * 2.4) * 2.0 + Math.sin(t * 58.0) * tremor;
    swayY = Math.cos(t * 3.0) * 1.5 + Math.cos(t * 64.0) * tremor;
    dutchRoll = Math.sin(t * 45.0) * lionGroundTremor * 0.012;
  } else if (era.id === 'era02' && localProgress < 0.52) {
    // Authentic handheld night-vision camcorder shake & breathing jitter in the storm!
    swayX = Math.sin(t * 4.5) * 6.5 + Math.cos(t * 17.0) * 2.2 * nightVisionAmount;
    swayY = Math.cos(t * 5.8) * 5.8 + Math.sin(t * 21.0) * 2.2 * nightVisionAmount;
    dutchRoll = Math.sin(t * 3.2) * 0.020;
  } else if (era.id === 'era04' && localProgress > 0.22 && localProgress < 0.88) {
    dutchRoll = -0.014;
  } else if (era.id === 'era08') {
    // Authentic Atlantic ocean swell & Inception dream-folding camera roll!
    swayX = Math.sin(t * 2.2) * 4.5;
    swayY = Math.cos(t * 2.8) * 4.0;
    dutchRoll = Math.sin(t * 1.8) * 0.015;
  } else if (era.id === 'era09') {
    // Swirling Van Gogh Starry Night painterly breathing camera!
    swayX = Math.sin(t * 2.0) * 3.2;
    swayY = Math.cos(t * 2.5) * 2.8;
    dutchRoll = Math.cos(t * 1.6) * 0.012;
  }

  const lightningWave = Math.sin(t * 9.5);
  const lightningFlash = (era.id === 'era02' && localProgress < 0.48 && lightningWave > 0.90)
    ? (lightningWave - 0.90) * 10.0
    : 0.0;

  return {
    camZoom,
    bgDollyScale,
    dollyActive,
    swayX,
    swayY,
    dutchRoll,
    lightningFlash,
    lionJawOpen,
    roarWaveProgress,
    lionGroundTremor,
    lionRoarIntensity: lionGroundTremor,
    nightVisionAmount,
    oilImpastoAmount,
    mangaInkAmount,
    inceptionFoldAmount,
  };
}

function getBeatState(rawT, W = 1280) {
  const t = Math.max(0, Math.min(TOTAL_DURATION, rawT));
  const beat = t / BEAT_DURATION;
  const bar = t / BAR_DURATION;
  const beatPhase = beat - Math.floor(beat);
  const barPhase = bar - Math.floor(bar);
  const beatPulse = Math.exp(-beatPhase * 5.2);

  const pelicanWorldX = t * WORLD_SPEED;
  const pelicanScreenX = W * 0.40;
  const cameraLeftWorldX = pelicanWorldX - pelicanScreenX;
  const cameraRightWorldX = cameraLeftWorldX + W;

  const { index: eraIndex, era } = getEraAtWorldX(pelicanWorldX);
  const localT = t - era.start;
  const dur = Math.max(0.0001, era.end - era.start);
  const localProgress = Math.max(0, Math.min(1, localT / dur));

  const MORPH_HALF_W = 240;
  let seamScreenX = -9999;
  let seamWorldX = -9999;
  let leftEra = era;
  let rightEra = era;
  let morphFactor = 0.0;

  for (let i = 0; i < TIMELINE.length - 1; i++) {
    const swx = TIMELINE[i].worldEndX;
    if (swx >= cameraLeftWorldX - 260 && swx <= cameraRightWorldX + 260) {
      seamWorldX = swx;
      seamScreenX = swx - cameraLeftWorldX;
      leftEra = TIMELINE[i];
      rightEra = TIMELINE[i + 1];
      const dist = pelicanWorldX - swx;
      morphFactor = Math.max(0, Math.min(1, (dist + MORPH_HALF_W) / (MORPH_HALF_W * 2)));
      break;
    }
  }

  const cam = computeCinemaCamera(era, localT, localProgress, t, beatPulse);

  return {
    t, beat, bar, beatPhase, barPhase, beatPulse,
    eraIndex, era, localT, localProgress,
    pelicanWorldX, pelicanScreenX,
    cameraLeftWorldX, cameraRightWorldX,
    seamScreenX, seamWorldX, leftEra, rightEra, morphFactor, MORPH_HALF_W,
    cam,
  };
}
