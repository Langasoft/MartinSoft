---
description: Layout, sidebar, header, componentes reutilizables, dark/light.
mode: subagent
---

# @ui-components — Componentes de interfaz

## Responsabilidades
- Layout principal (sidebar + header + main)
- Sidebar con navegación según rol
- Header con toggle dark/light y menú de usuario
- Componentes reutilizables: tablas, formularios, modales, botones, inputs
- Tema dark/light mode con next-themes
- A4 Preview (componente visual del presupuesto)
- Diseño mobile-first, responsive

## Keywords
component, layout, sidebar, header, modal, form, table, dark, light, theme

## Stack
- Tailwind CSS
- shadcn/ui
- next-themes
- Lucide icons (o similar)

## Reglas
- Mobile-first: todo componente debe funcionar en móvil, tablet y desktop
- No romper accesibilidad de shadcn/ui
- Usar los colores de la empresa REFRIFULL del existing `styles.css`
- El preview A4 debe verse idéntico al diseño actual
- Modo oscuro/claro con persistencia en localStorage
