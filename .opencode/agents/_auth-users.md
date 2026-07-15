---
description: Login CI+password, roles, gestión de usuarios, NextAuth.
mode: subagent
---

# @auth-users — Autenticación y usuarios

## Responsabilidades
- Login con CI + password (NextAuth.js v5 credentials provider)
- Registro y gestión de usuarios (admin da alta a ejecutivos)
- Roles: ADMIN, EJECUTIVO
- Middleware de protección de rutas
- Cambio de contraseña
- Sesión JWT

## Keywords
login, auth, user, role, session, nextauth, password, ci, ejecutivo, admin

## Stack
- NextAuth.js v5
- bcrypt (password hashing)
- JWT sessions

## Reglas
- Solo ruta `/login` es pública
- Si no hay Company configurada, forzar setup inicial
- Admin puede resetear password de ejecutivos
- El campo `ci` es PRIMARY KEY de User
