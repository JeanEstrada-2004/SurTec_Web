'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroThree } from './hero-three';
import { SurTecLockup, SurTecMark } from './surtec-mark';

const navigation = [
  ['inicio', 'Inicio'], ['surtec', 'SurTec'], ['capacidades', 'Capacidades'],
  ['transformacion', 'Transformación'], ['estrategia', 'Estrategia'], ['impacto', 'Impacto'],
] as const;

const services = [
  'Telecomunicaciones y redes',
  'Infraestructura TI y centros de datos',
  'Seguridad electrónica',
  'Instalaciones eléctricas y electromecánicas',
  'Automatización y sistemas especiales',
  'Consultoría y formulación de proyectos',
  'Acondicionamiento técnico',
];

const capabilityPoints = [
  [50, 7], [79, 22], [86, 57], [68, 88], [32, 88], [14, 57], [21, 22],
] as const;

const sectors = ['Minería', 'Industria', 'Energía', 'Salud', 'Educación', 'Empresas privadas', 'Entidades públicas'];

const strategicSignals = [
  { key: 'F', label: 'Fortalezas', items: ['Experiencia multidisciplinaria', 'Flexibilidad organizacional', 'Operación por proyectos', 'Cercanía regional'] },
  { key: 'O', label: 'Oportunidades', items: ['Digitalización', 'Cloud y BI', 'Crecimiento de infraestructura tecnológica', 'Alianzas con integradores y fabricantes'] },
  { key: 'D', label: 'Debilidades · evolución interna', items: ['Información fragmentada', 'Dependencia de Excel', 'Consolidaciones manuales', 'Gobierno TI básico'] },
  { key: 'A', label: 'Amenazas · entorno', items: ['Competidores más automatizados', 'Variación de precios y tipo de cambio', 'Retrasos de suministro', 'Riesgos de ciberseguridad'] },
];

const successFactors = [
  'Información oportuna de costos y avance', 'Disciplina de registro', 'Coordinación entre áreas',
  'Presupuestación correcta', 'Proveedores y personal especializado', 'Cumplimiento contractual',
  'Adopción digital gradual',
];

const currentTools = ['Excel', 'Microsoft 365', 'Correo', 'Cloud', 'Software contable', 'CAD', 'Mensajería'];
const frictionEffects = ['Consolidación manual', 'Reprocesos', 'Baja trazabilidad', 'Indicadores tardíos', 'Decisiones menos oportunas'];
const projectNodes = ['Presupuesto', 'Compras', 'Gastos', 'Materiales', 'Personal', 'Documentos', 'Avance', 'Costos'];
const projectPositions = [[50, 4], [77, 16], [88, 45], [77, 76], [50, 88], [23, 76], [12, 45], [23, 16]] as const;

const modules = [
  { number: '01', name: 'Gestión de proyectos', phase: 'Base operativa' },
  { number: '02', name: 'Compras y costos', phase: 'Control económico' },
  { number: '03', name: 'Almacén y materiales', phase: 'Trazabilidad física' },
  { number: '04', name: 'Gestión documental', phase: 'Flujo de evidencia' },
  { number: '05', name: 'CRM', phase: 'Relación comercial' },
  { number: '06', name: 'Seguridad, respaldo y continuidad', phase: 'Resiliencia' },
  { number: '07', name: 'BI', phase: 'Datos integrados → decisión', bi: true },
];

const alignment = [
  ['Conocer rentabilidad por proyecto', 'Integración económica', 'Decisiones oportunas'],
  ['Reducir reproceso', 'Digitalización de flujos', 'Mayor eficiencia'],
  ['Mejorar trazabilidad', 'Gestión documental', 'Control y auditoría'],
  ['Controlar materiales', 'Almacén integrado', 'Costos reales'],
  ['Mejorar seguimiento comercial', 'CRM', 'Mayor recurrencia'],
  ['Reducir riesgos', 'Seguridad y continuidad', 'Resiliencia operativa'],
];

const objectives = [
  ['OE1', 'Mejorar la rentabilidad y previsibilidad económica de los proyectos.'],
  ['OE2', 'Incrementar el cumplimiento de plazos y reducir reprocesos.'],
  ['OE3', 'Fortalecer la fidelización y seguimiento de clientes.'],
  ['OE4', 'Mejorar la trazabilidad y oportunidad de la información.'],
  ['OE5', 'Fortalecer competencias técnicas y digitales del personal.'],
];

