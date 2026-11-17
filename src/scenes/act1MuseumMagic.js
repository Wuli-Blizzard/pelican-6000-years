// === src/scenes/act1MuseumMagic.js ===
// Masterpiece Act I V6:
// 1. ZERO God-Ray Bleed into Era 03: Volumetric God-Rays in Era 02 use `getSliceTiming(eraObj, state.t)` and smoothly fade to 0.0 before `sliceProgress = 0.88`, so they NEVER pierce across the transition into Shang Anyang!
// 2. ZERO Overlap in Era 03: Oracle Bone Divination Scroll (`0.04..0.48`) and Variety Show Caption (`0.52..0.92`) are strictly time-multiplexed in separate halves of Era 03!
// 3. Dimensional Art-Medium Immersion & Inception Sky-Folding City (`drawInceptionFoldedSkyCity`) in Era 00 & Era 05!

function drawContinuousPhysicalRoad(pg, eraObj, state, xMin, xMax, H) {
  pg.push();
  const step = 16;
  const startX = Math.max(0, Math.floor(xMin));
  const endX = Math.min(pg.width, Math.ceil(xMax));

  if (eraObj.id === 'era02') {
    pg.fill(64, 42, 24);
    pg.stroke(32, 20, 12);
    pg.strokeWeight(2);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstPost = Math.floor((state.cameraLeftWorldX + startX) / 88);
    const lastPost = Math.ceil((state.cameraLeftWorldX + endX) / 88);
    for (let p = firstPost; p <= lastPost; p++) {
      const wx = p * 88;
      const sx = wx - state.cameraLeftWorldX;
      const dy = getRoadY(wx, H);
      pg.fill(92, 60, 34);
      pg.stroke(30, 18, 10);
      pg.strokeWeight(1.8);
      pg.rect(sx - 6, dy, 12, H - dy);
      pg.rect(sx - 4, dy - 28, 8, 28, 2);
    }

    pg.noFill();
    pg.stroke(178, 132, 76);
    pg.strokeWeight(3.2);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H) - 24);
    }
    pg.endShape();

    pg.stroke(218, 174, 114);
    pg.strokeWeight(6.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era03') {
    pg.fill(22, 30, 28);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstBrick = Math.floor((state.cameraLeftWorldX + startX) / 72);
    const lastBrick = Math.ceil((state.cameraLeftWorldX + endX) / 72);
    for (let b = firstBrick; b <= lastBrick; b++) {
      const wx = b * 72;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(42, 78, 68);
      pg.stroke(218, 188, 108, 210);
      pg.strokeWeight(1.8);
      pg.rect(sx, ry, 70, 16, 2);
      pg.line(sx + 12, ry + 8, sx + 58, ry + 8);
    }
  }

  else if (eraObj.id === 'era04') {
    pg.fill(28, 22, 18);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstBlock = Math.floor((state.cameraLeftWorldX + startX) / 76);
    const lastBlock = Math.ceil((state.cameraLeftWorldX + xMax) / 76);
    for (let b = firstBlock; b <= lastBlock; b++) {
      const wx = b * 76;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(236, 152, 82);
      pg.stroke(24, 18, 15);
      pg.strokeWeight(1.8);
      pg.rect(sx, ry, 74, 14, 2);
    }
  }

  else if (eraObj.id === 'era05') {
    pg.fill(58, 36, 26);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstPost = Math.floor((state.cameraLeftWorldX + startX) / 100);
    const lastPost = Math.ceil((state.cameraLeftWorldX + endX) / 100);
    for (let p = firstPost; p <= lastPost; p++) {
      const wx = p * 100;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(178, 48, 36);
      pg.stroke(42, 24, 16);
      pg.strokeWeight(1.8);
      pg.rect(sx - 4, ry - 30, 8, 30);
      pg.fill(232, 188, 92);
      pg.ellipse(sx, ry - 33, 12, 10);
    }

    pg.noFill();
    pg.stroke(188, 52, 38);
    pg.strokeWeight(3.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H) - 22);
    }
    pg.endShape();

    pg.stroke(62, 42, 28);
    pg.strokeWeight(5.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era06') {
    // Northern Song Bianjing Stone Embankment & Woven Timber Rainbow Bridge Road
    pg.fill(172, 168, 154);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstPost = Math.floor((state.cameraLeftWorldX + startX) / 92);
    const lastPost = Math.ceil((state.cameraLeftWorldX + endX) / 92);
    for (let p = firstPost; p <= lastPost; p++) {
      const wx = p * 92;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(118, 82, 46);
      pg.stroke(42, 34, 24);
      pg.strokeWeight(1.8);
      pg.rect(sx - 4, ry - 26, 8, 26);
    }
    pg.noFill();
    pg.stroke(108, 74, 42);
    pg.strokeWeight(4.2);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H) - 20);
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era07') {
    // Yuan-Ming-Qing Grand Canal White-Marble & Cobalt Blue Porcelain Tile Towpath
    pg.fill(238, 244, 252);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstTile = Math.floor((state.cameraLeftWorldX + startX) / 76);
    const lastTile = Math.ceil((state.cameraLeftWorldX + endX) / 76);
    for (let b = firstTile; b <= lastTile; b++) {
      const wx = b * 76;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(248, 250, 255);
      pg.stroke(24, 68, 162);
      pg.strokeWeight(2.0);
      pg.rect(sx, ry, 74, 16, 2);
      pg.fill(28, 78, 178);
      pg.noStroke();
      pg.ellipse(sx + 37, ry + 8, 8, 8);
    }
  }

  else if (eraObj.id === 'era08') {
    // Andean Inca Polygonal Megalithic Stone Road & Caravel Oak Deck
    pg.fill(118, 92, 62);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstStone = Math.floor((state.cameraLeftWorldX + startX) / 84);
    const lastStone = Math.ceil((state.cameraLeftWorldX + endX) / 84);
    for (let s = firstStone; s <= lastStone; s++) {
      const wx = s * 84;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(188, 158, 108);
      pg.stroke(48, 32, 18);
      pg.strokeWeight(2.0);
      pg.quad(sx, ry, sx + 82, ry, sx + 76, ry + 18, sx + 6, ry + 18);
    }
  }

  else if (eraObj.id === 'era09') {
    // Victorian Iron Railway Sleepers & Red-Brick Industrial Viaduct Road
    pg.fill(44, 34, 30);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    const firstTie = Math.floor((state.cameraLeftWorldX + startX) / 48);
    const lastTie = Math.ceil((state.cameraLeftWorldX + endX) / 48);
    for (let k = firstTie; k <= lastTie; k++) {
      const wx = k * 48;
      const sx = wx - state.cameraLeftWorldX;
      const ry = getRoadY(wx, H);
      pg.fill(112, 68, 42);
      pg.stroke(24, 18, 14);
      pg.strokeWeight(1.6);
      pg.rect(sx, ry + 2, 34, 10, 2);
    }
    pg.noFill();
    pg.stroke(218, 198, 142);
    pg.strokeWeight(4.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era10') {
    // Faraday Electromagnetic Harbor Steel Deck & Glowing Submarine Telegraph Conduit
    pg.fill(18, 28, 42);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    pg.noFill();
    pg.stroke(228, 128, 58);
    pg.strokeWeight(5.0);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H) + 8);
    }
    pg.endShape();
    pg.stroke(88, 242, 255);
    pg.strokeWeight(3.0);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era11') {
    // Nikola Tesla AC High-Voltage Copper Busbar & Porcelain Insulator Road
    pg.fill(24, 18, 48);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);
    pg.noFill();
    pg.stroke(212, 148, 255);
    pg.strokeWeight(4.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era12') {
    // Einstein 4D Curved Spacetime Geodesic Light-Bridge Road
    pg.fill(12, 18, 38, 225);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);
    pg.noFill();
    pg.stroke(255, 224, 98);
    pg.strokeWeight(4.0);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era13') {
    // Modern Olympic Terracotta-Red Tartan Synthetic Running Track with White Lanes!
    pg.fill(198, 56, 42);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);
    pg.noFill();
    for (let lane = 0; lane < 3; lane++) {
      pg.stroke(255, 255, 255, 225);
      pg.strokeWeight(2.2);
      pg.beginShape();
      for (let sx = startX; sx <= endX; sx += step) {
        pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H) + lane * 14);
      }
      pg.endShape();
    }
  }

  else if (eraObj.id === 'era14') {
    // Silicon Valley Green PCB Gold-Trace Motherboard Bus Road!
    pg.fill(12, 58, 32);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);
    pg.noFill();
    pg.stroke(98, 255, 158);
    pg.strokeWeight(3.8);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else if (eraObj.id === 'era15') {
    // Globalization Aurora Fiber-Optic & Maglev Glass Skyway
    pg.fill(14, 44, 68);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);
    pg.noFill();
    pg.stroke(118, 255, 232);
    pg.strokeWeight(4.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  else {
    pg.fill(52, 30, 18);
    pg.noStroke();
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.vertex(endX, H);
    pg.vertex(startX, H);
    pg.endShape(pg.CLOSE);

    pg.noFill();
    pg.stroke(232, 174, 108, 245);
    pg.strokeWeight(5.5);
    pg.beginShape();
    for (let sx = startX; sx <= endX; sx += step) {
      pg.vertex(sx, getRoadY(state.cameraLeftWorldX + sx, H));
    }
    pg.endShape();
  }

  pg.pop();
}

