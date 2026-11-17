// === src/rig/pelicanCatIK.js ===
// V6 Dimensional Art-Medium Adaptive Rig + Collision-Free Speech Bubble Bounding Box + 3-Tiered Dove-Winged Cat!

function solve2BoneIK(root, target, l1, l2, bendDir = 1) {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const distRaw = Math.hypot(dx, dy);
  const maxReach = Math.max(0.001, l1 + l2 - 0.01);
  const minReach = Math.abs(l1 - l2) + 0.01;
  const dist = Math.max(minReach, Math.min(maxReach, distRaw));

  const baseAngle = Math.atan2(dy, dx);
  const cosAngle = Math.max(-1, Math.min(1, (l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist)));
  const jointAngle = baseAngle + bendDir * Math.acos(cosAngle);

  return {
    root,
    joint: { x: root.x + Math.cos(jointAngle) * l1, y: root.y + Math.sin(jointAngle) * l1 },
    end: { x: root.x + (dx / (distRaw || 1)) * dist, y: root.y + (dy / (distRaw || 1)) * dist },
  };
}

function computeRig(state, W = 1280, H = 720) {
  const { t, beat, beatPulse, pelicanWorldX, pelicanScreenX, cam } = state;
  const crankAngle = beat * Math.PI;
  const wheelR = 54;

  // V6.0 6-DOF Cosmic Riding Parameters ("天地为方、前后左右为合")
  const ridePitch = (cam && cam.ridePitch) ? cam.ridePitch : 0.0;
  const altOffset = (cam && cam.rideAltitudeOffset) ? cam.rideAltitudeOffset : 0.0;
  const wbComp = (cam && cam.wheelbaseCompress) ? cam.wheelbaseCompress : 1.0;
  const frontScale = (cam && cam.frontWheelScale) ? cam.frontWheelScale : 1.0;
  const rearScale = (cam && cam.rearWheelScale) ? cam.rearWheelScale : 1.0;
  const stretchX = (cam && cam.squashStretchX) ? cam.squashStretchX : 1.0;
  const squashY = (cam && cam.squashStretchY) ? cam.squashStretchY : 1.0;

  const rearDx = -96 * wbComp * stretchX;
  const frontDx = 100 * wbComp * stretchX;
  const rearWorldX = pelicanWorldX + rearDx;
  const frontWorldX = pelicanWorldX + frontDx;

  const baseRearY = getRoadY(rearWorldX, H) + (cam ? cam.swayY : 0) + altOffset - Math.sin(ridePitch) * 92;
  const baseFrontY = getRoadY(frontWorldX, H) + (cam ? cam.swayY : 0) + altOffset + Math.sin(ridePitch) * 96;
  const rearGroundY = baseRearY;
  const frontGroundY = baseFrontY;
  const centerGroundY = (rearGroundY + frontGroundY) * 0.5;
  const roadSlope = Math.atan2(frontGroundY - rearGroundY, Math.max(60, frontDx - rearDx));

  const centerX = pelicanScreenX + (cam ? cam.swayX : 0);
  const bob = (Math.sin(crankAngle * 2) * 4.0 - beatPulse * 3.2) * squashY;
  const pitch = roadSlope + Math.cos(crankAngle * 2) * 0.032;

  const rearWheel = { x: centerX + rearDx, y: rearGroundY - wheelR, scale: rearScale };
  const frontWheel = { x: centerX + frontDx, y: frontGroundY - wheelR, scale: frontScale };
  const bb = { x: centerX - 6 * wbComp, y: centerGroundY - wheelR + 3 + bob * 0.35 };
  const seatPost = { x: centerX - 46 * wbComp, y: centerGroundY - 128 * squashY + bob * 0.85 };
  const headTubeTop = { x: centerX + 60 * wbComp, y: frontGroundY - 140 * squashY + bob * 0.65 };
  const handlebar = { x: centerX + 48 * wbComp, y: frontGroundY - 154 * squashY + bob * 0.65 };

  const crankR = 24;
  const pedalNear = { x: bb.x + Math.cos(crankAngle) * crankR, y: bb.y + Math.sin(crankAngle) * crankR };
  const pedalFar = { x: bb.x + Math.cos(crankAngle + Math.PI) * crankR, y: bb.y + Math.sin(crankAngle + Math.PI) * crankR };

  const hip = { x: seatPost.x + 6, y: seatPost.y - 10 };
  const shoulder = { x: centerX + 3, y: centerGroundY - 170 + bob };
  const nearLeg = solve2BoneIK(hip, pedalNear, 56, 58, -1);
  const farLeg = solve2BoneIK(hip, pedalFar, 56, 58, -1);
  const wingIK = solve2BoneIK(shoulder, handlebar, 46, 42, 1);

  const head = {
    x: centerX + 32 + Math.cos(crankAngle) * 4.0,
    y: centerGroundY - 222 + bob * 1.15 + Math.sin(crankAngle * 2 - 0.5) * 4.5,
  };
  const pouchJiggle = Math.sin(crankAngle * 2 - 1.1) * 6.8 + beatPulse * 4.8;
  const beakOpen = Math.max(0, Math.sin(beat * Math.PI * 2)) * 6.5 + beatPulse * 3.5;

  const catSeat = { x: rearWheel.x - 16, y: rearWheel.y - 72 + bob * 0.9 };
  const catTailPhase = Math.sin(beat * Math.PI * 1.5) * 0.72;
  const catEarTwitch = Math.pow(Math.max(0, Math.sin(t * 7.3)), 12) * 5;
  const catBlink = (t % 3.4) > 3.24;

  return {
    groundY: centerGroundY, centerX, crankAngle, bob, pitch, wheelR,
    rearWheel, frontWheel, bb, seatPost, headTubeTop, handlebar,
    pedalNear, pedalFar, hip, shoulder, nearLeg, farLeg, wingIK,
    head, pouchJiggle, beakOpen,
    catSeat, catTailPhase, catEarTwitch, catBlink,
    activeBubbleRect: null,
  };
}

const ERA_RIG_THEMES = {
  intro: {
    stroke: [242, 214, 158], fillBody: [62, 48, 34], shadeBody: [38, 28, 18], rimLight: [255, 236, 190],
    fillWing: [82, 64, 46], fillPouch: [175, 122, 64], fillBeak: [224, 166, 82],
    frameBase: [168, 128, 76], frameHi: [245, 218, 162], styleMode: 'blueprint', vehicle: 'blueprint',
    pelicanQuote: '跳入达·芬奇折叠手稿画境！巴洛克赋格与齿轮校准完毕！',
    catQuote: '咔哒～本喵已化作黄金发条机械猫 |ψ⟩，前方破纸进入岩彩画境！',
  },
  era01: {
    stroke: [38, 20, 10], fillBody: [212, 134, 72], shadeBody: [148, 76, 34], rimLight: [255, 215, 145],
    fillWing: [172, 92, 42], fillPouch: [232, 152, 68], fillBeak: [245, 188, 92],
    frameBase: [122, 74, 38], frameHi: [215, 154, 92], styleMode: 'cave', vehicle: 'stone_roller',
    pelicanQuote: '跳入远古矿物岩彩画！先见雄狮张口，声波抵镜才触发震动！',
    catQuote: '嗷呜！剑齿猎豹战神猫在此，金贝鼓与迁徙巨象共鸣！',
  },
  era02: {
    stroke: [32, 24, 18], fillBody: [246, 240, 228], shadeBody: [188, 178, 162], rimLight: [255, 252, 240],
    fillWing: [226, 216, 198], fillPouch: [235, 168, 72], fillBeak: [245, 192, 94],
    frameBase: [118, 78, 44], frameHi: [212, 168, 112], styleMode: 'ark', vehicle: 'ark_ship',
    pelicanQuote: '前半场手持红外夜视仪恐怖实拍，后半场跳入古典厚涂油画境！',
    catQuote: '本喵展开三层7羽金边白鸽飞羽与天使光环，掌稳黄金船舵！',
  },
  era03: {
    stroke: [238, 224, 188], fillBody: [36, 48, 44], shadeBody: [18, 26, 24], rimLight: [118, 242, 208],
    fillWing: [48, 68, 62], fillPouch: [218, 168, 88], fillBeak: [238, 196, 108],
    frameBase: [58, 138, 116], frameHi: [242, 204, 102], styleMode: 'shang_bronze', vehicle: 'shang_chariot',
    pelicanQuote: '跳入殷商乌金青铜拓片画境！太室重屋与玄鸟负日气吞山河！',
    catQuote: '三星堆/殷商纵目青铜饕餮神兽猫在此，甲骨裂兆与808震朝歌！',
  },
  era04: {
    stroke: [238, 142, 72], fillBody: [24, 20, 18], shadeBody: [10, 8, 8], rimLight: [255, 195, 120],
    fillWing: [36, 28, 24], fillPouch: [204, 102, 48], fillBeak: [236, 142, 72],
    frameBase: [188, 128, 54], frameHi: [255, 224, 135], styleMode: 'greek', vehicle: 'chariot',
    pelicanQuote: '跳入黑白网点热血漫画境与红绘彩陶画境！双电吉他摇滚全开！',
    catQuote: '帕特农纯白大理石八块腹肌斯巴达战神猫在此，高举奥运圣火！',
  },
  era05: {
    stroke: [36, 24, 18], fillBody: [250, 244, 232], shadeBody: [206, 192, 168], rimLight: [255, 252, 242],
    fillWing: [238, 226, 204], fillPouch: [224, 132, 56], fillBeak: [236, 158, 64],
    frameBase: [178, 46, 34], frameHi: [242, 198, 102], styleMode: 'tang', vehicle: 'tang_floral',
    pelicanQuote: '跳入青绿山水长卷与《盗梦空间》九天折叠长安城！破阵乐奏响！',
    catQuote: '本喵变身盛唐敦煌飞天波斯御猫，伴丝路驼铃与西市吆喝弹琵琶～',
  },
  era06: {
    stroke: [28, 32, 30], fillBody: [244, 239, 226], shadeBody: [186, 182, 168], rimLight: [212, 238, 228],
    fillWing: [228, 224, 210], fillPouch: [198, 138, 76], fillBeak: [218, 162, 88],
    frameBase: [104, 138, 86], frameHi: [182, 214, 156], styleMode: 'song', vehicle: 'song_wheelbarrow',
    pelicanQuote: '跳入《清明上河》宣纸渗墨画境！苏颂水运仪象台与毕昇活字运转！',
    catQuote: '本喵化作北宋汝窑天青冰裂纹东坡茶猫，捧建盏点茶听春雨打竹～',
  },
  era07: {
    stroke: [18, 36, 78], fillBody: [248, 250, 255], shadeBody: [184, 204, 235], rimLight: [255, 255, 255],
    fillWing: [226, 236, 250], fillPouch: [38, 88, 178], fillBeak: [58, 118, 208],
    frameBase: [32, 78, 168], frameHi: [148, 198, 255], styleMode: 'ming', vehicle: 'ming_carriage',
    pelicanQuote: '从八大山人白眼水墨木刻窑变跳入景德镇青花瓷画境！郑和宝船起航！',
    catQuote: '台台仓！本喵乃八大山人翻白眼青花大靠武生猫，背插四面靠旗拨算盘！',
  },
  era08: {
    stroke: [42, 24, 12], fillBody: [238, 216, 178], shadeBody: [176, 142, 96], rimLight: [255, 232, 148],
    fillWing: [212, 182, 132], fillPouch: [228, 148, 48], fillBeak: [245, 188, 68],
    frameBase: [158, 102, 42], frameHi: [248, 206, 98], styleMode: 'inca_nav', vehicle: 'davinci_gear',
    pelicanQuote: '跳入16世纪铜版海图与《盗梦空间》大西洋海天双城折叠画境！',
    catQuote: '印加纯金太阳神面具绿咬鹃羽冠猫在此！手持黄铜六分仪锁定新大陆！',
  },
  era09: {
    stroke: [22, 28, 48], fillBody: [238, 224, 182], shadeBody: [164, 148, 108], rimLight: [255, 228, 98],
    fillWing: [208, 192, 144], fillPouch: [218, 142, 46], fillBeak: [238, 176, 62],
    frameBase: [168, 118, 48], frameHi: [248, 208, 108], styleMode: 'vangogh_ind', vehicle: 'penny_farthing',
    pelicanQuote: '骑维多利亚前大后小高轮车跳入梵高《星月夜》旋涡油画与细胞进化境！',
    catQuote: '蒸汽朋克礼帽疯博士猫在此！左手摇晃元素周期烧瓶，右手观测细胞分裂！',
  },
  era10: {
    stroke: [18, 36, 58], fillBody: [228, 242, 252], shadeBody: [152, 182, 208], rimLight: [98, 242, 255],
    fillWing: [196, 222, 242], fillPouch: [212, 122, 54], fillBeak: [232, 152, 72],
    frameBase: [198, 108, 48], frameHi: [98, 242, 255], styleMode: 'faraday_em', vehicle: 'safety_dynamo',
    pelicanQuote: '跳入法拉第磁感线与麦克斯韦电磁波画境！跨大西洋海底电报全线贯通！',
    catQuote: '滋滋—铁磁流体皇冠电报猫正在敲击莫尔斯电码：LONDON ⇄ NY 1866！',
  },
  era11: {
    stroke: [22, 18, 48], fillBody: [236, 232, 255], shadeBody: [158, 148, 218], rimLight: [198, 138, 255],
    fillWing: [208, 198, 248], fillPouch: [168, 98, 238], fillBeak: [218, 148, 255],
    frameBase: [138, 82, 235], frameHi: [218, 188, 255], styleMode: 'tesla_ac', vehicle: 'tesla_lightning',
    pelicanQuote: '跳入1895尼古拉·特斯拉百万伏特交流电画境！尼亚加拉水电点亮世界！',
    catQuote: '噼啪！本喵头戴法拉第铜笼、脚踏球形闪电轮，无线点亮真空霓虹管！',
  },
  era12: {
    stroke: [24, 28, 52], fillBody: [246, 244, 255], shadeBody: [172, 168, 212], rimLight: [255, 224, 118],
    fillWing: [220, 216, 246], fillPouch: [232, 158, 68], fillBeak: [248, 188, 82],
    frameBase: [82, 188, 255], frameHi: [255, 218, 98], styleMode: 'relativity_4d', vehicle: 'relativity_photon',
    pelicanQuote: '看！3D高斯点云把过去每一帧连成冯内古特“四维时间千足虫”长尾！',
    catQuote: 'E=mc²！爱因斯坦白发小提琴猫在此，高维时空里过去与现在同时绽放！',
  },
  era13: {
    stroke: [22, 32, 48], fillBody: [252, 252, 255], shadeBody: [192, 208, 228], rimLight: [255, 238, 128],
    fillWing: [236, 242, 252], fillPouch: [242, 158, 54], fillBeak: [255, 186, 68],
    frameBase: [28, 138, 238], frameHi: [255, 214, 58], styleMode: 'modern_olympic', vehicle: 'carbon_olympic',
    pelicanQuote: '跳入现代奥林匹克五环盛典画境！碳纤维五环破风碟轮全速冲刺！',
    catQuote: '更快、更高、更强——更团结！奥运金牌桂冠猫放飞百羽和平白鸽！',
  },
  era14: {
    stroke: [12, 42, 24], fillBody: [224, 255, 236], shadeBody: [132, 208, 162], rimLight: [98, 255, 158],
    fillWing: [182, 242, 204], fillPouch: [58, 218, 128], fillBeak: [88, 248, 152],
    frameBase: [24, 158, 82], frameHi: [118, 255, 168], styleMode: 'silicon_8bit', vehicle: 'pixel_bmx',
    pelicanQuote: '从硅谷车库泰克绿磷示波器跳入8-Bit像素与TCP/IP全球开源画境！',
    catQuote: '啪嗒啪嗒！8-Bit像素墨镜极客猫正在敲机械键盘：git push 开源万岁！',
  },
  era15: {
    stroke: [16, 42, 58], fillBody: [242, 252, 255], shadeBody: [168, 214, 236], rimLight: [98, 255, 224],
    fillWing: [212, 242, 252], fillPouch: [68, 218, 198], fillBeak: [98, 242, 224],
    frameBase: [42, 188, 224], frameHi: [148, 255, 232], styleMode: 'global_aurora', vehicle: 'aero_globe',
    pelicanQuote: '跳入全球化极光流体玻璃画境！跨国高铁与五洲开源节点全线点亮！',
    catQuote: '本喵托起3D五大洲全息地球仪，无轮毂极光光环车驶向地球村地平线！',
  },
};

