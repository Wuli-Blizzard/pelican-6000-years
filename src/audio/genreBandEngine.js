// === src/audio/genreBandEngine.js ===
// V5 Masterpiece Audio & Procedural Soundscape Foley Engine:
// 1. Era 01 Lion Roar Causality Fix: Locked to `(state.t - 10.0) % 4.0`! Lion vocal blast fires at 0.25s, and the 38Hz Sub-Bass Seismic Boom peaks at +0.20s (0.45s) right as the visual shockwave hits the camera lens!
// 2. Era 05 High Tang Imperial Grandeur ("秦王破阵乐 · 万国来朝皇家交响"): Grand D-Gong Imperial Mode with Thunderous Tang Bo-Gu War-Drums, 36-Pipe Imperial Sheng & Brass Fanfare Chords, 4-String Strummed Pipa Power Chords, Soaring Bangdi, and 4-Part Imperial Choir!
// 3. Full 6-Era Rich Ambient Soundscape Foley (环境拟音全覆盖):
//    - 00 Intro: Mechanical Clockwork Winding Ratchet + Quill Scratching on Parchment + Workshop Bell
//    - 01 East Africa: Deafening Lion Roar + Bull Elephant Trumpet + Tropical Jungle Bird Chirps & Savanna Cicadas
//    - 02 Noah's Ark: Rolling Thunderclap Boom + Tempest Rain & Crashing Waves (1st half) -> Seagull Cries & Deep Whale Sonar (2nd half)
//    - 03 Shang Anyang: Pyromantic Tortoiseshell Fire-Cracks + Bronze Furnace Bellows Sizzle + Chariot Warhorse Neigh
//    - 04 Greek Olympics: 100,000-Spectator Stadium Crowd Roar + Salpinx Bronze Horn Blast + Chariot Whip Crack & Galloping Hooves
//    - 05 High Tang: Silk Road Caravan Camel Bell Jingles + Chang'an Western Market Hawker Calls ("胡饼—美酒啰—!")

const VOWEL_FORMANTS = {
  A: [730, 1090, 2440],
  O: [570, 840, 2410],
  E: [530, 1840, 2480],
  I: [390, 1990, 2550],
  U: [300, 870, 2240],
};

const ERA_SCALES = {
  intro: [146.83, 220.00, 293.66, 329.63, 349.23, 415.30, 440.00, 523.25, 587.33, 659.25],
  era01: [196.00, 246.94, 293.66, 349.23, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99],
  era02_storm: [130.81, 155.56, 196.00, 207.65, 261.63, 311.13, 392.00, 415.30, 523.25, 622.25],
  era02_light: [130.81, 196.00, 246.94, 261.63, 329.63, 369.99, 392.00, 493.88, 523.25, 659.25],
  era03: [146.83, 164.81, 220.00, 293.66, 329.63, 369.99, 415.30, 440.00, 493.88, 587.33],
  era04: [164.81, 174.61, 207.65, 220.00, 246.94, 329.63, 349.23, 415.30, 440.00, 493.88, 659.25],
  // 05 High Tang: Grand D-Gong Imperial Pentatonic Symphony Scale (D - E - F# - A - B - D - E - F# - A - D)
  era05: [146.83, 164.81, 185.00, 220.00, 246.94, 293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 739.99],
  // 06 Northern Song: A-Yu Literati Guqin & Xiao Scale (A - C - D - E - G - A - C - D - E - G)
  era06: [110.00, 130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25],
  // 07 Yuan-Ming-Qing: G-Zhi Kunqu & Peking Opera Jinghu Scale (G - A - C - D - E - G - A - C - D - E)
  era07: [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00],
  // 08 Inca & Navigation: E-Minor Andean Panpipe & Spanish Phrygian Guitar Scale
  era08: [164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 659.25],
  // 09 Industrial & Van Gogh Science: C-Minor / Eb-Major Romantic Swirling Symphonic Scale
  era09: [130.81, 146.83, 155.56, 174.61, 196.00, 207.65, 233.08, 261.63, 311.13, 392.00, 466.16, 523.25],
  // 10 Faraday Electromagnetic Dawn: F-Lydian Cosmic Synth-Fugue Scale (F - G - A - B - C - D - E - F - A - C)
  era10: [174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 440.00, 523.25, 659.25, 698.46],
  // 11 Nikola Tesla AC War: E-Harmonic Minor / Blues-Ragtime High-Voltage Scale
  era11: [164.81, 185.00, 196.00, 220.00, 246.94, 261.63, 311.13, 329.63, 392.00, 440.00, 493.88, 659.25],
  // 12 Einstein Relativity & 4D Spacetime Centipede: D-Minor Bach Chaconne & Cosmic Lydian Scale
  era12: [146.83, 164.81, 174.61, 196.00, 220.00, 233.08, 277.18, 293.66, 349.23, 440.00, 523.25, 587.33],
  // 13 Modern Olympics Five Rings: C-Major Heroic Brass Fanfare Scale
  era13: [130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94, 261.63, 329.63, 392.00, 523.25, 659.25],
  // 14 Silicon Valley Garage & 8-Bit Open Source: A-Mixolydian Chiptune Arpeggio Scale
  era14: [220.00, 246.94, 277.18, 293.66, 329.63, 369.99, 392.00, 440.00, 554.37, 659.25, 783.99, 880.00],
  // 15 Globalization 5-Continent Interconnect: G-Major World-Fusion Pentatonic-Symphonic Scale
  era15: [196.00, 220.00, 246.94, 293.66, 329.63, 392.00, 440.00, 493.88, 587.33, 659.25, 783.99, 987.77],
};

const ERA_MELODIES = {
  intro: [
    { s: 0, i: 2, d: 0.24 }, { s: 2, i: 4, d: 0.24 }, { s: 4, i: 5, d: 0.24 }, { s: 6, i: 6, d: 0.36 },
    { s: 8, i: 8, d: 0.24 }, { s: 10, i: 7, d: 0.24 }, { s: 12, i: 5, d: 0.24 }, { s: 14, i: 6, d: 0.36 },
  ],
  era01: [
    { s: 0, i: 4, d: 0.32 }, { s: 3, i: 6, d: 0.28 }, { s: 6, i: 7, d: 0.45 },
    { s: 10, i: 8, d: 0.30 }, { s: 12, i: 6, d: 0.25 }, { s: 14, i: 4, d: 0.35 },
  ],
  era02: [
    { s: 0, i: 4, d: 0.90 }, { s: 6, i: 6, d: 0.55 }, { s: 10, i: 8, d: 0.85 },
  ],
  era03: [
    { s: 0, i: 3, d: 0.45 }, { s: 4, i: 5, d: 0.30 }, { s: 6, i: 6, d: 0.35 },
    { s: 9, i: 7, d: 0.40 }, { s: 12, i: 5, d: 0.28 }, { s: 14, i: 3, d: 0.35 },
  ],
  era04: [
    { s: 0, i: 5, d: 0.35 }, { s: 3, i: 7, d: 0.30 }, { s: 6, i: 8, d: 0.45 },
    { s: 9, i: 9, d: 0.30 }, { s: 11, i: 8, d: 0.25 }, { s: 13, i: 7, d: 0.42 },
  ],
  // 05 High Tang: Heroic, Monumental Imperial Anthem ("秦王破阵乐 / 万国衣冠拜冕旒")
  era05: [
    { s: 0, i: 5, d: 0.46 }, { s: 4, i: 8, d: 0.46 }, { s: 8, i: 9, d: 0.34 },
    { s: 10, i: 10, d: 0.58 }, { s: 14, i: 8, d: 0.32 },
  ],
  // 06 Northern Song: Poetic Guqin & Xiao Melodic Cadence ("大江东去 / 雨霖铃")
  era06: [
    { s: 0, i: 5, d: 0.52 }, { s: 4, i: 7, d: 0.38 }, { s: 7, i: 8, d: 0.44 },
    { s: 10, i: 6, d: 0.40 }, { s: 13, i: 5, d: 0.45 },
  ],
  // 07 Yuan-Ming-Qing: Lively Kunqu & Peking Opera Jinghu Aria ("牡丹亭 / 宝船破浪")
  era07: [
    { s: 0, i: 5, d: 0.28 }, { s: 2, i: 6, d: 0.26 }, { s: 4, i: 8, d: 0.38 },
    { s: 7, i: 9, d: 0.28 }, { s: 10, i: 7, d: 0.34 }, { s: 13, i: 5, d: 0.38 },
  ],
  // 08 Inca & Navigation: Soaring Condor Panpipe & Flamenco Guitar Dialogue
  era08: [
    { s: 0, i: 7, d: 0.42 }, { s: 3, i: 6, d: 0.30 }, { s: 6, i: 4, d: 0.44 },
    { s: 10, i: 5, d: 0.32 }, { s: 12, i: 7, d: 0.30 }, { s: 14, i: 8, d: 0.38 },
  ],
  // 09 Industrial & Van Gogh Science: Swirling Starry Night Arpeggio & Brass Theme
  era09: [
    { s: 0, i: 4, d: 0.34 }, { s: 3, i: 7, d: 0.34 }, { s: 6, i: 8, d: 0.42 },
    { s: 9, i: 9, d: 0.34 }, { s: 12, i: 7, d: 0.32 }, { s: 14, i: 6, d: 0.36 },
  ],
  // 10 Faraday Electromagnetic Dawn: High-Voltage Maxwell Synth-Fugue Theme
  era10: [
    { s: 0, i: 4, d: 0.24 }, { s: 2, i: 6, d: 0.24 }, { s: 4, i: 7, d: 0.32 }, { s: 6, i: 8, d: 0.32 },
    { s: 8, i: 9, d: 0.36 }, { s: 11, i: 8, d: 0.26 }, { s: 13, i: 6, d: 0.28 }, { s: 15, i: 7, d: 0.28 },
  ],
  // 11 Tesla AC War: Syncopated Singing-Arc & Ragtime Theme
  era11: [
    { s: 0, i: 4, d: 0.22 }, { s: 3, i: 6, d: 0.22 }, { s: 6, i: 7, d: 0.32 },
    { s: 8, i: 8, d: 0.22 }, { s: 11, i: 7, d: 0.22 }, { s: 14, i: 9, d: 0.34 },
  ],
  // 12 Einstein Relativity & 4D Centipede: Soaring Solo Violin Chaconne Theme
  era12: [
    { s: 0, i: 4, d: 0.52 }, { s: 4, i: 7, d: 0.45 }, { s: 8, i: 9, d: 0.48 },
    { s: 12, i: 8, d: 0.42 },
  ],
  // 13 Modern Olympics: Triumphant Five-Ring Fanfare Anthem
  era13: [
    { s: 0, i: 4, d: 0.36 }, { s: 3, i: 7, d: 0.28 }, { s: 6, i: 8, d: 0.44 },
    { s: 10, i: 9, d: 0.38 }, { s: 13, i: 10, d: 0.44 },
  ],
  // 14 Silicon Valley 8-Bit Open Source: Fast Chiptune Lead Melody
  era14: [
    { s: 0, i: 4, d: 0.18 }, { s: 2, i: 6, d: 0.18 }, { s: 4, i: 7, d: 0.22 }, { s: 6, i: 9, d: 0.22 },
    { s: 8, i: 8, d: 0.22 }, { s: 10, i: 7, d: 0.18 }, { s: 12, i: 5, d: 0.22 }, { s: 14, i: 7, d: 0.24 },
  ],
  // 15 Globalization Golden Age: Euphoric 5-Continent World-Fusion Anthem
  era15: [
    { s: 0, i: 5, d: 0.40 }, { s: 3, i: 7, d: 0.32 }, { s: 6, i: 8, d: 0.44 },
    { s: 10, i: 9, d: 0.36 }, { s: 13, i: 8, d: 0.38 },
  ],
};

class ProceduralAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.reverbNode = null;
    this.isMuted = false;
    this.lastStep = -1;
    this.pluckCache = new Map();
    this.snareBuf = null;
    this.surfBuf = null;
    this.roarNoiseBuf = null;
    this.crackBuf = null;
    this.riserBuf = null;
    this.thunderBuf = null;
    this.crowdBuf = null;
    this.quillBuf = null;
    this.overdriveCurve = null;
  }

  ensureInit() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.knee.value = 10;
    comp.ratio.value = 4.0;

    this.master = this.ctx.createGain();
    this.master.gain.value = this.isMuted ? 0 : 0.56;

    this.reverbNode = this.createHallReverb(1.85, 2.1);
    const wetGain = this.ctx.createGain();
    wetGain.gain.value = 0.30;

    this.master.connect(comp);
    this.master.connect(this.reverbNode);
    this.reverbNode.connect(wetGain);
    wetGain.connect(comp);
    comp.connect(this.ctx.destination);

    this.prebakeBuffers();
  }

  prebakeBuffers() {
    const sr = this.ctx.sampleRate;

    // 1. Snare / Whip Buffer
    const sLen = Math.floor(sr * 0.16);
    this.snareBuf = this.ctx.createBuffer(1, sLen, sr);
    const sData = this.snareBuf.getChannelData(0);
    for (let i = 0; i < sLen; i++) {
      sData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sLen, 2.2);
    }

    // 2. Ocean Surf / Tempest Rain & Furnace Bellows Buffer
    const wLen = Math.floor(sr * 1.1);
    this.surfBuf = this.ctx.createBuffer(1, wLen, sr);
    const wData = this.surfBuf.getChannelData(0);
    for (let i = 0; i < wLen; i++) {
      wData[i] = (Math.random() * 2 - 1) * Math.sin((i / wLen) * Math.PI);
    }

    // 3. Lion Roar Guttural Turbulence Buffer
    const rLen = Math.floor(sr * 1.55);
    this.roarNoiseBuf = this.ctx.createBuffer(1, rLen, sr);
    const rData = this.roarNoiseBuf.getChannelData(0);
    for (let i = 0; i < rLen; i++) {
      const u = i / rLen;
      const env = Math.sin(u * Math.PI) * (0.65 + 0.35 * Math.sin(u * 42 * Math.PI * 2));
      rData[i] = (Math.random() * 2 - 1) * env;
    }

    // 4. Oracle Bone Pyromantic Fire-Crack Buffer
    const cLen = Math.floor(sr * 0.09);
    this.crackBuf = this.ctx.createBuffer(1, cLen, sr);
    const cData = this.crackBuf.getChannelData(0);
    for (let i = 0; i < cLen; i++) {
      cData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / cLen, 4.5);
    }

    // 5. Reverse Cymbal / Bronze Gong Riser Buffer
    const rsLen = Math.floor(sr * 1.4);
    this.riserBuf = this.ctx.createBuffer(1, rsLen, sr);
    const rsData = this.riserBuf.getChannelData(0);
    for (let i = 0; i < rsLen; i++) {
      const u = i / rsLen;
      rsData[i] = (Math.random() * 2 - 1) * Math.pow(u, 2.6);
    }

    // 6. Rolling Thunderclap Boom Buffer (Era 02 Storm Foley)
    const tLen = Math.floor(sr * 1.45);
    this.thunderBuf = this.ctx.createBuffer(1, tLen, sr);
    const tData = this.thunderBuf.getChannelData(0);
    for (let i = 0; i < tLen; i++) {
      const u = i / tLen;
      const crackEnv = Math.exp(-u * 3.8) * (0.7 + 0.3 * Math.sin(u * 18 * Math.PI));
      tData[i] = (Math.random() * 2 - 1) * crackEnv;
    }

    // 7. Olympic Stadium 100,000-Spectator Crowd Roar & Applause Buffer (Era 04 Foley)
    const crLen = Math.floor(sr * 1.25);
    this.crowdBuf = this.ctx.createBuffer(1, crLen, sr);
    const crData = this.crowdBuf.getChannelData(0);
    for (let i = 0; i < crLen; i++) {
      const u = i / crLen;
      crData[i] = (Math.random() * 2 - 1) * Math.sin(u * Math.PI) * (0.75 + 0.25 * Math.sin(u * 65));
    }

    // 8. Da Vinci Quill Pen Scratching on Parchment Buffer (Era 00 Foley)
    const qLen = Math.floor(sr * 0.22);
    this.quillBuf = this.ctx.createBuffer(1, qLen, sr);
    const qData = this.quillBuf.getChannelData(0);
    for (let i = 0; i < qLen; i++) {
      const u = i / qLen;
      qData[i] = (Math.random() * 2 - 1) * Math.sin(u * Math.PI) * (i % 7 < 3 ? 1.0 : 0.2);
    }

    // 9. Tube Overdrive Curve
    this.overdriveCurve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1;
      this.overdriveCurve[i] = Math.tanh(x * 3.8);
    }

    // 10. Pre-warm Karplus-Strong cache for all Era scales
    Object.values(ERA_SCALES).forEach((scale) => {
      scale.forEach((f) => {
        this.getKarplusStrongBuffer(f, 0.85, 0.994, 0.72);
        this.getKarplusStrongBuffer(f * 2, 0.85, 0.994, 0.72);
      });
    });
  }

  createHallReverb(duration, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * duration);
    const impulse = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const buf = impulse.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        buf[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    const conv = this.ctx.createConvolver();
    conv.buffer = impulse;
    return conv;
  }

  getKarplusStrongBuffer(freq, duration = 0.85, damping = 0.994, brightness = 0.72) {
    const key = `${Math.round(freq)}`;
    if (this.pluckCache.has(key)) return this.pluckCache.get(key);

    const sr = this.ctx.sampleRate;
    const len = Math.floor(sr * duration);
    const buf = this.ctx.createBuffer(1, len, sr);
    const data = buf.getChannelData(0);
    const N = Math.max(4, Math.round(sr / freq));
    const ring = new Float32Array(N);

    for (let i = 0; i < N; i++) {
      ring[i] = (Math.random() * 2 - 1) * (1 - brightness * 0.4 * Math.cos((i / N) * Math.PI * 2));
    }

    let ptr = 0;
    for (let i = 0; i < len; i++) {
      const nextPtr = (ptr + 1) % N;
      const avg = (ring[ptr] + ring[nextPtr]) * 0.5 * damping;
      data[i] = ring[ptr];
      ring[ptr] = avg;
      ptr = nextPtr;
    }

    this.pluckCache.set(key, buf);
    return buf;
  }

  playPluckedString(freq, now, gainVal = 0.30) {
    if (gainVal < 0.01) return;
    const buf = this.getKarplusStrongBuffer(freq);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    src.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.56, this.ctx.currentTime, 0.03);
    }
  }

  getCrossfadeWeights(t) {
    const FADE_HALF = 1.6;
    for (let i = 0; i < TIMELINE.length - 1; i++) {
      const boundary = TIMELINE[i].end;
      if (Math.abs(t - boundary) < FADE_HALF) {
        const u = Math.max(0, Math.min(1, (t - (boundary - FADE_HALF)) / (FADE_HALF * 2)));
        const wLeft = Math.cos(u * Math.PI * 0.5);
        const wRight = Math.sin(u * Math.PI * 0.5);
        return [
          { id: TIMELINE[i].id, w: wLeft, isTransition: true, u },
          { id: TIMELINE[i + 1].id, w: wRight, isTransition: true, u },
        ];
      }
    }
    const { era } = getEraAtWorldX(t * WORLD_SPEED);
    return [{ id: era.id, w: 1.0, isTransition: false, u: 0 }];
  }

  triggerForState(state) {
    if (!this.ctx || this.ctx.state !== 'running') {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    if (this.isMuted) return;

    const step = Math.floor(state.beat * 4);
    if (step === this.lastStep) return;
    this.lastStep = step;

    const s16 = step % 16;
    const barIdx = Math.floor(step / 16);
    const swingOffset = (s16 % 2 === 1) ? 0.012 : 0.0;
    const now = this.ctx.currentTime + swingOffset;

    const activeLayers = this.getCrossfadeWeights(state.t);

    TIMELINE.slice(0, -1).forEach((eraObj) => {
      const timeToSeam = eraObj.end - state.t;
      if (timeToSeam > 1.05 && timeToSeam < 1.22 && s16 % 4 === 0) {
        this.playTransitionBridgeRiser(now, eraObj.id);
      }
    });

    activeLayers.forEach(({ id, w }) => {
      if (w < 0.04) return;
      try {
        this.triggerDistinctEraWorld(id, w, s16, barIdx, state, now);
      } catch (err) {
        // Safe guard against any Web Audio scheduling edge case
      }
    });
  }

  triggerDistinctEraWorld(id, w, s16, barIdx, state, now) {
    // =========================================================================
    // 00 INTRO: BAROQUE HARPSICHORD FUGUE + CLOCKWORK WINDING & QUILL FOLEY!
    // =========================================================================
    if (id === 'intro') {
      const scale = ERA_SCALES.intro;
      if (s16 % 2 === 0) {
        this.playClockworkTick(now, s16 % 4 === 0 ? 2800 : 1950, 0.16 * w);
      }
      // Ambient Foley 1: Mechanical Clockwork Winding Ratchet on steps 3 & 11
      if (s16 === 3 || s16 === 11) {
        this.playClockworkWindingRatchet(now, 0.18 * w);
      }
      // Ambient Foley 2: Da Vinci Quill Pen Scratching on Parchment on steps 6 & 14
      if (s16 === 6 || s16 === 14) {
        this.playQuillScratchFoley(now, 0.22 * w);
      }
      const mel = ERA_MELODIES.intro.find((m) => m.s === s16);
      if (mel) {
        const fHigh = scale[mel.i];
        const fLow = scale[Math.max(0, 7 - mel.i)] * 0.5;
        this.playPluckedString(fHigh * 2, now, 0.26 * w);
        this.playPluckedString(fLow * 2, now + 0.02, 0.18 * w);
      }
      if (s16 === 0 || s16 === 8) {
        this.playGlassHarmonica(scale[s16 === 0 ? 6 : 7] * 2, now, 0.75, 0.16 * w);
      }
    }

    // =========================================================================
    // 01 EAST AFRICA: AFRO-POLYRHYTHM + EXACT SPEED-OF-SOUND LION ROAR + JUNGLE BIRDS & CICADAS FOLEY!
    // =========================================================================
    else if (id === 'era01') {
      const scale = ERA_SCALES.era01;
      if (s16 === 0 || s16 === 6 || s16 === 12) {
        this.playDrumKick(now, 148, 0.42 * w);
      }
      if (s16 === 3 || s16 === 7 || s16 === 10 || s16 === 14) {
        this.playWoodSlap(now, s16 % 2 === 0 ? 640 : 480, 0.24 * w);
      }
      if (s16 === 4 || s16 === 11) {
        this.playTalkingDrumGlide(now, 165, 290, 0.22, 0.28 * w);
      }

      const kalimbaIdx = (s16 * 2 + (barIdx % 3)) % scale.length;
      if (s16 % 2 === 0 || s16 === 5 || s16 === 13) {
        this.playKalimbaThumbPiano(scale[kalimbaIdx] * 2, now, 0.24 * w);
      }
      const mel = ERA_MELODIES.era01.find((m) => m.s === s16);
      if (mel) {
        const pitch = scale[(mel.i + (barIdx % 2)) % scale.length];
        this.playFormantVocal(pitch, s16 < 8 ? 'A' : 'O', now, mel.d, 0.26 * w);
        this.playFormantVocal(pitch * 1.5, 'A', now, mel.d, 0.14 * w);
      }

      // STRICT SPEED-OF-SOUND LION ROAR SYNC:
      // Era 01 starts at t = 10.0s (barIdx = 5). So `(barIdx - 5) % 2 === 0` is `localT = 0.0s, 4.0s, 8.0s`!
      // At `s16 === 2` (`roarCycle = 0.25s`), Lion's vocal blast fires, and its 38Hz Sub-Bass Shockwave peaks +0.20s later (`roarCycle = 0.45s`), matching `cam.lionGroundTremor` 100%!
      const localBar = Math.max(0, Math.floor((state.t - 10.0) / 2.0));
      if (s16 === 2 && (localBar % 2 === 0)) {
        this.playDeafeningLionRoar(now, 0.58 * w);
      }
      // Ambient Foley: Bull Elephant Trumpet on odd local bars + Tropical Bird Chirps & Cicadas!
      if (s16 === 10 && (localBar % 2 === 1)) {
        this.playElephantTrumpet(now, 0.36 * w);
      }
      if (s16 === 5 || s16 === 13) {
        this.playSavannaBirdChirp(now, s16 === 5 ? 2450 : 3100, 0.16 * w);
      }
    }

    // =========================================================================
    // 02 NOAH'S ARK: CATHEDRAL PIPE ORGAN + THUNDERCLAP/RAIN/SEAGULL/WHALE FOLEY!
    // =========================================================================
    else if (id === 'era02') {
      const isRainbowHalf = state.localProgress > 0.46;
      const scale = isRainbowHalf ? ERA_SCALES.era02_light : ERA_SCALES.era02_storm;

      if (s16 === 0 || s16 === 8) {
        const rootIdx = (barIdx % 2 === 0) ? 0 : 2;
        this.playCathedralPipeOrgan(scale[rootIdx] * 0.5, now, 0.96, 0.26 * w);
        this.playCathedralPipeOrgan(scale[rootIdx + 2], now, 0.96, 0.20 * w);
        this.playCathedralPipeOrgan(scale[rootIdx + 4], now, 0.96, 0.18 * w);
      }

      const mel = ERA_MELODIES.era02.find((m) => m.s === s16);
      if (mel) {
        const fLead = scale[mel.i];
        this.playFormantVocal(fLead, isRainbowHalf ? 'A' : 'O', now, mel.d, 0.28 * w);
        this.playFormantVocal(fLead * 0.75, 'U', now, mel.d, 0.20 * w);
      }

      // RICH ERA 02 AMBIENT FOLEY:
      // 1) Ocean Wave & Rain Swell on every bar
      if (s16 === 0 || s16 === 8) {
        this.playOceanSurfSwell(now, isRainbowHalf ? 680 : 420, 0.22 * w);
      }
      // 2) First Half Storm: Rolling Thunderclap Boom & Timpani Thunder!
      if (!isRainbowHalf) {
        if (s16 === 2 && (barIdx % 2 === 0)) {
          this.playThunderclapBoom(now, 0.44 * w);
        }
        if (s16 === 0 || s16 === 12 || s16 === 14) {
          this.playDrumKick(now, 92, 0.40 * w);
        }
      } else {
        // 3) Second Half Rainbow & Sun: Soaring Seagull Cries + Deep Humpback Whale Sonar!
        if (s16 === 4 || s16 === 11) {
          this.playSeagullCry(now, s16 === 4 ? 1680 : 1920, 0.22 * w);
        }
        if (s16 === 8 && (barIdx % 2 === 0)) {
          this.playWhaleSonarCall(now, 523.25, 0.26 * w);
        }
      }
    }

    // =========================================================================
    // 03 SHANG ANYANG: BRONZE BELLS + 808 RAP + ORACLE FIRE-CRACKS, FURNACE BELLOWS & WARHORSE NEIGH FOLEY!
    // =========================================================================
    else if (id === 'era03') {
      const scale = ERA_SCALES.era03;

      if (s16 === 0 || s16 === 6 || s16 === 10) {
        const bassFreq = scale[(s16 === 6) ? 1 : 0] * 0.5;
        this.play808Bass(bassFreq, now, 0.44, 0.38 * w);
        this.playDrumKick(now, 128, 0.36 * w);
      }
      if (s16 === 4 || s16 === 12) {
        this.playSnareDrum(now, 0.34 * w);
      }
      if (s16 === 0 || s16 === 4 || s16 === 8 || s16 === 12) {
        const bellFreq = scale[(s16 / 2 + barIdx) % scale.length];
        this.playBronzeChime(bellFreq * 2, now, 0.26 * w);
      }

      const mel = ERA_MELODIES.era03.find((m) => m.s === s16);
      if (mel) {
        const gFreq = scale[(mel.i + (barIdx % 2)) % scale.length];
        this.playGuqinSlide(gFreq, now, mel.d, 0.32 * w);
        this.playFormantVocal(gFreq * 0.5, s16 % 3 === 0 ? 'E' : 'O', now, 0.24, 0.22 * w);
      }

      // RICH ERA 03 AMBIENT FOLEY:
      // 1) Pyromantic Tortoiseshell Double Fire-Crack ("劈啪—咔嚓！") on steps 3 & 7
      if (s16 === 3 || s16 === 7) {
        this.playOracleCrack(now, 0.32 * w);
        this.playOracleCrack(now + 0.06, 0.26 * w);
      }
      // 2) Molten Bronze Smelting Furnace Bellows Roar on step 0
      if (s16 === 0) {
        this.playOceanSurfSwell(now, 310, 0.20 * w);
      }
      // 3) Shang Chariot Warhorse Neigh on alternate bars step 11!
      if (s16 === 11 && (barIdx % 2 === 0)) {
        this.playWarhorseNeigh(now, 0.26 * w);
      }
    }

    // =========================================================================
    // 04 ANCIENT GREECE: OLYMPIAN DUAL-GUITAR ARENA ROCK + STADIUM CROWD ROAR, SALPINX HORN & WHip FOLEY!
    // =========================================================================
    else if (id === 'era04') {
      const scale = ERA_SCALES.era04;

      if (s16 % 4 === 0 || s16 === 6 || s16 === 14) {
        this.playDrumKick(now, 138, 0.40 * w);
      }
      if (s16 === 4 || s16 === 12) {
        this.playSnareDrum(now, 0.38 * w);
      }
      if (s16 === 0 || s16 === 8) {
        const root = scale[(barIdx % 2) * 2];
        this.playDistortedPowerChord(root, now, 0.38, 0.22 * w);
      }

      const mel = ERA_MELODIES.era04.find((m) => m.s === s16);
      if (mel) {
        const f1 = scale[mel.i];
        const f2 = scale[Math.min(scale.length - 1, mel.i + 2)];
        this.playSingingGuitarLead(f1 * 2, now, mel.d, 0.22 * w);
        this.playSingingGuitarLead(f2 * 2, now + 0.01, mel.d, 0.16 * w);
      }
      if (s16 % 2 === 0) {
        this.playPluckedString(scale[(s16 / 2 + barIdx) % scale.length] * 2, now, 0.22 * w);
      }

      // RICH ERA 04 AMBIENT FOLEY:
      // 1) 100,000-Spectator Olympic Stadium Crowd Cheer & Applause Roar!
      if (s16 === 0 || s16 === 8) {
        this.playOlympicCrowdRoar(now, 0.26 * w);
      }
      // 2) Ancient Greek Salpinx Bronze Herald Horn Blast on step 2 of even bars!
      if (s16 === 2 && (barIdx % 2 === 0)) {
        this.playSalpinxBrassHorn(scale[5] * 2, now, 0.42, 0.26 * w);
      }
      // 3) Chariot Whip Crack & Crowd "HEY!" on Beat 2 & 4
      if (s16 === 4 || s16 === 12) {
        this.playFormantVocal(scale[5], 'E', now, 0.22, 0.24 * w);
        if (s16 === 12) this.playOracleCrack(now, 0.28 * w); // Sharp chariot whip crack!
      }
    }

    // =========================================================================
    // 05 HIGH TANG CHANG'AN: MONUMENTAL IMPERIAL "QIN WANG PO ZHEN YUE" SYMPHONY + CAMEL BELLS & BAZAAR HAWKERS FOLEY!
    // (彻底升级盛唐气象：雷霆建鼓 + 皇家三十六簧排笙与铜角礼乐齐鸣 + 四弦齐扫琵琶 + 穿云梆笛 + 万民混声大合唱 + 丝路驼铃与西市商贩吆喝！)
    // =========================================================================
    else if (id === 'era05') {
      const scale = ERA_SCALES.era05;

      // 1. Thunderous Imperial Tang Bo-Gu War-Drums (雷霆大唐建鼓/战鼓阵列)
      if (s16 === 0 || s16 === 3 || s16 === 6 || s16 === 8 || s16 === 12 || s16 === 14) {
        const isHeavy = (s16 === 0 || s16 === 8);
        this.playDrumKick(now, isHeavy ? 118 : 142, (isHeavy ? 0.46 : 0.34) * w);
        if (isHeavy) {
          this.play808Bass(scale[(barIdx % 2) * 3] * 0.5, now, 0.48, 0.36 * w);
        }
      }
      if (s16 === 4 || s16 === 12) {
        this.playSnareDrum(now, 0.34 * w);
      }

      // 2. Grand Imperial 36-Pipe Sheng & Ceremonial Brass Fanfare Chords (九天阊阖皇室排笙与铜角齐鸣，气吞山河！)
      if (s16 === 0 || s16 === 8) {
        const rootIdx = (barIdx % 2 === 0) ? 0 : 3;
        this.playImperialTangShengFanfare(scale[rootIdx], scale[rootIdx + 3], scale[rootIdx + 5], now, 0.92, 0.28 * w);
      }

      // 3. Heroic High Tang Anthem: Soaring Bangdi + 4-String Strummed Pipa Power Chords + 4-Part Imperial Choir!
      const mel = ERA_MELODIES.era05.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        // Soaring Bangdi Bamboo Flute in upper octave
        this.playExpressiveDiziFlute(fNote * 2, now, mel.d, 0.30 * w);
        // 4-Part Imperial Court Choir singing in majestic harmony!
        this.playFormantVocal(fNote, 'A', now, mel.d, 0.26 * w);
        this.playFormantVocal(fNote * 0.75, 'O', now, mel.d, 0.20 * w);
        // 4-String Strummed Pipa Power Chord (琵琶四弦齐扫千军万马！)
        this.playPluckedString(fNote * 0.5, now, 0.28 * w);
        this.playPluckedString(fNote * 0.75, now + 0.018, 0.28 * w);
        this.playPluckedString(fNote, now + 0.036, 0.32 * w);
        this.playPluckedString(fNote * 1.5, now + 0.054, 0.26 * w);
      }

      // 4. RICH ERA 05 AMBIENT FOLEY:
      // a) Silk Road Bactrian Camel Bell Jingle Chain (丝绸之路清脆双音铜驼铃串) on every beat!
      if (s16 % 4 === 1 || s16 % 4 === 3) {
        this.playBronzeChime(scale[9] * 2, now, 0.16 * w);
        this.playBronzeChime(scale[10] * 2, now + 0.055, 0.13 * w);
      }
      // b) Authentic Chang'an Western Market Hawker Calls ("胡饼——美酒啰——！") on step 5 & 13!
      if (s16 === 5 && (barIdx % 2 === 0)) {
        this.playChangAnHawkerCall(now, 0.30 * w);
      }
      // c) Bustling Chang'an Festival Crowd Ambience
      if (s16 === 0) {
        this.playOlympicCrowdRoar(now, 0.15 * w);
      }
    }

    // =========================================================================
    // 06 NORTHERN SONG: SEVEN-STRING GUQIN + YAYUE DONGXIAO + 16-PLATE FANGXIANG CHIMES + TANBAN CLAPPER + BIANHE OARS & RAIN FOLEY!
    // =========================================================================
    else if (id === 'era06') {
      const scale = ERA_SCALES.era06;
      // 1) Northern Song "Tanban" Wooden Clapper (汴京瓦舍勾栏檀板拍板) & Su Song Clock Escapement
      if (s16 === 0 || s16 === 8) {
        this.playWoodSlap(now, 820, 0.22 * w);
      }
      if (s16 % 4 === 2) {
        this.playClockworkTick(now, 1520, 0.20 * w);
      }
      // 2) Authentic Song Dynasty 16-Plate Iron "Fangxiang" Metallophone (宋代十六枚铁片编磬乐器“方响”)!
      if (s16 === 0 || s16 === 4 || s16 === 8 || s16 === 12) {
        const fxFreq = scale[(s16 / 2 + barIdx * 2) % scale.length] * 2;
        this.playSongFangxiangChime(fxFreq, now, 0.22 * w);
      }
      // 3) Seven-String Guqin Sliding Harmonics ("七弦古琴吟猱泛音") + Yayue Dongxiao Bamboo Flute ("雅乐洞箫")
      const mel = ERA_MELODIES.era06.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[(mel.i + (barIdx % 2)) % scale.length];
        this.playGuqinSlide(fNote, now, mel.d, 0.36 * w);
        this.playExpressiveDiziFlute(fNote * 1.5, now + 0.025, mel.d * 1.15, 0.26 * w);
        this.playPluckedString(fNote * 0.5, now, 0.24 * w);
      }
      // 4) Ambient Foley: Jiangnan Spring Rain on Bamboo + Bian River Boatmen Rowing Oar Splash!
      if (s16 === 2 || s16 === 10) {
        this.playOceanSurfSwell(now, 960, 0.16 * w);
      }
    }

    // =========================================================================
    // 07 YUAN-MING-QING: KUNQU QUDI FLUTE + THREE-STRING SANXIAN/PIPA + JINGDEZHEN PORCELAIN BOWL CHIMES ("青花瓷瓯击乐") + PEKING OPERA SMALL GONG & ABACUS FOLEY!
    // =========================================================================
    else if (id === 'era07') {
      const scale = ERA_SCALES.era07;
      // 1) Peking Opera Ban-Gu & Small Gong ("板鼓与京剧小锣：台—台—仓！")
      if (s16 % 4 === 0) {
        this.playWoodSlap(now, 980, 0.24 * w);
      }
      if (s16 === 0 || s16 === 12) {
        this.playPekingOperaGong(now, s16 === 0 ? 540 : 620, 0.28 * w);
      }
      // 2) Authentic Jingdezhen Blue-and-White Porcelain Bowl Chimes ("景德镇青花瓷瓯击乐：敲击青花瓷碗的清脆玉振金声")!
      if (s16 % 2 === 0) {
        const pFreq = scale[(s16 + barIdx * 3) % scale.length] * 2;
        this.playPorcelainBowlChime(pFreq, now, 0.22 * w);
      }
      // 3) Kunqu Water-Polished Qudi Flute ("昆曲水磨腔曲笛") + Plucked Sanxian/Pipa ("三弦与琵琶弹挑")
      const mel = ERA_MELODIES.era07.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playExpressiveDiziFlute(fNote * 1.5, now, mel.d, 0.30 * w);
        this.playPluckedString(fNote, now, 0.28 * w);
        this.playPluckedString(fNote * 0.5, now + 0.02, 0.24 * w);
      }
      // 4) Ambient Foley: Rapid Rosewood Abacus Clicking + Zheng He Fleet Deep Horn!
      if (s16 === 3 || s16 === 7 || s16 === 11 || s16 === 15) {
        this.playAbacusBeadClick(now, 0.24 * w);
        this.playAbacusBeadClick(now + 0.045, 0.20 * w);
      }
      if (state.localProgress > 0.44 && s16 === 0 && (barIdx % 2 === 0)) {
        this.playSalpinxBrassHorn(196.0, now, 0.78, 0.24 * w);
      }
    }

    // =========================================================================
    // 08 INCA & TRANSATLANTIC NAVIGATION: ANDEAN ZAMPOÑA PANPIPES & QUENA × RENAISSANCE LUTE & FLAMENCO GUITAR + NEW-WORLD CHOIR + ATLANTIC SURF & SHIP BELL FOLEY!
    // =========================================================================
    else if (id === 'era08') {
      const scale = ERA_SCALES.era08;
      // 1) Bombo Legüero Deep Andean Drum + Cajon Percussion
      if (s16 === 0 || s16 === 6 || s16 === 12) {
        this.playDrumKick(now, 122, 0.40 * w);
      }
      if (s16 === 3 || s16 === 9 || s16 === 14) {
        this.playWoodSlap(now, 560, 0.22 * w);
      }
      // 2) 16th-Century Renaissance Lute & Spanish Flamenco Rasgueado Strummed Chords!
      if (s16 === 0 || s16 === 6 || s16 === 8 || s16 === 12) {
        const rIdx = (barIdx % 2 === 0) ? 0 : 3;
        [0, 2, 4, 7].forEach((offset, k) => {
          this.playPluckedString(scale[rIdx + offset] * 1.5, now + k * 0.020, 0.26 * w);
        });
      }
      // 3) Soaring Andean Zampoña Panpipes + Grand Age-of-Sail 4-Part Choir ("Ah—Oh—")!
      const mel = ERA_MELODIES.era08.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playAndeanPanpipe(fNote * 2, now, mel.d, 0.34 * w);
        this.playFormantVocal(fNote, 'A', now, mel.d, 0.24 * w);
        this.playFormantVocal(fNote * 0.75, 'O', now, mel.d, 0.18 * w);
      }
      // 4) Ambient Foley: Crashing Atlantic Ocean Waves + Ship's Double Brass Bell ("铛—铛！") + Rainforest Macaw Cry!
      if (s16 === 0 || s16 === 8) {
        this.playOceanSurfSwell(now, 520, 0.22 * w);
      }
      if (s16 === 0 && (barIdx % 2 === 0)) {
        this.playBronzeChime(1046.5, now, 0.22 * w);
        this.playBronzeChime(1046.5, now + 0.14, 0.18 * w);
      }
      if (s16 === 11 && (barIdx % 2 === 1)) {
        this.playSavannaBirdChirp(now, 1850, 0.20 * w);
      }
    }

    // =========================================================================
    // 09 INDUSTRIAL REVOLUTION & VAN GOGH STARRY NIGHT: SOLO BOWED CELLO + IMPRESSIONIST HARP ARPEGGIOS + FRENCH HORN & CALLIOPE STEAM ORGAN + LOCOMOTIVE & FLASK FOLEY!
    // =========================================================================
    else if (id === 'era09') {
      const scale = ERA_SCALES.era09;
      // 1) Industrial Steam-Engine Rhythm & Warm Orchestral Contrabass
      if (s16 % 4 === 0) {
        this.playDrumKick(now, 114, 0.38 * w);
        this.playBassNote(scale[(barIdx * 2 + (s16 / 4)) % 5] * 0.5, now, 0.38, 0.32 * w);
      }
      // 2) Swirling Van Gogh "Starry Night" Cascading Harp Arpeggios on every 16th note!
      const arpNote = scale[(s16 * 2 + barIdx) % scale.length];
      this.playPluckedString(arpNote * 2, now, 0.22 * w);

      // 3) Deeply Expressive Solo Romantic Bowed Cello + French Horn / Steam Calliope Harmony!
      const mel = ERA_MELODIES.era09.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playBowedCello(fNote, now, mel.d * 1.15, 0.34 * w);
        this.playCathedralPipeOrgan(fNote * 1.5, now, mel.d, 0.22 * w);
      }
      // 4) Ambient Foley: Steam Locomotive Chug-Chug & Two-Tone Steam Whistle + Bubbling Chemistry Flask!
      if (s16 % 2 === 1) {
        this.playQuillScratchFoley(now, 0.18 * w);
      }
      if (s16 === 2 && (barIdx % 2 === 0)) {
        this.playSteamWhistleChord(now, 0.28 * w);
      }
      if (s16 === 7 || s16 === 15) {
        this.playFlaskBubbleFoley(now, 0.24 * w);
      }
    }

    // =========================================================================
    // 10 FARADAY ELECTROMAGNETIC DAWN: ROMANTIC STRING FUGUE + EARLY ELECTRONIC THEREMIN GLISSANDO + ELECTROMECHANICAL CHIMES + MORSE TELEGRAPH & 60HZ HUM FOLEY!
    // =========================================================================
    else if (id === 'era10') {
      const scale = ERA_SCALES.era10;
      // 1) Deep Electromagnetic Pedal Bass & Pulse
      if (s16 === 0 || s16 === 4 || s16 === 8 || s16 === 12) {
        this.play808Bass(scale[(s16 / 4 + barIdx) % 4] * 0.5, now, 0.38, 0.34 * w);
        this.playDrumKick(now, 128, 0.34 * w);
      }
      // 2) Classical Maxwellian String Fugue Counterpoint + Electromechanical Harmonics
      const synthFreq = scale[(s16 * 3 + barIdx) % scale.length] * 2;
      this.playFaradaySynthPulse(synthFreq, now, 0.15, 0.20 * w);

      // 3) Early Electronic "Theremin" Continuous Glissando Lead + Bowed Strings!
      const mel = ERA_MELODIES.era10.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        const nextNote = scale[(mel.i + 1) % scale.length];
        this.playThereminGlide(fNote * 2, nextNote * 2, now, mel.d, 0.26 * w);
        this.playBowedCello(fNote, now, mel.d, 0.28 * w);
      }
      // 4) Ambient Foley: Transatlantic Morse Telegraph Key ("滴滴答答 · · · — — —") + 60Hz Faraday Dynamo Hum!
      if (s16 === 1 || s16 === 2 || s16 === 3 || s16 === 9 || s16 === 11) {
        const isDash = (s16 === 9 || s16 === 11);
        this.playMorseTelegraphBeep(now, isDash ? 0.11 : 0.045, 0.24 * w);
      }
      if (s16 === 0) {
        this.playBassNote(60.0, now, 0.85, 0.20 * w);
      }
    }

    // =========================================================================
    // 11 TESLA AC LIGHTNING WAR: SINGING ARC COIL + RAGTIME PIANO + NIAGARA WATERFALL & SPARK FOLEY!
    // =========================================================================
    else if (id === 'era11') {
      const scale = ERA_SCALES.era11;
      if (s16 === 0 || s16 === 4 || s16 === 8 || s16 === 12) {
        this.playDrumKick(now, 126, 0.38 * w);
        this.playBassNote(scale[(s16 / 4 + barIdx) % 4] * 0.5, now, 0.32, 0.30 * w);
      }
      if (s16 === 2 || s16 === 6 || s16 === 10 || s16 === 14) {
        const pFreq = scale[(s16 + barIdx * 2) % scale.length];
        this.playPluckedString(pFreq * 1.5, now, 0.24 * w);
        this.playPluckedString(pFreq * 2.0, now + 0.015, 0.20 * w);
      }
      const mel = ERA_MELODIES.era11.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playTeslaSingingArc(fNote * 2, now, mel.d, 0.26 * w);
      }
      if (s16 === 0 || s16 === 8) {
        this.playOceanSurfSwell(now, 480, 0.18 * w);
      }
      if (s16 === 5 || s16 === 13) {
        this.playOracleCrack(now, 0.24 * w);
      }
    }

    // =========================================================================
    // 12 EINSTEIN RELATIVITY & 4D SPACETIME CENTIPEDE: SOLO VIOLIN CHACONNE + GLASS ARMONICA + GRAVITATIONAL WAVE CHIRP!
    // =========================================================================
    else if (id === 'era12') {
      const scale = ERA_SCALES.era12;
      if (s16 === 0 || s16 === 8) {
        const rIdx = (barIdx % 2 === 0) ? 4 : 6;
        this.playGlassHarmonica(scale[rIdx] * 2, now, 0.92, 0.22 * w);
        this.playBassNote(scale[rIdx - 4] * 0.5, now, 0.85, 0.24 * w);
      }
      if (s16 % 2 === 0) {
        const cFreq = scale[(s16 + barIdx * 2) % scale.length] * 2;
        this.playPorcelainBowlChime(cFreq, now, 0.16 * w);
      }
      const mel = ERA_MELODIES.era12.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playEinsteinViolin(fNote * 2, now, mel.d, 0.34 * w);
        this.playBowedCello(fNote, now, mel.d, 0.24 * w);
      }
      if (s16 === 10 && (barIdx % 2 === 0)) {
        this.playGravitationalWaveChirp(now, 0.24 * w);
      }
    }

    // =========================================================================
    // 13 MODERN OLYMPICS FIVE RINGS: GRAND OLYMPIC BRASS FANFARE + SPRINT BASS + CROWD ROAR & DOVES FOLEY!
    // =========================================================================
    else if (id === 'era13') {
      const scale = ERA_SCALES.era13;
      if (s16 % 4 === 0) {
        this.playDrumKick(now, 128, 0.40 * w);
        this.play808Bass(scale[(s16 / 4 + barIdx) % 4] * 0.5, now, 0.36, 0.34 * w);
      }
      if (s16 === 4 || s16 === 12) {
        this.playSnareDrum(now, 0.32 * w);
      }
      if (s16 === 0 || s16 === 8) {
        this.playImperialTangShengFanfare(scale[4], scale[6], scale[8], now, 0.85, 0.24 * w);
      }
      const mel = ERA_MELODIES.era13.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playSalpinxBrassHorn(fNote * 1.5, now, mel.d, 0.28 * w);
        this.playFormantVocal(fNote, 'A', now, mel.d, 0.24 * w);
      }
      if (s16 === 0) {
        this.playOlympicCrowdRoar(now, 0.22 * w);
      }
      if (s16 === 6 || s16 === 14) {
        this.playSavannaBirdChirp(now, 2100, 0.14 * w);
      }
    }

    // =========================================================================
    // 14 SILICON VALLEY GARAGE & 8-BIT OPEN SOURCE: NES CHIPTUNE SYNTH + 56K MODEM & KEYBOARD FOLEY!
    // =========================================================================
    else if (id === 'era14') {
      const scale = ERA_SCALES.era14;
      if (s16 % 4 === 0) {
        this.playDrumKick(now, 140, 0.36 * w);
      }
      if (s16 % 4 === 2) {
        this.playSnareDrum(now, 0.28 * w);
      }
      const chipFreq = scale[(s16 * 2 + barIdx) % scale.length];
      this.play8BitChiptuneLead(chipFreq, now, 0.11, 0.20 * w);

      const mel = ERA_MELODIES.era14.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.play8BitChiptuneLead(fNote * 2, now, mel.d, 0.28 * w);
      }
      if (s16 === 3 || s16 === 11) {
        this.playAbacusBeadClick(now, 0.22 * w);
      }
      if (s16 === 8 && (barIdx % 2 === 0)) {
        this.playModemHandshakeFoley(now, 0.22 * w);
      }
    }

    // =========================================================================
    // 15 GLOBALIZATION 5-CONTINENT INTERCONNECT: WORLD-FUSION SYMPHONY (DIZI + KALIMBA + CELLO + SYNTH) + BULLET TRAIN FOLEY!
    // =========================================================================
    else if (id === 'era15') {
      const scale = ERA_SCALES.era15;
      if (s16 % 4 === 0) {
        this.playDrumKick(now, 124, 0.40 * w);
        this.play808Bass(scale[(s16 / 4 + barIdx) % 4] * 0.5, now, 0.38, 0.34 * w);
      }
      if (s16 % 2 === 0) {
        const kFreq = scale[(s16 + barIdx * 2) % scale.length] * 2;
        this.playKalimbaThumbPiano(kFreq, now, 0.22 * w);
      }
      const mel = ERA_MELODIES.era15.find((m) => m.s === s16);
      if (mel) {
        const fNote = scale[mel.i];
        this.playExpressiveDiziFlute(fNote * 1.5, now, mel.d, 0.26 * w);
        this.playBowedCello(fNote, now, mel.d, 0.26 * w);
        this.playFormantVocal(fNote, 'A', now, mel.d, 0.22 * w);
      }
      if (s16 === 0) {
        this.playOceanSurfSwell(now, 740, 0.18 * w);
        this.playBronzeChime(scale[8] * 2, now, 0.18 * w);
      }
    }
  }

  playPekingOperaGong(now, startFreq = 540, gainVal = 0.26) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sawtooth';
    o2.type = 'triangle';
    o1.frequency.setValueAtTime(startFreq, now);
    o1.frequency.exponentialRampToValueAtTime(startFreq * 1.32, now + 0.22);
    o2.frequency.setValueAtTime(startFreq * 1.48, now);
    o2.frequency.exponentialRampToValueAtTime(startFreq * 1.92, now + 0.22);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.34);
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.36);
    o2.stop(now + 0.36);
  }

  playAbacusBeadClick(now, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(2400, now);
    o.frequency.exponentialRampToValueAtTime(820, now + 0.025);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.032);
  }

  playAndeanPanpipe(freq, now, dur, gainVal = 0.28) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq * 0.98, now);
    o.frequency.linearRampToValueAtTime(freq, now + 0.04);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.045);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.03);
  }

  playSteamWhistleChord(now, gainVal = 0.26) {
    if (gainVal < 0.01) return;
    [587.33, 739.99, 880.0].forEach((f) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(gainVal * 0.45, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
      o.connect(g);
      g.connect(this.master);
      o.start(now);
      o.stop(now + 0.45);
    });
  }

  playFlaskBubbleFoley(now, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    [0, 0.06, 0.12].forEach((off, i) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      const bf = 420 + i * 160;
      o.frequency.setValueAtTime(bf, now + off);
      o.frequency.exponentialRampToValueAtTime(bf * 2.1, now + off + 0.05);
      g.gain.setValueAtTime(gainVal, now + off);
      g.gain.exponentialRampToValueAtTime(0.001, now + off + 0.055);
      o.connect(g);
      g.connect(this.master);
      o.start(now + off);
      o.stop(now + off + 0.06);
    });
  }

  playFaradaySynthPulse(freq, now, dur, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const bp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, now);
    bp.type = 'lowpass';
    bp.frequency.setValueAtTime(freq * 3.5, now);
    bp.frequency.exponentialRampToValueAtTime(freq * 1.2, now + dur);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.02);
  }

  playMorseTelegraphBeep(now, dur = 0.05, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(1180, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.setValueAtTime(gainVal, now + dur * 0.8);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.01);
  }

  playTeslaSingingArc(freq, now, dur, gainVal = 0.24) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const bp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o1.type = 'sawtooth';
    o2.type = 'square';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 1.006, now);
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(freq * 2.2, now);
    bp.Q.value = 2.8;
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o1.connect(bp);
    o2.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + dur + 0.02);
    o2.stop(now + dur + 0.02);
  }

  playEinsteinViolin(freq, now, dur, gainVal = 0.30) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const vib = this.ctx.createOscillator();
    const vibG = this.ctx.createGain();
    const lp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq, now);
    vib.frequency.value = 5.8;
    vibG.gain.value = freq * 0.014;
    vib.connect(vibG);
    vibG.connect(o.frequency);
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(2400, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.055);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    o.start(now);
    vib.start(now);
    o.stop(now + dur + 0.03);
    vib.stop(now + dur + 0.03);
  }

  playGravitationalWaveChirp(now, gainVal = 0.24) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(45, now);
    o.frequency.exponentialRampToValueAtTime(320, now + 0.38);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.28);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.44);
  }

  play8BitChiptuneLead(freq, now, dur, gainVal = 0.24) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'square';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.015);
  }

  playModemHandshakeFoley(now, gainVal = 0.20) {
    if (gainVal < 0.01) return;
    [1200, 2400, 1650, 2100].forEach((f, idx) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, now + idx * 0.055);
      g.gain.setValueAtTime(gainVal, now + idx * 0.055);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.055 + 0.05);
      o.connect(g);
      g.connect(this.master);
      o.start(now + idx * 0.055);
      o.stop(now + idx * 0.055 + 0.055);
    });
  }

  playSongFangxiangChime(freq, now, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sine';
    o2.type = 'triangle';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 2.756, now); // Authentic metallophone overtone ratio
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.45);
    o2.stop(now + 0.45);
  }

  playPorcelainBowlChime(freq, now, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sine';
    o2.type = 'sine';
    // Pure crystalline ceramic resonance ("青花瓷瓯击乐：清越如玉")
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 2.005, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.58);
    o2.stop(now + 0.58);
  }

  playBowedCello(freq, now, dur, gainVal = 0.30) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o1.type = 'sawtooth';
    o2.type = 'triangle';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 1.003, now);
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1150, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o1.connect(lp);
    o2.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + dur + 0.03);
    o2.stop(now + dur + 0.03);
  }

  playThereminGlide(fStart, fEnd, now, dur, gainVal = 0.24) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const vib = this.ctx.createOscillator();
    const vibG = this.ctx.createGain();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(fStart, now);
    o.frequency.exponentialRampToValueAtTime(fEnd, now + dur * 0.85);
    vib.frequency.value = 6.2;
    vibG.gain.value = fStart * 0.018;
    vib.connect(vibG);
    vibG.connect(o.frequency);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    vib.start(now);
    o.stop(now + dur + 0.02);
    vib.stop(now + dur + 0.02);
  }

  /**
   * GRAND IMPERIAL TANG SHENG & CEREMONIAL BRASS FANFARE SYNTHESIZER (盛唐皇家排笙与礼乐铜角交响和弦)
   */
  playImperialTangShengFanfare(f1, f2, f3, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(gainVal, now + 0.06);
    env.gain.setValueAtTime(gainVal * 0.9, now + dur * 0.65);
    env.gain.exponentialRampToValueAtTime(0.001, now + dur);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(1950, now);
    lp.connect(env);
    env.connect(this.master);

    [f1, f2, f3, f3 * 2].forEach((freq, idx) => {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = idx < 2 ? 'sawtooth' : 'triangle';
      o.frequency.setValueAtTime(freq, now);
      g.gain.value = [0.42, 0.36, 0.32, 0.20][idx];
      o.connect(g);
      g.connect(lp);
      o.start(now);
      o.stop(now + dur + 0.04);
    });
  }

  /**
   * DEAFENING LION ROAR WITH SPEED-OF-SOUND DELAYED SUB-BASS SHOCKWAVE!
   * - At `now + 0.00s` (`roarCycle = 0.25s`): Lion opens jaws and emits initial throat blast (`640Hz -> 290Hz` formant growl)
   * - At `now + 0.20s` (`roarCycle = 0.45s`, the EXACT moment the shockwave ring reaches the camera and triggers `lionGroundTremor`!):
   *   The 38Hz Sub-Bass Seismic Shockwave slams into the listener!
   */
  playDeafeningLionRoar(now, gainVal = 0.58) {
    if (gainVal < 0.02) return;
    const dur = 1.50;

    // Stage 1 (Immediate at `now`): Lion Jaws Open — Guttural Dual-Sawtooth Vocal Roar Blast
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(135, now);
    osc1.frequency.linearRampToValueAtTime(155, now + 0.20);
    osc1.frequency.exponentialRampToValueAtTime(58, now + dur);
    osc2.frequency.setValueAtTime(139, now);
    osc2.frequency.linearRampToValueAtTime(159, now + 0.20);
    osc2.frequency.exponentialRampToValueAtTime(60, now + dur);

    const flutter = this.ctx.createOscillator();
    const flutterG = this.ctx.createGain();
    flutter.frequency.value = 27.0;
    flutterG.gain.value = 20.0;
    flutter.connect(flutterG);
    flutterG.connect(osc1.frequency);
    flutterG.connect(osc2.frequency);

    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.overdriveCurve;

    const formant1 = this.ctx.createBiquadFilter();
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(680, now);
    formant1.frequency.exponentialRampToValueAtTime(270, now + dur);
    formant1.Q.value = 2.6;

    const roarEnv = this.ctx.createGain();
    roarEnv.gain.setValueAtTime(0.001, now);
    roarEnv.gain.linearRampToValueAtTime(gainVal * 0.88, now + 0.08);
    roarEnv.gain.setValueAtTime(gainVal * 0.92, now + 0.55);
    roarEnv.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc1.connect(shaper);
    osc2.connect(shaper);
    if (this.roarNoiseBuf) {
      const nSrc = this.ctx.createBufferSource();
      nSrc.buffer = this.roarNoiseBuf;
      const nG = this.ctx.createGain();
      nG.gain.value = 0.60;
      nSrc.connect(nG);
      nG.connect(shaper);
      nSrc.start(now);
    }

    shaper.connect(formant1);
    formant1.connect(roarEnv);
    roarEnv.connect(this.master);

    osc1.start(now);
    osc2.start(now);
    flutter.start(now);
    osc1.stop(now + dur + 0.04);
    osc2.stop(now + dur + 0.04);
    flutter.stop(now + dur + 0.04);

    // Stage 2 (Delayed by +0.20s for speed-of-sound propagation!): 38Hz Seismic Sub-Bass Shockwave hits the camera lens!
    const shockTime = now + 0.20;
    const sub = this.ctx.createOscillator();
    const subG = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(76, shockTime);
    sub.frequency.exponentialRampToValueAtTime(34, shockTime + 1.25);
    subG.gain.setValueAtTime(0.001, shockTime);
    subG.gain.linearRampToValueAtTime(gainVal * 1.15, shockTime + 0.06);
    subG.gain.exponentialRampToValueAtTime(0.001, shockTime + 1.28);
    sub.connect(subG);
    subG.connect(this.master);
    sub.start(shockTime);
    sub.stop(shockTime + 1.32);
  }

  // =========================================================================
  // NEW PROCEDURAL AMBIENT FOLEY SYNTHESIZERS FOR ALL 6 ERAS!
  // =========================================================================

  // Era 00 Foley: Mechanical Clockwork Winding Ratchet ("咔-哒-咔-哒")
  playClockworkWindingRatchet(now, gainVal) {
    for (let k = 0; k < 3; k++) {
      this.playClockworkTick(now + k * 0.038, 3200 + k * 450, gainVal);
    }
  }

  // Era 00 Foley: Da Vinci Quill Pen Scratching on Parchment
  playQuillScratchFoley(now, gainVal) {
    if (!this.quillBuf || gainVal < 0.01) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.quillBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3400;
    bp.Q.value = 3.2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  // Era 01 Foley: Savanna Tropical Bird Chirp & Cicada Shimmer
  playSavannaBirdChirp(now, baseFreq, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(baseFreq, now);
    o.frequency.exponentialRampToValueAtTime(baseFreq * 1.38, now + 0.055);
    o.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, now + 0.12);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.14);
  }

  // Era 02 Foley: Rolling Thunderclap Boom (Storm Half)
  playThunderclapBoom(now, gainVal) {
    if (!this.thunderBuf || gainVal < 0.01) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.thunderBuf;
    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(420, now);
    lp.frequency.exponentialRampToValueAtTime(95, now + 1.35);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    src.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  // Era 02 Foley: Soaring Seagull Cry (Rainbow Half)
  playSeagullCry(now, startFreq, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const bp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(startFreq, now);
    o.frequency.exponentialRampToValueAtTime(startFreq * 1.18, now + 0.08);
    o.frequency.exponentialRampToValueAtTime(startFreq * 0.68, now + 0.36);
    bp.type = 'bandpass';
    bp.frequency.value = 1850;
    bp.Q.value = 4.0;
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
    o.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.40);
  }

  // Era 03 Foley: Shang Chariot Warhorse Neigh ("咴—咴—！")
  playWarhorseNeigh(now, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const vib = this.ctx.createOscillator();
    const vibG = this.ctx.createGain();
    const bp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();

    o.type = 'sawtooth';
    o.frequency.setValueAtTime(620, now);
    o.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
    o.frequency.exponentialRampToValueAtTime(480, now + 0.52);

    vib.frequency.value = 16.0;
    vibG.gain.value = 45.0;
    vib.connect(vibG);
    vibG.connect(o.frequency);

    bp.type = 'bandpass';
    bp.frequency.value = 1450;
    bp.Q.value = 3.0;

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.54);

    o.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    o.start(now);
    vib.start(now);
    o.stop(now + 0.56);
    vib.stop(now + 0.56);
  }

  // Era 04 Foley: 100,000-Spectator Olympic Stadium Crowd Roar & Cheer
  playOlympicCrowdRoar(now, gainVal) {
    if (!this.crowdBuf || gainVal < 0.01) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.crowdBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 920;
    bp.Q.value = 1.6;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  // Era 04 Foley: Ancient Greek Salpinx Bronze Horn Blast
  playSalpinxBrassHorn(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const lp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(freq * 0.97, now);
    o.frequency.exponentialRampToValueAtTime(freq, now + 0.05);
    lp.type = 'lowpass';
    lp.frequency.value = 1800;
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.03);
  }

  // Era 05 Foley: Chang'an Western Market Hawker Call ("胡饼——美酒啰——！")
  playChangAnHawkerCall(now, gainVal) {
    if (gainVal < 0.01) return;
    // Two-syllable rising-falling Tang vendor call synthesized via vowel formants ('U' -> 'A')
    this.playFormantVocal(330, 'U', now, 0.22, gainVal);
    this.playFormantVocal(440, 'A', now + 0.20, 0.36, gainVal * 1.1);
  }

  playTransitionBridgeRiser(now, outgoingEraId) {
    if (!this.riserBuf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.riserBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(380, now);
    bp.frequency.exponentialRampToValueAtTime(1650, now + 1.35);
    bp.Q.value = 3.0;

    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.01, now);
    g.gain.linearRampToValueAtTime(0.28, now + 1.25);
    g.gain.exponentialRampToValueAtTime(0.001, now + 1.40);

    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(now);

    if (outgoingEraId === 'era02') {
      this.playDrumKick(now + 0.65, 115, 0.22);
      this.playDrumKick(now + 0.85, 125, 0.30);
      this.playBronzeChime(293.66, now + 1.05, 0.24);
    }
  }

  playElephantTrumpet(now, gainVal = 0.32) {
    if (gainVal < 0.02) return;
    const dur = 0.72;
    const osc = this.ctx.createOscillator();
    const bp = this.ctx.createBiquadFilter();
    const shaper = this.ctx.createWaveShaper();
    const g = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(290, now);
    osc.frequency.exponentialRampToValueAtTime(585, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(490, now + dur);

    shaper.curve = this.overdriveCurve;
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(1150, now);
    bp.Q.value = 3.5;

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(shaper);
    shaper.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  playCathedralPipeOrgan(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const stops = [
      { r: 0.5, type: 'sine', amp: 0.55 },
      { r: 1.0, type: 'triangle', amp: 0.45 },
      { r: 2.0, type: 'sine', amp: 0.30 },
      { r: 3.0, type: 'sine', amp: 0.14 },
    ];
    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(gainVal, now + 0.08);
    env.gain.exponentialRampToValueAtTime(0.001, now + dur);
    env.connect(this.master);

    stops.forEach((st) => {
      const o = this.ctx.createOscillator();
      const sg = this.ctx.createGain();
      o.type = st.type;
      o.frequency.setValueAtTime(freq * st.r, now);
      sg.gain.value = st.amp;
      o.connect(sg);
      sg.connect(env);
      o.start(now);
      o.stop(now + dur + 0.04);
    });
  }

  playWhaleSonarCall(now, startFreq, gainVal) {
    if (gainVal < 0.01) return;
    const dur = 0.92;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(startFreq, now);
    o.frequency.exponentialRampToValueAtTime(startFreq * 1.45, now + 0.35);
    o.frequency.exponentialRampToValueAtTime(startFreq * 0.82, now + dur);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.04);
  }

  playGlassHarmonica(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.14);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.03);
  }

  playClockworkTick(now, freq, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.028);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + 0.032);
  }

  playTalkingDrumGlide(now, fStart, fEnd, dur, gainVal) {
    if (gainVal < 0.01) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(fStart, now);
    o.frequency.exponentialRampToValueAtTime(fEnd, now + dur * 0.7);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    o.connect(g);
    g.connect(this.master);
    o.start(now);
    o.stop(now + dur + 0.02);
  }

  playOracleCrack(now, gainVal) {
    if (!this.crackBuf || gainVal < 0.01) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.crackBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1850;
    bp.Q.value = 2.5;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  playOceanSurfSwell(now, centerFreq, maxGain) {
    if (!this.surfBuf || maxGain < 0.01) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.surfBuf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = centerFreq;
    bp.Q.value = 2.2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(maxGain, now);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(now);
  }

  playKalimbaThumbPiano(freq, now, gainVal) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sine';
    o2.type = 'sine';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 2.92, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.38);
    o2.stop(now + 0.38);
  }

  playGuqinSlide(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    this.playPluckedString(freq, now, gainVal);
    const sub = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    sub.type = 'triangle';
    sub.frequency.setValueAtTime(freq * 0.92, now);
    sub.frequency.exponentialRampToValueAtTime(freq, now + 0.14);
    g.gain.setValueAtTime(gainVal * 0.55, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    sub.connect(g);
    g.connect(this.master);
    sub.start(now);
    sub.stop(now + dur + 0.03);
  }

  playSingingGuitarLead(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const shaper = this.ctx.createWaveShaper();
    const lp = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq * 0.95, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.07);

    shaper.curve = this.overdriveCurve;
    lp.type = 'lowpass';
    lp.frequency.value = 2300;

    g.gain.setValueAtTime(0.001, now);
    g.gain.linearRampToValueAtTime(gainVal, now + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(shaper);
    shaper.connect(lp);
    lp.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  playExpressiveDiziFlute(freq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const vib = this.ctx.createOscillator();
    const vibG = this.ctx.createGain();
    const env = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 1.12, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);

    vib.frequency.value = 6.0;
    vibG.gain.value = 4.8;
    vib.connect(vibG);
    vibG.connect(osc.frequency);

    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(gainVal, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, now + dur);

    osc.connect(env);
    env.connect(this.master);
    osc.start(now);
    vib.start(now);
    osc.stop(now + dur + 0.03);
    vib.stop(now + dur + 0.03);
  }

  playDistortedPowerChord(rootFreq, now, dur, gainVal) {
    if (gainVal < 0.01) return;
    const ratios = [1.0, 1.5, 2.0];
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = this.overdriveCurve;

    const cabFilter = this.ctx.createBiquadFilter();
    cabFilter.type = 'lowpass';
    cabFilter.frequency.value = 2400;

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(gainVal, now);
    env.gain.exponentialRampToValueAtTime(0.001, now + dur);

    ratios.forEach((r) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(rootFreq * r, now);
      osc.connect(shaper);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    });

    shaper.connect(cabFilter);
    cabFilter.connect(env);
    env.connect(this.master);
  }

  playFormantVocal(freq, vowelKey, now, duration, maxGain = 0.25) {
    if (maxGain < 0.01) return;
    const formants = VOWEL_FORMANTS[vowelKey] || VOWEL_FORMANTS.A;
    const src = this.ctx.createOscillator();
    src.type = 'sawtooth';
    src.frequency.setValueAtTime(freq, now);

    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vib.frequency.value = 5.4;
    vibGain.gain.value = 3.0;
    vib.connect(vibGain);
    vibGain.connect(src.frequency);

    const env = this.ctx.createGain();
    env.gain.setValueAtTime(0.001, now);
    env.gain.linearRampToValueAtTime(maxGain, now + 0.045);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);

    formants.forEach((fFreq, idx) => {
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(fFreq, now);
      bp.Q.value = 7.0;
      const fg = this.ctx.createGain();
      fg.gain.value = [1.0, 0.65, 0.30][idx];
      src.connect(bp);
      bp.connect(fg);
      fg.connect(env);
    });

    env.connect(this.master);
    src.start(now);
    vib.start(now);
    src.stop(now + duration + 0.04);
    vib.stop(now + duration + 0.04);
  }

  playBronzeChime(freq, now, gainVal = 0.22) {
    if (gainVal < 0.01) return;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sine';
    o2.type = 'sine';
    o1.frequency.setValueAtTime(freq, now);
    o2.frequency.setValueAtTime(freq * 1.1892, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.0008, now + 0.85);
    o1.connect(g);
    o2.connect(g);
    g.connect(this.master);
    o1.start(now);
    o2.start(now);
    o1.stop(now + 0.88);
    o2.stop(now + 0.88);
  }

  play808Bass(freq, now, dur, gainVal = 0.38) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq * 1.75, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.075);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  playBassNote(freq, now, dur, gainVal = 0.24) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  }

  playDrumKick(now, startFreq = 130, gainVal = 0.36) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.15);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  playSnareDrum(now, gainVal = 0.32) {
    if (!this.snareBuf || gainVal < 0.01) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.snareBuf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gainVal, now);
    noise.connect(hp);
    hp.connect(g);
    g.connect(this.master);
    noise.start(now);
  }

  playWoodSlap(now, freq = 620, gainVal = 0.18) {
    if (gainVal < 0.01) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.06);
    g.gain.setValueAtTime(gainVal, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    osc.connect(g);
    g.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}