function renderForegroundRackFocusProps(pg, eraObj, state, xMin, xMax, W, H) {
  const { t, beatPulse } = state;
  pg.push();

  const startProp = Math.floor((state.cameraLeftWorldX * 1.25 + xMin) / 460);
  const endProp = Math.ceil((state.cameraLeftWorldX * 1.25 + xMax) / 460);

  for (let p = startProp; p <= endProp; p++) {
    const wx = p * 460;
    const sx = wx - state.cameraLeftWorldX * 1.25;
    if (sx < xMin - 80 || sx > xMax + 80) continue;
    const baseY = H - LETTERBOX_BOTTOM - 8;

    if (eraObj.id === 'era01') {
      pg.fill(255, 138, 38, 215);
      pg.noStroke();
      pg.triangle(sx - 20, baseY + 6, sx, baseY - 26 - beatPulse * 8, sx + 20, baseY + 6);
      pg.fill(188, 86, 42);
      pg.stroke(38, 20, 10);
      pg.strokeWeight(2);
      pg.ellipse(sx, baseY - 14, 38, 30);
      pg.noStroke();
      pg.fill(255, 240, 215, 180);
      pg.ellipse(sx - 6 + Math.sin(t * 6 + p) * 4, baseY - 36 - ((t * 30) % 24), 7, 7);
    } else if (eraObj.id === 'era02') {
      const sprayH = 18 + Math.abs(Math.sin(t * 7 + p)) * 26;
      pg.noStroke();
      pg.fill(235, 248, 255, 210);
      pg.ellipse(sx, baseY - sprayH * 0.4, 44, sprayH);
      pg.ellipse(sx - 18, baseY - sprayH * 0.7, 16, 16);
      pg.ellipse(sx + 18, baseY - sprayH * 0.6, 14, 14);
    } else if (eraObj.id === 'era03') {
      pg.fill(128, 64, 42);
      pg.stroke(242, 198, 92);
      pg.strokeWeight(2);
      pg.rect(sx - 24, baseY - 38, 48, 38, 4);
      pg.fill(255, 196, 58);
      pg.noStroke();
      pg.ellipse(sx, baseY - 38, 32, 10);
      pg.rect(sx - 4, baseY - 38, 8, 26);
      for (let sp = 0; sp < 4; sp++) {
        const ang = -Math.PI * 0.25 - sp * 0.4;
        const rad = ((t * 60 + sp * 12) % 36);
        pg.fill(255, 232, 118, 220);
        pg.ellipse(sx + Math.cos(ang) * rad, baseY - 38 + Math.sin(ang) * rad, 4, 4);
      }
    } else if (eraObj.id === 'era04') {
      pg.fill(228, 128, 64);
      pg.stroke(22, 18, 15);
      pg.strokeWeight(2);
      pg.ellipse(sx, baseY - 18, 28, 38);
      pg.rect(sx - 6, baseY - 44, 12, 12);
    } else if (eraObj.id === 'era05') {
      pg.push();
      pg.translate(sx, baseY - 18);
      pg.rotate(t * 1.4);
      pg.noFill();
      pg.stroke(148, 92, 44);
      pg.strokeWeight(2.5);
      pg.ellipse(0, 0, 48, 48);
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        pg.line(0, 0, Math.cos(a) * 24, Math.sin(a) * 24);
      }
      pg.pop();
    } else if (eraObj.id === 'era06') {
      // Northern Song "Jiaozi" World's First Paper Banknote & Movable-Type Block!
      pg.fill(236, 224, 194);
      pg.stroke(168, 48, 36);
      pg.strokeWeight(2.0);
      pg.rect(sx - 18, baseY - 40, 36, 38, 3);
      pg.fill(168, 48, 36);
      pg.noStroke();
      pg.textFont('serif');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(10);
      pg.text('交子', sx, baseY - 21);
    } else if (eraObj.id === 'era07') {
      // Jingdezhen Blue-and-White Porcelain Lotus Jar ("元青花缠枝莲大罐")
      pg.fill(248, 250, 255);
      pg.stroke(24, 68, 162);
      pg.strokeWeight(2.2);
      pg.ellipse(sx, baseY - 18, 34, 36);
      pg.rect(sx - 10, baseY - 40, 20, 8, 2);
      pg.fill(28, 78, 178);
      pg.noStroke();
      pg.ellipse(sx, baseY - 18, 14, 14);
    } else if (eraObj.id === 'era08') {
      // Golden Brass Mariner's Astrolabe & Cocoa Pod
      pg.noFill();
      pg.stroke(255, 212, 72);
      pg.strokeWeight(2.5);
      pg.ellipse(sx, baseY - 20, 38, 38);
      pg.line(sx - 18, baseY - 20, sx + 18, baseY - 20);
      pg.line(sx, baseY - 38, sx, baseY - 2);
    } else if (eraObj.id === 'era09') {
      // Bubbling Fluorescent Chemistry Retort Flask ("李比希化学蒸馏烧瓶")
      pg.fill(72, 252, 168, 215);
      pg.stroke(235, 248, 255);
      pg.strokeWeight(2.0);
      pg.ellipse(sx, baseY - 16, 32, 28);
      pg.rect(sx - 5, baseY - 40, 10, 14, 2);
      pg.fill(255, 218, 78);
      pg.noStroke();
      pg.ellipse(sx, baseY - 44 - ((t * 25 + p * 7) % 14), 6, 6);
    } else if (eraObj.id === 'era10') {
      // Faraday Glowing Copper Solenoid & Morse Insulator Tower
      pg.fill(198, 104, 46);
      pg.stroke(88, 242, 255);
      pg.strokeWeight(2.0);
      pg.rect(sx - 12, baseY - 38, 24, 34, 4);
      pg.noFill();
      pg.ellipse(sx, baseY - 44, 18 + beatPulse * 10, 18 + beatPulse * 10);
    }
  }
  pg.pop();
}

