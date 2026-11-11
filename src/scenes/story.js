// Escenas 1–5: textos que acompañan a la red 3D.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function initStoryText({ gsap, ScrollTrigger, reduced }) {
  if (reduced) return;

  // 1 · El hero se aleja con un parallax suave mientras la red se ordena
  gsap.to('.hero', {
    yPercent: -14,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__cue', {
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '#inicio', start: 'top top', end: '15% top', scrub: true },
  });

  // 2 · Datos de SurTec entran escalonados
  gsap.from('#surtec .copy > *', {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)',
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '#surtec', start: 'top 55%', toggleActions: 'play none none reverse' },
  });

  // 3 · Cadena de efectos: un eslabón por tramo de scroll
  const steps = [...document.querySelectorAll('.cascade li')];
  const gap = document.querySelector('.gap-statement');
  const setStep = (p) => {
    const idx = Math.floor(clamp01((p - 0.1) / 0.52) * steps.length - 0.0001);
    steps.forEach((li, i) => {
      li.classList.toggle('is-current', i === idx);
      li.classList.toggle('is-past', i < idx);
    });
    gap.style.opacity = String(clamp01((p - 0.6) / 0.1));
  };
  ScrollTrigger.create({
    trigger: '#problema',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (s) => setStep(s.progress),
    onRefresh: (s) => setStep(s.progress),
  });
  gsap.from('#problema .display, #problema .lede', {
    opacity: 0,
    y: 18,
    filter: 'blur(6px)',
    duration: 0.8,
    stagger: 0.08,
    ease: 'expo.out',
    scrollTrigger: { trigger: '#problema', start: 'top 55%', toggleActions: 'play none none reverse' },
  });

  // 4 · La pregunta aparece palabra por palabra, se retira y deja la respuesta
  const q = document.querySelector('[data-words]');
  const words = q.textContent.trim().split(/\s+/);
  q.setAttribute('aria-label', q.textContent.trim());
  q.innerHTML = words.map((w) => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  const tl = gsap.timeline({
    scrollTrigger: { trigger: '#giro', start: 'top top', end: 'bottom bottom', scrub: 0.6 },
  });
  tl.fromTo(
    q.querySelectorAll('.w'),
    { opacity: 0.06, y: 18, filter: 'blur(8px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.05, duration: 0.3, ease: 'power2.out' },
    0.05,
  )
    .to(q, { opacity: 0, y: -40, filter: 'blur(6px)', duration: 0.18, ease: 'power1.in' }, 0.62)
    .fromTo('.turn-answer', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 0.8)
    .to({}, { duration: 0.06 });
}

// 5 · Leyenda de módulos: se recorre sola con el scroll y responde a hover/foco
export function initModules({ ScrollTrigger, reduced, has3d }, onFocus) {
  const items = [...document.querySelectorAll('.modules li')];
  let auto = -1;
  let pinned = -1;
  let hover = -1;

  const apply = () => {
    const idx = hover >= 0 ? hover : pinned >= 0 ? pinned : auto;
    items.forEach((li, i) => {
      li.classList.toggle('is-active', i === idx);
      li.querySelector('button').setAttribute('aria-expanded', String(i === idx));
    });
    onFocus(has3d ? idx : -1);
  };

  items.forEach((li, i) => {
    const btn = li.querySelector('button');
    const desc = li.querySelector('p');
    desc.id = `mod-desc-${i}`;
    btn.setAttribute('aria-controls', desc.id);
    btn.addEventListener('click', () => {
      pinned = pinned === i ? -1 : i;
      apply();
    });
    btn.addEventListener('focus', () => {
      hover = i;
      apply();
    });
    btn.addEventListener('blur', () => {
      hover = -1;
      apply();
    });
    if (matchMedia('(hover: hover)').matches) {
      btn.addEventListener('pointerenter', () => {
        hover = i;
        apply();
      });
      btn.addEventListener('pointerleave', () => {
        hover = -1;
        apply();
      });
    }
  });

  if (!reduced && has3d) {
    ScrollTrigger.create({
      trigger: '#solucion',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (s) => {
        const next = s.progress < 0.18 ? -1 : Math.min(items.length - 1, Math.floor(((s.progress - 0.18) / 0.66) * items.length));
        if (next !== auto) {
          auto = next;
          apply();
        }
      },
      onLeave: () => {
        auto = -1;
        pinned = -1;
        apply();
      },
      onLeaveBack: () => {
        auto = -1;
        pinned = -1;
        apply();
      },
    });
  } else {
    items.forEach((li) => li.querySelector('button').setAttribute('aria-expanded', 'true'));
  }

  return {
    pick(i, kind) {
      if (kind === 'click') pinned = pinned === i ? -1 : i;
      else hover = i;
      apply();
    },
  };
}
