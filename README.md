# SurTec · Ingeniería y Tecnología

Landing institucional con narrativa de transformación, animaciones GSAP/ScrollTrigger y un Hero ligero en Three.js.

## Ejecutar localmente

```powershell
npm install
npm run dev
```

Abrir `http://localhost:3000/`.

Para una exposición sin internet, instalar las dependencias previamente. GSAP, ScrollTrigger, Three.js y la tipografía Manrope quedan empaquetados localmente.

## Comprobaciones

```powershell
npm run typecheck
npm run build
npm run start
```

El fallback sin WebGL puede revisarse en `http://localhost:3000/?no-webgl=1`.