function renderDynamicWeather(pg, eraObj, state, xMin, xMax, W, H) {
  const { t, beatPulse } = state;
  const { sliceProgress, seamFade } = getSliceTiming(eraObj, t);
  pg.push();

  if (eraObj.id === 'era01') {
    const roarBoost = (state.cam && state.cam.lionGroundTremor) ? state.cam.lionGroundTremor : 0;
    pg.noStroke();
    for (let i = 0; i < 36; i++) {
      const px = xMin + ((hash11(i * 7.1) * W - t * 85) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const py = 110 + ((hash11(i * 13.3) * 440 + Math.sin(t * 4 + i) * (24 + roarBoost * 28)) % 440);
      pg.fill(255, 215, 105, Math.round((155 + Math.sin(t * 6 + i) * 65) * seamFade));
      pg.ellipse(px, py, 5 + roarBoost * 3.5, 5 + roarBoost * 3.5);
    }
  }

  else if (eraObj.id === 'era02') {
    const rainAlpha = Math.max(0, Math.min(1, (0.52 - sliceProgress) * 2.8)) * seamFade;
    if (rainAlpha > 0.02) {
      pg.stroke(205, 236, 255, Math.round(175 * rainAlpha));
      pg.strokeWeight(1.8);
      for (let i = 0; i < 64; i++) {
        const rx = ((i * 73 - t * 280) % W + W) % W;
        if (rx < xMin || rx > xMax) continue;
        const ry = LETTERBOX_TOP + ((i * 137 + t * 680) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM));
        pg.line(rx, ry, rx - 16, ry + 32);
      }

      if (state.cam && state.cam.lightningFlash > 0.05) {
        const lx = W * 0.32 + Math.sin(Math.floor(t * 4)) * 180;
        if (lx >= xMin + 40 && lx <= xMax - 40) {
          pg.stroke(235, 248, 255, Math.round(245 * seamFade));
          pg.strokeWeight(4.2);
          pg.noFill();
          pg.beginShape();
          let curX = lx, curY = LETTERBOX_TOP;
          pg.vertex(curX, curY);
          for (let seg = 1; seg <= 6; seg++) {
            curX += (hash11(seg * 19 + Math.floor(t * 10)) - 0.5) * 56;
            curY += 58;
            pg.vertex(curX, curY);
          }
          pg.endShape();
        }
      }
    }

    // FIXED VOLUMETRIC GOD-RAYS:
    // Uses `sliceProgress` of `era02`, peaks around `sliceProgress = 0.65`, and fades out completely to 0.0 by `sliceProgress = 0.88`!
    // Also stays strictly bounded to the Ark's cloud break (`araratX`) so it NEVER pierces or clips across the seam into `era03`!
    if (sliceProgress > 0.44 && sliceProgress < 0.88) {
      const sunBell = Math.sin(((sliceProgress - 0.44) / 0.44) * Math.PI) * seamFade;
      const araratX = W * 0.54 - (state.cameraLeftWorldX - TIMELINE[2].worldStartX) * 0.10;
      if (sunBell > 0.02 && araratX > xMin + 80 && araratX < xMax - 120) {
        pg.noStroke();
        for (let b = -1; b <= 1; b++) {
          pg.fill(255, 236, 158, Math.round(24 * sunBell));
          const rayTopX = araratX + b * 24;
          const rayBotL = Math.max(xMin + 20, Math.min(xMax - 60, araratX - 110 + b * 75));
          const rayBotR = Math.max(xMin + 20, Math.min(xMax - 60, araratX - 35 + b * 75));
          pg.triangle(rayTopX, LETTERBOX_TOP, rayBotL, 420, rayBotR, 420);
        }
      }
    }
  }

  else if (eraObj.id === 'era03') {
    pg.noStroke();
    for (let i = 0; i < 32; i++) {
      const ex = ((i * 89 - t * 75) % W + W) % W;
      if (ex < xMin || ex > xMax) continue;
      const ey = H - 80 - ((i * 67 + t * 95) % 460);
      pg.fill(i % 2 === 0 ? [255, 198, 72, Math.round(210 * seamFade)] : [92, 248, 214, Math.round(190 * seamFade)]);
      pg.ellipse(ex, ey, 5, 5);
    }
  }

  else if (eraObj.id === 'era04') {
    if (sliceProgress > 0.12 && sliceProgress < 0.88) {
      pg.stroke(255, 236, 148, Math.round((165 + beatPulse * 85) * seamFade));
      pg.strokeWeight(2.4);
      for (let s = 0; s < 24; s++) {
        const ly = LETTERBOX_TOP + 20 + (s * 25) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 40);
        const len = 105 + (s * 53) % 140;
        if (xMin <= 10) pg.line(0, ly, len, ly - 10);
        if (xMax >= W - 10) pg.line(W - len, ly + 8, W, ly - 2);
      }
    }
  }

  else if (eraObj.id === 'era05') {
    pg.noStroke();
    for (let i = 0; i < 42; i++) {
      const px = ((i * 79 - t * 135) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const swirlY = Math.sin(px * 0.012 + t * 4 + i) * 38;
      const py = LETTERBOX_TOP + 35 + ((i * 59 + t * 45 + swirlY) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 70));
      pg.push();
      pg.translate(px, py);
      pg.rotate(t * 3.5 + i);
      pg.fill(i % 4 === 0 ? [255, 218, 108, Math.round(220 * seamFade)] : [248, 138, 158, Math.round(225 * seamFade)]);
      pg.ellipse(0, 0, 9.5, 5.0);
      pg.pop();
    }
  }

  else if (eraObj.id === 'era06') {
    // Misty Jiangnan Spring Rain & Floating Bi Sheng Movable-Type Characters!
    pg.stroke(92, 118, 108, Math.round(145 * seamFade));
    pg.strokeWeight(1.4);
    for (let i = 0; i < 40; i++) {
      const rx = ((i * 83 - t * 140) % W + W) % W;
      if (rx < xMin || rx > xMax) continue;
      const ry = LETTERBOX_TOP + ((i * 113 + t * 380) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM));
      pg.line(rx, ry, rx - 8, ry + 22);
    }
  }

  else if (eraObj.id === 'era07') {
    // Glowing Canal Lantern Sparks & Porcelain Glaze Shimmers
    pg.noStroke();
    for (let i = 0; i < 30; i++) {
      const px = ((i * 97 - t * 90) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const py = LETTERBOX_TOP + 40 + ((i * 71 + Math.sin(t * 3 + i) * 30) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 80));
      pg.fill(i % 2 === 0 ? [38, 108, 224, Math.round(195 * seamFade)] : [255, 212, 88, Math.round(210 * seamFade)]);
      pg.ellipse(px, py, 5.5, 5.5);
    }
  }

  else if (eraObj.id === 'era08') {
    // Golden Nautical Compass Sparks & Trade-Wind Spray
    pg.noStroke();
    for (let i = 0; i < 32; i++) {
      const px = ((i * 89 - t * 120) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const py = LETTERBOX_TOP + 50 + ((i * 67 + Math.sin(t * 4 + i) * 25) % (H - LETTERBOX_TOP - LETTERBOX_BOTTOM - 90));
      pg.fill(255, 218, 82, Math.round(205 * seamFade));
      pg.ellipse(px, py, 5, 5);
    }
  }

  else if (eraObj.id === 'era09') {
    // Van Gogh Starry Night Swirling Impasto Brushstrokes & Rising Steam!
    pg.noFill();
    for (let i = 0; i < 28; i++) {
      const px = ((i * 93 - t * 110) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const py = LETTERBOX_TOP + 45 + (i * 47) % 240;
      pg.stroke(i % 2 === 0 ? [255, 224, 78, Math.round(215 * seamFade)] : [98, 248, 192, Math.round(205 * seamFade)]);
      pg.strokeWeight(3.2);
      pg.arc(px, py, 26, 14, t * 2 + i, t * 2 + i + 1.4);
    }
  }

  else if (eraObj.id === 'era10') {
    // Pulsing Cyan Electromagnetic Field Particles & Morse Light Dots!
    pg.noStroke();
    for (let i = 0; i < 34; i++) {
      const px = ((i * 83 - t * 165) % W + W) % W;
      if (px < xMin || px > xMax) continue;
      const py = LETTERBOX_TOP + 45 + (i * 53) % 340;
      pg.fill(i % 3 === 0 ? [255, 196, 78, Math.round(225 * seamFade)] : [88, 242, 255, Math.round(225 * seamFade)]);
      pg.rect(px, py, i % 2 === 0 ? 12 : 5, 4, 2);
    }
  }

  pg.pop();
}

function renderNightAtMuseumCrossovers(pg, state, rig) {
  const { seamScreenX: sx, leftEra, rightEra, beatPulse } = state;
  if (sx < -220 || sx > pg.width + 220 || leftEra.id === rightEra.id) return;

  const H = pg.height;
  const roadY = getRoadY(state.seamWorldX, H);
  pg.push();

  pg.fill(158, 112, 62);
  pg.stroke(38, 24, 14);
  pg.strokeWeight(2.2);
  pg.quad(sx - 85, roadY - 4, sx + 85, roadY - 4, sx + 74, roadY + 16, sx - 74, roadY + 16);
  pg.noFill();
  pg.stroke(195, 148, 86);
  pg.strokeWeight(3.5);
  pg.arc(sx, roadY + 30, 145, 44, Math.PI, Math.PI * 2);

  BrushKit.drawForegroundOcclusionWipe(pg, state, pg.width, H);

  if (leftEra.id === 'era03' && rightEra.id === 'era04') {
    pg.push();
    pg.translate(sx - 56, roadY - 82);
    pg.fill(64, 198, 168, 240);
    pg.stroke(242, 202, 96);
    pg.strokeWeight(2.0);
    pg.ellipse(0, -32, 18, 18);
    pg.quad(-12, -18, 12, -18, 8, 24, -8, 24);
    pg.strokeWeight(4);
    pg.line(8, -14, 48, -26);
    pg.noStroke();
    pg.fill(255, 195, 55, 245);
    pg.triangle(42, -30, 52, -66 - beatPulse * 12, 62, -30);
    pg.pop();
  }

  pg.pop();
}

/**
 * IN-SCENE ARTISTIC CALLOUTS (Strictly non-occluding & time-multiplexed!)
 * - In Era 03: Oracle Bone Divination Scroll appears ONLY during `sliceProgress = 0.04..0.48`, fading out completely before the Variety Show Caption appears at `0.52..0.92`!
 */
function renderArtisticNonOccludingTypography(pg, eraObj, state, rig, xMin, xMax, W, H) {
  if (eraObj.id !== state.era.id) return;
  const { sliceProgress, seamFade } = getSliceTiming(eraObj, state.t);
  pg.push();

  // Helper to draw a strictly auto-fitted, culturally-fonted banner in the upper-center/right sky lane (NEVER overflows border!)
  const drawAutoBanner = (cx, topY, textStr, fontStr, fontSize, bgCol, borderCol, textCol) => {
    pg.textFont(fontStr);
    pg.textSize(fontSize);
    const tw = pg.textWidth(textStr);
    const bw = Math.max(240, tw + 36);
    const bh = 34;
    const clampedCx = Math.max(455 + bw * 0.5, Math.min(W - 22 - bw * 0.5, cx));
    pg.fill(bgCol[0], bgCol[1], bgCol[2], bgCol[3] ?? 232);
    pg.stroke(borderCol[0], borderCol[1], borderCol[2], borderCol[3] ?? 240);
    pg.strokeWeight(2.0);
    pg.rect(clampedCx - bw * 0.5, topY, bw, bh, 17);
    pg.noStroke();
    pg.fill(textCol[0], textCol[1], textCol[2], textCol[3] ?? 250);
    pg.textAlign(pg.CENTER, pg.CENTER);
    pg.text(textStr, clampedCx, topY + bh * 0.52);
  };

  if (eraObj.id === 'era03' && sliceProgress > 0.04 && sliceProgress < 0.48) {
    const narrFade = Math.sin(((sliceProgress - 0.04) / 0.44) * Math.PI) * seamFade;
    if (narrFade > 0.02) {
      const na = Math.round(235 * narrFade);
      const bx = W - 215;
      const by = LETTERBOX_TOP + 54;
      pg.fill(20, 28, 26, Math.round(220 * narrFade));
      pg.stroke(238, 198, 98, na);
      pg.strokeWeight(2.0);
      pg.rect(bx - 195, by - 38, 390, 82, 8);

      const glyphs = [
        { type: 'bu',   label: '【卜】灼龟裂兆' },
        { type: 'niao', label: '【玄鸟】降而生商' },
        { type: 'che',  label: '【车】青铜双轮' },
        { type: 'ma',   label: '【商】大邑朝歌' },
      ];
      glyphs.forEach((g, idx) => {
        const gx = bx - 132 + idx * 88;
        BrushKit.drawOracleBoneGlyph(pg, gx, by - 9, 24, g.type, [242, 92, 62, na]);
        pg.noStroke();
        pg.fill(242, 232, 204, na);
        pg.textFont('"STKaiti", "KaiTi", serif');
        pg.textAlign(pg.CENTER, pg.CENTER);
        pg.textSize(10.8);
        pg.text(g.label, gx, by + 16);
      });
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.fill(128, 245, 212, na);
      pg.textSize(10.8);
      pg.text('《殷墟卜辞》：「癸巳卜，王贞：玄鸟御青铜车巡朝歌，大吉！」', bx, by + 33);
    }
  } else if (eraObj.id === 'era05' && seamFade > 0.1) {
    const pa = Math.round(230 * seamFade);
    drawAutoBanner(
      W - 215, LETTERBOX_TOP + 8,
      '「九天阊阖开宫殿，万国衣冠拜冕旒」· 盛唐天宝',
      '"STKaiti", "KaiTi", serif', 15.5,
      [238, 224, 192, pa], [138, 92, 42, pa], [42, 26, 18, pa]
    );
  } else if (eraObj.id === 'era06' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    const chars = ['清', '明', '上', '河', '大', '江', '东', '去'];
    chars.forEach((ch, idx) => {
      const cx = 478 + idx * 42;
      const stampBounce = (idx === Math.floor(state.beat) % 8) ? state.beatPulse * 10 : 0;
      const cy = LETTERBOX_TOP + 32 + Math.sin(state.t * 4 + idx * 0.7) * 5 + stampBounce;
      pg.fill(stampBounce > 3 ? [188, 42, 32, pa] : [158, 108, 68, pa]);
      pg.stroke(42, 30, 20, pa);
      pg.strokeWeight(1.8);
      pg.rect(cx - 16, cy - 16, 32, 32, 3);
      pg.noStroke();
      pg.fill(252, 244, 224, pa);
      pg.textFont('"STFangsong", "Songti SC", serif');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(15.5);
      pg.text(ch, cx, cy);
    });
  } else if (eraObj.id === 'era07' && seamFade > 0.1) {
    const pa = Math.round(232 * seamFade);
    drawAutoBanner(
      645, LETTERBOX_TOP + 12,
      '《八大山人泼墨 × 景德镇青花》：「墨点无多泪点多 · 云帆高张昼夜星驰」',
      '"STKaiti", "KaiTi", serif', 13.0,
      [248, 250, 255, pa], [24, 68, 162, pa], [20, 56, 142, pa]
    );
  } else if (eraObj.id === 'era08' && seamFade > 0.1) {
    const pa = Math.round(232 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 82,
      'MUNDUS NOVUS 1492 × INTI TAWANTINSUYU · 跨大西洋大航海与印加太阳城',
      'Palatino, Georgia, "Times New Roman", serif', 12.5,
      [42, 28, 16, pa], [255, 212, 72, pa], [255, 228, 118, pa]
    );
  } else if (eraObj.id === 'era09' && seamFade > 0.1) {
    const pa = Math.round(232 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'La Nuit Étoilée (Vincent 1889) × Mendeleïev (1869) & Darwin · 机械与油画共生',
      'Georgia, "Times New Roman", serif', 12.2,
      [16, 32, 58, pa], [255, 222, 82, pa], [118, 255, 198, pa]
    );
  } else if (eraObj.id === 'era10' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    drawAutoBanner(
      650, LETTERBOX_TOP + 12,
      'MAXWELL (1873): ∇×E = -∂B/∂t  |  ∇×B = μ₀J + μ₀ε₀∂E/∂t',
      '"Courier New", Consolas, monospace', 12.2,
      [10, 22, 38, pa], [88, 242, 255, pa], [118, 252, 255, pa]
    );
  } else if (eraObj.id === 'era11' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'NIKOLA TESLA (1895): AC POLYPHASE SYSTEM · 尼亚加拉水电点亮世界',
      'Georgia, "Times New Roman", serif', 12.2,
      [24, 16, 48, pa], [212, 148, 255, pa], [238, 218, 255, pa]
    );
  } else if (eraObj.id === 'era12' && seamFade > 0.1) {
    const pa = Math.round(238 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'VONNEGUT × EINSTEIN: 「高维生物一眼看去，人是从出生到现在拖着的一整条时间千足虫」',
      'Georgia, "Songti SC", serif', 11.8,
      [12, 20, 44, pa], [255, 224, 98, pa], [255, 242, 168, pa]
    );
  } else if (eraObj.id === 'era13' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'CITIUS · ALTIUS · FORTIUS — 现代奥林匹克五环升起与全球和平发展',
      'Georgia, "Times New Roman", serif', 12.5,
      [18, 58, 128, pa], [255, 218, 68, pa], [255, 248, 218, pa]
    );
  } else if (eraObj.id === 'era14' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'SILICON VALLEY ➔ OPEN SOURCE: TCP/IP · WWW · HELLO WORLD!',
      '"Courier New", Consolas, monospace', 12.2,
      [10, 34, 20, pa], [98, 255, 158, pa], [148, 255, 188, pa]
    );
  } else if (eraObj.id === 'era15' && seamFade > 0.1) {
    const pa = Math.round(235 * seamFade);
    drawAutoBanner(
      648, LETTERBOX_TOP + 12,
      'GLOBAL OPEN COLLABORATION · 亚欧非美拉五洲互联与跨国高铁地球村',
      '"Inter", "Noto Sans SC", sans-serif', 12.2,
      [12, 38, 58, pa], [98, 255, 232, pa], [218, 255, 248, pa]
    );
  }

  pg.pop();
}

