#ifdef GL_ES
precision highp float;
#endif

// grab texcoords from vert shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D p1;
uniform sampler2D p2;
uniform sampler2D lineV;
uniform sampler2D lineH;
uniform sampler2D waveV;
uniform sampler2D waveH;
uniform sampler2D dotMat;
uniform sampler2D solid;
uniform vec2 u_resolution;
uniform vec4 bgc;
uniform vec4 frameCol;
uniform float darkMod;
uniform float noiseMod;
uniform float noiseModB;
uniform float noiseStart;
uniform float fieldOff;
uniform float balance;
uniform bool mono;

float map(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return (mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y);
}

void main() {
  vec2 st = vTexCoord*u_resolution;
  vec2 uv = vTexCoord;
  vec2 uvB = vTexCoord.xy;
  vec2 uvC = vTexCoord.xy;
  
  // the texture is loaded upside down and backwards by default so lets flip it
  uv.y = 1.0 - uv.y;
  uvB.y = 1.0 - uvB.y;
  uvC.y = 1.0 - uvC.y;
  //uv is our base which we apply warp to
  //uvB is untouched
  //uvC is +random*x to mix into uvB and dull stray pixels
  float randPxOff = map(random(uvC.xy), 0.0, 1.0, -1.0, 1.0);
  uvC.xy += randPxOff*0.1;
  
  
  //noise warp for P2 + patterns
  float ns = map(noise((noiseStart+uv.xy)*noiseMod), 0.0, 1.0, -1.0, 1.0);
  float nsB = map(noise((noiseStart+uv.xy)*noiseModB), 0.0, 1.0, -1.0, 1.0);
  uv.xy += (ns)*fieldOff/2.0;
  uv.xy += (nsB)*fieldOff/2.0;
  uv.xy += random(uv.xy)*0.001;

  //declare guide layers
  vec4 texP1 = texture2D(p1, uv); 
  vec4 texP2 = texture2D(p2, uv);
  vec4 texP2B = texture2D(p2, uvB);
  vec4 texP2C = texture2D(p2, uvC);
  //declare pattern layers
  vec4 texLineV = texture2D(lineV, uv);
  vec4 texLineH = texture2D(lineH, uv);
  vec4 texWaveV = texture2D(waveV, uv);
  vec4 texWaveH = texture2D(waveH, uv);
  vec4 texDot = texture2D(dotMat, uv);
  vec4 texSolid = texture2D(solid, uv);
  
  //create grain in the color
  float noiseGray = random(uv.xy*(10000.0+uv.y+uv.y)) * 0.15;
  //create subtle shifts in luminance across the canvas
  float dMod = map(noise(uv.xy*darkMod), 0.0, 1.0, -1.0, 1.0);
  float noiseBig = dMod*0.025;
  
  //declare color variable
  vec3 color = vec3(0.0);
  // average color value of each pixel between warped px array and static px array
  float avgR = mix(texP2.r, texP2C.r, random(uv.xy)*balance);
  float avgG = mix(texP2.g, texP2C.g, random(uv.xy)*balance);
  float avgB = mix(texP2.b, texP2C.b, random(uv.xy)*balance);
  float noi = floor(((avgR + avgG + avgB)/3.0)*4.999);
  
  //Assign patterns to each noi value
    if(noi == 0.0) {
        color = vec3(texWaveH-noiseBig);
    } else if(noi == 1.0) {
        color = vec3(texLineV-noiseBig);
    } else if(noi == 2.0) {
        color = vec3(texDot-noiseBig);
    } else if(noi == 3.0) {
        color = vec3(texLineH-noiseBig);
    } else if(noi == 4.0) {
        color = vec3(texWaveV-noiseBig);
    } else {
      color = vec3(bgc-noiseBig);
    } 
  
  //Draw margin
  float margX = 0.05;
  float margY = margX*0.8;
  if(uvB.x < margX || uvB.x > 1.0-margX || uvB.y < margY || uvB.y > 1.0-margY) {
    color = vec3(bgc.r, bgc.g, bgc.b);
  }
  
  //Create grid texture
  float sinX = sin(uvB.x*1200.0);
  float sinY = sin(uvB.y*1200.0);
  vec3 final = vec3(0.0);
  float gridR = mix(color.r, frameCol.r, 0.03);
  float gridG = mix(color.g, frameCol.g, 0.03);
  float gridB = mix(color.b, frameCol.b, 0.03);
  float xThresh = map(noise(uv.xy*10.0), 0.0, 1.0, 0.7, 0.9);
  float yThresh = map(noise(uv.xy*10.0), 0.0, 1.0, 0.7, 0.9);
  if(sinX > xThresh || sinY > yThresh) {
    final = vec3(gridR, gridG, gridB);
  } else {
    final = vec3(color.rgb);
  }
  
  //Monochrome conditional
  vec3 avg = vec3((final.r+final.g+final.b)/3.0);
  if(mono == true) {
    final = vec3(avg);
  }

  gl_FragColor = vec4(final.rgb-noiseGray, vTexCoord);
}