function renderMuseumRigForEra(pg, rig, state, eraObj) {
  const theme = ERA_RIG_THEMES[eraObj.id] || ERA_RIG_THEMES.intro;
  const { stroke, fillBody, shadeBody, rimLight, fillWing, fillPouch, fillBeak, vehicle } = theme;
  const { sliceT, seamFade } = getSliceTiming(eraObj, state.t);

  pg.push();

  // DIRECTOR VFX: In Era 04 (Greek Olympics Anime Sprint), render 2 golden speed afterimage echoes
  if (eraObj.id === 'era04' && state.localProgress > 0.18 && state.localProgress < 0.90) {
    for (let ghost = 2; ghost >= 1; ghost--) {
      pg.push();
      pg.translate(-ghost * 34, 0);
      pg.noFill();
      pg.stroke(255, 208, 78, 95 / ghost);
      pg.strokeWeight(3.0);
      pg.ellipse(rig.rearWheel.x, rig.rearWheel.y, rig.wheelR * 2, rig.wheelR * 2);
      pg.ellipse(rig.frontWheel.x, rig.frontWheel.y, rig.wheelR * 2, rig.wheelR * 2);
      pg.line(rig.hip.x - 20, rig.hip.y, rig.head.x + 80, rig.head.y);
      pg.pop();
    }
  }

  // 0. Ground Contact Shadow
  pg.noStroke();
  pg.fill(0, 0, 0, 95);
  pg.ellipse(rig.rearWheel.x, rig.rearWheel.y + rig.wheelR + 2, rig.wheelR * 1.6, 11);
  pg.ellipse(rig.frontWheel.x, rig.frontWheel.y + rig.wheelR + 2, rig.wheelR * 1.6, 11);
  pg.fill(0, 0, 0, 50);
  pg.ellipse(rig.centerX, rig.groundY + 2, 230, 14);

  // 1. Far Leg
  drawVolumetricLeg(pg, rig.farLeg, stroke, fillBody, shadeBody, fillBeak, 0.62);

  // 2. Radically Transformed Period Vehicle!
  drawRadicallyTransformedVehicle(pg, rig, state, theme, vehicle);

  // 3. Radically Exaggerated Era Persona of Schrödinger's Cat!
  drawExaggeratedEraCat(pg, rig, state, eraObj.id, theme);

  // 4. Volumetric Pelican Torso + Rich Era Costume + Expressive Singing Head
  pg.push();
  for (let i = 0; i < 5; i++) {
    const ang = -2.6 + i * 0.14 + rig.pitch;
    pg.fill(i % 2 === 0 ? fillBody : shadeBody);
    pg.stroke(...stroke);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(rig.hip.x - 18, rig.hip.y - 6);
    pg.quadraticVertex(
      rig.hip.x - 18 + Math.cos(ang) * 32,
      rig.hip.y - 6 + Math.sin(ang) * 32,
      rig.hip.x - 18 + Math.cos(ang - 0.1) * 44,
      rig.hip.y - 6 + Math.sin(ang - 0.1) * 44
    );
    pg.vertex(rig.hip.x - 12, rig.hip.y + 3);
    pg.endShape(pg.CLOSE);
  }

  pg.fill(...fillBody);
  pg.stroke(...stroke);
  pg.strokeWeight(2.8);
  pg.beginShape();
  pg.vertex(rig.hip.x - 26, rig.hip.y - 5);
  pg.bezierVertex(rig.hip.x - 32, rig.hip.y - 46, rig.shoulder.x - 12, rig.shoulder.y - 20, rig.shoulder.x + 18, rig.shoulder.y + 3);
  pg.bezierVertex(rig.shoulder.x + 28, rig.hip.y - 3, rig.hip.x + 20, rig.hip.y + 20, rig.hip.x - 26, rig.hip.y - 5);
  pg.endShape(pg.CLOSE);

  pg.noStroke();
  pg.fill(shadeBody[0], shadeBody[1], shadeBody[2], 195);
  pg.beginShape();
  pg.vertex(rig.hip.x - 24, rig.hip.y - 2);
  pg.bezierVertex(rig.hip.x - 8, rig.hip.y + 14, rig.shoulder.x + 14, rig.hip.y + 5, rig.shoulder.x + 17, rig.shoulder.y + 5);
  pg.bezierVertex(rig.shoulder.x + 22, rig.hip.y + 2, rig.hip.x + 14, rig.hip.y + 19, rig.hip.x - 24, rig.hip.y - 2);
  pg.endShape(pg.CLOSE);

  drawEraPelicanCostume(pg, rig, eraObj.id, state.t, theme);

  // Neck
  pg.fill(...fillBody);
  pg.stroke(...stroke);
  pg.strokeWeight(2.6);
  pg.beginShape();
  pg.vertex(rig.shoulder.x + 3, rig.shoulder.y - 2);
  pg.bezierVertex(rig.shoulder.x - 14, rig.shoulder.y - 30, rig.head.x - 22, rig.head.y + 20, rig.head.x - 10, rig.head.y + 3);
  pg.vertex(rig.head.x + 6, rig.head.y + 6);
  pg.bezierVertex(rig.head.x - 5, rig.head.y + 26, rig.shoulder.x + 6, rig.shoulder.y - 20, rig.shoulder.x + 17, rig.shoulder.y + 5);
  pg.endShape(pg.CLOSE);

  // Head
  pg.fill(...fillBody);
  pg.stroke(...stroke);
  pg.strokeWeight(2.4);
  pg.beginShape();
  pg.vertex(rig.head.x - 11, rig.head.y + 2);
  pg.quadraticVertex(rig.head.x - 22, rig.head.y - 8, rig.head.x - 17, rig.head.y - 3);
  pg.quadraticVertex(rig.head.x - 26, rig.head.y - 14, rig.head.x - 10, rig.head.y - 12);
  pg.quadraticVertex(rig.head.x + 3, rig.head.y - 16, rig.head.x + 11, rig.head.y - 5);
  pg.quadraticVertex(rig.head.x + 13, rig.head.y + 8, rig.head.x - 11, rig.head.y + 2);
  pg.endShape(pg.CLOSE);

  drawEraHeadgear(pg, rig.head, eraObj.id, state.t, theme);

  // Throat Pouch + Animated Singing Jaw
  const beakTip = { x: rig.head.x + 86, y: rig.head.y + 3 + rig.pitch * 24 };
  const pouchMidY = rig.head.y + 36 + rig.pouchJiggle + rig.beakOpen;
  pg.fill(...fillPouch);
  pg.stroke(...stroke);
  pg.strokeWeight(2.2);
  pg.beginShape();
  pg.vertex(rig.head.x + 6, rig.head.y + 5);
  pg.bezierVertex(rig.head.x + 14, pouchMidY + 11, rig.head.x + 54, pouchMidY + 6, beakTip.x - 5, beakTip.y + 2 + rig.beakOpen * 0.6);
  pg.vertex(rig.head.x + 10, rig.head.y - 2);
  pg.endShape(pg.CLOSE);

  // Upper Beak
  pg.fill(...fillBeak);
  pg.stroke(...stroke);
  pg.strokeWeight(2.2);
  pg.beginShape();
  pg.vertex(rig.head.x + 8, rig.head.y - 5);
  pg.quadraticVertex(rig.head.x + 48, rig.head.y - 7 - rig.beakOpen * 0.25, beakTip.x, beakTip.y - 2 - rig.beakOpen * 0.35);
  pg.quadraticVertex(beakTip.x + 5, beakTip.y + 5, beakTip.x - 2, beakTip.y + 8 - rig.beakOpen * 0.2);
  pg.quadraticVertex(rig.head.x + 44, rig.head.y + 3, rig.head.x + 6, rig.head.y + 5);
  pg.endShape(pg.CLOSE);

  // Eye (with IR Night-Vision Eyeshine in Era 02 Storm!)
  const isNV = eraObj.id === 'era02' && state.cam && state.cam.nightVisionAmount > 0.3;
  pg.fill(isNV ? [128, 255, 168] : [250, 225, 115]);
  pg.stroke(...stroke);
  pg.strokeWeight(1.6);
  pg.ellipse(rig.head.x + 2.5, rig.head.y - 3.5, isNV ? 10 : 8, isNV ? 10 : 8);
  pg.fill(16, 16, 20);
  pg.noStroke();
  pg.ellipse(rig.head.x + 3.5, rig.head.y - 3.5, 3.8, 3.8);
  pg.pop();

  drawVolumetricLeg(pg, rig.nearLeg, stroke, fillBody, shadeBody, fillBeak, 1.0);
  drawVolumetricWing(pg, rig.wingIK, stroke, fillWing, shadeBody, rimLight);

  // V6.0 MANDATORY TOP-LAYER FOREGROUND HANDLEBAR MODULE (`VehicleHandlebarContract`):
  // Rendered ON TOP of chassis, sails, torso, and wing so the handlebar at (hbX, hbY) is NEVER occluded!
  drawHandlebarModule(pg, rig, state, theme, vehicle);

  // 5. DIMENSIONAL ART-MEDIUM OVERLAY ON CHARACTER (让角色身体笔触真正融入所跳入的画境！)
  if (eraObj.id === 'intro') {
    // Da Vinci compass construction arcs on the Pelican
    pg.noFill();
    pg.stroke(112, 255, 218, 125);
    pg.strokeWeight(1.2);
    pg.ellipse(rig.bb.x, rig.bb.y, 68, 68);
    pg.ellipse(rig.shoulder.x, rig.shoulder.y, 44, 44);
  } else if (eraObj.id === 'era02' && state.cam && state.cam.oilImpastoAmount > 0.25) {
    // Classical Impasto Oil-Paint Palette-Knife Strokes gleaming on Pelican & Ark Bike!
    const oa = Math.round(195 * state.cam.oilImpastoAmount);
    pg.stroke(255, 238, 168, oa);
    pg.strokeWeight(3.2);
    pg.noFill();
    pg.arc(rig.shoulder.x - 4, rig.shoulder.y + 4, 36, 22, -Math.PI * 0.8, -0.2);
    pg.arc(rig.head.x + 36, rig.head.y - 4, 42, 12, -Math.PI * 0.9, -0.1);
  } else if (eraObj.id === 'era04' && state.cam && state.cam.mangaInkAmount > 0.25) {
    // Manga G-Pen Cross-Hatching Speed Lines on Pelican & Chariot!
    const ma = Math.round(210 * state.cam.mangaInkAmount);
    pg.stroke(20, 16, 14, ma);
    pg.strokeWeight(1.6);
    for (let h = 0; h < 6; h++) {
      pg.line(rig.hip.x - 12 + h * 5, rig.hip.y - 14, rig.hip.x - 22 + h * 5, rig.hip.y - 4);
    }
  } else if (eraObj.id === 'era07') {
    // Cobalt Blue-and-White Porcelain Floral Scrollwork on Pelican Wing!
    pg.noFill();
    pg.stroke(32, 82, 178, 185);
    pg.strokeWeight(1.8);
    pg.arc(rig.shoulder.x - 2, rig.shoulder.y + 4, 24, 18, 0, Math.PI * 1.3);
  } else if (eraObj.id === 'era09' && state.localProgress > 0.38) {
    // Van Gogh Starry Night Dashed Impasto Swirl Strokes around Pelican!
    pg.noFill();
    pg.stroke(255, 224, 78, 195);
    pg.strokeWeight(2.8);
    pg.arc(rig.shoulder.x, rig.shoulder.y, 48, 32, state.t * 2, state.t * 2 + 1.2);
  } else if (eraObj.id === 'era10') {
    // Glowing Faraday Electromagnetic Induction Loops around Wheel Hubs!
    pg.noFill();
    pg.stroke(88, 238, 255, 175);
    pg.strokeWeight(1.8);
    const pulseR = rig.wheelR * (1.18 + 0.14 * Math.sin(state.t * 8));
    pg.ellipse(rig.frontWheel.x, rig.frontWheel.y, pulseR * 2, pulseR * 1.25);
    pg.ellipse(rig.rearWheel.x, rig.rearWheel.y, pulseR * 2, pulseR * 1.25);
  }

  // 6. COLLISION-FREE SPEECH BUBBLE PLACEMENT (Docked strictly in the lower-mid character lane y=275..325, NEVER in the top VFX sky lane y=60..210!)
  // Only render for the primary active era and fade out cleanly near seams!
  if (eraObj.id === state.era.id && seamFade > 0.35) {
    const cycle = sliceT % 10.0;
    if (cycle > 0.6 && cycle < 4.8) {
      // Pelican speech bubble docked cleanly in front of/above the handlebar (y = rig.head.y - 12, x = rig.head.x + 150)
      const bx = Math.min(pg.width - 210, rig.head.x + 148);
      const by = Math.max(255, rig.head.y - 10);
      rig.activeBubbleRect = BrushKit.drawDialogBubble(
        pg, rig.head.x + 28, rig.head.y - 6, bx, by,
        theme.pelicanQuote, [18, 16, 15], theme.frameHi, [252, 244, 225], false
      );
    } else if (cycle >= 5.2 && cycle < 9.4) {
      // Cat speech bubble docked cleanly above the rear wheel rack (y = rig.catSeat.y - 48)
      const bx = Math.max(195, rig.catSeat.x - 6);
      const by = Math.max(265, rig.catSeat.y - 48);
      rig.activeBubbleRect = BrushKit.drawDialogBubble(
        pg, rig.catSeat.x + 4, rig.catSeat.y - 34, bx, by,
        theme.catQuote, [14, 24, 22], [95, 245, 185], [225, 255, 240], true
      );
    }
  }

  pg.pop();
}

function drawSculptedAngelWing(pg, rootX, rootY, flapAngle, scaleX = 1.0, alpha = 250) {
  pg.push();
  pg.translate(rootX, rootY);
  pg.scale(scaleX, 1.0);
  pg.rotate(flapAngle);

  pg.noStroke();
  pg.fill(255, 232, 138, 65);
  pg.ellipse(-28, -14, 62, 34);

  for (let i = 6; i >= 0; i--) {
    const ang = -0.58 + i * 0.17;
    const len = 48 - i * 3.6;
    pg.push();
    pg.rotate(ang);
    pg.fill(255, 254, 250, alpha);
    pg.stroke(212, 178, 92, alpha);
    pg.strokeWeight(1.5);
    pg.beginShape();
    pg.vertex(0, 0);
    pg.quadraticVertex(-len * 0.55, -7.5, -len, -2.0);
    pg.quadraticVertex(-len - 4, 1.5, -len * 0.88, 5.0);
    pg.quadraticVertex(-len * 0.42, 6.2, 0, 2.5);
    pg.endShape(pg.CLOSE);
    pg.stroke(248, 214, 118, alpha * 0.85);
    pg.strokeWeight(1.0);
    pg.line(-3, 0.5, -len * 0.88, -0.5);
    pg.pop();
  }

  for (let i = 4; i >= 0; i--) {
    const ang = -0.45 + i * 0.18;
    const len = 26 - i * 2.0;
    pg.push();
    pg.rotate(ang);
    pg.fill(242, 248, 255, alpha);
    pg.stroke(168, 206, 242, alpha);
    pg.strokeWeight(1.4);
    pg.ellipse(-len * 0.55, 0, len, 8.5);
    pg.pop();
  }

  pg.fill(255, 224, 112, alpha);
  pg.stroke(168, 122, 42, alpha);
  pg.strokeWeight(1.6);
  pg.beginShape();
  pg.vertex(2, -4);
  pg.quadraticVertex(-12, -12, -24, -6);
  pg.quadraticVertex(-12, 2, 2, 3);
  pg.endShape(pg.CLOSE);

  pg.pop();
}

