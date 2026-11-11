// Escena 6 · Flujo funcional: un pulso de datos recorre la plataforma y luego
// regresa del indicador al documento de origen.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const SVGNS = 'http://www.w3.org/2000/svg';
const OPS = ['com', 'ren', 'doc', 'per', 'alm'];

const EDGES = [
  { a: 'opp', b: 'crm', stage: 0 },
  { a: 'crm', b: 'pre', stage: 1 },
  { a: 'pre', b: 'pro', stage: 2 },
  ...OPS.map((k) => ({ a: 'pro', b: k, stage: 3 })),
  ...OPS.map((k) => ({ a: k, b: 'cos', stage: 4 })),
  { a: 'cos', b: 'bi', stage: 5 },
  { a: 'bi', b: 'ger', stage: 6 },
  { a: 'ren', b: 'doc', stage: -1, traceOnly: true },
];
const STAGES = 7;

// Recorrido inverso: indicador → costo → operación → documento → responsable → proyecto
const TRACE = [
  { node: 'bi' },
  { node: 'cos', edge: ['cos', 'bi'] },
  { node: 'ren', edge: ['ren', 'cos'] },
  { node: 'doc', edge: ['ren', 'doc'] },
  { node: null, chip: 'resp' },
  { node: 'pro', edge: ['pro', 'doc'] },
];

export function initFlow({ ScrollTrigger, mm, reduced }) {
  const root = document.querySelector('[data-flow]');
  if (!root) return;
  const svg = root.querySelector('.flow__wires');
  const nodes = Object.fromEntries([...root.querySelectorAll('[data-node]')].map((li) => [li.dataset.node, li]));
  const chips = Object.fromEntries([...document.querySelectorAll('[data-trace]')].map((li) => [li.dataset.trace, li]));
  let wires = [];
  let last = reduced ? 1 : 0;

  function build() {
    svg.innerHTML = '';
    const box = root.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    const horizontal = getComputedStyle(root.querySelector('.flow__nodes')).gridTemplateColumns.split(' ').length > 2;
    const r = (k) => {
      const b = nodes[k].getBoundingClientRect();
      return { l: b.left - box.left, r: b.right - box.left, t: b.top - box.top, b: b.bottom - box.top, cx: b.left - box.left + b.width / 2, cy: b.top - box.top + b.height / 2 };
    };
    wires = EDGES.map((e) => {
      const A = r(e.a);
      const B = r(e.b);
      let d;
      if (e.traceOnly) {
        d = horizontal ? `M${A.cx} ${A.b} L${B.cx} ${B.t}` : `M${A.cx} ${A.b} C${A.cx} ${A.b + 20}, ${B.cx} ${B.t - 20}, ${B.cx} ${B.t}`;
      } else if (horizontal) {
        const dx = (B.l - A.r) * 0.55;
        d = `M${A.r} ${A.cy} C${A.r + dx} ${A.cy}, ${B.l - dx} ${B.cy}, ${B.l} ${B.cy}`;
      } else {
        const dy = (B.t - A.b) * 0.55;
        d = `M${A.cx} ${A.b} C${A.cx} ${A.b + dy}, ${B.cx} ${B.t - dy}, ${B.cx} ${B.t}`;
      }
      const path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      const dot = document.createElementNS(SVGNS, 'circle');
      dot.setAttribute('r', '4.5');
      dot.style.opacity = '0';
      svg.appendChild(dot);
      return { ...e, path, dot, len };
    });
    update(last);
  }

  function update(P) {
    last = P;
    const F = clamp01(P / 0.46) * STAGES;
    const s = Math.floor(F);
    const f = F - s;
    const R = clamp01((P - 0.5) / 0.26) * TRACE.length;
    const traceStep = Math.floor(R);
    const traceF = R - traceStep;

    const on = new Set(F > 0.02 ? ['opp'] : []);
    for (const w of wires) {
      let drawn = 0;
      if (!w.traceOnly) {
        if (w.stage < s) drawn = 1;
        else if (w.stage === s) drawn = f;
      }
      w.path.style.strokeDashoffset = `${w.len * (1 - drawn)}`;
      w.path.classList.toggle('is-lit', drawn > 0);
      w.path.classList.remove('is-trace');
      w.dot.classList.remove('is-trace');
      const pulsing = drawn > 0 && drawn < 1;
      w.dot.style.opacity = pulsing ? '1' : '0';
      if (pulsing) {
        const pt = w.path.getPointAtLength(w.len * drawn);
        w.dot.setAttribute('cx', pt.x);
        w.dot.setAttribute('cy', pt.y);
      }
      if (drawn > 0.96) on.add(w.b);
    }

    const traced = new Set();
    TRACE.forEach((step, k) => {
      const reached = R > 0 && k <= traceStep;
      if (step.node && reached) traced.add(step.node);
      const chipKey = step.chip || step.node;
      chips[chipKey]?.classList.toggle('is-on', reached);
      if (step.edge) {
        const w = wires.find((x) => x.a === step.edge[0] && x.b === step.edge[1]);
        if (!w) return;
        if (k < traceStep || (k === traceStep && R > 0)) {
          w.path.classList.add('is-trace');
          w.path.style.strokeDashoffset = '0';
        }
        if (k === traceStep && R > 0 && traceF < 0.98 && !reduced) {
          // el pulso viaja en sentido inverso
          const backwards = !(step.edge[0] === 'ren' && step.edge[1] === 'doc');
          const at = backwards ? w.len * (1 - traceF) : w.len * traceF;
          const pt = w.path.getPointAtLength(at);
          w.dot.classList.add('is-trace');
          w.dot.style.opacity = '1';
          w.dot.setAttribute('cx', pt.x);
          w.dot.setAttribute('cy', pt.y);
        }
      }
    });

    for (const [k, li] of Object.entries(nodes)) {
      li.classList.toggle('is-on', on.has(k) || reduced);
      li.classList.toggle('is-trace', traced.has(k));
    }
  }

  let raf = 0;
  const rebuild = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(build);
  };
  ScrollTrigger.addEventListener('refresh', rebuild);
  new ResizeObserver(rebuild).observe(root);
  document.fonts?.ready.then(rebuild);

  if (reduced) {
    build();
    return;
  }

  mm.add('(min-width: 1024px) and (min-height: 621px)', () => {
    ScrollTrigger.create({
      trigger: '.pin--flow',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => update(st.progress),
      onRefresh: (st) => update(st.progress),
    });
  });
  mm.add('(max-width: 1023px), (max-height: 620px)', () => {
    ScrollTrigger.create({
      trigger: '.stage--flow',
      start: 'top 65%',
      end: 'bottom 85%',
      onUpdate: (st) => update(st.progress),
      onRefresh: (st) => update(st.progress),
    });
  });
  build();
}
