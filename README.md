# Sebas Freelance — Sitio Web Profesional

Sitio web profesional para Johan Sebastián Barrera Bustos. Incluye landing page pública con formulario de contacto y panel de administración privado para gestionar solicitudes y servicios.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth + RLS) · Vercel

---

## Requisitos previos

- **Node.js 20+** — [descargar](https://nodejs.org/)
- **Cuenta Supabase gratuita** — [crear cuenta](https://supabase.com/)
- **Cuenta Vercel gratuita** (para despliegue) — [crear cuenta](https://vercel.com/)

---

## Instalación local

```bash
# 1. Clonar el repositorio (o copiar la carpeta)
cd sebas-freelance

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env.local
```

---

## Configurar Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com) y crea un proyecto nuevo.
2. Espera a que se aprovisione (~2 minutos).
3. Ve a **Settings → API** y copia:
   - `Project URL` → será tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → será tu `SUPABASE_SERVICE_ROLE_KEY` (¡nunca la expongas al frontend!)
4. Ve a **SQL Editor → New query**, abre el archivo `supabase/schema.sql`, pega todo el contenido y haz clic en **Run**.

---

## Configurar variables de entorno

Edita `.env.local` y reemplaza los placeholders:

| Variable | Descripción | Dónde obtenerla |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (solo backend) | Supabase → Settings → API → service_role |
| `NEXT_PUBLIC_OWNER_EMAIL` | Correo del administrador | El correo con el que crearás el usuario admin |
| `NEXT_PUBLIC_APP_URL` | URL base de la app | `http://localhost:3000` (local) o tu dominio Vercel |

---

## Crear el usuario administrador

1. En Supabase, ve a **Authentication → Users → Add user**.
2. Escribe el mismo correo que pusiste en `NEXT_PUBLIC_OWNER_EMAIL`.
3. Escribe una contraseña segura.
4. Marca "Auto confirm email" para evitar verificación.
5. Haz clic en **Create user**.

---

## Correr localmente

```bash
npm run dev
```

- **Sitio público:** [http://localhost:3000](http://localhost:3000)
- **Panel admin:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Acceder al panel admin

1. Ve a [http://localhost:3000/admin](http://localhost:3000/admin).
2. Ingresa el correo y contraseña del usuario que creaste en Supabase.
3. Solo el correo configurado en `NEXT_PUBLIC_OWNER_EMAIL` tiene acceso.

---

## Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. Ve a [https://vercel.com/new](https://vercel.com/new) y conecta el repositorio.
3. En **Environment Variables**, agrega las mismas 5 variables de `.env.local`.
   - Cambia `NEXT_PUBLIC_APP_URL` por tu dominio Vercel (ej: `https://tu-proyecto.vercel.app`).
4. Haz clic en **Deploy**.

---

## Personalizar el footer

En `src/app/page.tsx`, busca la sección `Footer` al final del archivo y cambia:

- El correo de contacto (`mailto:...`)
- El enlace de LinkedIn (`https://www.linkedin.com/in/tu-perfil`)

---

## Estructura del proyecto

```
sebas-freelance/
├── supabase/
│   └── schema.sql              # Tablas, RLS, datos iniciales
├── src/
│   ├── actions/
│   │   ├── contact.ts          # Server Action: formulario público
│   │   ├── requests.ts         # Server Actions: gestión de solicitudes (admin)
│   │   └── services.ts         # Server Actions: gestión de servicios (admin)
│   ├── app/
│   │   ├── layout.tsx          # Layout raíz (fuente Inter, SEO)
│   │   ├── page.tsx            # Landing page pública
│   │   ├── admin/
│   │   │   ├── page.tsx        # Login del admin
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx    # Dashboard con estadísticas
│   │   │   ├── requests/
│   │   │   │   └── page.tsx    # Tabla de solicitudes
│   │   │   └── services/
│   │   │       └── page.tsx    # CRUD de servicios
│   │   └── unauthorized/
│   │       └── page.tsx        # Página de acceso denegado
│   ├── components/
│   │   ├── public/
│   │   │   └── ContactForm.tsx # Formulario de contacto con validación
│   │   └── admin/
│   │       └── AdminNav.tsx    # Barra de navegación del admin
│   ├── lib/
│   │   ├── utils.ts            # Helpers: cn(), formatCOP()
│   │   ├── supabase/
│   │   │   ├── client.ts       # Cliente Supabase (browser)
│   │   │   ├── server.ts       # Cliente Supabase (server components)
│   │   │   └── admin.ts        # Cliente con service_role (solo backend)
│   │   └── validations/
│   │       ├── contact.ts      # Schema Zod: formulario de contacto
│   │       ├── service.ts      # Schema Zod: servicios
│   │       └── admin.ts        # Schema Zod: actualizaciones admin
│   └── proxy.ts                # Protección de rutas /admin/* (proxy en Next.js 16)
├── .env.local                  # Variables de entorno (NO subir a git)
├── .env.example                # Plantilla de variables (SÍ subir a git)
├── next.config.ts              # Config de Next.js
├── vercel.json                 # Config de despliegue Vercel
└── README.md                   # Este archivo
```