function drawExaggeratedEraCat(pg, rig, state, eraId, theme) {
  pg.push();
  pg.translate(rig.catSeat.x, rig.catSeat.y);

  BrushKit.draw3DTube(pg, 0, 22, rig.rearWheel.x - rig.catSeat.x, rig.rearWheel.y - rig.catSeat.y, theme.frameBase, theme.frameHi, theme.stroke, 2.4);
  BrushKit.draw3DTube(pg, 14, 11, rig.seatPost.x - rig.catSeat.x, rig.seatPost.y - rig.catSeat.y, theme.frameBase, theme.frameHi, theme.stroke, 2.4);

  const headBob = state.beatPulse * 4.2;
  const pawWave = Math.sin(state.t * 14) * 6.5;

  if (eraId === 'intro') {
    pg.fill(58, 44, 28, 210);
    pg.stroke(248, 214, 138);
    pg.strokeWeight(2.0);
    pg.rect(-24, 2, 48, 22, 4);
    pg.push();
    pg.translate(-18, -10);
    pg.rotate(state.t * 5);
    pg.noFill();
    pg.stroke(255, 218, 98);
    pg.strokeWeight(2.5);
    pg.ellipse(0, 0, 16, 16);
    pg.line(-8, 0, 8, 0);
    pg.pop();
    pg.fill(82, 62, 36, 190);
    pg.stroke(248, 214, 138);
    pg.ellipse(0, -4, 30, 24);
    pg.ellipse(6, -20 - headBob * 0.5, 24, 20);
    pg.triangle(-4, -28, 0, -40, 6, -28);
    pg.triangle(6, -28, 14, -40, 15, -26);
    pg.fill(98, 255, 212);
    pg.ellipse(4, -20 - headBob * 0.5, 5, 5);
    pg.ellipse(12, -20 - headBob * 0.5, 5, 5);
  }

  else if (eraId === 'era01') {
    pg.fill(118, 64, 28);
    pg.stroke(38, 20, 10);
    pg.strokeWeight(2.2);
    pg.rect(-26, 4, 52, 20, 4);

    pg.fill(245, 178, 52);
    pg.stroke(38, 20, 10);
    pg.strokeWeight(2.2);
    pg.ellipse(-2, -6, 34, 26);
    pg.fill(42, 20, 8);
    pg.noStroke();
    pg.ellipse(-8, -8, 5, 5);
    pg.ellipse(0, -4, 6, 5);
    pg.ellipse(-4, 0, 5, 4);

    pg.noFill();
    pg.stroke(245, 178, 52);
    pg.strokeWeight(6);
    pg.bezier(-16, -2, -38, -14 + rig.catTailPhase * 15, -42, -34, -24, -40 + rig.catTailPhase * 10);
    pg.stroke(38, 20, 10);
    pg.strokeWeight(2);
    pg.bezier(-16, -2, -38, -14 + rig.catTailPhase * 15, -42, -34, -24, -40 + rig.catTailPhase * 10);

    pg.fill(245, 178, 52);
    pg.stroke(38, 20, 10);
    pg.strokeWeight(2.2);
    pg.ellipse(6, -22 - headBob * 0.5, 26, 22);
    pg.triangle(-4, -30 - headBob * 0.5, 0, -44 - headBob * 0.5, 6, -30 - headBob * 0.5);
    pg.triangle(7, -30 - headBob * 0.5, 14, -44 - headBob * 0.5, 17, -28 - headBob * 0.5);

    pg.fill(238, 68, 42);
    pg.ellipse(0, -48 - headBob * 0.5, 7, 22);
    pg.fill(72, 218, 168);
    pg.ellipse(7, -50 - headBob * 0.5, 7, 24);
    pg.fill(255, 218, 68);
    pg.ellipse(14, -46 - headBob * 0.5, 7, 20);

    pg.fill(255, 238, 78);
    pg.ellipse(3, -23 - headBob * 0.5, 5.5, 6);
    pg.ellipse(12, -23 - headBob * 0.5, 5.5, 6);
    pg.fill(20, 10, 5);
    pg.ellipse(3.5, -23 - headBob * 0.5, 2, 5);
    pg.ellipse(12.5, -23 - headBob * 0.5, 2, 5);

    pg.fill(255, 252, 240);
    pg.stroke(38, 20, 10);
    pg.strokeWeight(1.6);
    pg.triangle(2, -14 - headBob * 0.5, 6, -14 - headBob * 0.5, 4, -2 - headBob * 0.5);
    pg.triangle(11, -14 - headBob * 0.5, 15, -14 - headBob * 0.5, 13, -2 - headBob * 0.5);

    pg.fill(168, 78, 32);
    pg.stroke(248, 214, 142);
    pg.strokeWeight(2);
    pg.quad(16, -8, 34, -8, 29, 14, 21, 14);
    pg.stroke(245, 178, 52);
    pg.strokeWeight(4.5);
    pg.line(10, -8, 24, -10 + pawWave);
    if (state.beatPulse > 0.35) {
      pg.noFill();
      pg.stroke(255, 218, 88, 220 * state.beatPulse);
      pg.strokeWeight(2.2);
      const rWave = (1 - state.beatPulse) * 48 + 14;
      pg.ellipse(25, -8, rWave, rWave * 0.65);
    }
  }

  else if (eraId === 'era02') {
    const flapAngle = Math.sin(state.t * 9.5) * 0.24 + 0.18;
    drawSculptedAngelWing(pg, -2, -16, flapAngle + 0.22, 0.88, 195);

    pg.fill(112, 58, 28);
    pg.stroke(245, 204, 98);
    pg.strokeWeight(2.2);
    pg.quad(-30, 0, 32, -4, 22, 22, -22, 22);

    pg.fill(252, 250, 246);
    pg.stroke(32, 48, 72);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 32, 26);
    pg.fill(28, 64, 118);
    pg.quad(-14, -14, 14, -14, 16, 4, -16, 4);
    pg.fill(255, 212, 72);
    pg.ellipse(-14, -12, 10, 6);
    pg.ellipse(14, -12, 10, 6);

    drawSculptedAngelWing(pg, -8, -11, flapAngle, 1.08, 252);

    pg.fill(252, 250, 246);
    pg.stroke(32, 48, 72);
    pg.strokeWeight(2.0);
    pg.ellipse(6, -22 - headBob * 0.5, 24, 20);
    pg.triangle(-4, -29 - headBob * 0.5, 0, -41 - headBob * 0.5, 5, -29 - headBob * 0.5);
    pg.triangle(7, -29 - headBob * 0.5, 13, -41 - headBob * 0.5, 16, -28 - headBob * 0.5);

    pg.fill(24, 48, 88);
    pg.stroke(255, 214, 82);
    pg.strokeWeight(2.2);
    pg.triangle(-16, -29 - headBob * 0.5, 6, -45 - headBob * 0.5, 28, -29 - headBob * 0.5);
    pg.fill(255, 214, 82);
    pg.ellipse(6, -35 - headBob * 0.5, 7, 7);

    pg.noFill();
    pg.stroke(255, 232, 112, 235);
    pg.strokeWeight(2.6);
    pg.ellipse(6, -51 - headBob * 0.5, 28, 7);

    const isNV = state.cam && state.cam.nightVisionAmount > 0.3;
    pg.fill(isNV ? [128, 255, 168] : [64, 198, 255]);
    pg.noStroke();
    pg.ellipse(3, -22 - headBob * 0.5, isNV ? 6.5 : 5, isNV ? 6.5 : 5.5);
    pg.ellipse(11, -22 - headBob * 0.5, isNV ? 6.5 : 5, isNV ? 6.5 : 5.5);

    pg.push();
    pg.translate(24, -6);
    pg.rotate(state.t * 3.5);
    pg.noFill();
    pg.stroke(255, 208, 78);
    pg.strokeWeight(2.4);
    pg.ellipse(0, 0, 24, 24);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * 15, Math.sin(a) * 15);
    }
    pg.pop();
  }

  else if (eraId === 'era03') {
    pg.fill(42, 92, 78);
    pg.stroke(242, 202, 98);
    pg.strokeWeight(2.4);
    pg.rect(-26, 2, 52, 22, 2);

    pg.fill(52, 138, 116);
    pg.stroke(245, 208, 102);
    pg.strokeWeight(2.4);
    pg.rect(-18, -18, 36, 24, 6);
    pg.fill(228, 72, 52);
    pg.ellipse(0, -6, 16, 12);

    pg.fill(58, 148, 124);
    pg.stroke(245, 208, 102);
    pg.strokeWeight(2.2);
    pg.rect(-8, -36 - headBob * 0.5, 28, 22, 4);
    pg.triangle(-8, -32 - headBob * 0.5, -24, -40 - headBob * 0.5, -8, -20 - headBob * 0.5);
    pg.triangle(20, -32 - headBob * 0.5, 36, -40 - headBob * 0.5, 20, -20 - headBob * 0.5);
    pg.noFill();
    pg.strokeWeight(3.2);
    pg.arc(-2, -40 - headBob * 0.5, 16, 16, Math.PI * 0.4, Math.PI * 1.6);
    pg.arc(14, -40 - headBob * 0.5, 16, 16, -Math.PI * 0.6, Math.PI * 0.6);

    pg.fill(255, 218, 78);
    pg.stroke(32, 24, 16);
    pg.strokeWeight(1.6);
    pg.rect(0, -30 - headBob * 0.5, 9, 6, 2);
    pg.rect(12, -30 - headBob * 0.5, 9, 6, 2);

    const ox = 28;
    const oy = -18 + pawWave;
    pg.fill(224, 188, 122);
    pg.stroke(238, 72, 48);
    pg.strokeWeight(2.0);
    pg.ellipse(ox, oy, 18, 24);
    pg.line(ox, oy - 8, ox, oy + 8);
    pg.line(ox, oy, ox + 6, oy - 4);
  }

  else if (eraId === 'era04') {
    pg.fill(238, 232, 220);
    pg.stroke(168, 148, 118);
    pg.strokeWeight(2.0);
    pg.rect(-26, 2, 52, 22, 2);

    const capeWave = Math.sin(state.t * 11) * 10;
    pg.fill(198, 36, 32, 240);
    pg.stroke(252, 208, 88);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(-12, -18);
    pg.quadraticVertex(-44, -26 + capeWave, -56, -4 - capeWave);
    pg.quadraticVertex(-32, 10, -10, 2);
    pg.endShape(pg.CLOSE);

    pg.fill(250, 248, 242);
    pg.stroke(118, 104, 88);
    pg.strokeWeight(2.2);
    pg.quad(-18, -20, 22, -20, 12, 4, -10, 4);
    pg.strokeWeight(1.4);
    pg.line(2, -18, 2, 2);
    pg.line(-10, -10, 14, -10);
    pg.line(-8, -4, 10, -4);

    pg.fill(250, 248, 242);
    pg.stroke(118, 104, 88);
    pg.strokeWeight(2.0);
    pg.ellipse(4, -28 - headBob * 0.5, 24, 20);
    pg.fill(238, 188, 68);
    pg.stroke(42, 28, 16);
    pg.arc(4, -30 - headBob * 0.5, 26, 22, Math.PI, Math.PI * 2);
    pg.fill(218, 42, 34);
    pg.arc(4, -38 - headBob * 0.5, 34, 24, Math.PI * 0.85, Math.PI * 2.15);

    pg.stroke(250, 248, 242);
    pg.strokeWeight(6);
    pg.line(14, -14, 28, -24 + pawWave);
    pg.stroke(218, 168, 64);
    pg.strokeWeight(3.5);
    pg.line(28, -16 + pawWave, 28, -34 + pawWave);
    pg.noStroke();
    pg.fill(255, 196, 48);
    pg.triangle(22, -34 + pawWave, 28, -54 + pawWave - state.beatPulse * 10, 34, -34 + pawWave);
  }

  else if (eraId === 'era05') {
    pg.fill(188, 42, 34);
    pg.stroke(245, 202, 88);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 12, 56, 22);

    pg.noFill();
    const ribCols = [[238, 68, 58, 220], [64, 188, 164, 220], [248, 198, 72, 220]];
    ribCols.forEach((rc, idx) => {
      pg.stroke(...rc);
      pg.strokeWeight(3.0 - idx * 0.5);
      pg.beginShape();
      for (let i = 0; i <= 10; i++) {
        const rx = -8 - i * 8;
        const ry = -14 + idx * 5 + Math.sin(i * 0.55 - state.t * 9 + idx) * (6 + i * 0.9);
        pg.vertex(rx, ry);
      }
      pg.endShape();
    });

    pg.fill(255, 252, 248);
    pg.stroke(58, 36, 24);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 38, 30);
    pg.fill(58, 152, 134);
    pg.stroke(245, 202, 88);
    pg.arc(0, -2, 36, 24, 0, Math.PI);

    pg.fill(255, 252, 248);
    pg.stroke(58, 36, 24);
    pg.strokeWeight(2.0);
    pg.ellipse(6, -24 - headBob * 0.5, 28, 22);
    pg.fill(32, 26, 24);
    pg.ellipse(-4, -38 - headBob * 0.5, 11, 11);
    pg.ellipse(16, -38 - headBob * 0.5, 11, 11);
    pg.fill(238, 58, 82);
    pg.stroke(255, 214, 88);
    pg.ellipse(6, -38 - headBob * 0.5, 13, 13);

    pg.noStroke();
    pg.fill(228, 42, 42);
    pg.ellipse(7, -29 - headBob * 0.5, 4, 4);
    pg.fill(48, 188, 238);
    pg.ellipse(3, -24 - headBob * 0.5, 4.8, 5.2);
    pg.ellipse(12, -24 - headBob * 0.5, 4.8, 5.2);

    pg.push();
    pg.translate(10, -8 + pawWave * 0.4);
    pg.rotate(-0.35);
    pg.fill(198, 128, 54);
    pg.stroke(48, 28, 16);
    pg.strokeWeight(1.8);
    pg.ellipse(0, 0, 26, 16);
    pg.rect(10, -3, 14, 6, 2);
    pg.stroke(255, 245, 220);
    pg.strokeWeight(1);
    pg.line(-10, -2, 20, -2);
    pg.line(-10, 2, 20, 2);
    pg.pop();
  }

  // ===========================================================================
  // 06 NORTHERN SONG: RU-KILN SKY-CELADON CRACKLED-GLAZE DONGPO TEA POET CAT (北宋汝窑天青釉“金丝冰裂纹”茶道词人猫)
  // ===========================================================================
  else if (eraId === 'era06') {
    // Bamboo lattice tea platform
    pg.fill(128, 158, 96);
    pg.stroke(42, 54, 34);
    pg.strokeWeight(2.0);
    pg.rect(-28, 4, 56, 18, 4);

    // Translucent Sky-Blue Ru-Kiln Celadon Porcelain Body with Golden Crackle Lines ("金丝铁线冰裂纹")
    pg.fill(186, 222, 214);
    pg.stroke(52, 82, 76);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 28);
    // Golden-iron crackle network on porcelain body
    pg.stroke(196, 148, 72, 210);
    pg.strokeWeight(1.2);
    pg.line(-10, -14, 4, -4);
    pg.line(4, -4, 12, -12);
    pg.line(4, -4, -4, 6);
    pg.line(-12, -2, 8, 2);

    // Celadon Head + Ears
    pg.fill(194, 228, 220);
    pg.stroke(52, 82, 76);
    pg.strokeWeight(2.0);
    pg.ellipse(6, -24 - headBob * 0.5, 26, 22);
    pg.triangle(-5, -31 - headBob * 0.5, -1, -43 - headBob * 0.5, 5, -31 - headBob * 0.5);
    pg.triangle(8, -31 - headBob * 0.5, 14, -43 - headBob * 0.5, 17, -30 - headBob * 0.5);

    // Tall Black Song Dynasty Su Dongpo Scholar Hat ("苏轼高筒东坡巾")
    pg.fill(34, 38, 42);
    pg.stroke(212, 188, 128);
    pg.strokeWeight(1.8);
    pg.rect(-3, -48 - headBob * 0.5, 18, 16, 2);
    pg.rect(-7, -36 - headBob * 0.5, 26, 6, 1);

    // Gentle Literati Eyes & Whiskers
    pg.fill(28, 42, 38);
    pg.noStroke();
    pg.ellipse(3, -24 - headBob * 0.5, 4.5, 5.0);
    pg.ellipse(12, -24 - headBob * 0.5, 4.5, 5.0);

    // Steaming Black Jian-Ware Tea Bowl ("建窑兔毫盏点茶") with rising spiral tea aroma!
    const tx = 24, ty = -12 + pawWave * 0.35;
    pg.fill(38, 32, 30);
    pg.stroke(218, 176, 92);
    pg.strokeWeight(1.8);
    pg.arc(tx, ty, 20, 16, 0, Math.PI, pg.CHORD);
    pg.noFill();
    pg.stroke(245, 250, 242, 200);
    pg.strokeWeight(1.8);
    for (let s = 0; s < 2; s++) {
      const sy = ty - 6 - ((state.t * 18 + s * 10) % 22);
      const sx = tx - 3 + s * 6 + Math.sin(state.t * 6 + s) * 4;
      pg.arc(sx, sy, 8, 8, -Math.PI * 0.5, Math.PI * 0.5);
    }
  }

  // ===========================================================================
  // 07 YUAN-MING-QING: BADA SHANREN ROLL-EYE BLUE-AND-WHITE PEKING OPERA GENERAL CAT (八大山人“翻白眼”青花瓷京剧武生大靠猫)
  // ===========================================================================
  else if (eraId === 'era07') {
    // 4 Fluttering Triangular Peking Opera Back-Banners ("四面青花靠旗")!
    const flagAngles = [-0.95, -0.55, -0.18, 0.22];
    flagAngles.forEach((fa, idx) => {
      pg.push();
      pg.translate(-6, -12);
      pg.rotate(fa + Math.sin(state.t * 10 + idx) * 0.08);
      pg.fill(248, 250, 255);
      pg.stroke(24, 68, 162);
      pg.strokeWeight(2.0);
      pg.triangle(0, 0, -38, -12, -32, 6);
      pg.fill(24, 68, 162);
      pg.noStroke();
      pg.ellipse(-22, -3, 7, 7);
      pg.pop();
    });

    // Rosewood Carved Base
    pg.fill(92, 34, 24);
    pg.stroke(242, 198, 92);
    pg.strokeWeight(2.0);
    pg.rect(-26, 4, 52, 18, 3);

    // Blue-and-White Porcelain Peking Opera Armor Torso ("景德镇青花瓷大靠")
    pg.fill(248, 250, 255);
    pg.stroke(24, 68, 162);
    pg.strokeWeight(2.4);
    pg.quad(-16, -18, 16, -18, 20, 6, -20, 6);
    pg.fill(28, 78, 178);
    pg.noStroke();
    pg.ellipse(0, -6, 14, 14);
    pg.fill(248, 250, 255);
    pg.ellipse(0, -6, 6, 6);

    // Head with Bada Shanren's Iconic Square Upward-Rolling Eyes ("八大山人方形白眼向人")!
    pg.fill(248, 250, 255);
    pg.stroke(24, 68, 162);
    pg.strokeWeight(2.2);
    pg.ellipse(6, -26 - headBob * 0.5, 26, 22);
    // Square Eye Whites with Pupils Rolled to the Top Corner!
    pg.fill(255, 255, 255);
    pg.stroke(18, 24, 38);
    pg.strokeWeight(1.8);
    pg.rect(-1, -30 - headBob * 0.5, 8, 7, 1);
    pg.rect(9, -30 - headBob * 0.5, 8, 7, 1);
    pg.fill(12, 16, 24);
    pg.noStroke();
    pg.ellipse(3, -29 - headBob * 0.5, 3.2, 3.2);
    pg.ellipse(13, -29 - headBob * 0.5, 3.2, 3.2);

    // Twin Long Swaying Pheasant Plumes ("京剧武生双长雉鸡翎")!
    pg.noFill();
    pg.stroke(28, 78, 178);
    pg.strokeWeight(2.4);
    const plumeSway = Math.sin(state.t * 9) * 10;
    pg.bezier(2, -36 - headBob * 0.5, -18, -68 - headBob * 0.5, -42, -58 + plumeSway, -56, -42 + plumeSway);
    pg.bezier(10, -36 - headBob * 0.5, 28, -68 - headBob * 0.5, 48, -58 - plumeSway, 62, -42 - plumeSway);

    // Golden 7-Column Abacus ("黄金算盘") Held in Front!
    const ax = 24, ay = -8 + pawWave * 0.3;
    pg.fill(68, 28, 16);
    pg.stroke(255, 212, 78);
    pg.strokeWeight(2.0);
    pg.rect(ax - 12, ay - 9, 24, 18, 2);
    for (let c = -8; c <= 8; c += 4) {
      pg.stroke(255, 218, 92);
      pg.strokeWeight(1.2);
      pg.line(ax + c, ay - 7, ax + c, ay + 7);
      const bOff = ((Math.floor(state.t * 16) + c) % 3) * 2 - 2;
      pg.fill(255, 218, 92);
      pg.noStroke();
      pg.ellipse(ax + c, ay + bOff, 3.2, 2.5);
    }
  }

  // ===========================================================================
  // 08 INCA & TRANSATLANTIC NAVIGATION: SOLID-GOLD INCA SUN-GOD INTI & QUETZAL PLUME CAT (印加黄金太阳神面具绿咬鹃图腾猫)
  // ===========================================================================
  else if (eraId === 'era08') {
    // Flowing Emerald & Crimson Quetzal Tail Feathers ("美洲绿咬鹃长尾羽冠")
    pg.noFill();
    for (let q = 0; q < 3; q++) {
      pg.stroke(q === 1 ? [238, 58, 48] : [28, 214, 138]);
      pg.strokeWeight(3.8 - q * 0.6);
      pg.beginShape();
      for (let i = 0; i <= 8; i++) {
        pg.vertex(-10 - i * 7, -16 + q * 5 + Math.sin(i * 0.6 - state.t * 8 + q) * 7);
      }
      pg.endShape();
    }

    // Stepped Inca Stone Pedestal
    pg.fill(138, 118, 92);
    pg.stroke(48, 36, 24);
    pg.strokeWeight(2.0);
    pg.rect(-26, 4, 52, 18, 2);

    // Hammered Solid-Gold Inca Body
    pg.fill(255, 204, 52);
    pg.stroke(118, 68, 14);
    pg.strokeWeight(2.2);
    pg.rect(-15, -16, 30, 22, 5);
    pg.fill(38, 212, 178);
    pg.ellipse(0, -5, 12, 12);

    // Radiant 16-Ray Golden Inca Sun-God (Inti) Mask Head!
    const hx = 6, hy = -28 - headBob * 0.5;
    pg.push();
    pg.translate(hx, hy);
    pg.stroke(255, 218, 68);
    pg.strokeWeight(2.2);
    for (let r = 0; r < 12; r++) {
      const a = (r / 12) * Math.PI * 2 + state.t * 1.2;
      const rLen = (r % 2 === 0) ? 21 : 16;
      pg.line(Math.cos(a) * 11, Math.sin(a) * 11, Math.cos(a) * rLen, Math.sin(a) * rLen);
    }
    pg.fill(255, 212, 64);
    pg.stroke(112, 62, 12);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 0, 24, 24);
    pg.fill(38, 218, 182);
    pg.noStroke();
    pg.ellipse(-4, -2, 5, 5);
    pg.ellipse(5, -2, 5, 5);
    pg.pop();

    // Holding Brass Nautical Sextant ("黄铜航海六分仪")
    const sx = 25, sy = -10 + pawWave * 0.35;
    pg.noFill();
    pg.stroke(255, 224, 98);
    pg.strokeWeight(2.2);
    pg.arc(sx, sy, 22, 22, -Math.PI * 0.4, Math.PI * 0.3, pg.PIE);
  }

  // ===========================================================================
  // 09 INDUSTRIAL REVOLUTION & SCIENCE: VICTORIAN STEAMPUNK TOP-HAT MAD-SCIENTIST CAT (维多利亚蒸汽朋克礼帽化学疯博士猫)
  // ===========================================================================
  else if (eraId === 'era09') {
    // Riveted Brass Steampunk Seat
    pg.fill(148, 96, 42);
    pg.stroke(38, 24, 14);
    pg.strokeWeight(2.2);
    pg.rect(-26, 4, 52, 18, 4);

    // British Tweed Tailcoat Body
    pg.fill(78, 68, 56);
    pg.stroke(28, 22, 18);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 26);
    // Crimson Bowtie
    pg.fill(218, 42, 42);
    pg.triangle(0, -13, -7, -17, -7, -9);
    pg.triangle(0, -13, 7, -17, 7, -9);

    // Cat Head + Glowing Brass Microscope Monocle ("单片黄铜显微镜")!
    const hx = 6, hy = -23 - headBob * 0.5;
    pg.fill(238, 228, 208);
    pg.stroke(32, 26, 20);
    pg.strokeWeight(2.0);
    pg.ellipse(hx, hy, 25, 21);
    // Left eye normal, Right eye Giant Brass Monocle Lens!
    pg.fill(32, 28, 24);
    pg.noStroke();
    pg.ellipse(hx - 4, hy - 1, 4.5, 5.0);
    pg.fill(98, 255, 198, 230);
    pg.stroke(245, 198, 72);
    pg.strokeWeight(2.4);
    pg.ellipse(hx + 6, hy - 1, 11, 11);

    // Tall Victorian Steampunk Top Hat with Spinning Brass Gear & Puffing Steam Chimney!
    pg.fill(26, 26, 32);
    pg.stroke(238, 188, 78);
    pg.strokeWeight(2.0);
    pg.rect(hx - 14, hy - 12, 28, 5, 2);
    pg.rect(hx - 9, hy - 32, 18, 20, 2);
    // Brass gear on hat
    pg.fill(245, 198, 78);
    pg.ellipse(hx, hy - 20, 9, 9);
    // Puffing steam cloud above hat
    pg.noStroke();
    pg.fill(245, 250, 255, 195);
    const puffY = hy - 38 - ((state.t * 24) % 18);
    pg.ellipse(hx - 4, puffY, 10, 8);
    pg.ellipse(hx + 4, puffY - 5, 13, 10);

    // Bubbling Fluorescent Green Erlenmeyer Chemical Flask Held in Paw!
    const fx = 25, fy = -8 + pawWave * 0.45;
    pg.fill(72, 255, 148, 230);
    pg.stroke(235, 248, 255);
    pg.strokeWeight(2.0);
    pg.triangle(fx, fy - 12, fx - 10, fy + 6, fx + 10, fy + 6);
    pg.fill(198, 92, 255, 220);
    pg.noStroke();
    pg.ellipse(fx + Math.sin(state.t * 12) * 3, fy - 16 - ((state.t * 18) % 12), 5, 5);
  }

  // ===========================================================================
  // 10 FARADAY ELECTROMAGNETIC DAWN: FERROFLUID & COPPER-COIL TELEGRAPHER CAT (法拉第紫铜螺线管与铁磁流体电报员猫)
  // ===========================================================================
  else if (eraId === 'era10') {
    // Copper Solenoid Insulator Platform
    pg.fill(188, 98, 44);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.0);
    pg.rect(-26, 4, 52, 18, 4);

    // Dark Metallic Ferrofluid Body Wrapped in Glowing Copper Induction Coils!
    pg.fill(24, 32, 44);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 26);
    // Copper coil windings across torso
    pg.noFill();
    pg.stroke(238, 138, 64);
    pg.strokeWeight(2.6);
    for (let w = -10; w <= 10; w += 5) {
      pg.arc(w, -6, 10, 24, -Math.PI * 0.45, Math.PI * 0.45);
    }

    // Ferrofluid Head with Dynamic Magnetic-Field Spikes ("铁磁流体磁力尖刺皇冠")!
    const hx = 6, hy = -24 - headBob * 0.5;
    pg.fill(24, 32, 44);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.0);
    pg.ellipse(hx, hy, 25, 21);
    // Ferrofluid magnetic spikes radiating from crown
    for (let s = 0; s < 7; s++) {
      const sa = -Math.PI * 0.85 + s * 0.28;
      const sLen = 16 + Math.sin(state.t * 14 + s) * 4 + state.beatPulse * 5;
      pg.fill(32, 46, 64);
      pg.stroke(98, 248, 255);
      pg.strokeWeight(1.5);
      pg.triangle(
        hx + Math.cos(sa - 0.12) * 10, hy + Math.sin(sa - 0.12) * 10,
        hx + Math.cos(sa) * sLen, hy + Math.sin(sa) * sLen,
        hx + Math.cos(sa + 0.12) * 10, hy + Math.sin(sa + 0.12) * 10
      );
    }
    // Glowing Cyan Plasma Eyes
    pg.fill(118, 252, 255);
    pg.noStroke();
    pg.ellipse(hx - 3, hy - 1, 5.5, 5.5);
    pg.ellipse(hx + 6, hy - 1, 5.5, 5.5);

    // Brass Morse Telegraph Key & Expanding Cyan Radio Wave Rings!
    const kx = 24, ky = -4;
    pg.fill(238, 178, 68);
    pg.stroke(28, 36, 48);
    pg.strokeWeight(1.8);
    pg.rect(kx - 8, ky, 18, 6, 2);
    pg.line(kx - 6, ky, kx + 8, ky - 5 + pawWave * 0.35);
    pg.noFill();
    pg.stroke(98, 248, 255, 210);
    pg.strokeWeight(1.8);
    const waveR = ((state.t * 36) % 28) + 8;
    pg.arc(kx + 4, ky - 8, waveR, waveR, -Math.PI * 0.75, -Math.PI * 0.15);
  }

  // ===========================================================================
  // 11 TESLA AC WAR: FARADAY-CAGE MILLION-VOLT PLASMA LIGHTNING CAT (特斯拉法拉第铜笼百万伏特雷电猫)
  // ===========================================================================
  else if (eraId === 'era11') {
    // Ribbed Porcelain High-Voltage Insulator Pedestal
    pg.fill(218, 212, 245);
    pg.stroke(88, 52, 168);
    pg.strokeWeight(2.0);
    pg.rect(-24, 4, 48, 18, 4);

    // Electric Violet-Blue Plasma Cat Body
    pg.fill(48, 32, 96);
    pg.stroke(198, 142, 255);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 26);

    const hx = 6, hy = -23 - headBob * 0.5;
    pg.fill(58, 38, 112);
    pg.ellipse(hx, hy, 25, 21);
    pg.fill(168, 252, 255);
    pg.noStroke();
    pg.ellipse(hx - 3, hy - 1, 6, 6);
    pg.ellipse(hx + 6, hy - 1, 6, 6);

    // Copper Wire Faraday Shielding Cage Helmet over Head ("紫铜网格法拉第屏蔽笼头盔")!
    pg.noFill();
    pg.stroke(245, 178, 78);
    pg.strokeWeight(1.8);
    pg.arc(hx, hy + 2, 34, 38, Math.PI, Math.PI * 2);
    pg.line(hx - 17, hy + 2, hx + 17, hy + 2);
    pg.line(hx, hy - 17, hx, hy + 2);
    // Top Toroid Terminal shooting violet lightning arcs!
    pg.fill(218, 224, 245);
    pg.ellipse(hx, hy - 20, 18, 7);
    pg.noFill();
    pg.stroke(198, 138, 255);
    pg.strokeWeight(2.2);
    for (let b = -1; b <= 1; b += 2) {
      pg.line(hx, hy - 22, hx + b * 18, hy - 36 - state.beatPulse * 8);
      pg.line(hx + b * 18, hy - 36 - state.beatPulse * 8, hx + b * 28, hy - 28);
    }

    // Wireless Glowing Neon Tube Held in Paw!
    pg.stroke(118, 255, 248);
    pg.strokeWeight(4.5);
    pg.line(20, -18 + pawWave * 0.4, 34, -2 + pawWave * 0.4);
  }

  // ===========================================================================
  // 12 EINSTEIN RELATIVITY: WILD-WHITE-HAIRED EINSTEIN VIOLIN & MELTING CLOCK CAT (爱因斯坦爆炸白发小提琴与弯曲时空怀表猫)
  // ===========================================================================
  else if (eraId === 'era12') {
    pg.fill(42, 48, 78);
    pg.stroke(255, 218, 88);
    pg.strokeWeight(2.0);
    pg.rect(-26, 4, 52, 18, 4);

    // Cozy Professor Sweater-Vest Body
    pg.fill(118, 92, 68);
    pg.stroke(242, 224, 188);
    pg.strokeWeight(2.0);
    pg.ellipse(0, -6, 34, 26);

    const hx = 6, hy = -23 - headBob * 0.5;
    // Iconic Wild Fluffy White Einstein Hair ("爱因斯坦标志性蓬松爆炸白发")!
    pg.fill(250, 252, 255);
    pg.stroke(168, 178, 204);
    pg.strokeWeight(1.6);
    for (let a = Math.PI * 0.75; a <= Math.PI * 2.25; a += 0.35) {
      pg.ellipse(hx + Math.cos(a) * 14, hy + Math.sin(a) * 12, 14, 14);
    }
    pg.fill(238, 232, 222);
    pg.stroke(48, 42, 38);
    pg.strokeWeight(2.0);
    pg.ellipse(hx, hy, 24, 20);
    // White Walrus Moustache ("爱因斯坦白八字胡") & Wise Eyes
    pg.fill(32, 28, 24);
    pg.noStroke();
    pg.ellipse(hx - 4, hy - 2, 4.5, 5.0);
    pg.ellipse(hx + 5, hy - 2, 4.5, 5.0);
    pg.fill(252, 252, 255);
    pg.arc(hx - 3, hy + 4, 11, 7, Math.PI, Math.PI * 2);
    pg.arc(hx + 5, hy + 4, 11, 7, Math.PI, Math.PI * 2);

    // Playing Violin + Floating Warped Relativistic Gold Pocket Watch!
    pg.fill(178, 82, 32);
    pg.stroke(42, 20, 10);
    pg.strokeWeight(1.6);
    pg.ellipse(22, -8, 18, 11);
    pg.stroke(255, 238, 168);
    pg.strokeWeight(2.0);
    pg.line(14, -18 + pawWave * 0.4, 34, -2 - pawWave * 0.4);
  }

  // ===========================================================================
  // 13 MODERN OLYMPICS: OLYMPIC GOLD-MEDALIST & PEACE-DOVE CHAMPION CAT (现代奥运五环金牌与和平白鸽冠军猫)
  // ===========================================================================
  else if (eraId === 'era13') {
    pg.fill(28, 118, 218);
    pg.stroke(255, 214, 58);
    pg.strokeWeight(2.2);
    pg.rect(-26, 4, 52, 18, 4);

    // White & Royal-Blue Olympic Tracksuit Body + Gold Medal on Ribbon!
    pg.fill(250, 252, 255);
    pg.stroke(24, 68, 148);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 26);
    pg.stroke(228, 42, 42);
    pg.strokeWeight(2.5);
    pg.line(-4, -14, 2, -2);
    pg.line(8, -14, 2, -2);
    pg.fill(255, 212, 48);
    pg.stroke(138, 92, 18);
    pg.strokeWeight(1.6);
    pg.ellipse(2, 1, 11, 11);

    const hx = 6, hy = -23 - headBob * 0.5;
    pg.fill(250, 252, 255);
    pg.stroke(24, 68, 148);
    pg.strokeWeight(2.0);
    pg.ellipse(hx, hy, 25, 21);
    // Emerald Olive Laurel Wreath Crown
    pg.noFill();
    pg.stroke(42, 198, 98);
    pg.strokeWeight(3.2);
    pg.arc(hx, hy - 4, 26, 18, Math.PI * 0.9, Math.PI * 2.1);
    pg.fill(24, 48, 88);
    pg.noStroke();
    pg.ellipse(hx - 3, hy - 1, 4.5, 5.0);
    pg.ellipse(hx + 6, hy - 1, 4.5, 5.0);

    // Holding Golden Olympic Torch / Olive Branch in Paw
    pg.stroke(255, 208, 64);
    pg.strokeWeight(3.2);
    pg.line(22, -4, 28, -22 + pawWave * 0.3);
    pg.noStroke();
    pg.fill(255, 128, 38);
    pg.triangle(22, -22 + pawWave * 0.3, 28, -38 + pawWave * 0.3 - state.beatPulse * 6, 34, -22 + pawWave * 0.3);
  }

  // ===========================================================================
  // 14 SILICON VALLEY & OPEN SOURCE: 8-BIT PIXEL-SUNGLASSES GEEK HACKER CAT (硅谷车库8-Bit像素墨镜开源极客黑客猫)
  // ===========================================================================
  else if (eraId === 'era14') {
    pg.fill(18, 118, 62);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(2.0);
    pg.rect(-26, 4, 52, 18, 2);

    // Blocky 8-Bit Voxel/Pixel Hoodie Cat Body!
    pg.fill(38, 48, 64);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(2.2);
    pg.rect(-16, -18, 32, 22, 2);

    const hx = 6, hy = -24 - headBob * 0.5;
    pg.fill(238, 246, 240);
    pg.stroke(24, 38, 30);
    pg.strokeWeight(2.0);
    pg.rect(hx - 13, hy - 11, 26, 22, 2);
    // Iconic 8-Bit "Deal With It" Pixel Black Sunglasses!
    pg.fill(12, 16, 20);
    pg.noStroke();
    pg.rect(hx - 11, hy - 5, 10, 6);
    pg.rect(hx + 2, hy - 5, 10, 6);
    pg.rect(hx - 13, hy - 5, 27, 2);
    pg.fill(255, 255, 255);
    pg.rect(hx - 9, hy - 4, 3, 2);
    pg.rect(hx + 4, hy - 4, 3, 2);

    // V6.0《红楼梦》“刘姥姥逛赛博大观园”满头簪花 + 惊叹张口表情！
    const lookTurn = Math.sin(state.t * 5.5) * 4.5;
    pg.fill(255, 72, 128);
    pg.stroke(255, 228, 88);
    pg.strokeWeight(1.5);
    pg.ellipse(hx - 10, hy - 13, 9, 9);
    pg.ellipse(hx, hy - 15, 11, 11);
    pg.ellipse(hx + 10, hy - 13, 9, 9);
    pg.fill(238, 68, 88);
    pg.ellipse(hx + lookTurn * 0.4, hy + 5, 6, 7);

    // Retro Beige CRT Monitor & Glowing Green Terminal Screen in front of Cat!
    const mx = 26, my = -10;
    pg.fill(228, 222, 204);
    pg.stroke(38, 44, 40);
    pg.strokeWeight(1.8);
    pg.rect(mx - 11, my - 12, 22, 18, 2);
    pg.fill(12, 38, 22);
    pg.rect(mx - 8, my - 9, 16, 12, 1);
    pg.fill(98, 255, 158);
    pg.noStroke();
    pg.rect(mx - 6, my - 6, 10, 2);
    pg.rect(mx - 6, my - 2, 7, 2);
  }

  // ===========================================================================
  // 15 GLOBALIZATION GOLDEN AGE: 5-CONTINENT HOLOGRAPHIC GLOBE NAVIGATOR CAT (托举五大洲全息地球仪的地球村领航猫)
  // ===========================================================================
  else if (eraId === 'era15') {
    pg.fill(24, 148, 188);
    pg.stroke(148, 255, 232);
    pg.strokeWeight(2.0);
    pg.ellipse(0, 12, 54, 18);

    // Silver-White Futuristic Global Navigator Suit
    pg.fill(242, 250, 255);
    pg.stroke(38, 158, 198);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -6, 34, 26);

    const hx = 6, hy = -23 - headBob * 0.5;
    pg.fill(248, 252, 255);
    pg.stroke(38, 158, 198);
    pg.strokeWeight(2.0);
    pg.ellipse(hx, hy, 25, 21);
    // Cyan Holographic Visor across eyes
    pg.fill(78, 248, 232, 210);
    pg.noStroke();
    pg.rect(hx - 9, hy - 5, 20, 7, 3);

    // Floating 3D Holographic Earth Globe spinning above Paw!
    const gx = 26, gy = -16 + pawWave * 0.35;
    pg.push();
    pg.translate(gx, gy);
    pg.rotate(state.t * 1.8);
    pg.fill(28, 168, 228, 185);
    pg.stroke(128, 255, 232);
    pg.strokeWeight(1.8);
    pg.ellipse(0, 0, 22, 22);
    pg.noFill();
    pg.ellipse(0, 0, 12, 22);
    pg.line(-11, 0, 11, 0);
    pg.pop();
  }

  pg.pop();
}

