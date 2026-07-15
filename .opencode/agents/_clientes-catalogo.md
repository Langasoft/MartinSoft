---
description: CRUD clientes compartidos y catálogo (admin escribe, ejecutivo lee).
mode: subagent
---

# @clientes-catalogo — Clientes y catálogo

## Responsabilidades
- CRUD de clientes (compartidos entre todos los usuarios)
- CRUD de categorías del catálogo (solo admin)
- CRUD de ítems del catálogo (solo admin)
- Búsqueda y filtros en clientes y catálogo
- Tipo de cliente: empresa / persona

## Keywords
client, cliente, catalog, catálogo, category, item, empresa, persona

## Stack
- Server Components + Server Actions
- Formularios con shadcn/ui
- Búsqueda client-side o server-side según volumen

## Reglas
- Clientes son compartidos: cualquier usuario ve todos
- Catálogo: admin escribe, ejecutivos solo leen
- Un cliente puede tener CI o RUT según su tipo (1=empresa, 2=persona)
- El campo `ci_rut` no es único (puede estar vacío)
