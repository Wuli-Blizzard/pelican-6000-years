// === src/kit/brushEngine.js ===
// V6 Collision-Free Spatial Layout Engine + Handheld IR Night-Vision Camcorder Viewfinder + Inception Sky-Folding City + Monumental Architecture

const BrushKit = {
  calligraphyLine(pg, pts, col, minW, maxW, seed = 1) {
    if (pts.length < 2) return;
    pg.push();
    pg.noFill();
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const u = i / (pts.length - 1);
      const pressure = Math.sin(u * Math.PI) * 0.78 + 0.22 * noise1D(u * 6 + seed);
      const w = minW + (maxW - minW) * pressure;
      pg.stroke(col[0], col[1], col[2], col[3] ?? 240);
      pg.strokeWeight(w);
      pg.line(p0.x, p0.y, p1.x, p1.y);
      if (w > 2.6) {
        pg.stroke(col[0], col[1], col[2], (col[3] ?? 240) * 0.42);
        pg.strokeWeight(0.85);
        const off = (noise1D(i * 1.7 + seed) - 0.5) * w * 0.85;
        pg.line(p0.x + off, p0.y - off * 0.5, p1.x + off, p1.y - off * 0.5);
      }
    }
    pg.pop();
  },

  charcoalStroke(pg, x1, y1, x2, y2, col, weight = 4, seed = 0) {
    pg.push();
    const steps = Math.max(8, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 6));
    for (let b = 0; b < 3; b++) {
      pg.stroke(col[0], col[1], col[2], (col[3] ?? 220) * (0.45 + 0.18 * b));
      pg.strokeWeight(weight * (0.38 + 0.22 * hash11(seed + b * 13)));
      pg.noFill();
      pg.beginShape();
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const nx = (noise1D(u * 8 + seed + b * 7.3) - 0.5) * weight * 0.85;
        const ny = (noise1D(u * 8 + seed + b * 19.1) - 0.5) * weight * 0.85;
        pg.vertex(x1 + (x2 - x1) * u + nx, y1 + (y2 - y1) * u + ny);
      }
      pg.endShape();
    }
    pg.pop();
  },

  draw3DTube(pg, x1, y1, x2, y2, baseCol, highlightCol, strokeCol, radius = 4.5) {
    pg.push();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;

    pg.stroke(0, 0, 0, 85);
    pg.strokeWeight(radius * 2.2);
    pg.line(x1 + 2, y1 + 3, x2 + 2, y2 + 3);

    pg.stroke(strokeCol[0], strokeCol[1], strokeCol[2], 245);
    pg.strokeWeight(radius * 2.1);
    pg.line(x1, y1, x2, y2);

    pg.stroke(baseCol[0], baseCol[1], baseCol[2], 255);
    pg.strokeWeight(radius * 1.45);
    pg.line(x1, y1, x2, y2);

    pg.stroke(highlightCol[0], highlightCol[1], highlightCol[2], 215);
    pg.strokeWeight(radius * 0.48);
    pg.line(x1 + nx * radius * 0.35, y1 + ny * radius * 0.35, x2 + nx * radius * 0.35, y2 + ny * radius * 0.35);
    pg.pop();
  },

  drawSealStamp(pg, x, y, w, h, chars, isRelief = true) {
    pg.push();
    pg.translate(x, y);
    if (isRelief) {
      pg.noFill();
      pg.stroke(184, 36, 26, 225);
      pg.strokeWeight(2.4);
      pg.rect(0, 0, w, h, 2);
      pg.fill(184, 36, 26, 225);
      pg.noStroke();
    } else {
      pg.noStroke();
      pg.fill(180, 32, 22, 232);
      pg.rect(0, 0, w, h, 2);
      pg.fill(242, 232, 212, 240);
    }
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textFont('serif');
    if (chars.length === 2) {
      pg.textSize(Math.min(w, h) * 0.42);
      pg.text(chars[0], w * 0.5, h * 0.30);
      pg.text(chars[1], w * 0.5, h * 0.72);
    } else if (chars.length === 4) {
      pg.textSize(Math.min(w, h) * 0.35);
      pg.text(chars[0], w * 0.72, h * 0.28);
      pg.text(chars[1], w * 0.72, h * 0.72);
      pg.text(chars[2], w * 0.28, h * 0.28);
      pg.text(chars[3], w * 0.28, h * 0.72);
    }
    pg.pop();
  },

  drawOracleBoneGlyph(pg, x, y, size, type, col) {
    pg.push();
    pg.translate(x, y);
    pg.stroke(col[0], col[1], col[2], col[3] ?? 235);
    pg.strokeWeight(2.2);
    pg.noFill();
    const s = size * 0.5;
    if (type === 'che') {
      pg.ellipse(-s * 0.85, 0, s * 0.75, s * 0.75);
      pg.ellipse(s * 0.85, 0, s * 0.75, s * 0.75);
      pg.line(-s * 0.85, 0, s * 0.85, 0);
      pg.line(0, -s * 0.95, 0, s * 0.95);
      pg.rect(-s * 0.35, -s * 0.35, s * 0.7, s * 0.7);
      pg.line(-s * 0.55, -s * 0.85, s * 0.55, -s * 0.85);
    } else if (type === 'niao') {
      pg.bezier(-s * 0.2, -s * 0.8, s * 0.3, -s * 0.4, s * 0.2, s * 0.4, -s * 0.3, s * 0.8);
      pg.line(-s * 0.2, -s * 0.6, s * 0.75, -s * 0.5);
      pg.line(-s * 0.1, -s * 0.1, s * 0.6, s * 0.15);
      pg.line(0, s * 0.4, s * 0.3, s * 0.9);
    } else if (type === 'bu') {
      pg.line(0, -s, 0, s);
      pg.line(0, -s * 0.1, s * 0.75, -s * 0.55);
    } else {
      pg.triangle(0, -s * 0.9, -s * 0.65, -s * 0.2, s * 0.65, -s * 0.2);
      pg.rect(-s * 0.45, -s * 0.2, s * 0.9, s * 0.95);
      pg.line(-s * 0.8, -s * 0.2, s * 0.8, -s * 0.2);
    }
    pg.pop();
  },

  /**
   * Draws a high-contrast Character Speech Bubble and returns its bounding box `{ x1, y1, x2, y2 }`
   * so no VFX label or Broadcast overlay ever overlaps with it!
   */
  drawDialogBubble(pg, anchorX, anchorY, boxX, boxY, textStr, bgCol, borderCol, textCol, isCat = false) {
    pg.push();
    pg.textFont('serif');
    pg.textSize(isCat ? 12.8 : 13.5);
    const tw = pg.textWidth(textStr);
    const padX = 12;
    const w = tw + padX * 2;
    const h = isCat ? 26 : 28;

    const x1 = boxX - w * 0.5;
    const y1 = boxY - h;

    pg.fill(bgCol[0], bgCol[1], bgCol[2], 242);
    pg.stroke(borderCol[0], borderCol[1], borderCol[2], 235);
    pg.strokeWeight(1.8);
    pg.triangle(boxX - 8, boxY, boxX + 8, boxY, anchorX, anchorY);
    pg.rect(x1, y1, w, h, 8);

    pg.noStroke();
    pg.fill(textCol[0], textCol[1], textCol[2], 252);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.text(textStr, boxX, boxY - h * 0.52);
    pg.pop();

    return { x1: x1 - 14, y1: y1 - 14, x2: x1 + w + 14, y2: boxY + 14 };
  },

  /**
   * INCEPTION DREAM-FOLDING SKY CITY (《盗梦空间》式 180° 苍穹倒悬折叠城市奇观)
   * Used in Era 00 (Folded Da Vinci Blueprint Metropolis) and Era 05 (Folded Sky-Vault Chang'an Imperial Palaces)!
   */
  drawInceptionFoldedSkyCity(pg, eraId, state, xMin, xMax, W, H) {
    const foldAmt = (state.cam && state.cam.inceptionFoldAmount) ? state.cam.inceptionFoldAmount : 0;
    if (foldAmt < 0.05) return;

    pg.push();
    const alpha = Math.round(165 * foldAmt);

    if (eraId === 'intro') {
      // Da Vinci Geometric Blueprint City folding upside-down from the upper ceiling (y = LETTERBOX_TOP)
      pg.stroke(238, 198, 118, alpha);
      pg.strokeWeight(1.5);
      pg.noFill();
      // Curved Inception bending grid lines connecting ground to sky ceiling
      for (let sx = Math.floor(xMin / 140) * 140; sx <= xMax; sx += 140) {
        const wx = sx - (state.cameraLeftWorldX * 0.15) % 140;
        pg.bezier(wx, H - LETTERBOX_BOTTOM, wx + 45, H * 0.5, wx + 45, H * 0.5, wx, LETTERBOX_TOP);
        // Upside-down Renaissance domes & towers hanging from LETTERBOX_TOP
        pg.rect(wx - 24, LETTERBOX_TOP, 48, 38);
        pg.arc(wx, LETTERBOX_TOP + 38, 48, 42, 0, Math.PI);
        pg.line(wx, LETTERBOX_TOP + 59, wx, LETTERBOX_TOP + 76);
      }
    } else if (eraId === 'era05') {
      // INCEPTION SKY-VAULT CHANG'AN (《盗梦空间》×「九天阊阖开宫殿」：苍穹之上 180° 镜像倒悬的云端长安宫阙与飞檐宝塔！)
      const startSlot = Math.floor((state.cameraLeftWorldX * 0.18 + xMin) / 320);
      const endSlot = Math.ceil((state.cameraLeftWorldX * 0.18 + xMax) / 320);
      for (let s = startSlot; s <= endSlot; s++) {
        const sx = s * 320 - state.cameraLeftWorldX * 0.18;
        if (sx < xMin - 160 || sx > xMax + 160) continue;

        pg.push();
        pg.translate(sx, LETTERBOX_TOP);
        pg.scale(1.0, -0.58); // Flip upside-down hanging from the sky vault!
        // Golden clouds & inverted Tang curved-eave palace silhouettes
        pg.fill(58, 118, 112, alpha);
        pg.stroke(245, 204, 98, alpha);
        pg.strokeWeight(1.8);
        pg.rect(-68, 0, 136, 48);
        // Inverted curved flying eaves
        pg.beginShape();
        pg.vertex(-92, 48);
        pg.quadraticVertex(0, 88, 92, 48);
        pg.vertex(68, 42);
        pg.quadraticVertex(0, 66, -68, 42);
        pg.endShape(pg.CLOSE);
        // Adjacent inverted spire pagoda
        pg.rect(95, 0, 48, 86);
        pg.triangle(82, 86, 119, 128, 156, 86);
        pg.pop();
      }
      // Shimmering Golden Horizon Fold Seam in upper sky
      pg.stroke(255, 224, 118, Math.round(110 * foldAmt));
      pg.strokeWeight(1.4);
      pg.line(xMin, LETTERBOX_TOP + 78, xMax, LETTERBOX_TOP + 78);
    } else if (eraId === 'era08') {
      // =======================================================================
      // INCEPTION DREAM-FOLDING OCEAN-TO-ANDES SKY VAULT (《盗梦空间》梦幻弧形海天折叠奇观！)
      // - Glowing golden astrolabe meridian arcs bend the Atlantic Ocean 90°->180° up onto the sky ceiling!
      // - Hanging upside-down from the golden-cloud sky vault are the Inverted Inca Temple of the Sun (Coricancha),
      //   Machu Picchu Terraces & Caravel Ships sailing through inverted sky-waves!
      // =======================================================================
      const waveAlpha = Math.round(175 * foldAmt);
      // 1) Curved Inception Space-Bending Meridian Ribs connecting Sea (y=460) to Sky Vault (y=LETTERBOX_TOP)
      pg.noFill();
      for (let m = 0; m < 6; m++) {
        const mx = xMin + ((m * 220 - state.cameraLeftWorldX * 0.12) % (W + 220) + (W + 220)) % (W + 220) - 80;
        if (mx < xMin - 120 || mx > xMax + 120) continue;
        pg.stroke(255, 218, 98, Math.round(95 * foldAmt));
        pg.strokeWeight(1.6);
        pg.bezier(mx, 465, mx + 95, 310, mx + 95, 165, mx, LETTERBOX_TOP + 6);
      }

      // 2) Inverted Sky-Ocean Swells rolling across the upper ceiling (y = LETTERBOX_TOP..LETTERBOX_TOP+65)
      for (let layer = 0; layer < 2; layer++) {
        pg.fill(layer === 0 ? [18, 68, 128, Math.round(145 * foldAmt)] : [32, 108, 168, Math.round(125 * foldAmt)]);
        pg.stroke(255, 224, 118, Math.round(160 * foldAmt));
        pg.strokeWeight(1.5);
        pg.beginShape();
        pg.vertex(xMin, LETTERBOX_TOP);
        for (let sx = xMin; sx <= xMax + 24; sx += 24) {
          const wy = LETTERBOX_TOP + 22 + layer * 18 + Math.sin(sx * 0.022 + state.t * 3.0 + layer) * 8;
          pg.vertex(sx, wy);
        }
        pg.vertex(xMax, LETTERBOX_TOP);
        pg.endShape(pg.CLOSE);
      }

      // 3) Upside-Down Inca Golden Sun Temple & Caravel Fleet hanging from the Sky Ceiling!
      const startSlot = Math.floor((state.cameraLeftWorldX * 0.20 + xMin) / 340);
      const endSlot = Math.ceil((state.cameraLeftWorldX * 0.20 + xMax) / 340);
      for (let s = startSlot; s <= endSlot; s++) {
        const sx = s * 340 - state.cameraLeftWorldX * 0.20;
        if (sx < xMin - 160 || sx > xMax + 160) continue;
        pg.push();
        pg.translate(sx, LETTERBOX_TOP + 12);
        pg.scale(0.88, -0.76); // Flip 180° upside-down!
        if (s % 2 === 0) {
          // Inverted Stepped Inca Sun Pyramid & Golden Inti Disk hanging from the sky
          pg.fill(218, 168, 72, waveAlpha);
          pg.stroke(255, 232, 128, waveAlpha);
          pg.strokeWeight(1.8);
          pg.rect(-64, 0, 128, 22);
          pg.rect(-46, -22, 92, 22);
          pg.rect(-28, -44, 56, 22);
          pg.fill(255, 214, 64, waveAlpha);
          pg.ellipse(0, -64, 28, 28);
        } else {
          // Inverted 3-Masted Caravel Sailing Ship on the ceiling ocean
          pg.fill(108, 62, 28, waveAlpha);
          pg.stroke(255, 214, 96, waveAlpha);
          pg.strokeWeight(1.8);
          pg.quad(-56, 0, 56, 0, 40, -26, -44, -26);
          pg.fill(252, 244, 225, waveAlpha);
          pg.rect(-22, -82, 42, 50, 3);
          pg.triangle(24, -76, 66, -28, 24, -28);
          pg.stroke(212, 42, 34, waveAlpha);
          pg.strokeWeight(2.8);
          pg.line(-1, -68, -1, -44);
          pg.line(-13, -56, 11, -56);
        }
        pg.pop();
      }
    }

    pg.pop();
  },

  drawShangGrandPalace(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    pg.fill(88, 64, 38, 245);
    pg.stroke(238, 198, 98);
    pg.strokeWeight(2.2);
    pg.quad(-340, 0, 340, 0, 310, -34, -310, -34);
    pg.fill(102, 74, 44, 245);
    pg.quad(-290, -34, 290, -34, 265, -66, -265, -66);
    pg.fill(116, 84, 50, 245);
    pg.quad(-240, -66, 240, -66, 220, -94, -220, -94);

    pg.fill(46, 118, 98, 235);
    pg.stroke(245, 208, 102);
    pg.strokeWeight(1.5);
    for (let k = -240; k <= 240; k += 80) {
      if (Math.abs(k) < 50) continue;
      pg.rect(k - 28, -28, 56, 20, 2);
      pg.ellipse(k - 10, -18, 5, 5);
      pg.ellipse(k + 10, -18, 5, 5);
    }

    pg.fill(142, 108, 64);
    pg.stroke(245, 208, 102);
    pg.strokeWeight(1.8);
    pg.quad(-56, 0, 56, 0, 40, -94, -40, -94);
    pg.stroke(72, 52, 30);
    for (let st = 1; st <= 9; st++) {
      const sy = -st * 10;
      const sw = 55 - st * 1.6;
      pg.line(-sw, sy, sw, sy);
    }

    [-215, 215].forEach((sideX) => {
      pg.push();
      pg.translate(sideX, -66);
      pg.fill(42, 32, 26, 240);
      pg.stroke(218, 178, 88);
      pg.strokeWeight(1.8);
      pg.rect(-58, -74, 116, 74);
      for (let c = -2; c <= 2; c++) {
        const colX = c * 22;
        pg.fill(172, 42, 32);
        pg.noStroke();
        pg.rect(colX - 3.5, -74, 7, 74);
        pg.fill(64, 158, 132);
        pg.rect(colX - 6, -8, 12, 8, 1);
      }
      pg.fill(58, 46, 34);
      pg.stroke(242, 202, 98);
      pg.strokeWeight(2.0);
      pg.quad(-76, -70, 76, -70, 48, -108, -48, -108);
      pg.fill(72, 198, 168);
      pg.triangle(-48, -108, -58, -124, -38, -108);
      pg.triangle(48, -108, 58, -124, 38, -108);
      pg.pop();
    });

    pg.push();
    pg.translate(0, -94);
    pg.fill(38, 26, 22, 248);
    pg.stroke(238, 196, 92);
    pg.strokeWeight(2.0);
    pg.rect(-135, -112, 270, 112);

    for (let c = -3; c <= 3; c++) {
      const colX = c * 38;
      pg.fill(186, 44, 32);
      pg.noStroke();
      pg.rect(colX - 5, -112, 10, 112);
      pg.fill(64, 168, 142);
      pg.stroke(245, 208, 102);
      pg.strokeWeight(1.4);
      pg.rect(colX - 8, -12, 16, 12, 2);
    }

    pg.fill(26, 48, 42);
    pg.stroke(245, 208, 102);
    pg.strokeWeight(2.2);
    pg.rect(-28, -76, 56, 76);
    pg.fill(218, 52, 38);
    pg.rect(-46, -104, 92, 22, 3);
    pg.fill(255, 228, 132);
    pg.noStroke();
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textFont('serif');
    pg.textSize(13);
    pg.text('大邑商·太室', 0, -93);

    pg.fill(64, 50, 36);
    pg.stroke(245, 204, 98);
    pg.strokeWeight(2.4);
    pg.beginShape();
    pg.vertex(-175, -104);
    pg.vertex(175, -104);
    pg.vertex(132, -148);
    pg.vertex(-132, -148);
    pg.endShape(pg.CLOSE);

    pg.fill(158, 42, 32);
    pg.rect(-108, -172, 216, 24);
    for (let k = -4; k <= 4; k++) {
      pg.fill(245, 204, 98);
      pg.rect(k * 22 - 4, -170, 8, 20);
    }

    pg.fill(52, 40, 28);
    pg.stroke(252, 214, 108);
    pg.strokeWeight(2.8);
    pg.beginShape();
    pg.vertex(-148, -168);
    pg.vertex(148, -168);
    pg.vertex(92, -226);
    pg.vertex(-92, -226);
    pg.endShape(pg.CLOSE);

    pg.stroke(255, 222, 118);
    pg.strokeWeight(4.5);
    pg.line(-96, -226, 96, -226);
    pg.fill(72, 218, 186);
    pg.stroke(255, 222, 118);
    pg.strokeWeight(2.0);
    pg.triangle(-92, -226, -112, -252, -74, -226);
    pg.triangle(92, -226, 112, -252, 74, -226);
    pg.fill(255, 214, 88);
    pg.ellipse(0, -242, 22, 22);
    pg.pop();

    [-115, 115].forEach((bx, idx) => {
      const wave = Math.sin(t * 6 + idx) * 10;
      pg.stroke(242, 202, 98);
      pg.strokeWeight(3.2);
      pg.line(bx, -94, bx, -245);
      pg.fill(198, 42, 32, 235);
      pg.stroke(248, 208, 102);
      pg.strokeWeight(1.8);
      pg.quad(bx, -238, bx + 54, -228 + wave, bx + 46, -182 + wave, bx, -190);
    });

    pg.pop();
  },

  drawGreekAcropolisComplex(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    pg.fill(158, 86, 46, 240);
    pg.stroke(42, 24, 16);
    pg.strokeWeight(2.2);
    pg.beginShape();
    pg.vertex(-390, 0);
    pg.vertex(-330, -118);
    pg.vertex(-180, -148);
    pg.vertex(195, -148);
    pg.vertex(345, -112);
    pg.vertex(405, 0);
    pg.endShape(pg.CLOSE);

    pg.fill(188, 112, 62, 235);
    pg.rect(-305, -148, 610, 28);
    pg.fill(38, 24, 18, 215);
    for (let a = -260; a <= 260; a += 52) {
      pg.arc(a, -120, 32, 36, Math.PI, Math.PI * 2);
    }

    pg.push();
    pg.translate(-225, -148);
    pg.fill(242, 234, 218);
    pg.stroke(58, 42, 30);
    pg.strokeWeight(1.8);
    pg.rect(-62, -12, 124, 12);
    for (let c = -2; c <= 2; c++) {
      pg.rect(c * 24 - 4.5, -68, 9, 56);
    }
    pg.rect(-64, -80, 128, 12);
    pg.triangle(-68, -80, 0, -108, 68, -80);

    const ax = 82;
    pg.fill(198, 168, 122);
    pg.rect(ax - 16, -34, 32, 34);
    pg.fill(245, 198, 78);
    pg.stroke(42, 28, 16);
    pg.strokeWeight(1.8);
    pg.quad(ax - 11, -34, ax + 11, -34, ax + 8, -92, ax - 8, -92);
    pg.ellipse(ax, -100, 14, 14);
    pg.arc(ax, -106, 22, 18, Math.PI * 0.8, Math.PI * 2.2);
    pg.ellipse(ax - 13, -64, 14, 34);
    pg.stroke(255, 228, 118);
    pg.strokeWeight(3.0);
    pg.line(ax + 14, -34, ax + 18, -138);
    pg.fill(255, 245, 168);
    pg.noStroke();
    pg.ellipse(ax + 18, -138, 10 + Math.sin(t * 8) * 4, 10 + Math.sin(t * 8) * 4);
    pg.pop();

    pg.push();
    pg.translate(18, -148);
    pg.fill(248, 242, 228);
    pg.stroke(48, 34, 24);
    pg.strokeWeight(2.0);
    pg.rect(-156, -8, 312, 8);
    pg.rect(-148, -16, 296, 8);
    pg.rect(-140, -24, 280, 8);

    pg.fill(32, 24, 20, 235);
    pg.rect(-118, -116, 236, 92);

    for (let i = 0; i < 8; i++) {
      const colX = -126 + i * 36;
      pg.fill(252, 246, 234);
      pg.stroke(48, 34, 24);
      pg.strokeWeight(2.0);
      pg.quad(colX - 8, -24, colX + 8, -24, colX + 6.5, -112, colX - 6.5, -112);
      pg.quad(colX - 10, -112, colX + 10, -112, colX + 12, -118, colX - 12, -118);
      pg.stroke(168, 148, 122, 180);
      pg.strokeWeight(1.0);
      pg.line(colX - 2.5, -26, colX - 2, -110);
      pg.line(colX + 2.5, -26, colX + 2, -110);
    }

    pg.fill(246, 238, 222);
    pg.stroke(48, 34, 24);
    pg.strokeWeight(2.0);
    pg.rect(-144, -142, 288, 24);
    pg.line(-144, -130, 144, -130);
    for (let tx = -132; tx <= 132; tx += 24) {
      pg.fill(58, 88, 128);
      pg.rect(tx - 4, -141, 8, 10);
      pg.fill(238, 168, 78);
      pg.ellipse(tx + 8, -136, 6, 6);
    }

    pg.fill(252, 246, 234);
    pg.stroke(48, 34, 24);
    pg.strokeWeight(2.4);
    pg.triangle(-154, -142, 0, -196, 154, -142);
    pg.fill(186, 68, 42);
    pg.triangle(-132, -145, 0, -188, 132, -145);
    pg.fill(252, 232, 182);
    pg.noStroke();
    pg.ellipse(0, -166, 14, 28);
    pg.ellipse(-28, -160, 12, 22);
    pg.ellipse(28, -160, 12, 22);
    pg.ellipse(-58, -154, 16, 14);
    pg.ellipse(58, -154, 16, 14);

    pg.fill(255, 214, 78);
    pg.stroke(48, 34, 24);
    pg.strokeWeight(1.5);
    pg.ellipse(0, -204, 16, 16);
    pg.triangle(-154, -142, -164, -158, -146, -146);
    pg.triangle(154, -142, 164, -158, 146, -146);
    pg.pop();

    pg.push();
    pg.translate(238, -148);
    pg.fill(246, 238, 222);
    pg.stroke(48, 34, 24);
    pg.strokeWeight(1.8);
    pg.rect(-48, -10, 96, 10);
    for (let c = -1.5; c <= 1.5; c += 1) {
      pg.rect(c * 24 - 4, -56, 8, 46);
    }
    pg.triangle(-52, -56, 0, -78, 52, -56);
    pg.pop();

    pg.pop();
  },

  drawCurvedTangRoof(pg, cx, topY, spanW, roofH, roofCol, goldCol) {
    pg.push();
    pg.fill(roofCol[0], roofCol[1], roofCol[2], 248);
    pg.stroke(goldCol[0], goldCol[1], goldCol[2], 230);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(cx - spanW * 0.34, topY);
    pg.vertex(cx + spanW * 0.34, topY);
    pg.quadraticVertex(cx + spanW * 0.45, topY + roofH * 0.88, cx + spanW * 0.56, topY + roofH * 0.62);
    pg.quadraticVertex(cx, topY + roofH * 1.08, cx - spanW * 0.56, topY + roofH * 0.62);
    pg.quadraticVertex(cx - spanW * 0.45, topY + roofH * 0.88, cx - spanW * 0.34, topY);
    pg.endShape(pg.CLOSE);

    pg.stroke(24, 18, 14, 140);
    pg.strokeWeight(1.2);
    for (let i = -5; i <= 5; i++) {
      const u = i / 6;
      pg.line(cx + u * spanW * 0.32, topY + 2, cx + u * spanW * 0.48, topY + roofH * 0.82);
    }

    pg.stroke(goldCol[0], goldCol[1], goldCol[2], 245);
    pg.strokeWeight(3.2);
    pg.line(cx - spanW * 0.35, topY, cx + spanW * 0.35, topY);
    pg.fill(goldCol[0], goldCol[1], goldCol[2], 245);
    pg.triangle(cx - spanW * 0.35, topY, cx - spanW * 0.39, topY - 12, cx - spanW * 0.31, topY);
    pg.triangle(cx + spanW * 0.35, topY, cx + spanW * 0.39, topY - 12, cx + spanW * 0.31, topY);

    pg.fill(158, 42, 32, 235);
    pg.stroke(goldCol[0], goldCol[1], goldCol[2], 190);
    pg.strokeWeight(1.2);
    const dgY = topY + roofH * 0.85;
    for (let k = -4; k <= 4; k++) {
      const bx = cx + k * (spanW * 0.085);
      pg.rect(bx - 6, dgY, 12, 8, 1);
    }
    pg.pop();
  },

  drawTangPavilion(pg, cx, baseY, w, h, stories = 2) {
    pg.push();
    pg.fill(218, 208, 188, 248);
    pg.stroke(68, 48, 34);
    pg.strokeWeight(1.8);
    pg.rect(cx - w * 0.46, baseY - 10, w * 0.92, 10, 1);

    const storyH = (h - 10) / stories;
    for (let s = 0; s < stories; s++) {
      const sw = w * Math.pow(0.82, s);
      const syBottom = (baseY - 10) - s * storyH;
      const syTop = syBottom - storyH * 0.62;

      pg.fill(236, 222, 192, 248);
      pg.stroke(58, 32, 20);
      pg.strokeWeight(2);
      pg.rect(cx - sw * 0.38, syTop, sw * 0.76, syBottom - syTop);

      pg.fill(172, 42, 32);
      for (let c = -2; c <= 2; c++) {
        const colX = cx + (c / 2) * (sw * 0.36);
        pg.rect(colX - 4, syTop, 8, syBottom - syTop);
      }

      if (s > 0) {
        pg.fill(188, 54, 38);
        pg.stroke(232, 188, 88);
        pg.strokeWeight(1.5);
        pg.rect(cx - sw * 0.44, syBottom - 10, sw * 0.88, 10);
      }

      BrushKit.drawCurvedTangRoof(pg, cx, syTop - storyH * 0.38, sw * 1.32, storyH * 0.44, [46, 38, 34], [235, 192, 88]);
    }
    pg.pop();
  },

  drawSilkRoadCamelUnit(pg, cx, groundY, t, idx = 0) {
    pg.push();
    pg.translate(cx, groundY);
    const stride = Math.sin(t * 5.5 + idx * 1.7) * 10;
    const headBob = Math.cos(t * 5.5 + idx * 1.7) * 3;

    pg.noStroke();
    pg.fill(0, 0, 0, 65);
    pg.ellipse(0, 0, 86, 10);

    pg.stroke(118, 72, 34);
    pg.strokeWeight(4.5);
    pg.line(-22, -38, -26 - stride * 0.7, -2);
    pg.line(-12, -38, -8 + stride * 0.7, -2);
    pg.line(16, -38, 12 + stride, -2);
    pg.line(24, -38, 28 - stride, -2);

    pg.fill(176, 114, 54);
    pg.stroke(52, 28, 14);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -46, 68, 34);

    pg.ellipse(-15, -66, 22, 26);
    pg.ellipse(11, -66, 22, 26);

    pg.fill(198, 42, 36);
    pg.stroke(248, 208, 88);
    pg.strokeWeight(1.8);
    pg.quad(-24, -60, 20, -60, 24, -38, -28, -38);
    pg.fill(64, 198, 178);
    pg.ellipse(-2, -68, 26, 11);
    pg.fill(255, 214, 82);
    pg.ellipse(-2, -75, 22, 9);

    pg.fill(176, 114, 54);
    pg.stroke(52, 28, 14);
    pg.strokeWeight(2.2);
    pg.beginShape();
    pg.vertex(22, -48);
    pg.quadraticVertex(38, -46, 42, -78 + headBob);
    pg.vertex(32, -80 + headBob);
    pg.quadraticVertex(28, -56, 16, -56);
    pg.endShape(pg.CLOSE);
    pg.ellipse(44, -82 + headBob, 24, 13);
    pg.ellipse(34, -89 + headBob, 7, 9);

    const bellSwing = Math.sin(t * 9 + idx) * 4;
    pg.stroke(218, 42, 32);
    pg.strokeWeight(2);
    pg.line(40, -76 + headBob, 40 + bellSwing, -62 + headBob);
    pg.fill(255, 214, 72);
    pg.stroke(52, 28, 14);
    pg.strokeWeight(1.5);
    pg.ellipse(40 + bellSwing, -60 + headBob, 9, 9);

    if (idx % 2 === 0) {
      const mx = 68;
      pg.stroke(198, 42, 32);
      pg.strokeWeight(1.8);
      pg.line(52, -80 + headBob, mx - 6, -38);
      pg.fill(48, 128, 112);
      pg.stroke(42, 24, 14);
      pg.strokeWeight(1.8);
      pg.quad(mx - 10, -46, mx + 10, -46, mx + 13, -14, mx - 13, -14);
      pg.strokeWeight(3.5);
      pg.line(mx - 4, -14, mx - 8 + stride * 0.6, -2);
      pg.line(mx + 4, -14, mx + 8 - stride * 0.6, -2);
      pg.fill(242, 202, 168);
      pg.strokeWeight(1.6);
      pg.ellipse(mx, -54, 14, 14);
      pg.fill(218, 62, 42);
      pg.stroke(248, 208, 88);
      pg.triangle(mx - 9, -58, mx + 9, -58, mx - 2, -76);
      pg.stroke(128, 82, 42);
      pg.strokeWeight(2.4);
      pg.line(mx + 10, -14, mx + 10, -98);
      pg.fill(218, 48, 36, 240);
      pg.stroke(252, 214, 92);
      pg.strokeWeight(1.6);
      pg.quad(mx + 10, -96, mx + 68, -90 + bellSwing, mx + 64, -68 + bellSwing, mx + 10, -72);
      pg.noStroke();
      pg.fill(255, 242, 188);
      pg.textFont('serif');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10.5);
      pg.text('丝绸之路', mx + 38, -81 + bellSwing * 0.5);
    }

    pg.pop();
  },

  /**
   * MULTI-GENRE MEDIA BROADCAST & CINEMA DIRECTING FX OVERLAY V6:
   * - Strictly respects the 4-Zone Non-Overlapping Layout (`seamFade` attenuates near era boundaries so ZERO effects leak across seams!)
   * - Era 02 First Half: Full-Screen Handheld IR Night-Vision Camcorder Viewfinder (Corner brackets, AF Crosshair, Battery, Raindrops on Lens, ECG)
   * - Era 03: Oracle Scroll (0..0.50) and Variety Show Caption (0.52..0.92) occupy the Top-Right slot in strictly non-overlapping time windows!
   */


  /**
   * ERA 06 MASTERPIECE: ZHANG ZEDUAN'S "QINGMING SCROLL" PANORAMA (《清明上河图》全景复刻：汴京城楼 + 孙羊正店彩楼欢门 + 虹桥百态 + 汴河漕船降桅过桥 + 苏颂水运仪象台)
   */
  drawSuSongClockTowerAndRainbowBridge(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // =========================================================================
    // LAYER A: BIANJING GRAND CITY GATE TOWER ("《清明上河图》东水门/重檐歇山顶城楼与瓮城雉堞") on Right-Back
    // =========================================================================
    pg.push();
    pg.translate(310, -18);
    // Rammed-earth & grey-brick city wall with crenellations ("城墙雉堞")
    pg.fill(148, 142, 132);
    pg.stroke(46, 42, 38);
    pg.strokeWeight(2.0);
    pg.quad(-145, 18, 145, 18, 128, -68, -128, -68);
    for (let m = -124; m <= 116; m += 24) {
      pg.rect(m, -76, 14, 8, 1);
    }
    // Arched brick city gate passage ("城门券洞")
    pg.fill(38, 32, 28);
    pg.arc(0, 18, 56, 78, Math.PI, Math.PI * 2);
    // 2-Story Song City Gate Pavilion ("重檐歇山顶城楼")
    pg.fill(238, 228, 208);
    pg.rect(-78, -128, 156, 52);
    for (let c = -64; c <= 64; c += 32) {
      pg.stroke(158, 48, 36);
      pg.strokeWeight(3.2);
      pg.line(c, -128, c, -76);
    }
    BrushKit.drawCurvedTangRoof(pg, 0, -148, 196, 22, [54, 66, 62], [204, 168, 88]);
    pg.fill(238, 228, 208);
    pg.stroke(46, 42, 38);
    pg.strokeWeight(1.8);
    pg.rect(-56, -184, 112, 38);
    BrushKit.drawCurvedTangRoof(pg, 0, -206, 156, 24, [54, 66, 62], [204, 168, 88]);
    // Plaque "汴京东水门"
    pg.fill(32, 28, 24);
    pg.stroke(218, 182, 96);
    pg.rect(-34, -172, 68, 18, 2);
    pg.noStroke();
    pg.fill(245, 218, 128);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(10);
    pg.text('汴京城楼', 0, -163);
    pg.pop();

    // =========================================================================
    // LAYER B: SUN YANG GRAND TAVERN WITH SONG "HUANMEN" BAMBOO ARCH & WEEPING WILLOWS ("孙羊正店·彩楼欢门与汴河垂柳")
    // =========================================================================
    pg.push();
    pg.translate(-330, 0);
    // 2-Story Song Timber Wine Pavilion
    pg.fill(236, 226, 204);
    pg.stroke(48, 38, 28);
    pg.strokeWeight(2.0);
    pg.rect(-68, -118, 136, 118);
    BrushKit.drawCurvedTangRoof(pg, 0, -138, 168, 22, [62, 74, 68], [198, 162, 84]);
    // Authentic Northern Song "Cai-Lou Huan-Men" (彩楼欢门: crisscrossed bamboo trellis with red/green silk festoons at tavern entrance!)
    pg.stroke(188, 148, 72);
    pg.strokeWeight(1.8);
    for (let k = -28; k <= 28; k += 14) {
      pg.line(k - 12, 0, k + 12, -64);
      pg.line(k + 12, 0, k - 12, -64);
    }
    pg.fill(198, 46, 38);
    pg.noStroke();
    pg.ellipse(0, -56, 28, 14);
    // Swaying Song Tavern Banner ("孙羊正店")
    pg.stroke(92, 62, 34);
    pg.strokeWeight(2.5);
    pg.line(76, 0, 76, -136);
    const flagWave = Math.sin(t * 5.0) * 6;
    pg.fill(248, 236, 206);
    pg.stroke(178, 46, 34);
    pg.strokeWeight(1.8);
    pg.quad(76, -132, 128, -126 + flagWave, 124, -92 + flagWave, 76, -96);
    pg.noStroke();
    pg.fill(168, 38, 28);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(10.5);
    pg.text('孙羊正店', 101, -112 + flagWave * 0.5);
    pg.pop();

    // Swaying Bian River Weeping Willows ("清明柳岸晓风")
    [-215, 225].forEach((wx, idx) => {
      pg.push();
      pg.translate(wx, 4);
      pg.stroke(78, 58, 38);
      pg.strokeWeight(5.5);
      pg.line(0, 0, (idx === 0 ? -8 : 8), -92);
      pg.line((idx === 0 ? -4 : 4), -58, (idx === 0 ? 22 : -22), -88);
      // Hanging willow tendrils swaying in the breeze
      pg.stroke(86, 134, 82, 200);
      pg.strokeWeight(1.6);
      pg.noFill();
      for (let v = -24; v <= 24; v += 8) {
        const sway = Math.sin(t * 3.8 + v * 0.2 + idx) * 10;
        pg.bezier(v, -88, v + sway * 0.5, -58, v + sway, -32, v + sway * 1.2, -12);
      }
      pg.pop();
    });

    // =========================================================================
    // LAYER C: SU SONG'S 3-STORY COSMIC CLOCK TOWER ("苏颂水运仪象台 · 枢轮/浑象/浑仪")
    // =========================================================================
    pg.push();
    pg.translate(-125, 0);
    pg.fill(142, 138, 128);
    pg.stroke(42, 44, 40);
    pg.strokeWeight(2.0);
    pg.quad(-72, 0, 72, 0, 62, -38, -62, -38);
    pg.fill(236, 228, 210);
    pg.rect(-54, -108, 108, 70);
    pg.fill(40, 32, 26);
    pg.rect(-40, -100, 80, 54, 4);
    pg.push();
    pg.translate(0, -73);
    pg.rotate(t * 1.1);
    pg.noFill();
    pg.stroke(218, 174, 88);
    pg.strokeWeight(2.4);
    pg.ellipse(0, 0, 46, 46);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * 23, Math.sin(a) * 23);
    }
    pg.pop();
    BrushKit.drawCurvedTangRoof(pg, 0, -128, 142, 20, [54, 68, 64], [202, 168, 88]);
    pg.fill(236, 228, 210);
    pg.stroke(42, 44, 40);
    pg.strokeWeight(1.8);
    pg.rect(-44, -176, 88, 48);
    // Time-keeping wooden jack in red robe holding plaque
    pg.fill(188, 46, 36);
    pg.rect(-6, -152, 12, 18, 2);
    pg.noFill();
    pg.stroke(98, 188, 168);
    pg.strokeWeight(2.0);
    pg.ellipse(0, -154, 30, 30);
    BrushKit.drawCurvedTangRoof(pg, 0, -196, 118, 20, [54, 68, 64], [202, 168, 88]);
    // Top Bronze Armillary Sphere ("浑仪")
    pg.push();
    pg.translate(0, -222);
    pg.noFill();
    pg.stroke(224, 182, 82);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 0, 34, 34);
    pg.rotate(t * 0.8);
    pg.ellipse(0, 0, 22, 34);
    pg.line(-18, 0, 18, 0);
    pg.pop();
    pg.pop();

    // =========================================================================
    // LAYER D: BIANJING RAINBOW ARCH BRIDGE & FAMOUS CARGO BOAT LOWERING ITS MAST ("《清明上河图》虹桥百态与汴河大漕船紧急降桅过桥名场面！")
    // =========================================================================
    pg.push();
    pg.translate(85, 16);
    // Shimmering Bian River water with ink ripples
    pg.fill(124, 166, 158, 195);
    pg.noStroke();
    pg.rect(-210, -14, 420, 34, 6);
    pg.stroke(238, 246, 240, 170);
    pg.strokeWeight(1.5);
    for (let r = -180; r <= 180; r += 45) {
      const rx = r + Math.sin(t * 3 + r) * 8;
      pg.line(rx - 18, 4, rx + 18, 4);
    }

    // FAMOUS QINGMING SCROLL SCENE: Large Bian River Cargo Boat Lowering Its Pivoted Mast Before Passing Under the Bridge!
    const boatX = -42 + Math.sin(t * 1.8) * 18;
    pg.push();
    pg.translate(boatX, 4);
    // Curved timber hull & cabin with lattice windows
    pg.fill(118, 76, 40);
    pg.stroke(38, 24, 14);
    pg.strokeWeight(2.0);
    pg.quad(-78, -4, 78, -4, 62, 12, -62, 12);
    pg.fill(158, 114, 68);
    pg.rect(-38, -22, 72, 18, 2);
    // Pivoting Mast being lowered dynamically (`mastAngle` swings down from 45° to 15°!)
    const mastAngle = -0.32 - (0.22 * (0.5 + 0.5 * Math.sin(t * 2.5)));
    pg.push();
    pg.translate(12, -22);
    pg.rotate(mastAngle);
    pg.stroke(86, 54, 28);
    pg.strokeWeight(3.6);
    pg.line(0, 0, -82, 0);
    pg.strokeWeight(1.4);
    pg.line(-76, 0, -20, 14);
    pg.pop();
    // 3 Animated Song Boatmen on cabin roof & bow poling and shouting ("船夫紧急降桅撑篙")!
    [-24, 2, 48].forEach((bx, bIdx) => {
      const by = bIdx === 2 ? -4 : -22;
      pg.fill(218, 212, 196);
      pg.stroke(38, 28, 20);
      pg.strokeWeight(1.5);
      pg.line(bx, by, bx, by - 14);
      pg.ellipse(bx, by - 18, 7, 7);
      // Bamboo pole pushing toward bridge arch
      if (bIdx === 2) {
        pg.stroke(188, 152, 82);
        pg.strokeWeight(2.0);
        pg.line(bx, by - 10, bx + 32, by - 46 + Math.sin(t * 8) * 4);
      }
    });
    pg.pop();

    // Woven-Timber Rainbow Arch Bridge ("无柱木拱虹桥") arching high over the boat!
    pg.noFill();
    pg.stroke(108, 66, 34);
    pg.strokeWeight(7.0);
    pg.arc(0, 10, 290, 132, Math.PI * 1.07, Math.PI * 1.93);
    pg.stroke(162, 112, 62);
    pg.strokeWeight(3.4);
    pg.arc(0, 3, 302, 138, Math.PI * 1.07, Math.PI * 1.93);

    // Bridge railings, vendor parasols & bustling Song pedestrians along the bridge crest!
    for (let bx = -126; bx <= 126; bx += 21) {
      const by = -Math.sin(Math.acos(bx / 150)) * 66;
      pg.stroke(88, 54, 28);
      pg.strokeWeight(2.0);
      pg.line(bx, by, bx, by - 18);
      // Market parasols ("虹桥市集油纸伞摊") & pedestrians on bridge
      if (bx === -42 || bx === 21) {
        pg.stroke(98, 64, 34);
        pg.line(bx + 8, by - 4, bx + 8, by - 36);
        pg.fill(bx < 0 ? [218, 198, 156] : [148, 182, 168]);
        pg.triangle(bx - 12, by - 34, bx + 8, by - 46, bx + 28, by - 34);
      }
      // Animated tiny Song pedestrians & sedan-chair carriers on the bridge
      const pedX = bx + Math.sin(t * 2.5 + bx) * 4;
      pg.fill(bx % 42 === 0 ? [178, 58, 44] : [72, 98, 112]);
      pg.noStroke();
      pg.ellipse(pedX, by - 22, 6, 6);
      pg.rect(pedX - 3, by - 18, 6, 12, 2);
    }
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 07 MASTERPIECE V4.3: TRUE SPLASH-INK SHANSHUI ("用墨泼墨成画") × BADA SHANREN & JINGDEZHEN BLUE-AND-WHITE PORCELAIN
   * (天降泼墨晕染成山 + 断崖留白飞瀑 + 苍松怪石 + 江上孤舟蓑笠翁 + 八大山人危石残荷翻白眼孤禽 + 通天元青花梅瓶与郑和宝船共生！)
   */
  drawZhengHeTreasureShipAndMingTown(pg, cx, baseY, scale = 1.0, t = 0, sliceProgress = 0.5) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // Smooth kiln-transmutation factor (`kilnMix`: 0.0 = Five-Tone Black Splash-Ink; 1.0 = Jingdezhen Sumali Cobalt Blue Porcelain Shanshui!)
    const kilnMix = Math.max(0, Math.min(1, (sliceProgress - 0.36) / 0.22));
    const inkCol = (alpha = 220, shade = 0) => [
      Math.round((18 + shade * 32) * (1 - kilnMix) + (16 + shade * 26) * kilnMix),
      Math.round((20 + shade * 32) * (1 - kilnMix) + (58 + shade * 46) * kilnMix),
      Math.round((24 + shade * 35) * (1 - kilnMix) + (162 + shade * 55) * kilnMix),
      alpha,
    ];

    // =========================================================================
    // LAYER A: DYNAMIC "SPLASH-INK FORMING MOUNTAINS" ("真·用墨泼墨成画：破墨晕染、飞白皴擦、留白飞瀑与苍松孤舟")
    // =========================================================================
    // 0) CELESTIAL GIANT CALLIGRAPHY BRUSH SPLASHING INK FROM THE SKY ("神笔凌空泼墨：洒墨成山河、成鱼虾、成虫鸣鸟兽！")
    pg.push();
    const brushPivotX = -215 + Math.sin(t * 2.2) * 28;
    const brushPivotY = -255 + Math.cos(t * 3.0) * 10;
    pg.translate(brushPivotX, brushPivotY);
    pg.rotate(-0.42 + Math.sin(t * 3.2) * 0.14);
    // Rosewood & Jade Giant Brush Handle ("紫檀白玉斗笔巨管")
    pg.fill(98, 42, 24);
    pg.stroke(245, 208, 98);
    pg.strokeWeight(2.2);
    pg.rect(-12, -110, 24, 78, 4);
    pg.fill(188, 236, 218);
    pg.rect(-14, -36, 28, 12, 2);
    // Lush Wolf-Hair & Ink-Saturated Brush Tip ("饱满欲滴的巨毫浓墨笔锋")
    pg.fill(...inkCol(248, 0));
    pg.noStroke();
    pg.beginShape();
    pg.vertex(-13, -24);
    pg.quadraticVertex(-22, 8, -4, 38);
    pg.quadraticVertex(18, 12, 13, -24);
    pg.endShape(pg.CLOSE);
    pg.pop();

    // Dynamic Ink Stream pouring from the Giant Brush Tip & Morphing into Living Ink Shrimps, Fish, Dragonflies & Birds!
    for (let st = 0; st < 7; st++) {
      const u = ((t * 0.55 + st / 7) % 1.0);
      const sx = brushPivotX + 12 + u * 295 + Math.sin(u * 8 + t * 3) * 18;
      const sy = brushPivotY + 28 + u * 165 - Math.sin(u * Math.PI) * 32;
      pg.fill(...inkCol(Math.round(230 * (1 - u * 0.35)), st % 2));
      pg.noStroke();
      if (st % 3 === 0) {
        // MORPH 1: Qi Baishi / Bada Shanren Style Translucent Splash-Ink Shrimp ("洒墨成虾：写意水墨游虾，带弯曲虾节与长须")!
        pg.push();
        pg.translate(sx, sy);
        pg.rotate(0.25 + Math.sin(t * 5 + st) * 0.15);
        for (let seg = 0; seg < 4; seg++) {
          pg.ellipse(-seg * 6, seg * 1.5, 9 - seg * 1.2, 6 - seg * 0.6);
        }
        pg.stroke(...inkCol(210, 0));
        pg.strokeWeight(1.2);
        pg.noFill();
        // Long flowing shrimp antennae & pincers
        pg.bezier(4, 0, 22, -12 + Math.sin(t * 7 + st) * 6, 38, -6, 52, -14);
        pg.bezier(4, 2, 24, 10 - Math.cos(t * 7 + st) * 6, 40, 14, 54, 8);
        pg.pop();
      } else if (st % 3 === 1) {
        // MORPH 2: Soaring Splash-Ink Swallow / Bird ("洒墨成鸟：振翅水墨飞燕")!
        pg.push();
        pg.translate(sx, sy - 22);
        const wingFlap = Math.sin(t * 11 + st) * 9;
        pg.stroke(...inkCol(240, 0));
        pg.strokeWeight(2.6);
        pg.noFill();
        pg.bezier(-16, -wingFlap, -4, 0, 0, 2, 16, -wingFlap);
        pg.line(0, 2, -10, 10);
        pg.line(0, 2, -4, 12);
        pg.pop();
      } else {
        // MORPH 3: Ink Dragonfly / Cicada ("洒墨成虫：荷间水墨蜻蜓")!
        pg.push();
        pg.translate(sx, sy - 10);
        pg.stroke(...inkCol(235, 0));
        pg.strokeWeight(2.0);
        pg.line(-10, 0, 10, 0);
        pg.noFill();
        pg.ellipse(0, -5, 6, 12);
        pg.ellipse(0, 5, 6, 12);
        pg.pop();
      }
    }
    // 1) Organic Splash-Ink Blotch Halos ("泼墨湿水痕晕染层" — outer pale ink ring + inner dark core + flying ink droplets!)
    const inkSplashes = [
      { x: -310, y: -150, rx: 145, ry: 92, seed: 1.3 },
      { x: -135, y: -185, rx: 185, ry: 125, seed: 3.1 },
      { x: 55,   y: -165, rx: 165, ry: 112, seed: 5.7 },
      { x: 245,  y: -145, rx: 155, ry: 98,  seed: 8.2 },
    ];
    inkSplashes.forEach((sp, sIdx) => {
      // 4 concentric wet-ink diffusion layers (清墨 -> 淡墨 -> 重墨 -> 焦墨)
      for (let w = 0; w < 4; w++) {
        const ratio = 1.08 - w * 0.20;
        pg.fill(...inkCol(36 + w * 42, 3 - w));
        pg.noStroke();
        pg.beginShape();
        for (let a = 0; a <= Math.PI * 2.05; a += 0.22) {
          const n = noise1D(a * 4.2 + sp.seed + w * 3.7 + t * 0.18);
          const rx = sp.rx * ratio * (0.72 + 0.45 * n);
          const ry = sp.ry * ratio * (0.68 + 0.48 * n);
          pg.vertex(sp.x + Math.cos(a) * rx, sp.y + Math.sin(a) * ry);
        }
        pg.endShape(pg.CLOSE);
      }
      // Flying ink-splash droplets ("泼墨飞溅宿墨点") around the mountain peaks!
      pg.fill(...inkCol(215, 0));
      for (let d = 0; d < 9; d++) {
        const ang = (d / 9) * Math.PI * 2 + sp.seed;
        const dist = sp.rx * (0.75 + 0.35 * hash11(d * 17 + sIdx));
        const dr = 3.5 + (d % 3) * 2.5;
        pg.ellipse(sp.x + Math.cos(ang) * dist, sp.y - 20 + Math.sin(ang) * dist * 0.55, dr * 1.4, dr);
      }
    });

    // 2) Cascading White-Space Waterfall ("泼墨山涧留白三叠泉飞瀑") pouring down the main ink peak (`x = -135`)!
    pg.push();
    pg.translate(-135, -215);
    pg.noStroke();
    pg.fill(248, 250, 252, 235);
    pg.beginShape();
    pg.vertex(-12, 0);
    pg.vertex(12, 0);
    pg.quadraticVertex(24, 75, 32, 168);
    pg.vertex(-18, 168);
    pg.quadraticVertex(-10, 75, -12, 0);
    pg.endShape(pg.CLOSE);
    // Animated ink-water streaks & mist at the base of the waterfall
    pg.stroke(...inkCol(185, 1));
    pg.strokeWeight(1.6);
    for (let k = -8; k <= 12; k += 6) {
      const dropY = ((t * 65 + k * 9) % 145);
      pg.line(k, dropY, k + 3, dropY + 22);
    }
    // Gnarled Ink Pine Tree ("断崖迎客苍松") jutting out beside the waterfall!
    pg.stroke(...inkCol(250, 0));
    pg.strokeWeight(4.2);
    pg.noFill();
    pg.bezier(-22, 42, -58, 24, -76, 32, -98, 18);
    pg.fill(...inkCol(225, 0));
    pg.noStroke();
    [[-64, 22], [-86, 14], [-48, 30]].forEach(([px, py]) => {
      pg.ellipse(px, py, 34, 14);
    });
    pg.pop();

    // 3) Classic Shanshui Solitary Fisherman Skiff in Negative-Space Mist ("江上孤舟蓑笠翁·山水留白意境")
    const skiffX = -55 + Math.sin(t * 1.5) * 14;
    pg.push();
    pg.translate(skiffX, -18);
    pg.fill(...inkCol(235, 0));
    pg.noStroke();
    pg.beginShape();
    pg.vertex(-36, 0);
    pg.quadraticVertex(0, 10, 38, -2);
    pg.quadraticVertex(0, 3, -36, 0);
    pg.endShape(pg.CLOSE);
    // Bamboo-hat scholar/fisherman & fishing rod
    pg.ellipse(-6, -10, 10, 14);
    pg.triangle(-16, -15, -6, -24, 4, -15);
    pg.stroke(...inkCol(200, 0));
    pg.strokeWeight(1.4);
    pg.line(-2, -12, 42, -28);
    pg.line(42, -28, 42, 4);
    pg.pop();

    // =========================================================================
    // LAYER B: BADA SHANREN MASTERPIECE ("八大山人《荷石水禽图》：上大下小危石、狂草泼墨残荷、单足翻白眼孤禽")
    // =========================================================================
    pg.push();
    pg.translate(-275, 6);
    pg.fill(...inkCol(215, 1));
    pg.stroke(...inkCol(250, 0));
    pg.strokeWeight(2.8);
    pg.beginShape();
    pg.vertex(-16, 0);
    pg.vertex(-48, -58);
    pg.vertex(-62, -112);
    pg.vertex(-18, -138);
    pg.vertex(42, -124);
    pg.vertex(52, -68);
    pg.vertex(14, 0);
    pg.endShape(pg.CLOSE);

    const sway = Math.sin(t * 2.4) * 8;
    pg.noFill();
    pg.stroke(...inkCol(240, 0));
    pg.strokeWeight(3.2);
    pg.bezier(8, -95, 22, -155, 48 + sway, -198, 64 + sway, -238);
    pg.fill(...inkCol(210, 0));
    pg.noStroke();
    pg.beginShape();
    for (let a = 0; a < Math.PI * 2; a += 0.35) {
      const r = 46 + noise1D(a * 4 + t * 0.5) * 22;
      pg.vertex(64 + sway + Math.cos(a) * r, -238 + Math.sin(a) * r * 0.42);
    }
    pg.endShape(pg.CLOSE);

    // One-Legged Square Roll-Eye Bird + Bada Shanren Red Seal ("八大山人·哭之笑之")
    pg.push();
    pg.translate(-8, -138);
    pg.stroke(...inkCol(255, 0));
    pg.strokeWeight(2.4);
    pg.line(0, 0, 0, -24);
    pg.fill(...inkCol(245, 0));
    pg.ellipse(-2, -36, 34, 26);
    pg.triangle(-16, -42, -34, -58, -12, -48);
    pg.ellipse(12, -48, 20, 18);
    pg.fill(255, 255, 255);
    pg.stroke(...inkCol(255, 0));
    pg.strokeWeight(1.6);
    pg.rect(8, -54, 9, 7, 1);
    pg.fill(10, 14, 22);
    pg.noStroke();
    pg.ellipse(12.5, -53, 3.2, 3.2);
    pg.stroke(...inkCol(255, 0));
    pg.strokeWeight(2.0);
    pg.line(21, -48, 32, -46);
    pg.pop();
    BrushKit.drawSealStamp(pg, -92, -195, 26, 52, '八大山人', false);
    pg.pop();

    // =========================================================================
    // LAYER C: GIANT TRANSLUCENT JINGDEZHEN BLUE-AND-WHITE PORCELAIN VASE SILHOUETTE FUSING WITH SHANSHUI & ZHENG HE FLEET!
    // ("水墨与青花瓷的终极结合：巨型元青花梅瓶与泼墨山水、徽派五孔桥、郑和宝船融为一体！")
    // =========================================================================
    pg.push();
    pg.translate(95, 0);
    // Giant Translucent Blue-and-White Porcelain Meiping Vase Contour in the Sky/Midground
    pg.fill(248, 252, 255, Math.round(75 + kilnMix * 95));
    pg.stroke(22, 68, 168, Math.round(165 + kilnMix * 85));
    pg.strokeWeight(3.0);
    pg.beginShape();
    pg.vertex(-58, 0);
    pg.bezierVertex(-82, -75, -112, -165, -64, -222);
    pg.vertex(-28, -232);
    pg.vertex(-32, -252);
    pg.vertex(32, -252);
    pg.vertex(28, -232);
    pg.vertex(64, -222);
    pg.bezierVertex(112, -165, 82, -75, 58, 0);
    pg.endShape(pg.CLOSE);
    // Classic Yuan Blue-and-White Lotus-and-Wave Neck Bands on the Giant Porcelain Vase
    pg.noFill();
    pg.stroke(22, 68, 168, 210);
    pg.strokeWeight(2.0);
    pg.line(-64, -218, 64, -218);
    pg.line(-74, -196, 74, -196);
    for (let p = -56; p <= 56; p += 28) {
      pg.arc(p, -207, 22, 16, 0, Math.PI);
    }
    pg.pop();

    // Zheng He's 9-Masted Blue-and-White Porcelain-Sail Treasure Ship on Right
    pg.push();
    pg.translate(235, -18 + Math.sin(t * 2.6) * 5);
    pg.fill(248, 251, 255);
    pg.stroke(...inkCol(250, 0));
    pg.strokeWeight(2.6);
    pg.beginShape();
    pg.vertex(-145, 0);
    pg.vertex(155, 0);
    pg.vertex(188, -44);
    pg.vertex(118, -38);
    pg.vertex(-118, -34);
    pg.vertex(-172, -50);
    pg.endShape(pg.CLOSE);
    pg.fill(...inkCol(235, 1));
    pg.noStroke();
    pg.rect(-135, -22, 270, 8, 2);
    const masts = [
      { x: -98, w: 42, h: 90 },
      { x: -42, w: 54, h: 124 },
      { x: 18,  w: 64, h: 148 },
      { x: 78,  w: 52, h: 116 },
      { x: 128, w: 38, h: 82 },
    ];
    masts.forEach((m, idx) => {
      pg.stroke(...inkCol(245, 0));
      pg.strokeWeight(2.8);
      pg.line(m.x, -34, m.x, -34 - m.h - 14);
      pg.fill(idx % 2 === 0 && kilnMix < 0.65 ? [192, 46, 38, 235] : [245, 249, 255, 242]);
      pg.stroke(...inkCol(235, 0));
      pg.strokeWeight(1.8);
      pg.quad(m.x - m.w * 0.45, -42, m.x + m.w * 0.55, -46, m.x + m.w * 0.48, -38 - m.h, m.x - m.w * 0.40, -34 - m.h);
      pg.noFill();
      pg.stroke(...inkCol(190, 1));
      pg.arc(m.x, -38 - m.h * 0.5, m.w * 0.5, m.w * 0.5, 0, Math.PI * 1.5);
    });
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 08 MASTERPIECE: AGE OF SAIL 5-LAYER ATLANTIC OCEAN, 3-MASTED CARAVEL FLEET, INCA SUN EMPIRE & LEAPING GOLDEN WHALE
   */
  drawIncaMachuPicchuAndSunCalendar(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // Helper: Multi-Segment Vertex Sine-Wave + Perlin Gust Cloth/Flag Physics ("多段顶点正弦波 + 柏林噪声阵风模拟")
    const drawWindWavingBanner = (rootX, rootY, length, baseH, tipH, colTop, colMid, colBot, phaseOff = 0) => {
      const segs = 10;
      const bands = [colTop, colMid, colBot];
      for (let b = 0; b < bands.length; b++) {
        pg.fill(...bands[b]);
        pg.noStroke();
        pg.beginShape();
        for (let i = 0; i <= segs; i++) {
          const u = i / segs;
          const x = rootX + u * length;
          const hHere = baseH * (1 - u) + tipH * u;
          const gust = Math.sin(u * 4.8 - t * 9.5 + phaseOff) * (8.5 * u)
                     + (noise1D(u * 3.2 + t * 2.8 + phaseOff) - 0.5) * (11.0 * u);
          const yTop = rootY + gust + (b / bands.length) * hHere;
          pg.vertex(x, yTop);
        }
        for (let i = segs; i >= 0; i--) {
          const u = i / segs;
          const x = rootX + u * length;
          const hHere = baseH * (1 - u) + tipH * u;
          const gust = Math.sin(u * 4.8 - t * 9.5 + phaseOff) * (8.5 * u)
                     + (noise1D(u * 3.2 + t * 2.8 + phaseOff) - 0.5) * (11.0 * u);
          const yBot = rootY + gust + ((b + 1) / bands.length) * hHere;
          pg.vertex(x, yBot);
        }
        pg.endShape(pg.CLOSE);
      }
    };

    // LAYER A: ANDEAN MACHU PICCHU MEGALITHIC TERRACES, STEPPED SUN PYRAMID & WHIPPING INCA RAINBOW BANNERS
    pg.push();
    pg.translate(-225, 0);
    pg.fill(58, 104, 68);
    pg.stroke(42, 28, 16);
    pg.strokeWeight(2.4);
    pg.beginShape();
    pg.vertex(-165, 0);
    pg.vertex(-110, -195);
    pg.vertex(-45, -242);
    pg.vertex(25, -140);
    pg.vertex(95, 0);
    pg.endShape(pg.CLOSE);
    for (let tr = 1; tr <= 5; tr++) {
      const ty = -tr * 24;
      const tw = 150 - tr * 18;
      pg.fill(172, 146, 104);
      pg.rect(-45 - tw * 0.5, ty, tw, 11, 2);
    }
    for (let lv = 0; lv < 5; lv++) {
      const w = 185 - lv * 30;
      const y = -lv * 22;
      pg.fill(212, 168, 86);
      pg.stroke(52, 34, 16);
      pg.strokeWeight(2.0);
      pg.rect(85 - w * 0.5, y - 22, w, 22, 2);
    }
    // Inca Wiphala / Rainbow Sun Temple Flags whipping in the Andean wind!
    [-18, 155].forEach((fx, fIdx) => {
      pg.stroke(218, 178, 72);
      pg.strokeWeight(2.6);
      pg.line(fx, -110, fx, -178);
      drawWindWavingBanner(fx, -176, 48, 20, 12, [238, 48, 42], [255, 214, 48], [32, 188, 138], fIdx * 1.7);
    });
    pg.push();
    pg.translate(85, -172);
    pg.rotate(t * 0.65);
    pg.fill(255, 212, 58, 242);
    pg.stroke(98, 54, 12);
    pg.strokeWeight(2.4);
    pg.ellipse(0, 0, 72, 72);
    pg.noFill();
    pg.ellipse(0, 0, 50, 50);
    for (let r = 0; r < 12; r++) {
      const a = (r / 12) * Math.PI * 2;
      pg.line(Math.cos(a) * 25, Math.sin(a) * 25, Math.cos(a) * 36, Math.sin(a) * 36);
    }
    pg.fill(32, 214, 172);
    pg.ellipse(0, 0, 18, 18);
    pg.pop();
    pg.pop();

    // LAYER B: GRAND AGE OF SAIL ATLANTIC OCEAN & 3-MASTED SANTA MARIA / VICTORIA FLAGSHIP FLEET!
    for (let wl = 0; wl < 3; wl++) {
      const wyBase = -48 + wl * 22;
      pg.fill(wl === 0 ? [16, 62, 118, 235] : (wl === 1 ? [22, 86, 148, 240] : [28, 112, 176, 245]));
      pg.stroke(255, 224, 118, 195);
      pg.strokeWeight(2.0);
      pg.beginShape();
      pg.vertex(-420, 28);
      for (let x = -420; x <= 460; x += 28) {
        const waveY = wyBase + Math.sin(x * 0.024 - t * (3.2 + wl * 0.6) + wl * 1.5) * (14 + wl * 4);
        pg.vertex(x, waveY);
      }
      pg.vertex(460, 28);
      pg.endShape(pg.CLOSE);
    }

    // Breaching Golden Inca-Totem Humpback Whale
    const whalePhase = (t * 0.45) % 1.0;
    const wx = -35 + Math.cos(whalePhase * Math.PI) * 65;
    const wy = -65 - Math.sin(whalePhase * Math.PI) * 95;
    pg.push();
    pg.translate(wx, wy);
    pg.rotate(-0.45 + whalePhase * 0.9);
    pg.fill(24, 82, 138, 235);
    pg.stroke(255, 218, 78);
    pg.strokeWeight(2.2);
    pg.beginShape();
    pg.vertex(-42, 0);
    pg.quadraticVertex(0, -26, 46, -4);
    pg.quadraticVertex(0, 14, -42, 0);
    pg.endShape(pg.CLOSE);
    pg.triangle(-40, 0, -58, -14, -54, 12);
    pg.pop();

    const ships = [
      { x: 65,  y: -38, sc: 1.08, phase: 0.0 },
      { x: 285, y: -52, sc: 0.78, phase: 2.1 },
    ];
    ships.forEach((sh, sIdx) => {
      const pitch = Math.sin(t * 2.8 + sh.phase) * 0.06;
      const heave = Math.cos(t * 2.8 + sh.phase) * 7;
      pg.push();
      pg.translate(sh.x, sh.y + heave);
      pg.scale(sh.sc);
      pg.rotate(pitch);

      pg.fill(104, 58, 26);
      pg.stroke(255, 212, 88);
      pg.strokeWeight(2.4);
      pg.beginShape();
      pg.vertex(-115, 0);
      pg.vertex(115, 0);
      pg.vertex(138, -36);
      pg.vertex(78, -32);
      pg.vertex(-68, -32);
      pg.vertex(-128, -58);
      pg.endShape(pg.CLOSE);
      pg.fill(255, 224, 98);
      pg.ellipse(-122, -64, 12, 14);
      for (let c = -52; c <= 52; c += 26) {
        pg.fill(32, 20, 12);
        pg.rect(c - 5, -20, 10, 8, 1);
      }
      pg.stroke(88, 48, 22);
      pg.strokeWeight(3.6);
      pg.line(115, -28, 168, -58);

      const masts = [
        { mx: -62, mh: 112, sw: 52, sh: 64 },
        { mx: 6,   mh: 148, sw: 74, sh: 88 },
        { mx: 74,  mh: 118, sw: 56, sh: 68 },
      ];
      masts.forEach((m, mIdx) => {
        pg.stroke(78, 44, 20);
        pg.strokeWeight(3.4);
        pg.line(m.mx, -32, m.mx, -32 - m.mh);
        pg.stroke(218, 188, 132, 165);
        pg.strokeWeight(1.2);
        pg.line(m.mx, -32 - m.mh, m.mx - 28, -32);
        pg.line(m.mx, -32 - m.mh, m.mx + 28, -32);

        // Multi-Segment Sine-Wave + Perlin Gust Billowing Main Sail!
        const topY = -48 - m.sh;
        const botY = -48;
        const sailSegs = 8;
        pg.fill(252, 246, 232);
        pg.stroke(168, 132, 78);
        pg.strokeWeight(2.0);
        pg.beginShape();
        for (let i = 0; i <= sailSegs; i++) {
          const v = i / sailSegs;
          const sy = topY + v * m.sh;
          const billow = Math.sin(v * Math.PI) * (m.sw * 0.22 + Math.sin(t * 7.5 + mIdx + v * 3) * 5.5);
          pg.vertex(m.mx - m.sw * 0.5 + billow * 0.45, sy);
        }
        for (let i = sailSegs; i >= 0; i--) {
          const v = i / sailSegs;
          const sy = topY + v * m.sh;
          const billow = Math.sin(v * Math.PI) * (m.sw * 0.28 + Math.sin(t * 7.5 + mIdx + v * 3) * 6.5);
          pg.vertex(m.mx + m.sw * 0.5 + billow, sy);
        }
        pg.endShape(pg.CLOSE);

        const midBillow = m.sw * 0.16 + Math.sin(t * 7.5 + mIdx + 1.5) * 4.5;
        const cxSail = m.mx + midBillow;
        const cySail = -48 - m.sh * 0.5;
        pg.stroke(212, 38, 32);
        pg.strokeWeight(mIdx === 1 ? 5.2 : 3.8);
        pg.line(cxSail, cySail - m.sh * 0.26, cxSail, cySail + m.sh * 0.26);
        pg.line(cxSail - m.sw * 0.24, cySail, cxSail + m.sw * 0.24, cySail);

        // Multi-Segment Sine-Wave + Perlin Gust Masthead Pennant Flag ("猎猎翻卷桅杆长三角旗")!
        drawWindWavingBanner(m.mx, -32 - m.mh, 44 + (mIdx === 1 ? 14 : 0), 13, 2, [228, 38, 32], [255, 214, 58], [228, 38, 32], sIdx * 2.0 + mIdx * 1.3);
      });
      pg.pop();
    });

    pg.fill(38, 136, 198, 225);
    pg.stroke(245, 252, 255, 235);
    pg.strokeWeight(2.6);
    pg.beginShape();
    pg.vertex(-420, 28);
    for (let x = -420; x <= 460; x += 24) {
      const wy = -8 + Math.sin(x * 0.032 - t * 4.8) * 16;
      pg.vertex(x, wy);
    }
    pg.vertex(460, 28);
    pg.endShape(pg.CLOSE);

    pg.pop();
  },

  /**
   * ERA 09 MASTERPIECE V6.0: HIGH-DENSITY VAN GOGH "STARRY NIGHT" IMPASTO FLOW-FIELD,
   * LEFT TWISTED BLACK-FLAME CYPRESS, RIGHT SAINT-RÉMY SPIRE CHURCH & PAINTERLY CLOCKWORK ORRERY
   */
  drawVictorianSteamBridgeAndVanGoghSky(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    const vgPalette = [
      [255, 224, 68],  // Chrome Yellow
      [255, 246, 158], // Zinc White-Yellow
      [78, 156, 248],  // Cobalt Blue
      [38, 88, 198],   // Ultramarine Blue
      [18, 48, 122],   // Prussian Blue
      [112, 218, 196], // Emerald Impasto
    ];

    // =========================================================================
    // LAYER A: HIGH-DENSITY VAN GOGH IMPASTO FLOW-FIELD SKY & ROLLING ALPILLE HILLS!
    // =========================================================================
    pg.push();
    pg.translate(0, -235);

    // Dense S-Curve Flow-Field Palette-Knife Impasto Streams spanning the entire sky!
    pg.noFill();
    for (let stream = 0; stream < 9; stream++) {
      const baseYStream = -105 + stream * 26;
      for (let sx = -390; sx <= 390; sx += 22) {
        const flowWave = Math.sin(sx * 0.015 + stream * 0.55 + t * 1.4) * 28
                       + Math.cos(sx * 0.028 - stream * 0.4) * 14;
        const slope = Math.cos(sx * 0.015 + stream * 0.55 + t * 1.4) * 0.42;
        const col = vgPalette[(Math.abs(Math.floor(sx / 22)) + stream) % vgPalette.length];
        pg.push();
        pg.translate(sx, baseYStream + flowWave);
        pg.rotate(slope);
        pg.stroke(col[0], col[1], col[2], 235);
        pg.strokeWeight(5.2);
        pg.line(-10, 0, 10, 0);
        pg.pop();
      }
    }

    const vortices = [
      { vx: -95, vy: -16, maxR: 116, dir: 1 },
      { vx: 115, vy: -28, maxR: 102, dir: -1 },
    ];
    vortices.forEach((v) => {
      pg.push();
      pg.translate(v.vx, v.vy);
      pg.rotate(t * 0.45 * v.dir);
      pg.noFill();
      pg.stroke(245, 196, 68, 195);
      pg.strokeWeight(3.0);
      pg.ellipse(0, 0, v.maxR * 1.45, v.maxR * 1.45);
      for (let g = 0; g < 16; g++) {
        const ga = (g / 16) * Math.PI * 2;
        pg.line(Math.cos(ga) * v.maxR * 0.62, Math.sin(ga) * v.maxR * 0.62, Math.cos(ga) * v.maxR * 0.82, Math.sin(ga) * v.maxR * 0.82);
      }
      pg.pop();

      pg.noFill();
      for (let ring = 16; ring <= v.maxR; ring += 11) {
        const numDashes = Math.floor(ring * 0.32);
        for (let d = 0; d < numDashes; d++) {
          const baseAng = (d / numDashes) * Math.PI * 2 + t * 0.55 * v.dir + ring * 0.025;
          const col = vgPalette[(d + Math.floor(ring)) % vgPalette.length];
          pg.stroke(col[0], col[1], col[2], 242);
          pg.strokeWeight(4.8);
          pg.arc(v.vx, v.vy, ring * 2.1, ring * 1.35, baseAng, baseAng + 0.30);
        }
      }
    });

    const rodOffX = Math.cos(t * 1.8) * 18;
    const rodOffY = Math.sin(t * 1.8) * 12;
    BrushKit.draw3DTube(pg, -95 + rodOffX, -16 + rodOffY, 115 - rodOffX, -28 - rodOffY, [188, 132, 48], [255, 224, 98], [28, 36, 64], 3.8);

    // 5 Blazing Clockwork Star-Gears & Glowing Crescent Moon
    const gearStars = [
      { x: -245, y: -58, r: 26, spd: 1.4, isMoon: false },
      { x: -165, y: -82, r: 20, spd: -1.8, isMoon: false },
      { x: -15,  y: -76, r: 24, spd: 1.2, isMoon: false },
      { x: 52,   y: -88, r: 19, spd: -1.6, isMoon: false },
      { x: 215,  y: -64, r: 38, spd: 0.9, isMoon: true },
    ];
    gearStars.forEach((st) => {
      pg.push();
      pg.translate(st.x, st.y);
      pg.noFill();
      for (let h = 1; h <= 3; h++) {
        const hr = st.r + h * 9;
        for (let k = 0; k < 8; k++) {
          const ka = (k / 8) * Math.PI * 2 + t * 0.4 * h;
          pg.stroke(h === 1 ? [255, 242, 128] : [255, 204, 52], 240 - h * 40);
          pg.strokeWeight(4.0);
          pg.arc(0, 0, hr * 2, hr * 2, ka, ka + 0.45);
        }
      }
      pg.rotate(t * st.spd);
      pg.fill(245, 192, 62);
      pg.stroke(68, 42, 14);
      pg.strokeWeight(1.8);
      pg.ellipse(0, 0, st.r * 1.3, st.r * 1.3);
      for (let g = 0; g < 10; g++) {
        const ga = (g / 10) * Math.PI * 2;
        pg.line(Math.cos(ga) * st.r * 0.55, Math.sin(ga) * st.r * 0.55, Math.cos(ga) * st.r * 0.85, Math.sin(ga) * st.r * 0.85);
      }
      if (st.isMoon) {
        pg.fill(255, 188, 38);
        pg.noStroke();
        pg.arc(0, 0, st.r * 1.7, st.r * 1.7, -Math.PI * 0.65, Math.PI * 0.65);
      }
      pg.pop();
    });

    // Periodic Table Cards inside Swirl
    const elements = [
      { sym: 'H',  num: '1',  x: -185, y: 28 },
      { sym: 'C',  num: '6',  x: -95,  y: -16 },
      { sym: 'O',  num: '8',  x: 115,  y: -28 },
      { sym: 'Fe', num: '26', x: 185,  y: 22 },
    ];
    elements.forEach((el, idx) => {
      const ey = el.y + Math.sin(t * 4 + idx) * 5;
      pg.fill(16, 36, 72, 232);
      pg.stroke(255, 224, 78);
      pg.strokeWeight(2.0);
      pg.rect(el.x - 18, ey - 20, 36, 40, 4);
      pg.noStroke();
      pg.fill(112, 255, 198);
      pg.textFont('monospace');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(9.5);
      pg.text(el.num, el.x, ey - 10);
      pg.fill(255, 234, 118);
      pg.textSize(14);
      pg.text(el.sym, el.x, ey + 6);
    });
    pg.pop();

    // =========================================================================
    // LAYER B: ROLLING IMPASTO ALPILLE HILLS & RIGHT-SIDE SAINT-RÉMY SPIRE CHURCH ("右侧圣雷米尖顶教堂与暖黄灯光村落")!
    // =========================================================================
    pg.fill(18, 42, 98, 238);
    pg.stroke(98, 178, 255);
    pg.strokeWeight(3.2);
    pg.beginShape();
    pg.vertex(-420, 0);
    for (let x = -420; x <= 420; x += 28) {
      const hy = -95 - Math.sin(x * 0.014 + 0.8) * 38 - Math.cos(x * 0.032) * 18;
      pg.vertex(x, hy);
    }
    pg.vertex(420, 0);
    pg.endShape(pg.CLOSE);
    // Impasto contour strokes on the rolling hills
    pg.noFill();
    for (let x = -380; x <= 380; x += 26) {
      const hy = -68 - Math.sin(x * 0.014 + 0.8) * 30;
      pg.stroke(x % 52 === 0 ? [255, 218, 68, 210] : [78, 156, 248, 210]);
      pg.strokeWeight(4.2);
      pg.arc(x, hy, 34, 18, -0.3, 0.9);
    }

    // RIGHT SIDE: SAINT-RÉMY SPIRE CHURCH & WARM YELLOW-LIT VILLAGE COTTAGES ("圣雷米尖顶教堂与暖黄灯光")!
    pg.push();
    pg.translate(275, -18);
    // Village cottages with glowing chrome-yellow windows
    [-64, -22, 36].forEach((vx, vIdx) => {
      pg.fill(26, 48, 96);
      pg.stroke(255, 218, 78);
      pg.strokeWeight(2.0);
      pg.rect(vx, -42 - vIdx * 4, 36, 42 + vIdx * 4, 2);
      pg.fill(42, 74, 138);
      pg.triangle(vx - 4, -42 - vIdx * 4, vx + 18, -62 - vIdx * 4, vx + 40, -42 - vIdx * 4);
      // Warm yellow-lit cottage windows
      pg.fill(255, 224, 58);
      pg.noStroke();
      pg.rect(vx + 8, -28, 8, 12, 1);
      pg.rect(vx + 20, -28, 8, 12, 1);
    });
    // Iconic Tall Saint-Rémy Church Nave, Bell Tower & Soaring Needle Spire piercing the Starry Sky!
    pg.fill(22, 42, 88);
    pg.stroke(255, 224, 88);
    pg.strokeWeight(2.4);
    pg.rect(-14, -96, 28, 96, 2);
    // Soaring gothic needle spire
    pg.fill(32, 64, 128);
    pg.triangle(-16, -96, 0, -208, 16, -96);
    // Glowing golden church clock & lancet windows
    pg.fill(255, 232, 68);
    pg.noStroke();
    pg.ellipse(0, -80, 12, 12);
    pg.rect(-5, -58, 10, 22, 4);
    pg.pop();

    // =========================================================================
    // LAYER C: LEFT-SIDE TOWERING BLACK-FLAME TWISTED CYPRESS TREE ("左侧高耸黑色火焰状扭曲柏树")!
    // =========================================================================
    pg.push();
    pg.translate(-295, 10);
    for (let b = 0; b < 7; b++) {
      const bx = (b - 3) * 9.5;
      const bh = 285 - Math.abs(b - 3) * 34;
      pg.noFill();
      pg.stroke(b % 2 === 0 ? [12, 26, 22] : (b === 3 ? [228, 184, 52] : [28, 64, 42]));
      pg.strokeWeight(11.0 - Math.abs(b - 3) * 1.3);
      pg.beginShape();
      for (let y = 0; y >= -bh; y -= 22) {
        const wave = Math.sin(y * 0.038 + t * 2.5 + b) * 14;
        pg.vertex(bx + wave, y);
      }
      pg.endShape();
    }
    pg.pop();

    // =========================================================================
    // LAYER D: PAINTERLY IMPASTO VIADUCT & STEAM LOCOMOTIVE WITH IMPASTO SMOKE SWIRLS!
    // =========================================================================
    pg.fill(34, 52, 102);
    pg.stroke(255, 214, 68);
    pg.strokeWeight(2.6);
    pg.rect(-340, -106, 680, 24);
    for (let a = -260; a <= 260; a += 104) {
      pg.fill(34, 52, 102);
      pg.stroke(255, 214, 68);
      pg.rect(a - 18, -82, 36, 82);
      pg.stroke(98, 178, 255);
      pg.strokeWeight(3.6);
      pg.line(a - 10, -72, a - 10, -14);
      pg.stroke(255, 224, 72);
      pg.line(a + 10, -68, a + 10, -18);
      pg.push();
      pg.translate(a + 52, -52);
      pg.rotate(t * (a % 208 === 0 ? 1.2 : -1.2));
      pg.noFill();
      pg.stroke(245, 192, 58, 210);
      pg.strokeWeight(2.6);
      pg.ellipse(0, 0, 48, 48);
      for (let k = 0; k < 8; k++) {
        const ka = (k / 8) * Math.PI * 2;
        pg.line(0, 0, Math.cos(ka) * 26, Math.sin(ka) * 26);
      }
      pg.pop();
    }

    const trainX = ((t * 98) % 520) - 240;
    pg.push();
    pg.translate(trainX, -106);
    pg.fill(28, 52, 112);
    pg.stroke(255, 224, 68);
    pg.strokeWeight(2.8);
    pg.rect(-56, -34, 88, 26, 4);
    pg.rect(-60, -52, 28, 44, 2);
    pg.rect(14, -56, 12, 22, 2);
    pg.fill(255, 196, 42);
    pg.ellipse(-44, -30, 14, 14);
    [-40, -14, 14].forEach((wx) => {
      pg.fill(255, 208, 58);
      pg.ellipse(wx, -6, 17, 17);
    });
    for (let p = 0; p < 9; p++) {
      const px = 18 - p * 22;
      const py = -66 - p * 17 + Math.sin(t * 7 + p) * 7;
      pg.noFill();
      pg.stroke(p % 2 === 0 ? [255, 228, 68, 245] : [88, 178, 255, 245]);
      pg.strokeWeight(5.0);
      pg.arc(px, py, 26 + p * 8, 18 + p * 6, t * 3 + p, t * 3 + p + 2.2);
    }
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 10 MASTERPIECE V4.3: LONDON-TO-NEW-YORK TRANSATLANTIC HARBOR, GIANT N/S HORSESHOE MAGNET & FARADAY DYNAMO,
   * SS GREAT EASTERN CABLE SHIP, SUBSEA TELEGRAPH CABLE & STRICTLY AUTO-FITTED MAXWELL BOARD (ZERO TEXT OVERFLOW!)
   */
  drawFaradayHarborAndGreatEastern(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // =========================================================================
    // LAYER A: STRICTLY AUTO-FITTED ROYAL SOCIETY MAXWELL ELECTROMAGNETIC BOARD (100% ZERO TEXT OVERFLOW!)
    // =========================================================================
    pg.push();
    pg.translate(0, -220);
    const line1 = '⚡ FARADAY (1831) 磁生电 ➔ MAXWELL (1873) 电磁波';
    const line2 = '蓝线: 电场 E  |  金线: 磁场 B  |  光速 c = 1/√(μ₀ε₀)';
    pg.textFont('serif');
    pg.textSize(11.5);
    const tw1 = pg.textWidth(line1);
    pg.textSize(10.5);
    const tw2 = pg.textWidth(line2);
    const textColW = Math.max(tw1, tw2) + 28;
    const waveColW = 170;
    const boardW = waveColW + textColW + 24;
    const boardLeft = -boardW * 0.5;

    pg.fill(10, 24, 42, 232);
    pg.stroke(242, 188, 82);
    pg.strokeWeight(2.4);
    pg.rect(boardLeft, -34, boardW, 62, 6);

    // Left compartment inside board: Orthogonal E (Cyan) and B (Gold) Wave Diagram
    const wStart = boardLeft + 16;
    const wEnd = wStart + waveColW - 16;
    pg.noFill();
    pg.stroke(88, 242, 255);
    pg.strokeWeight(2.2);
    pg.beginShape();
    for (let x = wStart; x <= wEnd; x += 10) {
      const y = Math.sin((x - wStart) * 0.055 - t * 6.5) * 16;
      pg.vertex(x, y - 3);
    }
    pg.endShape();
    pg.stroke(255, 196, 68);
    pg.strokeWeight(2.0);
    pg.beginShape();
    for (let x = wStart; x <= wEnd; x += 10) {
      const z = Math.cos((x - wStart) * 0.055 - t * 6.5) * 12;
      pg.vertex(x + z * 0.45, z * 0.42 - 3);
    }
    pg.endShape();

    // Divider line inside board
    const divX = boardLeft + waveColW + 6;
    pg.stroke(242, 188, 82, 120);
    pg.strokeWeight(1.2);
    pg.line(divX, -26, divX, 20);

    // Right compartment inside board: Centered & Strictly Contained Text!
    const textCenterX = divX + (boardW - waveColW - 6) * 0.5;
    pg.noStroke();
    pg.fill(255, 232, 128);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(11.5);
    pg.text(line1, textCenterX, -13);
    pg.fill(118, 252, 255);
    pg.textSize(10.5);
    pg.text(line2, textCenterX, 10);
    pg.pop();

    // =========================================================================
    // LAYER B: LEFT SHORE — LONDON BIG BEN & ROYAL INSTITUTION TELEGRAPH STATION
    // =========================================================================
    pg.push();
    pg.translate(-305, 0);
    pg.fill(68, 78, 96);
    pg.stroke(228, 188, 96);
    pg.strokeWeight(1.8);
    pg.rect(-55, -88, 110, 88);
    pg.fill(82, 92, 112);
    pg.rect(-24, -195, 48, 195);
    pg.fill(42, 54, 72);
    pg.triangle(-28, -195, 0, -248, 28, -195);
    pg.fill(255, 236, 138);
    pg.stroke(42, 32, 18);
    pg.ellipse(0, -168, 30, 30);
    pg.line(0, -168, 0, -179);
    pg.line(0, -168, 8, -168);
    // Auto-fitted label plaque
    pg.textFont('monospace');
    pg.textSize(10.0);
    const lTxt = 'LONDON TX · 1866';
    const lw = pg.textWidth(lTxt) + 18;
    pg.fill(18, 32, 52);
    pg.stroke(88, 242, 255);
    pg.rect(-lw * 0.5, -52, lw, 20, 3);
    pg.noStroke();
    pg.fill(118, 252, 255);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.text(lTxt, 0, -42);
    pg.pop();

    // =========================================================================
    // LAYER C: CENTER-LEFT — GIANT RED/BLUE "N/S" HORSESHOE MAGNET & FARADAY SPINNING COPPER DISK DYNAMO!
    // =========================================================================
    pg.push();
    pg.translate(-125, 0);
    pg.fill(42, 52, 66);
    pg.stroke(238, 188, 88);
    pg.strokeWeight(2.0);
    pg.rect(-58, -28, 116, 28, 3);
    pg.noFill();
    pg.stroke(92, 104, 124);
    pg.strokeWeight(18);
    pg.arc(0, -96, 84, 88, Math.PI, Math.PI * 2);
    pg.fill(228, 48, 42);
    pg.stroke(255, 224, 118);
    pg.strokeWeight(2.0);
    pg.rect(-51, -98, 20, 70, 2);
    pg.fill(38, 108, 228);
    pg.rect(31, -98, 20, 70, 2);
    pg.noStroke();
    pg.fill(255, 255, 255);
    pg.textFont('Georgia, serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(13);
    pg.text('N', -41, -64);
    pg.text('S', 41, -64);

    for (let fl = -82; fl <= -42; fl += 13) {
      pg.stroke(88, 248, 255, 210);
      pg.strokeWeight(1.8);
      pg.line(-30, fl, 30, fl);
    }

    pg.push();
    pg.translate(0, -64);
    pg.rotate(t * 3.2);
    pg.fill(228, 128, 54, 235);
    pg.stroke(255, 224, 118);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 0, 52, 52);
    for (let r = 0; r < 6; r++) {
      const a = (r / 6) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * 24, Math.sin(a) * 24);
    }
    pg.pop();

    pg.stroke(118, 252, 255);
    pg.strokeWeight(2.4);
    pg.line(0, -28, 72, -135);
    pg.stroke(68, 82, 98);
    pg.strokeWeight(3.5);
    pg.line(72, 0, 72, -135);
    pg.noStroke();
    pg.fill(255, 248, 168, 235);
    pg.ellipse(72, -140, 18 + Math.sin(t * 16) * 4, 18 + Math.sin(t * 16) * 4);
    pg.fill(118, 252, 255, 95);
    pg.ellipse(72, -140, 42, 42);
    pg.pop();

    // =========================================================================
    // LAYER D: RIGHT SHORE & SEA — NEW YORK BROOKLYN SUSPENSION BRIDGE, SS GREAT EASTERN & SUBSEA CABLE CUTAWAY!
    // =========================================================================
    pg.push();
    pg.translate(155, 0);
    [-135, 145].forEach((tx) => {
      pg.fill(128, 122, 114);
      pg.stroke(228, 196, 118);
      pg.strokeWeight(1.8);
      pg.rect(tx - 22, -182, 44, 182, 2);
      pg.fill(18, 32, 54);
      pg.arc(tx - 8, -115, 12, 36, Math.PI, Math.PI * 2);
      pg.arc(tx + 8, -115, 12, 36, Math.PI, Math.PI * 2);
    });
    pg.noFill();
    pg.stroke(245, 208, 96);
    pg.strokeWeight(3.0);
    pg.bezier(-135, -172, -35, -52, 45, -52, 145, -172);
    pg.stroke(168, 204, 235, 165);
    pg.strokeWeight(1.2);
    for (let sx = -115; sx <= 125; sx += 24) {
      const u = (sx + 135) / 280;
      const cy = -172 + 4 * u * (1 - u) * 90;
      pg.line(sx, cy, sx, -38);
    }

    // Surprise Cross-Ocean Tesla/Faraday Resonance Arc linking London (-460) -> Faraday Dynamo (-280) -> Brooklyn Bridge (145)!
    if (Math.sin(t * 6.0) > 0.35) {
      pg.noFill();
      pg.stroke(118, 252, 255, 195);
      pg.strokeWeight(2.2);
      pg.beginShape();
      for (let k = 0; k <= 12; k++) {
        const u = k / 12;
        const ax = -280 + u * 425;
        const ay = -140 - Math.sin(u * Math.PI) * 55 + Math.sin(u * 24 + t * 35) * 6;
        pg.vertex(ax, ay);
      }
      pg.endShape();
    }

    pg.push();
    pg.translate(5, -24 + Math.sin(t * 2.5) * 4);
    pg.fill(34, 44, 58);
    pg.stroke(98, 242, 255);
    pg.strokeWeight(2.2);
    pg.quad(-110, 0, 110, 0, 132, -32, -126, -32);
    pg.fill(198, 98, 42);
    pg.rect(-42, -68, 14, 36);
    pg.rect(28, -68, 14, 36);
    pg.fill(238, 142, 58);
    pg.arc(0, -10, 52, 52, Math.PI, Math.PI * 2);
    pg.noStroke();
    pg.fill(255, 232, 128);
    pg.textFont('Georgia, serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(9.5);
    pg.text('SS GREAT EASTERN · 1866', 0, -18);
    pg.pop();

    pg.fill(12, 38, 68, 215);
    pg.stroke(88, 242, 255);
    pg.strokeWeight(1.8);
    pg.rect(-445, 2, 620, 26, 4);
    pg.stroke(238, 138, 58);
    pg.strokeWeight(5.0);
    pg.line(-435, 15, 165, 15);
    for (let p = 0; p < 8; p++) {
      const px = -425 + ((p * 74 + t * 180) % 580);
      pg.fill(118, 255, 255);
      pg.noStroke();
      pg.rect(px, 12, p % 2 === 0 ? 16 : 6, 6, 3);
    }
    pg.pop();

    pg.pop();
  },

    /**
   * 3D GAUSSIAN SPLATTING · VONNEGUT "4D SPACETIME CENTIPEDE" ENGINE
   * ("把视频逐帧转成3D高斯点云，再按时间和位置全摆进同一个空间。结果就是，整段视频的每个瞬间同时摆在你眼前，时间变成了一条能看见的轨迹。
   *  冯内古特说人是巨大的千足虫……高维生物一眼看过去，是我从出生到现在拖着的一整条尾巴。")
   */
  draw3DGaussianSpacetimeCentipede(pg, state, rig, W, H) {
    const { t } = state;
    pg.push();

    // =========================================================================
    // V6.0 TRUE 3D GAUSSIAN SPLATTING · 16 DISCRETE RAZOR-SHARP SOLID SCULPTURES!
    // ("彻底删除模糊残影！沿三维空间 S 型轨迹陈列 16 尊完全凝固、锐利清晰的 3D 高斯点云实体雕塑。
    //   每一尊雕塑都用高密度彩色高斯粒子精准定格那一帧的车架、多普勒车把、辐条角度、鹈鹕展翅高度与猫咪拉琴手势！")
    // =========================================================================
    const numSculptures = 16;
    const startX = 62;
    const endX = rig.centerX - 36;

    // 1. Curved 3D S-Shaped Minkowski Worldline Ribbon & Discrete Frame Pedestal Rings
    pg.noFill();
    for (let band = -1; band <= 1; band++) {
      pg.stroke(band === 0 ? [255, 228, 118, 225] : [98, 232, 255, 155]);
      pg.strokeWeight(band === 0 ? 2.8 : 1.4);
      pg.beginShape();
      for (let i = 0; i <= 32; i++) {
        const u = i / 32;
        const wx = startX + (endX - startX) * u;
        const sCurveY = 195 + (rig.groundY - 78 - 195) * Math.pow(u, 0.82) + Math.sin(u * Math.PI * 2.2) * 42;
        pg.vertex(wx, sCurveY + band * (14 + u * 24));
      }
      pg.endShape();
    }

    const sculpturePalettes = [
      [255, 178, 72],  // Ochre Gold
      [88, 248, 212],  // Shang Turquoise
      [255, 128, 168], // Tang Cinnabar
      [168, 245, 224], // Song Celadon
      [88, 182, 255],  // Ming Cobalt
      [255, 228, 68],  // Starry Chrome
      [212, 148, 255], // Tesla Violet
      [118, 252, 255], // Relativistic Cyan
    ];

    const milestoneTags = {
      1:  'Frame #01 · t-3.0s',
      5:  'Frame #05 · t-2.2s',
      9:  'Frame #09 · t-1.4s',
      13: 'Frame #13 · t-0.6s',
      16: 'Frame #16 · t-0.1s',
    };

    // Helper: Render a Crisp High-Density 3D Gaussian Particle Chain between two points (Zero Blur!)
    const drawGaussianParticleRod = (x1, y1, x2, y2, count, pSize, colRGB) => {
      for (let k = 0; k <= count; k++) {
        const v = k / count;
        const px = x1 + (x2 - x1) * v;
        const py = y1 + (y2 - y1) * v;
        pg.fill(colRGB[0], colRGB[1], colRGB[2], 245);
        pg.ellipse(px, py, pSize, pSize * 0.85);
        pg.fill(255, 254, 240, 255);
        pg.ellipse(px, py, pSize * 0.42, pSize * 0.42);
      }
    };

    // 2. Render all 16 Frozen Discrete 3D Gaussian Point-Cloud Sculptures Simultaneously!
    for (let i = 1; i <= numSculptures; i++) {
      const u = i / numSculptures;
      // Strictly quantized frozen timestamp for Sculpture #i so its pose is 100% frozen in space-time!
      const frozenCrank = i * 0.58;
      const sc = 0.24 + 0.56 * Math.pow(u, 0.88);
      const sx = startX + (endX - startX) * u;
      const sy = 195 + (rig.groundY - 78 - 195) * Math.pow(u, 0.82) + Math.sin(u * Math.PI * 2.2) * 42;
      const col = sculpturePalettes[i % sculpturePalettes.length];

      pg.push();
      pg.translate(sx, sy);
      pg.scale(sc);
      pg.noStroke();

      // (A) Frozen Rear & Front Wheels made of discrete 3D Gaussian Ring Particles + Frozen Spoke Angles!
      [-74, 76].forEach((wx, wIdx) => {
        const wr = 36;
        const rimCol = wIdx === 1 ? [98, 242, 255] : [255, 138, 78];
        for (let p = 0; p < 16; p++) {
          const a = (p / 16) * Math.PI * 2 + frozenCrank;
          const rx = wx + Math.cos(a) * wr;
          const ry = 18 + Math.sin(a) * wr;
          pg.fill(rimCol[0], rimCol[1], rimCol[2], 248);
          pg.ellipse(rx, ry, 5.2, 5.2);
          pg.fill(255, 255, 255, 255);
          pg.ellipse(rx, ry, 2.2, 2.2);
        }
        // 4 Frozen Spoke Particle Chains at exact frozenCrank angle
        for (let sp = 0; sp < 4; sp++) {
          const sa = frozenCrank + (sp / 4) * Math.PI * 2;
          drawGaussianParticleRod(wx, 18, wx + Math.cos(sa) * wr, 18 + Math.sin(sa) * wr, 5, 3.6, col);
        }
      });

      // (B) Frozen Diamond Bike Frame & Stem made of Crisp 3D Gaussian Particles
      drawGaussianParticleRod(-74, 18, -4, 18, 8, 4.5, col);
      drawGaussianParticleRod(-4, 18, -36, -54, 7, 4.5, col);
      drawGaussianParticleRod(-36, -54, 48, -64, 9, 4.5, col);
      drawGaussianParticleRod(-4, 18, 48, -64, 8, 4.5, col);
      drawGaussianParticleRod(48, -64, 76, 18, 8, 4.5, col);
      drawGaussianParticleRod(48, -64, 42, -82, 4, 4.8, [255, 238, 118]);

      // (C) Frozen Doppler Redshift/Blueshift Handlebar on every single 3DGS Sculpture!
      drawGaussianParticleRod(28, -80, 42, -84, 4, 5.5, [255, 108, 58]);
      drawGaussianParticleRod(42, -84, 58, -78, 4, 5.5, [88, 242, 255]);

      // (D) Frozen Pelican Torso, Neck, Beak, Pedaling Leg & Exact Wing-Flap Posture
      const frozenWingY = -98 + Math.sin(frozenCrank * 2.0) * 26;
      const frozenPedalX = -4 + Math.cos(frozenCrank) * 18;
      const frozenPedalY = 18 + Math.sin(frozenCrank) * 18;
      drawGaussianParticleRod(-24, -64, frozenPedalX, frozenPedalY, 7, 4.6, [255, 218, 98]);
      drawGaussianParticleRod(-24, -68, 12, -86, 7, 7.5, col);
      drawGaussianParticleRod(6, -84, 42, -82, 6, 4.8, [255, 245, 198]); // Wing locked to handlebar
      drawGaussianParticleRod(2, -84, -18, frozenWingY, 6, 5.5, [118, 252, 255]); // Frozen wing-tip elevation
      drawGaussianParticleRod(12, -86, 26, -124, 6, 5.2, col);
      drawGaussianParticleRod(26, -124, 68, -122, 6, 4.8, [255, 198, 72]);

      // (E) Frozen Schrödinger's Cat & Violin Bow Posture on Rear Rack
      const bowY = -58 + Math.cos(frozenCrank * 2.0) * 12;
      drawGaussianParticleRod(-82, -26, -78, -56, 5, 6.2, col);
      drawGaussianParticleRod(-78, -46, -58, bowY, 4, 3.8, [255, 232, 118]);

      if (milestoneTags[i]) {
        pg.textFont('monospace');
        pg.textSize(11.5);
        const lbl = milestoneTags[i];
        const lw = pg.textWidth(lbl) + 14;
        pg.fill(10, 16, 30, 235);
        pg.stroke(col[0], col[1], col[2], 240);
        pg.strokeWeight(1.5);
        pg.rect(-lw * 0.5, -162, lw, 20, 4);
        pg.noStroke();
        pg.fill(255, 245, 198);
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.text(lbl, 0, -152);
      }

      pg.pop();
    }

    pg.pop();
  },

  /**
   * ERA 11 MASTERPIECE V6.0: NIKOLA TESLA AC WAR × 1982 CCTV "JOURNEY TO THE WEST: HAVOC IN HEAVEN" (82版《西游记》大闹天宫光学激光、干冰七彩仙雾与凌霄宝殿金光)
   */
  drawTeslaNiagaraAndWardenclyffe(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. 1982 CCTV "JOURNEY TO THE WEST" LINGXIAO HALL SOUTHERN HEAVEN GATE IN THE UPPER THUNDERCLOUDS ("凌霄宝殿南天门琉璃金光")!
    pg.push();
    pg.translate(165, -245);
    // Golden glazed aura behind Nantianmen
    pg.noStroke();
    pg.fill(255, 212, 68, 78 + Math.sin(t * 6) * 24);
    pg.ellipse(0, -10, 220, 110);
    // Twin Crimson-Gold Dragon Pillars & Upturned Glazed Golden Roof of Southern Heaven Gate
    [-58, 58].forEach((px) => {
      pg.fill(198, 38, 32);
      pg.stroke(255, 224, 78);
      pg.strokeWeight(2.2);
      pg.rect(px - 9, -56, 18, 68, 2);
    });
    pg.fill(255, 204, 48);
    pg.stroke(168, 38, 28);
    pg.strokeWeight(2.4);
    pg.quad(-88, -52, 88, -52, 72, -74, -72, -74);
    pg.fill(188, 28, 28);
    pg.rect(-32, -66, 64, 16, 2);
    pg.noStroke();
    pg.fill(255, 238, 128);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(10.5);
    pg.text('南天门 · 1000kV', 0, -58);
    pg.pop();

    // 2. Left Side: Niagara Falls Cascading Water & Westinghouse AC Hydro-Electric Turbine Cutaway!
    pg.push();
    pg.translate(-255, 0);
    pg.fill(38, 48, 72);
    pg.stroke(168, 196, 255);
    pg.strokeWeight(2.0);
    pg.rect(-115, -165, 210, 165, 4);
    for (let w = -95; w <= 5; w += 20) {
      pg.stroke(138, 228, 255, 210);
      pg.strokeWeight(12);
      const dropOff = ((t * 120 + w * 3) % 24);
      pg.line(w, -160, w - 6, -12 + dropOff * 0.2);
    }
    pg.push();
    pg.translate(52, -78);
    pg.rotate(t * 3.8);
    pg.noFill();
    pg.stroke(255, 208, 78);
    pg.strokeWeight(2.6);
    pg.ellipse(0, 0, 58, 58);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      pg.line(0, 0, Math.cos(a) * 28, Math.sin(a) * 28);
    }
    pg.pop();
    pg.pop();

    // 3. Center: Nikola Tesla Wardenclyffe Wireless Transmission Tower Shooting Retro 1982 "Havoc in Heaven" Optical Lasers!
    pg.push();
    pg.translate(-15, 0);
    pg.stroke(188, 148, 255);
    pg.strokeWeight(2.6);
    pg.line(-56, 0, -18, -195);
    pg.line(56, 0, 18, -195);
    for (let y = -32; y >= -185; y -= 32) {
      const hw = 56 * (1 - (-y / 215));
      pg.line(-hw, y, hw, y);
      pg.line(-hw, y, hw * 0.8, y - 32);
      pg.line(hw, y, -hw * 0.8, y - 32);
    }
    pg.stroke(245, 168, 78);
    pg.strokeWeight(5.0);
    pg.line(0, 0, 0, -215);
    pg.fill(198, 168, 255);
    pg.stroke(255, 245, 255);
    pg.strokeWeight(2.6);
    pg.ellipse(0, -222, 118, 48);

    // 1982 CCTV "Journey to the West" Retro Film Optical Laser Beams (Red-Magenta, Cyan-Blue, Golden-Yellow Jagged Cel Lasers)!
    const laserCols = [
      [255, 58, 198],  // 82-Xiyou Neon Magenta Optical Laser
      [78, 252, 255],  // 82-Xiyou Electric Cyan Optical Laser
      [255, 232, 68],  // 82-Xiyou Golden Cel Laser
      [188, 118, 255], // Tesla Violet Plasma
      [98, 255, 168],  // Jade Immortal Beam
    ];
    pg.noFill();
    for (let b = 0; b < 5; b++) {
      const baseAng = -Math.PI * 0.92 + b * 0.46;
      const lc = laserCols[b];
      pg.stroke(lc[0], lc[1], lc[2], 245);
      pg.strokeWeight(3.6);
      pg.beginShape();
      let lx = Math.cos(baseAng) * 48;
      let ly = -222 + Math.sin(baseAng) * 20;
      pg.vertex(lx, ly);
      for (let seg = 1; seg <= 5; seg++) {
        lx += Math.cos(baseAng) * 38 + Math.sin(t * 38 + b * 7 + seg * 13) * 20;
        ly += Math.sin(baseAng) * 24 + Math.cos(t * 32 + b * 11 + seg * 5) * 15;
        pg.vertex(lx, ly);
      }
      pg.endShape();
    }
    pg.pop();

    // 4. VERTICAL SKY-ASCENT MILLION-VOLT LIGHTNING CLOUD BRIDGE ("顺百万伏特闪电如踩筋斗云般从瀑布深渊直冲雷云苍穹")!
    pg.noFill();
    for (let pass = 0; pass < 2; pass++) {
      pg.stroke(pass === 0 ? [255, 224, 78, 220] : [138, 248, 255, 245]);
      pg.strokeWeight(pass === 0 ? 7.5 : 3.2);
      pg.beginShape();
      for (let k = 0; k <= 14; k++) {
        const u = k / 14;
        const bx = -240 + u * 480;
        const by = -18 - u * 185 + Math.sin(u * 22 - t * 28) * 10;
        pg.vertex(bx, by);
      }
      pg.endShape();
    }

    // 5. Rolling 1982-Style Dry-Ice 7-Color Celestial Mist ("82版《西游记》翻滚干冰七彩仙雾")!
    const mistCols = [
      [255, 138, 218, 135],
      [118, 242, 255, 135],
      [255, 228, 118, 135],
      [188, 148, 255, 135],
    ];
    pg.noStroke();
    for (let m = 0; m < 8; m++) {
      const mx = -320 + m * 92 + Math.sin(t * 2.6 + m) * 24;
      const my = -16 - (m % 3) * 22 + Math.cos(t * 3.2 + m) * 8;
      pg.fill(...mistCols[m % mistCols.length]);
      pg.ellipse(mx, my, 128, 38);
      pg.fill(255, 255, 255, 95);
      pg.ellipse(mx, my - 4, 76, 22);
    }

    pg.pop();
  },

  /**
   * ERA 12 MASTERPIECE V6.0: EINSTEIN GRAVITATIONAL LENSING OBSERVATORY, BLACK HOLE ECLIPSE & SHAKESPEARE "HAMLET" THEATRICAL SPOTLIGHT
   */
  drawEinsteinObservatoryAnd4DCentipede(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Warped 4D Minkowski Spacetime Grid Funnel bending around the Gravitational-Lensing Black Hole!
    const bhX = 35, bhY = -215;
    pg.noFill();
    pg.stroke(88, 212, 255, 135);
    pg.strokeWeight(1.5);
    for (let gx = -380; gx <= 380; gx += 48) {
      pg.beginShape();
      for (let gy = -290; gy <= 0; gy += 24) {
        const dx = gx - bhX, dy = gy - bhY;
        const distSq = dx * dx + dy * dy + 1800;
        const pull = 32000 / distSq;
        pg.vertex(gx - (dx / Math.sqrt(distSq)) * pull, gy - (dy / Math.sqrt(distSq)) * pull);
      }
      pg.endShape();
    }

    // Relativistic Black Hole & 1919 Solar Eclipse Einstein Ring
    pg.push();
    pg.translate(bhX, bhY);
    pg.noFill();
    pg.stroke(255, 198, 72, 235);
    pg.strokeWeight(6.0);
    pg.ellipse(0, 0, 92, 92);
    pg.stroke(118, 242, 255, 220);
    pg.strokeWeight(3.2);
    pg.ellipse(0, 0, 138, 44);
    pg.fill(6, 8, 16);
    pg.noStroke();
    pg.ellipse(0, 0, 70, 70);
    pg.pop();

    // 2. SHAKESPEARE'S "HAMLET" THEATRICAL STAGE SPOTLIGHT & EXISTENTIAL SPACETIME SOLILOQUY ("《哈姆雷特》戏剧舞台追光与 To be, or not to be 叩问")!
    pg.noStroke();
    const spotSway = Math.sin(t * 1.4) * 28;
    pg.fill(255, 236, 148, 46);
    pg.triangle(bhX, bhY, -95 + spotSway, 12, 145 + spotSway, 12);
    pg.fill(255, 244, 188, 75);
    pg.ellipse(25 + spotSway, 6, 220, 26);

    // Royal Shakespeare Crimson-Gold Velvet Stage Drapes framing the Left & Right Cosmic Horizon!
    [-365, 365].forEach((dx, idx) => {
      const sign = idx === 0 ? 1 : -1;
      pg.fill(128, 18, 28, 215);
      pg.stroke(255, 214, 78);
      pg.strokeWeight(2.2);
      pg.beginShape();
      pg.vertex(dx, -295);
      pg.vertex(dx + sign * 64, -295);
      pg.quadraticVertex(dx + sign * 28, -145, dx + sign * 48, 0);
      pg.vertex(dx, 0);
      pg.endShape(pg.CLOSE);
    });

    // Hamlet Starlight Skull / Relativistic Clock Emblem & Soliloquy Banner
    pg.push();
    pg.translate(-195, -215 + Math.sin(t * 2.2) * 6);
    pg.fill(16, 22, 38, 230);
    pg.stroke(255, 224, 98);
    pg.strokeWeight(2.0);
    pg.rect(-118, -22, 236, 42, 6);
    pg.noStroke();
    pg.fill(255, 236, 138);
    pg.textFont('Georgia, serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(11.5);
    pg.text('"TO BE, OR NOT TO BE" · 哈姆雷特时空追光', 0, -8);
    pg.fill(138, 248, 255);
    pg.textSize(10.2);
    pg.text('16尊凝固3D高斯点云雕塑：过去与现在同时并存', 0, 10);
    pg.pop();

    // 3. Canadian Rockies Snow-Capped Peaks & Relativistic Astrophysical Dome Observatory on Right
    pg.fill(38, 54, 88, 210);
    pg.stroke(168, 214, 255);
    pg.strokeWeight(2.0);
    pg.triangle(-360, 0, -245, -185, -125, 0);
    pg.triangle(135, 0, 255, -205, 375, 0);
    pg.push();
    pg.translate(255, -115);
    pg.fill(238, 244, 255);
    pg.stroke(42, 64, 108);
    pg.strokeWeight(2.2);
    pg.rect(-48, -36, 96, 36, 2);
    pg.arc(0, -36, 96, 88, Math.PI, Math.PI * 2);
    pg.stroke(255, 214, 82);
    pg.strokeWeight(6.0);
    pg.line(-12, -56, -68, -96);
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 13 MASTERPIECE V6.0: DENSE GLOBAL OLYMPIC LANDMARKS (PARTHENON, COLOSSEUM, 2008 BIRD'S NEST, PARIS/LONDON CAULDRON,
   * 8-LANE TRACK, HURDLES & 100,000 CROWD) × "PLEASANT GOAT / GG BOND" HOT-BLOODED CARTOON ACTION!
   */
  drawModernOlympicStadiumAndDoves(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. DENSE GLOBAL OLYMPIC LANDMARK SKYLINE ("古希腊帕特农神庙 + 罗马斗兽场拱门 + 2008北京鸟巢编织钢架 + 巴黎/伦敦圣火台")!
    // (A) Left Horizon: Ancient Greek Parthenon Temple & Roman Colosseum Multi-Tiered Arches
    pg.push();
    pg.translate(-295, -92);
    pg.fill(245, 238, 220, 235);
    pg.stroke(168, 138, 88);
    pg.strokeWeight(1.8);
    pg.triangle(-68, -58, 0, -92, 68, -58);
    for (let c = -52; c <= 52; c += 26) {
      pg.rect(c - 5, -58, 10, 58);
    }
    // Roman Colosseum Arched Facade right beside Parthenon
    pg.fill(228, 198, 152, 238);
    pg.rect(76, -68, 96, 68, 3);
    pg.fill(42, 68, 112);
    for (let row = 0; row < 2; row++) {
      for (let a = 0; a < 4; a++) {
        pg.arc(90 + a * 22, -12 - row * 28, 12, 20, Math.PI, Math.PI * 2);
      }
    }
    pg.pop();

    // (B) Center Stadium Bowl: 2008 Beijing "Bird's Nest" Braided Steel Lattice Canopy & 100,000 Cheering Crowd Wave!
    pg.fill(238, 245, 255, 242);
    pg.stroke(28, 118, 218);
    pg.strokeWeight(2.8);
    pg.beginShape();
    pg.vertex(-375, 0);
    pg.quadraticVertex(-225, -168, 0, -118);
    pg.quadraticVertex(225, -168, 375, 0);
    pg.vertex(320, 0);
    pg.quadraticVertex(0, -76, -320, 0);
    pg.endShape(pg.CLOSE);
    // Intricate 2008 Beijing Bird's Nest crisscrossing braided steel trusses!
    pg.stroke(188, 204, 224, 215);
    pg.strokeWeight(2.0);
    for (let b = -310; b <= 310; b += 44) {
      pg.line(b, -12, b + 58, -112);
      pg.line(b + 58, -12, b, -112);
    }

    // 100,000 Cheering Spectator Crowd Wave inside the Stadium Tiers + Giant Scoreboard!
    for (let tier = 0; tier < 3; tier++) {
      const ty = -26 - tier * 18;
      for (let s = -275; s <= 275; s += 18) {
        const waveUp = Math.sin(s * 0.035 - t * 9.0 + tier) * 6;
        const shirtCols = [[255, 68, 68], [255, 218, 58], [58, 188, 255], [78, 238, 128]];
        pg.fill(...shirtCols[(Math.abs(s) + tier) % 4]);
        pg.noStroke();
        pg.ellipse(s, ty + waveUp, 8, 8);
      }
    }
    // Giant Stadium LED Scoreboard & High-Jump / Javelin Field Action!
    pg.fill(12, 22, 38, 242);
    pg.stroke(255, 218, 68);
    pg.strokeWeight(2.2);
    pg.rect(-108, -162, 216, 36, 4);
    pg.noStroke();
    pg.fill(98, 255, 158);
    pg.textFont('monospace');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(11.5);
    pg.text('🏆 OLYMPIC FINAL · WR 78.4 KM/H [NEW RECORD!]', 0, -144);

    // (C) Right Horizon: Paris Hot-Air Balloon Cauldron & Blazing Olympic Flame Tower
    pg.push();
    pg.translate(255, 0);
    pg.fill(228, 236, 248);
    pg.stroke(28, 118, 218);
    pg.quad(-24, 0, 24, 0, 12, -185, -36, -172);
    pg.noStroke();
    pg.fill(255, 128, 32, 235);
    pg.triangle(-32, -178, -8, -255 - Math.sin(t * 12) * 14, 14, -182);
    pg.fill(255, 228, 68, 245);
    pg.triangle(-22, -178, -8, -228 - Math.cos(t * 15) * 10, 6, -182);
    pg.pop();

    // (D) 8-Lane Red Tartan Running Track & Olympic Hurdle Frames along the Foreground!
    pg.fill(212, 58, 44, 235);
    pg.stroke(255, 255, 255, 210);
    pg.strokeWeight(1.4);
    pg.rect(-385, -6, 770, 32);
    for (let ln = 1; ln <= 4; ln++) {
      pg.line(-385, -6 + ln * 6.5, 385, -6 + ln * 6.5);
    }
    // Olympic Hurdles on the track
    [-210, -45, 135, 295].forEach((hx) => {
      pg.stroke(255, 255, 255);
      pg.strokeWeight(3.2);
      pg.line(hx - 12, 16, hx - 8, -18);
      pg.line(hx + 12, 16, hx + 8, -18);
      pg.stroke(28, 118, 218);
      pg.strokeWeight(4.5);
      pg.line(hx - 12, -18, hx + 12, -18);
    });

    // 2. Iconic Olympic Five Rings + "PLEASANT GOAT / GG BOND" (《喜羊羊与灰太狼》《猪猪侠》) HOT-BLOODED CARTOON ACTION LINES & COMIC BURSTS!
    pg.push();
    pg.translate(0, -225);
    const ringCols = [
      { x: -88, y: -8,  c: [0, 133, 199] },
      { x: 0,   y: -8,  c: [32, 32, 36] },
      { x: 88,  y: -8,  c: [223, 0, 36] },
      { x: -44, y: 22,  c: [244, 195, 0] },
      { x: 44,  y: 22,  c: [0, 159, 61] },
    ];
    pg.noFill();
    pg.strokeWeight(5.5);
    ringCols.forEach((r) => {
      pg.stroke(...r.c);
      pg.ellipse(r.x, r.y, 68, 68);
    });
    pg.pop();

    // Hot-Blooded Cartoon Starburst Badge ("猪猪侠超级棒棒糖 / 喜羊羊破风冲刺漫画爆炸星标")!
    pg.push();
    pg.translate(-225, -185 + Math.sin(t * 12) * 5);
    pg.fill(255, 232, 42);
    pg.stroke(238, 32, 32);
    pg.strokeWeight(2.8);
    pg.beginShape();
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const rad = (k % 2 === 0) ? 58 : 36;
      pg.vertex(Math.cos(a) * rad * 1.45, Math.sin(a) * rad * 0.72);
    }
    pg.endShape(pg.CLOSE);
    pg.noStroke();
    pg.fill(218, 18, 28);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(12.5);
    pg.text('💥 热血国漫破风冲刺!!', 0, 0);
    pg.pop();

    // High-Saturation Cartoon Speed Lines radiating across the track
    pg.stroke(255, 238, 68, 185);
    pg.strokeWeight(2.6);
    for (let s = 0; s < 10; s++) {
      const sy = -165 + s * 16;
      const sx = ((t * 480 + s * 97) % 680) - 340;
      pg.line(sx, sy, sx + 78, sy);
    }

    pg.pop();
  },

  /**
   * ERA 14 MASTERPIECE V6.0: SILICON VALLEY GARAGE × "GARDEN OF EDEN" GLOWING RAINBOW APPLE TREE
   * × "DREAM OF THE RED CHAMBER: GRANNY LIU IN CYBER GRAND VIEW GARDEN" (《红楼梦》刘姥姥逛赛博大观园芯片微距园林)
   */
  drawSiliconValleyGarageAnd8BitWeb(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // =========================================================================
    // 1. MACRO LEFT: SILICON VALLEY GARAGE & "GARDEN OF EDEN" TREE OF KNOWLEDGE ("《伊甸园》发光彩虹缺口智慧苹果树")!
    // =========================================================================
    pg.push();
    pg.translate(-235, 0);
    pg.fill(32, 54, 44);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(2.2);
    pg.rect(-125, -145, 235, 145, 4);
    pg.triangle(-138, -145, -8, -195, 122, -145);

    // Spinning Mainframe Magnetic Tape Waterwheels ("旋转磁带水车")
    [-78, -28].forEach((rx, idx) => {
      pg.push();
      pg.translate(rx, -86);
      pg.rotate(t * (idx === 0 ? 3.5 : -3.5));
      pg.fill(22, 34, 28);
      pg.stroke(118, 255, 168);
      pg.ellipse(0, 0, 38, 38);
      pg.line(-16, 0, 16, 0);
      pg.line(0, -16, 0, 16);
      pg.pop();
    });

    // Glowing "Garden of Eden" Tree of Knowledge of Good and Evil with Rainbow-Striped Bitten Apple!
    pg.push();
    pg.translate(48, 0);
    // Golden circuit trunk & canopy
    pg.stroke(218, 168, 68);
    pg.strokeWeight(7.0);
    pg.line(0, 0, 0, -128);
    pg.line(0, -92, -38, -142);
    pg.line(0, -98, 42, -148);
    pg.fill(18, 98, 54, 225);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(2.2);
    pg.ellipse(0, -158, 128, 78);
    // Glowing Rainbow Apple of Eden hanging at the center of the Tree!
    const ax = 6, ay = -132 + Math.sin(t * 4) * 3;
    const rbApple = [[98, 198, 72], [255, 218, 48], [255, 138, 38], [238, 48, 58], [168, 68, 198], [58, 168, 248]];
    pg.noStroke();
    rbApple.forEach((rc, rIdx) => {
      pg.fill(...rc);
      pg.rect(ax - 14, ay - 12 + rIdx * 4, 28, 4.5, 2);
    });
    // Iconic bite taken out of the right side of the Eden Apple + glowing leaf
    pg.fill(18, 98, 54);
    pg.ellipse(ax + 15, ay - 1, 11, 12);
    pg.fill(118, 255, 168);
    pg.ellipse(ax + 3, ay - 17, 10, 5);
    pg.pop();
    pg.pop();

    // =========================================================================
    // 2. MICRO RIGHT: TRANSPARENT GREEN PCB MOTHERBOARD CUTAWAY — "CYBER GRAND VIEW GARDEN" (《红楼梦》“赛博大观园/桃花源”微距奇观)!
    // =========================================================================
    pg.push();
    pg.translate(135, 0);
    // Giant Translucent Emerald PCB Die-Shot Frame
    pg.fill(10, 52, 32, 232);
    pg.stroke(255, 218, 88);
    pg.strokeWeight(2.8);
    pg.rect(-195, -225, 415, 225, 8);

    // Gilded Copper-Foil Winding Corridors & Zigzag Nine-Turn Bridge ("金碧辉煌的铜箔九曲回廊")!
    pg.noFill();
    pg.stroke(255, 208, 68, 220);
    pg.strokeWeight(3.2);
    pg.beginShape();
    pg.vertex(-175, -24);
    pg.vertex(-115, -52);
    pg.vertex(-55, -24);
    pg.vertex(15, -56);
    pg.vertex(85, -24);
    pg.vertex(155, -52);
    pg.vertex(205, -28);
    pg.endShape();

    // Three Ornate Capacitor & IC-Chip Upturned-Eave Grand View Garden Pavilions ("怡红院 / 潇湘馆 / 蘅芜苑 电容飞檐亭台")!
    const pavilions = [
      { px: -115, py: -62, name: '怡红院·CPU', col: [238, 58, 98] },
      { px: 12,   py: -82, name: '大观楼·RAM', col: [255, 214, 68] },
      { px: 138,  py: -62, name: '潇湘馆·BUS', col: [88, 248, 192] },
    ];
    pavilions.forEach((pv) => {
      pg.push();
      pg.translate(pv.px, pv.py);
      // Electrolytic Capacitor Golden Pillars
      pg.fill(28, 44, 88);
      pg.stroke(255, 218, 88);
      pg.strokeWeight(1.8);
      pg.rect(-28, -54, 12, 54, 2);
      pg.rect(16, -54, 12, 54, 2);
      // Classical Chinese Upturned Double-Eave Pavilion Roof etched in Gold Copper Foil!
      pg.fill(pv.col[0], pv.col[1], pv.col[2], 230);
      pg.stroke(255, 232, 118);
      pg.strokeWeight(2.2);
      pg.beginShape();
      pg.vertex(-48, -54);
      pg.quadraticVertex(0, -86, 48, -54);
      pg.quadraticVertex(0, -64, -48, -54);
      pg.endShape(pg.CLOSE);
      // Plaque
      pg.fill(12, 28, 20, 240);
      pg.rect(-34, -48, 68, 18, 3);
      pg.noStroke();
      pg.fill(255, 242, 158);
      pg.textFont('serif');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(9.8);
      pg.text(pv.name, 0, -39);
      pg.pop();
    });

    // Flying Glowing Pixel Peach Blossoms ("飞舞的发光像素桃花雨") drifting across the Cyber Grand View Garden!
    pg.noStroke();
    for (let p = 0; p < 18; p++) {
      const bx = -175 + ((p * 47 + t * 55) % 375);
      const by = -205 + ((p * 31 + t * 38) % 185);
      pg.fill(p % 2 === 0 ? [255, 118, 178, 235] : [118, 255, 188, 235]);
      pg.rect(bx, by, 6, 6, 1);
      pg.fill(255, 245, 210);
      pg.rect(bx + 1.5, by + 1.5, 3, 3);
    }

    // Header Banner inside the PCB Garden
    pg.fill(10, 32, 22, 235);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(1.8);
    pg.rect(-175, -214, 370, 26, 4);
    pg.noStroke();
    pg.fill(255, 232, 118);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(11.2);
    pg.text('🌸 微距钻入绿色PCB主板：《红楼梦》“刘姥姥游赛博大观园/桃花源”', 10, -201);
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 15 MASTERPIECE V6.0: ULTRA-DETAILED FUXING/SHINKANSEN BULLET TRAIN, CONTAINER PORT GANTRY CRANES,
   * 5-CONTINENT SKYLINE × "THREE-BODY" (《三体》二维智子展开、强互作用力“水滴”伴飞与“古筝行动”纳米飞刃金光)
   */
  drawGlobalizationMetropolisAndAuroraGlobe(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // =========================================================================
    // 1. SKY VAULT: "THREE-BODY" 2D SOPHON UNFOLDING GEOMETRIC LIGHT ARRAY & ROTATING 5-CONTINENT EARTH!
    // =========================================================================
    pg.push();
    pg.translate(0, -215);
    // Unfolded 2D Sophon ("《三体》二维智子展开巨型几何光阵与星空之眼")
    pg.push();
    pg.rotate(t * 0.25);
    pg.noFill();
    pg.stroke(138, 248, 255, 145);
    pg.strokeWeight(1.8);
    pg.ellipse(0, 0, 320, 148);
    pg.ellipse(0, 0, 148, 320);
    pg.stroke(255, 224, 118, 155);
    pg.rect(-105, -105, 210, 210);
    pg.pop();

    // 3D Holographic Earth
    pg.fill(18, 88, 138, 175);
    pg.stroke(98, 255, 232);
    pg.strokeWeight(2.4);
    pg.ellipse(0, 0, 132, 132);
    pg.noFill();
    for (let lat = -40; lat <= 40; lat += 26) {
      const w = Math.sqrt(Math.max(10, 66 * 66 - lat * lat)) * 2;
      pg.ellipse(0, lat, w, 15);
    }

    const hubs = [
      { x: -205, y: -22, name: 'ASIA · 亚洲高铁' },
      { x: -115, y: -58, name: 'EUROPE · 欧洲' },
      { x: 118,  y: -58, name: 'N.AMERICA · 北美' },
      { x: -145, y: 36,  name: 'AFRICA · 非洲' },
      { x: 185,  y: 28,  name: 'LATAM · 拉美' },
    ];
    hubs.forEach((hb) => {
      pg.noFill();
      pg.stroke(118, 255, 232, 195);
      pg.strokeWeight(2.0);
      pg.bezier(0, 0, hb.x * 0.5, hb.y - 36, hb.x * 0.8, hb.y - 18, hb.x, hb.y);
      pg.textFont('monospace');
      pg.textSize(10.0);
      const hw = pg.textWidth(hb.name) + 16;
      pg.fill(12, 34, 52, 230);
      pg.stroke(98, 255, 232);
      pg.rect(hb.x - hw * 0.5, hb.y - 12, hw, 24, 12);
      pg.noStroke();
      pg.fill(255, 238, 128);
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.text(hb.name, hb.x, hb.y);
    });
    pg.pop();

    // =========================================================================
    // 2. DISTANT HORIZON: "OPERATION GUZHENG" NANO-SLICER GOLDEN BEAMS, CONTAINER PORT GANTRY CRANES & 5-CONTINENT SKYLINE!
    // =========================================================================
    // "Operation Guzheng" ("古筝行动"纳米飞刃切开云层的平行璀璨金光)!
    pg.stroke(255, 236, 128, 185);
    pg.strokeWeight(1.8);
    for (let gz = 0; gz < 5; gz++) {
      const gy = -148 + gz * 9;
      pg.line(-380, gy, 380, gy - 8);
    }

    // Left Container Port Gantry Cranes ("集装箱港口巨型龙门吊") & Global Landmarks
    pg.push();
    pg.translate(-285, -96);
    pg.stroke(238, 98, 48);
    pg.strokeWeight(3.2);
    pg.line(-38, 0, -28, -92);
    pg.line(18, 0, 8, -92);
    pg.line(-48, -82, 68, -96);
    // Suspended ISO Shipping Container
    pg.fill(38, 138, 228);
    pg.stroke(255, 224, 88);
    pg.strokeWeight(1.6);
    pg.rect(24, -64 + Math.sin(t * 3) * 6, 36, 18, 2);
    pg.pop();

    // Right 5-Continent Landmark Silhouettes (Oriental Pearl Tower, Eiffel Tower, Wind Turbines)
    pg.push();
    pg.translate(275, -96);
    pg.stroke(118, 248, 232);
    pg.strokeWeight(2.4);
    pg.line(0, 0, 0, -128);
    pg.fill(238, 68, 128);
    pg.ellipse(0, -48, 24, 24);
    pg.ellipse(0, -92, 16, 16);
    pg.pop();

    // =========================================================================
    // 3. MIDGROUND: ULTRA-DETAILED FUXING / SHINKANSEN EAGLE-NOSE HIGH-SPEED BULLET TRAIN ON CROSS-SEA BOX-GIRDER VIADUCT!
    // =========================================================================
    // Cross-Sea Box-Girder Viaduct & Catenary Power Poles ("跨海箱梁高架桥与高压接触网")
    pg.fill(42, 68, 98);
    pg.stroke(118, 248, 232);
    pg.strokeWeight(2.2);
    pg.rect(-385, -88, 770, 22);
    for (let p = -320; p <= 320; p += 128) {
      pg.fill(34, 54, 82);
      pg.rect(p - 14, -66, 28, 66);
      // High-voltage overhead catenary mast & wire
      pg.stroke(168, 218, 245);
      pg.strokeWeight(2.0);
      pg.line(p, -88, p, -142);
      pg.line(p - 16, -138, p + 16, -138);
    }
    pg.stroke(198, 238, 255, 190);
    pg.strokeWeight(1.5);
    pg.line(-385, -138, 385, -138);

    // Sleek Aerodynamic Fuxing CR400AF / Shinkansen Double-Deck Bullet Train ("复兴号流线型鹰嘴车头 + 受电弓电火花 + 双层车厢内景")!
    const bulletX = ((t * 145) % 620) - 310;
    pg.push();
    pg.translate(bulletX, -88);
    // Main aerodynamic body & elongated eagle-nose cone
    pg.fill(246, 250, 255);
    pg.stroke(28, 128, 208);
    pg.strokeWeight(2.4);
    pg.beginShape();
    pg.vertex(-185, 0);
    pg.vertex(115, 0);
    pg.bezierVertex(165, 0, 195, -8, 208, -4);
    pg.bezierVertex(185, -24, 138, -38, 88, -42);
    pg.vertex(-185, -42);
    pg.endShape(pg.CLOSE);
    // Signature Fuxing Crimson-Gold Dragon Stripe along fuselage
    pg.fill(218, 38, 38);
    pg.noStroke();
    pg.rect(-182, -22, 315, 5, 2);
    pg.fill(255, 208, 68);
    pg.rect(-182, -16, 295, 3, 1);
    // Cockpit Wrap-Around Windshield & Double-Deck Illuminated Passenger Windows!
    pg.fill(18, 38, 68);
    pg.quad(92, -38, 142, -26, 132, -16, 86, -24);
    for (let w = -165; w <= 65; w += 26) {
      // Upper deck & lower deck lit windows
      pg.fill(255, 242, 158);
      pg.rect(w, -37, 16, 8, 2);
      pg.fill(168, 238, 255);
      pg.rect(w, -12, 16, 7, 2);
    }
    // Roof Pantograph & Crackling High-Voltage Catenary Arc Sparks ("车顶受电弓与高压接触网电火花")!
    pg.stroke(218, 232, 248);
    pg.strokeWeight(2.4);
    pg.line(-45, -42, -62, -46);
    pg.line(-62, -46, -42, -50);
    // Bright cyan-white electric arc spark where pantograph touches the -50 catenary wire!
    pg.stroke(138, 255, 255);
    pg.strokeWeight(2.8);
    for (let sp = 0; sp < 4; sp++) {
      const sa = sp * 1.5 + t * 35;
      pg.line(-42, -50, -42 + Math.cos(sa) * 14, -50 + Math.sin(sa) * 10);
    }
    pg.pop();

    // =========================================================================
    // 4. FOREGROUND COMPANION: "THREE-BODY" STRONG-INTERACTION SILVER "WATERDROP" PROBE ("《三体》绝对光滑银色“水滴”探测器伴飞")!
    // =========================================================================
    const dropX = 148 + Math.sin(t * 4.5) * 18;
    const dropY = -142 + Math.cos(t * 5.2) * 10;
    pg.push();
    pg.translate(dropX, dropY);
    // Blue-white plasma propulsion rings behind the rounded head (pointing right)
    pg.noFill();
    for (let r = 1; r <= 3; r++) {
      pg.stroke(98, 242, 255, 230 - r * 55);
      pg.strokeWeight(2.2);
      pg.ellipse(-28 - r * 10, 0, 8, 18 + r * 6);
    }
    // Mirror-smooth liquid-mercury teardrop hull reflecting the entire cosmos
    pg.fill(228, 242, 255);
    pg.stroke(255, 255, 255);
    pg.strokeWeight(2.0);
    pg.beginShape();
    pg.vertex(-36, 0); // Razor-sharp tail tip
    pg.bezierVertex(-12, -16, 18, -18, 28, 0);
    pg.bezierVertex(18, 18, -12, 16, -36, 0);
    pg.endShape(pg.CLOSE);
    // Specular starlight reflection highlight on the Waterdrop surface
    pg.fill(255, 255, 255);
    pg.noStroke();
    pg.ellipse(8, -5, 22, 6);
    pg.pop();

    pg.pop();
  },

    drawMultiGenreBroadcastFX(pg, state, rig, W, H, showVFX = true) {
    if (!showVFX) return;
    const { era, localProgress, t, beatPulse, cam } = state;
    const { seamFade } = getSliceTiming(era, t);
    if (seamFade < 0.08) return;

    pg.push();

    if (era.id === 'intro') {
      const scanY = LETTERBOX_TOP + 40 + ((t * 85) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 80));
      pg.stroke(88, 248, 224, Math.round(145 * seamFade));
      pg.strokeWeight(1.5);
      pg.line(rig.centerX - 175, scanY, rig.centerX + 175, scanY);

      const lx = W - 125, ly = LETTERBOX_TOP + 88, lr = 52;
      pg.fill(18, 26, 32, Math.round(220 * seamFade));
      pg.stroke(248, 214, 118, Math.round(230 * seamFade));
      pg.strokeWeight(2.4);
      pg.ellipse(lx, ly, lr * 2, lr * 2);
      pg.push();
      pg.translate(lx, ly);
      pg.rotate(t * 0.8);
      pg.noFill();
      pg.stroke(112, 255, 218, Math.round(210 * seamFade));
      pg.strokeWeight(2.0);
      pg.ellipse(0, 0, 62, 62);
      for (let g = 0; g < 12; g++) {
        const a = (g / 12) * Math.PI * 2;
        pg.line(Math.cos(a) * 25, Math.sin(a) * 25, Math.cos(a) * 35, Math.sin(a) * 35);
      }
      pg.pop();
      pg.noStroke();
      pg.fill(255, 232, 148, Math.round(235 * seamFade));
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(11);
      pg.text('🔬 IMAX 微距：2.5x 擒纵齿轮', lx, ly + lr + 14);
    }

    else if (era.id === 'era01') {
      const bx = W - 325, by = LETTERBOX_TOP + 10, bw = 305, bh = 66;
      pg.fill(12, 14, 18, Math.round(215 * seamFade));
      pg.stroke(255, 208, 0, Math.round(245 * seamFade));
      pg.strokeWeight(2.5);
      pg.rect(bx, by, bw, bh, 4);

      const jaw = cam ? cam.lionJawOpen : 0;
      const tremor = cam ? cam.lionGroundTremor : 0;
      const statusText = tremor > 0.15
        ? '🚨 阶段②：声波抵镜！38Hz 大地剧烈震颤中！'
        : (jaw > 0.15 ? '🦁 阶段①：雄狮张口咆哮！(声波正传向镜头)' : '🎥 国家地理长焦：追踪东非象群与狮王');

      pg.noStroke();
      pg.fill(255, 214, 42, Math.round(245 * seamFade));
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.6);
      pg.text(statusText, bx + 10, by + 18);

      pg.stroke(tremor > 0.15 ? [255, 72, 58, Math.round(245 * seamFade)] : [98, 248, 192, Math.round(245 * seamFade)]);
      pg.strokeWeight(2.0);
      pg.noFill();
      pg.beginShape();
      for (let i = 0; i < 48; i++) {
        const wx = bx + 12 + i * 5.8;
        const amp = (tremor * 18 + jaw * 5 + 1.5) * Math.sin(i * 0.9 + t * 42);
        pg.vertex(wx, by + 45 + amp);
      }
      pg.endShape();
    }

    else if (era.id === 'era02') {
      const nvAmt = (cam && cam.nightVisionAmount) ? cam.nightVisionAmount * seamFade : 0;
      const oilAmt = (cam && cam.oilImpastoAmount) ? cam.oilImpastoAmount * seamFade : 0;

      if (nvAmt > 0.05) {
        const na = Math.round(235 * nvAmt);
        const cL = 38;
        const leftX = 26, rightX = W - 26;
        const topY = LETTERBOX_TOP + 14, botY = H - LETTERBOX_BOTTOM - 14;
        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(2.8);
        pg.noFill();
        pg.line(rightX - cL, topY, rightX, topY);
        pg.line(rightX, topY, rightX, topY + cL);
        pg.line(leftX, botY - cL, leftX, botY);
        pg.line(leftX, botY, leftX + cL, botY);
        pg.line(rightX - cL, botY, rightX, botY);
        pg.line(rightX, botY, rightX, botY - cL);

        const afX = W * 0.56 + Math.sin(t * 7.5) * 8;
        const afY = 335 + Math.cos(t * 6.2) * 6;
        pg.stroke(92, 255, 148, Math.round(190 * nvAmt));
        pg.strokeWeight(1.6);
        pg.rect(afX - 48, afY - 32, 96, 64, 4);
        pg.line(afX - 12, afY, afX + 12, afY);
        pg.line(afX, afY - 12, afX, afY + 12);
        pg.noStroke();
        pg.fill(92, 255, 148, na);
        pg.textFont('monospace');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(10.5);
        pg.text('[AF-LOCK · 诺亚方舟 142m · IR NIGHT-SHOT]', afX, afY + 44);

        const hx = W - 320, hy = LETTERBOX_TOP + 20;
        pg.fill(8, 24, 14, Math.round(215 * nvAmt));
        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(1.8);
        pg.rect(hx, hy, 282, 64, 4);
        if (Math.sin(t * 8) > -0.2) {
          pg.fill(255, 52, 52, na);
          pg.noStroke();
          pg.ellipse(hx + 16, hy + 16, 10, 10);
        }
        pg.noFill();
        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(1.6);
        pg.rect(hx + 236, hy + 10, 28, 12, 2);
        pg.fill(255, 92, 72, na);
        pg.noStroke();
        pg.rect(hx + 238, hy + 12, 9, 8);

        pg.fill(118, 255, 168, na);
        pg.textAlign(pg.LEFT, pg.CENTER);
        pg.textSize(11.2);
        pg.text('REC ● 手持红外夜视仪 | ISO 12800', hx + 28, hy + 16);

        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(2.0);
        pg.noFill();
        pg.beginShape();
        for (let i = 0; i < 38; i++) {
          const ex = hx + 12 + i * 6.6;
          const pulse = ((i + Math.floor(t * 25)) % 10 === 0) ? -14 : (((i + Math.floor(t * 25)) % 10 === 1) ? 10 : 0);
          pg.vertex(ex, hy + 46 + pulse);
        }
        pg.endShape();
      }

      if (oilAmt > 0.05) {
        const oa = Math.round(230 * oilAmt);
        const bx = W - 325, by = LETTERBOX_TOP + 12;
        pg.fill(32, 22, 14, oa);
        pg.stroke(248, 204, 98, oa);
        pg.strokeWeight(2.0);
        pg.rect(bx, by, 305, 38, 6);
        pg.noStroke();
        pg.fill(255, 232, 148, oa);
        pg.textFont('serif');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(12.5);
        pg.text('🎨 已跳入【透纳/伦勃朗式古典厚涂油画境】', bx + 152, by + 19);
      }
    }

    else if (era.id === 'era03') {
      if (localProgress < 0.50) {
        const repX = rig.frontWheel.x + 115;
        const repY = rig.groundY;
        pg.push();
        pg.translate(repX, repY);
        pg.fill(48, 128, 108);
        pg.stroke(245, 208, 98);
        pg.strokeWeight(2.0);
        pg.quad(-12, -52, 12, -52, 16, -4, -16, -4);
        pg.fill(242, 204, 168);
        pg.ellipse(0, -62, 16, 16);
        pg.fill(198, 42, 32);
        pg.rect(-10, -76, 20, 8, 2);
        pg.stroke(245, 208, 98);
        pg.strokeWeight(3.5);
        pg.line(-8, -42, -38, -56);
        pg.fill(64, 218, 186);
        pg.ellipse(-42, -60, 12, 16);
        pg.pop();

        const ny = H - LETTERBOX_BOTTOM - 34;
        pg.fill(168, 24, 24, Math.round(235 * seamFade));
        pg.stroke(255, 218, 98, Math.round(235 * seamFade));
        pg.strokeWeight(1.8);
        pg.rect(18, ny, 168, 28, 4);
        pg.fill(14, 24, 34, Math.round(230 * seamFade));
        pg.rect(190, ny, W - 208, 28, 4);
        pg.noStroke();
        pg.fill(255, 255, 255, Math.round(250 * seamFade));
        pg.textFont('serif');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(12.5);
        pg.text('🔴 朝歌卫视·现场采访', 102, ny + 14);
        pg.fill(255, 232, 138, Math.round(250 * seamFade));
        pg.textAlign(pg.LEFT, pg.CENTER);
        pg.text('【大邑商快讯】特派贞人连线采访玄鸟车队：商王武丁主持太室大典，司母戊鼎正式开炉！', 204, ny + 14);
      } else {
        const popScale = 1.0 + beatPulse * 0.10;
        pg.push();
        pg.translate(W - 195, LETTERBOX_TOP + 36);
        pg.scale(popScale);
        pg.fill(255, 58, 42, Math.round(240 * seamFade));
        pg.stroke(255, 238, 68, Math.round(245 * seamFade));
        pg.strokeWeight(3.0);
        pg.rect(-165, -22, 330, 44, 12);
        pg.noStroke();
        pg.fill(255, 252, 210, Math.round(250 * seamFade));
        pg.textFont('serif');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(17);
        pg.text('🔥 综艺暴击：青铜808震翻朝歌！！', 0, 0);
        pg.pop();
      }
    }

    else if (era.id === 'era04') {
      if (localProgress < 0.50) {
        const mx = W - 340, my = LETTERBOX_TOP + 12;
        pg.fill(18, 16, 16, Math.round(238 * seamFade));
        pg.stroke(255, 218, 68, Math.round(245 * seamFade));
        pg.strokeWeight(3.0);
        pg.quad(mx + 18, my, W - 18, my, W - 32, my + 82, mx, my + 82);
        pg.noStroke();
        pg.fill(255, 236, 88, Math.round(250 * seamFade));
        pg.textFont('serif');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(17.5);
        pg.text('⚡ 跳入【黑白网点热血漫画画境】!!', mx + 162, my + 28);
        pg.fill(255, 98, 52, Math.round(250 * seamFade));
        pg.textSize(14.5);
        pg.text('「ゴゴゴゴ / 黄金战车神速突破！！」', mx + 162, my + 58);
      } else {
        const ox = W - 355, oy = LETTERBOX_TOP + 12;
        pg.fill(12, 28, 54, Math.round(232 * seamFade));
        pg.stroke(255, 214, 72, Math.round(240 * seamFade));
        pg.strokeWeight(2.2);
        pg.rect(ox, oy, 335, 56, 6);
        pg.noStroke();
        pg.fill(255, 214, 72, Math.round(250 * seamFade));
        pg.textFont('monospace');
        pg.textAlign(pg.LEFT, pg.CENTER);
        pg.textSize(11.5);
        const spd = (88.4 + Math.sin(t * 9) * 1.4).toFixed(1);
        pg.text(`🏆 跳入【雅典红绘重彩画境】// LIVE TV`, ox + 12, oy + 18);
        pg.fill(118, 255, 212, Math.round(250 * seamFade));
        pg.text(`⚡ 战车瞬时速度: ${spd} km/h [OLYMPIC WR]`, ox + 12, oy + 39);
      }
    }

    else if (era.id === 'era05') {
      const danmakuList = [
        { text: '🎉 榜一大哥【诗仙李太白】送出 西域夜光杯 × 99 ！！', y: LETTERBOX_TOP + 56, col: [255, 228, 92], spd: 145 },
        { text: '抬头看天穹！《盗梦空间》云端折叠长安城与青绿山水绝了！', y: LETTERBOX_TOP + 82, col: [118, 255, 218], spd: 165 },
      ];
      pg.textFont('serif');
      pg.textSize(13);
      danmakuList.forEach((dm, idx) => {
        const dx = 465 + ((W - 485 - ((t * dm.spd + idx * 360) % (W - 485))) % (W - 485));
        const tw = pg.textWidth(dm.text);
        if (dx > 460 && dx + tw < W - 22) {
          pg.fill(16, 12, 10, Math.round(175 * seamFade));
          pg.noStroke();
          pg.rect(dx - 8, dm.y - 10, tw + 16, 20, 10);
          pg.fill(dm.col[0], dm.col[1], dm.col[2], Math.round(245 * seamFade));
          pg.textAlign(pg.LEFT, pg.CENTER);
          pg.text(dm.text, dx, dm.y);
        }
      });

      pg.stroke(188, 124, 52);
      pg.strokeWeight(2.6);
      pg.line(rig.handlebar.x, rig.handlebar.y, rig.handlebar.x + 68, rig.handlebar.y - 54);
      pg.fill(32, 28, 26);
      pg.stroke(255, 214, 88);
      pg.strokeWeight(1.8);
      pg.rect(rig.handlebar.x + 62, rig.handlebar.y - 68, 22, 14, 3);
      pg.fill(255, 58, 58);
      pg.noStroke();
      pg.ellipse(rig.handlebar.x + 73, rig.handlebar.y - 61, 5, 5);
    }

    else if (era.id === 'era06') {
      const bx = W - 348, by = LETTERBOX_TOP + 12, bw = 330, bh = 56;
      pg.fill(22, 30, 28, Math.round(220 * seamFade));
      pg.stroke(168, 224, 198, Math.round(235 * seamFade));
      pg.strokeWeight(2.0);
      pg.rect(bx, by, bw, bh, 6);
      pg.noStroke();
      pg.fill(218, 255, 238, Math.round(245 * seamFade));
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.8);
      pg.text('🔬 《大宋科技考》水运仪象台 & 双曲辕竹木车把', bx + 14, by + 18);
      pg.fill(245, 224, 152, Math.round(240 * seamFade));
      pg.textSize(10.8);
      pg.text('天衡擒纵每刻击钟 | 红绸流苏黄铜响铃握把已置顶锁定', bx + 14, by + 39);
    }

    else if (era.id === 'era07') {
      const bx = W - 358, by = LETTERBOX_TOP + 12, bw = 340, bh = 56;
      pg.fill(16, 36, 78, Math.round(225 * seamFade));
      pg.stroke(248, 250, 255, Math.round(240 * seamFade));
      pg.strokeWeight(2.2);
      pg.rect(bx, by, bw, bh, 6);
      const combo = 128 + Math.floor((t - 82.0) * 18);
      pg.noStroke();
      pg.fill(255, 228, 98, Math.round(248 * seamFade));
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(12.0);
      pg.text('🧮 大明户部珠算 COMBO ×' + combo + ' | 狼毫前叉×青花瓷把', bx + 14, by + 18);
      pg.fill(228, 242, 255, Math.round(242 * seamFade));
      pg.textSize(10.8);
      pg.text(localProgress < 0.48 ? '🎭 巨毫洒墨化游虾飞燕与八大山人危石残荷！' : '🏺 窑变青花境：郑和九桅宝船下西洋航线开启！', bx + 14, by + 39);
    }

    else if (era.id === 'era08') {
      const lx = W - 135, ly = LETTERBOX_TOP + 86, lr = 56;
      pg.fill(24, 18, 12, Math.round(210 * seamFade));
      pg.stroke(255, 212, 78, Math.round(245 * seamFade));
      pg.strokeWeight(3.0);
      pg.ellipse(lx, ly, lr * 2, lr * 2);
      pg.strokeWeight(1.2);
      pg.line(lx - lr + 8, ly, lx + lr - 8, ly);
      pg.line(lx, ly - lr + 8, lx, ly + lr - 8);
      pg.noStroke();
      pg.fill(255, 232, 128, Math.round(245 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10.0);
      pg.text("🔭 船舵T型把 × 阵风旗帜物理", lx, ly + lr + 14);
    }

    else if (era.id === 'era09') {
      const lx = W - 145, ly = LETTERBOX_TOP + 88, lr = 56;
      pg.fill(12, 28, 36, Math.round(225 * seamFade));
      pg.stroke(98, 255, 192, Math.round(240 * seamFade));
      pg.strokeWeight(2.6);
      pg.ellipse(lx, ly, lr * 2, lr * 2);
      const sep = 12 + Math.sin(t * 4.5) * 7;
      pg.fill(72, 248, 178, Math.round(185 * seamFade));
      pg.ellipse(lx - sep, ly, 28, 24);
      pg.ellipse(lx + sep, ly, 28, 24);
      pg.fill(168, 255, 218, Math.round(245 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10.0);
      pg.text('🎨 梵高厚涂流场 × 圣雷米教堂', lx, ly + lr + 14);
    }

    else if (era.id === 'era10') {
      const bx = W - 358, by = LETTERBOX_TOP + 12, bw = 340, bh = 58;
      pg.fill(10, 20, 34, Math.round(225 * seamFade));
      pg.stroke(88, 242, 255, Math.round(245 * seamFade));
      pg.strokeWeight(2.0);
      pg.rect(bx, by, bw, bh, 6);
      pg.noStroke();
      pg.fill(118, 252, 255, Math.round(248 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.0);
      pg.text('⚡ 紫铜线圈黑胶木双弯把 + 羊角电弧放电球', bx + 12, by + 18);
      pg.stroke(88, 242, 255, Math.round(235 * seamFade));
      pg.strokeWeight(2.0);
      pg.noFill();
      pg.beginShape();
      for (let i = 0; i < 46; i++) {
        const wx = bx + 12 + i * 6.4;
        const wy = by + 42 + Math.sin(i * 0.45 - t * 18) * 10;
        pg.vertex(wx, wy);
      }
      pg.endShape();
    }

    else if (era.id === 'era11' || era.id === 'era12' || era.id === 'era13' || era.id === 'era14' || era.id === 'era15') {
      const hudMap = {
        era11: { t1: '⚡ 82版《西游记》大闹天宫激光 × 顺百万伏特闪电垂直登天', t2: `🎥 运镜: ${cam ? cam.cameraAngleTag : ''} | 白瓷绝缘子横把`, col: [212, 158, 255] },
        era12: { t1: '🌌 真·16尊凝固3D高斯点云实体雕塑 ×《哈姆雷特》舞台追光', t2: `🎥 运镜: ${cam ? cam.cameraAngleTag : ''} | 多普勒光子弯把`, col: [118, 242, 255] },
        era13: { t1: '🏅 全球奥运地标群 ×《喜羊羊/猪猪侠》高饱和热血冲刺变形', t2: `🎥 运镜: ${cam ? cam.cameraAngleTag : ''} | 五环碳纤休息把`, col: [255, 218, 68] },
        era14: { t1: '🍎《伊甸园》智慧苹果树 × 芯片内《红楼梦》刘姥姥逛赛博大观园', t2: `🎥 运镜: ${cam ? cam.cameraAngleTag : ''} | 彩虹排线BMX燕把`, col: [98, 255, 158] },
        era15: { t1: '💧 复兴号跨海高铁 ×《三体》二维智子展开·水滴伴飞·古筝行动', t2: `🎥 运镜: ${cam ? cam.cameraAngleTag : ''} | 钛合金蝴蝶导航把`, col: [98, 255, 232] },
      };
      const hm = hudMap[era.id];
      pg.textFont('serif');
      pg.textSize(11.4);
      const w1 = pg.textWidth(hm.t1);
      pg.textSize(10.5);
      const w2 = pg.textWidth(hm.t2);
      const bw = Math.max(350, Math.max(w1, w2) + 28);
      const bx = W - bw - 18, by = LETTERBOX_TOP + 10, bh = 52;
      pg.fill(10, 18, 32, Math.round(218 * seamFade));
      pg.stroke(hm.col[0], hm.col[1], hm.col[2], Math.round(235 * seamFade));
      pg.strokeWeight(1.8);
      pg.rect(bx, by, bw, bh, 6);
      pg.noStroke();
      pg.fill(hm.col[0], hm.col[1], hm.col[2], Math.round(248 * seamFade));
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.4);
      pg.text(hm.t1, bx + 12, by + 17);
      pg.fill(242, 248, 255, Math.round(242 * seamFade));
      pg.textSize(10.5);
      pg.text(hm.t2, bx + 12, by + 37);
    }

    pg.pop();
  },

  /**
   * ============================================================================
   * V6.0 AUTO-FADING EVENT TOAST HUD (`HUDToastContract`)
   * ============================================================================
   * - Replaces the permanent multi-row top-left box that occluded Era 08!
   * - Fades in over 0.4s when a VFX event triggers, holds for 1.8s, and fades out
   *   over 0.6s to `alpha = 0` (completely invisible when not needed!).
   * - Dynamically measures text width so 100% of text stays cleanly inside the toast!
   */
  drawDirectorVFXCallouts(pg, state, rig, W, H, showVFX = true) {
    if (!showVFX) return;
    const { era, t, beatPulse, cam } = state;
    const notes = era.vfxNotes || [];
    if (!notes.length) return;

    const toastAlpha = typeof state.toastAlpha === 'number' ? state.toastAlpha : 0.0;
    if (toastAlpha <= 0.02) return; // Completely invisible when faded out!

    const activeIdx = state.activeNoteIdx || 0;
    const activeNote = notes[activeIdx] || notes[0];
    const alphaInt = Math.round(238 * toastAlpha);

    pg.push();

    // Compute target coordinates for the glowing Target Reticle (`◎`)
    let tx = rig.centerX;
    let ty = rig.groundY - 120;
    if (activeNote.target === 'sky_wheel') {
      tx = rig.centerX + 85;
      ty = rig.groundY - 215;
    } else if (activeNote.target === 'crank') {
      tx = rig.handlebar.x;
      ty = rig.handlebar.y;
    } else if (activeNote.target === 'cat') {
      tx = rig.catSeat.x;
      ty = rig.catSeat.y - 24;
    } else if (activeNote.target === 'lion') {
      const prideX = ((W * 0.72 - state.cameraLeftWorldX * 0.28) % (W + 340) + (W + 340)) % (W + 340) - 120;
      tx = Math.max(460, Math.min(W - 220, prideX + 96));
      ty = 312;
    } else if (activeNote.target === 'elephant') {
      const herdBaseX = ((W * 0.24 - state.cameraLeftWorldX * 0.22 + t * 28) % (W + 360) + (W + 360)) % (W + 360) - 160;
      tx = Math.max(450, Math.min(W - 240, herdBaseX + 28));
      ty = 345;
    } else if (activeNote.target === 'ark') {
      tx = W * 0.56;
      ty = 335;
    } else if (activeNote.target === 'sky') {
      tx = W * 0.58;
      ty = LETTERBOX_TOP + 135;
    } else if (activeNote.target === 'horizon') {
      tx = W * 0.50;
      ty = 265;
    } else if (activeNote.target === 'foundry') {
      tx = W * 0.54;
      ty = H - LETTERBOX_BOTTOM - 32;
    } else if (activeNote.target === 'camel') {
      tx = W * 0.62;
      ty = 455;
    }

    // Dynamic Auto-Fitted Toast Width (Zero text overflow!)
    const line1 = `✨ 触发特效 [${activeIdx + 1}/${notes.length}] ${activeNote.tag}：${activeNote.desc}`;
    const line2 = `🎯 ${activeNote.objName || ''} · ${cam && cam.cameraAngleTag ? cam.cameraAngleTag : ''}`;
    pg.textFont('serif');
    pg.textSize(11.5);
    const w1 = pg.textWidth(line1);
    pg.textSize(10.8);
    const w2 = pg.textWidth(line2);
    const pw = Math.min(540, Math.max(320, Math.max(w1, w2) + 28));
    const ph = 52;
    const px = 18;
    const slideY = (1.0 - toastAlpha) * -10;
    const py = LETTERBOX_TOP + 10 + slideY;

    pg.fill(10, 14, 22, Math.round(212 * toastAlpha));
    pg.stroke(232, 188, 96, alphaInt);
    pg.strokeWeight(1.6);
    pg.rect(px, py, pw, ph, 8);

    pg.noStroke();
    pg.fill(112, 255, 212, alphaInt);
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.textSize(11.4);
    pg.text(line1, px + 12, py + 17);

    pg.fill(255, 228, 118, alphaInt);
    pg.textSize(10.6);
    pg.text(line2, px + 12, py + 37);

    // Subtle Target Reticle (`◎`) that also fades out with `toastAlpha`
    const rPulse = 12 + beatPulse * 5 + Math.sin(t * 8) * 2;
    pg.noFill();
    pg.stroke(112, 255, 212, alphaInt);
    pg.strokeWeight(2.0);
    pg.ellipse(tx, ty, rPulse * 2, rPulse * 2);

    pg.pop();
  },

  drawCinemaLetterboxHUD(pg, state, W, H) {
    const { era } = state;
    pg.push();

    pg.noStroke();
    pg.fill(8, 9, 12, 252);
    pg.rect(0, 0, W, LETTERBOX_TOP);
    pg.stroke(198, 158, 84, 185);
    pg.strokeWeight(1.5);
    pg.line(0, LETTERBOX_TOP, W, LETTERBOX_TOP);

    pg.noStroke();
    pg.fill(248, 232, 194);
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.textFont('serif');
    pg.textStyle(pg.BOLD);
    pg.textSize(17.0);
    pg.text(era.title, 20, 25);

    const mins = Math.floor(state.t / 60);
    const secs = Math.floor(state.t % 60);
    const frames = Math.floor((state.t % 1) * 60);
    const tcStr = `TC 00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;

    pg.fill(228, 52, 46);
    pg.ellipse(W - 20, 25, 9, 9);
    pg.fill(168, 242, 208);
    pg.textFont('monospace');
    pg.textAlign(pg.RIGHT, pg.CENTER);
    pg.textSize(12);
    pg.text(`${era.year}  |  ${tcStr}`, W - 36, 25);

    const botY = H - LETTERBOX_BOTTOM;
    pg.noStroke();
    pg.fill(8, 9, 12, 252);
    pg.rect(0, botY, W, LETTERBOX_BOTTOM);
    pg.stroke(198, 158, 84, 185);
    pg.strokeWeight(1.5);
    pg.line(0, botY, W, botY);

    pg.stroke(138, 112, 68, 110);
    pg.strokeWeight(1);
    for (let x = 24; x < W - 24; x += 24) {
      const th = (x % 96 === 0) ? 7 : 4;
      pg.line(x, H - th, x, H);
    }

    pg.noStroke();
    pg.fill(248, 212, 118);
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.textFont('serif');
    pg.textStyle(pg.BOLD);
    pg.textSize(13.0);
    pg.text(era.chronoTag, 20, botY + 24);

    pg.fill(188, 218, 255);
    pg.textFont('monospace');
    pg.textAlign(pg.RIGHT, pg.CENTER);
    pg.textSize(11.0);
    pg.text(`🎬 ${era.shootStyle}`, W - 20, botY + 24);

    pg.pop();
  },

  /**
   * ============================================================================
   * V6.0 UNIVERSAL CREATIVE TIME PORTALS (`Universal Creative Time Portals`, 01 ➔ 15)
   * ============================================================================
   * Replaces 100% of old vertical pillars with 15 unique, surreal, era-specific
   * metamorphosis portals across `intro ➔ era15`!
   */
  drawForegroundOcclusionWipe(pg, state, W, H) {
    const sx = state.seamScreenX;
    if (sx < -180 || sx > W + 180 || state.leftEra.id === state.rightEra.id) return;

    pg.push();
    const rightId = state.rightEra.id;
    const t = state.t;
    const midY = H * 0.5;
    const topY = LETTERBOX_TOP;
    const botY = H - LETTERBOX_BOTTOM;
    const spanH = botY - topY;

    // -------------------------------------------------------------------------
    // PORTAL 01 (`00 ➔ 01`, 10s): 达·芬奇黄金圆规自燃火环门
    // -------------------------------------------------------------------------
    if (rightId === 'era01') {
      pg.noFill();
      for (let r = 0; r < 5; r++) {
        pg.stroke(255, 198 - r * 28, 58, 240 - r * 30);
        pg.strokeWeight(5.0 - r * 0.7);
        pg.ellipse(sx, midY, 120 + r * 36, spanH * (0.72 + r * 0.07));
      }
      // Rotating Brass Dividers / Compass Legs drawing the burning Vitruvian fire ring
      const compAng = t * 2.4;
      pg.stroke(248, 214, 118);
      pg.strokeWeight(6.5);
      pg.line(sx, topY + 28, sx + Math.cos(compAng) * 68, midY + Math.sin(compAng) * 140);
      pg.line(sx, topY + 28, sx - Math.cos(compAng) * 68, midY - Math.sin(compAng) * 140);
      // Burning parchment embers morphing into East African campfire sparks
      pg.noStroke();
      for (let e = 0; e < 18; e++) {
        const ey = topY + ((e * 37 + t * 140) % spanH);
        const ex = sx + Math.sin(ey * 0.05 + t * 8 + e) * 48;
        pg.fill(e % 2 === 0 ? [255, 148, 38, 245] : [255, 232, 88, 245]);
        pg.ellipse(ex, ey, 14, 9);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 02 (`01 ➔ 02`, 22s): 狮吼震碎岩壁 · 百米海啸水幕门
    // -------------------------------------------------------------------------
    else if (rightId === 'era02') {
      // Shattering ochre rock boulders on left + 100m Mesopotamian tsunami wall crashing down!
      pg.fill(18, 68, 128, 235);
      pg.stroke(218, 246, 255);
      pg.strokeWeight(3.5);
      pg.beginShape();
      pg.vertex(sx - 24, topY);
      for (let y = topY; y <= botY; y += 28) {
        const curl = Math.sin(y * 0.035 - t * 9) * 38;
        pg.vertex(sx + 36 + curl, y);
      }
      pg.vertex(sx - 24, botY);
      pg.endShape(pg.CLOSE);
      // Shattered ochre rock fragments flying outward from the lion's sonic boom
      for (let k = 0; k < 10; k++) {
        const ry = topY + 36 + k * 58;
        const rx = sx - 18 + Math.sin(t * 12 + k) * 26;
        pg.fill(138, 72, 34);
        pg.stroke(255, 212, 88);
        pg.strokeWeight(2.0);
        pg.quad(rx - 18, ry - 14, rx + 16, ry - 18, rx + 22, ry + 12, rx - 14, ry + 16);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 03 (`02 ➔ 03`, 34s): 彩虹化 1200°C 沸腾铜水 · 万年龟甲炸裂兆纹门
    // -------------------------------------------------------------------------
    else if (rightId === 'era03') {
      // Giant Shang Oracle Tortoise Plastron splitting open with glowing cyan "卜" cracks & molten 1200°C bronze stream!
      pg.fill(52, 38, 24, 245);
      pg.stroke(245, 198, 82);
      pg.strokeWeight(3.2);
      pg.ellipse(sx, midY, 118, spanH * 0.92);
      // Molten 1200°C Golden-Red Bronze pouring down the center crack
      pg.stroke(255, 128, 32);
      pg.strokeWeight(12.0);
      pg.line(sx, topY, sx, botY);
      pg.stroke(255, 238, 98);
      pg.strokeWeight(5.0);
      pg.line(sx, topY, sx, botY);
      // Glowing Cyan "卜"-Shaped Oracle Bone Crack Lines branching left & right
      pg.stroke(98, 255, 218);
      pg.strokeWeight(3.4);
      for (let c = 0; c < 7; c++) {
        const cy = topY + 65 + c * 74;
        const dir = c % 2 === 0 ? 1 : -1;
        pg.line(sx, cy, sx + dir * 46, cy - 22);
        pg.line(sx + dir * 24, cy - 11, sx + dir * 48, cy + 12);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 04 (`03 ➔ 04`, 46s): 青铜饕餮巨口吞噬 · 宙斯雷霆劈石门
    // -------------------------------------------------------------------------
    else if (rightId === 'era04') {
      // Giant Bronze Taotie Beast Mask Jaws at top & bottom + Zeus Golden Lightning Bolt splitting the seam!
      pg.fill(38, 96, 82, 245);
      pg.stroke(242, 204, 98);
      pg.strokeWeight(3.0);
      pg.rect(sx - 64, topY, 128, 95, 8);
      pg.rect(sx - 64, botY - 95, 128, 95, 8);
      // Glowing Taotie eyes & fangs
      pg.fill(98, 255, 218);
      pg.ellipse(sx - 28, topY + 42, 22, 22);
      pg.ellipse(sx + 28, topY + 42, 22, 22);
      pg.fill(255, 248, 220);
      for (let f = -48; f <= 48; f += 24) {
        pg.triangle(sx + f - 8, topY + 95, sx + f + 8, topY + 95, sx + f, topY + 128);
        pg.triangle(sx + f - 8, botY - 95, sx + f + 8, botY - 95, sx + f, botY - 128);
      }
      // Zeus Golden Thunderbolt cleaving through the center
      pg.noFill();
      pg.stroke(255, 232, 68);
      pg.strokeWeight(8.5);
      pg.beginShape();
      for (let y = topY; y <= botY; y += 36) {
        pg.vertex(sx + ((y / 36) % 2 === 0 ? -28 : 28), y);
      }
      pg.endShape();
    }

    // -------------------------------------------------------------------------
    // PORTAL 05 (`04 ➔ 05`, 58s): 古希腊破空铁饼 · 敦煌飞天五彩绫罗漩涡门
    // -------------------------------------------------------------------------
    else if (rightId === 'era05') {
      // Spinning Bronze Discus at center unwinding into 5-Color Dunhuang Feitian Silk Ribbons & Peach Blossom Vortex!
      const ribbonCols = [[238, 58, 48], [255, 208, 68], [58, 198, 152], [78, 168, 248], [238, 118, 198]];
      pg.noFill();
      ribbonCols.forEach((rc, idx) => {
        pg.stroke(rc[0], rc[1], rc[2], 235);
        pg.strokeWeight(8.0);
        pg.beginShape();
        for (let y = topY; y <= botY; y += 24) {
          const wave = Math.sin(y * 0.032 - t * 7 + idx * 1.2) * (48 + idx * 6);
          pg.vertex(sx + wave, y);
        }
        pg.endShape();
      });
      // Spinning Greek Bronze Discus morphing into Tang Taiji Lotus at center
      pg.push();
      pg.translate(sx, midY);
      pg.rotate(t * 6.0);
      pg.fill(218, 158, 58);
      pg.stroke(255, 238, 128);
      pg.strokeWeight(3.0);
      pg.ellipse(0, 0, 92, 92);
      pg.stroke(188, 38, 32);
      pg.ellipse(0, 0, 56, 56);
      pg.pop();
    }

    // -------------------------------------------------------------------------
    // PORTAL 06 (`05 ➔ 06`, 70s): 长安牡丹花雨 · 毕昇三千活字翻转魔方门
    // -------------------------------------------------------------------------
    else if (rightId === 'era06') {
      // 3D Flipping Matrix of Bi Sheng Clay Movable-Type Blocks & Peony Petals ("毕昇三千活字翻转魔方墙")!
      const chars = ['清', '明', '上', '河', '汴', '京', '活', '字', '苏', '轼', '天', '衡'];
      let cIdx = 0;
      for (let y = topY + 26; y <= botY - 26; y += 52) {
        for (let col = -1; col <= 1; col++) {
          const flip = Math.cos(t * 5.5 + y * 0.04 + col);
          const bx = sx + col * 34;
          const bw = Math.max(8, Math.abs(flip) * 30);
          pg.fill(flip > 0 ? [198, 148, 92] : [218, 52, 68]);
          pg.stroke(42, 32, 22);
          pg.strokeWeight(2.0);
          pg.rect(bx - bw * 0.5, y - 22, bw, 44, 4);
          if (bw > 16) {
            pg.noStroke();
            pg.fill(255, 242, 198);
            pg.textFont('serif');
            pg.textAlign(pg.CENTER, pg.CENTER);
            pg.textSize(15);
            pg.text(chars[cIdx % chars.length], bx, y);
          }
          cIdx++;
        }
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 07 (`06 ➔ 07`, 82s): 巨毫浓墨一笔横扫门
    // -------------------------------------------------------------------------
    else if (rightId === 'era07') {
      // Colossal Wolf-Hair Calligraphy Brush sweeping thick Bada Shanren ink & Cobalt glaze down the seam!
      const brushY = topY + 95 + Math.sin(t * 4.5) * 65;
      // Thick flying-white ink stroke trail covering full vertical seam
      for (let s = -24; s <= 24; s += 8) {
        pg.stroke(s > 0 ? [22, 68, 168, 225] : [22, 26, 32, 235]);
        pg.strokeWeight(12);
        pg.line(sx + s + Math.sin(t * 5 + s) * 12, topY, sx + s - Math.cos(t * 5 + s) * 12, botY);
      }
      // Giant Bamboo & Blue-and-White Porcelain Brush Handle + Wolf-Hair Bristle Tip
      pg.fill(168, 118, 58);
      pg.stroke(32, 22, 14);
      pg.strokeWeight(2.8);
      pg.rect(sx - 18, topY - 10, 36, brushY - topY, 4);
      pg.fill(245, 248, 255);
      pg.stroke(22, 68, 168);
      pg.rect(sx - 22, brushY - 24, 44, 24, 3);
      pg.fill(18, 22, 28);
      pg.triangle(sx - 28, brushY, sx + 28, brushY, sx + Math.sin(t * 8) * 16, brushY + 96);
    }

    // -------------------------------------------------------------------------
    // PORTAL 08 (`07 ➔ 08`, 94s): 青花瓷浪破壁化大西洋惊涛门
    // -------------------------------------------------------------------------
    else if (rightId === 'era08') {
      // Jingdezhen Cobalt Blue-and-White Porcelain Waves shattering ceramic shards into real Atlantic storm waves!
      for (let y = topY + 30; y <= botY; y += 54) {
        const waveX = sx + Math.sin(y * 0.04 - t * 6) * 24;
        // Cracked white porcelain shards + surging cobalt-gold Atlantic wave crests
        pg.fill(248, 252, 255);
        pg.stroke(22, 68, 168);
        pg.strokeWeight(3.0);
        pg.arc(waveX, y, 92, 64, 0, Math.PI * 1.35);
        pg.fill(22, 82, 168);
        pg.stroke(255, 218, 78);
        pg.arc(waveX + 14, y - 8, 68, 48, Math.PI * 0.8, Math.PI * 1.9);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 09 (`08 ➔ 09`, 106s): 船长黄铜单筒望远镜钻镜门
    // -------------------------------------------------------------------------
    else if (rightId === 'era09') {
      // Captain's Brass Spyglass Barrel & Rotating Optical Iris morphing into Van Gogh Starry Night Clockwork Gears!
      pg.stroke(168, 112, 38);
      pg.strokeWeight(18);
      pg.line(sx, topY, sx, botY);
      pg.push();
      pg.translate(sx, midY);
      pg.fill(18, 36, 78, 240);
      pg.stroke(255, 214, 68);
      pg.strokeWeight(6.5);
      pg.ellipse(0, 0, 148, 148);
      pg.rotate(t * 2.5);
      for (let g = 0; g < 12; g++) {
        const a = (g / 12) * Math.PI * 2;
        pg.stroke(g % 2 === 0 ? [255, 224, 68] : [78, 162, 255]);
        pg.strokeWeight(4.5);
        pg.line(Math.cos(a) * 32, Math.sin(a) * 32, Math.cos(a) * 72, Math.sin(a) * 72);
      }
      pg.pop();
    }

    // -------------------------------------------------------------------------
    // PORTAL 10 (`09 ➔ 10`, 118s): 蒸汽火车迎面撞镜 · 法拉第电弧爆裂门
    // -------------------------------------------------------------------------
    else if (rightId === 'era10') {
      // Head-on Victorian Steam Locomotive Boiler & Brass Headlamp exploding with Faraday Cyan Electromagnetic Lightning!
      pg.push();
      pg.translate(sx, midY + 24);
      // Smokestack & Iron Boiler Front Plate charging head-on at the lens
      pg.fill(28, 38, 58);
      pg.stroke(255, 214, 68);
      pg.strokeWeight(3.5);
      pg.rect(-18, -135, 36, 56, 3);
      pg.ellipse(0, 0, 128, 128);
      // Blazing Brass Headlamp at center shooting cross-ocean cyan lightning bolts!
      pg.fill(138, 255, 255);
      pg.ellipse(0, -12, 46 + Math.sin(t * 25) * 8, 46 + Math.sin(t * 25) * 8);
      pg.noFill();
      pg.stroke(118, 252, 255);
      pg.strokeWeight(3.4);
      for (let b = 0; b < 8; b++) {
        const a = (b / 8) * Math.PI * 2 + t * 3;
        pg.line(Math.cos(a) * 28, -12 + Math.sin(a) * 28, Math.cos(a) * 115, -12 + Math.sin(a) * 185);
      }
      pg.pop();
    }

    // -------------------------------------------------------------------------
    // PORTAL 11 (`10 ➔ 11`, 130s): 海底电报莫尔斯光脉冲超载门
    // -------------------------------------------------------------------------
    else if (rightId === 'era11') {
      // Subsea Telegraph Morse Code Light Dots/Dashes overloading into Niagara Waterfall & Tesla Million-Volt Storm!
      pg.fill(18, 88, 168, 215);
      pg.noStroke();
      pg.rect(sx - 38, topY, 76, spanH);
      for (let y = topY + 20; y < botY - 20; y += 34) {
        const isDash = ((Math.floor(y / 34) + Math.floor(t * 12)) % 2 === 0);
        pg.fill(138, 255, 255);
        pg.stroke(212, 148, 255);
        pg.strokeWeight(2.4);
        pg.rect(sx - (isDash ? 28 : 10), y, isDash ? 56 : 20, 14, 6);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 12 (`11 ➔ 12`, 142s): 特斯拉球形闪电坍缩黑洞门
    // -------------------------------------------------------------------------
    else if (rightId === 'era12') {
      // Tesla Violet Ball Lightning imploding into Einstein Gravitational-Lensing Solar Eclipse Black Hole!
      pg.push();
      pg.translate(sx, midY);
      for (let r = 4; r >= 1; r--) {
        pg.noFill();
        pg.stroke(r % 2 === 0 ? [212, 148, 255, 220] : [255, 208, 72, 235]);
        pg.strokeWeight(4.5);
        pg.ellipse(0, 0, r * 42 + Math.sin(t * 14 + r) * 10, r * 72);
      }
      pg.fill(6, 8, 16);
      pg.stroke(118, 248, 255);
      pg.strokeWeight(3.5);
      pg.ellipse(0, 0, 74, 74);
      pg.pop();
    }

    // -------------------------------------------------------------------------
    // PORTAL 13 (`12 ➔ 13`, 154s): 视界白光破晓 · 百羽和平鸽冲屏门
    // -------------------------------------------------------------------------
    else if (rightId === 'era13') {
      // Event-Horizon Makoto Shinkai Dawn Ray Burst + Flock of White Olympic Peace Doves flying across the seam!
      pg.noStroke();
      pg.fill(255, 248, 212, 185);
      pg.rect(sx - 44, topY, 88, spanH);
      for (let d = 0; d < 11; d++) {
        const dy = topY + 35 + ((d * 52 - t * 95) % (spanH - 50) + (spanH - 50)) % (spanH - 50);
        const dx = sx + Math.sin(d * 2.1 + t * 5) * 36;
        const flap = Math.sin(t * 18 + d) * 14;
        pg.fill(255, 255, 255);
        pg.stroke(28, 138, 238);
        pg.strokeWeight(2.0);
        pg.triangle(dx - 22, dy - flap, dx + 18, dy, dx - 6, dy + 8);
        pg.triangle(dx + 22, dy - flap, dx - 18, dy, dx + 6, dy + 8);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 14 (`13 ➔ 14`, 166s): 复古显像管电视机啪声切台门
    // -------------------------------------------------------------------------
    else if (rightId === 'era14') {
      // Retro Convex CRT TV Set snapping to a dazzling center green phosphor dot & exploding into 8-Bit Pixel Matrix!
      pg.fill(24, 34, 28, 242);
      pg.stroke(98, 255, 158);
      pg.strokeWeight(3.2);
      pg.rect(sx - 56, midY - 88, 112, 176, 16);
      // Dazzling CRT degauss green beam & cascading 8-Bit pixel blocks
      pg.stroke(148, 255, 198);
      pg.strokeWeight(4.5);
      pg.line(sx - 48, midY, sx + 48, midY);
      pg.fill(255, 255, 255);
      pg.noStroke();
      pg.ellipse(sx, midY, 26 + Math.sin(t * 30) * 8, 26 + Math.sin(t * 30) * 8);
      for (let p = 0; p < 14; p++) {
        const py = topY + 24 + p * 42;
        const px = sx + Math.sin(p * 1.7 + t * 8) * 32;
        pg.fill(p % 2 === 0 ? [98, 255, 158] : [255, 218, 68]);
        pg.rect(px - 8, py - 8, 16, 16, 2);
      }
    }

    // -------------------------------------------------------------------------
    // PORTAL 15 (`14 ➔ 15`, 178s): 《三体》强互作用力“水滴”镜面穿屏门
    // -------------------------------------------------------------------------
    else if (rightId === 'era15') {
      // Mirror-smooth silver "Three-Body" Waterdrop Probe piercing through the 8-Bit pixel wall with liquid-mirror shockwave rings!
      pg.noFill();
      for (let r = 1; r <= 5; r++) {
        pg.stroke(98, 255, 232, 245 - r * 38);
        pg.strokeWeight(3.6 - r * 0.4);
        pg.ellipse(sx, midY, r * 34, r * 92);
      }
      // Silver Teardrop "Waterdrop" Probe piercing across the seam
      pg.push();
      pg.translate(sx, midY);
      pg.fill(235, 248, 255);
      pg.stroke(255, 255, 255);
      pg.strokeWeight(2.5);
      pg.beginShape();
      pg.vertex(-54, 0);
      pg.bezierVertex(-18, -26, 28, -28, 44, 0);
      pg.bezierVertex(28, 28, -18, 26, -54, 0);
      pg.endShape(pg.CLOSE);
      pg.fill(255, 255, 255);
      pg.noStroke();
      pg.ellipse(12, -8, 32, 8);
      pg.pop();
    }

    // Compact Floating Portal Title Pill at the Top of the Seam
    const portalTitles = {
      era01: '🔥 Portal 01 · 达·芬奇圆规火环门',
      era02: '🌊 Portal 02 · 狮吼碎岩百米海啸门',
      era03: '🐢 Portal 03 · 沸腾铜水龟甲裂兆门',
      era04: '⚡ Portal 04 · 饕餮吞噬宙斯雷霆门',
      era05: '🥏 Portal 05 · 破空铁饼飞天绫罗门',
      era06: '🧱 Portal 06 · 牡丹化毕昇活字魔方门',
      era07: '🖌️ Portal 07 · 巨毫浓墨一笔横扫门',
      era08: '🏺 Portal 08 · 青花瓷浪破壁惊涛门',
      era09: '🔭 Portal 09 · 黄铜单筒望远镜钻镜门',
      era10: '🚂 Portal 10 · 火车撞镜法拉第电弧门',
      era11: '📡 Portal 11 · 海底莫尔斯脉冲超载门',
      era12: '🕳️ Portal 12 · 球形闪电坍缩黑洞门',
      era13: '🕊️ Portal 13 · 视界破晓百羽和平鸽门',
      era14: '📺 Portal 14 · 显像管电视啪声切台门',
      era15: '💧 Portal 15 ·《三体》水滴镜面穿屏门',
    };
    const pTitle = portalTitles[rightId];
    if (pTitle) {
      pg.textFont('serif');
      pg.textSize(11.5);
      const pw = pg.textWidth(pTitle) + 20;
      pg.fill(10, 14, 24, 235);
      pg.stroke(255, 218, 88, 240);
      pg.strokeWeight(1.8);
      pg.rect(sx - pw * 0.5, topY + 10, pw, 24, 12);
      pg.noStroke();
      pg.fill(255, 238, 128);
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.text(pTitle, sx, topY + 22);
    }

    pg.pop();
  },
};
