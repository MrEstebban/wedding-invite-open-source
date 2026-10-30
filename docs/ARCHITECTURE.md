# Arquitectura

## Visión general

```
 WhatsApp / email                     Vercel (Next.js App Router)                       Google Cloud
┌────────────────┐  GET /invite/<token>  ┌──────────────────────────────────┐  JWT (service   ┌──────────────┐
│ Invitado       │ ────────────────────▶ │ Server Component                 │  account)       │ Google       │
│ (móvil)        │                       │  invite/[token]/page.tsx         │ ──────────────▶ │ Sheets API   │
│                │ ◀──────────────────── │  · valida formato del token      │   values.get    │              │
│                │   HTML personalizado  │  · busca la fila por token       │                 │  Pestaña     │
│                │   (solo PublicGuest)  │  · 404 si no existe              │                 │  "Invitados" │
│                │                       ├──────────────────────────────────┤                 │              │
│                │  POST /api/rsvp       │ Route Handler                    │   values.update │              │
│                │ ────────────────────▶ │  api/rsvp/route.ts               │ ──────────────▶ │              │
│                │ ◀──────────────────── │  · origen, tamaño, honeypot      │   (fila F:K)    │              │
└────────────────┘   200/400/403/404     │  · zod + máximo leído de la hoja │                 └──────────────┘
                                         │  · fecha límite                  │
                                         └──────────────────────────────────┘
```

- **Frontend:** Next.js (App Router) + React 19 + TypeScript + Tailwind CSS v4. Mobile-first.
- **Backend:** Server Components y un Route Handler en runtime Node.js. Sin base de datos propia.
- **Persistencia:** Google Sheets vía REST v4, autenticado con una *service account* (`google-auth-library`).
- **Despliegue:** Vercel (CDN para estáticos, funciones serverless para páginas dinámicas y la API).

### Decisiones clave

| Decisión | Motivo |
|---|---|
| Server Components para la invitación | El navegador nunca recibe la lista de invitados ni credenciales; solo los datos públicos del invitado del enlace. |
| Token opaco aleatorio (no JWT ni ID firmado) | No contiene datos, es inadivinable (128 bits), revocable por invitado y no depende de un secreto que pueda filtrarse. Ver [SECURITY.md](SECURITY.md). |
| REST + `google-auth-library` en lugar del SDK `googleapis` | Solo se usan 3 endpoints; el SDK completo pesa decenas de MB. |
| Todo el contenido en `src/config/event.ts` | Proyecto open source: cualquiera cambia textos, fechas e imágenes sin tocar componentes. |
| Animaciones con `IntersectionObserver` + CSS | Sin dependencias pesadas; respeta `prefers-reduced-motion`. |
| Un único `<audio>` en `MusicProvider` | El estado de la música es global para toda la página; arranca con el gesto de abrir el sobre (requisito de los navegadores móviles). |

## Estructura de carpetas

```
src/
├─ app/
│  ├─ layout.tsx                # fuentes (next/font), metadata noindex, viewport
│  ├─ page.tsx                  # raíz: "usa tu enlace personal"
│  ├─ not-found.tsx             # token inválido o inexistente (misma respuesta)
│  ├─ error.tsx                 # error inesperado (p. ej. Sheets caído)
│  ├─ globals.css               # tema Tailwind, animaciones reveal y sobre
│  ├─ invite/[token]/page.tsx   # invitación personalizada
│  └─ api/rsvp/route.ts         # POST de confirmación
├─ components/
│  ├─ sections/                 # una sección independiente por diseño
│  │  ├─ EnvelopeIntro.tsx      # sobre con sello de cera + nombre del invitado
│  │  ├─ Hero.tsx               # foto de la pareja + nombres
│  │  ├─ Countdown.tsx          # saludo personalizado + fecha + cuenta regresiva
│  │  ├─ Quote.tsx, Parents.tsx, Venues.tsx, Itinerary.tsx
│  │  ├─ Gifts.tsx, DressCode.tsx, NoKids.tsx
│  │  ├─ Rsvp.tsx (servidor) + RsvpForm.tsx (cliente)
│  │  └─ Closing.tsx
│  ├─ ui/                       # Reveal, SectionShell, Photo, Floral, Icons, CopyButton, CountdownTimer, MessageScreen
│  └─ music/                    # MusicProvider (contexto + <audio>), MusicButton (flotante)
├─ config/event.ts              # contenido editable del evento
└─ lib/
   ├─ token.ts                  # generación y validación de tokens
   ├─ guest.ts                  # modelo Guest, columnas de la hoja, mapeo fila → objeto
   ├─ sheets-client.ts          # cliente REST de Google Sheets
   ├─ guests.ts                 # getGuestByToken, saveRsvp (server-only)
   ├─ rsvp-schema.ts            # validación zod compartida cliente/servidor
   └─ dates.ts                  # formato de fechas, fecha límite, timestamp
scripts/generate-tokens.ts      # asigna tokens y enlaces en la hoja
public/images, public/audio     # fotos y canción
```