function drawEraPelicanCostume(pg, rig, eraId, t, theme) {
  pg.push();
  const sx = rig.shoulder.x, sy = rig.shoulder.y;
  const hx = rig.hip.x, hy = rig.hip.y;

  if (eraId === 'era01') {
    pg.fill(228, 162, 68, 235);
    pg.stroke(...theme.stroke);
    pg.strokeWeight(1.8);
    pg.quad(hx - 14, hy - 22, sx + 12, sy - 2, sx + 6, hy + 12, hx - 18, hy + 8);
    pg.fill(42, 22, 10);
    pg.noStroke();
    pg.ellipse(hx - 2, hy - 8, 5, 4);
    pg.ellipse(hx + 8, hy - 4, 6, 4);
    pg.ellipse(hx + 2, hy + 3, 5, 4);
    pg.fill(250, 240, 215);
    for (let i = 0; i < 6; i++) {
      const ang = 0.2 + i * 0.22;
      pg.ellipse(sx + Math.cos(ang) * 18 - 4, sy + Math.sin(ang) * 16 + 4, 6, 4);
    }
  } else if (eraId === 'era02') {
    pg.fill(42, 78, 112, 235);
    pg.stroke(235, 196, 98);
    pg.strokeWeight(2.0);
    pg.quad(hx - 18, hy - 24, sx + 14, sy - 4, sx + 8, hy + 14, hx - 22, hy + 10);
    pg.fill(245, 205, 85);
    pg.ellipse(sx + 8, sy + 8, 11, 11);
  } else if (eraId === 'era03') {
    pg.fill(28, 26, 26, 245);
    pg.stroke(218, 68, 48);
    pg.strokeWeight(2.8);
    pg.quad(hx - 18, hy - 24, sx + 15, sy - 3, sx + 10, hy + 14, hx - 22, hy + 12);
    pg.fill(64, 218, 188);
    pg.stroke(245, 204, 98);
    pg.strokeWeight(1.8);
    pg.rect(hx - 4, hy - 12, 16, 12, 2);
    const jx = hx + 8 + Math.sin(t * 6) * 4;
    const jy = hy + 20;
    pg.noFill();
    pg.stroke(195, 248, 224);
    pg.strokeWeight(3.0);
    pg.arc(jx, jy, 18, 14, 0, Math.PI);
  } else if (eraId === 'era04') {
    pg.fill(218, 168, 64, 240);
    pg.stroke(...theme.stroke);
    pg.strokeWeight(2.0);
    pg.quad(hx - 12, hy - 22, sx + 14, sy - 4, sx + 10, hy + 12, hx - 14, hy + 10);
    const wave = Math.sin(t * 9) * 8;
    pg.fill(188, 38, 30, 235);
    pg.stroke(248, 208, 98);
    pg.beginShape();
    pg.vertex(sx - 4, sy - 2);
    pg.quadraticVertex(sx - 44, sy - 16 + wave, sx - 72, sy + 6 - wave);
    pg.quadraticVertex(sx - 38, sy + 22, sx - 2, sy + 8);
    pg.endShape(pg.CLOSE);
  } else if (eraId === 'era05') {
    pg.fill(186, 44, 32, 245);
    pg.stroke(242, 198, 88);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 22, hy + 12);
    pg.fill(245, 205, 92);
    pg.ellipse(hx, hy - 6, 12, 12);
    const silkPts = [];
    for (let i = 0; i <= 14; i++) {
      silkPts.push({
        x: sx - 4 - i * 9,
        y: sy - 2 + Math.sin(i * 0.45 - t * 8) * (4 + i * 0.8),
      });
    }
    BrushKit.calligraphyLine(pg, silkPts, [215, 58, 42, 235], 2.0, 6.2, 7);
  } else if (eraId === 'era06') {
    // Northern Song Literati Celadon-Trimmed Scholar Robe ("宋代文人宽袖襕衫")
    pg.fill(218, 228, 214, 240);
    pg.stroke(58, 78, 64);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 22, hy + 12);
    pg.fill(92, 138, 112);
    pg.rect(hx - 16, hy + 4, 28, 6, 2);
  } else if (eraId === 'era07') {
    // Ming Blue-and-White Porcelain Brocade Tunic ("明制青花云锦曳撒")
    pg.fill(245, 248, 255, 245);
    pg.stroke(24, 68, 162);
    pg.strokeWeight(2.4);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 22, hy + 12);
    pg.fill(28, 78, 178);
    pg.ellipse(hx - 2, hy - 6, 12, 12);
  } else if (eraId === 'era08') {
    // Age of Sail Admiral Cape & Inca Gold Sun Medallion
    pg.fill(168, 38, 32, 240);
    pg.stroke(248, 204, 78);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 22, hy + 12);
    pg.fill(255, 212, 64);
    pg.ellipse(sx + 6, sy + 6, 13, 13);
  } else if (eraId === 'era09') {
    // Victorian Industrial Waistcoat & Brass Pocket-Watch Chain
    pg.fill(62, 52, 44, 245);
    pg.stroke(238, 188, 78);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 15, sy - 3, sx + 9, hy + 14, hx - 20, hy + 12);
    pg.noFill();
    pg.stroke(255, 214, 88);
    pg.strokeWeight(2.0);
    pg.arc(hx + 2, hy + 2, 18, 14, 0, Math.PI);
  } else if (eraId === 'era10') {
    // Faraday Electromagnetic Lab Coat with Glowing Copper Coil Trim
    pg.fill(28, 48, 72, 245);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 15, sy - 3, sx + 9, hy + 14, hx - 20, hy + 12);
    pg.fill(238, 138, 64);
    pg.ellipse(sx + 5, sy + 6, 11, 11);
  } else if (eraId === 'era11') {
    // 11 TESLA × 82版《西游记》大闹天宫：锁子黄金甲披肩与百万伏特混天绫电弧飘带！
    pg.fill(255, 208, 64, 240);
    pg.stroke(198, 42, 32);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 20, hy + 12);
    pg.noFill();
    pg.stroke(238, 68, 255, 235);
    pg.strokeWeight(3.0);
    pg.bezier(sx - 6, sy - 6, sx - 42, sy - 34 + Math.sin(t * 10) * 10, sx - 68, sy - 10, sx - 94, sy - 26);
  } else if (eraId === 'era12') {
    // 12 EINSTEIN ×《哈姆雷特》：丹麦王子黑色天鹅绒剧场披风与黄金时空表链！
    pg.fill(24, 22, 38, 245);
    pg.stroke(255, 218, 98);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 15, sy - 3, sx + 9, hy + 14, hx - 22, hy + 14);
  } else if (eraId === 'era13') {
    // 13 OLYMPICS ×《喜羊羊/猪猪侠》：热血国漫冠军红金战袍与五环徽章！
    pg.fill(238, 42, 42, 245);
    pg.stroke(255, 228, 68);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 20, hy + 12);
    pg.fill(255, 238, 88);
    pg.ellipse(sx + 5, sy + 6, 12, 12);
  } else if (eraId === 'era14') {
    // 14 SILICON VALLEY ×《红楼梦》大观园：极客连帽衫配大观园金陵云锦滚边！
    pg.fill(22, 118, 68, 240);
    pg.stroke(255, 214, 88);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 15, sy - 3, sx + 9, hy + 14, hx - 20, hy + 12);
  } else if (eraId === 'era15') {
    // 15 GLOBALIZATION ×《三体》：星际全息流光领航服！
    pg.fill(32, 148, 208, 235);
    pg.stroke(138, 255, 238);
    pg.strokeWeight(2.2);
    pg.quad(hx - 18, hy - 24, sx + 16, sy - 3, sx + 10, hy + 14, hx - 20, hy + 12);
  }
  pg.pop();
}

