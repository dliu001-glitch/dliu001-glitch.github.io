
import * as THREE from "../../Utility/three.js/build/three.module.js";
import { GUI } from "../../Utility/three.js/examples/jsm/libs/dat.gui.module.js";

const vshader = `

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;
const fshader = `
precision highp float;
precision highp int;


uniform float u_centerX;
uniform float u_centerY;

uniform float u_radius;
uniform float u_sharpen;
uniform float u_layers;
uniform vec2 u_resolution;
uniform float u_time;
float N21(vec2 p){
  p = fract(p * vec2(234.75, 857.12));
  p += dot(p, p+23.45);
  return fract(p.x * p.y);
}
vec2 N22(vec2 p){
  float n = N21(p);
  return vec2(n, N21(p + n));
}
float getDistance(vec2 p, vec2 a, vec2 b){
  vec2 ap = p - a;
  vec2 ab = b - a;
  float s = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
  float d = length(ap - ab * s);
  return d;
}
float Line(vec2 p, vec2 a, vec2 b, float stroke, float blur){
  float d = getDistance(p, a, b);
  float disRange = smoothstep(1.2, 0.2, length(a-b));
  float line = smoothstep(stroke + blur, stroke, d);
  line *= disRange;
  return line;
}
vec2 GetRandomP(vec2 id, vec2 offs){
  vec2 n = N22(id + offs) * u_time;
  return offs + sin(n) * 0.4;
}

float GridUV(vec2 uv, float layer, float phase){

  uv *= layer;
  uv +=  phase;
  // uv *= 5.0; 
  vec2 grid = fract(uv)-0.5;
  vec2 id = floor(uv);
  
  // vec2 p = GetRandomP(id, vec2(0.0));
  // float d = length(grid - p);
  // float m = smoothstep(0.05, 0.1, d);

  float m = 0.0;

  vec2 p[9];
  int index = 0;
  for(float y = -1.0; y <= 1.0; y++){
    for(float x = -1.0; x <= 1.0; x++){
      p[index++] = GetRandomP(id, vec2(x, y));
    }
  } 

  float stroke = u_radius;

  for(int i = 0; i < 9; i++){
    float pd = getDistance(grid, p[4], p[i]);
    m += Line(grid, p[4], p[i], stroke, 0.01);

    vec2 sparkleR = (p[i] - grid) * 20.0;
    float sparkle = 1.0/dot(sparkleR, sparkleR);
    m += sparkle * (sin(u_time + fract(p[i].x) * 10.0) * 0.5 + 0.5);
  } 
  m += Line(grid, p[1], p[3], stroke, 0.01);
  m += Line(grid, p[1], p[5], stroke, 0.01);
  m += Line(grid, p[5], p[7], stroke, 0.01);
  m += Line(grid, p[3], p[7], stroke, 0.01);

  vec3 col = vec3(1.0) * m;
  // col.rg = id * 0.2;
  // if(grid.x > 0.48 || grid.y > 0.48) col = vec3(0.0);
  return m;
}

void main (void){
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  
  uv.x *= u_resolution.x/u_resolution.y;
  uv -=  vec2(u_resolution.x/u_resolution.y/2.0, 0.5);
  
  float m = 1.0;

  float s = sin(u_time * 0.1);
  float c = cos(u_time * 0.1);
  mat2 rot = mat2 (c, -s, s, c);
  uv *= rot;
  
  float layersNum = 1.0/u_layers;

  for(float layer = 0.0; layer <= 1.0; layer += layersNum){
    float size = mix(5.0, 0.5, fract(layer + u_time * 0.1));
    float fade = smoothstep(0.0, 0.2, fract(layer + u_time * 0.1)) * smoothstep(1.0 , 0.8, fract(layer + u_time * 0.1));
    
    float guv = GridUV(uv, size, layer * 20.0) * fade;
    m -= guv;
  }
  m *= u_sharpen;
  vec3 gcol = vec3(m);
  // gcol = vec3(N22(uv).y);
  
  gl_FragColor = vec4(gcol,1.0);
}
`;

main();
function main() {
  //create a canvas
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio);
  //create a camera
  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  // const camera = new THREE.perspectiveCamera(fov, aspect, near, far);
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 2;

  //make scene
  const scene = new THREE.Scene();
  //make a Geo and material
  const boxWidth = 4;
  const boxHeight = 2;
  const boxDepth = 1;
  const geometry = new THREE.PlaneGeometry(boxWidth, boxHeight);

  const uniforms = {
    u_resolution: { value: { x: 0.0, y: 0.0 } },
    u_radius: { value: 0.5 },
    u_sharpen: { value: 0.0 },
    u_layers: { value: 2.0 },

    u_centerX: { value: 0.0 },
    u_centerY: { value: 0.0 },

    u_time: { value: 0.0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vshader,
    fragmentShader: fshader,
    transparent: true,
    blending: THREE.NormalBlending,
  });
  // material.transparent = true;
  //make a mesh which contains the Geo and material made above
  const plane = new THREE.Mesh(geometry, material);
  //add the mesh to scene
  scene.add(plane);
  //call renderer
  renderer.render(scene, camera);

  //add GUI
  const params = {
    radius: 0.01,
    centerX: 0.0,
    centerY: 0.0,
    sharpen: 1.0,
    layers: 2.0,
    // time: 0.02,
  };
  const gui = new GUI( { autoPlace: false } );
  const divGui = document.querySelector('#gui');
  divGui.append(gui.domElement);
  gui.close();

 
  gui
    .add(params, "radius")
    .name("Radius")
    .min(0.0)
    .max(0.1)
    .step(0.01);
  gui
    .add(params, "sharpen")
    .name("Sharpen")
    .min(1.0)
    .max(3.0)
    .step(0.01);
  gui
    .add(params, "layers")
    .name("Number of Layers")
    .min(1.0)
    .max(10.0)
    .step(1.0);

  //animation function
  function animate(time) {
    time *= 0.001;

    uniforms.u_centerX.value = params.centerX;
    uniforms.u_centerY.value = params.centerY;
    uniforms.u_radius.value = params.radius;
    uniforms.u_time.value = time;
    uniforms.u_sharpen.value = params.sharpen;
    uniforms.u_layers.value = params.layers;

    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  //resize window
  function onWindowResize() {
    // camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    
    
    // camera.aspect = windows.clientWidth / canvas.clientHeight;
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // uniforms.u_resolution.value.x = window.innerWidth;
    // uniforms.u_resolution.value.y = window.innerHeight;
    uniforms.u_resolution.value.x = canvas.clientWidth;
    uniforms.u_resolution.value.y = canvas.clientHeight;

    // labelRenderer.setSize(window.innerWidth, window.innerHeight);
  }
  onWindowResize();
  window.addEventListener("resize", onWindowResize);
}
