function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(fxrand() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function randomVal(min, max) {
  return fxrand() * (max - min) + min;
}
function map_range(value, low1, high1, low2, high2) {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}

function shuff(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(fxrand() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function keyTyped() {
  if (key === "s" || key === "S") {
    save("Crash Euphoria.png");
  }
}

function p2Grid() {
  cellW = w / p2GridCols;
  cellH = h / p2GridRows;
  for (let x = 0; x < p2GridCols; x++) {
    for (let y = 0; y < p2GridRows; y++) {
      p2.noStroke();
      p2.fill(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255));
      p2.rect(x * cellW, y * cellH, cellW, cellH);
    }
  }
}

function pGrid() {
  cellW = w / pGridCols;
  cellH = h / pGridRows;
  for (let x = 0; x < pGridCols; x++) {
    for (let y = 0; y < pGridRows; y++) {
      p.noStroke();
      p.fill(chroma(truePal[randomInt(0, truePal.length)]).hex());
      p.rect(x * cellW, y * cellH, cellW, cellH);
    }
  }
}

function pComp() {
  numLayers = randomInt(100, 400);
  for (let i = 0; i < numLayers; i++) {
    p.noStroke();
    p.fill(
      chroma(truePal[randomInt(0, truePal.length)]).saturate().alpha(0.5).hex()
    );
    p.circle(
      randomInt(marg, w - marg),
      randomInt(marg, h - marg),
      randomInt(10, 200)
    );
  }
}

function p2Comp() {
  numLayers = randomInt(100, 400);
  for (let i = 0; i < numLayers; i++) {
    p2.noStroke();
    p2.fill(
      chroma(randomInt(0, 255), randomInt(0, 255), randomInt(0, 255))
        .alpha(0.5)
        .hex()
    );
    p2.noStroke();
    p2.circle(
      randomInt(marg, w - marg),
      randomInt(marg, h - marg),
      randomInt(10, 300)
    );
  }
}

function pWave() {
  rows = randomInt(10, 100);
  sineMod = randomInt(1, 5);
  hei = h / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < width; x++) {
      if (x === 0) {
        p.fill(chroma(truePal[randomInt(0, truePal.length)]).saturate().hex());
      }
      sineOff = map(sin(x * sineMod), -1, 1, -hei, hei);
      p.strokeCap(SQUARE);
      p.strokeWeight(3);
      p.line(x, y * hei + sineOff, x, (y + 1) * hei + sineOff);
    }
  }
}

function p2Wave() {
  rows = randomInt(10, 100);
  sineMod = randomInt(2, 6);
  hei = h / rows;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < width; x += 0.1) {
      if (x === 0) {
        strokeCol = color(
          randomInt(0, 255),
          randomInt(0, 255),
          randomInt(0, 255)
        );
      }
      p2.stroke(strokeCol);
      sineOff = map(sin(x * sineMod), -1, 1, -hei, hei);
      p2.strokeCap(SQUARE);
      p2.strokeWeight(3);
      p2.line(x, y * hei + sineOff, x, (y + 1) * hei + sineOff);
    }
  }
}

function pCircRing() {
  numCircs = randomInt(100, 200);
  maxR = h * 4;
  diffX = w - w / pScale;
  diffY = h - h / pScale;
  center = createVector(
    randomInt(diffX, w - diffX),
    randomInt(diffY, h - diffY)
  );
  for (let i = 0; i < numCircs; i++) {
    p.noStroke();
    r = map(i, 0, numCircs, maxR, 0);
    p.fill(chroma(truePal[randomInt(0, truePal.length)]).saturate().hex());
    p.circle(center.x, center.y, r);
  }
}

function pSquareRing() {
  numCircs = randomInt(100, 200);
  maxR = h * 4;
  diffX = w - w / pScale;
  diffY = h - h / pScale;
  center = createVector(
    randomInt(diffX, w - diffX),
    randomInt(diffY, h - diffY)
  );
  for (let i = 0; i < numCircs; i++) {
    p.noStroke();
    r = map(i, 0, numCircs, maxR, 0);
    p.fill(chroma(truePal[randomInt(0, truePal.length)]).saturate().hex());
    p.rectMode(CENTER);
    p.square(center.x, center.y, r);
  }
}

function p2SquareRing() {
  numCircs = randomInt(100, 200);
  maxR = h * 4;
  play = maxR / 2 / numCircs;
  diffX = w - w / p2Scale;
  diffY = h - h / p2Scale;
  center = createVector(
    randomInt(diffX, w - diffX),
    randomInt(diffY, h - diffY)
  );
  for (let i = 0; i < numCircs; i++) {
    p2.noStroke();
    r = map(i, 0, numCircs, maxR, 0);
    p2.fill(random(0, 255), random(0, 255), random(0, 255));
    p2.rectMode(CENTER);
    p2.square(
      center.x + randomInt(-play, play),
      center.y + randomInt(-play, play),
      r
    );
  }
}

