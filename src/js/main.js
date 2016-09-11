import Bloom from './modules/bloom/bloom.js';
import Sphere from './modules/sphere.js';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true
});
const render_base = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
const scene_base = new THREE.Scene();
const camera_base = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const clock = new THREE.Clock();
const stats = new Stats();

const bloom = new Bloom(render_base.texture);
const sphere = new Sphere();

const resizeWindow = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera_base.aspect = window.innerWidth / window.innerHeight;
  camera_base.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render_base.setSize(window.innerWidth, window.innerHeight);
  bloom.resize();
}
const setEvent = () => {
  $(window).on('resize', () => {
    resizeWindow();
  });
}
const initDatGui = () => {
  const gui = new dat.GUI();
  const controller = {
    blurCount: gui.add(bloom, 'blurCount', 1, 10).name('blur count').step(1),
    minBright: gui.add(bloom.plane.bright, 'minBright', 0, 1).name('min bright'),
    strength: gui.add(bloom.plane.bloom, 'strength', 0, 3).name('bright strength'),
    tone: gui.add(bloom.plane.bloom, 'tone', 0, 1).name('original tone'),
    colorHue: gui.add(sphere, 'hue', 0, 1).name('color hue'),
  }
  controller.minBright.onChange((value) => {
    bloom.plane.bright.uniforms.minBright.value = value;
  });
  controller.strength.onChange((value) => {
    bloom.plane.bloom.uniforms.strength.value = value;
  });
  controller.tone.onChange((value) => {
    bloom.plane.bloom.uniforms.tone.value = value;
  });
  controller.colorHue.onChange((value) => {
    sphere.uniforms.hue.value = value;
  });
}
const initStats = () => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}
const render = () => {
  sphere.render(clock.getDelta());
  renderer.render(scene_base, camera_base, render_base);
  bloom.render(renderer);
}
const renderLoop = () => {
  stats.begin();
  render();
  stats.end();
  requestAnimationFrame(renderLoop);
}
const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x222222, 0.0);
  camera_base.position.set(0, 200, 1000);
  camera_base.lookAt(new THREE.Vector3());

  scene_base.add(sphere.mesh);

  setEvent();
  initDatGui();
  initStats();
  resizeWindow();
  renderLoop();
}
init();
