# Seguridad y escalabilidad

## Estrategia de URL segura

**Objetivo:** que nadie pueda ver la invitación de otro invitado modificando la URL, y que la URL no revele información del invitado.

### Por qué un token opaco aleatorio

| Opción | Problema |
|---|---|
| `/invite?name=Juan` o `/invite/123` | Legible y enumerable: basta con cambiar el número. |
| Base64 del ID (`eyJpZCI6IjEyMyJ9`) | Codificar no es cifrar: se decodifica y se modifica trivialmente. |
| JWT / ID firmado con HMAC | Seguro contra manipulación, pero el payload es legible, revocar un enlace obliga a rotar el secreto (invalida **todos** los enlaces) y si el secreto se filtra se pueden forjar enlaces. |
| **Token aleatorio de 128 bits guardado en la hoja** ✅ | No contiene datos, no se puede derivar ni forjar, se revoca por invitado y no hay secreto que filtrar. |

Con 128 bits de entropía, adivinar un token válido entre 300 invitados requiere del orden de 10³⁶ intentos: inviable incluso sin limitación de tráfico.

### Implementación

- **Generación** (`src/lib/token.ts`): `crypto.randomBytes(16).toString("base64url")` → 22 caracteres URL-safe.
- **Validación** (`src/lib/guests.ts`):
  1. Expresión regular `^[A-Za-z0-9_-]{22}$` antes de tocar Google Sheets (rechazo barato de basura).
  2. Búsqueda en la columna de tokens con `crypto.timingSafeEqual`.
  3. Token mal formado o inexistente → **la misma** página 404 (no se revela si un token existe).
- **Revocación:** `npm run tokens -- --rotate=<ID>` genera un token nuevo para ese invitado; el enlace anterior deja de funcionar al instante.
- **Mínima exposición:** el navegador solo recibe `PublicGuest` (sin ID interno, número de fila ni token de otros).
- **RSVP:** el servidor deriva el invitado del token; nunca acepta del cliente un ID, una fila ni un máximo de asistentes.

## Protecciones adicionales

| Riesgo | Mitigación | Dónde |
|---|---|---|
| Fuga del token vía `Referer` al abrir Google Maps o la mesa de regalos | `Referrer-Policy: no-referrer` + `rel="noreferrer"` | `next.config.ts`, componentes |
| Indexación de invitaciones en buscadores | `robots: noindex` + `X-Robots-Tag` | `layout.tsx`, `next.config.ts` |
| Caché compartida de una invitación | Página `force-dynamic` (Next envía `Cache-Control: private, no-store`) | `invite/[token]/page.tsx` |
| Superar el máximo de asistentes | Selector limitado en UI + validación en servidor con el máximo leído de la hoja | `RsvpForm.tsx`, `api/rsvp/route.ts` |
| Inyección de fórmulas en la hoja | `valueInputOption=RAW` + prefijo `'` en textos que empiezan por `= + - @` | `sheets-client.ts`, `guests.ts` |
| CSRF | Comprobación de `Origin` + `Content-Type: application/json` obligatorio (provoca *preflight* CORS) | `api/rsvp/route.ts` |
| Bots de formularios | Campo *honeypot* oculto | `RsvpForm.tsx`, `api/rsvp/route.ts` |
| Payloads grandes | Límite de 8 KB y longitudes máximas por campo (zod) | `api/rsvp/route.ts`, `rsvp-schema.ts` |
| XSS / clickjacking | React escapa todo el contenido; CSP restrictiva; `X-Frame-Options: DENY`; `frame-ancestors 'none'` | `next.config.ts` |
| Fila movida entre lectura y escritura (alguien ordena la hoja) | Se re-verifica el token en la fila antes de escribir | `guests.ts` |
| Respuestas tras el plazo | Fecha límite comprobada en servidor | `api/rsvp/route.ts` |

### Credenciales

- La clave de la *service account* solo existe en variables de entorno del servidor; `src/lib/guests.ts` importa `server-only`, así que un import accidental desde un componente cliente rompe el build.
- La service account solo tiene acceso a **esa** hoja (compartida como Editor) y ningún rol en el proyecto de GCP.
- Si la clave se filtra: elimínala en GCP (**Cuentas de servicio → Claves**), crea otra y actualiza Vercel. Los enlaces de invitados no cambian.
- `.gitignore` excluye `.env*.local` y `*.service-account.json`.

### Recomendado si el sitio recibe tráfico abusivo

Añadir limitación de tráfico por IP en `/api/rsvp` con [Upstash Ratelimit](https://github.com/upstash/ratelimit-js) (Redis serverless, plan gratuito), p. ej. 10 envíos por minuto por IP. Un limitador en memoria no sirve en serverless porque cada instancia tiene su propia memoria. También se puede activar el *Firewall* de Vercel con reglas de *rate limit* sin tocar código.

## Escalabilidad

- **Volumen esperado:** una boda tiene cientos de invitados y picos de decenas de visitas por minuto el día del envío. Cada visita hace 1 lectura de la hoja; cada RSVP, 2 lecturas + 1 escritura.
- **Cuotas de Google Sheets API:** 300 lecturas/min por proyecto y 60 por usuario (la service account) por minuto. Si se envían todas las invitaciones a la vez y se rozan los límites:
  1. Cachear la lectura completa de la hoja 30–60 s en memoria del servidor (o con `unstable_cache` de Next) para las páginas, manteniendo lectura fresca en el RSVP.
  2. Enviar las invitaciones en tandas.
- **Estáticos:** fuentes, imágenes optimizadas (AVIF/WebP en el tamaño exacto) y JS se sirven desde la CDN de Vercel.
- **Más allá de Sheets:** para miles de invitados o varias bodas, reemplazar `src/lib/sheets-client.ts`/`guests.ts` por una base de datos (Postgres en Supabase/Neon) manteniendo la misma interfaz (`getGuestByToken`, `saveRsvp`); el resto de la app no cambia. Sheets puede seguir como panel de lectura mediante una exportación periódica.
