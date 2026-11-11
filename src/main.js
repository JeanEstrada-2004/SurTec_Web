import '@fontsource-variable/montserrat';
import '@fontsource-variable/archivo';
import './styles/main.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initFlow } from './scenes/flow.js';
import { initOcr } from './scenes/ocr.js';
import { initStoryText, initModules } from './scenes/story.js';
import { initArchitecture, initImpact, initRoadmap, initClose } from './scenes/sections.js';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const reduced = root.classList.contains('is-reduced');
const has3d = root.classList.contains('has-3d');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const sections = $$('main > section[data-scene]');
const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
const THREE_D_SCENES = new Set(['inicio', 'surtec', 'problema', 'giro', 'solucion', 'plataforma']);

// Barra de progreso para móvil
const progress = document.createElement('div');
progress.className = 'progress';
progress.setAttribute('aria-hidden', 'true');
progress.innerHTML = '<i></i>';
document.body.appendChild(progress);

// ---------------------------------------------------------------------------
// Medidas de las escenas (se recalculan con cada refresh de ScrollTrigger)
// ---------------------------------------------------------------------------
let R = {};
function measure() {
  const top = (el) => el.getBoundingClientRect().top + window.scrollY;
  R = { vh: window.innerHeight };
  for (const s of sections) R[s.id] = { top: top(s), h: s.offsetHeight };
}

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

// Progreso de la historia 3D en función del scroll
function storyAt(y) {
  const { vh } = R;
  const hero = R.inicio;
  const s3 = R.problema;
  const s4 = R.giro;
  const s5 = R.solucion;
  const s10 = R.plataforma;
  if (y < R.surtec.top) return clamp01((y - hero.top) / Math.max(1, R.surtec.top - hero.top));
  if (y < s3.top - vh * 0.55) return 1;
  if (y < s3.top + vh * 0.45) return 1 + clamp01((y - (s3.top - vh * 0.55)) / vh);
  const a4 = s4.top - vh * 0.2;
  const b4 = s4.top + (s4.h - vh) * 0.82;
  if (y < a4) return 2;
  if (y < b4) return 2 + (y - a4) / (b4 - a4);
  const a5 = s5.top - vh * 0.45;
  const b5 = s5.top + vh * 0.3;
  if (y < a5) return 3;
  if (y < b5) return 3 + (y - a5) / (b5 - a5);
  if (y < s10.top - vh) return 4;
  return 5;
}

// Fondo del documento según el estado de la red (solo colores de marca)
const BG = {
  paper: [247, 250, 252],
  paper2: [237, 242, 247],
  ink: [26, 54, 93],
  ink900: [15, 36, 67],
};
const mix = (a, b, f) => a.map((v, i) => Math.round(v + (b[i] - v) * f));
function bgAt(t) {
  if (t <= 1) return BG.paper;
  if (t <= 2) return mix(BG.paper, BG.paper2, t - 1);
  if (t <= 2.3) return mix(BG.paper2, BG.ink, (t - 2) / 0.3);
  if (t <= 4) return BG.ink;
  return BG.ink;
}

let storyT = 0;
let net = null;
let lastBg = '';

function applyStoryVisuals(t) {
  storyT = t;
  if (!has3d) return;
  const c = bgAt(t);
  const css = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
  if (css !== lastBg) {
    document.body.style.backgroundColor = css;
    lastBg = css;
  }
  updateTone();
}

// ---------------------------------------------------------------------------
// Tono de la interfaz, riel y barra superior
// ---------------------------------------------------------------------------
const topbar = $('.topbar');
const railLinks = $$('.rail a');
let currentScene = '';

function sceneAt(y) {
  let found = sections[0];
  for (const s of sections) if (R[s.id] && y >= R[s.id].top) found = s;
  return found;
}

