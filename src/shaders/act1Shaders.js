// === src/shaders/act1Shaders.js ===
// V6 Dimensional Art-Medium & Handheld Night-Vision Optical Pipeline:
// - 00 Intro (mode 0): Da Vinci Blueprint Parchment + Sci-Fi Holographic Laser Scanner
// - 01 East Africa (mode 1): Mineral Ochre Cave Painting Relief + Delayed Lion Roar Shockwave Chromatic Aberration
// - 02 Noah's Ark (mode 2):
//     * First Half (`u_nightVision`): True Handheld IR Night-Vision Camcorder (Emerald Phosphor IR Luminance, Scanlines, ISO Grain & Lens Vignette + Lightning Impact Flash)
//     * Second Half (`u_oilImpasto`): Classical Palette-Knife Impasto 3D Oil Painting Medium!
// - 03 Shang Anyang (mode 4): Patinated Bronze Rubbing & Cinnabar Inscription Relief
// - 04 Greek Olympics (mode 3):
//     * First Half (`u_mangaInk`): True Black-and-White Manga Ink & Halftone Screentone Reality (with selective golden-red Olympic flame!)
//     * Second Half: Attic Red/Black-Figure Polychrome Vase Glaze
// - 05 High Tang (mode 5): Blue-Green Shanshui Silk Scroll Weave + Golden Film Halation

const VERT_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_UNIFIED = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;

uniform sampler2D u_tex;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_beat;
uniform float u_beatPulse;
uniform float u_seamUV;
uniform int u_shaderLeft;
uniform int u_shaderRight;
uniform float u_lionTremor;
uniform float u_lightning;
uniform float u_nightVision;
uniform float u_oilImpasto;
uniform float u_mangaInk;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * hash21(floor(p));
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}

