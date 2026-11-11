# SurTec · Transformación Digital para la Gestión Integral de Proyectos

Landing scrollytelling del **PETI 2027–2030** de SurTec Ingeniería y Tecnología S.A.C. (empresa ficticia, proyecto académico del curso *Planeamiento Estratégico de Tecnologías de Información*, USMP Filial Sur).

La historia avanza de la **fragmentación** a la **integración** en 10 escenas: SurTec → problema → transformación → plataforma → cómo funciona (flujo + OCR) → tecnología → metas 2030 → roadmap → mockup navegable.

## Ejecutar localmente

```powershell
npm install
npm run dev        # http://localhost:5173
```

Para la feria sin internet: `npm run build` y luego `npm run preview`. GSAP, Three.js, las fuentes y las imágenes quedan empaquetados en `dist/`. Solo el botón **Explorar plataforma** y la vista en vivo del mockup necesitan conexión.

## Publicar en GitHub Pages

El workflow `.github/workflows/deploy-pages.yml` compila con Vite y publica `dist/` en cada `push` a `main`.
En **Settings → Pages → Build and deployment → Source** debe estar elegido **GitHub Actions**.

URL esperada: `https://jeanestrada-2004.github.io/SurTec_Web/`

## Estructura

```
index.html                 10 escenas en HTML semántico (todo el texto vive aquí)
src/main.js                arranque, scroll → red 3D, tono, riel de escenas, modo feria (← →)
src/three/network.js       red 3D persistente (Three.js) y etiquetas proyectadas
src/scenes/story.js        escenas 1–5: textos, cadena de efectos, pregunta, módulos
src/scenes/flow.js         escena 6: flujo funcional y trazabilidad inversa
src/scenes/ocr.js          escena 6: rendición con OCR asistido
src/scenes/sections.js     escenas 7–10: arquitectura, metas, roadmap, mockup
src/styles/main.css        tokens de marca, escenas, responsive y movimiento reducido
src/assets/                logos oficiales (sin modificar), capturas del mockup, QR
scripts/prepare-assets.mjs regenera logos recortados, favicon, QR y capturas del mockup
scripts/screenshots.mjs    capturas de revisión con Edge (playwright-core)
```

## Comprobaciones útiles

- `?reduce-motion` muestra la versión estática completa (también se activa con la preferencia del sistema).
- `?no-webgl` fuerza la versión sin 3D.
- Flechas ← → saltan de escena en escena (útil para exponer).

Los nombres de archivo, códigos, comprobantes y montos de ejemplo son ficticios. Las cifras de impacto son **metas al 2030**, no resultados.