function p2Sunburst() {
  r = h * 3;
  dens = randomInt(3, 20);
  a = 0;
  p2.push();
  diffX = w - w / p2Scale;
  diffY = h - h / p2Scale;
  p2.translate(randomInt(diffX, w - diffX), randomInt(diffY, h - diffY));
  for (let i = 0; i < 360; i += 0.1) {
    n = noise(a * 0.0001) * 255;
    a += 360 / dens;
    x = cos(i) * r;
    y = sin(i) * r;
    p2.stroke(n);
    p2.strokeWeight(3);
    p2.line(0, 0, x, y);
  }
  p2.pop();
}

function vertLines() {
  col = truePal[randomInt(0, truePal.length)];
  lineV.fill(truePal[randomInt(0, truePal.length)]);
  decider = fxrand();
  dCol = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
  for (let x = 0; x < width; x += w / densV) {
    for (let y = 0; y < height; y++) {
      wid = w / densV;
      col = p.get(x, y);
      if (decider < 0.5) {
        col = dCol;
      }

      if (fxrand() < imperfLim) {
        col = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
      }
      lineV.fill(col);
      lineV.noStroke();
      lineV.strokeWeight(wtV / 2);
      lineV.square(x, y, wtV / 2);
    }
  }
}

function horizLines() {
  col = truePal[randomInt(0, truePal.length)];
  lineV.fill(truePal[randomInt(0, truePal.length)]);
  decider = fxrand();
  dCol = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y += h / densH) {
      wid = w / densV;
      col = p.get(x, y);
      if (decider < 0.5) {
        col = dCol;
      }

      if (fxrand() < imperfLim) {
        col = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
      }
      lineH.fill(col);
      lineH.noStroke();
      lineH.strokeWeight(wtH / 2);
      lineH.square(x, y, wtH / 2);
    }
  }
}

function vertWaves() {
  waveV.noStroke();
  sineModY = randomVal(1, 4);
  decider = fxrand();
  dCol = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
  for (let x = 0; x < width; x += w / densWV) {
    for (let y = 0; y < height; y++) {
      waveV.fill(col);
      wid = w / densWV;
      sine = sin(y * sineModY);
      col = color(p.get(x + (wid / 2) * sine, y));
      if (decider < 0.5) {
        col = dCol;
      }
      if (fxrand() < imperfLim) {
        col = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
      }
      waveV.strokeWeight(wtWV / 2);
      waveV.stroke(col);
      waveV.point(x + (wid / 2) * sine, y);
    }
  }
}

function horizWaves() {
  decider = fxrand();
  dCol = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
  waveH.noStroke();
  sineModY = randomVal(1, 4);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y += h / densWH) {
      waveH.fill(col);
      hei = h / densWH;
      sine = sin(x * sineModY);
      col = color(p.get(x, y + (hei / 2) * sine));
      if (decider < 0.5) {
        col = dCol;
      }

      if (fxrand() < imperfLim) {
        col = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
      }
      waveH.strokeWeight(wtWH / 2);
      waveH.stroke(col);
      waveH.point(x, y + (hei / 2) * sine);
    }
  }
}

function dotMat() {
  dotMatrix.noStroke();
  sineModX = randomVal(1, 5);
  decider = fxrand();
  dCol = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
  for (let x = 0; x < width; x += w / dotDensV) {
    for (let y = 0; y < height; y += h / dotDensH) {
      col = color(p.get(x, y));
      if (decider < 0.5) {
        col = dCol;
      }

      if (fxrand() < imperfLim) {
        col = chroma(truePal[randomInt(0, truePal.length)]).saturate().hex();
      }
      dotMatrix.fill(col);
      wid = w / densWV;
      sine = sin(y * sineModX);
      dotMatrix.square(x, y, wtWH);
    }
  }
}

function p2Circ(x, y, r) {
  p2.push();
  p2.translate(x, y);
  p2.beginShape();
  for (let a = 0; a < 360; a += 0.1) {
    xA = cos(a) * r;
    yA = sin(a) * r;
    p2.vertex(xA, yA);
  }
  p2.endShape();
  p2.pop();
}

function pMount() {
  numMounts = randomInt(5, 15);
  chunk = h / numMounts;
  noiseScale = 0.001;
  for (let y = 0; y < numMounts; y++) {
    p.stroke(chroma(truePal[randomInt(0, truePal.length)]).saturate().hex());
    noiseScale = randomVal(0.001, 0.01);
    for (let x = 0; x < w; x++) {
      n = map(noise(x * noiseScale), 0, 1, y, y + 2);
      hei = h / numMounts;
      p.line(x, h, x, n * hei);
    }
  }
}
