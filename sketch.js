w = 1200;
h = 1500;
marg = w * 0.05;

let shade;
function preload() {
  shade = loadShader("shader.vert", "shader.frag");
}

monoDecider = fxrand();
if (monoDecider < 0.05) {
  mono = true;
  palName = "Monochrome";
  bgName = "Monochrome"
} else {
  mono = false;
}

maxSize = 40;
pGridCols = randomInt(3, maxSize);
pGridRows = randomInt(3, maxSize);
p2GridCols = randomInt(3, maxSize);
p2GridRows = randomInt(3, maxSize);

//Imperfection chance
imperfLim = randomVal(0.005, 0.05);

//Pattern parameters
minWt = 4;
maxWt = 10;
minDens = 10;
maxDens = 200;
densV = randomInt(minDens, maxDens);
densH = randomInt(minDens, maxDens);
densWV = randomInt(minDens, maxDens);
densWH = randomInt(minDens, maxDens);
dotDensV = randomInt(minDens, maxDens);
dotDensH = dotDensV * 0.8;
wtV = w / densV;
wtH = h / densH;
wtWV = map_range(densWV, minDens, maxDens, maxWt, minWt);
wtWH = map_range(densWH, minDens, maxDens, maxWt, minWt);
wtDot = map_range((dotDensV + dotDensH) / 2, minDens, maxDens, maxWt, minWt);
pRot = -randomInt(-90, 90);
pScale = map_range(Math.abs(pRot), 0, 90, 1.25, 2.25);
p2Rot = randomInt(-90, 90);
p2Scale = map_range(Math.abs(pRot), 0, 90, 1.25, 2.25);

//Create shader values
noiseMod = randomVal(2, 10);
noiseModB = randomVal(2, 10);
noiseStart = randomVal(0, 100);
fieldOff = randomVal(0.05, 0.1);
balance = 0.3;


//Guide pattern deciders
pDecider = Math.floor(randomVal(1, 6.99)); // 1 to 6
p2Decider = Math.floor(randomVal(1, 5.99)); //1 to 5

//Declare for features
if (pDecider === 1) {
  colorGuide = "Grid";
} else if (pDecider === 2) {
  colorGuide = "Wave";
} else if (pDecider === 3) {
  colorGuide = "Bubbles";
} else if (pDecider === 4) {
  colorGuide = "Concentric Circles";
} else if (pDecider === 5) {
  colorGuide = "Concentric Squares";
} else if (pDecider === 6) {
  colorGuide = "Mountains";
}

if (p2Decider === 1) {
  patGuide = "Grid";
} else if (p2Decider === 2) {
  patGuide = "Waves";
} else if (p2Decider === 3) {
  patGuide = "Bubbles";
} else if (p2Decider === 4) {
  patGuide = "Concentric Squares";
} else if (p2Decider === 5) {
  patGuide = "Burst";
}

window.$fxhashFeatures = {
  "Color Guide": colorGuide,
  "Pattern Guide": patGuide,
  Palette: palName,
  Background: bgName,
};

function setup() {
  if (isFxpreview === true) {
    pixelDensity(1);
  } else {
    pixelDensity(3);
  }

  mainCanvas = createCanvas(w, h, WEBGL);
  p = createGraphics(w, h);
  p2 = createGraphics(w, h);
  lineV = createGraphics(w, h);
  lineH = createGraphics(w, h);
  dotMatrix = createGraphics(w, h);
  waveV = createGraphics(w, h);
  waveH = createGraphics(w, h);
  solid = createGraphics(w, h);
  setAttributes("antialias", true);
  noLoop();
  p.noLoop();
  p2.noLoop();
  lineV.noLoop();
  lineH.noLoop();
  waveV.noLoop();
  waveH.noLoop();
  dotMatrix.noLoop();

  p.pixelDensity(3);
  p2.pixelDensity(3);
  p.angleMode(DEGREES);
  p2.angleMode(DEGREES);
  angleMode(DEGREES);
}

seed = randomInt(1, 100000000000);

