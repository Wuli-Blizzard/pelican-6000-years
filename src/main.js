// === src/main.js ===
const WIDTH = 1280;
const HEIGHT = 720;

const glCanvas = document.getElementById('gl-canvas');
const hud = document.getElementById('hud');
const startOverlay = document.getElementById('start-overlay');
const playBtn = document.getElementById('play-btn');
const seamDemoBtn = document.getElementById('seam-demo-btn');
const vfxToggleBtn = document.getElementById('vfx-toggle-btn');
const muteBtn = document.getElementById('mute-btn');
const viewToggleBtn = document.getElementById('view-toggle-btn');
const scrubber = document.getElementById('scrubber');
const timeLabel = document.getElementById('time-label');
const eraPillsWrap = document.getElementById('era-pills');
const stageWrap = document.getElementById('stage-wrap');
const galleryWrap = document.getElementById('gallery-wrap');
const galleryGrid = document.getElementById('gallery-grid');

scrubber.max = String(TOTAL_DURATION);

let offscreenPg = null;
let glPipeline = null;
const audioEngine = new ProceduralAudio();

// Default preview at t=24.8s (Era 02 Handheld IR Night-Vision Camcorder in full action -> morphs at 28s into Classical Impasto Oil Painting -> crosses into Era 03 at 34s with ZERO God-Ray bleed!)
let currentTime = 72.5; // Default at start of Part 2 (Era 06 Northern Song Bianjing & Su Song Clock Tower!)
let isPlaying = false;
let isGalleryMode = false;
let showVFXCallouts = true;
let lastFrameMs = performance.now();

const pillButtons = TIMELINE.map((era, idx) => {
  const btn = document.createElement('button');
  btn.className = 'pill';
  btn.textContent = era.short;
  btn.addEventListener('click', () => {
    audioEngine.ensureInit();
    startOverlay.style.display = 'none';
    if (isGalleryMode) toggleGalleryMode(false);
    currentTime = era.start + (era.id === 'intro' ? 1.5 : 2.8);
    isPlaying = true;
    playBtn.textContent = '暂停 Pause';
    lastFrameMs = performance.now();
    renderAt(currentTime);
  });
  eraPillsWrap.appendChild(btn);
  return btn;
});

function renderAt(t) {
  if (!offscreenPg || !glPipeline) return;
  const state = getBeatState(t, WIDTH);
  const rig = computeRig(state, WIDTH, HEIGHT);

  drawContinuousWorld(offscreenPg, state, rig, showVFXCallouts);
  glPipeline.upload(offscreenPg.elt);
  glPipeline.render(state);

  if (isPlaying) audioEngine.triggerForState(state);

  const seamHint = (state.seamScreenX >= 0 && state.seamScreenX <= WIDTH && state.leftEra.id !== state.rightEra.id)
    ? ` · [跨画境无缝穿越: ${state.leftEra.short} ⇄ ${state.rightEra.short}]`
    : ` · [独立配乐+环境音: ${state.era.genre}]`;
  hud.textContent = `[${state.era.eraNum}] ${state.era.title}${seamHint} · t=${state.t.toFixed(2)}s`;
  scrubber.value = String(state.t);
  timeLabel.textContent = `${state.t.toFixed(1)} / ${TOTAL_DURATION.toFixed(1)}s`;
  pillButtons.forEach((b, i) => b.classList.toggle('active', i === state.eraIndex));
}

window.renderAt = renderAt;

