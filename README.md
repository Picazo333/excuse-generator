# Excuse generator

Página estática que arma una excusa al azar. Cada oración toma un elemento de cuatro listas —quién, acción, qué y cuándo— y las une en ese orden. Al cargar la página, JavaScript sustituye la excusa escrita en el HTML. Un botón genera otra sin recargar.

## Cómo correrlo

Requiere Node.js 20 o superior.

```bash
npm install
npm test
npm run build
npm run preview
```

- `npm start` abre el servidor de desarrollo de Webpack en `http://127.0.0.1:3000`.
- `npm run build` escribe el sitio de producción en `dist/`. Esa carpeta no se versiona: el comando la regenera.
- `npm run preview` sirve `dist/` en `http://127.0.0.1:4173`.

El build espera servirse desde la raíz del host (`publicPath: "/"`).

## Estructura

- `src/index.html` — excusa fija en `#excuse`, visible sin JavaScript.
- `src/excuse.js` — listas y función `generateExcuse`, que devuelve la oración.
- `src/app.js` — `window.onload` llama a la función y asigna `innerHTML`. También escucha el botón.
- `src/render.js` — aviso de éxito o error, y la preferencia de movimiento.
- `src/style.css` — presentación. Importa los tokens y el motion del paquete SIGNAL sin modificarlos.
- `src/404.html` — página para una ruta inexistente.
- `test/` — pruebas de la generación, del aviso, del contraste y de los hashes.
- `source/` — copias íntegras del enunciado y `PROVENANCE.json`. No forman parte de la página.
- `brand/lockups/` — lockup 4Geeks × Divinivid, bytes originales.

## Decisiones técnicas

El enunciado fijado pide HTML, CSS3, JavaScript y Webpack, y señala la plantilla `4GeeksAcademy/vanillajs-hello`. En el commit de esa plantilla vigente cuando el enunciado usaba Webpack (`c8e81c8b6c9c`, 2023-04-08), `package.json` declara licencia ISC. La rama actual de la plantilla usa Vite. Este repositorio sigue la tecnología escrita en el enunciado: Webpack 5 empaqueta `src/app.js` y el CSS.

La función usa `Math.random` salvo que se le pase otro generador. Las pruebas recorren las 240 combinaciones con un generador inyectado. Una lista vacía o un número fuera de `[0, 1)` lanza un error; la página lo muestra en `#status` y deja el botón para reintentar. No hay petición de red, así que no hay estado de carga ni porcentaje.

La frase visible «OMG! you will not believe me but...» es la del demo del enunciado. La excusa inicial del HTML es la del ejemplo: «My dog ate my homework». Las listas son las del enunciado, en inglés. La interfaz está en inglés por esa misma razón.

El tipo es Arial / Helvetica, como pide el perfil visual de esta entrega. El demo estático se ve con una serif de navegador; el enunciado no nombra una familia, y esta entrega no carga fuentes remotas.

El movimiento es un desplazamiento de 4 px y 180 ms al cambiar la excusa. Con `prefers-reduced-motion: reduce` no hay animación, ni al primer pintado ni si la preferencia cambia después. El lockup no se anima.

En viewports donde el lockup horizontal no cabe a 400 px CSS, se muestra el apilado a 280 px. El cambio está en 432 px CSS (400 px más el margen de 16 px por lado).

Esta página no es una landing pública: no hay dominio confirmado, ni canonical, ni sitemap, ni datos estructurados de campaña. Lleva `noindex` y `public/robots.txt` pide a los rastreadores que no entren. No hay cookies ni medidores.

## Procedencia y licencia

Enunciado: `4GeeksAcademy/tutorial-project-excuse-generator-javascript`, commit `b74fb88e5b90dfefc0229eb0827b3b194b91706e`. El repositorio padre indicado en la procedencia es `breatheco-de/tutorial-project-excuse-generator-javascript`. Ese commit no trae archivo `LICENSE`. Las copias locales y sus sha256 están en `source/PROVENANCE.json`:

- `source/OFFICIAL_README.md` — `cc5a1547e4c6f0fcc8075995aee8e0a9c56fbc58a709918b91ab22fcb4b85571`
- `source/OFFICIAL_README.es.md` — `f35b1e281384801120cf7e381885f614182ece2698887d109b033818e10b225e`
- `source/learn.json` — `b87513e70828ba0ee0e05e74779be14b05af846cbf0387cc32d5ada96bb0d2ea`

Plantilla de arranque citada por el enunciado: `4GeeksAcademy/vanillajs-hello`. Su `package.json` de la época Webpack declara `"license": "ISC"`. Este repositorio conserva ese identificador en `package.json`. No añade un archivo de copyright con un nombre propio, ni una lista de personas.

El lockup del pie es el archivo oficial del encargo visual, sin redibujar:

- `brand/lockups/signal-horizontal.svg` — `85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81`
- `brand/lockups/signal-stacked.svg` — `11314b300284db342bc15a7c7695c23199f65f68178af45586b62d01e9ea133a`

El crédito visual no afirma una asociación oficial ni suma personas al repositorio.

## Comprobación de rendimiento

Sobre el build de producción, con el preview en marcha:

```bash
node scripts/lighthouse.mjs
```

Lighthouse en Chrome headless, método `simulate`, tres corridas en móvil y tres en escritorio. El resumen versionado es `lighthouse-summary.json`. Los JSON completos no van en el repositorio. `node scripts/capture.mjs` guarda capturas del preview.

Móvil: viewport 390×844, RTT 150 ms, 1638.4 kbps, CPU ×4. Escritorio: RTT 40 ms, 10240 kbps, CPU ×1.
