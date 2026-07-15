# REFRIFULL — TODO (Orden de Ejecución)

## Fase 0: Setup del proyecto
- [ ] 0.1 Inicializar `create-next-app` con TypeScript, App Router, Tailwind
- [ ] 0.2 Instalar dependencias: Prisma, NextAuth, shadcn/ui, react-pdf, recharts, next-themes, bcrypt
- [ ] 0.3 Configurar `tsconfig.json`, `tailwind.config.ts`, `globals.css` con tokens de PLAN.md
- [ ] 0.4 Mover `assets/img/` a `public/img/`

## Fase 1: Base de datos (Prisma + Neon)
- [ ] 1.1 Crear `prisma/schema.prisma` con todos los modelos de PLAN.md
- [ ] 1.2 Crear enums: Role, BudgetStatus, PaymentStatus
- [ ] 1.3 Configurar `DATABASE_URL` para Neon
- [ ] 1.4 Ejecutar `npx prisma migrate dev`
- [ ] 1.5 Crear `lib/db.ts` con PrismaClient singleton
- [ ] 1.6 Seed inicial: Company, TipoCliente (1=Empresa, 2=Persona), categorías default, admin por defecto

## Fase 2: Layout + Tema
- [ ] 2.1 Configurar `next-themes` con toggle dark/light
- [ ] 2.2 Crear `components/ui/` (shadcn primitives: button, input, select, table, card, badge, modal)
- [ ] 2.3 Crear `components/layout/Sidebar.tsx` con navegación según rol
- [ ] 2.4 Crear `components/layout/Header.tsx` con toggle tema + menú usuario
- [ ] 2.5 Crear `app/(dashboard)/layout.tsx` con sidebar + header

## Fase 3: Autenticación
- [ ] 3.1 Configurar NextAuth.js v5 con credentials provider (CI + password)
- [ ] 3.2 Crear `lib/auth.ts` con configuración de sesión JWT
- [ ] 3.3 Crear `app/(auth)/login/page.tsx` con formulario de login
- [ ] 3.4 Crear middleware de protección de rutas
- [ ] 3.5 Seed de admin inicial (CI: admin, password configurable)

## Fase 4: Usuarios (solo admin)
- [ ] 4.1 Crear `app/(dashboard)/usuarios/page.tsx` (listado ejecutivos)
- [ ] 4.2 Crear formulario de alta de ejecutivo (CI + datos + password inicial)
- [ ] 4.3 Crear acción de baja/desactivar ejecutivo
- [ ] 4.4 Crear vista de perfil propio (cambiar password)

## Fase 5: Clientes
- [ ] 5.1 Crear `app/(dashboard)/clientes/page.tsx` con listado + buscador
- [ ] 5.2 Crear `app/(dashboard)/clientes/nuevo/page.tsx` (formulario)
- [ ] 5.3 Crear `app/(dashboard)/clientes/[id]/page.tsx` (detalle + editar)
- [ ] 5.4 Campos: nombre, CI/RUT, tipoCliente (empresa/persona), teléfono, email, dirección, notas

## Fase 6: Catálogo
- [ ] 6.1 Crear `app/(dashboard)/catalogo/page.tsx` con listado + buscador
- [ ] 6.2 Crear formulario de categorías (solo admin)
- [ ] 6.3 Crear formulario de ítems (solo admin): nombre, descripción, precio, moneda, IVA, unidad, categoría
- [ ] 6.4 Vista ejecutivo: solo lectura, permite seleccionar items

## Fase 7: Presupuestos
- [ ] 7.1 Crear `app/(dashboard)/presupuestos/page.tsx` con listado + filtros (estado, fecha, ejecutivo)
- [ ] 7.2 Crear numeración automática `PRE-AÑO-NNNNNN`
- [ ] 7.3 Crear editor con secciones e ítems (ídem experiencia actual)
- [ ] 7.4 Crear selector de cliente (buscar + crear inline)
- [ ] 7.5 Crear CatalogPicker (modal para traer items del catálogo)
- [ ] 7.6 Crear preview A4 en vivo (mismo diseño actual con logo + firma)
- [ ] 7.7 Crear generación de PDF con `@react-pdf/renderer`
- [ ] 7.8 Implementar workflow de estados con botones:
  - [ ] 7.8.1 Botón "Marcar como Enviado"
  - [ ] 7.8.2 Botón "Aceptado" / "Rechazado" (con motivo)
  - [ ] 7.8.3 Botón "Marcar como Pagado" (formulario: n° factura externa, medio pago, monto, notas)
- [ ] 7.9 Bloquear edición si no está en BORRADOR

## Fase 8: Dashboard
- [ ] 8.1 Crear `app/(dashboard)/page.tsx` con cards de stats (totales según rol)
- [ ] 8.2 Crear gráfico de ingresos mensuales
- [ ] 8.3 Mostrar últimos 5 presupuestos

## Fase 9: Facturación
- [ ] 9.1 Crear `app/(dashboard)/facturacion/page.tsx` con listado de pagados
- [ ] 9.2 Editar n° factura externa
- [ ] 9.3 Exportar a CSV

## Fase 10: Reportes
- [ ] 10.1 Crear `app/(dashboard)/reportes/page.tsx`
- [ ] 10.2 Reporte ingresos: suma pagados por mes, gráfico barras + tabla
- [ ] 10.3 Reporte pendientes: aceptados sin pagar
- [ ] 10.4 Reporte sin respuesta: enviados >7 días sin acción

## Fase 11: Configuración
- [ ] 11.1 Crear `app/(dashboard)/configuracion/page.tsx` con datos empresa (admin)
- [ ] 11.2 Formulario: RUT, nombre, teléfono, email, ubicación, logo, firma
- [ ] 11.3 Valores por defecto: moneda, IVA, días validez
- [ ] 11.4 Ejecutivo: solo vista read-only + cambiar password

## Fase 12: Calidad + Documentación
- [ ] 12.1 Configurar Husky + lint-staged
- [ ] 12.2 Pasar `npm run lint` y `npm run typecheck` sin errores
- [ ] 12.3 Actualizar `README.md` con estructura real del proyecto
- [ ] 12.4 Documentar componentes con JSDoc

## Fase 13: Deploy
- [ ] 13.1 Configurar proyecto en Vercel + Neon
- [ ] 13.2 Migrar datos desde localStorage (si aplica)
- [ ] 13.3 Variables de entorno en Vercel
- [ ] 13.4 Deploy + test

---

## Dependencias clave

```
Fase 0 (Setup)
  └── Fase 1 (DB)
      └── Fase 2 (Layout)
          └── Fase 3 (Auth)
              ├── Fase 4 (Usuarios)
              ├── Fase 5 (Clientes)
              │   └── Fase 7 (Presupuestos)
              │       ├── Fase 8 (Dashboard)
              │       ├── Fase 9 (Facturación)
              │       └── Fase 10 (Reportes)
              ├── Fase 6 (Catálogo)
              └── Fase 11 (Configuración)
                              └── Fase 12 (Calidad + Docs)
                                  └── Fase 13 (Deploy)
```
