# REFRIFULL — Plan Completo del Sistema

## 1. Roles y Permisos

| Módulo | Admin | Ejecutivo |
|--------|-------|-----------|
| Login | CI + password | CI + password |
| Dashboard | Stats globales | Stats propios |
| Clientes | CRUD completo (compartidos) | CRUD (compartidos) |
| Catálogo | CRUD completo | Solo lectura |
| Presupuestos | CRUD completo (ve todos) | CRUD (ve solo los suyos) |
| Usuarios | CRUD (alta/baja ejecutivos) | Solo su perfil |
| Config. empresa | Lectura/escritura | Solo lectura |
| Reportes | Globales | Solo propios |
| Facturación | Ver/editar n° factura externa | Ver/editar n° factura externa |

---

## 2. Modelo de Datos

```
User
  ci            String @id                  ← PK: cédula identidad para login
  name          String
  email         String
  password      String                      ← guarda el bcrypt hash
  role          Role  @default(EJECUTIVO)
  isActive      Boolean @default(true)
  createdAt     DateTime
  updatedAt     DateTime

TipoCliente
  id            Int    @id @default(autoincrement())
  nombre        String                       ← "Empresa", "Persona"

Client (compartido entre todos los usuarios)
  id            String @id @default(cuid())
  createdByCi   String (FK -> User.ci)
  name          String
  ci_rut        String?                      ← CI o RUT según tipo
  tipoClienteId Int (FK -> TipoCliente)      ← 1=Empresa, 2=Persona
  phone         String?
  email         String?
  address       String?
  notes         String?
  createdAt     DateTime

Company (singleton)
  rut           String @id                   ← PK: RUT de la empresa
  name          String                       ← "Martin Stelmaschuc"
  phone         String
  email         String
  location      String
  logoUrl       String                       ← "img/image.png"
  signatureUrl  String                       ← "img/firma.png"
  defaultCurrency  String @default("$U")
  defaultIva      Int    @default(22)
  validDays       Int    @default(10)

Category
  id            String @id @default(cuid())
  name          String
  sortOrder     Int

CatalogItem
  id            String @id @default(cuid())
  categoryId    String (FK -> Category)
  name          String
  description   String?
  defaultPrice  Float   @default(0)
  currency      String  @default("$U")
  ivaType       String  @default("plus")
  unit          String  @default("servicio")
  isActive      Boolean @default(true)
  createdAt     DateTime

Budget
  id            String @id @default(cuid())  ← PK interna
  number        String @unique               ← "PRE-2026-000001"
  userCi        String (FK -> User.ci)
  clientId      String? (FK -> Client)
  title         String
  date          DateTime
  validUntil    DateTime?
  comment       String?
  status        BudgetStatus @default(BORRADOR)
  paymentStatus PaymentStatus @default(PENDIENTE)
  ivaPercent    Float  @default(22)
  createdAt     DateTime
  updatedAt     DateTime

  sentAt        DateTime?
  acceptedAt    DateTime?
  rejectedAt    DateTime?
  rejectedReason String?
  paidAt        DateTime?

  externalInvoiceNumber  String?              ← n° de factura externa
  paidAmount             Float?               ← monto cobrado
  paymentMethod          String?              ← efectivo/transferencia/tarjeta/etc
  externalInvoiceNotes   String?

BudgetItem
  id            String @id @default(cuid())
  budgetId      String (FK -> Budget)
  sectionName   String?
  description   String
  quantity      Float  @default(1)
  unitPrice     Float  @default(0)
  currency      String @default("$U")
  ivaType       String @default("plus")
  discountPercent Float @default(0)
  sortOrder     Int
  catalogItemId String? (FK -> CatalogItem)

--- Enums ---
Role:          ADMIN | EJECUTIVO
BudgetStatus:  BORRADOR | ENVIADO | ACEPTADO | RECHAZADO
PaymentStatus: PENDIENTE | PAGADO | ANULADO
```

---

## 3. Módulos del Sistema

