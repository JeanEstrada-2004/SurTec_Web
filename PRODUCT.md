# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated by the user: Vite + vanilla JavaScript, GSAP + ScrollTrigger, Three.js (tree-shaken, lazy). Static build deployed to GitHub Pages (`https://jeanestrada-2004.github.io/SurTec_Web/`). Everything bundled locally so the page works offline at a fair. No backend.

## Users

- Course instructor and jury of *Planeamiento Estratégico de Tecnologías de Información* (USMP Filial Sur, Ingeniería de Computación y Sistemas) evaluating the PETI 2027–2030.
- Fair visitors with no course context who must grasp the project in 2–3 minutes of continuous scrolling, then open the navigable mockup (often from a phone via QR).

## Product Purpose

Turn the academic PETI 2027–2030 of the fictional company SurTec Ingeniería y Tecnología S.A.C. into a scrollytelling experience: what SurTec is → its information problem (fragmentation) → why it must transform → the proposed Plataforma Integrada de Gestión y Control de Proyectos → how it works → technology → expected benefits → roadmap → explore the mockup. Success: the visitor leaves understanding that "SurTec ya genera información; el reto es conectarla" and clicks **Explorar plataforma**.

## Positioning

The platform is not a generic ERP: it is designed around how a project-based engineering company works. **Proyecto** is the single entity that every operation (budget, purchases, expenses, staff, materials, documents, costs, indicators) connects to, giving traceability from indicator → cost → operation → document → responsible → project.

## Operating Context

- Presented at a university fair and in class, on laptops/projectors and visitors' phones.
- Mockup (frontend only, fictional data, TO-BE vision): https://jeanestrada-2004.github.io/Mockup-ERP/surtec-peti/index.html — has no productive backend, biometrics, OCR or database.
- Source of truth: `Plan Estrategico TI - SurTec 2027 2030.pdf` (PETI document provided by the user).

## Capabilities and Constraints

- Modules: Gestión de Proyectos, CRM, Presupuestos y Cotizaciones, Compras y OC, Rendiciones (PWA + OCR asistido, user always validates), Personal/Tareo/Biometría, Almacén/Materiales/Kardex, Costos por Proyecto, Gestión Documental, Reportes y BI; Seguridad/Auditoría and Integraciones are transversal.
- Architecture: cloud-first; users Gerencia, Administración, Comercial, Proyectos, Logística, Campo; web responsive/PWA; modular monolith + API; PostgreSQL + object document storage + master data; prod and test environments; HTTPS/TLS, MFA, roles, audit, backups, recovery, monitoring.
- Goals (future targets, never presented as achieved): ≥90 % active projects integrated; ≥50 % less economic consolidation time; ≥95 % document traceability; ≤8 % budget deviation; ≥80 % active users; 100 % critical repositories backed up; ≥90 % target staff trained.
- Roadmap: 2027 Preparar e integrar · 2028 Digitalizar la operación · 2029 Expandir y explotar datos · 2030 Optimizar y madurar.
- Reference investment S/ 530 761 (shown as S/ 531 000): 2027 S/ 102 300 · 2028 S/ 219 461 · 2029 S/ 141 350 · 2030 S/ 67 650. User confirmed: show it discreetly with the roadmap.
- ODS 9 (principal) and ODS 8.
- Must not become a Word document on the web, a vertical PowerPoint, a table-heavy page, a corporate services page or full technical documentation.

## Brand Commitments

- Colors: Azul Corporativo #1A365D, Azul Integración #0066CC, Gris Estructural #4A5568, Blanco Técnico #F7FAFC (soft variations allowed, no foreign dominant colors).
- Official logos only, never redrawn, reinterpreted or re-proportioned: `public/brand/surtec-logo-color.png`, `public/brand/surtec-logo-white.png` (originals in `Logos SurTec/`).
- Voice: professional, clear, executive, technological. "SurTec integra…", "Una sola vista del proyecto…", "Del indicador al documento de origen…". Never "Según el PETI desarrollado…".
- Key lines: "Del dato aislado a la trazabilidad integral del proyecto." · "Una plataforma. Un proyecto. Toda la información conectada." · "SurTec ya genera información. El reto es conectarla."
- Academic credits (USMP Filial Sur, curso, Mg. Ing. Norman Patrick Harvey Arce, Jean Carlos Estrada Barrientos, PETI 2027–2030) go in the closing footer only.

## Evidence on Hand

- PETI document, official logos, navigable mockup.
- No real clients, projects, photos, testimonials or results exist: SurTec is fictional. Never fabricate them.

## Product Principles

1. Fragmentación → integración is the spine of every scene.
2. Clarity over spectacle: motion must explain, not decorate.
3. Every number is a goal, labelled as such.
4. The journey ends at the mockup.
5. Works offline, on phones, and with reduced motion.

## Accessibility & Inclusion

Good contrast, legible text, visible buttons, keyboard navigation, `prefers-reduced-motion` respected with a complete static version.