function draw() {
  //set seeds for all graphics objects
  noiseSeed(seed);
  randomSeed(seed);
  p.noiseSeed(seed);
  p.randomSeed(seed);
  p2.noiseSeed(seed);
  p2.randomSeed(seed);
  lineV.noiseSeed(seed);
  lineV.randomSeed(seed);
  lineH.noiseSeed(seed);
  lineH.randomSeed(seed);
  waveV.noiseSeed(seed);
  waveH.randomSeed(seed);
  dotMatrix.noiseSeed(seed);
  dotMatrix.randomSeed(seed);

  //backgrounds for everybody, everybody gets a background
  p2.push();
  background(bgc);
  p.background(bgc);
  p2.background(bgc);
  lineV.background(bgc);
  lineH.background(bgc);
  dotMatrix.background(bgc);
  waveV.background(bgc);
  waveH.background(bgc);
  solid.background(bgc);

  if (frameCount === 1) {
    //Fix webgl translation
    translate(-w / 2, -h / 2);

    //Set up every graphics object
    p.translate(w / 2, h / 2);
    p.rotate(pRot);
    p.scale(pScale);
    p.translate(-w / 2, -h / 2);

    p2.translate(w / 2, h / 2);
    p2.rotate(p2Rot);
    p2.scale(p2Scale);
    p2.translate(-w / 2, -h / 2);

    lineV.translate(w / 2, h / 2);
    rot = randomInt(-90, 90);
    lineV.rotate(rot);
    lineV.scale(map(abs(rot), 0, 90, 1.25, 2.25));
    lineV.translate(-w / 2, -h / 2);

    lineH.translate(w / 2, h / 2);
    rot = randomInt(-90, 90);
    lineH.rotate(rot);
    lineH.scale(map(abs(rot), 0, 90, 1.25, 2.25));
    lineH.translate(-w / 2, -h / 2);

    waveV.translate(w / 2, h / 2);
    rot = randomInt(-90, 90);
    waveV.rotate(rot);
    waveV.scale(map(abs(rot), 0, 90, 1.25, 2.25));
    waveV.translate(-w / 2, -h / 2);

    waveH.translate(w / 2, h / 2);
    rot = randomInt(-90, 90);
    waveH.rotate(rot);
    waveH.scale(map(abs(rot), 0, 90, 1.25, 2.25));
    waveH.translate(-w / 2, -h / 2);

    dotMatrix.translate(w / 2, h / 2);
    rot = randomInt(-90, 90);
    dotMatrix.rotate(rot);
    dotMatrix.scale(map(abs(rot), 0, 90, 1.25, 2.25));
    dotMatrix.translate(-w / 2, -h / 2);
  }

  //Draw color guide
  if (pDecider === 1) {
    pGrid(1);
  } else if (pDecider === 2) {
    pWave();
  } else if (pDecider === 3) {
    pComp(20, 0.5);
  } else if (pDecider === 4) {
    pCircRing(20, 0.5);
  } else if (pDecider === 5) {
    pSquareRing(20, 0.5);
  } else if (pDecider === 6) {
    pMount();
  }

  //Draw pattern guide
  if (p2Decider === 1) {
    p2Grid(1);
  } else if (p2Decider === 2) {
    p2Wave();
  } else if (p2Decider === 3) {
    p2Comp();
  } else if (p2Decider === 4) {
    p2SquareRing();
  } else if (p2Decider === 5) {
    p2Sunburst();
  }
  p2.pop();

  //Draw patterns
  vertLines();
  horizLines();
  vertWaves();
  horizWaves();
  dotMat();

  shader(shade);
  //Send px arrays to shader
  shade.setUniform("u_resolution", [w, h]);
  shade.setUniform("seed", randomVal(0, 10));
  shade.setUniform("p1", p);
  shade.setUniform("p2", p2);
  shade.setUniform("lineV", lineV);
  shade.setUniform("lineH", lineH);
  shade.setUniform("waveV", waveV);
  shade.setUniform("waveH", waveH);
  shade.setUniform("dotMat", dotMatrix);
  shade.setUniform("solid", solid);

  

  //Send values to shader
  bgc = color(bgc);
  frameCol = color(frameCol);
  shade.setUniform("darkMod", randomVal(2, 5));
  shade.setUniform("noiseMod", noiseMod);
  shade.setUniform("noiseModB", noiseModB);
  shade.setUniform("noiseStart", noiseStart);
  shade.setUniform("mono", mono);
  shade.setUniform("fieldOff", fieldOff);
  shade.setUniform("balance", balance);
  shade.setUniform("bgc", [
    bgc.levels[0] / 255,
    bgc.levels[1] / 255,
    bgc.levels[2] / 255,
  ]);
  shade.setUniform("frameCol", [
    frameCol.levels[0] / 255,
    frameCol.levels[1] / 255,
    frameCol.levels[2] / 255,
  ]);

  //Draw geometry for shader
  rect(0, 0, w, h);

  //Preview trigger for fxhash
  fxpreview();
}
