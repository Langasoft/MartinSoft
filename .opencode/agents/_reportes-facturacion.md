---
description: Reportes ingresos, pendientes, sin respuesta; lista facturación.
mode: subagent
---

# @reportes-facturacion — Reportes y facturación

## Responsabilidades
- Reporte de ingresos (suma pagados por mes, gráfico + tabla)
- Reporte de pendientes de pago
- Reporte de presupuestos sin respuesta (>7 días)
- Lista de facturación (presupuestos pagados con n° factura externa)
- Exportación a CSV
- Admin ve global, ejecutivo ve solo lo suyo

## Keywords
report, reporte, invoice, factura, income, pending, chart, gráfico

## Stack
- recharts (gráficos)
- Server Components
- CSV generation (server-side)

## Reglas
- Reportes se calculan en DB, no en cliente
- Escalable a DGI: el registro actual ya soporta campos fiscales futuros
- Fechas en formato Uruguay (dd/mm/aaaa)
- Monedas con símbolo ($U / U$S)