function drawEraHeadgear(pg, head, eraId, t, theme) {
  pg.push();
  pg.translate(head.x, head.y);
  if (eraId === 'era01') {
    pg.fill(168, 72, 32);
    pg.stroke(245, 215, 155);
    pg.strokeWeight(1.8);
    pg.rect(-10, -18, 18, 12, 3);
    pg.fill(242, 188, 78);
    pg.bezier(-6, -18, -26, -38, -16, -52, -2, -44);
    pg.bezier(2, -18, -10, -40, 2, -54, 10, -42);
  } else if (eraId === 'era02') {
    pg.fill(36, 54, 78);
    pg.stroke(242, 198, 92);
    pg.strokeWeight(2.0);
    pg.triangle(-18, -6, 0, -24, 18, -6);
    pg.ellipse(0, -12, 6, 6);
  } else if (eraId === 'era03') {
    pg.fill(52, 128, 108);
    pg.stroke(242, 202, 96);
    pg.strokeWeight(2.0);
    pg.rect(-12, -20, 22, 14, 2);
    pg.noFill();
    pg.strokeWeight(3.0);
    pg.arc(-14, -22, 18, 18, Math.PI * 0.5, Math.PI * 1.6);
    pg.arc(12, -22, 18, 18, -Math.PI * 0.6, Math.PI * 0.5);
    pg.fill(82, 248, 218);
    pg.noStroke();
    pg.ellipse(-1, -13, 6, 6);
  } else if (eraId === 'era04') {
    pg.fill(228, 178, 72);
    pg.stroke(32, 22, 14);
    pg.strokeWeight(1.8);
    pg.arc(0, -6, 26, 24, Math.PI, Math.PI * 2);
    pg.fill(204, 46, 36);
    pg.quad(-14, -20, 12, -20, 6, -32, -22, -28);
  } else if (eraId === 'era05') {
    pg.fill(32, 28, 26);
    pg.stroke(238, 196, 88);
    pg.strokeWeight(1.8);
    pg.rect(-10, -20, 18, 13, 3);
    pg.fill(235, 62, 78);
    pg.ellipse(6, -18, 10, 10);
    const wf = Math.sin(t * 9) * 3.5;
    pg.stroke(32, 28, 26);
    pg.strokeWeight(2.4);
    pg.bezier(-10, -13, -28, -15 + wf, -40, -10 - wf, -46, -12 + wf);
  } else if (eraId === 'era06') {
    // Northern Song Long-Winged Futou Official Hat ("宋代展脚幞头")
    pg.fill(32, 34, 38);
    pg.stroke(212, 192, 138);
    pg.strokeWeight(1.8);
    pg.rect(-10, -21, 18, 13, 2);
    pg.stroke(32, 34, 38);
    pg.strokeWeight(3.4);
    pg.line(-10, -15, -36, -17 + Math.sin(t * 7) * 2);
    pg.line(8, -15, 28, -17 - Math.sin(t * 7) * 2);
  } else if (eraId === 'era07') {
    // Ming Blue-and-White Scholar Crown with Jade Pin
    pg.fill(248, 250, 255);
    pg.stroke(24, 68, 162);
    pg.strokeWeight(2.0);
    pg.rect(-9, -22, 17, 14, 3);
    pg.fill(58, 214, 168);
    pg.ellipse(0, -15, 7, 7);
  } else if (eraId === 'era08') {
    // Age of Sail Tricorne Captain Hat with Golden Plume
    pg.fill(38, 26, 20);
    pg.stroke(248, 204, 78);
    pg.strokeWeight(2.0);
    pg.triangle(-20, -7, 0, -23, 20, -7);
    pg.fill(28, 214, 138);
    pg.ellipse(-8, -20, 14, 7);
  } else if (eraId === 'era09') {
    // Victorian Brass Goggles & Stovepipe Top Hat
    pg.fill(28, 28, 34);
    pg.stroke(238, 188, 78);
    pg.strokeWeight(1.8);
    pg.rect(-14, -10, 26, 4, 1);
    pg.rect(-9, -28, 16, 18, 2);
    pg.fill(98, 248, 192);
    pg.ellipse(-3, -13, 7, 7);
    pg.ellipse(5, -13, 7, 7);
  } else if (eraId === 'era10') {
    // Faraday Copper Coil Crown & Spark-Gap Antenna
    pg.fill(198, 108, 48);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.0);
    pg.rect(-10, -18, 18, 10, 3);
    pg.line(-1, -18, -1, -32);
    pg.fill(118, 252, 255);
    pg.ellipse(-1, -34, 8, 8);
  } else if (eraId === 'era11') {
    // 11 TESLA × 82版《西游记》：齐天大圣凤翅紫金冠双雉鸡翎 × 特斯拉高压电弧！
    pg.fill(255, 212, 58);
    pg.stroke(198, 42, 32);
    pg.strokeWeight(2.0);
    pg.arc(-1, -10, 24, 16, Math.PI, Math.PI * 2);
    pg.noFill();
    pg.stroke(238, 52, 42);
    pg.strokeWeight(2.6);
    pg.bezier(-4, -18, -28, -38, -54, -34 + Math.sin(t * 9) * 6, -72, -22);
    pg.stroke(198, 142, 255);
    pg.bezier(-2, -18, -24, -44, -48, -42 + Math.cos(t * 9) * 6, -66, -30);
  } else if (eraId === 'era12') {
    // 12 EINSTEIN ×《哈姆雷特》：丹麦剧场羽毛礼帽与引力透镜光环！
    pg.fill(28, 24, 44);
    pg.stroke(255, 224, 98);
    pg.strokeWeight(1.8);
    pg.ellipse(-2, -11, 28, 8);
    pg.arc(-2, -11, 20, 16, Math.PI, Math.PI * 2);
    pg.stroke(118, 248, 255);
    pg.strokeWeight(2.2);
    pg.line(-6, -16, -24, -28);
  } else if (eraId === 'era13') {
    // 13 OLYMPICS ×《喜羊羊/猪猪侠》：热血国漫破风护目镜与黄金头带！
    pg.fill(255, 68, 42);
    pg.stroke(255, 238, 78);
    pg.strokeWeight(2.0);
    pg.rect(-12, -16, 22, 6, 3);
    pg.line(-12, -13, -36, -18 + Math.sin(t * 15) * 5);
    pg.line(-12, -13, -34, -8 + Math.cos(t * 15) * 5);
  } else if (eraId === 'era14') {
    // 14 SILICON VALLEY ×《红楼梦》：极客VR头显配大观园桃花簪！
    pg.fill(18, 38, 28);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(1.8);
    pg.rect(-8, -15, 20, 7, 2);
    pg.fill(255, 118, 168);
    pg.ellipse(-8, -17, 9, 9);
  } else if (eraId === 'era15') {
    // 15 GLOBALIZATION ×《三体》：五洲全息领航光环冠！
    pg.noFill();
    pg.stroke(118, 255, 232);
    pg.strokeWeight(2.4);
    pg.ellipse(0, -17, 28, 9);
  }
  pg.pop();
}

