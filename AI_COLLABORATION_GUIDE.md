# 🤖 多 AI 协同开发指南 (AI Collaboration Guide)

本仓库专为 **人类导演 + 多个 AI（Gemini / Claude / ChatGPT / Cursor）协同开发** 设计。当你希望让任意 AI 协助修改某一幕或某一个模块时，请按以下流程操作：

## 1. 给其他 AI 发送任务时的标准指令模板

你可以直接复制以下这段话发给任何已连接本 GitHub 仓库的 AI：

```text
请先完整阅读本仓库根目录下的 `README.md` 与 `SPEC.md`。
本项目致敬自开源仓库 orbitoo/pelican-test，但我们正在执行 V6.0 电影级精修。
现在请你严格按照 `SPEC.md` 中的要求，专门负责修改【第 XX 幕】的画面、运镜与载具细节：
1. 严禁删除或破坏单车的车把模组（HandlebarModule），必须确保鹈鹕翅膀紧握车把且车把位于前景层可见；
2. 严禁让左上角特效文字常驻遮挡画面（必须遵循触发后自动淡出规范）；
3. 必须同时包含宏观地标建筑与微观动态细节，结合 `SPEC.md` 指定的经典名著/动画画风与六向空间运镜；
4. 修改完成后请确保 `index.html` 可零报错完整运行。
```

## 2. 核心源码文件职责导航 (`Directory Map`)

* `index.html`：主入口页面、2.35:1 电影遮幅 UI 与分镜导航控制栏（置顶于仓库根目录，直接支持 GitHub Pages）。
* `SPEC.md`：V6.0 唯一权威需求总纲（含 15 道时空传送门、车把强制协议、六向骑行与 06–15 幕名著融合细节）。
* `src/beat/clock.js`：20 幕时间轴、BPM 节拍器、六向相机运镜曲线与剧本台词定义。
* `src/rig/pelicanCatIK.js`：鹈鹕与薛定谔的猫骨骼绑定（IK）、五插槽模组化变形单车与车把强制渲染。
* `src/kit/brushEngine.js`：跨次元画笔引擎、00–15 幕宏观+微观背景绘制、3D 高斯点云时间千足虫、时空传送门与 HUD 浮层。
* `src/scenes/act1MuseumMagic.js`：前期博物馆级分幕场景渲染器。
* `src/shaders/act1Shaders.js` & `src/gl/pipeline.js`：WebGL2 实时后期着色器（红外夜视、刮刀厚涂、黑白网点、宣纸渗墨、青花瓷釉等）。
* `src/audio/genreBandEngine.js`：20 支时代专属合成器乐队与拟音（Foley）引擎。
