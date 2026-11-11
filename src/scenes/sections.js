// Escenas 7–10: arquitectura, metas, roadmap y cierre.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x) => x * x * (3 - 2 * x);
const MOCKUP_URL = 'https://jeanestrada-2004.github.io/Mockup-ERP/surtec-peti/index.html';

// 7 · Capas que se separan como un despiece isométrico
export function initArchitecture({ ScrollTrigger, mm, reduced }) {
  const stack = document.querySelector('[data-stack]');
  if (!stack) return;
  const plates = [...stack.querySelectorAll('.plate')];
  const rows = [...document.querySelectorAll('.layers li')];

  const update = (P, maxGap) => {
    const open = smooth(clamp01(P / 0.25));
    stack.style.setProperty('--gap', `${(10 + (maxGap - 10) * open).toFixed(1)}px`);
    const idx = P < 0.24 ? -1 : Math.min(rows.length - 1, Math.floor(((P - 0.24) / 0.5) * rows.length));
    rows.forEach((li, i) => li.classList.toggle('is-on', i <= idx));
    // la lista va de Usuarios (arriba) a Cloud (abajo); las placas usan --i inverso
    plates.forEach((pl, k) => pl.classList.toggle('is-on', k === idx));
  };

  if (reduced) {
    rows.forEach((li) => li.classList.add('is-on'));
    return;
  }

  mm.add('(min-width: 1024px) and (min-height: 621px)', () => {
    ScrollTrigger.create({
      trigger: '.pin--arch',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => update(st.progress, 48),
      onRefresh: (st) => update(st.progress, 48),
    });
  });
  mm.add('(max-width: 1023px), (max-height: 620px)', () => {
    ScrollTrigger.create({
      trigger: '.stage--arch',
      start: 'top 70%',
      end: 'bottom 70%',
      onUpdate: (st) => update(st.progress, 34),
      onRefresh: (st) => update(st.progress, 34),
    });
  });
}

// 8 · Metas: la regla marca el umbral y la cifra cuenta hasta él
export function initImpact({ gsap, reduced }) {
  const goals = [...document.querySelectorAll('.goal')];
  if (!goals.length || reduced) return;
  goals.forEach((g, i) => {
    const target = Number(getComputedStyle(g).getPropertyValue('--target')) || 0;
    const num = g.querySelector('[data-count]');
    const value = Number(num.dataset.count);
    const state = { p: 0, n: 0 };
    g.style.setProperty('--p', '0');
    num.textContent = '0';
    gsap.to(state, {
      p: target,
      n: value,
      duration: 1.6,
      delay: i * 0.12,
      ease: 'expo.out',
      onUpdate: () => {
        g.style.setProperty('--p', state.p.toFixed(2));
        num.textContent = String(Math.round(state.n));
      },
      scrollTrigger: { trigger: '.goals', start: 'top 78%', once: true },
    });
  });
  gsap.from('.goals-minor li, .ods article', {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.goals-minor', start: 'top 85%', once: true },
  });
}

// 9 · Roadmap: scroll vertical que avanza la línea de tiempo en horizontal
export function initRoadmap({ ScrollTrigger, mm, reduced }) {
  const road = document.querySelector('[data-road]');
  if (!road) return;
  const track = road.querySelector('.road__track');
  const line = road.querySelector('.road__line');
  const years = [...track.querySelectorAll('.year')];

  if (reduced) {
    years.forEach((y) => y.classList.add('is-on'));
    return;
  }

  mm.add('(min-width: 1024px) and (min-height: 621px)', () => {
    let travel = 0;
    const measure = () => {
      travel = Math.max(0, track.scrollWidth - road.clientWidth + 24);
    };
    const update = (P) => {
      const k = smooth(clamp01((P - 0.22) / 0.56));
      track.style.transform = `translate3d(${(-travel * k).toFixed(1)}px, 0, 0)`;
      line.style.setProperty('--fill', clamp01((P - 0.04) / 0.74).toFixed(3));
      years.forEach((y, i) => y.classList.toggle('is-on', P > 0.04 + i * 0.19));
      // una tarjeta que sale por la izquierda se desvanece entera, sin fragmentos
      const left = road.getBoundingClientRect().left + 40;
      years.forEach((y) => y.classList.toggle('is-gone', y.getBoundingClientRect().right - y.offsetWidth * 0.35 < left));
    };
    const st = ScrollTrigger.create({
      trigger: '.pin--road',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => update(s.progress),
      onRefresh: (s) => {
        measure();
        update(s.progress);
      },
    });
    return () => {
      st.kill();
      track.style.transform = '';
      years.forEach((y) => y.classList.remove('is-gone'));
    };
  });

  mm.add('(max-width: 1023px), (max-height: 620px)', () => {
    const triggers = years.map((y) =>
      ScrollTrigger.create({ trigger: y, start: 'top 82%', onEnter: () => y.classList.add('is-on'), onLeaveBack: () => y.classList.remove('is-on') }),
    );
    return () => triggers.forEach((t) => t.kill());
  });
}

// 10 · El mockup se endereza al llegar y puede probarse dentro del marco
export function initClose({ gsap, reduced }) {
  const browser = document.querySelector('[data-browser]');
  if (!browser) return;

  const btn = browser.querySelector('[data-try]');
  btn?.addEventListener('click', () => {
    const view = browser.querySelector('.browser__view');
    const iframe = document.createElement('iframe');
    iframe.src = MOCKUP_URL;
    iframe.title = 'Mockup navegable de la plataforma SurTec (datos ficticios)';
    iframe.setAttribute('loading', 'eager');
    view.querySelector('picture').replaceWith(iframe);
    btn.remove();
    iframe.focus();
  });

  if (reduced) return;
  gsap.fromTo(
    browser,
    { rotateX: 24, y: 70, scale: 0.92, transformPerspective: 1600 },
    {
      rotateX: 0,
      y: 0,
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: browser, start: 'top 98%', end: 'top 30%', scrub: 0.6 },
    },
  );
  gsap.from('#plataforma .copy > *', {
    opacity: 0,
    y: 20,
    filter: 'blur(6px)',
    duration: 0.9,
    stagger: 0.1,
    ease: 'expo.out',
    scrollTrigger: { trigger: '#plataforma', start: 'top 70%', once: true },
  });
  gsap.from('.finale > *', {
    opacity: 0,
    y: 24,
    duration: 1,
    stagger: 0.12,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.finale', start: 'top 80%', once: true },
  });
}