function buildGallerySnapshots() {
  galleryGrid.innerHTML = '';
  const savedT = currentTime;
  const snapshots = [
    { label: '00 · 盗梦空间手稿折叠画境 · 苍穹倒悬蓝图建筑 + 科幻全息扫描 + 零遮挡指示坞', t: 2.4 },
    { label: '01 · 矿物重彩岩画境 · 先见雄狮张口→声波抵镜后震动 + 迁徙巨象群 + 国家地理地震仪', t: 14.6 },
    { label: '02(上) · 手持红外夜视摄像机实拍 · 绿磷夜视+四角取景器+AF对焦框+镜头滑落水珠', t: 24.8 },
    { label: '02(下) · 跳入古典厚涂油画境 · 刮刀油画肌理 + 体积光在交界前平滑收拢(0%越界穿帮)', t: 30.2 },
    { label: '03 · 商周青铜金石拓印画境 · 综艺花字与指示框/气泡话四区零碰撞分层 + 四阿重屋', t: 41.2 },
    { label: '04 · 跳入高反差黑白网点热血漫画境(保留圣火金红彩点) → 雅典红绘彩陶画境', t: 49.2 },
    { label: '05 · 青绿山水长卷 ×《盗梦空间》苍穹180°倒悬折叠长安城 + 破阵乐交响与丝路驼队', t: 63.8 },
    { label: '06 · 北宋《清明上河》宣纸渗墨画境 · 苏颂水运仪象台 + 汴京虹桥 + 汝窑冰裂纹东坡茶猫', t: 74.2 },
    { label: '07 · 元明清八大山人白眼木刻 ➔ 景德镇青花瓷釉画境 · 郑和九桅宝船 + 京剧大靠算盘猫', t: 89.2 },
    { label: '08 · 16世纪铜版海图 ×《盗梦空间》大西洋海天双城折叠 · 马丘比丘 + 印加黄金太阳神猫', t: 99.4 },
    { label: '09 · 维多利亚前大后小高轮车 ➔ 梵高《星月夜》旋涡油画 × 达尔文进化树与周期表 + 蒸汽博士猫', t: 112.4 },
    { label: '10 · 法拉第偶极磁感线与麦克斯韦电磁波画境 · 跨大西洋电报大东方号 + 铁磁流体皇冠电报猫', t: 123.6 },
    { label: '11 · 特斯拉百万伏特交流电之战 · 沃登克里弗塔分形闪电 + 尼亚加拉水电 + 法拉第笼雷电猫', t: 135.2 },
    { label: '12 · 爱因斯坦相对论 ×【3D高斯点云·冯内古特四维时间千足虫】过去18帧姿态同屏排列奇观', t: 147.6 },
    { label: '13 · 现代奥林匹克五环和平盛典 · 阳光耀斑主火炬塔 + 五环破风碳纤维碟轮 + 金牌桂冠猫', t: 159.4 },
    { label: '14 · 硅谷车库泰克绿磷示波器 ➔ 8-Bit像素与TCP/IP开源画境 · PCB主板软盘车 + 像素极客猫', t: 172.2 },
    { label: '15 · 全球化黄金时代五洲互联 · 3D全息地球村 + 跨国高铁复兴号 + 无轮毂极光光纤单车', t: 183.6 },
  ];
  snapshots.forEach((snap) => {
    renderAt(snap.t);
    const dataUrl = glCanvas.toDataURL('image/jpeg', 0.88);
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.innerHTML = `
      <img src="${dataUrl}" alt="${snap.label}" />
      <div class="gallery-meta">
        <span class="gallery-tag">t = ${snap.t.toFixed(1)}s</span>
        <strong>${snap.label}</strong>
      </div>
    `;
    card.addEventListener('click', () => {
      audioEngine.ensureInit();
      startOverlay.style.display = 'none';
      toggleGalleryMode(false);
      currentTime = snap.t;
      isPlaying = true;
      playBtn.textContent = '暂停 Pause';
      lastFrameMs = performance.now();
      renderAt(currentTime);
    });
    galleryGrid.appendChild(card);
  });
  renderAt(savedT);
}

function toggleGalleryMode(forceState) {
  isGalleryMode = typeof forceState === 'boolean' ? forceState : !isGalleryMode;
  if (isGalleryMode) {
    isPlaying = false;
    playBtn.textContent = '播放 Play';
    buildGallerySnapshots();
    stageWrap.style.display = 'none';
    galleryWrap.style.display = 'block';
    viewToggleBtn.textContent = '返回长卷播放 Player';
  } else {
    stageWrap.style.display = 'block';
    galleryWrap.style.display = 'none';
    viewToggleBtn.textContent = '分镜检视 Gallery';
  }
}