function drawMigratingAfricanElephant(pg, ex, ey, scale, t, idx, isLeader = false) {
  pg.push();
  pg.translate(ex, ey);
  pg.scale(scale);
  const walk = Math.sin(t * 4.8 + idx * 1.4) * 8;
  const earFlap = Math.sin(t * 6.5 + idx) * 5;

  pg.noStroke();
  pg.fill(0, 0, 0, 75);
  pg.ellipse(0, 2, 110, 12);

  pg.fill(78, 66, 58);
  pg.stroke(32, 20, 14);
  pg.strokeWeight(2.0);
  pg.rect(-34 + walk * 0.5, -36, 14, 36, 3);
  pg.rect(-16 - walk * 0.5, -36, 14, 36, 3);
  pg.rect(14 - walk * 0.6, -38, 15, 38, 3);
  pg.rect(28 + walk * 0.6, -38, 15, 38, 3);

  pg.fill(96, 82, 72);
  pg.stroke(32, 20, 14);
  pg.strokeWeight(2.4);
  pg.beginShape();
  pg.vertex(-44, -32);
  pg.bezierVertex(-48, -76, -12, -86, 28, -76);
  pg.bezierVertex(46, -70, 48, -32, 34, -26);
  pg.vertex(-40, -26);
  pg.endShape(pg.CLOSE);

  pg.strokeWeight(2.5);
  pg.line(-44, -52, -56 - Math.abs(walk) * 0.4, -28);

  const trunkLift = isLeader ? Math.sin(t * 4.0) * 10 : Math.sin(t * 3.0 + idx) * 6;
  pg.fill(102, 88, 78);
  pg.ellipse(42, -62, 36, 34);

  pg.noFill();
  pg.stroke(96, 82, 72);
  pg.strokeWeight(11);
  if (isLeader) {
    pg.bezier(54, -62, 78, -60, 84, -95 + trunkLift, 68, -112 + trunkLift);
    pg.stroke(32, 20, 14);
    pg.strokeWeight(2.0);
    pg.bezier(54, -62, 78, -60, 84, -95 + trunkLift, 68, -112 + trunkLift);
    pg.noStroke();
    pg.fill(255, 224, 138, 210);
    for (let d = 0; d < 5; d++) {
      const ang = -1.8 + d * 0.35;
      const rad = 12 + ((t * 45 + d * 9) % 28);
      pg.ellipse(68 + Math.cos(ang) * rad, -112 + trunkLift + Math.sin(ang) * rad, 5, 5);
    }
  } else {
    pg.bezier(54, -62, 74, -54, 72, -26 + trunkLift, 58, -18 + trunkLift);
  }

  pg.fill(84, 70, 62);
  pg.stroke(32, 20, 14);
  pg.strokeWeight(2.2);
  pg.ellipse(26 - earFlap * 0.4, -62, 32 + earFlap, 42);

  pg.noFill();
  pg.stroke(255, 248, 228);
  pg.strokeWeight(5.0);
  pg.arc(62, -56, 38, 26, 0.1, Math.PI * 0.78);
  pg.stroke(32, 20, 14);
  pg.strokeWeight(1.4);
  pg.arc(62, -56, 40, 28, 0.1, Math.PI * 0.78);

  pg.fill(255, 218, 98);
  pg.noStroke();
  pg.ellipse(48, -66, 4.5, 4.5);

  pg.pop();
}

