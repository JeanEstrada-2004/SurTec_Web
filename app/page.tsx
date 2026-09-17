function SurTecMark({ className = '' }: { className?: string }) {
  const nodes = [
    [72, 34], [188, 34], [34, 82], [72, 91], [130, 68], [188, 91], [226, 82],
    [34, 132], [72, 132], [130, 116], [188, 182], [226, 166], [72, 212],
    [34, 226], [130, 244], [188, 226], [226, 218], [72, 286], [188, 286],
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [1, 5], [1, 6], [2, 3], [2, 7],
    [3, 4], [3, 7], [3, 8], [4, 5], [5, 6], [7, 8], [7, 10], [8, 10], [9, 11],
    [10, 11], [10, 15], [10, 16], [11, 16], [12, 13], [12, 14], [12, 17], [13, 14],
    [14, 15], [14, 17], [14, 18], [15, 16], [15, 18], [17, 18],
  ];

  return (
    <svg className={className} viewBox="0 0 260 320" role="img" aria-label="Isotipo de SurTec">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {edges.map(([a, b], index) => (
          <line key={index} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
        ))}
        <path d="M34 132 188 182M72 132 226 166M34 226 188 226" />
      </g>
      <g fill="currentColor">
        {nodes.map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r="11" />)}
      </g>
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="site-nav" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="SurTec, inicio">
          <SurTecMark className="brand-mark" />
          <span>SurTec</span>
        </a>
        <div className="nav-links">
          <a href="#surtec">SurTec</a>
          <a href="#capacidades">Capacidades</a>
          <a href="#transformacion">Transformación</a>
          <a href="#estrategia">Estrategia</a>
          <a href="#impacto">Impacto</a>
        </div>
      </nav>

      <section id="inicio" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">Ingeniería · Tecnología · Integración</p>
          <h1>Soluciones que conectan ingeniería, tecnología y resultados.</h1>
          <p className="hero-lede">Ingeniería y tecnología para proyectos que necesitan integración, control y capacidad de respuesta.</p>
          <a className="hero-action" href="#surtec">Explorar SurTec <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-identity" aria-label="SurTec Ingeniería y Tecnología">
          <SurTecMark className="hero-mark" />
          <div>
            <strong>SurTec</strong>
            <span>Ingeniería y Tecnología</span>
          </div>
        </div>
      </section>

      <section id="surtec" className="preview-next">
        <p className="eyebrow">SurTec</p>
        <h2>Una empresa que integra capacidades alrededor de cada proyecto.</h2>
      </section>
    </main>
  );
}