function tick(nowMs) {
  const dt = Math.min(0.05, (nowMs - lastFrameMs) / 1000);
  lastFrameMs = nowMs;
  if (isPlaying && !isGalleryMode) {
    currentTime += dt;
    if (currentTime >= TOTAL_DURATION) currentTime = 0;
    renderAt(currentTime);
  }
  requestAnimationFrame(tick);
}

new window.p5((p) => {
  p.setup = () => {
    p.noCanvas();
    p.pixelDensity(1);
    offscreenPg = p.createGraphics(WIDTH, HEIGHT);
    offscreenPg.pixelDensity(1);
    glPipeline = new WebGLPostPipeline(glCanvas);
    renderAt(currentTime);
    requestAnimationFrame(tick);
  };
});

function startPlaybackWithAudio(startFromZero = false) {
  audioEngine.ensureInit();
  startOverlay.style.display = 'none';
  if (isGalleryMode) toggleGalleryMode(false);
  if (startFromZero) currentTime = 0.0;
  isPlaying = true;
  playBtn.textContent = '暂停 Pause';
  lastFrameMs = performance.now();
}

function togglePlay() {
  audioEngine.ensureInit();
  startOverlay.style.display = 'none';
  if (isGalleryMode) toggleGalleryMode(false);
  isPlaying = !isPlaying;
  playBtn.textContent = isPlaying ? '暂停 Pause' : '播放 Play';
  lastFrameMs = performance.now();
}

startOverlay.addEventListener('click', () => startPlaybackWithAudio(false));
playBtn.addEventListener('click', togglePlay);
glCanvas.addEventListener('click', togglePlay);
viewToggleBtn.addEventListener('click', () => toggleGalleryMode());

if (vfxToggleBtn) {
  vfxToggleBtn.addEventListener('click', () => {
    showVFXCallouts = !showVFXCallouts;
    vfxToggleBtn.textContent = showVFXCallouts ? '✨ 特效导览: ON' : '✨ 特效导览: OFF';
    renderAt(currentTime);
  });
}

seamDemoBtn.addEventListener('click', () => {
  audioEngine.ensureInit();
  startOverlay.style.display = 'none';
  if (isGalleryMode) toggleGalleryMode(false);
  const seams = [10.0, 22.0, 34.0, 46.0, 58.0, 70.0, 82.0, 94.0, 106.0, 118.0, 130.0, 142.0, 154.0, 166.0, 178.0];
  let nextSeam = seams.find((s) => s > currentTime + 0.6) || seams[0];
  currentTime = Math.max(0, nextSeam - 1.8);
  isPlaying = true;
  playBtn.textContent = '暂停 Pause';
  lastFrameMs = performance.now();
  renderAt(currentTime);
});

muteBtn.addEventListener('click', () => {
  audioEngine.ensureInit();
  audioEngine.setMuted(!audioEngine.isMuted);
  muteBtn.textContent = audioEngine.isMuted ? '静音 Muted' : '声音 On';
});

scrubber.addEventListener('input', (e) => {
  startOverlay.style.display = 'none';
  if (isGalleryMode) toggleGalleryMode(false);
  isPlaying = false;
  playBtn.textContent = '播放 Play';
  currentTime = parseFloat(e.target.value);
  renderAt(currentTime);
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.code === 'KeyM') {
    muteBtn.click();
  } else if (e.code === 'KeyG') {
    toggleGalleryMode();
  } else if (e.code === 'KeyV' && vfxToggleBtn) {
    vfxToggleBtn.click();
  } else if (e.code === 'ArrowLeft') {
    isPlaying = false;
    playBtn.textContent = '播放 Play';
    currentTime = Math.max(0, currentTime - (e.shiftKey ? 2.0 : 0.5));
    renderAt(currentTime);
  } else if (e.code === 'ArrowRight') {
    isPlaying = false;
    playBtn.textContent = '播放 Play';
    currentTime = Math.min(TOTAL_DURATION, currentTime + (e.shiftKey ? 2.0 : 0.5));
    renderAt(currentTime);
  }
});
