# Generador de Presupuestos REFRIFULL

Generador interactivo de presupuestos en formato web local, que exporta a PDF con el formato oficial de REFRIFULL.

---

## Descripción

Esta aplicación permite crear presupuestos de forma rápida y visual, con una vista previa en tiempo real y exportación directa a PDF. El diseño del PDF coincide exactamente con el formato del archivo `ejemplo.docx`.

---

## Características

- **Formulario intuitivo**: Campos para ingresar datos del cliente, título del presupuesto, comentarios, trabajos a realizar, valor sin IVA, IVA (22%) y moneda ($U / U$S)
- **Vista previa en tiempo real**: Los cambios se reflejan instantáneamente en la hoja A4
- **Exportación a PDF**: Botón para imprimir o guardar como PDF
- **Agregar/eliminar trabajos**: Lista dinámica para añadir múltiples trabajos
- **Imágenes personalizadas**: Logo y firma de la empresa incluidas

---

## Estructura del Proyecto

```
MartinSoft/
├── assets/
│   └── img/
│       ├── image.png   # Logo de REFRIFULL
│       └── firma.png   # Firma digital
├── index.html          # Estructura HTML del formulario y vista previa
├── styles.css          # Estilos CSS (pantalla y impresión)
├── app.js              # Lógica JavaScript (interactividad)
└── .gitignore          # Archivos ignorados por Git
```

---

## Cómo Usarlo

### Opción 1: Abrir directamente (sin servidor)
1. Navega a la carpeta del proyecto
2. Haz doble clic en `index.html` para abrirlo en tu navegador

### Opción 2: Servidor local (recomendado)
Usa Python o Node.js para iniciar un servidor:

**Python 3:**
```bash
python3 -m http.server 8000
```

**Node.js (npx serve):**
```bash
npx serve .
```

Luego abre http://localhost:8000 en tu navegador.

---

## Campos del Formulario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| Cliente | Texto | Nombre del cliente o empresa |
| Título del Presupuesto | Texto | Descripción del Equipo evaluado (Ej: Aire Acondicionado ubicado en comedor.) |
| Comentario | Área de texto | Notas sobre la visita o el trabajo |
| Trabajos a Realizar | Lista dinámica | Cada ítem es un paso o trabajo a realizar (usa "+ Agregar Trabajo" para añadir más) |
| Valor sin IVA | Texto | Monto base del presupuesto |
| IVA | Selector | Porcentaje de IVA (22%) |
| Moneda | Selector | Moneda a usar ($U - Pesos Uruguayos / U$S - Dólares) |

---

## Formato del PDF

El PDF generado tiene la siguiente estructura (igual que `ejemplo.docx`):

1. **Encabezado**:
   - Logo de REFRIFULL (izquierda)
   - Datos de la empresa (derecha): Nombre, teléfono, email, fecha
   
2. **Cliente**: Nombre del cliente

3. **Texto introductorio**: "Tenemos el agrado de saludarles..."

4. **Comentario**: "Tras realizar la visita se constató lo siguiente:" + comentario ingresado

5. **Trabajos**: "A continuación se detallarán los pasos a seguir..." + lista de trabajos

6. **Costo**: "Costo de dicha reparación" + monto + IVA

7. **Texto de cierre**: "Sin otro particular, me despido quedando a la orden..."

8. **Firma**: Imagen de la firma (todo el ancho de la hoja)

9. **Pie de página**: Tres columnas (RUT, Celular, Email)

---

## Tecnologías

- **HTML5**: Estructura de la interfaz
- **CSS3**: Estilos visuales y reglas de impresión (`@media print`)
- **JavaScript (Vanilla JS)**: Interactividad y actualización en tiempo real

---

## Notas

- Las imágenes (`assets/img/image.png` y `assets/img/firma.png`) deben estar en la carpeta correcta para que se muestren
- Para editar los datos de la empresa (nombre, teléfono, email, RUT), modifica el archivo `index.html` directamente en las secciones correspondientes
