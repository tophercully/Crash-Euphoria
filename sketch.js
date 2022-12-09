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
   var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oraßn|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|verßi|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    isMobile = true;
}
  createCanvas(w, h, WEBGL);
  if(isFxpreview == true || isMobile == true) {
    pixelDensity(1)
  } else {
    pixelDensity(3)
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
  if(isFxpreview == true || isMobile == true) {
    p.pixelDensity(1);
    p2.pixelDensity(1);
  } else {
    p.pixelDensity(3);
    p2.pixelDensity(3);
  }
  
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
