// Red 3D persistente: una sola escena cuya topología cuenta la historia.
// Estados: 0 nodos aislados · 1 anillo alrededor de PROYECTO · 2 fragmentación
// 3 convergencia · 4 módulos en órbita · 5 ecosistema estable (cierre).
import {
  BufferAttribute,
  BufferGeometry,
  ColorManagement,
  LineSegments,
  LinearSRGBColorSpace,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector3,
  WebGLRenderer,
} from 'three';

ColorManagement.enabled = false;

const STATES = 6;
const K = 9; // nodos clave (entidades → herramientas → módulos)
const TAU = Math.PI * 2;

const smooth = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, f) => a + (b - a) * f;

function rgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Valor por estado interpolado con suavizado
function sample(arr, s0, s1, f) {
  return lerp(arr[s0], arr[s1], f);
}

// ---------------------------------------------------------------------------
// Paleta por estado (solo colores de marca y variaciones suaves)
// ---------------------------------------------------------------------------
const AMBIENT_COLOR = ['#4A5568', '#4A5568', '#4A5568', '#6FB2F5', '#6FB2F5', '#6FB2F5'].map(rgb);
const AMBIENT_ALPHA = [0.42, 0.3, 0.5, 0.55, 0.42, 0.3];
const AMBIENT_SIZE = [0.052, 0.045, 0.05, 0.045, 0.04, 0.042];
const AMBIENT_WOBBLE = [0.08, 0.05, 0.13, 0.03, 0.035, 0.05];

const KEY_COLOR = ['#1A365D', '#0066CC', '#4A5568', '#A9D1FA', '#A9D1FA', '#6FB2F5'].map(rgb);
const KEY_ALPHA = [0.85, 1, 1, 1, 1, 0.5];
const KEY_SIZE = [0.13, 0.17, 0.15, 0.15, 0.19, 0.13];

const CORE_COLOR = ['#1A365D', '#1A365D', '#A0AEC0', '#FFFFFF', '#FFFFFF', '#F7FAFC'].map(rgb);
const CORE_ALPHA = [0, 1, 0.55, 1, 1, 0];
const CORE_SIZE = [0.2, 0.46, 0.34, 0.62, 0.52, 0.36];

const SPOKE_COLOR = ['#0066CC', '#0066CC', '#4A5568', '#6FB2F5', '#6FB2F5', '#6FB2F5'].map(rgb);
const SPOKE_ALPHA = [0, 0.5, 0.42, 0.85, 0.42, 0.1];
const SPOKE_REACH = [1, 1, 0.2, 1, 1, 1];

const ORBIT_ALPHA = [0, 0, 0, 0, 0.22, 0.13];
const SECURITY_ALPHA = [0, 0, 0, 0, 0.42, 0.16];

const CAMERA_Z = [10, 10, 10, 8.3, 10, 10.4];

// Visibilidad de nodos y etiquetas
const KEY_VIS = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
const LABEL_STATES = [false, true, true, false, true, false];
const CORE_LABEL = [0, 1, 0, 1, 1, 0];

// Encuadre por estado: desplazamiento y escala según proporción de pantalla
const FRAMES_WIDE = [
  { x: 2.7, y: -0.1, s: 1 },
  { x: 2.3, y: -0.25, s: 0.95 },
  { x: 2.25, y: -0.05, s: 1 },
  { x: 0, y: -0.45, s: 1 },
  { x: 2.15, y: -0.1, s: 0.85 },
  { x: 0, y: 0.3, s: 1.12 },
];
const FRAMES_NARROW = [
  { x: 0.3, y: -1.7, s: 0.62 },
  { x: 0, y: -1.85, s: 0.55 },
  { x: 0, y: -2.0, s: 0.5 },
  { x: 0, y: -0.35, s: 0.72 },
  { x: 0, y: -2.25, s: 0.5 },
  { x: 0, y: 0, s: 0.72 },
];