### Autenticación
- Login con CI + password (bcrypt, NextAuth.js credentials)
- Admin da de alta ejecutivos (asigna CI + password inicial)
- Ruta pública: `/login` — middleware protege el resto
- El usuario puede cambiar su propia contraseña desde Configuración

### Dashboard
- Admin: cards con totales globales (emitidos, aceptados, rechazados, pendientes, ingresos del mes)
- Ejecutivo: cards con sus propios totales
- Gráfico de ingresos mensuales
- Últimos 5 presupuestos con acceso directo

### Clientes
- **Compartidos** entre todos los usuarios (admin y ejecutivos)
- Cualquier usuario puede crear, editar, ver cualquier cliente
- Lista con buscador (nombre, ci_rut, teléfono)
- Crear/editar: nombre, CI o RUT, tipo (empresa/persona), teléfono, email, dirección, notas
- Modal o página

### Catálogo
- Admin: CRUD de categorías e ítems
- Ejecutivo: solo navega y selecciona ítems al armar presupuestos
- Búsqueda y filtro por categoría
- Cada ítem: nombre, descripción, precio sugerido, moneda ($U/U$S), tipo IVA (+IVA/IVA incluido), unidad

### Presupuestos
- Lista con filtros por estado, fecha, ejecutivo (admin), buscador
- Editor con secciones e ítems
  - Por ítem: descripción, cantidad, precio unitario, moneda ($U/U$S), tipo IVA (+IVA/IVA inc.)
  - Botón para traer ítems del catálogo
- Preview A4 en vivo (mismo formato actual con logo y firma)
- PDF descargable (server-side) exactamente igual al formato actual
- Numeración: `PRE-AÑO-NNNNNN` (reinicia cada año)

**Workflow:**
```
BORRADOR → ENVIADO → ACEPTADO → PAGADO (ingresa n° factura externa, medio pago, monto)
                   → RECHAZADO (archivado con motivo)
```

### Facturación
- Lista de presupuestos pagados
- Columnas: n° presupuesto, cliente, monto, n° factura externa, medio de pago, fecha pago, ejecutivo
- Admin + ejecutivo pueden editar el n° de factura externa
- Exportable a CSV
- Escalable a DGI: en el futuro se agregan al mismo registro los campos fiscales (CAE, fecha autorización, RUT cliente, etc.)

### Reportes
- **Ingresos**: suma presupuestos pagados, agrupado por mes, gráfico + tabla
- **Pendientes**: presupuestos aceptados sin pagar
- **Sin respuesta**: enviados hace >7 días sin acción
- Admin: global; ejecutivo: solo lo suyo

### Configuración
- Admin: datos empresa (RUT, nombre, teléfono, email, dirección, logo, firma, defaults)
- Admin: gestión de usuarios (alta/baja ejecutivos, reset password)
- Ejecutivo: solo ve datos empresa (read-only) + cambia su propia contraseña

---

## 4. Workflow Completo del Presupuesto

```
BORRADOR
  ├── Editable (se puede modificar todo)
  ├── Se guarda automáticamente al hacer cambios
  └── Botón: "Marcar como Enviado"
       │
       ▼
ENVIADO
  ├── Se registra fecha de envío (sentAt)
  ├── PDF descargable para enviar al cliente
  ├── Ya NO se puede editar (solo duplicar para crear otro)
  └── Botones: "Aceptado" / "Rechazado"
       │               │
       ▼               ▼
    ACEPTADO         RECHAZADO
    ├── payment      ├── Se guarda motivo (rejectedReason)
    │   status =     └── Queda archivado, no sigue
    │   PENDIENTE
    └── Botón:
        "Marcar como Pagado"
             │
             ▼
          PAGADO
          ├── Usuario ingresa:
          │   • N° factura externa (obligatorio)
          │   • Medio de pago (opcional: efectivo, transferencia, tarjeta, etc.)
          │   • Monto cobrado (opcional, útil si pagan parcial)
          │   • Notas (opcional)
          ├── Se registra fecha de pago automática (paidAt)
          └── Aparece en reportes de ingresos
```

---

## 5. Estructura de Rutas (Next.js App Router)