function renderEraSlice(pg, eraObj, state, rig, xMin, xMax) {
  const W = pg.width;
  const H = pg.height;
  const clipW = Math.max(1, xMax - xMin);
  const { t, beatPulse, cam } = state;
  const { sliceProgress } = getSliceTiming(eraObj, t);
  const bgScale = cam ? cam.bgDollyScale : 1.0;

  pg.push();
  const ctx = pg.drawingContext;
  ctx.save();
  ctx.beginPath();
  ctx.rect(xMin, LETTERBOX_TOP, clipW, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
  ctx.clip();

  if (cam && (Math.abs(cam.camZoom - 1.0) > 0.002 || Math.abs(cam.dutchRoll) > 0.001)) {
    pg.translate(rig.centerX, rig.groundY - 110);
    pg.rotate(cam.dutchRoll);
    pg.scale(cam.camZoom);
    pg.translate(-rig.centerX, -(rig.groundY - 110));
  }

  if (eraObj.id === 'intro') {
    pg.fill(44, 34, 25);
    pg.noStroke();
    pg.rect(xMin, 0, clipW, H);
    pg.stroke(195, 162, 108, 42);
    pg.strokeWeight(1);
    for (let x = Math.floor(xMin / 64) * 64; x <= xMax; x += 64) pg.line(x, 0, x, H);
    for (let y = 0; y < H; y += 64) pg.line(xMin, y, xMax, y);

    // Inception Folded Blueprint Sky-City!
    BrushKit.drawInceptionFoldedSkyCity(pg, 'intro', state, xMin, xMax, W, H);

    pg.noFill();
    pg.stroke(238, 198, 124, 135);
    pg.strokeWeight(1.8);
    pg.triangle(W * 0.55, 420, W * 0.72, 175, W * 0.88, 420);
    pg.line(W * 0.82, 470, W * 0.82, 310);
    pg.ellipse(W * 0.82, 305, 140, 28);

    pg.push();
    pg.translate(rig.centerX, rig.groundY - 155);
    pg.rotate(t * 0.16);
    pg.noFill();
    pg.stroke(235, 198, 128, 145);
    pg.strokeWeight(2.2);
    pg.ellipse(0, 0, 380, 380);
    pg.ellipse(0, 0, 235, 235);
    for (let g = 0; g < 24; g++) {
      const ga = (g / 24) * Math.PI * 2;
      pg.line(Math.cos(ga) * 190, Math.sin(ga) * 190, Math.cos(ga) * 212, Math.sin(ga) * 212);
    }
    pg.stroke(112, 255, 218, 185);
    pg.strokeWeight(2.4);
    pg.beginShape();
    for (let a = 0; a <= Math.PI * 3.5; a += 0.12) {
      const rSp = 8.0 * Math.pow(1.32, a);
      if (rSp <= 195) pg.vertex(Math.cos(a) * rSp, Math.sin(a) * rSp);
    }
    pg.endShape();
    pg.pop();
  }

  else if (eraObj.id === 'era01') {
    const skyBands = [
      { y: LETTERBOX_TOP, h: 95, col: [98, 36, 24] },
      { y: LETTERBOX_TOP + 95, h: 95, col: [148, 58, 28] },
      { y: LETTERBOX_TOP + 190, h: 110, col: [196, 96, 36] },
      { y: LETTERBOX_TOP + 300, h: 280, col: [228, 138, 52] },
    ];
    pg.noStroke();
    skyBands.forEach((b) => {
      pg.fill(...b.col);
      pg.rect(xMin, b.y, clipW, b.h + 2);
    });

    pg.stroke(255, 212, 138, 110);
    pg.strokeWeight(1.8);
    pg.noFill();
    for (let px = Math.floor(xMin / 180) * 180; px <= xMax; px += 180) {
      const wx = px - (state.cameraLeftWorldX * 0.08) % 180;
      const py = LETTERBOX_TOP + 62;
      pg.arc(wx, py, 26, 14, Math.PI, Math.PI * 2);
      pg.line(wx - 10, py, wx - 16, py + 12);
      pg.line(wx + 10, py, wx + 16, py + 12);
      pg.line(wx + 12, py - 4, wx + 18, py - 16);
      pg.ellipse(wx + 52, py - 12, 7, 7);
      pg.line(wx + 52, py - 8, wx + 52, py + 8);
      pg.arc(wx + 58, py - 2, 14, 22, -Math.PI * 0.4, Math.PI * 0.4);
    }

    const kiliX = W * 0.68 - (state.cameraLeftWorldX * 0.12) % 900;
    pg.noStroke();
    pg.fill(255, 218, 98, 90);
    pg.ellipse(kiliX - 160, 215, 210, 210);
    pg.fill(255, 236, 138, 225);
    pg.ellipse(kiliX - 160, 215, 142, 142);

    pg.fill(92, 48, 32, 235);
    pg.triangle(kiliX - 280, 405, kiliX - 40, 155, kiliX + 260, 405);
    pg.triangle(kiliX - 180, 405, kiliX + 45, 155, kiliX + 295, 405);
    pg.fill(252, 244, 230, 235);
    pg.quad(kiliX - 78, 198, kiliX + 82, 198, kiliX + 45, 155, kiliX - 40, 155);

    pg.stroke(48, 20, 12, 215);
    pg.strokeWeight(2.2);
    pg.noFill();
    for (let b = 0; b < 7; b++) {
      const bx = ((kiliX - 260 + b * 46 + t * 55) % W + W) % W;
      const by = 165 + (b % 3) * 18 + Math.sin(t * 7 + b) * 6;
      const wingY = Math.sin(t * 11 + b) * 8;
      pg.bezier(bx - 12, by - wingY, bx - 4, by - 6, bx, by, bx, by);
      pg.bezier(bx, by, bx + 4, by - 6, bx + 12, by - wingY, bx + 12, by - wingY);
    }

    pg.fill(112, 58, 32, 240);
    pg.noStroke();
    pg.beginShape();
    pg.vertex(xMin, 395);
    for (let sx = xMin; sx <= xMax + 40; sx += 40) {
      const wx = state.cameraLeftWorldX * 0.35 + sx;
      pg.vertex(sx, 385 + Math.sin(wx * 0.005) * 22);
    }
    pg.vertex(xMax, H);
    pg.vertex(xMin, H);
    pg.endShape(pg.CLOSE);

    const herdBaseX = ((W * 0.24 - state.cameraLeftWorldX * 0.22 + t * 28) % (W + 360) + (W + 360)) % (W + 360) - 160;
    const herdBaseY = 398;
    drawMigratingAfricanElephant(pg, herdBaseX - 155, herdBaseY + 4, 0.58, t, 2, false);
    drawMigratingAfricanElephant(pg, herdBaseX - 75, herdBaseY + 2, 0.82, t, 1, false);
    drawMigratingAfricanElephant(pg, herdBaseX + 28, herdBaseY, 1.05, t, 0, true);

    const prideX = ((W * 0.72 - state.cameraLeftWorldX * 0.28) % (W + 340) + (W + 340)) % (W + 340) - 120;
    const prideY = 392;
    const jawAmt = (cam && cam.lionJawOpen) ? cam.lionJawOpen : 0.0;
    const waveProg = (cam && typeof cam.roarWaveProgress === 'number') ? cam.roarWaveProgress : -1.0;
    const tremorAmt = (cam && cam.lionGroundTremor) ? cam.lionGroundTremor : 0.0;

    pg.push();
    pg.translate(prideX, prideY);

    pg.fill(68, 36, 18);
    pg.stroke(32, 16, 8);
    pg.strokeWeight(2.5);
    pg.quad(-115, 34, 85, 34, 138, -78, -75, -24);
    pg.line(-65, 10, 95, -45);

    const lx = 96, ly = -80;
    const jawOpenPx = 3 + jawAmt * 15;
    pg.fill(235, 158, 52);
    pg.stroke(38, 18, 8);
    pg.strokeWeight(2.2);
    pg.ellipse(lx - 24, ly - 12, 56, 30);
    pg.strokeWeight(5);
    pg.line(lx - 44, ly - 4, lx - 50, ly + 16);
    pg.line(lx - 4, ly - 6, lx + 4, ly + 12);
    pg.noFill();
    pg.strokeWeight(3.5);
    pg.bezier(lx - 50, ly - 16, lx - 72, ly - 28, lx - 78, ly - 48, lx - 64, ly - 56);

    pg.fill(112, 42, 14);
    pg.stroke(252, 196, 78);
    pg.strokeWeight(2.2);
    pg.ellipse(lx + 4, ly - 28, 44 + jawAmt * 5, 48 + jawAmt * 6);

    pg.fill(242, 174, 64);
    pg.stroke(38, 18, 8);
    pg.strokeWeight(1.8);
    pg.ellipse(lx + 16, ly - 32 - jawAmt * 4, 28, 22);
    pg.fill(218, 42, 32);
    pg.triangle(lx + 18, ly - 30 - jawAmt * 3, lx + 40, ly - 36 - jawOpenPx * 0.55, lx + 36, ly - 20 + jawOpenPx * 0.65);
    if (jawAmt > 0.15) {
      pg.fill(255, 232, 118, Math.round(230 * jawAmt));
      pg.noStroke();
      pg.ellipse(lx + 30, ly - 28, 12 * jawAmt, 10 * jawAmt);
    }
    pg.fill(255, 252, 240);
    pg.noStroke();
    pg.triangle(lx + 30, ly - 34 - jawOpenPx * 0.3, lx + 34, ly - 34 - jawOpenPx * 0.3, lx + 32, ly - 27 - jawOpenPx * 0.3);
    pg.triangle(lx + 29, ly - 22 + jawOpenPx * 0.3, lx + 33, ly - 22 + jawOpenPx * 0.3, lx + 31, ly - 28 + jawOpenPx * 0.3);

    if (waveProg >= 0.0) {
      pg.noFill();
      for (let ring = 0; ring < 5; ring++) {
        const rRad = waveProg * 360 - ring * 42;
        if (rRad > 12 && rRad < 320) {
          const rAlpha = Math.max(0, 250 * (1.0 - rRad / 320));
          pg.stroke(255, ring % 2 === 0 ? 228 : 148, ring % 2 === 0 ? 98 : 52, rAlpha);
          pg.strokeWeight(4.2 - ring * 0.55);
          pg.arc(lx + 34, ly - 28, rRad * 1.4, rRad, -Math.PI * 0.58, Math.PI * 0.58);
        }
      }
    }

    pg.fill(255, 208, 98, 220);
    pg.noStroke();
    for (let p = 0; p < 6; p++) {
      const px = -40 + p * 28;
      const py = -22 - Math.abs(Math.sin(t * 24 + p)) * (tremorAmt * 28);
      pg.ellipse(px, py, 6, 4);
    }
    pg.pop();

    const startTile = Math.floor((state.cameraLeftWorldX + xMin) / 420);
    const endTile = Math.ceil((state.cameraLeftWorldX + xMax) / 420);
    for (let tile = startTile; tile <= endTile; tile++) {
      const worldBase = tile * 420;
      const sx = worldBase - state.cameraLeftWorldX;
      const gy = getRoadY(worldBase, H);

      pg.stroke(48, 28, 16, 235);
      pg.strokeWeight(6);
      pg.line(sx, gy, sx + 8, gy - 150);
      pg.line(sx + 8, gy - 150, sx - 56, gy - 190);
      pg.line(sx + 8, gy - 150, sx + 72, gy - 185);
      pg.noStroke();
      pg.fill(58, 86, 34, 235);
      pg.ellipse(sx - 45, gy - 194, 135, 26);
      pg.ellipse(sx + 55, gy - 188, 150, 28);

      const gx = sx + 115;
      const gHeadDip = Math.sin(t * 2.5 + tile) * 8;
      const gNeckTopX = gx + 48;
      const gNeckTopY = gy - 198 + gHeadDip;

      pg.push();
      pg.stroke(148, 82, 32);
      pg.strokeWeight(4.2);
      pg.line(gx - 14, gy - 88, gx - 18, gy - 6);
      pg.line(gx - 4, gy - 88, gx - 2, gy - 6);
      pg.line(gx + 16, gy - 96, gx + 14, gy - 6);
      pg.line(gx + 24, gy - 96, gx + 28, gy - 6);

      pg.fill(238, 168, 68);
      pg.stroke(48, 24, 12);
      pg.strokeWeight(2.2);
      pg.quad(gx - 20, gy - 84, gx + 26, gy - 98, gx + 22, gy - 122, gx - 16, gy - 104);
      pg.quad(gx + 10, gy - 114, gx + 26, gy - 108, gNeckTopX + 6, gNeckTopY + 8, gNeckTopX - 6, gNeckTopY + 4);

      pg.fill(118, 52, 18);
      pg.noStroke();
      pg.ellipse(gx, gy - 102, 10, 8);
      pg.ellipse(gx + 14, gy - 108, 9, 7);
      for (let sp = 1; sp <= 4; sp++) {
        const u = sp / 5;
        pg.ellipse(gx + 18 + (gNeckTopX - gx - 18) * u, gy - 112 + (gNeckTopY - gy + 112) * u, 7, 9);
      }

      pg.fill(242, 174, 74);
      pg.stroke(48, 24, 12);
      pg.strokeWeight(2.0);
      pg.ellipse(gNeckTopX + 8, gNeckTopY, 26, 15);
      pg.ellipse(gNeckTopX + 20, gNeckTopY + 2, 14, 10);
      pg.fill(88, 168, 54);
      pg.noStroke();
      pg.ellipse(gNeckTopX + 30, gNeckTopY + 2, 12, 6);
      pg.fill(238, 168, 68);
      pg.stroke(48, 24, 12);
      pg.strokeWeight(1.6);
      pg.ellipse(gNeckTopX - 6, gNeckTopY - 6, 12, 6);
      pg.strokeWeight(2.5);
      pg.line(gNeckTopX, gNeckTopY - 7, gNeckTopX - 2, gNeckTopY - 19);
      pg.line(gNeckTopX + 6, gNeckTopY - 7, gNeckTopX + 5, gNeckTopY - 19);
      pg.fill(38, 20, 10);
      pg.noStroke();
      pg.ellipse(gNeckTopX - 2, gNeckTopY - 20, 5, 5);
      pg.ellipse(gNeckTopX + 5, gNeckTopY - 20, 5, 5);
      pg.ellipse(gNeckTopX + 8, gNeckTopY - 2, 4, 4);
      pg.pop();

      const hx = sx + 245;
      const hgy = getRoadY(worldBase + 245, H);
      pg.fill(64, 38, 20, 235);
      pg.stroke(35, 20, 10);
      pg.strokeWeight(2);
      pg.rect(hx, hgy - 52, 58, 52, 5);
      pg.fill(138, 88, 42);
      pg.triangle(hx - 10, hgy - 52, hx + 29, hgy - 92, hx + 68, hgy - 52);
    }
  }

  else if (eraObj.id === 'era02') {
    const flash = cam ? cam.lightningFlash * 75 : 0;
    pg.fill(18 + flash, 34 + flash, 54 + flash);
    pg.noStroke();
    pg.rect(xMin, 0, clipW, H);

    const araratX = W * 0.54 - (state.cameraLeftWorldX - TIMELINE[2].worldStartX) * 0.10;
    const rbAlpha = Math.max(0.0, Math.min(1.0, (sliceProgress - 0.36) * 2.0));
    if (rbAlpha > 0.02) {
      pg.noFill();
      const rbColors = [[225, 85, 75], [242, 158, 72], [248, 218, 92], [98, 198, 118], [88, 168, 238], [138, 112, 215]];
      for (let r = 0; r < rbColors.length; r++) {
        pg.stroke(rbColors[r][0], rbColors[r][1], rbColors[r][2], Math.round(42 * rbAlpha));
        pg.strokeWeight(18);
        pg.arc(araratX, 455, (920 - r * 24) * bgScale, (680 - r * 24) * bgScale, Math.PI * 1.05, Math.PI * 1.95);
      }
    }

    // In the Second Half (`sliceProgress > 0.46`), render swirling Van Gogh / Turner Oil-Paint Impasto Sky Brushstrokes!
    if (sliceProgress > 0.46) {
      const oilAlpha = Math.round(135 * Math.min(1, (sliceProgress - 0.46) * 3.0));
      pg.noFill();
      pg.strokeWeight(4.5);
      for (let b = 0; b < 18; b++) {
        const bx = xMin + ((b * 113) % Math.max(100, clipW));
        const by = LETTERBOX_TOP + 28 + (b * 37) % 165;
        pg.stroke(b % 2 === 0 ? 255 : 118, b % 2 === 0 ? 218 : 198, b % 2 === 0 ? 112 : 245, oilAlpha);
        pg.arc(bx, by, 48, 22, 0, Math.PI * 0.85);
      }
    }

    pg.fill(16, 44, 72, 235);
    pg.stroke(148, 212, 248, 140);
    pg.strokeWeight(2.2);
    pg.beginShape();
    pg.vertex(xMin, H);
    for (let sx = xMin; sx <= xMax + 32; sx += 32) {
      const wx = state.cameraLeftWorldX * 0.35 + sx;
      const billow = Math.sin(wx * 0.011 + t * 2.8) * 58 + Math.cos(wx * 0.024 - t * 3.5) * 28;
      pg.vertex(sx, 365 + billow);
    }
    pg.vertex(xMax, H);
    pg.endShape(pg.CLOSE);

    pg.push();
    pg.translate(araratX, 415 + Math.sin(t * 2.2) * 14);
    pg.scale(bgScale);
    pg.rotate(Math.sin(t * 2.2) * 0.038);

    pg.noStroke();
    pg.fill(32, 48, 68, 210);
    pg.triangle(-420, 40, -160, -240, 120, 40);
    pg.triangle(-60, 40, 200, -195, 440, 40);

    pg.fill(78, 46, 24);
    pg.stroke(238, 196, 122);
    pg.strokeWeight(2.8);
    pg.beginShape();
    pg.vertex(-320, -48);
    pg.bezierVertex(-290, 56, -160, 68, 0, 68);
    pg.bezierVertex(165, 68, 290, 50, 345, -64);
    pg.quadraticVertex(235, -18, 0, -18);
    pg.quadraticVertex(-230, -18, -320, -48);
    pg.endShape(pg.CLOSE);

    pg.fill(108, 68, 36);
    pg.stroke(228, 188, 118);
    pg.strokeWeight(2.0);
    pg.rect(-235, -78, 470, 60, 4);
    pg.fill(88, 54, 28);
    pg.rect(-195, -122, 390, 44, 4);
    pg.fill(58, 36, 20);
    pg.beginShape();
    pg.vertex(-245, -78);
    pg.quadraticVertex(0, -164, 245, -78);
    pg.quadraticVertex(0, -118, -245, -78);
    pg.endShape(pg.CLOSE);

    pg.fill(255, 222, 112, 245);
    pg.noStroke();
    for (let wx = -195; wx <= 195; wx += 30) {
      pg.ellipse(wx, -46, 13, 18);
      if (Math.abs(wx) <= 150) pg.ellipse(wx, -98, 11, 15);
    }

    pg.fill(242, 250, 255, 230);
    pg.beginShape();
    pg.vertex(240, 42);
    pg.quadraticVertex(335, 10, 375, -45);
    pg.quadraticVertex(320, 48, 240, 42);
    pg.endShape(pg.CLOSE);
    pg.pop();

    for (let layer = 0; layer < 3; layer++) {
      const waveBaseY = 415 + layer * 42;
      const waveAmp = 46 + layer * 14;
      pg.fill(18 + layer * 12, 58 + layer * 18, 98 + layer * 22, 235);
      pg.stroke(215, 242, 255, 195);
      pg.strokeWeight(2.8);
      pg.beginShape();
      pg.vertex(xMin, H);
      for (let sx = xMin; sx <= xMax + 24; sx += 24) {
        const wx = state.cameraLeftWorldX * (0.45 + layer * 0.25) + sx;
        const crest = Math.sin(wx * 0.015 + t * (3.2 + layer)) * waveAmp
                    - Math.pow(Math.max(0, Math.cos(wx * 0.015 + t * (3.2 + layer))), 3) * 34;
        const wy = waveBaseY + crest;
        pg.vertex(sx, wy);
      }
      pg.vertex(xMax, H);
      pg.endShape(pg.CLOSE);

      pg.noStroke();
      pg.fill(245, 252, 255, 225);
      for (let sx = xMin; sx <= xMax; sx += 96) {
        const wx = state.cameraLeftWorldX * (0.45 + layer * 0.25) + sx;
        const phase = wx * 0.015 + t * (3.2 + layer);
        if (Math.sin(phase) < -0.55) {
          const wy = waveBaseY - waveAmp - 18;
          pg.ellipse(sx, wy, 36, 16);
          pg.ellipse(sx + 18, wy - 8, 18, 12);
          pg.ellipse(sx + 28, wy - 2, 10, 10);
        }
      }
    }

    const doveX = rig.head.x + 76 + Math.cos(t * 2.4) * 42;
    const doveY = rig.head.y - 48 + Math.sin(t * 4.8) * 12;
    const flap = Math.sin(t * 15) * 15;
    pg.push();
    pg.translate(doveX, doveY);
    pg.fill(248, 250, 255);
    pg.stroke(40, 58, 78);
    pg.strokeWeight(1.6);
    pg.ellipse(0, 0, 28, 12);
    pg.triangle(-3, -2, -15, -15 - flap, 7, -2);
    pg.stroke(115, 205, 95);
    pg.strokeWeight(2.2);
    pg.line(13, 1, 30, 8);
    pg.pop();
  }

  else if (eraObj.id === 'era03') {
    const shangSky = [
      { y: LETTERBOX_TOP, h: 120, col: [14, 24, 22] },
      { y: LETTERBOX_TOP + 120, h: 140, col: [22, 42, 38] },
      { y: LETTERBOX_TOP + 260, h: 320, col: [34, 62, 52] },
    ];
    pg.noStroke();
    shangSky.forEach((b) => {
      pg.fill(...b.col);
      pg.rect(xMin, b.y, clipW, b.h + 2);
    });

    pg.stroke(96, 188, 158, 38);
    pg.strokeWeight(1.2);
    for (let y = 110; y < H - 70; y += 22) {
      pg.line(xMin, y, xMax, y);
    }

    const birdX = W * 0.50 - ((state.cameraLeftWorldX - TIMELINE[3].worldStartX) * 0.06);
    const birdY = LETTERBOX_TOP + 102;
    const wingBeat = Math.sin(t * 4.5) * 14;
    pg.push();
    pg.translate(birdX, birdY);
    pg.noStroke();
    pg.fill(238, 86, 42, 85);
    pg.ellipse(0, 0, 148, 148);
    pg.stroke(255, 214, 92, 195);
    pg.strokeWeight(2.2);
    pg.noFill();
    pg.ellipse(0, 0, 112, 112);
    pg.fill(248, 202, 82, 220);
    pg.stroke(218, 68, 42, 230);
    pg.strokeWeight(1.8);
    pg.beginShape();
    pg.vertex(0, -18);
    pg.quadraticVertex(58, -46 - wingBeat, 118, -14 - wingBeat);
    pg.quadraticVertex(62, 6, 16, 12);
    pg.vertex(24, 48);
    pg.vertex(0, 32);
    pg.vertex(-24, 48);
    pg.vertex(-16, 12);
    pg.quadraticVertex(-62, 6, -118, -14 - wingBeat);
    pg.quadraticVertex(-58, -46 - wingBeat, 0, -18);
    pg.endShape(pg.CLOSE);
    pg.pop();

    pg.fill(26, 48, 42, 230);
    pg.stroke(168, 142, 82, 130);
    pg.strokeWeight(1.8);
    pg.beginShape();
    pg.vertex(xMin, 425);
    for (let sx = xMin; sx <= xMax + 40; sx += 40) {
      const wx = state.cameraLeftWorldX * 0.22 + sx;
      pg.vertex(sx, 325 + Math.sin(wx * 0.004) * 42 + Math.cos(wx * 0.011) * 18);
    }
    pg.vertex(xMax, 425);
    pg.endShape(pg.CLOSE);

    pg.fill(74, 54, 34, 240);
    pg.stroke(218, 184, 92, 190);
    pg.strokeWeight(1.8);
    pg.rect(xMin, 405, clipW, 42);
    for (let cx = Math.floor(xMin / 36) * 36; cx <= xMax; cx += 36) {
      pg.rect(cx, 395, 22, 10);
    }

    const templeX = W * 0.46 - ((state.cameraLeftWorldX - TIMELINE[3].worldStartX) * 0.14);
    BrushKit.drawShangGrandPalace(pg, templeX, 442, bgScale, t);

    const startTile = Math.floor((state.cameraLeftWorldX + xMin) / 480);
    const endTile = Math.ceil((state.cameraLeftWorldX + xMax) / 480);
    for (let tile = startTile; tile <= endTile; tile++) {
      const wx = tile * 480;
      const sx = wx - state.cameraLeftWorldX;
      const gy = getRoadY(wx, H);

      const dx = sx + 115;
      pg.fill(58, 134, 112, 245);
      pg.stroke(238, 202, 104);
      pg.strokeWeight(2.4);
      pg.rect(dx - 46, gy - 106, 92, 60, 4);
      pg.rect(dx - 38, gy - 46, 15, 46);
      pg.rect(dx + 23, gy - 46, 15, 46);
      pg.noFill();
      pg.strokeWeight(4);
      pg.rect(dx - 40, gy - 126, 16, 20, 3);
      pg.rect(dx + 24, gy - 126, 16, 20, 3);
      pg.fill(255, 212, 88);
      pg.noStroke();
      pg.ellipse(dx - 16, gy - 76, 8, 8);
      pg.ellipse(dx + 16, gy - 76, 8, 8);

      pg.stroke(218, 184, 98, 235);
      pg.strokeWeight(4.5);
      pg.line(sx + 245, 290, sx + 445, 290);
      pg.line(sx + 255, 290, sx + 255, gy);
      pg.line(sx + 435, 290, sx + 435, gy);
      for (let i = 0; i < 4; i++) {
        const bx = sx + 278 + i * 44;
        const swing = Math.sin(t * 18 + i) * beatPulse * 6;
        pg.fill(68, 152, 126, 240);
        pg.stroke(242, 204, 108);
        pg.strokeWeight(1.8);
        pg.quad(bx - 12 + swing, 293, bx + 12 + swing, 293, bx + 17 + swing, 348 + i * 4, bx - 17 + swing, 348 + i * 4);
      }
    }
  }

  else if (eraObj.id === 'era04') {
    const greekSky = [
      { y: LETTERBOX_TOP, h: 115, col: [158, 62, 32] },
      { y: LETTERBOX_TOP + 115, h: 135, col: [204, 98, 46] },
      { y: LETTERBOX_TOP + 250, h: 220, col: [236, 142, 68] },
    ];
    pg.noStroke();
    greekSky.forEach((b) => {
      pg.fill(...b.col);
      pg.rect(xMin, b.y, clipW, b.h + 2);
    });

    pg.push();
    pg.translate(W * 0.22, 182);
    pg.rotate(t * 0.45);
    pg.stroke(255, 228, 142, 215);
    pg.strokeWeight(2.0);
    pg.noFill();
    pg.ellipse(0, 0, 104, 104);
    pg.ellipse(0, 0, 76, 76);
    pg.triangle(0, -52, -45, 26, 45, 26);
    pg.triangle(0, 52, -45, -26, 45, -26);
    pg.pop();

    const acroX = W * 0.56 - ((state.cameraLeftWorldX - TIMELINE[4].worldStartX) * 0.14);
    BrushKit.drawGreekAcropolisComplex(pg, acroX, 422, bgScale, t);

    pg.fill(32, 78, 118, 235);
    pg.stroke(248, 198, 118, 180);
    pg.strokeWeight(2.0);
    pg.rect(xMin, 418, clipW, 78);
    for (let s = 0; s < 3; s++) {
      const shipX = ((W * (0.20 + s * 0.34) - state.cameraLeftWorldX * 0.32) % (W + 320) + (W + 320)) % (W + 320) - 160;
      const shipY = 432 + (s % 2) * 14;
      pg.push();
      pg.translate(shipX, shipY);
      pg.scale(s === 1 ? 1.08 : 0.86);
      pg.fill(24, 18, 16);
      pg.stroke(242, 178, 92);
      pg.strokeWeight(1.8);
      pg.beginShape();
      pg.vertex(-72, -6);
      pg.vertex(74, -4);
      pg.vertex(92, 14);
      pg.vertex(54, 22);
      pg.vertex(-58, 22);
      pg.endShape(pg.CLOSE);
      pg.fill(252, 238, 210);
      pg.ellipse(58, 8, 12, 7);
      pg.fill(24, 18, 16);
      pg.ellipse(59, 8, 5, 5);
      pg.stroke(242, 178, 92);
      pg.strokeWeight(2.5);
      pg.line(0, -64, 0, 4);
      pg.fill(238, 148, 68);
      pg.quad(-42, -58, 42, -58, 48, -14, -48, -14);
      pg.fill(24, 18, 16);
      pg.ellipse(0, -36, 18, 18);
      pg.stroke(248, 208, 128);
      pg.strokeWeight(1.6);
      for (let oar = -42; oar <= 42; oar += 12) {
        pg.line(oar, 14, oar - 8 + Math.sin(t * 8 + oar) * 6, 30);
      }
      pg.pop();
    }

    const startCol = Math.floor((state.cameraLeftWorldX + xMin) / 380);
    const endCol = Math.ceil((state.cameraLeftWorldX + xMax) / 380);
    for (let c = startCol; c <= endCol; c++) {
      const wx = c * 380;
      const sx = wx - state.cameraLeftWorldX;
      const gy = getRoadY(wx, H);

      pg.fill(32, 24, 20, 242);
      pg.stroke(242, 178, 98, 215);
      pg.strokeWeight(1.8);
      pg.rect(sx - 20, 275, 40, gy - 275);
      pg.quad(sx - 30, 260, sx + 30, 260, sx + 20, 275, sx - 20, 275);
      for (let fl = -12; fl <= 12; fl += 6) pg.line(sx + fl, 278, sx + fl, gy);

      const bx = sx + 92;
      pg.stroke(248, 188, 88);
      pg.strokeWeight(2.8);
      pg.line(bx - 14, gy, bx - 5, gy - 46);
      pg.line(bx + 14, gy, bx + 5, gy - 46);
      pg.fill(22, 18, 15);
      pg.arc(bx, gy - 46, 38, 24, 0, Math.PI);
      pg.noStroke();
      pg.fill(255, 198, 58, 235);
      pg.triangle(bx - 13, gy - 46, bx, gy - 88 - beatPulse * 14, bx + 13, gy - 46);

      const runX = sx + 225;
      const rgy = getRoadY(wx + 225, H);
      const stride = Math.sin(t * 10 + c) * 20;
      pg.fill(20, 16, 14, 242);
      pg.stroke(242, 152, 78, 230);
      pg.strokeWeight(2.0);
      pg.ellipse(runX, rgy - 86, 18, 18);
      pg.quad(runX - 10, rgy - 74, runX + 10, rgy - 74, runX + 7, rgy - 36, runX - 7, rgy - 36);
      pg.strokeWeight(4);
      pg.line(runX, rgy - 36, runX + stride, rgy - 4);
      pg.line(runX, rgy - 36, runX - stride, rgy - 8);
    }
  }

  else if (eraObj.id === 'era05') {
    pg.fill(228, 208, 168);
    pg.noStroke();
    pg.rect(xMin, 0, clipW, H);

    pg.fill(252, 238, 192, 225);
    pg.ellipse(W * 0.25, 165, 112, 112);

    // INCEPTION DREAM-FOLDING SKY CHANG'AN CITY (《盗梦空间》苍穹镜像倒悬云端长安宫阙奇观)
    BrushKit.drawInceptionFoldedSkyCity(pg, 'era05', state, xMin, xMax, W, H);

    const layers = [
      { yOff: 285, amp: 66, fill: [44, 88, 108, 180], gold: [218, 178, 88, 185], par: 0.20 },
      { yOff: 215, amp: 50, fill: [52, 124, 104, 205], gold: [228, 188, 92, 210], par: 0.42 },
      { yOff: 145, amp: 34, fill: [76, 146, 98, 225],  gold: [235, 198, 102, 220], par: 0.65 },
    ];
    for (const L of layers) {
      pg.fill(...L.fill);
      pg.stroke(...L.gold);
      pg.strokeWeight(2.2);
      pg.beginShape();
      pg.vertex(xMin, H);
      for (let sx = xMin; sx <= xMax + 28; sx += 28) {
        const wx = state.cameraLeftWorldX * L.par + sx;
        const gy = getRoadY(state.cameraLeftWorldX + sx, H);
        const h = L.yOff + Math.sin(wx * 0.006) * L.amp + Math.cos(wx * 0.014) * (L.amp * 0.4);
        pg.vertex(sx, gy - Math.max(20, h));
      }
      pg.vertex(xMax, H);
      pg.endShape(pg.CLOSE);
    }

    pg.fill(198, 176, 138, 240);
    pg.stroke(118, 84, 48, 200);
    pg.strokeWeight(2.0);
    pg.rect(xMin, 428, clipW, H - 428);

    const palX = W * 0.46 - ((state.cameraLeftWorldX - TIMELINE[5].worldStartX) * 0.14);
    pg.push();
    pg.translate(palX, 432);
    pg.scale(bgScale);

    [-235, 235].forEach((wx) => {
      pg.fill(142, 52, 36, 248);
      pg.stroke(46, 24, 16);
      pg.strokeWeight(2.0);
      pg.quad(wx - 74, 0, wx + 74, 0, wx + 62, -52, wx - 62, -52);
      pg.fill(242, 234, 216);
      pg.rect(wx - 64, -58, 128, 6);
      const bridgeX1 = wx < 0 ? wx + 52 : -155;
      const bridgeX2 = wx < 0 ? -155 : wx - 52;
      pg.fill(168, 44, 32);
      pg.rect(bridgeX1, -82, bridgeX2 - bridgeX1, 14);
      pg.rect((bridgeX1 + bridgeX2) * 0.5 - 5, -68, 10, 68);
      BrushKit.drawTangPavilion(pg, wx, -58, 108, 104, 2);
    });

    pg.fill(168, 58, 38, 252);
    pg.stroke(46, 24, 16);
    pg.strokeWeight(2.2);
    pg.quad(-185, 0, 185, 0, 158, -68, -158, -68);
    pg.fill(246, 238, 222);
    pg.rect(-160, -76, 320, 8);
    pg.fill(242, 232, 212);
    pg.stroke(138, 108, 68);
    pg.strokeWeight(1.8);
    pg.quad(-48, 0, 48, 0, 36, -76, -36, -76);
    for (let st = 1; st <= 7; st++) {
      const sy = -st * 10;
      pg.line(-46 + st * 1.4, sy, 46 - st * 1.4, sy);
    }
    BrushKit.drawTangPavilion(pg, 0, -76, 248, 152, 2);
    pg.pop();

    const startTile = Math.floor((state.cameraLeftWorldX + xMin) / 760);
    const endTile = Math.ceil((state.cameraLeftWorldX + xMax) / 760);
    for (let tile = startTile; tile <= endTile; tile++) {
      const wx = tile * 760;
      const sx = wx - state.cameraLeftWorldX;

      BrushKit.drawTangPavilion(pg, sx, 445, 112, 235, 5);
      pg.stroke(238, 196, 88);
      pg.strokeWeight(3.0);
      pg.line(sx, 445 - 235, sx, 445 - 268);

      const steleX = sx + 380;
      pg.fill(88, 76, 64);
      pg.stroke(238, 196, 88);
      pg.strokeWeight(1.8);
      pg.rect(steleX - 22, 365, 44, 78, 6);
      pg.fill(255, 224, 128);
      pg.noStroke();
      pg.textFont('serif');
      pg.textAlign(pg.CENTER, pg.CENTER);
      pg.textSize(11);
      pg.text('丝路', steleX, 388);
      pg.text('西市', steleX, 406);
      pg.text('起点', steleX, 424);
    }

    for (let camIdx = 0; camIdx < 4; camIdx++) {
      const cx = ((camIdx * 235 + 180 - state.cameraLeftWorldX * 0.55) % (W + 260) + (W + 260)) % (W + 260) - 110;
      const cy = 492;
      BrushKit.drawSilkRoadCamelUnit(pg, cx, cy, t, camIdx);
    }
  }

  // =========================================================================
  // 06 NORTHERN SONG: ZHANG ZEDUAN'S "QINGMING SCROLL" PANORAMA & MI-STYLE INK MOUNTAINS
  // =========================================================================
  else if (eraObj.id === 'era06') {
    // Warm aged Song dynasty silk-and-Xuan scroll background
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(236 - u * 24, 228 - u * 20, 206 - u * 24);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    // 2 Layers of Mi Fu / Song Dynasty Cloudy Ink-Wash Mountains ("米氏云山浓淡墨染远山")
    for (let layer = 0; layer < 2; layer++) {
      pg.fill(layer === 0 ? [138, 152, 142, 115] : [92, 112, 102, 145]);
      pg.noStroke();
      pg.beginShape();
      pg.vertex(xMin, 430);
      for (let sx = xMin; sx <= xMax + 24; sx += 24) {
        const wx = state.cameraLeftWorldX * (0.12 + layer * 0.08) + sx;
        const my = (235 + layer * 42) - Math.sin(wx * 0.0045 + layer) * 52 - noise1D(wx * 0.012 + layer * 7) * 38;
        pg.vertex(sx, my);
      }
      pg.vertex(xMax, 430);
      pg.endShape(pg.CLOSE);
    }
    // Drifting Song Xuan-paper ink-wash mist band ("山腰水墨烟云")
    pg.noStroke();
    pg.fill(242, 236, 220, 135);
    for (let m = 0; m < 5; m++) {
      const mx = ((m * 280 - state.cameraLeftWorldX * 0.18 + t * 18) % (W + 300) + (W + 300)) % (W + 300) - 120;
      pg.ellipse(mx, 275 + (m % 2) * 24, 240, 26);
    }

    const songCenterX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[6].worldStartX) * 0.12;
    const songDolly = (cam && eraObj.id === 'era06') ? cam.bgDollyScale : 1.08;
    BrushKit.drawSuSongClockTowerAndRainbowBridge(pg, songCenterX, 468, songDolly, t);
  }

  // =========================================================================
  // 07 YUAN-MING-QING: BADA SHANREN SPLASH-INK SHANSHUI × JINGDEZHEN COBALT PORCELAIN & ZHENG HE FLEET
  // =========================================================================
  else if (eraObj.id === 'era07') {
    const kilnMix = Math.max(0, Math.min(1, (sliceProgress - 0.36) / 0.22));
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      const r = Math.round((242 - u * 26) * (1 - kilnMix) + (244 - u * 38) * kilnMix);
      const g = Math.round((238 - u * 26) * (1 - kilnMix) + (248 - u * 26) * kilnMix);
      const b = Math.round((226 - u * 26) * (1 - kilnMix) + (255 - u * 8) * kilnMix);
      pg.fill(r, g, b);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }

    // Bada Shanren Minimalist Roll-Eye Ink Fish swimming in the sky's negative space ("八大山人虚空游鱼·白眼向人")!
    for (let f = 0; f < 2; f++) {
      const fx = 460 + f * 310 + Math.sin(t * 1.8 + f * 2) * 28;
      const fy = 155 + f * 32 + Math.cos(t * 2.2 + f) * 10;
      if (fx > xMin + 30 && fx < xMax - 30) {
        pg.push();
        pg.translate(fx, fy);
        pg.fill(Math.round(28 * (1 - kilnMix) + 22 * kilnMix), Math.round(30 * (1 - kilnMix) + 68 * kilnMix), Math.round(34 * (1 - kilnMix) + 168 * kilnMix), 195);
        pg.noStroke();
        pg.ellipse(0, 0, 42, 16);
        pg.triangle(-18, 0, -34, -10 + Math.sin(t * 8 + f) * 4, -32, 10);
        // Square Roll-Eye on the fish!
        pg.fill(255, 255, 255);
        pg.rect(8, -5, 6, 5, 1);
        pg.fill(10, 14, 24);
        pg.ellipse(11, -4, 2.5, 2.5);
        pg.pop();
      }
    }

    const mingCenterX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[7].worldStartX) * 0.12;
    const mingDolly = (cam && eraObj.id === 'era07') ? cam.bgDollyScale : 1.12;
    BrushKit.drawZhengHeTreasureShipAndMingTown(pg, mingCenterX, 468, mingDolly, t, sliceProgress);

    // Sweeping 1300°C Golden Kiln-Fire Wave at sliceProgress = 0.36..0.58 ("水墨入窑化青花之1300°C鎏金窑变火浪")!
    if (sliceProgress > 0.34 && sliceProgress < 0.60) {
      const kx = xMin + ((sliceProgress - 0.34) / 0.26) * clipW;
      pg.noStroke();
      pg.fill(255, 198, 68, 95);
      pg.rect(kx - 28, LETTERBOX_TOP, 56, H - LETTERBOX_TOP - LETTERBOX_BOTTOM);
      pg.stroke(255, 238, 128, 215);
      pg.strokeWeight(2.6);
      pg.line(kx, LETTERBOX_TOP, kx, H - LETTERBOX_BOTTOM);
    }
  }

  // =========================================================================
  // 08 INCA SUN CITY & TRANSATLANTIC NAVIGATION: 5-LAYER ATLANTIC OCEAN & INCEPTION SKY-SEA FOLD
  // =========================================================================
  else if (eraObj.id === 'era08') {
    // Rich Golden-Azure Age of Sail Sky & Ocean Horizon Gradient
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      if (u < 0.55) {
        pg.fill(38 + u * 280, 78 + u * 185, 138 - u * 20);
      } else {
        pg.fill(18, 68, 128);
      }
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    // Copperplate Nautical Rhumb-Line Compass Rose & Glowing Astrolabe Rings in Sky
    const roseX = W * 0.48, roseY = 235;
    pg.noFill();
    pg.stroke(255, 218, 98, 115);
    pg.strokeWeight(1.4);
    pg.ellipse(roseX, roseY, 280, 280);
    pg.ellipse(roseX, roseY, 390, 210);
    for (let r = 0; r < 16; r++) {
      const a = (r / 16) * Math.PI * 2 + t * 0.08;
      pg.line(roseX, roseY, roseX + Math.cos(a) * 680, roseY + Math.sin(a) * 680);
    }
    // 180-Degree Inverted Transatlantic Caravel Fleet & Inca Sun Temple on the Sky Vault!
    BrushKit.drawInceptionFoldedSkyCity(pg, 'era08', state, xMin, xMax, W, H);

    const incaCenterX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[8].worldStartX) * 0.12;
    const incaDolly = (cam && eraObj.id === 'era08') ? cam.bgDollyScale : 1.10;
    BrushKit.drawIncaMachuPicchuAndSunCalendar(pg, incaCenterX, 472, incaDolly, t);
  }

  // =========================================================================
  // 09 INDUSTRIAL REVOLUTION & VAN GOGH SCIENCE: STARRY NIGHT IMPASTO × MECHANICAL GEAR-STARS
  // =========================================================================
  else if (eraObj.id === 'era09') {
    // Authentic Van Gogh Starry Night Prussian Blue / Cobalt Blue / Ultramarine Oil Sky
    for (let y = 0; y < H; y += 20) {
      const u = y / H;
      pg.fill(12 + u * 26, 28 + u * 54, 78 + u * 72);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 22);
    }
    // Full-screen background layer of Van Gogh short curved impasto brushstrokes so the entire sky feels like an oil canvas!
    pg.noFill();
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 14; col++) {
        const bx = col * 96 + (row % 2) * 48;
        if (bx < xMin - 40 || bx > xMax + 40) continue;
        const by = LETTERBOX_TOP + 28 + row * 44 + Math.sin(col * 0.6 + t * 1.5) * 12;
        pg.stroke((row + col) % 3 === 0 ? [255, 218, 68, 135] : [64, 138, 238, 155]);
        pg.strokeWeight(4.0);
        pg.arc(bx, by, 36, 18, -0.35, 0.75);
      }
    }

    const indCenterX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[9].worldStartX) * 0.12;
    const indDolly = (cam && eraObj.id === 'era09') ? cam.bgDollyScale : 1.08;
    BrushKit.drawVictorianSteamBridgeAndVanGoghSky(pg, indCenterX, 475, indDolly, t);
  }

  // =========================================================================
  // 10 FARADAY ELECTROMAGNETIC DAWN: LONDON-NY HARBOR, HORSESHOE MAGNET DYNAMO & SUBSEA CABLE
  // =========================================================================
  else if (eraObj.id === 'era10') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(10 + u * 18, 22 + u * 36, 44 + u * 56);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const emCenterX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[10].worldStartX) * 0.12;
    const emDolly = (cam && eraObj.id === 'era10') ? cam.bgDollyScale : 1.08;
    BrushKit.drawFaradayHarborAndGreatEastern(pg, emCenterX, 472, emDolly, t);
  }

  // =========================================================================
  // 11 TESLA AC LIGHTNING WAR: NIAGARA FALLS, WARDENCLYFFE TOWER & MILLION-VOLT ARCS
  // =========================================================================
  else if (eraObj.id === 'era11') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(16 + u * 24, 12 + u * 18, 42 + u * 54);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const teslaX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[11].worldStartX) * 0.12;
    const teslaDolly = (cam && eraObj.id === 'era11') ? cam.bgDollyScale : 1.10;
    BrushKit.drawTeslaNiagaraAndWardenclyffe(pg, teslaX, 472, teslaDolly, t);
  }

  // =========================================================================
  // 12 EINSTEIN RELATIVITY × 3D GAUSSIAN SPLATTING "VONNEGUT 4D SPACETIME CENTIPEDE"
  // =========================================================================
  else if (eraObj.id === 'era12') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(8 + u * 16, 12 + u * 26, 32 + u * 48);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const einX = W * 0.54 - (state.cameraLeftWorldX - TIMELINE[12].worldStartX) * 0.12;
    const einDolly = (cam && eraObj.id === 'era12') ? cam.bgDollyScale : 1.12;
    BrushKit.drawEinsteinObservatoryAnd4DCentipede(pg, einX, 472, einDolly, t);
    // Render the 3D Gaussian Splatting 4D Spacetime Centipede Trail leading directly into the current Pelican & Cat!
    BrushKit.draw3DGaussianSpacetimeCentipede(pg, state, rig, W, H);
  }

  // =========================================================================
  // 13 MODERN OLYMPICS FIVE RINGS: STADIUM, CAULDRON, PEACE DOVES & ANAMORPHIC SUN
  // =========================================================================
  else if (eraObj.id === 'era13') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(38 + u * 165, 138 + u * 95, 242 - u * 18);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const olyX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[13].worldStartX) * 0.12;
    const olyDolly = (cam && eraObj.id === 'era13') ? cam.bgDollyScale : 1.10;
    BrushKit.drawModernOlympicStadiumAndDoves(pg, olyX, 472, olyDolly, t);
  }

  // =========================================================================
  // 14 SILICON VALLEY GARAGE & 8-BIT OPEN SOURCE: TEKTRONIX OSCILLOSCOPE & TCP/IP TREE
  // =========================================================================
  else if (eraObj.id === 'era14') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(8 + u * 14, 26 + u * 32, 18 + u * 24);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const silX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[14].worldStartX) * 0.12;
    const silDolly = (cam && eraObj.id === 'era14') ? cam.bgDollyScale : 1.08;
    BrushKit.drawSiliconValleyGarageAnd8BitWeb(pg, silX, 472, silDolly, t);
  }

  // =========================================================================
  // 15 GLOBALIZATION 5-CONTINENT INTERCONNECT: 3D HOLOGRAPHIC EARTH & BULLET TRAIN
  // =========================================================================
  else if (eraObj.id === 'era15') {
    for (let y = 0; y < H; y += 22) {
      const u = y / H;
      pg.fill(10 + u * 22, 36 + u * 64, 68 + u * 78);
      pg.noStroke();
      pg.rect(xMin, y, clipW, 24);
    }
    const gloX = W * 0.52 - (state.cameraLeftWorldX - TIMELINE[15].worldStartX) * 0.12;
    const gloDolly = (cam && eraObj.id === 'era15') ? cam.bgDollyScale : 1.10;
    BrushKit.drawGlobalizationMetropolisAndAuroraGlobe(pg, gloX, 472, gloDolly, t);
  }

  drawContinuousPhysicalRoad(pg, eraObj, state, xMin, xMax, H);

  // V6.0 6-DOF COSMIC RIDING PHYSICAL TRACK UNDER WHEELS (Ensures 0% floating when climbing lightning/spacetime/orbital ramps!)
  if (cam && (Math.abs(cam.rideAltitudeOffset || 0) > 2 || Math.abs(cam.ridePitch || 0) > 0.02)) {
    pg.push();
    const rx1 = rig.rearWheel.x - 180;
    const ry1 = rig.rearWheel.y + rig.wheelR - Math.tan(cam.ridePitch || 0) * 180;
    const rx2 = rig.frontWheel.x + 220;
    const ry2 = rig.frontWheel.y + rig.wheelR + Math.tan(cam.ridePitch || 0) * 220;
    if (eraObj.id === 'era11') {
      // Million-Volt AC Lightning Arc & 1982 Xiyou Somersault Cloud Highway directly under wheels!
      pg.noFill();
      pg.stroke(255, 224, 78, 225);
      pg.strokeWeight(8.0);
      pg.line(rx1, ry1, rx2, ry2);
      pg.stroke(138, 252, 255, 248);
      pg.strokeWeight(3.5);
      pg.beginShape();
      for (let i = 0; i <= 16; i++) {
        const u = i / 16;
        const lx = rx1 + (rx2 - rx1) * u;
        const ly = ry1 + (ry2 - ry1) * u + Math.sin(u * 25 - t * 32) * 7;
        pg.vertex(lx, ly);
      }
      pg.endShape();
    } else if (eraObj.id === 'era12' || eraObj.id === 'era15') {
      pg.noFill();
      pg.stroke(118, 248, 255, 210);
      pg.strokeWeight(5.0);
      pg.line(rx1, ry1, rx2, ry2);
    } else if (eraObj.id === 'era13') {
      // Hurdle jump kinetic trajectory ribbon
      pg.noFill();
      pg.stroke(255, 232, 68, 215);
      pg.strokeWeight(4.5);
      pg.line(rx1, ry1, rx2, ry2);
    }
    pg.pop();
  }
  renderDynamicWeather(pg, eraObj, state, xMin, xMax, W, H);
  renderMuseumRigForEra(pg, rig, state, eraObj);
  renderForegroundRackFocusProps(pg, eraObj, state, xMin, xMax, W, H);
  renderArtisticNonOccludingTypography(pg, eraObj, state, rig, xMin, xMax, W, H);

  ctx.restore();
  pg.pop();
}

function drawContinuousWorld(pg, state, rig, showVFX = true) {
  const W = pg.width;
  const H = pg.height;
  const sx = state.seamScreenX;
  rig.activeBubbleRect = null;

  if (sx >= -140 && sx <= W + 140 && state.leftEra.id !== state.rightEra.id) {
    const clampSx = Math.max(0, Math.min(W, sx));
    renderEraSlice(pg, state.leftEra, state, rig, 0, clampSx);
    renderEraSlice(pg, state.rightEra, state, rig, clampSx, W);
    renderNightAtMuseumCrossovers(pg, state, rig);
  } else {
    renderEraSlice(pg, state.era, state, rig, 0, W);
  }

  // Render Multi-Genre Media Broadcast FX (Zero-Overlap & Seam-Attenuated)
  BrushKit.drawMultiGenreBroadcastFX(pg, state, rig, W, H, showVFX);

  // Render Unified Top-Left Director VFX & Object Inspector Dock + Non-Occluding Target Reticle
  BrushKit.drawDirectorVFXCallouts(pg, state, rig, W, H, showVFX);

  // Always draw the 2.35:1 Cinema Black Letterbox Bars on top
  BrushKit.drawCinemaLetterboxHUD(pg, state, W, H);
}
