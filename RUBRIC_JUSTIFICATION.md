# Justificación de la rúbrica — excuse-generator

Commit: `f0b404955ece248b9905c2f5e50e891bebacc455` en `cursor/excuse-generator-3a7e`.

Resultado de criterios required: **35/35 PASS**. No entran en ese porcentaje: R36 (`HITL_ENVIO_MIGUEL`) y R37 (`HITL_MIGUEL`). R38, R39 y R40 son `NO APLICA` con cita del enunciado. No hay FAIL.

| ID | Estado | Cómo se cumplió | Evidencia |
|---|---|---|---|
| R01 | PASS | Al cargar, `window.onload` llama a `writeExcuse()`, que sustituye el texto de `#excuse`. En el navegador el texto dejó de ser la frase fija y pasó a una oración de las listas. | `src/app.js` líneas 17–21. Informe `/opt/cursor/artifacts/browser-report.json` (`excuseAfterLoad`: «The dog ate the car when I was sleeping»). |
| R02 | PASS | El HTML trae la excusa fija. Con JavaScript desactivado sigue diciendo «My dog ate my homework». | `src/index.html` línea 24. Captura `/opt/cursor/artifacts/screenshots/390-nojs.png`. `browser-report.json` `noJsExcuse`. |
| R03 | PASS | El elemento es `<p id="excuse">`. | `src/index.html` línea 24. Test `the page calls the generator from onload` en `test/excuse.test.js`. |
| R04 | PASS | La lógica está en `src/app.js`, `src/excuse.js` y `src/render.js`. El HTML de origen no contiene `<script>`. Webpack inyecta un archivo externo en el build. | `src/app.js`. Test que afirma que `index.html` no incluye `<script>`. `dist/index.html` referencia `app.[hash].js`. |
| R05 | PASS | Las cuatro listas coinciden, carácter por carácter, con el enunciado. | `src/excuse.js` líneas 1–4. Test `the four lists match the exercise statement`. |
| R06 | PASS | `generateExcuse` devuelve un string. No escribe el DOM ella misma. | `src/excuse.js` líneas 18–20. |
| R07 | PASS | El retorno es `who + " " + action + " " + what + " " + when`. El test recorre las 240 combinaciones. | `src/excuse.js` línea 19. Test `generateExcuse returns one item from each list in order`. |
| R08 | PASS | `pick` hace `Math.floor(rng() * list.length)`. Por defecto `rng` es `Math.random`. | `src/excuse.js` líneas 10–15 y 18. |
| R09 | PASS | `window.onload = function ()` llama a `writeExcuse()`. | `src/app.js` líneas 17–21. El navegador ya muestra una excusa generada al abrir la página. |
| R10 | PASS | `excuse.innerHTML = generateExcuse()`. | `src/app.js` línea 10. |
| R11 | PASS | HTML, CSS y JavaScript empaquetados con Webpack 5 (`webpack --mode production` compiló). | `package.json` scripts `build` / `start`. `webpack.config.js`. Salida de build en esta sesión: webpack 5.112.2, exit 0. |
| R12 | PASS | Archivo externo, arrays, aleatorio, concatenación, función y evento (`window.onload` y el click del botón). | Mismos archivos que R04–R10 y R17. |
| R13 | PASS | El repo no es un clon del tutorial. El código vive en `src/` y el arranque es `npm start` / `npm run build`. Se usa Webpack, no el Vite de la plantilla actual, porque el enunciado fijado nombra Webpack. | `README.md` sección «Decisiones técnicas». `webpack.config.js`. `source/PROVENANCE.json`. |
| R14 | PASS | La primera vista muestra «OMG! you will not believe me but...» y la excusa grande y centrada, como el demo. La familia es Arial/Helvetica: el enunciado no fija fuente y SIGNAL prohíbe fuentes remotas y Georgia. | `src/index.html` línea 23. `src/styles/tokens.css` (`--font-body`). Capturas 390, 768 y 1280. |
| R15 | PASS | El README documenta el commit `b74fb88…`, los sha256 oficiales, la licencia ISC declarada por la plantilla Webpack y el hash del lockup. No hay lista de colaboradores ni `Co-authored-by`. `package.json` no tiene `author`. | `README.md` sección «Procedencia y licencia». Test `README documents license and does not invent collaborators`. `package.json` campo `license`. |
| R16 | PASS | Escaneo repetido en SOURCE. El enunciado no contiene cláusulas anti-IA. Resultado LIMPIO, citado en `RUBRIC.md`. | `RUBRIC.md` sección «Escaneo anti-IA». Copias en `source/OFFICIAL_README.md` y `source/OFFICIAL_README.es.md`. |
| R17 | PASS | Botón «Generate a new excuse». El click y Enter generan otra excusa y anuncian el resultado. Mide al menos 44 px y muestra anillo de foco de 2 px `#164DCC`. | `src/index.html` línea 25. `src/app.js` líneas 22–28. `browser-report.json` `afterClick`, `afterKeyboard`, `focusRing`. Capturas `390-after-click.png` y `390-focus.png`. |
| R18 | PASS | 13 pruebas de node:test, incluidas las 240 combinaciones, listas vacías y números fuera de rango. `npm test` terminó 13 pass / 0 fail. | `test/excuse.test.js`. Salida de `npm test` en esta sesión. |
| R19 | PASS | `tokens.css` y `motion.css` son copia byte a byte. Base clara. Sin `@import` de fuentes remotas. | Hashes en `test/provenance.test.js`: tokens `9b1f68b4…`, motion `36b2f4d5…`. |
| R20 | PASS | Footer con los dos SVG originales. A 390 px el apilado mide 280 px y el horizontal está oculto. A 768 y 1280 el horizontal mide 400 px. | `src/index.html` footer. `src/style.css` reglas `.lockup-*` y el media query `min-width: 432px`. `browser-report.json` `lockup390/768/1280` y `distLockupSha256`. sha256 horizontal `85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81`. |
| R21 | PASS | Contraste de los pares usados ≥ 4.5 (texto) y ≥ 3 (borde y foco), calculado en test. axe-core en 390 px: 0 violaciones. Foco visible en el botón. Skip link, `header`/`main`/`footer`, `lang="en"`, alt «4Geeks por Divinivid». | `test/contrast.test.js`. `browser-report.json` `axe390: []` y `focusRing`. Captura `390-focus.png`. |
| R22 | PASS | Al recargar con `prefers-reduced-motion: reduce`, `data-motion` es `reduced` y `animation-name` es `none`. Si la preferencia cambia después, `data-motion` pasa a `reduced`. | `src/render.js` `bindMotion`. `src/styles/motion.css`. `browser-report.json` `reducedOnLoad` y `reducedAfterChange`. Captura `390-reduced.png`. |
| R23 | PASS | Sin JS la excusa fija permanece (idle). Tras generar, `#status` dice «A new excuse is on the page.» (éxito). Una lista vacía o un aleatorio inválido lanzan error; `markError` escribe el reintento. No hay porcentaje ni spinner de red: la generación es síncrona. | `390-nojs.png`. `browser-report.json` `afterClick.status`. `src/excuse.js` líneas 7–12. `test/render.test.js` `markError`. |
| R24 | PASS | `scrollWidth` igual a `clientWidth` en 390, 768 y 1280. También en 320 y con raíz al 200 %. | `browser-report.json` `overflow390`, `overflow768`, `overflow1280`, `overflow320`, `overflow390Text200`. |
| R25 | PASS | Capturas de la página servida desde el build, no maquetas. | `/opt/cursor/artifacts/screenshots/390.png`, `768.png`, `1280.png`. |
| R26 | PASS | Video real del headless Chrome sobre `http://127.0.0.1:4173/`: carga, click, scroll al pie y otro click. 220 frames a 25 fps = 8.8 s. El mp4 declara duración 8.800 s. | `/opt/cursor/artifacts/excuse-interaction.webm` y `excuse-interaction.mp4`. |
| R27 | PASS | Lighthouse 12.8.2, `simulate`, 3 móvil y 3 escritorio. `configSettings` comprobado en cada JSON antes de resumir. Móvil 390×844, RTT 150, 1638.4 kbps, CPU ×4. Escritorio 1280×800, RTT 40, 10240 kbps, CPU ×1. En el repo solo el resumen. | `lighthouse-summary.json`. JSON completos en `/opt/cursor/artifacts/lighthouse/mobile-1.json` … `desktop-3.json`. |
| R28 | PASS | JS gzip 799 bytes (límite 174080). CSS gzip 2294 bytes (límite 40960). No hay imagen de LCP: el LCP es texto. Los SVG del pie pesan 27941 y 27940 bytes. | `lighthouse-summary.json` campo `budgets`. Build: esos dos SVG copiados sin recomprimir. |
| R29 | PASS | Una sola animación, 180 ms (`--motion-state`) y 4 px, al actualizar la excusa. El lockup no tiene animación. | `src/style.css` líneas 78–89. `tokens/motion.css` importado. |
| R30 | PASS | `GET /no-such-page` responde 404 y sirve `404.html`. Título «Page not found — Excuse generator». | `curl -sI` en esta sesión. `browser-report.json` `missingStatus: 404`. Captura `404-390.png`. |
| R31 | PASS | `title`, `meta description`, `lang="en"`, `noindex, nofollow` y `public/robots.txt` sin sitemap. No hay canonical, Open Graph ni schema. | `src/index.html` líneas 6–9. `public/robots.txt`. |
| R32 | PASS | No hay `.env`, ni claves, ni `FOURGEEKS_API_TOKEN`. `.gitignore` ignora `.env`. | Revisión del árbol del commit. `.gitignore`. |
| R33 | PASS | El README dice qué es la página, cómo correrla, la estructura y las decisiones (Webpack, tipo, lockup, noindex). | `README.md`. |
| R34 | PASS | `npm test`: 13 pass, 0 fail. `npm run build`: webpack compiled successfully. | Salida de ambos comandos en esta sesión, repetida después del resumen de Lighthouse. |
| R35 | PASS | En el recorrido de la home no hubo errores de consola, peticiones fallidas ni HTTP ≥ 400. Favicon y lockup responden 200. El 404 de `/no-such-page` es la ruta probada a propósito; Chrome lo anota en consola y el informe lo separa en `expected404Console`. | `browser-report.json` `consoleErrors: []`, `httpErrors: []`. `curl` de `/favicon.ico` y del SVG. |
| R36 | HITL_ENVIO_MIGUEL | Entregar el enlace al instructor o al LMS. Este ejecutor no lo envía. | Checklist de `FINAL_AUDIT.md`. |
| R37 | HITL_MIGUEL | El enunciado pide discutir la estrategia con compañeros antes de construir la oración. Es una acción de Miguel. Este repo no la simula ni inventa compañeros ni una conversación. No cuenta para el 100 %. Queda en el checklist de `FINAL_AUDIT.md`. | `source/OFFICIAL_README.md` líneas 17-19: «Discuss with your classmates the strategy first» y «How can we generate an excuse? How are sentences built?». `source/OFFICIAL_README.es.md` líneas 17-19: «Discute con tus compañeros de clase la estrategia primero». |
| R38 | NO APLICA | El enunciado no exige SEO. No hay canonical, sitemap, Open Graph ni schema porque no forman parte de la entrega pedida. Los metadatos mínimos del propio sitio siguen en R31. | `source/OFFICIAL_README.md` línea 15 (instrucción 1: un sitio que genere la excusa al refrescar) y líneas 57-59 («Technologies: HTML, CSS3, JavaScript, Webpack.»). El mismo texto en `source/OFFICIAL_README.es.md` líneas 15 y 57-59. Esas secciones no mencionan SEO, sitemap, canonical ni datos estructurados. |
| R39 | NO APLICA | El enunciado no exige cookies, banner de consentimiento ni política de privacidad. | Misma cita que R38: instrucción 1 y tecnologías (`source/OFFICIAL_README.md` líneas 15 y 57-59; `source/OFFICIAL_README.es.md` líneas 15 y 57-59). No aparecen cookies, consentimiento ni privacidad. |
| R40 | NO APLICA | El deploy no es required ni un extra opcional del enunciado. La entrega pedida es el sitio de la instrucción 1. «Cómo comenzar» recomienda Codespaces, Gitpod o un clon local para abrir `vanillajs-hello`; eso es el entorno de trabajo, no una URL publicada. No hay apartado de bonus sobre hosting. | `source/OFFICIAL_README.md` líneas 15, 25-37 y 57-59. `source/OFFICIAL_README.es.md` líneas 15, 25-37 y 57-59. El enunciado no dice deploy, publicar, GitHub Pages ni hosting. |