const kpis = [
  { value: 50, prefix: '−', suffix: '%', label: 'Tiempo de consolidación', note: 'Reporte económico por proyecto' },
  { value: 90, suffix: '%', label: 'Entregas en fecha', note: 'Cumplimiento del portafolio' },
  { value: 15, prefix: '+', suffix: '%', label: 'Clientes recurrentes', note: 'Fidelización y seguimiento' },
  { value: 80, suffix: '%', label: 'Personal clave capacitado', note: 'Competencias técnicas y digitales' },
  { value: 8, prefix: '≤', suffix: '%', label: 'Desviación presupuestaria', note: 'Control económico por proyecto' },
];

function SectionIntro({ index, eyebrow, title, copy, light = false }: { index: string; eyebrow: string; title: string; copy?: string; light?: boolean }) {
  return (
    <header className={`section-intro ${light ? 'is-light' : ''}`} data-reveal>
      <div className="section-kicker"><span>{index}</span><p>{eyebrow}</p></div>
      <h2>{title}</h2>
      {copy && <p className="section-copy">{copy}</p>}
    </header>
  );
}

export function SurTecExperience() {
  const rootRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const forced = new URLSearchParams(window.location.search).has('reduce-motion');
    const update = () => setReducedMotion(media.matches || forced);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 42);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const sections = navigation
      .map(([id]) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActiveSection(visible.target.id);
    }, { rootMargin: '-34% 0px -56% 0px', threshold: [0, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelled || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      document.documentElement.classList.add('motion-ready');
      const context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
          gsap.from(element, {
            opacity: 0,
            y: 44,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((container) => {
          gsap.from(Array.from(container.children), {
            opacity: 0,
            y: 28,
            duration: 0.7,
            stagger: 0.075,
            ease: 'power2.out',
            scrollTrigger: { trigger: container, start: 'top 84%', once: true },
          });
        });

        const media = gsap.matchMedia();
        media.add('(min-width: 1025px)', () => {
          const capLines = gsap.utils.toArray<SVGLineElement>('.capability-line');
          capLines.forEach((line) => {
            const length = line.getTotalLength();
            gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          });
          const capTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: '.capabilities-section', start: 'top top', end: '+=1050',
              scrub: 0.8, pin: '.capability-stage', anticipatePin: 1,
            },
          });
          capTimeline
            .to(capLines, { strokeDashoffset: 0, stagger: 0.08, duration: 1.5, ease: 'none' })
            .from('.capability-node', { scale: 0.7, opacity: 0.12, stagger: 0.08, duration: 1.1 }, 0.2)
            .to('.capability-core', { scale: 1.06, duration: 0.4, yoyo: true, repeat: 1 }, 1.1);

          const evolution = gsap.timeline({
            scrollTrigger: {
              trigger: '.evolution-section', start: 'top top', end: '+=1450',
              scrub: 0.8, pin: '.evolution-stage', anticipatePin: 1,
            },
          });
          evolution
            .fromTo('.evolution-statement-one', { opacity: 0.25 }, { opacity: 1, duration: 0.45 })
            .to('.tool-chip', { x: (i) => (i - 3) * 17, y: (i) => (i % 2 ? 24 : -20), stagger: 0.035, duration: 0.7 }, 0.35)
            .fromTo('.evolution-statement-two', { opacity: 0.18 }, { opacity: 1, duration: 0.55 }, 0.55)
            .to('.fragment-panel', { opacity: 0.2, scale: 0.93, duration: 0.65 }, 1.25)
            .fromTo('.integrated-panel', { opacity: 0.18, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.75 }, 1.45)
            .from('.project-satellite', { scale: 0, opacity: 0, stagger: 0.05, duration: 0.7 }, 1.62)
            .from('.project-ray', { strokeDasharray: 140, strokeDashoffset: 140, stagger: 0.05, duration: 0.75 }, 1.55);

          const strategy = gsap.timeline({
            scrollTrigger: {
              trigger: '.strategy-build', start: 'top 18%', end: '+=820',
              scrub: 0.7, pin: '.strategy-map', anticipatePin: 1,
            },
          });
          strategy
            .from('.strategy-layer', { scaleX: 0.45, opacity: 0.15, transformOrigin: 'center', stagger: 0.18, duration: 1 })
            .from('.strategy-arrow', { scaleY: 0, transformOrigin: 'top', stagger: 0.15, duration: 0.7 }, 0.25);

        });

        document.querySelectorAll<HTMLElement>('[data-count]').forEach((element) => {
          const target = Number(element.dataset.count || 0);
          const prefix = element.dataset.prefix || '';
          const suffix = element.dataset.suffix || '';
          ScrollTrigger.create({
            trigger: element,
            start: 'top 90%',
            once: true,
            onEnter: () => {
              const counter = { value: 0 };
              gsap.to(counter, {
                value: target, duration: 1.45, ease: 'power2.out',
                onUpdate: () => { element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`; },
              });
            },
          });
        });

        cleanup = () => {
          media.revert();
          context.revert();
          document.documentElement.classList.remove('motion-ready');
        };
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [reducedMotion]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={rootRef}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="SurTec, inicio" onClick={closeMenu}>
          <SurTecMark className="brand-mark" decorative />
          <span>SurTec</span>
        </a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-menu" onClick={() => setMenuOpen((open) => !open)}>
          <span /> <span />
          <span className="sr-only">Abrir navegación</span>
        </button>
        <div className="nav-links" id="main-menu">
          {navigation.map(([id, label]) => (
            <a key={id} className={activeSection === id ? 'is-active' : ''} href={`#${id}`} onClick={closeMenu}>{label}</a>
          ))}
        </div>
      </nav>

      <div id="contenido">
        <section id="inicio" className="hero scene-dark" aria-labelledby="hero-title">
          <HeroThree reducedMotion={reducedMotion} />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-shell">
            <div className="hero-copy" data-hero-copy>
              <p className="eyebrow">Ingeniería · Tecnología · Integración</p>
              <h1 id="hero-title">Soluciones que conectan ingeniería, tecnología y resultados.</h1>
              <p className="hero-lede">Ingeniería y tecnología para proyectos que necesitan integración, control y capacidad de respuesta.</p>
              <a className="text-link light" href="#surtec">Descubrir SurTec <span aria-hidden="true">↓</span></a>
            </div>
            <div className="hero-identity" data-hero-lockup>
              <SurTecLockup light />
              <p>Arequipa · Macro Región Sur</p>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
        </section>

        <section id="surtec" className="section identity-section">
          <SectionIntro
            index="01" eyebrow="SurTec / Quiénes somos"
            title="Integramos ingeniería y tecnología alrededor de cada proyecto."
            copy="Empresa arequipeña de operación B2B predominante y B2G selectiva, con alcance principal en la Macro Región Sur y capacidad para desarrollar proyectos a nivel nacional."
          />
          <div className="identity-words" aria-label="Ingeniería, tecnología e integración" data-stagger>
            <span>Ingeniería</span><span>Tecnología</span><span>Integración</span>
          </div>
          <div className="identity-model" data-reveal>
            <div className="project-pulse"><span>Modelo</span><strong>Trabajo por proyectos</strong></div>
            <div className="model-rail" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="model-tags"><span>B2B predominante</span><span>B2G selectivo</span><span>Alcance nacional</span></div>
          </div>
          <div className="purpose-grid" data-stagger>
            <article>
              <p className="mini-label">Misión / lo que hacemos hoy</p>
              <h3>Diseñar e integrar soluciones de ingeniería y tecnología que mejoren la infraestructura y operación de organizaciones públicas y privadas.</h3>
              <p>Ejecutando proyectos con calidad, seguridad, cumplimiento y control responsable de los recursos.</p>
            </article>
            <article>
              <p className="mini-label">Visión / hacia dónde avanzamos</p>
              <h3>Consolidarse como una empresa referente del sur del Perú en ingeniería e integración tecnológica.</h3>
              <p>Reconocida por la confiabilidad de sus proyectos, la eficiencia de su gestión y el uso estratégico de tecnologías de información para crecer de manera sostenible.</p>
            </article>
          </div>
        </section>

        <section id="capacidades" className="section capabilities-section scene-dark">
          <SectionIntro index="02" eyebrow="Capacidades / Qué hacemos" title="Una red de capacidades para resolver proyectos complejos." light />
          <div className="capability-stage" aria-label="Red de capacidades de SurTec">
            <svg className="capability-lines" viewBox="0 0 1000 680" aria-hidden="true">
              {[[500, 48], [790, 150], [865, 390], [680, 620], [320, 620], [135, 390], [210, 150]].map(([x2, y2], index) => (
                <line className="capability-line" key={index} x1="500" y1="340" x2={x2} y2={y2} />
              ))}
            </svg>
            <div className="capability-core"><SurTecMark decorative /><span>SurTec</span></div>
            {services.map((service, index) => (
              <div
                className="capability-node"
                key={service}
                style={{ '--x': `${capabilityPoints[index][0]}%`, '--y': `${capabilityPoints[index][1]}%` } as React.CSSProperties}
              >
                <span>{String(index + 1).padStart(2, '0')}</span><p>{service}</p>
              </div>
            ))}
          </div>
          <p className="stage-caption">Cada capacidad se conecta con las demás para responder como una sola solución.</p>
        </section>

        <section className="section position-section" aria-labelledby="position-title">
          <SectionIntro index="03" eyebrow="Sectores + posición estratégica" title="Capacidad técnica con lectura del entorno." copy="SurTec aplica una base multidisciplinaria en sectores donde el cumplimiento, la continuidad y la coordinación son determinantes." />
          <div className="sector-rail" data-stagger>
            {sectors.map((sector, index) => <span key={sector}><b>{String(index + 1).padStart(2, '0')}</b>{sector}</span>)}
          </div>
          <p className="strategy-method" data-reveal>Lectura FODA <span>Fortalezas · Oportunidades · Debilidades · Amenazas</span></p>
          <div className="strategy-signals" id="position-title" data-stagger>
            {strategicSignals.map((signal) => (
              <article key={signal.key} className="signal-card">
                <header><span>{signal.key}</span><h3>{signal.label}</h3></header>
                <ul>{signal.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="success-strip" data-reveal>
            <div><span>Factores críticos de éxito</span><strong>Lo que sostiene cada entrega</strong></div>
            <ul>{successFactors.map((factor) => <li key={factor}>{factor}</li>)}</ul>
          </div>
        </section>

        <section id="transformacion" className="section evolution-section scene-dark">
          <SectionIntro
            index="04" eyebrow="Evolución hacia una gestión integrada"
            title="La tecnología ya existe. El siguiente paso es conectar la información."
            copy="El crecimiento de SurTec exige que cada dato operativo contribuya a una lectura integral del proyecto."
            light
          />
          <div className="evolution-stage">
            <article className="fragment-panel evolution-panel">
              <div className="evolution-statements">
                <p className="evolution-statement-one">La tecnología existe.</p>
                <p className="evolution-statement-two">La información sigue separada.</p>
              </div>
              <div className="tool-cloud" data-stagger>
                {currentTools.map((tool, index) => <span className="tool-chip" key={tool}><b>{String(index + 1).padStart(2, '0')}</b>{tool}</span>)}
              </div>
              <ul className="friction-list">{frictionEffects.map((effect) => <li key={effect}>{effect}</li>)}</ul>
            </article>
            <div className="evolution-arrow" aria-hidden="true"><span>Integrar</span><i>→</i></div>
            <article className="integrated-panel evolution-panel">
              <p className="mini-label">Un núcleo común de información</p>
              <div className="project-network">
                <svg viewBox="0 0 620 620" aria-hidden="true">
                  {[[310, 25], [480, 100], [555, 280], [480, 470], [310, 555], [140, 470], [65, 280], [140, 100]].map(([x2, y2], index) => (
                    <line className="project-ray" key={index} x1="310" y1="310" x2={x2} y2={y2} />
                  ))}
                </svg>
                <div className="project-core"><span>Núcleo</span><strong>Proyecto</strong></div>
                {projectNodes.map((node, index) => (
                  <span className="project-satellite" key={node} style={{ '--x': `${projectPositions[index][0]}%`, '--y': `${projectPositions[index][1]}%` } as React.CSSProperties}>{node}</span>
                ))}
              </div>
              <p className="integration-result">Presupuesto, operación y evidencia conectados para decidir a tiempo.</p>
            </article>
          </div>
        </section>

        <section className="section platform-section" aria-labelledby="platform-title">
          <SectionIntro index="05" eyebrow="Transformación tecnológica" title="Una plataforma modular, progresiva y centrada en el proyecto." copy="La propuesta no es un ERP gigantesco de una sola vez. Es una evolución por capacidades, con valor operativo en cada etapa." />
          <div className="proposal-banner" id="platform-title" data-reveal>
            <span>Propuesta tecnológica</span>
            <h3>Plataforma Integrada de Gestión y Control de Proyectos para SurTec</h3>
          </div>
          <div className="module-roadmap" data-stagger>
            {modules.map((module) => (
              <article className={module.bi ? 'is-bi' : ''} key={module.number}>
                <span className="module-number">{module.number}</span>
                <div><h3>{module.name}</h3><p>{module.phase}</p></div>
                {module.bi && <b>Consecuencia de datos integrados</b>}
              </article>
            ))}
          </div>
          <div className="alignment-block">
            <div className="alignment-heading" data-reveal>
              <p className="mini-label">Alineamiento negocio – TI</p>
              <h3>La tecnología responde a una necesidad concreta y termina en un resultado observable.</h3>
              <div className="alignment-legend"><span>Necesidad de negocio</span><span>Capacidad TI</span><span>Resultado esperado</span></div>
            </div>
            <div className="alignment-flows" data-stagger>
              {alignment.map(([need, capability, result], index) => (
                <div className="alignment-row" key={need}>
                  <b>{String(index + 1).padStart(2, '0')}</b><span>{need}</span><i aria-hidden="true">→</i><span>{capability}</span><i aria-hidden="true">→</i><strong>{result}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="estrategia" className="section strategy-section">
          <SectionIntro index="06" eyebrow="Estrategia + objetivos + SMART" title="Las capacidades se convierten en procesos; los procesos, en resultados." copy="La transformación se ordena mediante objetivos conectados y metas verificables en un horizonte de 12 meses." />
          <div className="objectives-list" data-stagger>
            {objectives.map(([code, objective]) => <article key={code}><span>{code}</span><p>{objective}</p></article>)}
          </div>
          <div className="strategy-build">
            <div className="strategy-map" aria-label="Mapa estratégico de causa y efecto">
              <p className="mini-label">Mapa estratégico / causa → efecto</p>
              <div className="strategy-layer layer-learning"><span>01</span><strong>Aprendizaje y crecimiento</strong><small>Competencias técnicas y digitales</small></div>
              <i className="strategy-arrow" aria-hidden="true">↓</i>
              <div className="strategy-layer layer-process"><span>02</span><strong>Procesos internos</strong><small>Integración, trazabilidad y control</small></div>
              <i className="strategy-arrow" aria-hidden="true">↓</i>
              <div className="strategy-layer layer-client"><span>03</span><strong>Cliente</strong><small>Cumplimiento y recurrencia</small></div>
              <i className="strategy-arrow" aria-hidden="true">↓</i>
              <div className="strategy-layer layer-finance"><span>04</span><strong>Financiera</strong><small>Rentabilidad y previsibilidad</small></div>
            </div>
          </div>
          <div className="smart-band" data-reveal>
            <div><p className="mini-label">Lógica SMART</p><h3>Metas formuladas para poder gestionarse.</h3></div>
            <ol><li><b>S</b>Específico</li><li><b>M</b>Medible</li><li><b>A</b>Alcanzable</li><li><b>R</b>Relevante</li><li><b>T</b>Temporal</li></ol>
          </div>
          <div className="kpi-heading" data-reveal><p className="mini-label">Horizonte de 12 meses</p><h3>Metas de transformación</h3><span>No son resultados alcanzados; son objetivos de corto plazo.</span></div>
          <div className="kpi-grid" data-stagger>
            {kpis.map((kpi) => (
              <article key={kpi.label}>
                <strong data-count={kpi.value} data-prefix={kpi.prefix || ''} data-suffix={kpi.suffix}>{kpi.prefix}{kpi.value}{kpi.suffix}</strong>
                <h4>{kpi.label}</h4><p>{kpi.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="impacto" className="section impact-section scene-dark">
          <SectionIntro index="07" eyebrow="Impacto sostenible" title="Integrar también es construir capacidad para crecer mejor." copy="La transformación conecta productividad, infraestructura empresarial y desarrollo de capacidades sin apartarse de la operación." light />
          <div className="ods-network" data-stagger>
            <article>
              <div className="ods-number">09</div>
              <div><span>ODS principal</span><h3>Industria, innovación e infraestructura</h3><p>La transformación digital fortalece la infraestructura empresarial, la integración tecnológica y la capacidad de innovación de SurTec.</p></div>
            </article>
            <div className="ods-connector" aria-hidden="true"><i /><i /><i /></div>
            <article>
              <div className="ods-number">08</div>
              <div><span>ODS complementario</span><h3>Trabajo decente y crecimiento económico</h3><p>Una gestión más eficiente contribuye a la productividad, el crecimiento empresarial y el desarrollo de capacidades del personal.</p></div>
            </article>
          </div>
        </section>

        <section className="closing-section scene-dark" aria-labelledby="closing-title">
          <div className="closing-network" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <div className="closing-content" data-reveal>
            <SurTecMark className="closing-mark" lineClassName="closing-mark-line" nodeClassName="closing-mark-node" decorative />
            <p className="eyebrow">Todo vuelve a conectarse</p>
            <h2 id="closing-title">Tecnología que conecta proyectos con resultados.</h2>
            <SurTecLockup light />
          </div>
          <footer>
            <span>SurTec · Ingeniería y Tecnología</span>
            <span>Arequipa · Macro Región Sur · Capacidad nacional</span>
            <a href="#inicio">Volver al inicio ↑</a>
          </footer>
        </section>
      </div>
    </main>
  );
}
