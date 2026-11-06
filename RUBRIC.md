# Rúbrica — excuse-generator (066)

Fuente del enunciado: `4GeeksAcademy/tutorial-project-excuse-generator-javascript` @ `b74fb88e5b90dfefc0229eb0827b3b194b91706e`. Copias en `source/`. El orden de autoridad es enunciado 4Geeks, luego este encargo, luego SIGNAL.

## Escaneo anti-IA (SOURCE, repetido)

Se buscó en `source/OFFICIAL_README.md`, `source/OFFICIAL_README.es.md`, `source/learn.json` y en el texto oficial adjunto estas cláusulas: «No utilices herramientas de IA», «Do not use AI tools», «write each one yourself», «escrito por ti», «sin copiar», «no uses ChatGPT», «ChatGPT», «inteligencia artificial», «AI tools», «without AI», «by yourself», «your own words».

Resultado: **LIMPIO**. Ninguna aparece en el enunciado. La única aparición de la lista es la propia instrucción de búsqueda en `CLOUD_PROMPT_FASE2.md`, que no es el enunciado. `LAUNCH_NOTES.md` también anota el escaneo previo como LIMPIO. Se puede implementar.

## Criterios

Estado de evaluación: ver `RUBRIC_JUSTIFICATION.md`. Aquí solo se define el criterio. `required: sí` entra en el 100 %. `HITL_ENVIO_MIGUEL`, `HITL_MIGUEL` y `NO APLICA` no restan.

| ID | Required | Criterio |
|---|---|---|
| R01 | sí | El sitio genera una excusa nueva cada vez que se refresca la página. |
| R02 | sí | `index.html` contiene una excusa fija en HTML, legible sin JavaScript. |
| R03 | sí | Esa excusa está en un elemento con `id="excuse"`. |
| R04 | sí | El JavaScript de la página vive en un archivo externo, no embebido en el HTML. |
| R05 | sí | Las listas son exactamente `who`, `action`, `what` y `when` del enunciado, con esos textos y ese orden. |
| R06 | sí | Hay una función que genera y **devuelve** una excusa aleatoria. |
| R07 | sí | La excusa concatena un elemento de cada lista en el orden quién, acción, qué, cuándo. |
| R08 | sí | La elección usa un número aleatorio. |
| R09 | sí | `window.onload` llama a esa función. |
| R10 | sí | El resultado se asigna a `innerHTML` de `#excuse`. |
| R11 | sí | El stack es HTML, CSS3, JavaScript y Webpack. |
| R12 | sí | El código muestra los fundamentos pedidos: archivo JS externo, arrays, aleatorio, concatenación, función y evento. |
| R13 | sí | El proyecto no es un clon del repo del tutorial. Sigue el flujo de la plantilla citada: código en `src/`, arranque con npm, trabajo dentro de `window.onload`. Webpack, no el Vite de la plantilla actual, porque el enunciado fijado nombra Webpack. |
| R14 | sí | La primera vista se reconoce en el demo: título «OMG! you will not believe me but...» y la excusa grande y centrada. La familia tipográfica es Arial/Helvetica (SIGNAL); el enunciado no fija una fuente. |
| R15 | sí | Licencia y procedencia conservadas y escritas en el README. Sin autoría inventada, sin colaboradores, sin `Co-authored-by`. |
| R16 | sí | El escaneo anti-IA del enunciado está hecho, citado y queda LIMPIO. |
| R17 | sí | Extra visible: botón accesible que genera otra excusa sin recargar. No sustituye la generación al cargar. |
| R18 | sí | Extra técnico: pruebas automáticas de las listas, de las 240 combinaciones y del contrato de la función. |
| R19 | sí | Tokens SIGNAL exactos, base clara, Arial/Helvetica, sin fuentes remotas ni otro tema. |
| R20 | sí | Lockup 4Geeks × Divinivid en el footer, bytes originales. Horizontal con ancho mínimo 400 px CSS; apilado (mínimo 280 px) cuando el horizontal no cabe. sha256 de `signal-horizontal.svg` = `85459232bf51e7bf7c94225fd4f2cd6b71a681b6d701cb4ffd6d2a142cf57a81`. |
| R21 | sí | Base accesible: contraste AA de los pares usados, foco visible, objetivo de 44 px, skip link, landmarks, `lang`, alt del lockup, teclado utilizable. |
| R22 | sí | `prefers-reduced-motion` desde el primer pintado y al cambiar la preferencia. El estado final queda visible. |
| R23 | sí | Estados reales: HTML fijo antes de JS (idle), éxito al generar, error legible con reintento. Sin porcentajes falsos. La generación es síncrona: no hay estado de carga de red. |
| R24 | sí | Sin overflow horizontal a 390, 768 y 1280 px CSS. |
| R25 | sí | Capturas reales de la app en marcha a 390, 768 y 1280. |
| R26 | sí | Video corto real del recorrido con la interacción del botón. |
| R27 | sí | Lighthouse móvil y escritorio, 3 corridas cada uno, `simulate`, con la red y la CPU pedidas. Comprobar `configSettings`. En el repo solo `lighthouse-summary.json`. |
| R28 | sí | Presupuesto de peso: JS gzip ≤ 170 KiB, CSS gzip ≤ 40 KiB, primera pantalla razonable, sin imagen LCP pesada. |
| R29 | sí | Motion 2D solo al cambiar la excusa (4 px, 180 ms). El lockup no se anima. |
| R30 | sí | Una ruta desconocida responde 404 de verdad. |
| R31 | sí | Metadatos aplicables (`title`, descripción, `lang`, `noindex`). Sin canonical, sitemap, Open Graph de campaña ni schema inventados. |
| R32 | sí | Sin secretos en código, tests, docs ni capturas. No hay `.env` con valores. |
| R33 | sí | README técnico y neutro: qué es, cómo correrlo, estructura, decisiones, procedencia. |
| R34 | sí | `npm test` y `npm run build` terminan en verde. |
| R35 | sí | El recorrido en el navegador no deja errores de consola ni de red relevantes (favicon incluido). |
| R36 | HITL_ENVIO_MIGUEL | Entregar el repo o el enlace al instructor o al LMS. No lo hace este ejecutor. No cuenta para el 100 %. |
| R37 | HITL_MIGUEL | «Discuss with your classmates the strategy first» / «Discute con tus compañeros de clase la estrategia primero». Acción humana de Miguel. No se simula ni se inventa la conversación. No cuenta para el 100 %. |
| R38 | NO APLICA | SEO de landing (canonical, sitemap, Open Graph, schema). El enunciado no lo pide. |
| R39 | NO APLICA | Cookies, consentimiento o privacidad. El enunciado no lo pide. |
| R40 | NO APLICA | Deploy o URL pública. No es required ni un apartado opcional del enunciado. La instrucción 1 pide el sitio; «Cómo comenzar» solo indica dónde abrir la plantilla. |

## Extras subordinados al enunciado

- Visible (R17): botón «Generate a new excuse».
- Técnico (R18): pruebas de generación en `test/excuse.test.js`, más el workflow que las ejecuta.

No cambian las listas, ni el `onload`, ni el `innerHTML`.
