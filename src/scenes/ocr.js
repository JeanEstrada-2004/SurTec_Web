// Escena 6b · Rendición desde campo: el OCR propone, el usuario valida.
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

export function initOcr({ ScrollTrigger, mm, reduced }) {
  const root = document.querySelector('[data-ocr]');
  if (!root || reduced) return;

  const receipt = root.querySelector('.receipt');
  const scan = root.querySelector('.receipt__scan');
  const submit = root.querySelector('.ocr-form__submit');
  const steps = [...document.querySelectorAll('.pipeline li')];
  const fields = [...receipt.querySelectorAll('[data-field]')].map((el) => {
    const key = el.dataset.field;
    const label = root.querySelector(`[data-out="${key}"]`);
    const out = label.querySelector('output');
    return { el, label, out, full: out.textContent, y: 0 };
  });

  function measure() {
    const rb = receipt.getBoundingClientRect();
    for (const f of fields) {
      const b = f.el.getBoundingClientRect();
      f.y = (b.top + b.height / 2 - rb.top) / rb.height;
    }
  }

  function update(P) {
    // barrido del escáner entre 0,08 y 0,58
    const s = clamp01((P - 0.04) / 0.32);
    const h = receipt.offsetHeight;
    scan.style.transform = `translateY(${(s * (h + 60) - 60).toFixed(1)}px)`;
    scan.style.opacity = s > 0 && s < 1 ? '1' : '0';

    for (const f of fields) {
      const passed = s * 1.04 - 0.02 > f.y;
      const typed = clamp01((s - f.y) / 0.1);
      f.el.classList.toggle('is-read', passed && P < 0.42);
      f.label.classList.toggle('is-filled', typed >= 1);
      const n = Math.round(f.full.length * typed);
      const txt = f.full.slice(0, n);
      if (f.out.textContent !== txt) f.out.textContent = txt;
    }

    submit.classList.toggle('is-pressed', P > 0.4 && P < 0.46);
    const marks = [0.46, 0.51, 0.56];
    steps.forEach((li, i) => li.classList.toggle('is-on', P > marks[i]));
  }

  ScrollTrigger.addEventListener('refresh', measure);
  measure();
  update(0);

  mm.add('(min-width: 1024px) and (min-height: 621px)', () => {
    ScrollTrigger.create({
      trigger: '.pin--ocr',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (st) => update(st.progress),
      onRefresh: (st) => {
        measure();
        update(st.progress);
      },
    });
  });
  mm.add('(max-width: 1023px), (max-height: 620px)', () => {
    ScrollTrigger.create({
      trigger: '.ocr',
      start: 'top 85%',
      end: 'bottom 98%',
      onUpdate: (st) => update(st.progress),
      onRefresh: (st) => {
        measure();
        update(st.progress);
      },
    });
  });
}