vec3 evalEraMaterial(int mode, vec2 uv) {
  vec2 px = 1.2 / u_resolution;
  vec3 base = texture(u_tex, uv).rgb;

  // Keep top & bottom 2.35:1 cinema black letterbox bars pure and crisp
  if (uv.y < 0.072 || uv.y > 0.928) {
    return base;
  }

  float cL = dot(texture(u_tex, uv - vec2(px.x, 0.0)).rgb, vec3(0.333));
  float cR = dot(texture(u_tex, uv + vec2(px.x, 0.0)).rgb, vec3(0.333));
  float cU = dot(texture(u_tex, uv - vec2(0.0, px.y)).rgb, vec3(0.333));
  float cD = dot(texture(u_tex, uv + vec2(0.0, px.y)).rgb, vec3(0.333));
  float relief = (cL - cR) + (cU - cD);
  float edge = abs(cL - cR) + abs(cU - cD);

  if (mode == 0) {
    // 00: Da Vinci Blueprint + Sci-Fi Holographic Laser Scanner
    float paper = (fbm(uv * u_resolution * 0.15) - 0.5) * 0.035;
    float scanY = fract(u_time * 0.18);
    float scanGlow = exp(-abs(uv.y - scanY) * 55.0) * 0.14;
    return clamp(base + paper + vec3(0.35, 0.92, 0.85) * scanGlow, 0.0, 1.0);
  }
  else if (mode == 1) {
    // 01: Mineral Ochre Cave Painting Medium + Delayed Lion Roar Shockwave Chromatic Aberration
    vec2 center = vec2(0.55, 0.48);
    vec2 dir = uv - center;
    float shockShift = u_lionTremor * 0.0085;
    float rCh = texture(u_tex, clamp(uv + dir * shockShift, 0.001, 0.999)).r;
    float bCh = texture(u_tex, clamp(uv - dir * shockShift, 0.001, 0.999)).b;
    vec3 col = vec3(rCh, base.g, bCh);
    float grain = (hash21(uv * u_resolution * 0.45) - 0.5) * 0.045;
    return clamp(col + relief * 0.25 + grain, 0.0, 1.0);
  }
  else if (mode == 2) {
    // 02: Noah's Ark — Handheld IR Night-Vision Camcorder (1st Half) -> Classical 3D Impasto Oil Painting (2nd Half)!
    vec3 col = base;

    // A) Handheld Infrared Night-Vision Camcorder Optical Effect
    if (u_nightVision > 0.01) {
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      // Boost IR hot-spots (warm lights, eyes, portholes)
      float irHot = pow(max(0.0, lum), 1.4) * 1.45 + 0.08;
      float scanline = sin(uv.y * u_resolution.y * 1.8) * 0.055;
      float isoNoise = (hash21(uv * u_resolution + u_time * 37.0) - 0.5) * 0.09;
      vec3 nvCol = vec3(0.14, 0.95, 0.44) * (irHot + scanline + isoNoise) + vec3(0.45, 1.0, 0.68) * pow(max(0.0, lum - 0.55), 2.0);
      // Camcorder barrel vignette
      vec2 cd = (uv - 0.5) * vec2(1.15, 1.35);
      nvCol *= clamp(1.18 - dot(cd, cd) * 1.45, 0.15, 1.0);
      col = mix(col, clamp(nvCol, 0.0, 1.0), u_nightVision);
    }

    // B) Lightning Horror Impact Frame Flash
    if (u_lightning > 0.55) {
      float lum = dot(base, vec3(0.299, 0.587, 0.114));
      vec3 impact = vec3(step(0.42, 1.0 - lum)) * vec3(0.85, 0.98, 1.0);
      col = mix(col, impact, (u_lightning - 0.55) * 1.35);
    }

    // C) Classical Impasto Oil Painting Medium (3D Brushstroke Ridges & Rich Oil Glaze)
    if (u_oilImpasto > 0.01) {
      float brushStroke = sin(uv.x * 260.0 + sin(uv.y * 90.0) * 3.0) * 0.025;
      vec3 oilCol = col + relief * 0.34 + brushStroke;
      // Boost oil pigment vibrancy
      float avg = (oilCol.r + oilCol.g + oilCol.b) * 0.333;
      oilCol = mix(vec3(avg), oilCol, 1.24);
      col = mix(col, clamp(oilCol, 0.0, 1.0), u_oilImpasto);
    }

    return clamp(col, 0.0, 1.0);
  }
  else if (mode == 3) {
    // 04: Greek Olympics — Black-and-White Manga Ink & Screentone Reality (1st Half) -> Attic Polychrome Vase (2nd Half)!
    vec3 col = base;
    float glaze = pow(max(0.0, 1.0 - abs(uv.x - 0.42) * 2.5), 4.0) * 0.05;
    col = clamp(col + vec3(1.0, 0.92, 0.78) * glaze, 0.0, 1.0);

    if (u_mangaInk > 0.01) {
      float lum = dot(base, vec3(0.299, 0.587, 0.114));
      // Rotated 45-degree manga halftone screentone dot pattern
      vec2 rotUV = vec2(uv.x * 0.707 - uv.y * 0.707, uv.x * 0.707 + uv.y * 0.707) * u_resolution / 5.5;
      vec2 cell = fract(rotUV) - 0.5;
      float dotR = length(cell);
      float tone = step(dotR, (1.0 - lum) * 0.68);
      float inkLine = smoothstep(0.10, 0.24, edge);
      float bw = clamp(1.0 - max(tone * 0.72, inkLine), 0.06, 0.98);
      vec3 mangaCol = vec3(bw, bw * 0.98, bw * 0.94);

      // Selective Sin-City / Manga Color Accent: keep blazing golden-red flames & lightning vivid!
      float isFlame = smoothstep(0.22, 0.42, base.r - base.b) * smoothstep(0.55, 0.75, base.r);
      mangaCol = mix(mangaCol, base * 1.15, isFlame * 0.85);

      col = mix(col, mangaCol, u_mangaInk);
    }
    return clamp(col, 0.0, 1.0);
  }
  else if (mode == 4) {
    // 03: Shang Anyang Patinated Bronze Rubbing & Cinnabar Inscription Medium
    float distEdge = length(uv - 0.5);
    vec2 disp = (uv - 0.5) * distEdge * 0.004;
    float rCh = texture(u_tex, clamp(uv + disp, 0.001, 0.999)).r;
    float bCh = texture(u_tex, clamp(uv - disp, 0.001, 0.999)).b;
    vec3 col = vec3(rCh, base.g, bCh);
    return clamp(col + relief * 0.26, 0.0, 1.0);
  }
  else if (mode == 5) {
    // 05: High Tang Blue-Green Shanshui Silk Scroll + Golden Halation
    float silk = (sin(uv.x * u_resolution.x * 1.5) + sin(uv.y * u_resolution.y * 1.5)) * 0.009;
    vec3 blur = (
      texture(u_tex, uv + vec2(px.x * 3.0, 0.0)).rgb +
      texture(u_tex, uv - vec2(px.x * 3.0, 0.0)).rgb +
      texture(u_tex, uv + vec2(0.0, px.y * 3.0)).rgb +
      texture(u_tex, uv - vec2(0.0, px.y * 3.0)).rgb
    ) * 0.25;
    vec3 halation = max(vec3(0.0), blur - 0.62) * vec3(1.0, 0.68, 0.28) * 0.35;
    return clamp(base + silk + relief * 0.14 + halation, 0.0, 1.0);
  }
  else if (mode == 6) {
    // 06: Northern Song "Qingming Scroll" Xuan-Paper Fiber, Wet Ink Diffusion & Celadon Sheen
    float xuanFiber = (fbm(uv * u_resolution * 0.22) - 0.5) * 0.032;
    vec2 bleedOff = vec2(fbm(uv * 52.0 + u_time * 0.25) - 0.5, fbm(uv * 52.0 + 19.3) - 0.5) * px * 2.5;
    vec3 inkSample = texture(u_tex, clamp(uv + bleedOff, 0.001, 0.999)).rgb;
    vec3 col = mix(base, min(base, inkSample), 0.36);
    float celadon = smoothstep(0.65, 0.95, dot(col, vec3(0.333))) * 0.04;
    return clamp(col + xuanFiber + relief * 0.18 + vec3(-0.01, 0.03, 0.03) * celadon, 0.0, 1.0);
  }
  else if (mode == 7) {
    // 07: Yuan-Ming-Qing — Bada Shanren Splash-Ink Diffusion (1st Half) -> Jingdezhen Sumali Cobalt Blue Porcelain Glaze (2nd Half)
    float localP = clamp((u_time - 82.0) / 12.0, 0.0, 1.0);
    float porcelainMix = smoothstep(0.36, 0.56, localP);
    // Wet splash-ink feathering & Xuan paper texture
    vec2 splashOff = vec2(fbm(uv * 64.0) - 0.5, fbm(uv * 64.0 + 31.7) - 0.5) * px * 3.2;
    vec3 splashCol = mix(base, min(base, texture(u_tex, clamp(uv + splashOff, 0.001, 0.999)).rgb), 0.45);
    float paperGrain = (fbm(uv * u_resolution * 0.18) - 0.5) * 0.035;
    vec3 inkStage = clamp(splashCol + relief * 0.28 + paperGrain, 0.0, 1.0);
    // High-gloss Jingdezhen Porcelain Glaze with crystalline specular reflection
    float spec = pow(max(0.0, 1.0 - length((uv - vec2(0.50, 0.36)) * vec2(1.0, 1.35))), 3.0) * 0.085;
    vec3 glazeStage = clamp(base + relief * 0.22 + vec3(0.78, 0.90, 1.0) * spec, 0.0, 1.0);
    return mix(inkStage, glazeStage, porcelainMix);
  }
  else if (mode == 8) {
    // 08: Inca Sun Empire & Transatlantic Navigation — Inception Dreamlike Golden-Azure Halation + Copperplate Etching
    vec3 blur = (
      texture(u_tex, uv + vec2(px.x * 2.5, 0.0)).rgb +
      texture(u_tex, uv - vec2(px.x * 2.5, 0.0)).rgb +
      texture(u_tex, uv + vec2(0.0, px.y * 2.5)).rgb +
      texture(u_tex, uv - vec2(0.0, px.y * 2.5)).rgb
    ) * 0.25;
    vec3 dreamGlow = max(vec3(0.0), blur - 0.58) * vec3(1.0, 0.84, 0.38) * 0.36;
    float hatch = sin((uv.x + uv.y) * u_resolution.x * 0.75) * 0.015;
    return clamp(base + relief * 0.24 + dreamGlow + hatch, 0.0, 1.0);
  }
  else if (mode == 9) {
    // 09: Van Gogh "Starry Night" Swirling Impasto Oil Canvas × Mechanical Brass Glow (Active across the ENTIRE Era 09!)
    float ang = sin(uv.x * 16.0 + u_time * 0.7) * cos(uv.y * 12.0 - u_time * 0.5) * 6.283;
    float impastoRidge = sin(dot(uv * u_resolution * 0.24, vec2(cos(ang), sin(ang)))) * 0.038;
    float canvasWeave = (sin(uv.x * u_resolution.x * 1.2) * sin(uv.y * u_resolution.y * 1.2)) * 0.012;
    vec3 vgCol = base + relief * 0.38 + impastoRidge + canvasWeave;
    // Boost Prussian-Blue & Chrome-Yellow oil pigment saturation
    float avg = dot(vgCol, vec3(0.333));
    vgCol = mix(vec3(avg), vgCol, 1.32);
    return clamp(vgCol, 0.0, 1.0);
  }
  else if (mode == 10) {
    // 10: Faraday Electromagnetic Induction & Transatlantic Cable Harbor — Clean Crisp Detail + Subtle Cyan-Gold Dynamo Bloom
    vec3 blur = (
      texture(u_tex, uv + vec2(px.x * 2.0, 0.0)).rgb +
      texture(u_tex, uv - vec2(px.x * 2.0, 0.0)).rgb
    ) * 0.5;
    vec3 emBloom = max(vec3(0.0), blur - 0.65) * vec3(0.35, 0.92, 1.0) * 0.32;
    return clamp(base + relief * 0.20 + emBloom, 0.0, 1.0);
  }
  else if (mode == 11) {
    // 11: Nikola Tesla AC High-Voltage Corona Bloom & Violet-Cyan Lightning Aberration
    vec3 blur = (
      texture(u_tex, uv + vec2(px.x * 3.0, 0.0)).rgb +
      texture(u_tex, uv - vec2(px.x * 3.0, 0.0)).rgb +
      texture(u_tex, uv + vec2(0.0, px.y * 3.0)).rgb +
      texture(u_tex, uv - vec2(0.0, px.y * 3.0)).rgb
    ) * 0.25;
    vec3 corona = max(vec3(0.0), blur - 0.55) * vec3(0.65, 0.52, 1.0) * (0.45 + u_beatPulse * 0.25);
    return clamp(base + relief * 0.24 + corona, 0.0, 1.0);
  }
  else if (mode == 12) {
    // 12: Einstein Relativity Gravitational Lensing & Doppler Redshift/Blueshift + 3D Gaussian Splat Glow!
    vec2 bhCenter = vec2(0.54, 0.34);
    vec2 d = uv - bhCenter;
    float r = length(d) + 0.04;
    // Smooth Einstein ring gravitational lensing deflection around the upper-center black hole / eclipse
    vec2 lensedUV = clamp(uv - d * (0.0032 / (r * r + 0.018)), 0.002, 0.998);
    vec3 col = texture(u_tex, lensedUV).rgb;
    // Relativistic Doppler Shift: trailing left side warm redshift, leading right side cyan-violet blueshift
    vec3 doppler = mix(vec3(1.04, 0.97, 0.92), vec3(0.92, 0.99, 1.06), uv.x);
    return clamp(col * doppler + relief * 0.18, 0.0, 1.0);
  }
  else if (mode == 13) {
    // 13: Modern Olympics — Makoto Shinkai High-Saturation Anamorphic Sun-Flare & Motion Crispness
    vec3 blurH = (
      texture(u_tex, uv + vec2(px.x * 5.0, 0.0)).rgb +
      texture(u_tex, uv - vec2(px.x * 5.0, 0.0)).rgb
    ) * 0.5;
    vec3 anamorphic = max(vec3(0.0), blurH - 0.68) * vec3(1.0, 0.86, 0.45) * 0.38;
    float avg = dot(base, vec3(0.333));
    vec3 sat = mix(vec3(avg), base, 1.22);
    return clamp(sat + relief * 0.18 + anamorphic, 0.0, 1.0);
  }
  else if (mode == 14) {
    // 14: Silicon Valley Garage — Tektronix P1 Green Oscilloscope (1st Half) -> 8-Bit Retro Pixel CRT Scanlines (2nd Half)
    float localP = clamp((u_time - 166.0) / 12.0, 0.0, 1.0);
    float scanline = sin(uv.y * u_resolution.y * 1.6) * 0.04;
    if (localP < 0.46) {
      float lum = dot(base, vec3(0.299, 0.587, 0.114));
      vec3 p1Green = vec3(0.12, 0.96, 0.48) * (lum * 1.15 + 0.05) + base * 0.35;
      return clamp(mix(base, p1Green, 0.55) + scanline, 0.0, 1.0);
    } else {
      vec2 pixUV = (floor(uv * vec2(320.0, 180.0)) + 0.5) / vec2(320.0, 180.0);
      vec3 pixCol = texture(u_tex, pixUV).rgb;
      return clamp(mix(base, pixCol, 0.52) + scanline + relief * 0.20, 0.0, 1.0);
    }
  }
  else if (mode == 15) {
    // 15: Globalization Golden Age — Aurora Iridescent Glass Shimmer & Clean High-Definition Bloom
    float aurora = sin(uv.x * 10.0 + u_time * 1.8) * cos(uv.y * 8.0 - u_time * 1.2) * 0.025;
    vec3 auroraTint = vec3(0.2, 0.95, 0.82) * max(0.0, aurora);
    return clamp(base + relief * 0.18 + auroraTint, 0.0, 1.0);
  }

  return base;
}

void main() {
  vec3 colL = evalEraMaterial(u_shaderLeft, v_uv);
  vec3 colR = evalEraMaterial(u_shaderRight, v_uv);

  float blend = smoothstep(u_seamUV - 0.06, u_seamUV + 0.06, v_uv.x);
  vec3 col = mix(colL, colR, blend);

  if (v_uv.y >= 0.072 && v_uv.y <= 0.928) {
    vec2 d = v_uv - 0.5;
    col *= 1.0 - dot(d, d) * 0.12;
  }
  fragColor = vec4(col, 1.0);
}`;
