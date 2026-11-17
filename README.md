# 🦩 《鹈鹕测试 · 六千年跨次元重制版》 (Pelican Test: 6000 Years Remastered)

[![Inspired By](https://img.shields.io/badge/Inspired_By-orbitoo%2Fpelican--test-blue?style=for-the-badge&logo=github)](https://github.com/orbitoo/pelican-test)
[![Showcase Credit](https://img.shields.io/badge/Discovery-%40Super__Nius_on_X-black?style=for-the-badge&logo=x)](https://x.com/Super_Nius/status/2122056852708225478?a=o2fggBim3aE0xAWrtEw&s=20)
[![Tech Stack](https://img.shields.io/badge/Engine-p5.js_%2B_WebGL2_GLSL_%2B_Web_Audio-ff69b4?style=for-the-badge)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](./LICENSE)

> **零外部图片、零预录音频、零 AI 视频生成大模型 —— 100% 纯代码实时演算的 20 幕人类文明与艺术史跨次元动画短片。**  
> **Zero external images, zero audio samples, zero AI video models — A 100% pure-code procedural animated short film across 20 eras of civilization and art history (`p5.js` + `WebGL2 GLSL` + `Procedural Web Audio`).**

## 📜 灵感溯源与开源致谢 (Inspiration & Upstream Attribution)

本项目是一次基于开源精神的**深度致敬、洁净室重写（Clean-Room Rewrite）与跨维度导演重构**，在此向原项目与灵感来源致谢：

1. **原始灵感帖 (Discovery & Showcase)**：启发自博主 **[@Super_Nius](https://x.com/Super_Nius/status/2122056852708225478?a=o2fggBim3aE0xAWrtEw&s=20)** 在 X（Twitter）上分享的纯代码生成动画演示（[查看原推文](https://x.com/Super_Nius/status/2122056852708225478?a=o2fggBim3aE0xAWrtEw&s=20)）。
2. **上游致敬开源仓库 (Upstream Repository)**：**[`orbitoo/pelican-test`](https://github.com/orbitoo/pelican-test)**（*A 2:17 procedural code animation short film across 20 art-history eras using p5.js + p5.brush + Web Audio*）。在致敬其“鹈鹕骑单车跨越二十个艺术史时期”核心命题的基础上，注入了全新的中外文明编年考据、六向电影运镜与跨次元实时着色器。更多文化与技术考据详见 **[`CREDITS.md`](./CREDITS.md)**。

## 📊 原版仓库 vs. 本重制版核心重构对比 (Upstream vs. Remastered Evolution)

| 维度 (Dimension) | 原版 [`orbitoo/pelican-test`](https://github.com/orbitoo/pelican-test) | 本项目 `Wuli-Blizzard/pelican-6000-years` (跨次元重制版) |
| :--- | :--- | :--- |
| **核心叙事与角色** | 单角色（鹈鹕骑单车）横跨 20 个艺术史时期 | **鹈鹕 + 后座“薛定谔的猫 ($\vert{}\psi\rangle$)”双角色互动**，每幕配备时代专属服装、身份变身与零遮挡错峰对话气泡 |
| **历史时间线考据** | 20 个艺术风格切片 | **严格校准中外文明编年史顺序**（如修正殷商青铜时代早于古希腊奥林匹亚），划分为 **4 大篇章 × 5 幕（外加序幕共 21 幕）** |
| **跨次元渲染管线** | `p5.js` + `p5.brush` 2D 矢量与笔触 | **2D 程序化手绘 + `WebGL2 GLSL` 实时光学着色器**（850nm 手持红外夜视仪、3D 刮刀厚涂油画、45° 旋转黑白漫画网点、八大山人宣纸泼墨、1300°C 苏麻离青瓷釉、四维闵可夫斯基引力透镜） |
| **天地六合全向骑行** | 传统 2D 横版从左往右平路骑行 | **“天地为方、前后左右为合”六向宇宙空间骑行（6-DOF）**（支持垂直俯冲瀑布/仰冲雷云、Z 轴迎面正视冲刺/向深空远去、90° 俯瞰/地面极限仰视及《盗梦空间》180° 苍穹折叠城） |
| **跨幕转场机制** | 固定前景柱遮挡擦除 | **15 道零重复“脑洞时空传送门 (Bespoke Time Portals)”**（黄金圆规火环、狮吼碎岩海啸、沸腾青铜龟甲裂兆、活字印刷魔方矩阵、单筒望远镜钻镜、《三体》水滴穿屏等） |
| **前沿视觉黑科技** | 2D 帧动画 | **第 12 幕“真·3D 高斯点云 (3DGS) · 冯内古特时间千足虫”**（将过去十余个历史瞬间以高锐度 3D 高斯实体雕塑形式逐帧凝固并同时陈列在同一三维空间轨迹上） |
| **名著与国漫美学融合** | 西方艺术史流派为主 | 深度融合 **张择端《清明上河图》虹桥降桅、82 版《西游记》大闹天宫激光仙雾、莎士比亚《哈姆雷特》、《红楼梦》刘姥姥游大观园微距奇观、《三体》（水滴/古筝行动/智子展开）及《喜羊羊与灰太狼》《猪猪侠》** 热血卡通动态 |
| **模组化载具架构** | 随时代换色/变形单车 | **五插槽模组化载具契约 (`VehicleContract`)**：独立拆分车轮、异形车架、前叉、强制顶层车把模组与时代挂件，确保 20 幕异形载具（鸡公车、毛笔青花瓶车、卡拉维尔帆船车、马蹄磁铁电弧车等）100% 锁定握把 IK |
| **声景与配乐引擎** | Web Audio 合成器配乐 | **20 支时代考据乐队 + 全景环境拟音（Foley）**（先见狮吼后闻 38Hz 声波震动、龟甲灼裂、古琴吟猱、景德镇瓷瓯击乐、安第斯排箫、莫尔斯电报、LIGO 引力波啾鸣等） |

## 🗂️ 仓库工程结构 (Repository Architecture)

```text
pelican-6000-years/
├── index.html                  # 在线播放器主入口（2.35:1 宽银幕遮幅 UI + 分镜检视画廊，直接支持 GitHub Pages）
├── README.md                   # 项目总览、开源溯源与演进对比
├── CREDITS.md                  # 灵感溯源、上游开源致谢与古今文化艺术考据清单
├── CHANGELOG.md                # 导演审片与版本演进编年史（完整记录 V1.0 至 V6.0 六轮深度迭代）
├── SPEC.md                     # V6.0 唯一权威技术规范书（20 幕分镜标准、15 道传送门、六向运镜与车把强制契约）
├── AI_COLLABORATION_GUIDE.md   # 多 AI 协同开发手册（支持 Gemini / Claude / Cursor / ChatGPT 按幕并行开发）
├── LICENSE                     # MIT 开源许可证
└── src/
    ├── main.js                 # 全局舞台调度、时间轴控制与交互事件
    ├── beat/clock.js           # 120 BPM 主时钟、21 个时间切片剧本、六向相机曲线与台词数据
    ├── rig/pelicanCatIK.js     # 鹈鹕与猫 2-Bone 逆运动学绑定、五插槽模组化变形单车与强制车把锁死
    ├── kit/brushEngine.js      # 跨次元画笔引擎、宏观+微观背景、15 道时空传送门、3D 高斯点云与自动淡出 HUD
    ├── scenes/                 # 连续道路与时代特写道具渲染
    ├── shaders/                # WebGL2 实时后期光学着色器
    ├── gl/pipeline.js          # WebGL2 渲染管线封装
    └── audio/                  # 20 支时代合成器乐队与环境拟音（Foley）引擎