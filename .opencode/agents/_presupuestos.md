---
description: Editor presupuestos, preview A4, PDF, workflow estados.
mode: subagent
---

# @presupuestos — Presupuestos y workflow

## Responsabilidades
- Editor de presupuestos (secciones + ítems)
- Preview A4 en vivo (mismo diseño actual de REFRIFULL)
- Generación de PDF (server-side con @react-pdf/renderer)
- Workflow: BORRADOR → ENVIADO → ACEPTADO/RECHAZADO → PAGADO
- Numeración automática PRE-AÑO-NNNNNN
- Filtros y listado de presupuestos
- Asociar n° de factura externa al marcar pagado

## Keywords
budget, presupuesto, editor, workflow, status, pdf, preview, a4, cotización

## Stack
- @react-pdf/renderer
- Server Actions (mutations)
- Formularios con shadcn/ui

## Reglas
- Solo presupuestos en BORRADOR se pueden editar
- Al ENVIADO se le congela el contenido
- Al marcar PAGADO se exige n° de factura externa
- El preview A4 debe coincidir visualmente con el PDF exportado
