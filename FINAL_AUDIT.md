# Auditoría final — excuse-generator

Estado: **PENDIENTE_REVISION_ORQUESTADOR**

Implementación: `f0b404955ece248b9905c2f5e50e891bebacc455`
Rama: `cursor/excuse-generator-3a7e`
Base: `main` (`319686f`, no se ha hecho merge)
Required: **35/35 PASS**
FAIL: ninguno
BLOCKED: ninguno
HITL_ENVIO_MIGUEL: R36 (no cuenta para el 100 %)
HITL_MIGUEL: R37 (no cuenta para el 100 %)
NO APLICA: R38, R39, R40

## Cierre

Se releyó la rúbrica contra el commit, el informe del navegador, las capturas, el video de 8.8 s y `lighthouse-summary.json`. Los required están en PASS con evidencia citada en `RUBRIC_JUSTIFICATION.md`. Un criterio sin captura o sin salida de comando no se marcó PASS: zoom 400 %, forced-colors visual, Firefox, Safari, lector de pantalla e INP de laboratorio quedan NO EJECUTADO en `DESIGN-QA.md` y no se usaron para inflar la rúbrica.

## Reparaciones de esta pasada

1. Los archivos copiados por shell (lockup, enunciado, tokens) no estaban en el árbol cuando corrieron las pruebas. Se volvieron a copiar, se comprobaron los sha256 y quedaron en el commit.
2. El primer test de «cualquier excusa al azar» partía la frase por espacios y fallaba con «My grandma» y «my homework». Se cambió a comparar contra el conjunto de las 240 oraciones antes de dar la suite por verde.
3. El script de captura trataba el 404 deliberado como fallo de consola. El producto ya respondía 404. Se separó esa línea en `expected404Console`.
4. La comprobación de Tab arrancaba con el foco ya en el botón, así que dos Tab no volvían a él. El orden real es skip link y luego botón, con anillo de 2 px. Se ajustó el script, no el producto.

## Ajuste de clasificación

R37 pasa de NO APLICA a HITL_MIGUEL: el enunciado sí pide la discusión con compañeros (`source/OFFICIAL_README.md` líneas 17-19 y `source/OFFICIAL_README.es.md` líneas 17-19). No se puede simular ni inventar. R40 sigue en NO APLICA: el enunciado no exige deploy ni lo ofrece como bonus (instrucción 1 y tecnologías, líneas 15 y 57-59; el arranque de las líneas 25-37 es el entorno local o Codespaces/Gitpod). R38 y R39 siguen en NO APLICA porque esas mismas secciones no piden SEO ni cookies.

## Checklist de Miguel (no cuenta para el 100 %)

- [ ] R36 — Enviar el enlace del repo o del PR al instructor o al LMS, si corresponde.
- [ ] R37 — Discutir con compañeros de clase la estrategia (quién, acción, qué y cuándo). No dejar constancia inventada en el repo.
- [ ] Revisar el PR. Este ejecutor no lo mergea.
- [ ] Decidir si el `noindex` se mantiene cuando exista un dominio de publicación.

## Límites

- Laboratorio Lighthouse en localhost con throttling simulate, no datos de campo.
- INP no medido.
- Un solo motor: Chrome.
- La revisión del ejecutor no sustituye la del orquestador.