### Añadir o reemplazar una sección

Cada archivo de `components/sections` es autónomo y lee su contenido de `config/event.ts`. Para añadir una sección nueva (p. ej. "Hospedaje"), crea el componente usando `SectionShell` + `Reveal` y añádelo en el orden deseado dentro de `app/invite/[token]/page.tsx`. Para integrar las imágenes finales del diseño, colócalas en `public/images/` y actualiza las rutas en `event.images` (o úsalas con el componente `Photo`, que genera AVIF/WebP en el tamaño adecuado).

## Modelo de datos

Pestaña `Invitados`, fila 1 = cabeceras (el texto de las cabeceras es libre; lo que importa es el orden de las columnas).

| Col | Campo | Ejemplo | Lo escribe |
|---|---|---|---|
| A | ID único | `12` | novios |
| B | Token | `q8Zt3x0bJ4m1Yk9vR2cP7w` | `npm run tokens` |
| C | Nombre del invitado o familia | `Familia Gómez` | novios |
| D | Saludo (opcional) | `Querida` / `Querido` / `Queridos` (vacío → `Querido(a)`) | novios |
| E | Máximo de asistentes | `4` | novios |
| F | Estado | `Pendiente` / `Confirmado` / `No asistirá` | app |
| G | Asistentes confirmados | `3` | app |
| H | Nombres de los asistentes | `Ana, Luis, Sofía` | app |
| I | Teléfono | `+52 33 1234 5678` | app |
| J | Comentarios | `¡Felicidades!` | app |
| K | Fecha de confirmación | `2026-07-12 18:04:31` (zona del evento) | app |
| L | Enlace personal | `https://.../invite/q8Zt...` | `npm run tokens` |

El orden está definido en `COLUMN_ORDER` (`src/lib/guest.ts`); si cambias columnas, cámbialo ahí.

En código, `Guest` es la fila completa y `PublicGuest` la versión que llega al navegador (sin número de fila, ID ni token).

## Flujo de personalización

1. Los novios añaden invitados (columnas A, C, D, E).
2. `npm run tokens` genera un token aleatorio para cada fila sin token y escribe el enlace personal en la columna L.
3. Los novios envían el enlace por WhatsApp.
4. El invitado abre `/invite/<token>`:
   - Si el token no tiene el formato correcto → 404 sin consultar Sheets.
   - Se lee la hoja y se busca el token (comparación en tiempo constante).
   - Si no existe → la misma página 404.
   - Si existe → se renderiza en el servidor con su nombre en el sobre, el saludo ("Querida Familia Gómez") y el formulario RSVP con sus lugares reservados.

## Flujo RSVP

1. El formulario solo ofrece de 1 al máximo permitido en el selector de asistentes, y valida en el navegador con el mismo esquema zod que el servidor.
2. `POST /api/rsvp` con `{ token, attending, guests, names, phone, message, website }`.
3. El servidor:
   1. Rechaza orígenes externos, cuerpos de más de 8 KB y tipos de contenido distintos de JSON.
   2. Si el honeypot `website` viene relleno, responde 200 sin guardar nada.
   3. Valida el formato del token y la fecha límite (`event.rsvpDeadline`).
   4. Lee al invitado desde la hoja y valida con **el máximo de la hoja**, nunca con datos del cliente.
   5. Comprueba que la fila no se haya movido (si alguien ordenó la hoja, la vuelve a buscar por token).
   6. Escribe `F:K` de esa fila con `valueInputOption=RAW` y la fecha/hora actual.
4. Respuestas: `200` éxito (devuelve el `PublicGuest` actualizado), `400` errores por campo, `403` plazo cerrado u origen no permitido, `404` token desconocido, `500` error con Google.
5. Mientras el plazo esté abierto, el invitado puede volver a su enlace y actualizar la respuesta (el formulario aparece precargado). Al cerrarse el plazo, se muestra su respuesta en modo lectura.