## Números de Lighthouse (laboratorio local, simulate)

| Superficie | LCP mediana / peor | CLS mediana / peor | TBT mediana / peor | INP |
|---|---|---|---|---|
| Móvil 390×844, RTT 150, 1638.4 kbps, CPU ×4 | 1053.83 ms / 1054.39 ms | 0.00270 / 0.00270 | 0 / 0 | null |
| Escritorio 1280×800, RTT 40, 10240 kbps, CPU ×1 | 244.92 ms / 246.33 ms | 0 / 0 | 0 / 0 | null |

Objetivos de laboratorio: LCP ≤ 2500 ms, CLS ≤ 0.10, TBT ≤ 200 ms. Las seis corridas quedan dentro. La puntuación de rendimiento de Lighthouse fue 1.0 en las seis; es un índice del laboratorio, no una promesa de campo.

INP es null porque el JSON de laboratorio de Lighthouse 12.8.2 no trae la auditoría `interaction-to-next-paint`. No se inventó un valor. TBT es el proxy de laboratorio.

Los campos `requestLatencyMs` 562.5 y `downloadThroughputKbps` 1474.56 del móvil son los equivalentes DevTools que Lighthouse guarda junto al perfil simulate de RTT 150 ms y 1638.4 kbps. Los controles comprobados son `throttlingMethod=simulate`, `rttMs`, `throughputKbps` y `cpuSlowdownMultiplier`.