// ---------------------------------------------------------------------------
// Distribuciones
// ---------------------------------------------------------------------------
function buildLayouts(ambientCount) {
  const rnd = mulberry32(2027);

  const key = Array.from({ length: STATES }, () => Array.from({ length: K }, () => [0, 0, 0]));
  for (let i = 0; i < K; i += 1) {
    key[0][i] = [(rnd() - 0.5) * 7.2, (rnd() - 0.5) * 4.6, -2 + rnd() * 3.2];
  }
  for (let i = 0; i < 7; i += 1) {
    const a = -Math.PI / 2 + (i * TAU) / 7;
    key[1][i] = [Math.cos(a) * 2.5, Math.sin(a) * 2.25, Math.sin(a) * 0.5];
  }
  key[1][7] = [0, 0, 0];
  key[1][8] = [0, 0, 0];
  const scatter = [
    [-1.75, 1.85, -0.4],
    [1.85, 2.15, -1.6],
    [2.75, 0.35, 0.5],
    [-2.05, -0.55, 0.9],
    [-0.35, -2.2, -1.0],
    [2.35, -1.45, 0.2],
    [0.15, 0.55, -2.4],
  ];
  for (let i = 0; i < K; i += 1) key[2][i] = scatter[i % 7];
  for (let i = 0; i < K; i += 1) {
    const a = -Math.PI / 2 + (i * TAU) / K;
    key[3][i] = [Math.cos(a) * 1.15, Math.sin(a) * 1.05, i % 2 ? 0.3 : -0.3];
  }

  // Ambient: posiciones estáticas para 0–3 y parámetros polares para 4–5
  const amb = Array.from({ length: 4 }, () => new Float32Array(ambientCount * 3));
  const polar = new Float32Array(ambientCount * 4); // ángulo, radio, altura, capa
  const shell = new Float32Array(ambientCount * 3);
  const phase = new Float32Array(ambientCount);

  for (let j = 0; j < ambientCount; j += 1) {
    const o = j * 3;
    phase[j] = rnd() * TAU;

    // 0 · nube de datos aislados
    const u = rnd();
    const v = rnd();
    const th = u * TAU;
    const ph = Math.acos(2 * v - 1);
    const r0 = 0.45 + rnd() * 0.75;
    amb[0][o] = Math.sin(ph) * Math.cos(th) * 6.4 * r0;
    amb[0][o + 1] = Math.sin(ph) * Math.sin(th) * 3.6 * r0;
    amb[0][o + 2] = -4.5 + rnd() * 6;

    // 1 · halo alrededor del anillo
    const a1 = rnd() * TAU;
    const r1 = 2.5 * (1.15 + rnd() * 0.95);
    amb[1][o] = Math.cos(a1) * r1;
    amb[1][o + 1] = Math.sin(a1) * r1 * 0.85;
    amb[1][o + 2] = (rnd() - 0.5) * 2.6;

    // 2 · islas de información + dispersión
    if (j % 5 < 2) {
      const isle = scatter[j % 7];
      const g = () => (rnd() + rnd() + rnd() - 1.5) * 0.55;
      amb[2][o] = isle[0] + g();
      amb[2][o + 1] = isle[1] + g();
      amb[2][o + 2] = isle[2] + g();
    } else {
      amb[2][o] = (rnd() - 0.5) * 8.4;
      amb[2][o + 1] = (rnd() - 0.5) * 6;
      amb[2][o + 2] = -4.5 + rnd() * 6;
    }

    // 3 · convergencia hacia el núcleo
    const r3 = 0.28 + Math.pow(rnd(), 1.6) * 1.55;
    amb[3][o] = Math.sin(ph) * Math.cos(th) * r3;
    amb[3][o + 1] = Math.sin(ph) * Math.sin(th) * r3;
    amb[3][o + 2] = Math.cos(ph) * r3;

    // 4 · banda orbital, anillo de seguridad y polvo
    const layer = rnd();
    polar[j * 4] = rnd() * TAU;
    polar[j * 4 + 3] = layer < 0.62 ? 0 : layer < 0.86 ? 1 : 2;
    polar[j * 4 + 1] = layer < 0.62 ? 2.75 + (rnd() - 0.5) * 1.1 : layer < 0.86 ? 3.75 + (rnd() - 0.5) * 0.14 : 1.2 + rnd() * 4;
    polar[j * 4 + 2] = (rnd() - 0.5) * (layer < 0.86 ? 0.25 : 3);

    // 5 · cáscara amplia
    const r5 = 4.2 + rnd() * 1.6;
    shell[o] = Math.sin(ph) * Math.cos(th) * r5;
    shell[o + 1] = Math.sin(ph) * Math.sin(th) * r5 * 0.7;
    shell[o + 2] = Math.cos(ph) * r5 * 0.6 - 1;
  }

  return { key, amb, polar, shell, phase };
}

