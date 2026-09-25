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

## Publicar en GitHub Pages

El repositorio incluye `.github/workflows/deploy-pages.yml`. Después de subirlo a GitHub:

1. Abrir **Settings → Pages**.
2. En **Build and deployment → Source**, elegir **GitHub Actions**.
3. Ejecutar el workflow manualmente o hacer un nuevo `push` a `main`.

La publicación genera una exportación estática con la ruta base del repositorio. Para este proyecto, la dirección esperada es:

`https://JeanEstrada-2004.github.io/SurTec_Web/`
