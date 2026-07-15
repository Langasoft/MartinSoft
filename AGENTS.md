# AGENTS.md — REFRIFULL

Sistema de gestión de presupuestos, clientes, catálogo, facturación y reportes para REFRIFULL (Martin Stelmaschuc).

## Agentes del proyecto (ruteo automático)

Define los agentes especializados del proyecto. Cuando recibas una orden, detecta las keywords en el mensaje y asigna la tarea al agente correspondiente. Si la orden abarca múltiples áreas, divide el trabajo entre los agentes relevantes.

| Agente | Archivo | Keywords |
| ------ | ------- | -------- |
| @schema-db | `.opencode/agents/_schema-db.md` | schema, prisma, migration, model, db, database, seed, neon, postgresql |
| @auth-users | `.opencode/agents/_auth-users.md` | login, auth, user, role, session, nextauth, password, ci, ejecutivo, admin |
| @presupuestos | `.opencode/agents/_presupuestos.md` | budget, presupuesto, editor, workflow, status, pdf, preview, a4, cotización |
| @clientes-catalogo | `.opencode/agents/_clientes-catalogo.md` | client, cliente, catalog, catálogo, category, item, empresa, persona |
| @reportes-facturacion | `.opencode/agents/_reportes-facturacion.md` | report, reporte, invoice, factura, income, pending, chart, gráfico |
| @ui-components | `.opencode/agents/_ui-components.md` | component, layout, sidebar, header, modal, form, table, dark, light, theme |
| @docs | `.opencode/agents/_docs.md` | doc, documentation, readme, agent, jsdoc, comment, changelog |
| @quality | `.opencode/agents/_quality.md` | lint, typecheck, tsconfig, husky, dependency, config, ci |

### Flujo de trabajo obligatorio

1. **AGENTS.md actúa como Project Manager.** Recibe la orden del usuario, la analiza y la delega al agente especializado correspondiente.
2. **El agente ejecuta su tarea** (editar archivos, crear componentes, modificar contenido — sin ejecutar ningún comando git) y al finalizar ejecuta `npm run lint` y `npm run typecheck` para verificar que no haya errores.
3. **Al recibir la entrega del agente, AGENTS.md debe ejecutar el checklist de finalización** (ver sección más abajo). Esto incluye verificar que `README.md` refleje los cambios estructurales.
4. **Si README.md no refleja los cambios**, AGENTS.md debe actualizarlo antes de marcar la tarea como completa.
5. **Solo cuando el checklist pase completo**, la tarea se da por terminada.

## Stack

| Capa | Tecnología |
| ---- | ---------- |
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui |
| Base de datos | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Autenticación | NextAuth.js v5 (CI + password) |
| PDF | @react-pdf/renderer |
| Gráficos | recharts |
| Linter | ESLint (next lint) |
| TypeCheck | tsc --noEmit |
| Paquete | npm |

## Design Tokens

```css
--project-primary: #1a1a2e;
--project-accent: #7c3aed;
--project-neutral-100: #f5f5f5;
--project-neutral-900: #0f0f1a;
--project-gradient: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);
--project-font-sans: Inter, system-ui, sans-serif;
--project-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

## Reglas absolutas (sin excepción)

1. **Prohibición total de manipular ramas**: El agente tiene prohibido ejecutar cualquier comando de control de versiones (`git checkout`, `git merge`, `git cherry-pick`, `git push`, `git branch`, `git commit`, etc.) sin orden explícita del usuario. El agente trabaja en la rama que esté activa sin importar cuál sea — la gestión de ramas es responsabilidad del usuario. Si esta regla se viola, la tarea NO puede marcarse como completada bajo ninguna circunstancia.
2. **Documentación viva**: Cada cambio de estructura, API o componente debe reflejarse en `README.md` y en `AGENTS.md` si aplica. No hay excepción.
3. **Calidad de código**: Código limpio, tipado fuerte, sin any implícitos,遵循 el principio de responsabilidad única.
4. **Sin deuda técnica**: Si introduces una mejora, limpia lo viejo. No dejar dead code, comentarios bloqueados, imports sin usar ni console.logs.
5. **Rendimiento**: Lighthouse > 90 en todas las métricas. Lazy loading de componentes pesados. Optimizar assets.
6. **Accesibilidad**: Respetar ARIA. Navegación por teclado. No romper accesibilidad de librerías de componentes.
7. **SEO**: Meta tags, Open Graph, JSON-LD, sitemap, robots.txt en cada página (si aplica).
8. **Responsive**: Mobile-first. Todo componente debe verse y funcionar correctamente en móvil, tablet y desktop.
9. **Sin librerías duplicadas**: No introducir múltiples librerías para el mismo propósito.
10. **Commits**: `npm run lint` y `npm run typecheck` deben pasar antes de cada commit. Husky los ejecuta automáticamente.
11. **Summary / Commit messages**: When the user requests a summary or commit message, always respond in **English** using [Conventional Commits](https://www.conventionalcommits.org/) format. The prefix must accurately reflect the change type (`feat:`, `fix:`, `docs:`, `refactor:`, `perf:`, `style:`, `test:`, `chore:`, etc.). The message body must detail what was changed and why — no vague descriptions.

## Scripts

```bash
npm run dev        # Desarrollo
npm run build      # Build producción
npm run start      # Servir build producción
npm run lint       # Linter (next lint)
npm run typecheck  # Type checking (tsc --noEmit)
npm run format     # Formatter (prettier)
```

## Estructura del proyecto

```
refrifull-next/
├── prisma/
│   └── schema.prisma          # Modelo de datos
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/         # Página de login
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx     # Sidebar + header
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── clientes/
│   │   │   ├── catalogo/
│   │   │   ├── presupuestos/
│   │   │   ├── facturacion/
│   │   │   ├── reportes/
│   │   │   ├── configuracion/
│   │   │   └── usuarios/      # Solo admin
│   │   ├── api/auth/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # shadcn primitives
│   │   ├── layout/            # Sidebar, Header
│   │   ├── clientes/
│   │   ├── catalogo/
│   │   ├── presupuestos/
│   │   ├── facturacion/
│   │   └── reportes/
│   ├── lib/
│   │   ├── db.ts              # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   └── utils.ts
│   └── actions/               # Server Actions
├── public/
│   └── img/
│       ├── image.png          # Logo REFRIFULL
│       └── firma.png          # Firma digital
├── PLAN.md                    # Diseño completo del sistema
├── AGENTS.md
└── README.md
```

## Convenciones de componentes

- Cada componente en su propia carpeta con archivo de exportación si aplica
- UI primitives en `components/ui/` (shadcn)
- Componentes de negocio en su carpeta por módulo
- Server Components por defecto, Client Components solo cuando hay interactividad

## Checklist de finalización (obligatorio — saltarlo = tarea incompleta)

Cada tarea debe pasar TODOS estos puntos antes de darse por terminada. Si alguno falla, la tarea NO está completa:

- [ ] `npm run build` solo si el usuario lo autoriza explícitamente — NUNCA correrlo sin aprobación
- [ ] `README.md` refleja la estructura actual del proyecto (archivos, directorios, componentes)
- [ ] `AGENTS.md` está actualizado si cambiaron reglas, stack o estructura
- [ ] `npm run lint` pasa sin errores ni warnings
- [ ] `npm run typecheck` pasa sin errores
- [ ] No hay dead code, imports sin usar, console.logs ni comentarios bloqueados
- [ ] Los cambios estructurales (nuevos directorios, componentes, archivos) están documentados en `README.md` — si no, la tarea NO está terminada