function drawRadicallyTransformedVehicle(pg, rig, state, theme, v) {
  const { stroke, frameBase, frameHi } = theme;
  const r = rig.wheelR;

  const rearR = (v === 'penny_farthing') ? r * 0.54 : (v === 'song_wheelbarrow' ? r * 0.72 : r);
  const frontR = (v === 'penny_farthing') ? r * 1.36 : (v === 'song_wheelbarrow' ? r * 1.18 : r);
  const rearCenter = (v === 'penny_farthing' || v === 'song_wheelbarrow') ? { x: rig.rearWheel.x, y: rig.rearWheel.y + (r - rearR) } : rig.rearWheel;
  const frontCenter = (v === 'penny_farthing' || v === 'song_wheelbarrow') ? { x: rig.frontWheel.x, y: rig.frontWheel.y - (frontR - r) } : rig.frontWheel;
  const rScale = rig.rearWheel.scale || 1.0;
  const fScale = rig.frontWheel.scale || 1.0;
  drawVolumetricWheel(pg, rearCenter, rearR * rScale, rig.crankAngle, v, theme, false, state.t);
  drawVolumetricWheel(pg, frontCenter, frontR * fScale, rig.crankAngle, v, theme, true, state.t);

  BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.pedalFar.x, rig.pedalFar.y, frameBase, frameHi, stroke, 2.5);

  if (v === 'stone_roller') {
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.frontWheel.x, rig.frontWheel.y, [108, 64, 32], [182, 124, 72], stroke, 6.5);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.seatPost.x, rig.seatPost.y, [108, 64, 32], [182, 124, 72], stroke, 5.5);
    pg.push();
    pg.noFill();
    pg.stroke(248, 238, 212);
    pg.strokeWeight(7);
    pg.bezier(rig.headTubeTop.x - 10, rig.headTubeTop.y, rig.headTubeTop.x + 25, rig.headTubeTop.y + 45, rig.frontWheel.x + 15, rig.frontWheel.y - 25, rig.frontWheel.x, rig.frontWheel.y);
    pg.pop();
    BrushKit.draw3DTube(pg, rig.seatPost.x, rig.seatPost.y, rig.headTubeTop.x, rig.headTubeTop.y, [242, 228, 198], [255, 250, 235], stroke, 4.5);
  }

  else if (v === 'ark_ship') {
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.seatPost.x, rig.seatPost.y, frameBase, frameHi, stroke, 3.8);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 3.8);
    pg.push();
    pg.fill(104, 66, 36, 245);
    pg.stroke(...stroke);
    pg.strokeWeight(2.4);
    pg.beginShape();
    pg.vertex(rig.rearWheel.x - 18, rig.rearWheel.y - 24);
    pg.vertex(rig.frontWheel.x + 34, rig.frontWheel.y - 34);
    pg.vertex(rig.frontWheel.x + 12, rig.frontWheel.y + 4);
    pg.vertex(rig.rearWheel.x - 8, rig.rearWheel.y + 4);
    pg.endShape(pg.CLOSE);
    pg.line(rig.rearWheel.x - 12, rig.rearWheel.y - 10, rig.frontWheel.x + 22, rig.frontWheel.y - 16);
    const swing = Math.sin(state.t * 6) * 5;
    pg.stroke(245, 200, 90);
    pg.line(rig.frontWheel.x + 34, rig.frontWheel.y - 34, rig.frontWheel.x + 48, rig.frontWheel.y - 44);
    pg.fill(255, 215, 95);
    pg.ellipse(rig.frontWheel.x + 48 + swing, rig.frontWheel.y - 30, 12, 15);
    pg.pop();
  }

  else if (v === 'shang_chariot') {
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 4.6);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 4.2);
    pg.push();
    pg.fill(42, 88, 76, 245);
    pg.stroke(242, 204, 102);
    pg.strokeWeight(2.5);
    pg.rect(rig.bb.x - 44, rig.bb.y - 38, 82, 38, 3);
    pg.fill(78, 242, 212);
    pg.ellipse(rig.bb.x - 14, rig.bb.y - 19, 10, 10);
    pg.ellipse(rig.bb.x + 12, rig.bb.y - 19, 10, 10);

    const bx = rig.seatPost.x - 14;
    const by = rig.head.y - 52;
    BrushKit.draw3DTube(pg, rig.seatPost.x, rig.seatPost.y, bx, by, frameBase, frameHi, stroke, 3.0);
    pg.fill(208, 58, 42, 235);
    pg.stroke(242, 204, 102);
    pg.strokeWeight(2.0);
    pg.quad(bx, by, bx - 48, by + 8 + Math.sin(state.t * 8) * 5, bx - 38, by + 28, bx, by + 20);
    pg.pop();
  }

  else if (v === 'chariot') {
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 4.2);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 4.0);
    pg.push();
    pg.fill(218, 158, 58, 245);
    pg.stroke(...stroke);
    pg.strokeWeight(2.4);
    pg.beginShape();
    pg.vertex(rig.rearWheel.x + 10, rig.rearWheel.y - 8);
    pg.vertex(rig.seatPost.x - 12, rig.seatPost.y + 18);
    pg.quadraticVertex(rig.headTubeTop.x + 22, rig.headTubeTop.y + 10, rig.bb.x + 38, rig.bb.y + 4);
    pg.endShape(pg.CLOSE);
    pg.fill(255, 224, 130);
    pg.beginShape();
    pg.vertex(rig.bb.x - 10, rig.bb.y - 14);
    pg.quadraticVertex(rig.bb.x - 45, rig.bb.y - 38, rig.bb.x - 58, rig.bb.y - 18);
    pg.quadraticVertex(rig.bb.x - 32, rig.bb.y - 4, rig.bb.x - 10, rig.bb.y - 14);
    pg.endShape(pg.CLOSE);
    pg.pop();
  }

  else if (v === 'tang_floral') {
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y, frameBase, frameHi, stroke, 3.8);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.headTubeTop.x, rig.headTubeTop.y, frameBase, frameHi, stroke, 3.8);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.seatPost.x, rig.seatPost.y, frameBase, frameHi, stroke, 3.8);
    BrushKit.draw3DTube(pg, rig.seatPost.x, rig.seatPost.y, rig.headTubeTop.x, rig.headTubeTop.y, frameBase, frameHi, stroke, 3.8);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, 3.8);
    pg.push();
    const hx = rig.headTubeTop.x + 10;
    const hy = rig.headTubeTop.y + 8;
    pg.fill(232, 64, 82);
    pg.stroke(245, 205, 92);
    pg.strokeWeight(1.5);
    pg.ellipse(hx, hy, 18, 18);
    pg.fill(248, 142, 162);
    pg.ellipse(hx + 10, hy + 6, 14, 14);
    const swing = Math.sin(state.t * 6) * 4;
    pg.stroke(178, 42, 32);
    pg.line(hx, hy + 9, hx + swing, hy + 28);
    pg.fill(238, 62, 42);
    pg.ellipse(hx + swing, hy + 34, 14, 12);
    pg.pop();
  }

  // ===========================================================================
  // 06 NORTHERN SONG: BI SHENG MOVABLE-TYPE & WOVEN-BAMBOO "JIGONGCHE" WHEELBARROW!
  // (北宋《清明上河》双曲辕木拱架独轮鸡公车 + 竹编货架交子/酒坛 + 车首悬浮司南水罗盘)
  // ===========================================================================
  else if (v === 'song_wheelbarrow') {
    pg.push();
    // Heavy curved timber wheelbarrow shafts ("宋代双曲辕推车长柄")
    pg.noFill();
    pg.stroke(128, 86, 42);
    pg.strokeWeight(7.5);
    pg.bezier(rig.rearWheel.x - 16, rig.rearWheel.y - 12, rig.bb.x - 15, rig.bb.y - 42, rig.headTubeTop.x - 10, rig.headTubeTop.y + 12, rig.frontWheel.x + 12, rig.frontWheel.y);
    pg.stroke(198, 152, 92);
    pg.strokeWeight(3.2);
    pg.bezier(rig.rearWheel.x - 16, rig.rearWheel.y - 12, rig.bb.x - 15, rig.bb.y - 42, rig.headTubeTop.x - 10, rig.headTubeTop.y + 12, rig.frontWheel.x + 12, rig.frontWheel.y);

    // Woven Green-Bamboo Arching Cargo Frame ("竹编拱形高架车厢")
    pg.fill(142, 178, 108, 235);
    pg.stroke(46, 64, 34);
    pg.strokeWeight(2.4);
    pg.quad(rig.bb.x - 48, rig.bb.y - 6, rig.bb.x + 46, rig.bb.y - 10, rig.bb.x + 36, rig.bb.y - 46, rig.bb.x - 38, rig.bb.y - 42);
    // Bamboo lattice cross-lines & Celadon Wine Jar + "交子" Banknote Bundle on rack!
    pg.line(rig.bb.x - 20, rig.bb.y - 44, rig.bb.x - 26, rig.bb.y - 6);
    pg.line(rig.bb.x + 12, rig.bb.y - 45, rig.bb.x + 16, rig.bb.y - 8);
    pg.fill(176, 216, 206);
    pg.ellipse(rig.bb.x - 8, rig.bb.y - 26, 24, 26);
    pg.fill(188, 42, 34);
    pg.rect(rig.bb.x - 15, rig.bb.y - 38, 14, 6, 1);

    // Bow: Floating Song Dynasty Bronze South-Pointing Spoon ("宋代司南/指南水罗盘")
    const cx = rig.headTubeTop.x + 24, cy = rig.headTubeTop.y - 6;
    pg.fill(218, 184, 98);
    pg.stroke(52, 36, 18);
    pg.strokeWeight(2.0);
    pg.rect(cx - 16, cy - 8, 32, 16, 3);
    pg.fill(188, 234, 224);
    pg.ellipse(cx, cy, 22, 12);
    pg.stroke(212, 42, 32);
    pg.strokeWeight(2.6);
    pg.line(cx - 8, cy, cx + 9, cy - 3 + Math.sin(state.t * 8) * 2);
    pg.pop();
  }

  // ===========================================================================
  // 07 YUAN-MING-QING: JINGDEZHEN BLUE-AND-WHITE PORCELAIN GOURD-VASE & GIANT CALLIGRAPHY BRUSH CHARIOT!
  // (景德镇元青花云龙纹大葫芦瓶车身 × 江南乌篷翘檐画舫顶 × 巨型狼毫大毛笔前叉滴墨成画！)
  // ===========================================================================
  else if (v === 'ming_carriage') {
    pg.push();
    // 1) Main Chassis: Horizontally Mounted Jingdezhen Blue-and-White Porcelain Double-Gourd Vase ("元青花缠枝莲大葫芦瓶车身")!
    pg.translate(rig.bb.x + 8, rig.bb.y - 24);
    pg.rotate(-0.18);
    pg.fill(248, 251, 255);
    pg.stroke(22, 64, 158);
    pg.strokeWeight(2.6);
    // Lower bulb & upper bulb of porcelain gourd vase
    pg.ellipse(-18, 0, 56, 42);
    pg.ellipse(26, -4, 40, 30);
    pg.rect(42, -10, 14, 12, 2);
    // Cobalt Blue floral scrollwork painted on the porcelain vase body
    pg.noFill();
    pg.stroke(28, 82, 186);
    pg.strokeWeight(2.0);
    pg.arc(-18, 0, 34, 24, 0, Math.PI * 1.4);
    pg.arc(26, -4, 22, 16, Math.PI * 0.5, Math.PI * 1.8);
    pg.pop();

    // 2) Front Fork: Giant Wolf-Hair Calligraphy Brush ("巨型狼毫大毛笔前叉，笔锋随骑行挥洒浓墨与青花釉点！")
    BrushKit.draw3DTube(pg, rig.headTubeTop.x - 4, rig.headTubeTop.y - 16, rig.frontWheel.x, rig.frontWheel.y - 12, [128, 78, 38], [218, 168, 98], [32, 20, 12], 5.6);
    pg.push();
    pg.fill(24, 34, 58);
    pg.stroke(248, 250, 255);
    pg.strokeWeight(1.8);
    pg.triangle(rig.frontWheel.x - 9, rig.frontWheel.y - 14, rig.frontWheel.x + 9, rig.frontWheel.y - 14, rig.frontWheel.x + 4, rig.frontWheel.y + 18);
    // Flying splash-ink droplets from the giant brush tip!
    pg.noStroke();
    for (let d = 0; d < 4; d++) {
      const dx = rig.frontWheel.x - 12 - ((state.t * 95 + d * 18) % 56);
      const dy = rig.frontWheel.y + 10 - Math.sin(d * 2 + state.t * 10) * 8;
      pg.fill(state.localProgress > 0.44 ? [28, 82, 186, 215] : [22, 26, 32, 215]);
      pg.ellipse(dx, dy, 7 - d, 5 - d * 0.6);
    }
    pg.pop();

    // 3) Overhead Canopy: Upturned Jiangnan Canal Boat Eave & Swaying Blue-and-White Palace Lantern
    pg.push();
    pg.noFill();
    pg.stroke(22, 64, 158);
    pg.strokeWeight(3.4);
    pg.arc(rig.seatPost.x + 12, rig.head.y - 38, 118, 32, Math.PI * 1.08, Math.PI * 1.92);
    pg.pop();
  }

  // ===========================================================================
  // 08 INCA & TRANSATLANTIC NAVIGATION: "SANTA MARIA" 3-DECK SAILING SHIP HULL BIKE × GOLDEN QUETZALCOATL FIGUREHEAD!
  // (1492“圣玛利亚号”大航海木帆船战舰车体 + 车顶高耸红十字主帆 + 船首印加纯金羽蛇撞角 + 达·芬奇大木轮啮合传动！)
  // ===========================================================================
  else if (v === 'davinci_gear') {
    pg.push();
    // 1) Sculpted Caravel Wooden Ship Hull enclosing the Bicycle Frame ("微缩圣玛利亚号大航海帆船车身")!
    pg.fill(112, 62, 26, 248);
    pg.stroke(255, 212, 78);
    pg.strokeWeight(2.5);
    pg.beginShape();
    pg.vertex(rig.rearWheel.x - 28, rig.rearWheel.y - 38); // High sterncastle
    pg.vertex(rig.rearWheel.x + 18, rig.rearWheel.y - 24);
    pg.vertex(rig.frontWheel.x + 28, rig.frontWheel.y - 28);
    pg.vertex(rig.frontWheel.x + 48, rig.frontWheel.y - 46); // Raised forecastle bow
    pg.vertex(rig.frontWheel.x + 18, rig.frontWheel.y + 4);
    pg.vertex(rig.rearWheel.x - 14, rig.rearWheel.y + 4);
    pg.endShape(pg.CLOSE);

    // Golden Inca Feathered-Serpent Figurehead at the Bow ("船首印加纯金太阳羽蛇神撞角") & Cannon Ports!
    pg.fill(255, 214, 58);
    pg.stroke(88, 46, 12);
    pg.strokeWeight(1.8);
    pg.ellipse(rig.frontWheel.x + 52, rig.frontWheel.y - 46, 16, 16);
    pg.fill(28, 218, 152);
    pg.triangle(rig.frontWheel.x + 56, rig.frontWheel.y - 54, rig.frontWheel.x + 74, rig.frontWheel.y - 58, rig.frontWheel.x + 58, rig.frontWheel.y - 42);
    for (let c = -1; c <= 1; c++) {
      pg.fill(32, 20, 12);
      pg.rect(rig.bb.x + c * 26 - 5, rig.bb.y - 16, 10, 8, 1);
    }

    // 2) Tall Mast & Billowing Red-Cross Caravel Sail Mounted Behind the Saddle ("随海风鼓起的红十字航海横帆")!
    const mastX = rig.seatPost.x - 18;
    const mastTopY = rig.head.y - 72;
    pg.stroke(92, 52, 22);
    pg.strokeWeight(4.2);
    pg.line(mastX, rig.seatPost.y + 8, mastX, mastTopY);
    const sailBillow = 14 + Math.sin(state.t * 6) * 5;
    pg.fill(252, 246, 232, 238);
    pg.stroke(188, 146, 82);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(mastX - 18, mastTopY + 8);
    pg.quadraticVertex(mastX + sailBillow, mastTopY + 34, mastX - 14, mastTopY + 62);
    pg.vertex(mastX - 42, mastTopY + 58);
    pg.quadraticVertex(mastX - 24 + sailBillow * 0.5, mastTopY + 32, mastX - 42, mastTopY + 12);
    pg.endShape(pg.CLOSE);
    // Crimson Order-of-Christ Cross on the Bike's Sail
    pg.stroke(212, 38, 32);
    pg.strokeWeight(3.4);
    pg.line(mastX - 18, mastTopY + 22, mastX - 18, mastTopY + 48);
    pg.line(mastX - 30, mastTopY + 35, mastX - 6, mastTopY + 35);

    // 3) Da Vinci Interlocking Wooden Cogwheel Drive at Crank
    pg.translate(rig.bb.x, rig.bb.y);
    pg.rotate(rig.crankAngle * 1.6);
    pg.noFill();
    pg.stroke(255, 216, 78);
    pg.strokeWeight(2.6);
    pg.ellipse(0, 0, 50, 50);
    for (let g = 0; g < 12; g++) {
      const a = (g / 12) * Math.PI * 2;
      pg.line(Math.cos(a) * 20, Math.sin(a) * 20, Math.cos(a) * 29, Math.sin(a) * 29);
    }
    pg.pop();
  }

  // ===========================================================================
  // 09 INDUSTRIAL REVOLUTION & VAN GOGH STARRY NIGHT: "MECHANICAL & PAINTERLY" SQUEEZED OIL-PAINT TUBE & STEAM-PISTON HIGH-WHEELER!
  // (“机械与如画”终极共生单车：黄铜蒸汽气缸活塞连杆 × 正在挤出铬黄与钴蓝厚涂油画旋涡的巨型《星月夜》锡管油画颜料管车身！)
  // ===========================================================================
  else if (v === 'penny_farthing') {
    pg.push();
    // 1) Curved Spine made of Swirling Chrome-Yellow & Cobalt-Blue Thick Impasto Oil Paint squeezed from a Giant Artist's Paint Tube!
    for (let layer = 0; layer < 2; layer++) {
      pg.noFill();
      pg.stroke(layer === 0 ? [28, 78, 186] : [255, 218, 58]);
      pg.strokeWeight(layer === 0 ? 11.0 : 6.0);
      pg.bezier(
        rig.headTubeTop.x, rig.headTubeTop.y - 12,
        rig.seatPost.x + 12, rig.seatPost.y - 18 + layer * 4,
        rig.rearWheel.x + 14, rig.rearWheel.y - 22,
        rig.rearWheel.x, rearCenter.y
      );
    }

    // 2) Victorian Brass Steam Cylinder, Reciprocating Piston Rod & Puffing Smokestack Mounted on the Frame!
    const cylX = (rig.bb.x + rig.rearWheel.x) * 0.5 - 6;
    const cylY = rig.bb.y - 22;
    pg.fill(188, 128, 48);
    pg.stroke(38, 24, 12);
    pg.strokeWeight(2.2);
    pg.rect(cylX - 24, cylY - 14, 48, 24, 4);
    // Glowing furnace window inside brass steam boiler
    pg.fill(255, 168, 38);
    pg.ellipse(cylX - 6, cylY - 2, 12, 12);
    // Reciprocating steel piston rod driving the crank!
    pg.stroke(235, 242, 250);
    pg.strokeWeight(4.0);
    pg.line(cylX + 24, cylY - 2, rig.pedalNear.x, rig.pedalNear.y);
    // Brass smokestack puffing steam that turns into golden Van Gogh oil-paint stars!
    pg.fill(168, 112, 40);
    pg.stroke(38, 24, 12);
    pg.strokeWeight(2.0);
    pg.rect(cylX - 18, cylY - 34, 12, 20, 2);
    for (let st = 0; st < 3; st++) {
      const sx = cylX - 14 - ((state.t * 48 + st * 16) % 44);
      const sy = cylY - 42 - st * 10 + Math.sin(state.t * 8 + st) * 4;
      pg.noFill();
      pg.stroke(st === 0 ? [242, 248, 255] : [255, 224, 68]);
      pg.strokeWeight(2.8);
      pg.arc(sx, sy, 14 + st * 4, 14 + st * 4, state.t * 4, state.t * 4 + 1.8);
    }

    // Front Fork: Brass Gear-Caliper Fork holding the Giant Starry-Night High Wheel
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y - 12, frontCenter.x, frontCenter.y, [218, 162, 58], [255, 232, 128], stroke, 5.0);
    pg.pop();
  }

  // ===========================================================================
  // 10 FARADAY ELECTROMAGNETIC DAWN: GIANT RED/BLUE "N/S" HORSESHOE MAGNET CHASSIS × LEYDEN JAR CAPACITOR & TELEGRAPH RADIO MAST!
  // (彻底区别于第08幕！整辆车由红蓝双极 N/S 巨型马蹄铁磁铁车架 + 发光玻璃莱顿瓶电容 + 车首莫尔斯电报激光发射塔构成！)
  // ===========================================================================
  else if (v === 'safety_dynamo') {
    pg.push();
    // 1) GIANT RED (North "N") & BLUE (South "S") HORSESHOE MAGNET CHASSIS bridging Rear Wheel to Front Wheel!
    // Red North-Pole Front Arm ("N 极红色磁臂")
    pg.noFill();
    pg.stroke(232, 48, 42);
    pg.strokeWeight(10.5);
    pg.bezier(rig.seatPost.x + 8, rig.seatPost.y - 6, rig.bb.x + 25, rig.bb.y - 36, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y);
    // Blue South-Pole Rear Arm ("S 极蓝色磁臂")
    pg.stroke(38, 118, 238);
    pg.strokeWeight(10.5);
    pg.bezier(rig.seatPost.x + 8, rig.seatPost.y - 6, rig.bb.x - 20, rig.bb.y - 28, rig.rearWheel.x + 12, rig.rearWheel.y - 18, rig.rearWheel.x, rig.rearWheel.y);
    // Copper Solenoid Windings wrapped around the Magnet Chassis!
    pg.stroke(245, 152, 68);
    pg.strokeWeight(3.2);
    for (let w = 0; w < 6; w++) {
      const wx = rig.bb.x - 28 + w * 12;
      const wy = rig.bb.y - 26;
      pg.line(wx, wy - 8, wx + 4, wy + 8);
    }

    // 2) Glowing Cyan-White Leyden Jar High-Voltage Capacitor at the Center Triangle ("发光玻璃莱顿瓶高压电容器")!
    pg.fill(18, 42, 68, 230);
    pg.stroke(98, 248, 255);
    pg.strokeWeight(2.4);
    pg.rect(rig.bb.x - 16, rig.bb.y - 48, 32, 36, 5);
    pg.fill(118, 255, 255, 195 + Math.sin(state.t * 20) * 55);
    pg.noStroke();
    pg.rect(rig.bb.x - 11, rig.bb.y - 40, 22, 22, 3);

    // 3) Crackling High-Voltage Tesla/Faraday Plasma Arcs jumping between Front & Rear Wheel Hubs!
    pg.noFill();
    pg.stroke(128, 252, 255, 235);
    pg.strokeWeight(2.4);
    pg.beginShape();
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      const lx = rig.rearWheel.x + (rig.frontWheel.x - rig.rearWheel.x) * u;
      const ly = rig.rearWheel.y + (rig.frontWheel.y - rig.rearWheel.y) * u - 14 + Math.sin(u * 18 + state.t * 32) * 8;
      pg.vertex(lx, ly);
    }
    pg.endShape();

    // 4) Handlebar Bow: Transatlantic Morse Telegraph Dish & Pulsing Cyan Radio Rings!
    const tx = rig.headTubeTop.x + 16, ty = rig.headTubeTop.y - 24;
    pg.stroke(238, 158, 72);
    pg.strokeWeight(3.2);
    pg.line(rig.headTubeTop.x, rig.headTubeTop.y, tx, ty);
    pg.fill(118, 255, 255);
    pg.noStroke();
    pg.ellipse(tx, ty, 12, 12);
    pg.noFill();
    pg.stroke(98, 248, 255, 205);
    pg.strokeWeight(1.8);
    const rPulse = ((state.t * 45) % 34) + 10;
    pg.ellipse(tx, ty, rPulse * 2, rPulse * 1.2);
    pg.pop();
  }

  // ===========================================================================
  // 11 TESLA AC WAR: HIGH-VOLTAGE RIBBED PORCELAIN INSULATOR & WARDENCLYFFE DOME BIKE!
  // ===========================================================================
  else if (v === 'tesla_lightning') {
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y, [118, 68, 218], [218, 188, 255], stroke, 4.4);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.headTubeTop.x, rig.headTubeTop.y, [118, 68, 218], [218, 188, 255], stroke, 4.4);
    BrushKit.draw3DTube(pg, rig.seatPost.x, rig.seatPost.y, rig.headTubeTop.x, rig.headTubeTop.y, [118, 68, 218], [218, 188, 255], stroke, 4.4);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, [118, 68, 218], [218, 188, 255], stroke, 4.4);
    pg.push();
    // Wardenclyffe Toroid Dome on Handlebar shooting branching violet lightning arcs!
    const wx = rig.headTubeTop.x + 14, wy = rig.headTubeTop.y - 22;
    pg.fill(218, 224, 250);
    pg.stroke(88, 42, 168);
    pg.strokeWeight(2.0);
    pg.ellipse(wx, wy, 28, 14);
    pg.noFill();
    pg.stroke(212, 148, 255);
    pg.strokeWeight(2.4);
    pg.line(wx, wy - 7, wx + 24, wy - 28 + Math.sin(state.t * 35) * 6);
    pg.pop();
  }

  // ===========================================================================
  // 12 EINSTEIN RELATIVITY: LORENTZ LIGHT-CONE STREAMLINER & WARPED SPACETIME CLOCK BIKE!
  // ===========================================================================
  else if (v === 'relativity_photon') {
    pg.push();
    // Golden Photonic Light-Cone Aerodynamic Frame + Melting Relativistic Clock at Center!
    pg.noFill();
    pg.stroke(255, 218, 88);
    pg.strokeWeight(4.8);
    pg.bezier(rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y - 36, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y);
    pg.stroke(98, 218, 255);
    pg.strokeWeight(3.4);
    pg.line(rig.rearWheel.x, rig.rearWheel.y, rig.frontWheel.x, rig.frontWheel.y);
    // Warped Relativistic Clock mounted in the frame triangle ("相对论时间膨胀弯曲时钟")
    pg.fill(255, 236, 148, 235);
    pg.stroke(48, 36, 18);
    pg.strokeWeight(2.0);
    pg.ellipse(rig.bb.x + 10, rig.bb.y - 24, 34, 24);
    pg.line(rig.bb.x + 10, rig.bb.y - 24, rig.bb.x + 10 + Math.cos(state.t * 2) * 10, rig.bb.y - 24 + Math.sin(state.t * 2) * 8);
    pg.pop();
  }

  // ===========================================================================
  // 13 MODERN OLYMPICS: MONOCOQUE CARBON-FIBER AERO SUPERBIKE!
  // ===========================================================================
  else if (v === 'carbon_olympic') {
    pg.push();
    pg.fill(28, 36, 48, 248);
    pg.stroke(255, 214, 58);
    pg.strokeWeight(2.2);
    // Sculpted Monocoque Aero Carbon Frame
    pg.beginShape();
    pg.vertex(rig.rearWheel.x, rig.rearWheel.y - 4);
    pg.vertex(rig.seatPost.x - 6, rig.seatPost.y);
    pg.vertex(rig.headTubeTop.x + 8, rig.headTubeTop.y - 4);
    pg.vertex(rig.bb.x + 6, rig.bb.y + 6);
    pg.endShape(pg.CLOSE);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, [28, 138, 238], [255, 214, 58], stroke, 4.5);
    pg.pop();
  }

  // ===========================================================================
  // 14 SILICON VALLEY & OPEN SOURCE: GREEN PCB PRINTED-CIRCUIT-BOARD & IC CHIP BMX!
  // ===========================================================================
  else if (v === 'pixel_bmx') {
    pg.push();
    // Green Fiberglass PCB Motherboard Frame with Gold Copper Traces & Black IC Chips!
    pg.fill(18, 128, 68, 245);
    pg.stroke(118, 255, 168);
    pg.strokeWeight(2.2);
    pg.quad(rig.seatPost.x, rig.seatPost.y + 8, rig.headTubeTop.x, rig.headTubeTop.y + 6, rig.bb.x + 16, rig.bb.y + 4, rig.bb.x - 16, rig.bb.y + 4);
    // Black 8-Pin Microprocessor Chip soldered onto frame
    pg.fill(22, 26, 30);
    pg.stroke(255, 218, 88);
    pg.rect(rig.bb.x - 8, rig.bb.y - 28, 24, 14, 1);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, [24, 158, 82], [118, 255, 168], stroke, 4.2);
    pg.pop();
  }

  // ===========================================================================
  // 15 GLOBALIZATION GOLDEN AGE: HUBLESS AURORA FIBER-OPTIC & TITANIUM COMMUTER BIKE!
  // ===========================================================================
  else if (v === 'aero_globe') {
    pg.push();
    pg.noFill();
    pg.stroke(98, 255, 232);
    pg.strokeWeight(6.5);
    pg.bezier(rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y - 28, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y);
    pg.stroke(255, 255, 255);
    pg.strokeWeight(2.5);
    pg.bezier(rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y - 28, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y);
    pg.pop();
  }

  else {
    const tubeR = 3.5;
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.bb.x, rig.bb.y, frameBase, frameHi, stroke, tubeR);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.headTubeTop.x, rig.headTubeTop.y, frameBase, frameHi, stroke, tubeR);
    BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.seatPost.x, rig.seatPost.y, frameBase, frameHi, stroke, tubeR);
    BrushKit.draw3DTube(pg, rig.rearWheel.x, rig.rearWheel.y, rig.seatPost.x, rig.seatPost.y, frameBase, frameHi, stroke, tubeR * 0.85);
    BrushKit.draw3DTube(pg, rig.seatPost.x, rig.seatPost.y, rig.headTubeTop.x, rig.headTubeTop.y, frameBase, frameHi, stroke, tubeR);
    BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.frontWheel.x, rig.frontWheel.y, frameBase, frameHi, stroke, tubeR);
  }

  BrushKit.draw3DTube(pg, rig.headTubeTop.x, rig.headTubeTop.y, rig.handlebar.x, rig.handlebar.y, frameBase, frameHi, stroke, 3.0);

  pg.push();
  pg.translate(rig.bb.x, rig.bb.y);
  pg.rotate(rig.crankAngle);
  pg.fill(frameBase[0], frameBase[1], frameBase[2], 240);
  pg.stroke(...stroke);
  pg.strokeWeight(2.0);
  pg.ellipse(0, 0, 30, 30);
  pg.fill(frameHi[0], frameHi[1], frameHi[2], 200);
  pg.ellipse(0, 0, 11, 11);
  pg.pop();

  BrushKit.draw3DTube(pg, rig.bb.x, rig.bb.y, rig.pedalNear.x, rig.pedalNear.y, frameBase, frameHi, stroke, 2.8);
}