// ---------------------------------------------------------------------------
// Shaders
// ---------------------------------------------------------------------------
const POINT_VERT = /* glsl */ `
  attribute float aSize;
  attribute vec4 aColor;
  attribute float aRing;
  uniform float uScale;
  varying vec4 vColor;
  varying float vRing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(1.0, aSize * uScale / -mv.z);
    vColor = aColor;
    vRing = aRing;
  }
`;

const POINT_FRAG = /* glsl */ `
  varying vec4 vColor;
  varying float vRing;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.42, 0.5, d);
    float ring = (1.0 - smoothstep(0.44, 0.5, d)) * smoothstep(0.36, 0.42, d);
    float core = 1.0 - smoothstep(0.22, 0.28, d);
    float a = mix(disc, max(ring, core), vRing);
    if (a <= 0.01) discard;
    gl_FragColor = vec4(vColor.rgb, vColor.a * a);
  }
`;

const LINE_VERT = /* glsl */ `
  attribute vec4 aColor;
  varying vec4 vColor;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vColor = aColor;
  }
`;

const LINE_FRAG = /* glsl */ `
  varying vec4 vColor;
  void main() { gl_FragColor = vColor; }
`;

// ---------------------------------------------------------------------------
export function createNetwork({ canvas, layer, sets, reduced = false, onFrame, onPick }) {
  const small = window.innerWidth < 760;
  const ambientCount = small ? 120 : 260;
  const L = buildLayouts(ambientCount);

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 10);

  // --- Puntos (ambient + clave + núcleo) en una sola geometría
  const total = ambientCount + K + 1;
  const pos = new Float32Array(total * 3);
  const col = new Float32Array(total * 4);
  const size = new Float32Array(total);
  const ring = new Float32Array(total);
  ring[total - 1] = 1;
  const pGeo = new BufferGeometry();
  pGeo.setAttribute('position', new BufferAttribute(pos, 3));
  pGeo.setAttribute('aColor', new BufferAttribute(col, 4));
  pGeo.setAttribute('aSize', new BufferAttribute(size, 1));
  pGeo.setAttribute('aRing', new BufferAttribute(ring, 1));
  const pMat = new ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    uniforms: { uScale: { value: 1 } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const points = new Points(pGeo, pMat);
  points.frustumCulled = false;
  points.renderOrder = 2;
  scene.add(points);

  // --- Líneas: radios + órbita + anillo de seguridad
  const ORBIT_SEG = 120;
  const SEC_SEG = 72; // segmentos discontinuos
  const lineVerts = K * 2 + ORBIT_SEG * 2 + SEC_SEG * 2;
  const lPos = new Float32Array(lineVerts * 3);
  const lCol = new Float32Array(lineVerts * 4);
  const lGeo = new BufferGeometry();
  lGeo.setAttribute('position', new BufferAttribute(lPos, 3));
  lGeo.setAttribute('aColor', new BufferAttribute(lCol, 4));
  const lMat = new ShaderMaterial({
    vertexShader: LINE_VERT,
    fragmentShader: LINE_FRAG,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const lines = new LineSegments(lGeo, lMat);
  lines.frustumCulled = false;
  lines.renderOrder = 1;
  scene.add(lines);

  // --- Etiquetas HTML proyectadas
  const labelTexts = (s, i) => {
    if (s === 1) return sets.entities[i] ? { name: sets.entities[i] } : null;
    if (s === 2) return sets.tools[i] ? sets.tools[i] : null;
    if (s === 4) return sets.modules[i] ? { name: sets.modules[i] } : null;
    return null;
  };
  const labels = [];
  for (let i = 0; i < K; i += 1) {
    const el = document.createElement('div');
    el.className = 'node-label';
    el.innerHTML = '<div class="node-label__box"><span class="node-label__name"></span><span class="node-label__sub"></span></div>';
    el.dataset.index = String(i);
    el.addEventListener('pointerenter', () => el.classList.contains('is-interactive') && onPick?.(i, 'hover'));
    el.addEventListener('pointerleave', () => el.classList.contains('is-interactive') && onPick?.(-1, 'hover'));
    el.addEventListener('click', () => el.classList.contains('is-interactive') && onPick?.(i, 'click'));
    layer.appendChild(el);
    labels.push({ el, name: el.querySelector('.node-label__name'), sub: el.querySelector('.node-label__sub'), state: -1, left: null });
  }
  const core = document.createElement('div');
  core.className = 'node-label node-label--core';
  core.innerHTML = '<div class="node-label__box">Proyecto</div>';
  layer.appendChild(core);

  // --- Estado
  let target = 0;
  let shown = 0;
  let focus = -1;
  let focusAmt = new Float32Array(K);
  let rot = 0;
  let intro = reduced ? 1 : 0;
  let active = true;
  let running = false;
  let width = 1;
  let height = 1;
  let narrow = false;
  let pointerX = 0;
  let pointerY = 0;
  let camX = 0;
  let camY = 0;
  const last = { t: performance.now() };
  const v = new Vector3();

  function frameAt(s0, s1, f) {
    const F = narrow ? FRAMES_NARROW : FRAMES_WIDE;
    return { x: lerp(F[s0].x, F[s1].x, f), y: lerp(F[s0].y, F[s1].y, f), s: lerp(F[s0].s, F[s1].s, f) };
  }

  function keyPos(s, i, out) {
    if (s === 4 || s === 5) {
      const R = s === 4 ? 2.75 : 3.5;
      const yk = s === 4 ? 0.5 : 0.42;
      const a = -Math.PI / 2 + (i * TAU) / K + rot;
      out[0] = Math.cos(a) * R;
      out[1] = Math.sin(a) * R * yk;
      out[2] = Math.sin(a) * R * 0.75;
      return out;
    }
    const p = L.key[s][i];
    out[0] = p[0];
    out[1] = p[1];
    out[2] = p[2];
    return out;
  }

  function ambPos(s, j, out) {
    const o = j * 3;
    if (s <= 3) {
      out[0] = L.amb[s][o];
      out[1] = L.amb[s][o + 1];
      out[2] = L.amb[s][o + 2];
    } else if (s === 4) {
      const a = L.polar[j * 4] + rot;
      const r = L.polar[j * 4 + 1];
      out[0] = Math.cos(a) * r;
      out[1] = Math.sin(a) * r * 0.5 + L.polar[j * 4 + 2];
      out[2] = Math.sin(a) * r * 0.75;
    } else {
      const a = rot * 0.4;
      const x = L.shell[o];
      const z = L.shell[o + 2];
      out[0] = x * Math.cos(a) - z * Math.sin(a);
      out[1] = L.shell[o + 1];
      out[2] = x * Math.sin(a) + z * Math.cos(a);
    }
    return out;
  }

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    narrow = width / height < 1.15;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    pMat.uniforms.uScale.value = (height * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
  }

  function render(now) {
    const dt = Math.min(0.05, (now - last.t) / 1000);
    last.t = now;
    const time = now / 1000;

    if (intro < 1) intro = Math.min(1, intro + dt / 2.4);
    const introE = 1 - Math.pow(1 - intro, 3);

    shown += (target - shown) * Math.min(1, dt * (reduced ? 30 : 5.5));
    if (Math.abs(target - shown) < 0.0005) shown = target;
    const t = Math.max(0, Math.min(STATES - 1, shown));
    const s0 = Math.floor(t);
    const s1 = Math.min(STATES - 1, s0 + 1);
    const f = smooth(t - s0);
    const nearest = Math.round(t);

    // rotación orbital (se detiene con foco)
    const orbitWeight = clamp01(t - 3);
    if (!reduced) rot += dt * 0.045 * orbitWeight * (focus >= 0 ? 0.05 : 1);
    for (let i = 0; i < K; i += 1) {
      focusAmt[i] += ((focus === i ? 1 : 0) - focusAmt[i]) * Math.min(1, dt * 8);
    }
    const anyFocus = focus >= 0 ? 1 : 0;

    const fr = frameAt(s0, s1, f);
    const camZ = sample(CAMERA_Z, s0, s1, f);
    if (!reduced) {
      camX += (pointerX * 0.35 - camX) * Math.min(1, dt * 2.5);
      camY += (pointerY * 0.22 - camY) * Math.min(1, dt * 2.5);
    }
    camera.position.set(camX, camY, camZ);
    camera.lookAt(camX * 0.4, camY * 0.4, 0);

    // --- ambient
    const aAlpha = sample(AMBIENT_ALPHA, s0, s1, f) * introE;
    const aSize = sample(AMBIENT_SIZE, s0, s1, f);
    const wob = reduced ? 0 : sample(AMBIENT_WOBBLE, s0, s1, f);
    const ac0 = AMBIENT_COLOR[s0];
    const ac1 = AMBIENT_COLOR[s1];
    const spread = 1 + (1 - introE) * 0.9;
    const pA = [0, 0, 0];
    const pB = [0, 0, 0];
    for (let j = 0; j < ambientCount; j += 1) {
      ambPos(s0, j, pA);
      ambPos(s1, j, pB);
      const ph = L.phase[j];
      const o = j * 3;
      pos[o] = (lerp(pA[0], pB[0], f) + Math.cos(time * 0.31 + ph) * wob) * fr.s * spread + fr.x;
      pos[o + 1] = (lerp(pA[1], pB[1], f) + Math.sin(time * 0.27 + ph * 1.3) * wob) * fr.s * spread + fr.y;
      pos[o + 2] = lerp(pA[2], pB[2], f) * fr.s;
      const c = j * 4;
      col[c] = lerp(ac0[0], ac1[0], f);
      col[c + 1] = lerp(ac0[1], ac1[1], f);
      col[c + 2] = lerp(ac0[2], ac1[2], f);
      col[c + 3] = aAlpha * (0.55 + 0.45 * Math.sin(ph * 3.1) ** 2);
      size[j] = aSize * (0.7 + 0.6 * ((ph * 7.3) % 1));
    }

    // --- núcleo
    const ci = ambientCount + K;
    const coreA = sample(CORE_ALPHA, s0, s1, f) * introE;
    const cc0 = CORE_COLOR[s0];
    const cc1 = CORE_COLOR[s1];
    const corePulse = !reduced && nearest === 3 ? 1 + Math.sin(time * 2.2) * 0.06 : 1;
    pos[ci * 3] = fr.x;
    pos[ci * 3 + 1] = fr.y;
    pos[ci * 3 + 2] = 0;
    col[ci * 4] = lerp(cc0[0], cc1[0], f);
    col[ci * 4 + 1] = lerp(cc0[1], cc1[1], f);
    col[ci * 4 + 2] = lerp(cc0[2], cc1[2], f);
    col[ci * 4 + 3] = coreA;
    size[ci] = sample(CORE_SIZE, s0, s1, f) * fr.s * corePulse;

    // --- nodos clave + radios
    const kc0 = KEY_COLOR[s0];
    const kc1 = KEY_COLOR[s1];
    const kAlpha = sample(KEY_ALPHA, s0, s1, f) * introE;
    const kSize = sample(KEY_SIZE, s0, s1, f);
    const sc0 = SPOKE_COLOR[s0];
    const sc1 = SPOKE_COLOR[s1];
    const sAlpha = sample(SPOKE_ALPHA, s0, s1, f);
    const reach = sample(SPOKE_REACH, s0, s1, f);
    const showLabels = LABEL_STATES;
    const labelWeight = (i) => {
      // desvanecer, cambiar texto en el punto medio, volver a mostrar
      const a = showLabels[s0] && labelTexts(s0, i) ? KEY_VIS[s0][i] : 0;
      const b = showLabels[s1] && labelTexts(s1, i) ? KEY_VIS[s1][i] : 0;
      const raw = t - s0;
      if (s0 === s1) return a;
      if (raw < 0.5) return a * clamp01(1 - raw * 2.6);
      return b * clamp01((raw - 0.5) * 2.6 - 0.3);
    };

    const narrowLabelsHidden = narrow && width < 760 && nearest === 4;

    for (let i = 0; i < K; i += 1) {
      const idx = ambientCount + i;
      keyPos(s0, i, pA);
      keyPos(s1, i, pB);
      const x = lerp(pA[0], pB[0], f) * fr.s + fr.x;
      const y = lerp(pA[1], pB[1], f) * fr.s + fr.y;
      const z = lerp(pA[2], pB[2], f) * fr.s;
      const vis = lerp(KEY_VIS[s0][i], KEY_VIS[s1][i], f);
      const fa = focusAmt[i];
      const dim = 1 - 0.45 * anyFocus * (1 - fa);
      pos[idx * 3] = x;
      pos[idx * 3 + 1] = y;
      pos[idx * 3 + 2] = z;
      col[idx * 4] = lerp(lerp(kc0[0], kc1[0], f), 1, fa);
      col[idx * 4 + 1] = lerp(lerp(kc0[1], kc1[1], f), 1, fa);
      col[idx * 4 + 2] = lerp(lerp(kc0[2], kc1[2], f), 1, fa);
      col[idx * 4 + 3] = kAlpha * vis * dim;
      size[idx] = kSize * fr.s * vis * (1 + fa * 0.7);

      // radio: del nodo hacia el núcleo (en fragmentación, solo un tramo)
      const lo = i * 2 * 3;
      lPos[lo] = x;
      lPos[lo + 1] = y;
      lPos[lo + 2] = z;
      lPos[lo + 3] = lerp(x, fr.x, reach);
      lPos[lo + 4] = lerp(y, fr.y, reach);
      lPos[lo + 5] = lerp(z, 0, reach);
      const la = sAlpha * vis * dim * (1 + fa * 1.2) * introE;
      for (let e = 0; e < 2; e += 1) {
        const c = (i * 2 + e) * 4;
        lCol[c] = lerp(lerp(sc0[0], sc1[0], f), 1, fa * 0.6);
        lCol[c + 1] = lerp(lerp(sc0[1], sc1[1], f), 1, fa * 0.6);
        lCol[c + 2] = lerp(lerp(sc0[2], sc1[2], f), 1, fa * 0.6);
        lCol[c + 3] = Math.min(1, la) * (e === 1 ? 0.35 : 1);
      }

      // etiqueta
      const lab = labels[i];
      const w = narrowLabelsHidden && focus !== i ? 0 : labelWeight(i) * introE;
      if (w > 0.01) {
        const stateForText = t - s0 < 0.5 ? s0 : s1;
        if (lab.state !== stateForText) {
          const txt = labelTexts(stateForText, i);
          lab.name.textContent = txt ? txt.name : '';
          lab.sub.textContent = txt && txt.sub ? txt.sub : '';
          lab.sub.style.display = txt && txt.sub ? '' : 'none';
          lab.state = stateForText;
        }
        v.set(x, y, z).project(camera);
        const sx = (v.x * 0.5 + 0.5) * width;
        const sy = (-v.y * 0.5 + 0.5) * height;
        const left = sx > width - 300 || (x < fr.x - 0.15 && sx > 260);
        if (lab.left !== left) {
          lab.el.classList.toggle('is-left', left);
          lab.left = left;
        }
        const depth = nearest === 4 ? 0.55 + 0.45 * clamp01((z / (2.75 * fr.s * 0.75) + 1) / 2) : 1;
        lab.el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
        lab.el.style.opacity = (w * Math.max(depth, fa) * (anyFocus ? 0.55 + 0.45 * fa : 1)).toFixed(3);
        lab.el.style.visibility = 'visible';
        lab.el.style.zIndex = String(Math.round(50 + z * 10 + fa * 100));
        lab.el.classList.toggle('is-interactive', nearest === 4 && w > 0.5);
        lab.el.classList.toggle('is-focus', fa > 0.5);
      } else if (lab.el.style.visibility !== 'hidden') {
        lab.el.style.visibility = 'hidden';
        lab.el.style.opacity = '0';
        lab.el.classList.remove('is-interactive');
      }
    }

    // etiqueta del núcleo
    const rawC = t - s0;
    let cw;
    if (s0 === s1 || (CORE_LABEL[s0] && CORE_LABEL[s1])) cw = CORE_LABEL[s0];
    else if (rawC < 0.5) cw = CORE_LABEL[s0] * clamp01(1 - rawC * 2.6);
    else cw = CORE_LABEL[s1] * clamp01((rawC - 0.5) * 2.6 - 0.3);
    cw *= introE;
    if (cw > 0.01) {
      v.set(fr.x, fr.y, 0).project(camera);
      core.style.transform = `translate3d(${((v.x * 0.5 + 0.5) * width).toFixed(1)}px, ${((-v.y * 0.5 + 0.5) * height).toFixed(1)}px, 0)`;
      core.style.opacity = cw.toFixed(3);
      core.style.visibility = 'visible';
      core.classList.toggle('is-big', nearest === 3);
    } else {
      core.style.visibility = 'hidden';
    }

    // órbita y anillo de seguridad
    const oA = sample(ORBIT_ALPHA, s0, s1, f);
    const secA = sample(SECURITY_ALPHA, s0, s1, f);
    const ringScale = s0 >= 4 ? lerp(1, 1.27, s1 === 5 ? f : s0 === 5 ? 1 : 0) : 1;
    const oc = rgb('#6FB2F5');
    const sc = rgb('#A9D1FA');
    let base = K * 2;
    for (let k = 0; k < ORBIT_SEG; k += 1) {
      for (let e = 0; e < 2; e += 1) {
        const a = ((k + e) / ORBIT_SEG) * TAU;
        const R = 2.75 * ringScale;
        const vi = (base + k * 2 + e) * 3;
        lPos[vi] = Math.cos(a) * R * fr.s + fr.x;
        lPos[vi + 1] = Math.sin(a) * R * 0.5 * fr.s + fr.y;
        lPos[vi + 2] = Math.sin(a) * R * 0.75 * fr.s;
        const c = (base + k * 2 + e) * 4;
        lCol[c] = oc[0];
        lCol[c + 1] = oc[1];
        lCol[c + 2] = oc[2];
        lCol[c + 3] = oA * (0.45 + 0.55 * clamp01((Math.sin(a) + 1) / 2));
      }
    }
    base += ORBIT_SEG * 2;
    for (let k = 0; k < SEC_SEG; k += 1) {
      for (let e = 0; e < 2; e += 1) {
        const a = ((k + e * 0.55) / SEC_SEG) * TAU + rot * 0.5;
        const R = 3.75 * ringScale;
        const vi = (base + k * 2 + e) * 3;
        lPos[vi] = Math.cos(a) * R * fr.s + fr.x;
        lPos[vi + 1] = Math.sin(a) * R * 0.5 * fr.s + fr.y;
        lPos[vi + 2] = Math.sin(a) * R * 0.75 * fr.s;
        const c = (base + k * 2 + e) * 4;
        lCol[c] = sc[0];
        lCol[c + 1] = sc[1];
        lCol[c + 2] = sc[2];
        lCol[c + 3] = secA * (0.4 + 0.6 * clamp01((Math.sin(a) + 1) / 2));
      }
    }

    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aColor.needsUpdate = true;
    pGeo.attributes.aSize.needsUpdate = true;
    lGeo.attributes.position.needsUpdate = true;
    lGeo.attributes.aColor.needsUpdate = true;

    renderer.render(scene, camera);
    onFrame?.(t);
  }

  function loop(now) {
    if (!running) return;
    render(now);
    requestAnimationFrame(loop);
  }

  function start() {
    if (running || !active || document.hidden) return;
    running = true;
    last.t = performance.now();
    requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
  }

  const onResize = () => resize();
  const onVisibility = () => (document.hidden ? stop() : start());
  const onPointer = (e) => {
    pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
  };
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }

  resize();
  start();

  return {
    setProgress(t) {
      target = Math.max(0, Math.min(STATES - 1, t));
    },
    jump(t) {
      target = shown = Math.max(0, Math.min(STATES - 1, t));
    },
    setFocus(i) {
      focus = i;
    },
    setActive(on) {
      active = on;
      canvas.classList.toggle('is-hidden', !on);
      layer.classList.toggle('is-hidden', !on);
      if (on) start();
      else stop();
    },
    get progress() {
      return shown;
    },
  };
}
