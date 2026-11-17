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

    // LAYER A: ANDEAN MACHU PICCHU MEGALITHIC TERRACES & STEPPED SUN PYRAMID
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

    // SURPRISE EASTER EGG: Golden Inca-Totem Humpback Whale Breaching Between the Lower Sea and the Inverted Sky Ocean!
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
    ships.forEach((sh) => {
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

        pg.fill(252, 246, 232);
        pg.stroke(168, 132, 78);
        pg.strokeWeight(2.0);
        pg.beginShape();
        pg.vertex(m.mx - m.sw * 0.5, -48 - m.sh);
        pg.vertex(m.mx + m.sw * 0.5, -48 - m.sh);
        pg.quadraticVertex(m.mx + m.sw * 0.68, -48 - m.sh * 0.5, m.mx + m.sw * 0.5, -48);
        pg.vertex(m.mx - m.sw * 0.5, -48);
        pg.quadraticVertex(m.mx - m.sw * 0.32, -48 - m.sh * 0.5, m.mx - m.sw * 0.5, -48 - m.sh);
        pg.endShape(pg.CLOSE);

        const cxSail = m.mx + m.sw * 0.08;
        const cySail = -48 - m.sh * 0.5;
        pg.stroke(212, 38, 32);
        pg.strokeWeight(mIdx === 1 ? 5.2 : 3.8);
        pg.line(cxSail, cySail - m.sh * 0.26, cxSail, cySail + m.sh * 0.26);
        pg.line(cxSail - m.sw * 0.24, cySail, cxSail + m.sw * 0.24, cySail);

        pg.fill(218, 42, 34);
        pg.noStroke();
        pg.triangle(m.mx, -32 - m.mh, m.mx + 28, -28 - m.mh + Math.sin(t * 8 + mIdx) * 5, m.mx, -22 - m.mh);
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
   * ERA 09 MASTERPIECE V4.3: SEAMLESS "MECHANICAL & PAINTERLY" FUSION — VAN GOGH "STARRY NIGHT" CLOCKWORK ORRERY & IMPASTO VIADUCT
   * (机械即油画，油画即机械：天体发条星象仪大齿轮直接由厚涂油画笔触构成，并与下方油画质感蒸汽火车连杆啮合传动，搅动出星月夜漩涡与科学进化图谱！)
   */
  drawVictorianSteamBridgeAndVanGoghSky(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // =========================================================================
    // LAYER A: PAINTERLY CLOCKWORK ORRERY & VAN GOGH "STARRY NIGHT" IMPASTO VORTEX!
    // ("巨型油画发条星象仪：黄铜镂空大齿轮的齿牙直接化作梵高《星月夜》的柠檬黄与钴蓝厚涂漩涡！")
    // =========================================================================
    pg.push();
    pg.translate(0, -235);

    const vortices = [
      { vx: -95, vy: -12, maxR: 112, dir: 1 },
      { vx: 115, vy: -24, maxR: 98,  dir: -1 },
    ];
    const vgPalette = [
      [255, 224, 68],  // Chrome Yellow
      [255, 246, 158], // Zinc White-Yellow
      [78, 156, 248],  // Cobalt Blue
      [42, 98, 208],   // Ultramarine Blue
      [112, 218, 196], // Emerald Impasto
    ];

    // 1) Interlocking Brass Clockwork Orrery Rings embedded INSIDE the two Van Gogh Vortices!
    vortices.forEach((v, vIdx) => {
      pg.push();
      pg.translate(v.vx, v.vy);
      pg.rotate(t * 0.45 * v.dir);
      pg.noFill();
      pg.stroke(245, 196, 68, 185);
      pg.strokeWeight(3.0);
      pg.ellipse(0, 0, v.maxR * 1.45, v.maxR * 1.45);
      for (let g = 0; g < 16; g++) {
        const ga = (g / 16) * Math.PI * 2;
        pg.line(Math.cos(ga) * v.maxR * 0.62, Math.sin(ga) * v.maxR * 0.62, Math.cos(ga) * v.maxR * 0.82, Math.sin(ga) * v.maxR * 0.82);
      }
      pg.pop();

      // Short curved Van Gogh impasto oil brushstrokes swirling out of the gear teeth!
      pg.noFill();
      for (let ring = 18; ring <= v.maxR; ring += 13) {
        const numDashes = Math.floor(ring * 0.28);
        for (let d = 0; d < numDashes; d++) {
          const baseAng = (d / numDashes) * Math.PI * 2 + t * 0.55 * v.dir + ring * 0.025;
          const col = vgPalette[(d + Math.floor(ring)) % vgPalette.length];
          pg.stroke(col[0], col[1], col[2], 238);
          pg.strokeWeight(4.5);
          pg.arc(v.vx, v.vy, ring * 2.1, ring * 1.35, baseAng, baseAng + 0.28);
        }
      }
    });

    // Brass Connecting Rod linking Left Vortex Gear to Right Vortex Gear ("横跨星空的黄铜发条连杆")!
    const rodOffX = Math.cos(t * 1.8) * 18;
    const rodOffY = Math.sin(t * 1.8) * 12;
    BrushKit.draw3DTube(pg, -95 + rodOffX, -12 + rodOffY, 115 - rodOffX, -24 - rodOffY, [188, 132, 48], [255, 224, 98], [28, 36, 64], 3.8);

    // Flowing S-curve impasto wind currents across the sky
    pg.noFill();
    for (let s = -280; s <= 280; s += 26) {
      const sy = -18 + Math.sin(s * 0.018 + t * 1.6) * 42;
      pg.stroke(s % 52 === 0 ? [255, 228, 78, 235] : [92, 178, 255, 225]);
      pg.strokeWeight(4.8);
      pg.arc(s, sy, 38, 22, -0.4, 0.8);
    }

    // 2) 5 Blazing Clockwork Star-Gears & Crescent Moon
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
          pg.stroke(h === 1 ? [255, 242, 128] : [255, 204, 52], 235 - h * 45);
          pg.strokeWeight(3.6);
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

    // 3) Darwin's Tree of Life & Mendeleev 1869 Periodic Table Cards inside the Swirl
    const elements = [
      { sym: 'H',  num: '1',  x: -185, y: 28 },
      { sym: 'C',  num: '6',  x: -95,  y: -12 },
      { sym: 'O',  num: '8',  x: 115,  y: -24 },
      { sym: 'Fe', num: '26', x: 205,  y: 22 },
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

    // LAYER B: VAN GOGH'S FLAME-LIKE CYPRESS TREE WITH GOLDEN IMPASTO RIM HIGHLIGHTS!
    pg.push();
    pg.translate(-295, 0);
    for (let b = 0; b < 5; b++) {
      const bx = (b - 2) * 11;
      const bh = 255 - Math.abs(b - 2) * 38;
      pg.noFill();
      pg.stroke(b % 2 === 0 ? [18, 46, 38] : (b === 1 ? [218, 178, 52] : [48, 96, 62]));
      pg.strokeWeight(9.5 - Math.abs(b - 2) * 1.5);
      pg.beginShape();
      for (let y = 0; y >= -bh; y -= 24) {
        const wave = Math.sin(y * 0.035 + t * 2.5 + b) * 12;
        pg.vertex(bx + wave, y);
      }
      pg.endShape();
    }
    pg.pop();

    // =========================================================================
    // LAYER C: PAINTERLY IMPASTO VIADUCT & STEAM LOCOMOTIVE DRIVING THE SKY GEARS!
    // ("桥体与火车本身即由普鲁士蓝、群青、赭石与铬黄厚涂油画刮刀笔触构成！")
    // =========================================================================
    pg.fill(42, 58, 108);
    pg.stroke(255, 214, 68);
    pg.strokeWeight(2.6);
    pg.rect(-340, -106, 680, 24);
    for (let a = -260; a <= 260; a += 104) {
      pg.fill(42, 58, 108);
      pg.stroke(255, 214, 68);
      pg.rect(a - 18, -82, 36, 82);
      // Impasto yellow & cobalt dashes along each bridge pier!
      pg.stroke(98, 178, 255);
      pg.strokeWeight(3.4);
      pg.line(a - 10, -72, a - 10, -14);
      pg.stroke(255, 224, 72);
      pg.line(a + 10, -68, a + 10, -18);
      // Giant Spinning Brass Gear mounted inside each Viaduct Arch!
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
    // Steam trail rising from smokestack & morphing directly into Chrome-Yellow & Cobalt Impasto Swirls!
    for (let p = 0; p < 8; p++) {
      const px = 18 - p * 22;
      const py = -66 - p * 17 + Math.sin(t * 7 + p) * 7;
      pg.noFill();
      pg.stroke(p % 2 === 0 ? [255, 228, 68, 240] : [88, 178, 255, 240]);
      pg.strokeWeight(4.5);
      pg.arc(px, py, 24 + p * 8, 16 + p * 6, t * 3 + p, t * 3 + p + 2.1);
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

    // 1. Curved 4D Minkowski Spacetime Worldline Grid Ribbon spanning from Past (Left-Top) to Present ("Now" at Pelican Rig)!
    const numSlices = 18;
    const startX = 68;
    const endX = rig.centerX - 18;

    // Draw the glowing 4D Worldline Spine & Time-Coordinate Ticks
    pg.noFill();
    for (let band = -1; band <= 1; band++) {
      pg.stroke(band === 0 ? [255, 228, 118, 210] : [98, 224, 255, 135]);
      pg.strokeWeight(band === 0 ? 2.6 : 1.2);
      pg.beginShape();
      for (let i = 0; i <= numSlices; i++) {
        const u = i / numSlices;
        const wx = startX + (endX - startX) * u;
        const wy = 235 + (rig.groundY - 95 - 235) * Math.pow(u, 0.78) + Math.sin(u * Math.PI * 2.5 - t * 2.2) * 28 + band * (18 + u * 26);
        pg.vertex(wx, wy);
      }
      pg.endShape();
    }

    // 2. Render 18 Historical Frame Postures of the Pelican & Cat as Anisotropic 3D Gaussian Point-Cloud Splats!
    // Each slice represents a past moment (t - dt), showing every historical wheel, wing-flap, and pedal-stroke simultaneously!
    const historyPalettes = [
      [245, 168, 72],  // Prehistoric Ochre
      [78, 238, 198],  // Shang Bronze Patina
      [255, 138, 168], // High Tang Cinnabar
      [168, 238, 218], // Song Celadon
      [78, 168, 255],  // Ming Cobalt Blue
      [255, 224, 68],  // Van Gogh Starry Gold
      [198, 138, 255], // Tesla Violet Plasma
      [118, 252, 255], // Einstein Relativistic Cyan
    ];

    const milestoneLabels = {
      2:  't₀ · 远古石轮态',
      6:  't₁ · 殷商青铜态',
      10: 't₂ · 宋明水墨态',
      14: 't₃ · 梵高星月态',
      17: 't₄ · 相对论光锥',
    };

    for (let i = 1; i <= numSlices; i++) {
      const u = i / numSlices; // 0 = earliest birth/origin, 1 = right behind "NOW"
      const histT = t - (numSlices - i) * 0.18;
      const histCrank = histT * (120 / 60) * Math.PI;
      const depthScale = 0.34 + 0.62 * Math.pow(u, 0.85);
      const cx = startX + (endX - startX) * u;
      const cy = 235 + (rig.groundY - 82 - 235) * Math.pow(u, 0.78) + Math.sin(u * Math.PI * 2.5 - t * 2.2) * 28;
      const col = historyPalettes[i % historyPalettes.length];
      const alphaCore = Math.round(95 + u * 145);
      const alphaHalo = Math.round(32 + u * 65);

      pg.push();
      pg.translate(cx, cy);
      pg.scale(depthScale);

      // Generate the 3D Gaussian Splatting Point-Cloud for this historical frame's posture
      // (Rear Wheel splats, Front Wheel splats, Pedaling Leg splats, Torso/Wing splats, Head/Beak splats, Cat splats)
      const wingY = -88 + Math.sin(histCrank * 2) * 18;
      const pedalX = Math.cos(histCrank) * 22;
      const pedalY = 12 + Math.sin(histCrank) * 22;

      const splats = [
        // Rear & Front Wheel Gaussian Ring Splats
        { x: -78, y: 18, rx: 28, ry: 28, ang: histCrank },
        { x: 78,  y: 18, rx: 28, ry: 28, ang: histCrank },
        // Pedaling Leg IK Splats
        { x: -18, y: -28, rx: 14, ry: 24, ang: 0.3 },
        { x: pedalX, y: pedalY, rx: 16, ry: 12, ang: histCrank },
        // Pelican Torso & Flapping Wing Gaussian Splats
        { x: -6,  y: -52, rx: 36, ry: 22, ang: -0.15 },
        { x: 4,   y: wingY, rx: 28, ry: 14, ang: Math.sin(histCrank * 2) * 0.4 },
        // Pelican Neck, Head & Singing Beak Splats
        { x: 24,  y: -96, rx: 12, ry: 26, ang: 0.2 },
        { x: 56,  y: -112, rx: 32, ry: 11, ang: -0.08 },
        // Schrödinger's Cat Gaussian Splat on Rear Rack
        { x: -92, y: -32 + Math.sin(histCrank * 1.5) * 8, rx: 20, ry: 18, ang: 0.0 },
      ];

      pg.noStroke();
      splats.forEach((sp, sIdx) => {
        pg.push();
        pg.translate(sp.x, sp.y);
        pg.rotate(sp.ang);
        // Outer 3D Gaussian covariance halo
        pg.fill(col[0], col[1], col[2], alphaHalo);
        pg.ellipse(0, 0, sp.rx * 1.85, sp.ry * 1.85);
        // Inner high-density 3D Gaussian splat core
        pg.fill(col[0], col[1], col[2], alphaCore);
        pg.ellipse(0, 0, sp.rx * 0.95, sp.ry * 0.95);
        // Bright white-gold specular Gaussian center point
        pg.fill(255, 252, 235, Math.min(255, alphaCore + 35));
        pg.ellipse(0, 0, sp.rx * 0.35, sp.ry * 0.35);
        pg.pop();
      });

      // Historical Milestone Label along the 4D Spacetime Centipede Tail
      if (milestoneLabels[i]) {
        pg.textFont('monospace');
        pg.textSize(12.5);
        const lbl = milestoneLabels[i];
        const lw = pg.textWidth(lbl) + 16;
        pg.fill(10, 18, 34, 215);
        pg.stroke(col[0], col[1], col[2], 225);
        pg.strokeWeight(1.5);
        pg.rect(-lw * 0.5, -148, lw, 22, 4);
        pg.noStroke();
        pg.fill(255, 245, 198);
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.text(lbl, 0, -137);
      }

      pg.pop();
    }

    pg.pop();
  },

  /**
   * ERA 11 MASTERPIECE: NIKOLA TESLA WARDENCLYFFE TOWER, NIAGARA HYDRO-PLANT & MILLION-VOLT AC LIGHTNING WAR
   */
  drawTeslaNiagaraAndWardenclyffe(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Left Side: Niagara Falls Cascading Water & Westinghouse AC Hydro-Electric Turbine Cutaway!
    pg.push();
    pg.translate(-255, 0);
    pg.fill(38, 48, 72);
    pg.stroke(168, 196, 255);
    pg.strokeWeight(2.0);
    pg.rect(-115, -165, 210, 165, 4);
    // Thundering Niagara Waterfall Curtain
    for (let w = -95; w <= 5; w += 20) {
      pg.stroke(138, 228, 255, 210);
      pg.strokeWeight(12);
      const dropOff = ((t * 120 + w * 3) % 24);
      pg.line(w, -160, w - 6, -12 + dropOff * 0.2);
    }
    // Foaming mist at base of Niagara Falls
    pg.noStroke();
    pg.fill(228, 248, 255, 195);
    for (let m = -95; m <= 15; m += 28) {
      pg.ellipse(m, -8 + Math.sin(t * 8 + m) * 4, 42, 22);
    }
    // Spinning Westinghouse Polyphase AC Alternator Turbine on Right of Powerhouse!
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

    // 2. Center: Towering Nikola Tesla Wardenclyffe Wireless Transmission Tower ("沃登克里弗巨型球顶塔")!
    pg.push();
    pg.translate(25, 0);
    // Lattice wood-and-steel octagon tower
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
    // Central copper conductive shaft & Giant 68-foot Metallic Toroid Dome!
    pg.stroke(245, 168, 78);
    pg.strokeWeight(5.0);
    pg.line(0, 0, 0, -215);
    pg.fill(198, 168, 255);
    pg.stroke(255, 245, 255);
    pg.strokeWeight(2.6);
    pg.ellipse(0, -222, 118, 48);

    // Branching Million-Volt Violet-White Fractal Lightning Bolts erupting from the Wardenclyffe Dome!
    pg.noFill();
    for (let b = 0; b < 5; b++) {
      const baseAng = -Math.PI * 0.92 + b * 0.46;
      pg.stroke(b % 2 === 0 ? [235, 215, 255, 245] : [118, 242, 255, 235]);
      pg.strokeWeight(3.0);
      pg.beginShape();
      let lx = Math.cos(baseAng) * 48;
      let ly = -222 + Math.sin(baseAng) * 20;
      pg.vertex(lx, ly);
      for (let seg = 1; seg <= 5; seg++) {
        lx += Math.cos(baseAng) * 36 + Math.sin(t * 38 + b * 7 + seg * 13) * 18;
        ly += Math.sin(baseAng) * 22 + Math.cos(t * 32 + b * 11 + seg * 5) * 14;
        pg.vertex(lx, ly);
      }
      pg.endShape();
    }
    pg.pop();

    // 3. Right Side: Illuminated 1893 Chicago World's Fair & NYC Skyscraper Skyline wireless-lit by Tesla AC!
    pg.push();
    pg.translate(265, 0);
    [-65, -10, 48].forEach((bx, idx) => {
      const bw = 46, bh = 125 + idx * 32;
      pg.fill(26, 22, 52);
      pg.stroke(198, 158, 255);
      pg.strokeWeight(1.8);
      pg.rect(bx, -bh, bw, bh);
      // Glowing AC incandescent window grid
      pg.fill(255, 238, 128);
      pg.noStroke();
      for (let wy = -bh + 14; wy < -16; wy += 18) {
        pg.rect(bx + 8, wy, 10, 10, 1);
        pg.rect(bx + 26, wy, 10, 10, 1);
      }
    });
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 12 MASTERPIECE: EINSTEIN GRAVITATIONAL LENSING OBSERVATORY, BLACK HOLE ECLIPSE & 4D SPACETIME GRID
   */
  drawEinsteinObservatoryAnd4DCentipede(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Warped 4D Minkowski Spacetime Grid Funnel bending around a Gravitational-Lensing Black Hole / Eclipse!
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
    for (let gy = -280; gy <= -20; gy += 38) {
      pg.beginShape();
      for (let gx = -380; gx <= 380; gx += 28) {
        const dx = gx - bhX, dy = gy - bhY;
        const distSq = dx * dx + dy * dy + 1800;
        const pull = 32000 / distSq;
        pg.vertex(gx - (dx / Math.sqrt(distSq)) * pull, gy - (dy / Math.sqrt(distSq)) * pull);
      }
      pg.endShape();
    }

    // Relativistic Black Hole & Glowing Accretion Disk / 1919 Solar Eclipse Einstein Ring!
    pg.push();
    pg.translate(bhX, bhY);
    pg.noFill();
    pg.stroke(255, 198, 72, 225);
    pg.strokeWeight(5.5);
    pg.ellipse(0, 0, 88, 88);
    pg.stroke(118, 242, 255, 210);
    pg.strokeWeight(3.0);
    pg.ellipse(0, 0, 128, 42);
    pg.fill(6, 8, 16);
    pg.noStroke();
    pg.ellipse(0, 0, 68, 68);
    pg.pop();

    // 2. Canadian Rockies Snow-Capped Peaks & Relativistic Astrophysical Dome Observatory on Right!
    pg.fill(38, 54, 88, 210);
    pg.stroke(168, 214, 255);
    pg.strokeWeight(2.0);
    pg.triangle(-360, 0, -245, -185, -125, 0);
    pg.triangle(135, 0, 255, -205, 375, 0);
    // Observatory Dome on Right Peak
    pg.push();
    pg.translate(255, -115);
    pg.fill(238, 244, 255);
    pg.stroke(42, 64, 108);
    pg.strokeWeight(2.2);
    pg.rect(-48, -36, 96, 36, 2);
    pg.arc(0, -36, 96, 88, Math.PI, Math.PI * 2);
    // Giant Telescope Tube aiming at the Gravitational Lensing Black Hole
    pg.stroke(255, 214, 82);
    pg.strokeWeight(6.0);
    pg.line(-12, -56, -68, -96);
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 13 MASTERPIECE: MODERN OLYMPIC MAIN STADIUM, BLAZING CAULDRON, FIVE RINGS & PEACE DOVES
   */
  drawModernOlympicStadiumAndDoves(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Iconic Olympic Five Rings gleaming in the Sky!
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

    // 2. Sweeping Modern Olympic Main Stadium Canopy & Blazing Olympic Cauldron Tower!
    pg.fill(242, 248, 255, 240);
    pg.stroke(28, 118, 218);
    pg.strokeWeight(2.6);
    pg.beginShape();
    pg.vertex(-360, 0);
    pg.quadraticVertex(-220, -145, 0, -96);
    pg.quadraticVertex(220, -145, 360, 0);
    pg.vertex(310, 0);
    pg.quadraticVertex(0, -68, -310, 0);
    pg.endShape(pg.CLOSE);

    // Soaring Olympic Flame Cauldron Tower on Right
    pg.push();
    pg.translate(225, 0);
    pg.fill(228, 236, 248);
    pg.stroke(28, 118, 218);
    pg.quad(-24, 0, 24, 0, 12, -185, -36, -172);
    // Blazing Olympic Cauldron Flame
    pg.noStroke();
    pg.fill(255, 128, 32, 235);
    pg.triangle(-32, -178, -8, -255 - Math.sin(t * 12) * 14, 14, -182);
    pg.fill(255, 228, 68, 245);
    pg.triangle(-22, -178, -8, -228 - Math.cos(t * 15) * 10, 6, -182);
    pg.pop();

    // 3. Flock of White Peace Doves soaring upward across the Stadium!
    for (let d = 0; d < 9; d++) {
      const dx = -260 + d * 64 + Math.sin(t * 3 + d) * 18;
      const dy = -125 - ((t * 38 + d * 24) % 115);
      const flap = Math.sin(t * 14 + d * 1.5) * 10;
      pg.stroke(255, 255, 255);
      pg.strokeWeight(2.8);
      pg.noFill();
      pg.bezier(dx - 14, dy - flap, dx - 3, dy, dx + 3, dy, dx + 14, dy - flap);
    }

    pg.pop();
  },

  /**
   * ERA 14 MASTERPIECE: SILICON VALLEY GARAGE, TEKTRONIX OSCILLOSCOPE & 8-BIT OPEN-SOURCE WEB TREE
   */
  drawSiliconValleyGarageAnd8BitWeb(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Left: Legendary Silicon Valley Garage, Mainframe Reel-to-Reel Tape Drive & Tektronix Oscilloscope!
    pg.push();
    pg.translate(-215, 0);
    pg.fill(32, 54, 44);
    pg.stroke(98, 255, 158);
    pg.strokeWeight(2.2);
    pg.rect(-115, -135, 220, 135, 4);
    pg.triangle(-128, -135, -5, -182, 118, -135);
    // Spinning Mainframe Magnetic Tape Reels
    [-65, -15].forEach((rx, idx) => {
      pg.push();
      pg.translate(rx, -82);
      pg.rotate(t * (idx === 0 ? 3.5 : -3.5));
      pg.fill(22, 34, 28);
      pg.stroke(118, 255, 168);
      pg.ellipse(0, 0, 38, 38);
      pg.line(-16, 0, 16, 0);
      pg.line(0, -16, 0, 16);
      pg.pop();
    });
    // Tektronix Green CRT Oscilloscope Screen
    pg.fill(8, 28, 16);
    pg.stroke(98, 255, 158);
    pg.rect(22, -108, 68, 52, 4);
    pg.noFill();
    pg.beginShape();
    for (let x = 26; x <= 86; x += 6) {
      pg.vertex(x, -82 + Math.sin((x - 26) * 0.22 - t * 12) * 16);
    }
    pg.endShape();
    pg.pop();

    // 2. Right & Sky: 8-Bit Retro Pixel-Art Towers & Global Open-Source TCP/IP / WWW Node Constellation!
    pg.push();
    pg.translate(145, 0);
    const nodes = [
      { x: -95, y: -195, label: 'ARPANET · 1969' },
      { x: 15,  y: -235, label: 'TCP/IP · WWW' },
      { x: 135, y: -185, label: 'GNU / LINUX' },
      { x: 25,  y: -125, label: 'OPEN SOURCE' },
    ];
    pg.stroke(98, 255, 158, 195);
    pg.strokeWeight(2.2);
    pg.line(nodes[0].x, nodes[0].y, nodes[1].x, nodes[1].y);
    pg.line(nodes[1].x, nodes[1].y, nodes[2].x, nodes[2].y);
    pg.line(nodes[0].x, nodes[0].y, nodes[3].x, nodes[3].y);
    pg.line(nodes[2].x, nodes[2].y, nodes[3].x, nodes[3].y);

    nodes.forEach((nd) => {
      pg.textFont('monospace');
      pg.textSize(10.5);
      const nw = pg.textWidth(nd.label) + 18;
      pg.fill(12, 38, 24, 235);
      pg.stroke(98, 255, 158);
      pg.strokeWeight(2.0);
      pg.rect(nd.x - nw * 0.5, nd.y - 14, nw, 28, 4);
      pg.noStroke();
      pg.fill(148, 255, 188);
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.text(nd.label, nd.x, nd.y);
    });
    pg.pop();

    pg.pop();
  },

  /**
   * ERA 15 MASTERPIECE: 5-CONTINENT HOLOGRAPHIC EARTH VILLAGE, HIGH-SPEED BULLET TRAIN & OPEN-SOURCE FIBER ARCS
   */
  drawGlobalizationMetropolisAndAuroraGlobe(pg, cx, baseY, scale = 1.0, t = 0) {
    pg.push();
    pg.translate(cx, baseY);
    pg.scale(scale);

    // 1. Sky Center: Giant Rotating 3D Holographic Earth Village with 5 Connected Continents!
    pg.push();
    pg.translate(0, -210);
    pg.fill(18, 88, 138, 165);
    pg.stroke(98, 255, 232);
    pg.strokeWeight(2.4);
    pg.ellipse(0, 0, 136, 136);
    pg.noFill();
    for (let lat = -42; lat <= 42; lat += 28) {
      const w = Math.sqrt(Math.max(10, 68 * 68 - lat * lat)) * 2;
      pg.ellipse(0, lat, w, 16);
    }
    for (let lon = 0; lon < 3; lon++) {
      const rotW = Math.abs(Math.sin(t * 0.8 + lon * 1.05)) * 136;
      pg.ellipse(0, 0, rotW, 136);
    }
    // 5 Glowing Continent Hubs linked by Golden-Cyan Open-Source Fiber Arcs!
    const hubs = [
      { x: -195, y: -18, name: 'ASIA · 亚洲' },
      { x: -115, y: -58, name: 'EUROPE · 欧洲' },
      { x: 115,  y: -58, name: 'N.AMERICA · 北美' },
      { x: -135, y: 38,  name: 'AFRICA · 非洲' },
      { x: 175,  y: 28,  name: 'LATAM · 拉美' },
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

    // 2. Midground: Sleek Aerodynamic High-Speed Bullet Train ("跨国高铁复兴号/欧洲之星") streaking across the Viaduct!
    pg.fill(38, 78, 112);
    pg.stroke(118, 248, 232);
    pg.strokeWeight(2.0);
    pg.rect(-360, -92, 720, 18);
    const bulletX = ((t * 165) % 680) - 340;
    pg.push();
    pg.translate(bulletX, -92);
    pg.fill(245, 250, 255);
    pg.stroke(28, 148, 218);
    pg.strokeWeight(2.2);
    pg.beginShape();
    pg.vertex(-115, 0);
    pg.vertex(95, 0);
    pg.quadraticVertex(145, -2, 115, -24);
    pg.vertex(-115, -24);
    pg.endShape(pg.CLOSE);
    pg.fill(28, 168, 238);
    pg.noStroke();
    pg.rect(-110, -14, 215, 5, 2);
    pg.pop();

    pg.pop();
  },

    drawMultiGenreBroadcastFX(pg, state, rig, W, H, showVFX = true) {
    if (!showVFX) return;
    const { era, localProgress, t, beatPulse, cam } = state;
    const { seamFade } = getSliceTiming(era, t);
    if (seamFade < 0.08) return;

    pg.push();

    // =========================================================================
    // 00 INTRO: SCI-FI HOLOGRAPHIC SCANNER + IMAX DOCUMENTARY MACRO LOUPE
    // =========================================================================
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

    // =========================================================================
    // 01 EAST AFRICA: NAT-GEO WILDLIFE DOCUMENTARY + ACOUSTIC SEISMOGRAPH
    // =========================================================================
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

    // =========================================================================
    // 02 NOAH'S ARK: FULL-SCREEN HANDHELD IR NIGHT-VISION CAMCORDER (1ST HALF) -> CLASSICAL OIL PAINTING FRAME (2ND HALF)
    // =========================================================================
    else if (era.id === 'era02') {
      const nvAmt = (cam && cam.nightVisionAmount) ? cam.nightVisionAmount * seamFade : 0;
      const oilAmt = (cam && cam.oilImpastoAmount) ? cam.oilImpastoAmount * seamFade : 0;

      if (nvAmt > 0.05) {
        const na = Math.round(235 * nvAmt);
        // 1. Full-Screen Camcorder L-Shaped Viewfinder Corner Brackets!
        const cL = 38;
        const leftX = 26, rightX = W - 26;
        const topY = LETTERBOX_TOP + 14, botY = H - LETTERBOX_BOTTOM - 14;
        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(2.8);
        pg.noFill();
        // Top-Right Bracket
        pg.line(rightX - cL, topY, rightX, topY);
        pg.line(rightX, topY, rightX, topY + cL);
        // Bottom-Left Bracket
        pg.line(leftX, botY - cL, leftX, botY);
        pg.line(leftX, botY, leftX + cL, botY);
        // Bottom-Right Bracket
        pg.line(rightX - cL, botY, rightX, botY);
        pg.line(rightX, botY, rightX, botY - cL);

        // 2. Handheld Autofocus Crosshair Box locking onto Noah's Ark in the Storm!
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

        // 3. Top-Right Camcorder REC Indicator, Battery Icon & Heartbeat ECG
        const hx = W - 320, hy = LETTERBOX_TOP + 20;
        pg.fill(8, 24, 14, Math.round(215 * nvAmt));
        pg.stroke(92, 255, 148, na);
        pg.strokeWeight(1.8);
        pg.rect(hx, hy, 282, 64, 4);
        // Blinking Red REC dot
        if (Math.sin(t * 8) > -0.2) {
          pg.fill(255, 52, 52, na);
          pg.noStroke();
          pg.ellipse(hx + 16, hy + 16, 10, 10);
        }
        // Battery icon
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

        // 4. Simulated Raindrops Beading & Sliding Down the Camcorder Lens Glass!
        pg.noFill();
        pg.stroke(168, 255, 208, Math.round(145 * nvAmt));
        pg.strokeWeight(1.5);
        for (let d = 0; d < 9; d++) {
          const dx = 110 + (d * 137) % (W - 220);
          const dy = LETTERBOX_TOP + 40 + ((d * 97 + t * 55) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 80));
          pg.ellipse(dx, dy, 10, 14);
          pg.line(dx, dy - 14, dx, dy - 7);
        }
      }

      if (oilAmt > 0.05) {
        // Second Half: Classical Impasto Oil Painting Badge in Top-Right
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

    // =========================================================================
    // 03 SHANG ANYANG: ZERO-OVERLAP INTERVIEW (0..0.50) -> VARIETY SHOW CAPTION (0.52..0.94)
    // =========================================================================
    else if (era.id === 'era03') {
      if (localProgress < 0.50) {
        // First Half: Live Diviner Reporter on the ground + Bottom Breaking News Ticker
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
        // Second Half (after Oracle Scroll fades out!): Variety Show Caption cleanly occupies Top-Right (`x=865..1245, y=64..112`) with ZERO overlap!
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

    // =========================================================================
    // 04 GREEK OLYMPICS: MANGA CUT-IN PANEL (1ST HALF) -> OLYMPIC SATELLITE TV (2ND HALF)
    // =========================================================================
    else if (era.id === 'era04') {
      if (localProgress < 0.50) {
        const mx = W - 340, my = LETTERBOX_TOP + 12;
        pg.fill(18, 16, 16, Math.round(238 * seamFade));
        pg.stroke(255, 218, 68, Math.round(245 * seamFade));
        pg.strokeWeight(3.0);
        pg.quad(mx + 18, my, W - 18, my, W - 32, my + 82, mx, my + 82);
        pg.stroke(255, 142, 58, Math.round(155 * seamFade));
        pg.strokeWeight(1.5);
        for (let k = 0; k < 10; k++) {
          pg.line(mx + 15 + k * 28, my + 4, mx + 160, my + 41);
        }
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

    // =========================================================================
    // 05 HIGH TANG CHANG'AN: NON-OCCLUDING TOP-RIGHT DANMAKU LANE & VLOG STICK
    // =========================================================================
    else if (era.id === 'era05') {
      // Strictly keep Danmaku in the upper-right sky band (`x = 460..W-20, y = 104..150`) so it NEVER touches the Top-Left VFX Dock or Character Speech Bubbles!
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

      // Tang Vlog Selfie Stick attached to the front handlebar
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

    // =========================================================================
    // 06 NORTHERN SONG: CCTV MECHANICAL X-RAY LOUPE + MOVABLE-TYPE STAMP HUD
    // =========================================================================
    else if (era.id === 'era06') {
      const bx = W - 348, by = LETTERBOX_TOP + 12, bw = 330, bh = 68;
      pg.fill(22, 30, 28, Math.round(220 * seamFade));
      pg.stroke(168, 224, 198, Math.round(235 * seamFade));
      pg.strokeWeight(2.0);
      pg.rect(bx, by, bw, bh, 6);
      pg.push();
      pg.translate(bx + 36, by + 34);
      pg.rotate(t * 1.6);
      pg.noFill();
      pg.stroke(128, 248, 214, Math.round(230 * seamFade));
      pg.strokeWeight(2.0);
      pg.ellipse(0, 0, 42, 42);
      for (let g = 0; g < 8; g++) {
        const a = (g / 8) * Math.PI * 2;
        pg.line(Math.cos(a) * 14, Math.sin(a) * 14, Math.cos(a) * 24, Math.sin(a) * 24);
      }
      pg.pop();
      pg.noStroke();
      pg.fill(218, 255, 238, Math.round(245 * seamFade));
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(12.0);
      pg.text('🔬 《大宋科技考》4K 机械微距透视', bx + 72, by + 22);
      pg.fill(245, 224, 152, Math.round(240 * seamFade));
      pg.textSize(11.0);
      pg.text('苏颂水运仪象台：天衡擒纵每刻击钟 | 毕昇胶泥活字', bx + 72, by + 46);
    }

    // =========================================================================
    // 07 YUAN-MING-QING: ABACUS HIGH-SPEED COMBO COUNTER + PEKING OPERA GONG HUD
    // =========================================================================
    else if (era.id === 'era07') {
      const bx = W - 358, by = LETTERBOX_TOP + 12, bw = 340, bh = 66;
      pg.fill(16, 36, 78, Math.round(225 * seamFade));
      pg.stroke(248, 250, 255, Math.round(240 * seamFade));
      pg.strokeWeight(2.2);
      pg.rect(bx, by, bw, bh, 6);
      const combo = 128 + Math.floor((t - 82.0) * 18);
      pg.noStroke();
      pg.fill(255, 228, 98, Math.round(248 * seamFade));
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(12.5);
      pg.text('🧮 大明户部珠算连击 COMBO ×' + combo, bx + 14, by + 22);
      pg.fill(228, 242, 255, Math.round(242 * seamFade));
      pg.textSize(11.2);
      pg.text(localProgress < 0.48 ? '🎭 梨园木刻境：【急急风】八大山人白眼亮相！' : '🏺 窑变青花境：郑和九桅宝船下西洋航线开启！', bx + 14, by + 46);
    }

    // =========================================================================
    // 08 INCA & NAVIGATION: CAPTAIN'S BRASS SPYGLASS OPTICAL FINDER POV
    // =========================================================================
    else if (era.id === 'era08') {
      const lx = W - 145, ly = LETTERBOX_TOP + 92, lr = 62;
      pg.fill(24, 18, 12, Math.round(215 * seamFade));
      pg.stroke(255, 212, 78, Math.round(245 * seamFade));
      pg.strokeWeight(3.2);
      pg.ellipse(lx, ly, lr * 2, lr * 2);
      pg.strokeWeight(1.2);
      pg.line(lx - lr + 8, ly, lx + lr - 8, ly);
      pg.line(lx, ly - lr + 8, lx, ly + lr - 8);
      pg.noFill();
      pg.ellipse(lx, ly, lr * 1.15, lr * 1.15);
      pg.noStroke();
      pg.fill(255, 232, 128, Math.round(245 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10.5);
      pg.text("🔭 SPYGLASS POV · 13°09'S 72°32'W", lx, ly + lr + 15);
    }

    // =========================================================================
    // 09 INDUSTRIAL & VAN GOGH SCIENCE: BBC 400X CELLULAR MITOSIS MICROSCOPE PIP
    // =========================================================================
    else if (era.id === 'era09') {
      const lx = W - 150, ly = LETTERBOX_TOP + 92, lr = 62;
      pg.fill(12, 28, 36, Math.round(225 * seamFade));
      pg.stroke(98, 255, 192, Math.round(240 * seamFade));
      pg.strokeWeight(2.8);
      pg.ellipse(lx, ly, lr * 2, lr * 2);
      const sep = 14 + Math.sin(t * 4.5) * 8;
      pg.fill(72, 248, 178, Math.round(185 * seamFade));
      pg.stroke(220, 255, 240, Math.round(220 * seamFade));
      pg.strokeWeight(1.6);
      pg.ellipse(lx - sep, ly, 32, 28);
      pg.ellipse(lx + sep, ly, 32, 28);
      pg.fill(255, 198, 78, Math.round(230 * seamFade));
      pg.noStroke();
      pg.ellipse(lx - sep, ly, 10, 10);
      pg.ellipse(lx + sep, ly, 10, 10);
      pg.fill(168, 255, 218, Math.round(245 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10.5);
      pg.text('🔬 400x 细胞分裂 | 2H₂+O₂→2H₂O', lx, ly + lr + 15);
    }

    // =========================================================================
    // 10 FARADAY ELECTROMAGNETIC DAWN: MAXWELL WAVE OSCILLOSCOPE & MORSE DECODER
    // =========================================================================
    else if (era.id === 'era10') {
      const bx = W - 358, by = LETTERBOX_TOP + 12, bw = 340, bh = 68;
      pg.fill(10, 20, 34, Math.round(225 * seamFade));
      pg.stroke(88, 242, 255, Math.round(245 * seamFade));
      pg.strokeWeight(2.0);
      pg.rect(bx, by, bw, bh, 6);
      pg.noStroke();
      pg.fill(118, 252, 255, Math.round(248 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.2);
      pg.text('⚡ 跨大西洋电报: · · · — — — · · · [1866 ONLINE]', bx + 12, by + 18);
      pg.stroke(88, 242, 255, Math.round(235 * seamFade));
      pg.strokeWeight(2.0);
      pg.noFill();
      pg.beginShape();
      for (let i = 0; i < 46; i++) {
        const wx = bx + 12 + i * 6.4;
        const wy = by + 46 + Math.sin(i * 0.45 - t * 18) * 12;
        pg.vertex(wx, wy);
      }
      pg.endShape();
    }

    // =========================================================================
    // 11..15 ACT III BROADCAST & TELEMETRY HUDS (Auto-Fitted, Zero Overflow!)
    // =========================================================================
    else if (era.id === 'era11' || era.id === 'era12' || era.id === 'era13' || era.id === 'era14' || era.id === 'era15') {
      const hudMap = {
        era11: { t1: '⚡ TESLA AC LAB · 1,000,000 VOLTS @ 60Hz', t2: 'NIAGARA FALLS ⇄ BUFFALO & NYC POWER GRID ONLINE', col: [212, 158, 255] },
        era12: { t1: '🌌 3D GAUSSIAN 4D WORLDLINE · VONNEGUT CENTIPEDE', t2: 'E = mc² · 过去18个历史瞬间同时排列在弯曲四维时空中', col: [118, 242, 255] },
        era13: { t1: '🏅 OLYMPIC 1000FPS PHOTO-FINISH · 74.8 KM/H', t2: 'CITIUS · ALTIUS · FORTIUS — COMMUNITER (五洲和平)', col: [255, 218, 68] },
        era14: { t1: '💻 TERMINAL: $ git push origin open-source-world', t2: 'TEKTRONIX 465B OSCILLOSCOPE ➔ TCP/IP & 8-BIT PIXEL', col: [98, 255, 158] },
        era15: { t1: '🌐 GLOBAL FIBER & HIGH-SPEED RAIL · 5 CONTINENTS', t2: 'ASIA ⇄ EUROPE ⇄ AFRICA ⇄ AMERICAS · ZERO BARRIERS', col: [98, 255, 232] },
      };
      const hm = hudMap[era.id];
      pg.textFont('monospace');
      pg.textSize(11.2);
      const w1 = pg.textWidth(hm.t1);
      pg.textFont('serif');
      pg.textSize(11.0);
      const w2 = pg.textWidth(hm.t2);
      const bw = Math.max(335, Math.max(w1, w2) + 28);
      const bx = W - bw - 18, by = LETTERBOX_TOP + 12, bh = 58;
      pg.fill(10, 18, 32, Math.round(225 * seamFade));
      pg.stroke(hm.col[0], hm.col[1], hm.col[2], Math.round(240 * seamFade));
      pg.strokeWeight(2.0);
      pg.rect(bx, by, bw, bh, 6);
      pg.noStroke();
      pg.fill(hm.col[0], hm.col[1], hm.col[2], Math.round(248 * seamFade));
      pg.textFont('monospace');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.2);
      pg.text(hm.t1, bx + 12, by + 18);
      pg.fill(242, 248, 255, Math.round(242 * seamFade));
      pg.textFont('serif');
      pg.textSize(11.0);
      pg.text(hm.t2, bx + 12, by + 40);
    }

    // =========================================================================
    // UNIVERSAL DIRECTOR CLOSE-UP CUT-IN LOUPE & ANAMORPHIC LENS FLARE (每一幕专属微距特写切镜，消除视觉疲劳！)
    // =========================================================================
    if (localProgress > 0.24 && localProgress < 0.78 && era.id !== 'era02') {
      const pipFade = Math.sin(((localProgress - 0.24) / 0.54) * Math.PI) * seamFade;
      if (pipFade > 0.08) {
        const pa = Math.round(225 * pipFade);
        // Anamorphic Cinema Horizontal Lens Flare Streak across upper lens
        pg.noStroke();
        pg.fill(128, 224, 255, Math.round(38 * pipFade * (0.6 + 0.4 * beatPulse)));
        pg.ellipse(rig.head.x + 20, rig.head.y - 35, 340, 8);

        // Bottom-Right Director Close-Up Cut-In Frame (`x = W - 245, y = H - LETTERBOX_BOTTOM - 108`)
        const px = W - 252, py = H - LETTERBOX_BOTTOM - 104, pw = 234, ph = 64;
        pg.fill(12, 16, 24, pa);
        pg.stroke(255, 218, 92, pa);
        pg.strokeWeight(1.8);
        pg.rect(px, py, pw, ph, 6);
        // Animated Close-Up Reticle & Macro Waveform inside PIP
        pg.noFill();
        pg.stroke(98, 248, 218, pa);
        pg.strokeWeight(1.6);
        pg.ellipse(px + 32, py + 32, 38 + beatPulse * 6, 38 + beatPulse * 6);
        pg.line(px + 12, py + 32, px + 52, py + 32);
        pg.line(px + 32, py + 12, px + 32, py + 52);

        const closeupTitles = {
          intro: ['🎥 85mm 微距特写', '黄金比例擒纵轮咬合'],
          era01: ['🎥 200mm 长焦特写', '雄狮声带震动与金贝鼓'],
          era03: ['🎥 微距金石特写', '司母戊鼎错金雷纹与卜辞'],
          era04: ['🎥 漫画分镜特写', '斯巴达猫火炬与飞马轮'],
          era05: ['🎥 敦煌飞天特写', '波斯猫四弦曲颈琵琶轮指'],
          era06: ['🎥 清明上河特写', '虹桥船夫降桅 & 活字印轮'],
          era07: ['🎥 泼墨微距特写', '巨毫洒墨成游虾与青花胎'],
          era08: ['🎥 航海星盘特写', '圣玛利亚号红十字帆与六分仪'],
          era09: ['🎥 油画刮刀特写', '星辰黄铜齿轮与蒸汽颜料管'],
          era10: ['🎥 高压电弧特写', '马蹄磁铁车架与海底脉冲'],
          era11: ['🎥 百万伏特特写', '法拉第铜笼猫与球形闪电轮'],
          era12: ['🎥 四维时空特写', '3D高斯点云千足虫世界线'],
          era13: ['🎥 1000fps 升格特写', '五环碳纤维碟轮冲刺撞线'],
          era14: ['🎥 芯片微距特写', '绿色PCB主板车架与软盘轮'],
          era15: ['🎥 全息极光特写', '五大洲开源光纤地球仪'],
        };
        const ct = closeupTitles[era.id] || ['🎥 导演微距特写', '时代核心机械与笔触'];
        pg.noStroke();
        pg.fill(255, 224, 108, pa);
        pg.textFont('monospace');
        pg.textAlign(pg.LEFT, pg.CENTER);
        pg.textSize(10.8);
        pg.text(ct[0], px + 62, py + 21);
        pg.fill(218, 246, 255, pa);
        pg.textFont('serif');
        pg.textSize(11.2);
        pg.text(ct[1], px + 62, py + 43);
      }
    }

    pg.pop();
  },

  /**
   * COLLISION-FREE DIRECTOR VFX & OBJECT INSPECTOR DOCK (`drawDirectorVFXCallouts`)
   * - Docks both the 3 VFX items AND the active `【这是：...】` Object Explanation inside the unified Top-Left HUD Card (`x=18..436, y=60..192`)!
   * - Places a clean, non-occluding Target Reticle (`◎ [①]`) directly on the target object in the scene, with a subtle dotted pointer line ONLY when the target is in the left/upper zone, so it NEVER crosses over the Pelican's speech bubble or blocks right-side elements!
   */
  drawDirectorVFXCallouts(pg, state, rig, W, H, showVFX = true) {
    if (!showVFX) return;
    const { era, localProgress, t, beatPulse } = state;
    const notes = era.vfxNotes || [];
    if (!notes.length) return;

    pg.push();

    const activeIdx = Math.min(notes.length - 1, Math.floor(localProgress * notes.length));
    const activeNote = notes[activeIdx];

    // Compute exact target coordinates for the glowing Target Reticle (`◎`)
    let tx = rig.centerX;
    let ty = rig.groundY - 120;
    if (activeNote.target === 'sky_wheel') {
      tx = rig.centerX + 85;
      ty = rig.groundY - 215;
    } else if (activeNote.target === 'crank') {
      tx = rig.bb.x;
      ty = rig.bb.y;
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

    // 1. Unified Top-Left Director VFX & Object-ID Dock (`x=18..434, y=60..192`) — ZERO collision with center or right-side elements!
    const px = 18;
    const py = LETTERBOX_TOP + 8;
    const pw = 416;
    const ph = 132;

    pg.fill(10, 14, 22, 222);
    pg.stroke(232, 188, 96, 220);
    pg.strokeWeight(1.6);
    pg.rect(px, py, pw, ph, 8);

    pg.fill(232, 188, 96, 42);
    pg.noStroke();
    pg.rect(px + 2, py + 2, pw - 4, 22, 6);
    pg.fill(255, 222, 128);
    pg.textFont('monospace');
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.textSize(11.4);
    pg.text(`✨ 跨次元画境与特效导览 [SHADER #${String(era.shader).padStart(2, '0')} · 零遮挡分层]`, px + 10, py + 13);

    notes.forEach((n, idx) => {
      const iy = py + 33 + idx * 19;
      const isAct = idx === activeIdx;
      if (isAct) {
        pg.fill(238, 188, 82, 52);
        pg.noStroke();
        pg.rect(px + 6, iy - 8, pw - 12, 17, 4);
      }
      pg.fill(isAct ? [112, 255, 212] : [215, 198, 162]);
      pg.textFont('serif');
      pg.textAlign(pg.LEFT, pg.CENTER);
      pg.textSize(11.5);
      pg.text(`${isAct ? '▶ ' : '• '}${n.tag}：${n.desc}`, px + 10, iy);
    });

    // Bottom section of the Dock: Explicit Object Identification (`【这是：...】`)
    pg.stroke(232, 188, 96, 95);
    pg.strokeWeight(1);
    pg.line(px + 10, py + 86, px + pw - 10, py + 86);
    pg.noStroke();
    pg.fill(255, 228, 118);
    pg.textFont('serif');
    pg.textAlign(pg.LEFT, pg.CENTER);
    pg.textSize(12.0);
    pg.text(`🎯 准星当前锁定 ${activeNote.objName || ''}`, px + 10, py + 100);
    pg.fill(192, 240, 228);
    pg.textSize(10.8);
    pg.text(activeNote.objSub || '', px + 10, py + 118);

    // 2. Animated Target Reticle (`◎`) on the Scene Object + Compact Numbered Pill Badge (automatically avoids `rig.activeBubbleRect`!)
    const rPulse = 12 + beatPulse * 5 + Math.sin(t * 8) * 2;
    pg.noFill();
    pg.stroke(112, 255, 212, 235);
    pg.strokeWeight(2.2);
    pg.ellipse(tx, ty, rPulse * 2, rPulse * 2);
    pg.stroke(255, 222, 108, 220);
    pg.strokeWeight(1.4);
    pg.line(tx - rPulse - 5, ty, tx + rPulse + 5, ty);
    pg.line(tx, ty - rPulse - 5, tx, ty + rPulse + 5);

    // Short non-crossing leader line only if target is near the top-left dock (`tx < 560`)
    if (tx < 560) {
      pg.stroke(112, 255, 212, 145);
      pg.strokeWeight(1.4);
      pg.line(px + pw * 0.65, py + ph, tx, ty - rPulse);
    }

    // Compact floating pill right next to the reticle, shifted outside `rig.activeBubbleRect` if needed
    let pillX = tx + rPulse + 8;
    let pillY = ty - 11;
    const br = rig.activeBubbleRect;
    if (br && pillX < br.x2 && pillX + 135 > br.x1 && pillY < br.y2 && pillY + 22 > br.y1) {
      pillY = br.y2 + 6;
    }
    pillX = Math.max(20, Math.min(W - 155, pillX));
    pillY = Math.max(LETTERBOX_TOP + 14, Math.min(H - LETTERBOX_BOTTOM - 32, pillY));

    pg.fill(12, 18, 26, 225);
    pg.stroke(112, 255, 212, 220);
    pg.strokeWeight(1.4);
    pg.rect(pillX, pillY, 138, 20, 10);
    pg.noStroke();
    pg.fill(255, 232, 128);
    pg.textFont('serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(10.8);
    pg.text(`🎯 锁定目标 #0${activeIdx + 1}`, pillX + 69, pillY + 10);

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
    pg.textSize(17.5);
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

  drawForegroundOcclusionWipe(pg, state, W, H) {
    const sx = state.seamScreenX;
    if (sx < -160 || sx > W + 160 || state.leftEra.id === state.rightEra.id) return;

    pg.push();
    const leftId = state.leftEra.id;
    const rightId = state.rightEra.id;
    const roadY = getRoadY(state.seamWorldX, H);

    if (leftId === 'intro' && rightId === 'era01') {
      pg.noFill();
      pg.stroke(248, 214, 128, 235);
      pg.strokeWeight(2.5);
      for (let r = 0; r < 5; r++) {
        pg.arc(sx, roadY - 95, 140 + r * 28, 260 + r * 28, Math.PI * 0.65, Math.PI * 1.45);
      }
      pg.fill(138, 78, 38);
      pg.stroke(38, 20, 10);
      pg.strokeWeight(3);
      pg.quad(sx - 28, roadY, sx + 42, roadY, sx + 32, LETTERBOX_TOP, sx - 18, LETTERBOX_TOP);

      pg.fill(255, 168, 42, 240);
      pg.noStroke();
      pg.triangle(sx - 26, roadY - 165, sx + 6, roadY - 245 - state.beatPulse * 18, sx + 34, roadY - 165);
      pg.fill(255, 238, 138, 245);
      pg.triangle(sx - 12, roadY - 165, sx + 6, roadY - 215, sx + 22, roadY - 165);
      pg.pop();
      return;
    }

    pg.noStroke();
    pg.fill(0, 0, 0, 95);
    pg.rect(sx - 52, LETTERBOX_TOP, 104, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);

    if (rightId === 'era02') {
      pg.fill(78, 48, 24);
      pg.stroke(228, 184, 108);
      pg.strokeWeight(3);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      for (let y = LETTERBOX_TOP + 20; y < H - LETTERBOX_BOTTOM; y += 48) {
        pg.noFill();
        pg.stroke(212, 198, 168);
        pg.strokeWeight(5);
        pg.ellipse(sx, y, 28, 40);
      }
    } else if (rightId === 'era03') {
      pg.fill(42, 68, 58);
      pg.stroke(218, 184, 96);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      for (let y = LETTERBOX_TOP + 40; y < H - LETTERBOX_BOTTOM - 40; y += 90) {
        pg.fill(198, 72, 48);
        pg.rect(sx - 24, y, 48, 36, 4);
        pg.fill(242, 208, 112);
        pg.ellipse(sx - 10, y + 18, 8, 8);
        pg.ellipse(sx + 10, y + 18, 8, 8);
      }
    } else if (rightId === 'era04') {
      pg.fill(242, 236, 224);
      pg.stroke(168, 152, 128);
      pg.strokeWeight(2.5);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      for (let f = -24; f <= 24; f += 12) {
        pg.line(sx + f, LETTERBOX_TOP, sx + f, H - LETTERBOX_BOTTOM);
      }
    } else if (rightId === 'era05') {
      pg.fill(178, 38, 28);
      pg.stroke(245, 202, 88);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      pg.noFill();
      pg.strokeWeight(4);
      pg.beginShape();
      for (let y = LETTERBOX_TOP; y <= H - LETTERBOX_BOTTOM; y += 24) {
        pg.vertex(sx + Math.sin(y * 0.04 + state.t * 4) * 26, y);
      }
      pg.endShape();
    } else if (rightId === 'era06') {
      // Song Dynasty Cyan-Bamboo & Xuan-Scroll Pillar Wipe
      pg.fill(118, 152, 104);
      pg.stroke(42, 58, 38);
      pg.strokeWeight(3);
      pg.rect(sx - 34, LETTERBOX_TOP, 68, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      for (let y = LETTERBOX_TOP + 60; y < H - LETTERBOX_BOTTOM; y += 85) {
        pg.line(sx - 34, y, sx + 34, y);
      }
    } else if (rightId === 'era07') {
      // Ming Blue-and-White Porcelain Pillar Wipe
      pg.fill(246, 250, 255);
      pg.stroke(24, 68, 162);
      pg.strokeWeight(3);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      pg.noFill();
      for (let y = LETTERBOX_TOP + 45; y < H - LETTERBOX_BOTTOM - 40; y += 75) {
        pg.ellipse(sx, y, 36, 36);
      }
    } else if (rightId === 'era08') {
      // Age of Sail Caravel Mast & Inca Gold Sun Pillar Wipe
      pg.fill(118, 72, 34);
      pg.stroke(255, 212, 68);
      pg.strokeWeight(3);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      pg.fill(255, 212, 68);
      pg.ellipse(sx, H * 0.5, 48, 48);
    } else if (rightId === 'era09') {
      // Victorian Riveted Brass Steam-Pipe & Piston Pillar Wipe
      pg.fill(148, 96, 44);
      pg.stroke(255, 218, 88);
      pg.strokeWeight(3);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      for (let y = LETTERBOX_TOP + 36; y < H - LETTERBOX_BOTTOM; y += 48) {
        pg.fill(255, 218, 88);
        pg.ellipse(sx - 22, y, 7, 7);
        pg.ellipse(sx + 22, y, 7, 7);
      }
    } else if (rightId === 'era10') {
      // Faraday Copper Solenoid Coil & Cyan Plasma Pillar Wipe
      pg.fill(22, 36, 54);
      pg.stroke(88, 242, 255);
      pg.strokeWeight(3);
      pg.rect(sx - 36, LETTERBOX_TOP, 72, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      pg.noFill();
      pg.stroke(238, 138, 64);
      pg.strokeWeight(4);
      for (let y = LETTERBOX_TOP + 24; y < H - LETTERBOX_BOTTOM - 20; y += 28) {
        pg.arc(sx, y, 64, 20, 0, Math.PI);
      }
    } else if (rightId === 'era11') {
      pg.fill(38, 24, 82);
      pg.stroke(212, 148, 255);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
    } else if (rightId === 'era12') {
      pg.fill(18, 32, 64);
      pg.stroke(118, 242, 255);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
    } else if (rightId === 'era13') {
      pg.fill(242, 248, 255);
      pg.stroke(28, 118, 218);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
    } else if (rightId === 'era14') {
      pg.fill(12, 42, 24);
      pg.stroke(98, 255, 158);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
    } else if (rightId === 'era15') {
      pg.fill(16, 54, 78);
      pg.stroke(98, 255, 232);
      pg.strokeWeight(3);
      pg.rect(sx - 38, LETTERBOX_TOP, 76, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
    }

    // =========================================================================
    // EMBEDDED VERTICAL PILLAR INSCRIPTION PLAQUE (严格内嵌在 76px 门柱中央的 56px 竖向碑铭匾额，绝不横向挤出门柱半个像素！)
    // =========================================================================
    const pillarTablets = {
      era02: { badge: 'ARK',  from: '岩画', toRows: ['诺', '亚', '方', '舟'], sub: 'תֵּבָה', bg: [38, 24, 14], fg: [255, 224, 118] },
      era03: { badge: '商',   from: '方舟', toRows: ['殷', '商', '朝', '歌'], sub: '卜辞',   bg: [20, 48, 40], fg: [118, 248, 212] },
      era04: { badge: '776',  from: '殷商', toRows: ['Ο', 'Λ', 'Υ', 'Μ'],     sub: 'ΝΙΚΗ',  bg: [148, 48, 28], fg: [255, 236, 148] },
      era05: { badge: '唐',   from: '雅典', toRows: ['盛', '唐', '长', '安'], sub: '750',    bg: [148, 28, 22], fg: [255, 218, 98] },
      era06: { badge: '宋',   from: '盛唐', toRows: ['清', '明', '上', '河'], sub: '汴京',   bg: [42, 66, 58], fg: [218, 246, 228] },
      era07: { badge: '明',   from: '北宋', toRows: ['泼', '墨', '青', '花'], sub: '朱耷',   bg: [16, 48, 128], fg: [248, 252, 255] },
      era08: { badge: '1492', from: '宝船', toRows: ['I', 'N', 'T', 'I'],     sub: 'NAVIS',  bg: [98, 54, 14], fg: [255, 218, 78] },
      era09: { badge: '1889', from: '航海', toRows: ['星', '月', '夜', '旋'], sub: 'ART',    bg: [18, 36, 82], fg: [255, 228, 72] },
      era10: { badge: 'E⊥B',  from: '星月', toRows: ['麦', '克', '斯', '韦'], sub: '1873',   bg: [12, 28, 48], fg: [112, 252, 255] },
      era11: { badge: 'AC',   from: '电报', toRows: ['特', '斯', '拉', '塔'], sub: '1895',   bg: [36, 20, 78], fg: [218, 168, 255] },
      era12: { badge: '4D',   from: '雷电', toRows: ['时', '间', '千', '足'], sub: 'E=mc²',  bg: [14, 28, 58], fg: [255, 228, 108] },
      era13: { badge: '五环', from: '时空', toRows: ['现', '代', '奥', '运'], sub: 'PEACE',  bg: [20, 88, 168], fg: [255, 238, 118] },
      era14: { badge: 'CPU',  from: '奥运', toRows: ['硅', '谷', '开', '源'], sub: '8-BIT',  bg: [10, 38, 22], fg: [98, 255, 158] },
      era15: { badge: '5G/0', from: '硅谷', toRows: ['五', '洲', '互', '联'], sub: 'GLOBE',  bg: [14, 52, 74], fg: [118, 255, 232] },
    };

    const pt = pillarTablets[rightId] || { badge: 'GATE', from: '前幕', toRows: ['时', '空', '之', '门'], sub: 'NEXT', bg: [32, 28, 24], fg: [255, 218, 118] };
    const tabW = 54; // Strictly narrower than the 76px pillar (`54px < 76px`) so it NEVER protrudes!
    const tabY = LETTERBOX_TOP + 26;
    const tabH = 268;

    // Outer recessed carved tablet frame inside the pillar
    pg.fill(pt.bg[0], pt.bg[1], pt.bg[2], 246);
    pg.stroke(pt.fg[0], pt.fg[1], pt.fg[2], 245);
    pg.strokeWeight(2.2);
    pg.rect(sx - tabW * 0.5, tabY, tabW, tabH, 8);
    // Inner double-line filigree border
    pg.noFill();
    pg.stroke(pt.fg[0], pt.fg[1], pt.fg[2], 115);
    pg.strokeWeight(1.0);
    pg.rect(sx - tabW * 0.5 + 4, tabY + 4, tabW - 8, tabH - 8, 5);

    // Tier 1: Top Circular Medallion Crest (`y = tabY + 24`)
    pg.fill(pt.fg[0], pt.fg[1], pt.fg[2], 38);
    pg.stroke(pt.fg[0], pt.fg[1], pt.fg[2], 235);
    pg.strokeWeight(1.6);
    pg.ellipse(sx, tabY + 24, 34, 34);
    pg.noStroke();
    pg.fill(pt.fg[0], pt.fg[1], pt.fg[2], 255);
    pg.textFont('Georgia, serif');
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.textSize(9.5);
    pg.text(pt.badge, sx, tabY + 24);

    // Tier 2: Outgoing Era Label (`from`) + Golden Transition Arrow (`▼`)
    pg.fill(220, 230, 240, 225);
    pg.textFont('"STKaiti", "KaiTi", serif');
    pg.textSize(11.0);
    pg.text(pt.from, sx, tabY + 54);
    pg.fill(255, 214, 78, 245);
    pg.textSize(10.0);
    pg.text('▼', sx, tabY + 72);

    // Tier 3: Vertically Stacked Main Inscription (`toRows`, 4 characters stacked cleanly down the pillar center!)
    pg.fill(pt.fg[0], pt.fg[1], pt.fg[2], 255);
    pg.textFont('"STKaiti", "KaiTi", Georgia, serif');
    pg.textSize(16.5);
    pt.toRows.forEach((ch, idx) => {
      pg.text(ch, sx, tabY + 98 + idx * 32);
    });

    // Tier 4: Bottom Native Script Stamp (`sub`)
    pg.stroke(pt.fg[0], pt.fg[1], pt.fg[2], 140);
    pg.strokeWeight(1.2);
    pg.line(sx - 18, tabY + 228, sx + 18, tabY + 228);
    pg.noStroke();
    pg.fill(255, 238, 158, 245);
    pg.textFont('monospace');
    pg.textSize(10.0);
    pg.text(pt.sub, sx, tabY + 246);

    pg.pop();
  },
};