function drawVolumetricLeg(pg, limb, strokeCol, thighCol, shadeCol, footCol, alphaScale) {
  const a = Math.round(255 * alphaScale);
  pg.push();
  const mx = (limb.root.x + limb.joint.x) * 0.5;
  const my = (limb.root.y + limb.joint.y) * 0.5;
  const ang = Math.atan2(limb.joint.y - limb.root.y, limb.joint.x - limb.root.x);
  pg.push();
  pg.translate(mx, my);
  pg.rotate(ang);
  pg.fill(thighCol[0], thighCol[1], thighCol[2], a);
  pg.stroke(strokeCol[0], strokeCol[1], strokeCol[2], a);
  pg.strokeWeight(2.2);
  pg.ellipse(0, 0, Math.hypot(limb.joint.x - limb.root.x, limb.joint.y - limb.root.y) + 5, 14);
  pg.pop();

  BrushKit.draw3DTube(pg, limb.joint.x, limb.joint.y, limb.end.x, limb.end.y, footCol, [255, 235, 175], strokeCol, 2.6);

  pg.fill(footCol[0], footCol[1], footCol[2], a);
  pg.stroke(strokeCol[0], strokeCol[1], strokeCol[2], a);
  pg.strokeWeight(2.0);
  pg.ellipse(limb.joint.x, limb.joint.y, 9, 9);

  pg.fill(footCol[0], footCol[1], footCol[2], a);
  pg.beginShape();
  pg.vertex(limb.end.x - 5, limb.end.y - 2);
  pg.vertex(limb.end.x + 19, limb.end.y - 4);
  pg.vertex(limb.end.x + 22, limb.end.y + 4);
  pg.vertex(limb.end.x - 7, limb.end.y + 5);
  pg.endShape(pg.CLOSE);

  pg.fill(65, 55, 45, a);
  pg.rect(limb.end.x - 10, limb.end.y + 3, 28, 5, 2);
  pg.pop();
}

function drawVolumetricWing(pg, wingIK, strokeCol, wingCol, shadeCol, rimLight) {
  pg.push();
  const sx = wingIK.root.x, sy = wingIK.root.y;
  const ex = wingIK.joint.x, ey = wingIK.joint.y;
  const hx = wingIK.end.x, hy = wingIK.end.y;

  for (let f = 6; f >= 0; f--) {
    const u = f / 6;
    const bx = ex + (hx - ex) * (0.2 + u * 0.75);
    const by = ey + (hy - ey) * (0.2 + u * 0.75);
    const featherLen = 40 - f * 4.0;
    const ang = Math.atan2(ey - sy, ex - sx) + 2.38 - f * 0.11;
    pg.fill(f < 3 ? shadeCol : wingCol);
    pg.stroke(...strokeCol);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(sx + (ex - sx) * u, sy + (ey - sy) * u);
    pg.quadraticVertex(
      bx + Math.cos(ang) * featherLen * 0.7,
      by + Math.sin(ang) * featherLen * 0.7,
      bx + Math.cos(ang) * featherLen,
      by + Math.sin(ang) * featherLen
    );
    pg.quadraticVertex(bx - 5, by + 5, bx, by);
    pg.endShape(pg.CLOSE);
  }

  pg.fill(...wingCol);
  pg.stroke(...strokeCol);
  pg.strokeWeight(2.2);
  pg.beginShape();
  pg.vertex(sx - 6, sy - 3);
  pg.quadraticVertex(ex - 12, ey + 14, ex + 14, ey + 5);
  pg.quadraticVertex(hx - 3, hy + 3, hx, hy);
  pg.quadraticVertex(ex + 5, ey - 11, sx - 6, sy - 3);
  pg.endShape(pg.CLOSE);

  pg.noFill();
  pg.stroke(rimLight[0], rimLight[1], rimLight[2], 195);
  pg.strokeWeight(1.5);
  pg.bezier(sx - 5, sy - 3, ex - 3, ey - 9, ex + 8, ey - 5, hx - 2, hy);
  pg.pop();
}

/**
 * ============================================================================
 * V6.0 SLOT 4: MANDATORY FOREGROUND HANDLEBAR MODULE (`VehicleHandlebarContract`)
 * ============================================================================
 * Ensures 100% of eras (especially 06, 07, 08, 09, 10, 11, 12, 13, 14, 15) have a
 * bold, unmistakable, era-authentic Handlebar Assembly rendered on the VERY TOP
 * FOREGROUND LAYER at `(rig.handlebar.x, rig.handlebar.y)` with Pelican Wing-Clasp IK Lock!
 */
function drawHandlebarModule(pg, rig, state, theme, v) {
  const { stroke, frameBase, frameHi } = theme;
  const hx = rig.handlebar.x;
  const hy = rig.handlebar.y;
  const stX = rig.headTubeTop.x;
  const stY = rig.headTubeTop.y;
  const t = state.t;

  pg.push();

  // 1) Reinforced Stem riser connecting headTubeTop -> handlebar anchor
  BrushKit.draw3DTube(pg, stX, stY, hx, hy, frameBase, frameHi, stroke, 3.8);

  // 2) Era-Specific Foreground Handlebar Crossbar, Grips, Brake Levers, Tassels & Instruments!
  if (v === 'song_wheelbarrow') {
    // 06 NORTHERN SONG: Dual Curved Bamboo-Wood Jigongche Crossbar + Crimson Silk Tassel + Brass Bell ("北宋双曲辕竹木鸡公车车把 + 红绸流苏 + 黄铜响铃")
    pg.noFill();
    pg.stroke(98, 62, 26);
    pg.strokeWeight(7.0);
    pg.bezier(hx - 26, hy + 8, hx - 8, hy - 14, hx + 14, hy - 14, hx + 28, hy + 4);
    pg.stroke(218, 176, 104);
    pg.strokeWeight(3.2);
    pg.bezier(hx - 26, hy + 8, hx - 8, hy - 14, hx + 14, hy - 14, hx + 28, hy + 4);
    // Bamboo node rings & woven rattan grips
    pg.fill(78, 128, 68);
    pg.stroke(36, 48, 28);
    pg.strokeWeight(1.8);
    pg.ellipse(hx - 24, hy + 7, 13, 9);
    pg.ellipse(hx + 26, hy + 3, 13, 9);
    // Brass Bicycle Bell ("北宋黄铜响铃")
    pg.fill(255, 214, 68);
    pg.stroke(88, 52, 16);
    pg.strokeWeight(1.8);
    pg.arc(hx + 10, hy - 12, 16, 14, Math.PI, Math.PI * 2);
    // Flowing Crimson Silk Tassel ("迎风飘拂红绸流苏")
    const sw = Math.sin(t * 9.0) * 7;
    pg.stroke(228, 38, 32);
    pg.strokeWeight(3.0);
    pg.noFill();
    pg.bezier(hx + 26, hy + 5, hx + 22 + sw * 0.5, hy + 18, hx + 16 + sw, hy + 28, hx + 12 + sw * 1.3, hy + 38);
    pg.fill(255, 212, 68);
    pg.ellipse(hx + 26, hy + 5, 7, 7);
  }
  else if (v === 'ming_carriage') {
    // 07 YUAN-MING-QING: Jingdezhen Blue-and-White Porcelain Scroll Handlebar + Wolf-Hair Brush Ferrule ("景德镇青花瓷轴横把 + 狼毫湘妃竹笔管把套")
    BrushKit.draw3DTube(pg, hx - 26, hy + 4, hx + 26, hy - 4, [245, 250, 255], [255, 255, 255], [22, 64, 158], 5.2);
    pg.fill(28, 82, 186);
    pg.noStroke();
    pg.ellipse(hx - 10, hy + 1, 7, 7);
    pg.ellipse(hx + 10, hy - 1, 7, 7);
    pg.fill(24, 32, 48);
    pg.stroke(245, 250, 255);
    pg.strokeWeight(1.5);
    pg.triangle(hx - 26, hy + 4, hx - 38, hy + 10, hx - 34, hy - 2);
  }
  else if (v === 'davinci_gear') {
    // 08 INCA & NAVIGATION: Foreground Mahogany & Brass Ship's Helm T-Bar ("圣玛利亚号前甲板最前景层红木黄铜船舵式 T 型横把，100% 不被船帆遮挡！")
    BrushKit.draw3DTube(pg, stX, stY, hx + 6, hy - 6, [128, 68, 28], [255, 216, 78], [42, 22, 10], 5.0);
    BrushKit.draw3DTube(pg, hx - 26, hy - 2, hx + 30, hy - 8, [142, 74, 30], [255, 222, 88], [42, 22, 10], 5.5);
    pg.push();
    pg.translate(hx + 4, hy - 6);
    pg.rotate(t * 2.2);
    pg.noFill();
    pg.stroke(255, 218, 68);
    pg.strokeWeight(2.8);
    pg.ellipse(0, 0, 26, 26);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * 16, Math.sin(a) * 16);
    }
    pg.pop();
    pg.fill(255, 218, 78);
    pg.stroke(68, 36, 12);
    pg.strokeWeight(1.8);
    pg.ellipse(hx - 26, hy - 2, 12, 9);
    pg.ellipse(hx + 30, hy - 8, 12, 9);
  }
  else if (v === 'penny_farthing') {
    // 09 VAN GOGH & INDUSTRIAL: Victorian Brass Cowhorn High-Wheeler Bar + Chrome-Yellow Paint Tube Grips
    pg.noFill();
    pg.stroke(245, 198, 68);
    pg.strokeWeight(5.8);
    pg.bezier(hx - 26, hy + 8, hx - 8, hy - 14, hx + 12, hy - 14, hx + 28, hy + 4);
    pg.fill(28, 82, 198);
    pg.stroke(255, 224, 68);
    pg.strokeWeight(2.0);
    pg.ellipse(hx - 26, hy + 8, 13, 9);
    pg.ellipse(hx + 28, hy + 4, 13, 9);
  }
  else if (v === 'safety_dynamo') {
    // 10 FARADAY ELECTROMAGNETIC: Ebonite Dual Drop Bar Wrapped in Glowing Copper Coils + Jacob's Ladder Horn Spark Gap ("缠绕发光紫铜线圈的黑胶木绝缘双弯把 + 羊角电弧放电球")
    pg.noFill();
    pg.stroke(28, 34, 44);
    pg.strokeWeight(6.5);
    pg.bezier(hx - 22, hy - 4, hx + 14, hy - 12, hx + 28, hy + 8, hx + 14, hy + 20);
    pg.stroke(245, 148, 64);
    pg.strokeWeight(2.6);
    for (let k = -16; k <= 12; k += 7) {
      pg.line(hx + k, hy - 10, hx + k + 3, hy - 2);
    }
    const b1x = hx + 8, b1y = hy - 22;
    const b2x = hx + 26, b2y = hy - 18;
    pg.stroke(238, 158, 72);
    pg.strokeWeight(2.4);
    pg.line(hx + 4, hy - 8, b1x, b1y);
    pg.line(hx + 16, hy - 6, b2x, b2y);
    pg.fill(118, 255, 255);
    pg.noStroke();
    pg.ellipse(b1x, b1y, 9, 9);
    pg.ellipse(b2x, b2y, 9, 9);
    pg.stroke(138, 255, 255);
    pg.strokeWeight(2.2);
    pg.line(b1x, b1y, (b1x + b2x) * 0.5, (b1y + b2y) * 0.5 - 6 + Math.sin(t * 40) * 4);
    pg.line((b1x + b2x) * 0.5, (b1y + b2y) * 0.5 - 6 + Math.sin(t * 40) * 4, b2x, b2y);
  }
  else if (v === 'tesla_lightning') {
    // 11 TESLA AC: High-Voltage Ribbed White Porcelain Insulator Bar + Leyden Jar Handguards ("高压白瓷绝缘子横把 + 莱顿瓶护手")
    BrushKit.draw3DTube(pg, hx - 26, hy + 4, hx + 26, hy - 4, [242, 246, 255], [255, 255, 255], [88, 42, 168], 6.0);
    pg.fill(248, 250, 255);
    pg.stroke(138, 78, 235);
    pg.strokeWeight(1.8);
    for (let k = -18; k <= 18; k += 9) {
      pg.ellipse(hx + k, hy - k * 0.15, 8, 14);
    }
    pg.fill(198, 138, 255, 235);
    pg.stroke(255, 245, 255);
    pg.rect(hx + 22, hy - 12, 12, 16, 3);
  }
  else if (v === 'relativity_photon') {
    // 12 EINSTEIN RELATIVITY: Doppler Redshift / Blueshift Photonic Drop Bar ("多普勒红移/蓝移光子弯把")
    pg.noFill();
    pg.stroke(255, 108, 58);
    pg.strokeWeight(6.0);
    pg.arc(hx + 6, hy + 4, 42, 26, Math.PI * 0.75, Math.PI * 1.55);
    pg.stroke(88, 238, 255);
    pg.strokeWeight(6.0);
    pg.arc(hx + 6, hy + 4, 42, 26, -Math.PI * 0.45, Math.PI * 0.45);
    pg.fill(255, 238, 128);
    pg.noStroke();
    pg.ellipse(hx + 26, hy + 4, 10, 10);
  }
  else if (v === 'carbon_olympic') {
    // 13 MODERN OLYMPICS: 5-Ring Painted Full-Carbon Aero Triathlon Bars ("奥运五环涂装全碳纤维空气动力学休息把 Aero Bars")
    pg.noFill();
    pg.stroke(28, 36, 48);
    pg.strokeWeight(6.5);
    pg.line(hx - 18, hy + 4, hx + 34, hy - 8);
    pg.arc(hx + 16, hy + 6, 34, 24, -Math.PI * 0.4, Math.PI * 0.55);
    const aeroCols = [[0, 133, 199], [244, 195, 0], [255, 255, 255], [0, 159, 61], [223, 0, 36]];
    aeroCols.forEach((ac, idx) => {
      pg.fill(...ac);
      pg.noStroke();
      pg.ellipse(hx - 8 + idx * 9, hy + 2 - idx * 2, 7, 7);
    });
  }
  else if (v === 'pixel_bmx') {
    // 14 SILICON VALLEY: Retro BMX Dual-Crossbar with Rainbow Ribbon Cable & Mechanical Keycap Grips ("复古BMX双横梁燕把 + 彩虹排线 + 机械键盘按键把套")
    pg.noFill();
    pg.stroke(38, 238, 128);
    pg.strokeWeight(5.2);
    pg.line(hx - 16, hy + 8, hx - 8, hy - 18);
    pg.line(hx - 8, hy - 18, hx + 22, hy - 18);
    pg.line(hx + 22, hy - 18, hx + 16, hy + 8);
    pg.strokeWeight(3.2);
    pg.line(hx - 12, hy - 6, hx + 18, hy - 6);
    const rbCols = [[255, 72, 72], [255, 212, 58], [72, 238, 128], [72, 178, 255]];
    rbCols.forEach((rc, i) => {
      pg.stroke(...rc);
      pg.strokeWeight(2.2);
      pg.line(hx - 4 + i * 5, hy - 20, hx - 2 + i * 5, hy - 4);
    });
    pg.fill(242, 240, 232);
    pg.stroke(24, 34, 28);
    pg.strokeWeight(1.8);
    pg.rect(hx - 24, hy - 22, 14, 12, 2);
    pg.fill(238, 68, 58);
    pg.rect(hx + 16, hy - 22, 16, 12, 2);
  }
  else if (v === 'aero_globe') {
    // 15 GLOBALIZATION: Carbon-Titanium Butterfly Trekking Bar + Center Holographic 5-Continent Nav & Hydraulic Brake Levers ("碳纤钛合金蝴蝶旅行把 + 中置全息五洲导航仪 + 液压刹把")
    pg.noFill();
    pg.stroke(218, 238, 252);
    pg.strokeWeight(5.0);
    pg.ellipse(hx - 10, hy - 2, 26, 16);
    pg.ellipse(hx + 14, hy - 2, 26, 16);
    pg.stroke(98, 255, 232);
    pg.strokeWeight(2.8);
    pg.line(hx + 24, hy - 4, hx + 36, hy + 4);
    pg.fill(18, 88, 138, 220);
    pg.stroke(118, 255, 232);
    pg.strokeWeight(1.8);
    pg.ellipse(hx + 2, hy - 12, 18, 18);
    pg.noStroke();
    pg.fill(255, 238, 118);
    pg.ellipse(hx + 2 + Math.cos(t * 4) * 4, hy - 12, 5, 5);
  }
  else {
    // Acts 00-05: Classic Era-Styled Crossbar & Grips
    BrushKit.draw3DTube(pg, hx - 20, hy + 4, hx + 22, hy - 4, frameBase, frameHi, stroke, 4.6);
    pg.fill(frameHi[0], frameHi[1], frameHi[2]);
    pg.stroke(...stroke);
    pg.strokeWeight(1.8);
    pg.ellipse(hx - 20, hy + 4, 11, 8);
    pg.ellipse(hx + 22, hy - 4, 11, 8);
  }

  // 3) Pelican Wing-Hand Clasp locked directly onto (hx, hy) so the grip is 100% physically grounded!
  pg.fill(theme.fillWing[0], theme.fillWing[1], theme.fillWing[2]);
  pg.stroke(...stroke);
  pg.strokeWeight(2.0);
  pg.ellipse(hx, hy, 13, 10);

  pg.pop();
}