// tono según lo que hay bajo la barra superior (también se llama en cada fotograma 3D)
function updateTone(y = window.scrollY) {
  if (!R.vh) return;
  const under = sceneAt(y + 40);
  let tone = under.dataset.tone;
  if (has3d && THREE_D_SCENES.has(under.id)) tone = storyT > 2.12 ? 'dark' : 'light';
  if (root.dataset.tone !== tone) root.dataset.tone = tone;
}

function onScroll() {
  const y = window.scrollY;
  const vh = R.vh;

  if (has3d && net) {
    net.setProgress(storyAt(y));
    const covered = y >= R.funcionamiento.top && y < R.plataforma.top - vh;
    net.setActive(!covered);
  }

  updateTone(y);
  topbar.classList.toggle('is-solid', y > 12);

  // escena activa (centro de la pantalla)
  const mid = sceneAt(y + vh * 0.5);
  if (mid.id !== currentScene) {
    currentScene = mid.id;
    for (const a of railLinks) {
      const on = a.dataset.rail === mid.id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    }
  }

  const max = document.documentElement.scrollHeight - vh;
  progress.style.setProperty('--progress', String(clamp01(y / Math.max(1, max))));
}

let ticking = false;
window.addEventListener(
  'scroll',
  () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      onScroll();
    });
  },
  { passive: true },
);

// ---------------------------------------------------------------------------
// Navegación: anclas suaves y modo feria con flechas ← →
// ---------------------------------------------------------------------------
function goTo(id) {
  const el = byId[id] || document.getElementById(id);
  if (!el) return;
  measure();
  const top = R[id] ? R[id].top : el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, top + 1), behavior: reduced ? 'auto' : 'smooth' });
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  if (!id || !document.getElementById(id)) return;
  e.preventDefault();
  if (id === 'historia') {
    document.getElementById(id).focus?.();
  }
  goTo(id === 'historia' ? 'inicio' : id);
  history.replaceState(null, '', `#${id}`);
});

document.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
  const idx = sections.findIndex((s) => s.id === currentScene);
  const next = sections[Math.max(0, Math.min(sections.length - 1, idx + (e.key === 'ArrowRight' ? 1 : -1)))];
  if (next) {
    e.preventDefault();
    goTo(next.id);
  }
});

// ---------------------------------------------------------------------------
// Escenas
// ---------------------------------------------------------------------------
const mm = gsap.matchMedia();
const ctx = { gsap, ScrollTrigger, mm, reduced, has3d };

initStoryText(ctx);
initFlow(ctx);
initOcr(ctx);
initArchitecture(ctx);
initImpact(ctx);
initRoadmap(ctx);
initClose(ctx);
const modules = initModules(ctx, (i) => net?.setFocus(i));

ScrollTrigger.addEventListener('refresh', () => {
  measure();
  onScroll();
});

measure();
onScroll();

// ---------------------------------------------------------------------------
// Red 3D (carga diferida para no frenar el primer pintado)
// ---------------------------------------------------------------------------
if (has3d) {
  const read = (sel) => $$(`${sel} > li`);
  const sets = {
    entities: read('[data-net-set="entities"]').map((li) => li.textContent.trim()),
    tools: read('[data-net-set="tools"]').map((li) => ({ name: li.textContent.trim(), sub: li.dataset.sub })),
    modules: read('[data-net-set="modules"]').map((li) => li.querySelector('button').textContent.trim()),
  };
  const start = () =>
    import('./three/network.js')
      .then(({ createNetwork }) => {
        net = createNetwork({
          canvas: $('#network'),
          layer: $('#node-labels'),
          sets,
          reduced,
          onFrame: applyStoryVisuals,
          onPick: (i, kind) => modules.pick(i, kind),
        });
        measure();
        net.jump(storyAt(window.scrollY));
        onScroll();
      })
      .catch(() => {
        root.classList.remove('has-3d');
        root.classList.add('no-3d');
        ScrollTrigger.refresh();
      });
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 600 });
  else setTimeout(start, 120);
}

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