```
/login                              ← página pública, única sin auth

/dashboard                          ← página principal post-login

/clientes                           ← listado con buscador
/clientes/nuevo                     ← crear cliente
/clientes/[id]                      ← detalle y editar

/catalogo                           ← listado + admin CRUD

/presupuestos                       ← listado con filtros
/presupuestos/nuevo                 ← crear (con selector cliente + catálogo)
/presupuestos/[id]                  ← detalle, cambiar estado, ver/pdf
/presupuestos/[id]/editar           ← editar (solo si BORRADOR)

/facturacion                        ← listado presupuestos pagados

/reportes                           ← dashboard de reportes
/reportes/ingresos                  ← detalle ingresos
/reportes/pendientes                ← detalle pendientes
/reportes/sin-respuesta             ← detalle sin respuesta

/configuracion                      ← empresa + defaults (admin)
/usuarios                           ← solo admin: CRUD ejecutivos
```

---

## 6. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Base de datos | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Autenticación | NextAuth.js v5 (credentials: CI + password) |
| UI | Tailwind CSS + shadcn/ui |
| Tema | dark/light mode (next-themes) |
| PDF | @react-pdf/renderer |
| Gráficos | recharts |
| Hosting | Vercel (plan Hobby) |

---

## 7. Árbol de Componentes (aproximado)

```
<RootLayout>
  <ThemeProvider>            ← modo oscuro/claro, persistido
    <AuthProvider>           ← sesión NextAuth
      {children}
    </AuthProvider>
  </ThemeProvider>
</RootLayout>

<DashboardLayout>             ← con sidebar + header
  <Sidebar />                ← navegación según rol
  <Header>
    <DarkModeToggle />
    <UserMenu />             ← nombre, rol, cerrar sesión
  </Header>
  {children}
</DashboardLayout>

<ClientList>
  <SearchBar />
  <ClientTable />
  <ClientForm />             ← modal o página
</ClientList>

<CatalogList>
  <CategoryFilter />
  <CatalogTable />
  <CatalogForm />            ← solo admin
</CatalogList>

<BudgetEditor>
  <ClientSelector />         ← busca o crea cliente inline
  <BudgetForm>
    <SectionBlock>
      <ItemRow>
        <CatalogPicker />    ← modal selección desde catálogo
      </ItemRow>
    </SectionBlock>
  </BudgetForm>
  <A4Preview />              ← preview en vivo (mismo diseño actual)
  <PDFDownload />            ← botón descarga PDF
  <StatusWorkflow />         ← botones: enviar, aceptar, rechazar, pagar
  <PaymentForm />            ← al marcar pagado: n° factura externa + medio pago
</BudgetEditor>

<InvoiceList>
  <FilterBar />
  <InvoiceTable />
</InvoiceList>

<ReportsDashboard>
  <IncomeChart />
  <PendingTable />
  <NoResponseTable />
</ReportsDashboard>

<ConfigForm>
  <CompanySection />
  <DefaultsSection />
  <UserManagementSection />  ← solo admin
</ConfigForm>
```

---

## 8. Plan de Implementación

| Fase | Contenido |
|------|-----------|
| **1. Fundación** | Next.js + Prisma + Neon DB + schema completo + migrations + auth con CI + layout (sidebar, header, dark/light toggle) + migrar imágenes a `public/img/` |
| **2. Clientes** | CRUD compartido con buscador, tipo empresa/persona |
| **3. Catálogo** | Admin CRUD de categorías e ítems, ejecutivos solo lectura |
| **4. Presupuestos** | Editor, preview A4, PDF, workflow estados, numeración `PRE-AÑO-NNNNNN` |
| **5. Facturación** | Lista pagados, campo n° factura externa, medio pago, edición, export CSV |
| **6. Reportes** | Ingresos, pendientes, sin respuesta, gráficos |
| **7. Configuración** | Datos empresa + defaults + gestión usuarios (alta/baja ejecutivos) |
| **8. Deploy** | Vercel + Neon, migrar datos desde localStorage, update README y AGENTS.md |