function drawVolumetricWheel(pg, center, r, angle, vehicle, theme, isFront = true, t = 0) {
  const { stroke, frameBase, frameHi } = theme;
  pg.push();
  pg.translate(center.x, center.y);
  pg.rotate(angle);

  if (vehicle === 'stone_roller') {
    pg.fill(92, 68, 48, 240);
    pg.stroke(...stroke);
    pg.strokeWeight(3.0);
    pg.beginShape();
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const rad = r * (0.90 + 0.10 * Math.sin(i * 5.0));
      pg.vertex(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    pg.endShape(pg.CLOSE);
    BrushKit.draw3DTube(pg, -r * 0.78, 0, r * 0.78, 0, frameBase, frameHi, stroke, 3.2);
    BrushKit.draw3DTube(pg, 0, -r * 0.78, 0, r * 0.78, frameBase, frameHi, stroke, 3.2);
  }
  else if (vehicle === 'ark_ship') {
    pg.stroke(frameHi[0], frameHi[1], frameHi[2], 230);
    pg.strokeWeight(3.2);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * (r + 7), Math.sin(a) * (r + 7));
    }
    pg.noFill();
    pg.stroke(...stroke);
    pg.strokeWeight(7.0);
    pg.ellipse(0, 0, r * 2, r * 2);
    pg.stroke(frameBase[0], frameBase[1], frameBase[2], 255);
    pg.strokeWeight(3.8);
    pg.ellipse(0, 0, r * 2 - 5, r * 2 - 5);
  }
  else if (vehicle === 'song_wheelbarrow') {
    // 06 NORTHERN SONG: Mortise-and-Tenon Cross-Timber Wheel with Raised Clay Movable-Type Printing Blocks on Rim!
    pg.fill(218, 204, 172, 165);
    pg.stroke(78, 52, 28);
    pg.strokeWeight(5.5);
    pg.ellipse(0, 0, r * 2, r * 2);
    // Song cross-brace wooden beams ("榫卯井字木轮骨")
    pg.stroke(128, 86, 44);
    pg.strokeWeight(4.5);
    pg.line(-r * 0.85, -r * 0.32, r * 0.85, -r * 0.32);
    pg.line(-r * 0.85, r * 0.32, r * 0.85, r * 0.32);
    pg.line(-r * 0.32, -r * 0.85, -r * 0.32, r * 0.85);
    pg.line(r * 0.32, -r * 0.85, r * 0.32, r * 0.85);
    // 8 Bi Sheng Movable-Type Stamps studded around the tire rim!
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pg.push();
      pg.rotate(a);
      pg.fill(188, 52, 38);
      pg.stroke(248, 224, 148);
      pg.strokeWeight(1.4);
      pg.rect(r - 4, -5, 9, 10, 1);
      pg.pop();
    }
  }
  else if (vehicle === 'ming_carriage') {
    // 07 YUAN-MING-QING: Splash-Ink Taiji Swirl × Jingdezhen Blue-and-White Porcelain Lotus Medallion Wheel!
    pg.fill(248, 251, 255, 240);
    pg.stroke(22, 64, 158);
    pg.strokeWeight(5.0);
    pg.ellipse(0, 0, r * 2, r * 2);
    // Splash-Ink / Cobalt-Blue Swirling Half-Moon inside the Porcelain Wheel!
    pg.fill(24, 68, 168, 225);
    pg.noStroke();
    pg.arc(0, 0, r * 1.75, r * 1.75, 0, Math.PI);
    pg.fill(24, 68, 168, 225);
    pg.ellipse(-r * 0.42, 0, r * 0.85, r * 0.85);
    pg.fill(248, 251, 255);
    pg.ellipse(r * 0.42, 0, r * 0.85, r * 0.85);
    // 8 Cobalt Blue Lotus Petals around the rim
    pg.noFill();
    pg.stroke(22, 64, 158);
    pg.strokeWeight(2.0);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pg.ellipse(Math.cos(a) * r * 0.68, Math.sin(a) * r * 0.68, 14, 8);
    }
  }
  else if (vehicle === 'davinci_gear') {
    // 08 INCA & NAVIGATION: Rear = Solid-Gold 16-Ray Inca Sun-God Disk; Front = 8-Spoke Brass Ship's Helm Wheel!
    if (!isFront) {
      // Rear Wheel: Solid-Gold Inca Sun-God (Inti) Radial Sawtooth Disk!
      pg.fill(255, 204, 48, 235);
      pg.stroke(112, 62, 12);
      pg.strokeWeight(2.4);
      pg.beginShape();
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2;
        const rad = (i % 2 === 0) ? r + 6 : r - 7;
        pg.vertex(Math.cos(a) * rad, Math.sin(a) * rad);
      }
      pg.endShape(pg.CLOSE);
      pg.fill(32, 214, 168);
      pg.ellipse(0, 0, r * 0.85, r * 0.85);
    } else {
      // Front Wheel: Age-of-Sail Mahogany & Brass Ship's Helm Wheel with 8 Projecting Handles!
      pg.stroke(255, 212, 72);
      pg.strokeWeight(4.2);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        pg.line(0, 0, Math.cos(a) * (r + 10), Math.sin(a) * (r + 10));
        pg.fill(255, 218, 88);
        pg.ellipse(Math.cos(a) * (r + 10), Math.sin(a) * (r + 10), 7, 7);
      }
      pg.noFill();
      pg.stroke(118, 62, 24);
      pg.strokeWeight(8.0);
      pg.ellipse(0, 0, r * 1.85, r * 1.85);
      pg.stroke(255, 214, 78);
      pg.strokeWeight(2.5);
      pg.ellipse(0, 0, r * 1.85, r * 1.85);
    }
  }
  else if (vehicle === 'penny_farthing') {
    // 09 VAN GOGH & INDUSTRIAL: Half Brass Clockwork Gear + Half Swirling Van Gogh "Starry Night" Impasto Vortex Wheel!
    // Outer brass gear teeth + Cobalt/Chrome-Yellow impasto dashes swirling inside the wheel!
    pg.noFill();
    for (let ring = r * 0.32; ring <= r * 0.92; ring += 12) {
      for (let d = 0; d < 8; d++) {
        const a = (d / 8) * Math.PI * 2 + ring * 0.05;
        pg.stroke(d % 2 === 0 ? [255, 224, 62] : [58, 138, 248]);
        pg.strokeWeight(4.2);
        pg.arc(0, 0, ring * 2, ring * 2, a, a + 0.48);
      }
    }
    // 12 Brass Gear Teeth around the wheel rim ("机械与油画一体之黄铜齿轮外圈")!
    pg.stroke(245, 198, 72);
    pg.strokeWeight(3.2);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      pg.line(Math.cos(a) * (r - 4), Math.sin(a) * (r - 4), Math.cos(a) * (r + 6), Math.sin(a) * (r + 6));
    }
    pg.noFill();
    pg.stroke(24, 38, 78);
    pg.strokeWeight(5.5);
    pg.ellipse(0, 0, r * 2, r * 2);
    pg.stroke(255, 218, 78);
    pg.strokeWeight(2.8);
    pg.ellipse(0, 0, r * 2 - 4, r * 2 - 4);
  }
  else if (vehicle === 'safety_dynamo') {
    // 10 FARADAY ELECTROMAGNETIC DAWN: Copper Solenoid Torus Wheel with 8 Jagged High-Voltage Lightning Arc Spokes!
    // Glowing cyan plasma field inside wheel
    pg.fill(18, 58, 96, 155);
    pg.noStroke();
    pg.ellipse(0, 0, r * 1.9, r * 1.9);
    // 8 Jagged High-Voltage Lightning Bolts instead of ordinary wire spokes!
    pg.noFill();
    pg.stroke(118, 252, 255);
    pg.strokeWeight(2.6);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      const nx = -s, ny = c;
      const jit = Math.sin(t * 28 + i * 3) * 5;
      pg.beginShape();
      pg.vertex(c * 9, s * 9);
      pg.vertex(c * (r * 0.5) + nx * jit, s * (r * 0.5) + ny * jit);
      pg.vertex(c * (r - 6), s * (r - 6));
      pg.endShape();
    }
    // Outer Rim: Dark Iron Core wrapped in 16 Glowing Copper Solenoid Windings!
    pg.noFill();
    pg.stroke(24, 38, 58);
    pg.strokeWeight(8.0);
    pg.ellipse(0, 0, r * 2, r * 2);
    for (let w = 0; w < 16; w++) {
      const a = (w / 16) * Math.PI * 2;
      pg.stroke(w % 2 === 0 ? [242, 138, 62] : [98, 248, 255]);
      pg.strokeWeight(3.4);
      pg.line(Math.cos(a) * (r - 5), Math.sin(a) * (r - 5), Math.cos(a) * (r + 5), Math.sin(a) * (r + 5));
    }
  }
  else if (vehicle === 'tesla_lightning') {
    // 11 TESLA AC: Violet-White Ball-Lightning & Ceramic Insulator Coil Wheel!
    pg.fill(58, 28, 128, 175);
    pg.noStroke();
    pg.ellipse(0, 0, r * 1.9, r * 1.9);
    pg.noFill();
    pg.stroke(212, 148, 255);
    pg.strokeWeight(2.8);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pg.arc(0, 0, r * 1.35, r * 1.35, a, a + 0.65);
      pg.line(0, 0, Math.cos(a) * (r - 4), Math.sin(a) * (r - 4));
    }
    pg.stroke(238, 218, 255);
    pg.strokeWeight(5.5);
    pg.ellipse(0, 0, r * 2, r * 2);
  }
  else if (vehicle === 'relativity_photon') {
    // 12 EINSTEIN RELATIVITY: Rear = Warm Redshifted Photon Ring; Front = Cyan-Violet Blueshifted Photon Ring!
    const col = isFront ? [88, 224, 255] : [255, 138, 68];
    pg.noFill();
    pg.stroke(col[0], col[1], col[2], 235);
    pg.strokeWeight(5.5);
    pg.ellipse(0, 0, r * 2, r * 2);
    pg.stroke(255, 232, 118, 210);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 0, r * 1.4, r * 0.75);
    pg.ellipse(0, 0, r * 0.75, r * 1.4);
  }
  else if (vehicle === 'carbon_olympic') {
    // 13 MODERN OLYMPICS: Rear = Solid Olympic Five-Ring Aero Disc Wheel; Front = 3-Blade Carbon Tri-Spoke!
    if (!isFront) {
      pg.fill(24, 34, 48, 240);
      pg.stroke(255, 214, 58);
      pg.strokeWeight(4.5);
      pg.ellipse(0, 0, r * 2, r * 2);
      const ringCols = [[0, 133, 199], [244, 195, 0], [255, 255, 255], [0, 159, 61], [223, 0, 36]];
      ringCols.forEach((rc, idx) => {
        const rx = (idx - 2) * 11;
        const ry = (idx % 2 === 0) ? -4 : 5;
        pg.noFill();
        pg.stroke(...rc);
        pg.strokeWeight(2.4);
        pg.ellipse(rx, ry, 16, 16);
      });
    } else {
      pg.fill(28, 38, 54, 240);
      pg.noStroke();
      for (let i = 0; i < 3; i++) {
        pg.push();
        pg.rotate((i / 3) * Math.PI * 2);
        pg.quad(-6, 0, 6, 0, 12, r - 4, -12, r - 4);
        pg.pop();
      }
      pg.noFill();
      pg.stroke(28, 138, 238);
      pg.strokeWeight(6.0);
      pg.ellipse(0, 0, r * 2, r * 2);
    }
  }
  else if (vehicle === 'pixel_bmx') {
    // 14 SILICON VALLEY: Rear = 3.5-inch Floppy Disk Wheel; Front = Golden Silicon Wafer Wheel!
    if (!isFront) {
      pg.fill(28, 88, 188, 240);
      pg.stroke(98, 255, 158);
      pg.strokeWeight(3.0);
      pg.rect(-r * 0.78, -r * 0.78, r * 1.56, r * 1.56, 6);
      pg.fill(218, 226, 235);
      pg.rect(-r * 0.35, -r * 0.78, r * 0.70, r * 0.42);
    } else {
      pg.fill(24, 118, 78, 225);
      pg.stroke(255, 218, 88);
      pg.strokeWeight(4.5);
      pg.ellipse(0, 0, r * 2, r * 2);
      pg.stroke(118, 255, 168);
      pg.strokeWeight(1.6);
      for (let k = -r * 0.6; k <= r * 0.6; k += 14) {
        pg.line(-r * 0.7, k, r * 0.7, k);
        pg.line(k, -r * 0.7, k, r * 0.7);
      }
    }
  }
  else if (vehicle === 'aero_globe') {
    // 15 GLOBALIZATION: Hubless Hollow Aurora Maglev Halo Wheel!
    pg.noFill();
    pg.stroke(42, 188, 228, 235);
    pg.strokeWeight(8.5);
    pg.ellipse(0, 0, r * 2, r * 2);
    pg.stroke(148, 255, 232);
    pg.strokeWeight(3.2);
    pg.ellipse(0, 0, r * 1.78, r * 1.78);
    // 5 Glowing Continent Nodes orbiting the hubless rim
    for (let c = 0; c < 5; c++) {
      const a = (c / 5) * Math.PI * 2;
      pg.fill(255, 238, 118);
      pg.noStroke();
      pg.ellipse(Math.cos(a) * r * 0.88, Math.sin(a) * r * 0.88, 8, 8);
    }
  }
  else {
    const spokes = vehicle === 'chariot' ? 8 : vehicle === 'shang_chariot' ? 18 : 14;
    pg.stroke(frameHi[0], frameHi[1], frameHi[2], 195);
    pg.strokeWeight(vehicle === 'chariot' ? 3.4 : 1.8);
    for (let i = 0; i < spokes; i++) {
      const a = (i / spokes) * Math.PI * 2;
      const hubOff = (i % 2 === 0 ? 1 : -1) * 0.35;
      pg.line(Math.cos(a + hubOff) * 8, Math.sin(a + hubOff) * 8, Math.cos(a) * (r - 5), Math.sin(a) * (r - 5));
    }
    pg.noFill();
    pg.stroke(...stroke);
    pg.strokeWeight(7.0);
    pg.ellipse(0, 0, r * 2, r * 2);
    pg.stroke(frameBase[0], frameBase[1], frameBase[2], 255);
    pg.strokeWeight(3.8);
    pg.ellipse(0, 0, r * 2 - 5, r * 2 - 5);
  }

  pg.fill(frameHi[0], frameHi[1], frameHi[2], 245);
  pg.stroke(...stroke);
  pg.strokeWeight(2.0);
  pg.ellipse(0, 0, 18, 18);
  pg.fill(...stroke);
  pg.ellipse(0, 0, 6, 6);
  pg.pop();
}
