# Despliegue

## 1. Preparar la hoja de Google

1. Crea una hoja de cálculo en Google Sheets con una pestaña llamada `Invitados`.
2. En la fila 1 escribe las cabeceras (ver el [modelo de datos](ARCHITECTURE.md#modelo-de-datos)):
   `ID | Token | Nombre | Saludo | Máx. asistentes | Estado | Confirmados | Nombres asistentes | Teléfono | Comentarios | Fecha confirmación | Enlace`
3. Rellena desde la fila 2 las columnas A, C, D y E. Deja el resto vacío.
4. Copia el ID de la hoja de la URL: `https://docs.google.com/spreadsheets/d/<ID>/edit`.

## 2. Crear la service account

1. Entra en [Google Cloud Console](https://console.cloud.google.com/) y crea un proyecto (p. ej. `boda-invitaciones`).
2. **APIs y servicios → Biblioteca →** habilita **Google Sheets API**.
3. **IAM y administración → Cuentas de servicio → Crear cuenta de servicio.** No necesita roles a nivel de proyecto.
4. En la cuenta creada: **Claves → Agregar clave → JSON**. Se descarga un archivo con `client_email` y `private_key`.
5. Vuelve a la hoja → **Compartir** → añade el `client_email` como **Editor**. Es el único acceso que tendrá la app.
6. Guarda el JSON en un gestor de contraseñas y bórralo de *Descargas*. Nunca lo subas al repositorio.

## 3. Desarrollo local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local      # rellena con los datos del JSON y de la hoja
npm run tokens                  # genera tokens y enlaces en la hoja
npm run dev                     # http://localhost:3000/invite/<token>
```

`GOOGLE_PRIVATE_KEY` debe ir entre comillas y con los saltos de línea como `\n`, tal como aparece en el JSON.

Para probar enlaces en local, usa temporalmente `PUBLIC_BASE_URL=http://localhost:3000` y vuelve a ejecutar `npm run tokens` con la URL de producción antes de enviar las invitaciones (los tokens no cambian; solo se reescriben los enlaces).

## 4. Personalizar el contenido

- Textos, fechas, lugares, itinerario, cuentas, etc.: `src/config/event.ts`.
- Fotos: reemplaza `public/images/hero.svg` y `quote.svg` por JPG/WebP (≥ 1600 px de alto para el hero) y actualiza `event.images`.
- Música: `public/audio/song.mp3`.
- Colores y fuentes: `src/app/globals.css` (`@theme`) y `src/app/layout.tsx`.

## 5. Desplegar en Vercel

1. Sube el repositorio a GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repositorio (Vercel detecta Next.js automáticamente).
3. En **Settings → Environment Variables** añade, para *Production* (y *Preview* si lo usas):
   `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB`.
   Pega la clave privada tal cual (con los `\n`); el código los convierte.
4. **Deploy.**
5. Opcional: **Settings → Domains** para usar un dominio propio (p. ej. `nuestraboda.com`).
6. En local, con `PUBLIC_BASE_URL` apuntando al dominio final, ejecuta `npm run tokens` para escribir los enlaces definitivos en la hoja.
7. Envía los enlaces de la columna L.

## 6. Checklist antes de enviar invitaciones

- [ ] `npm run build` sin errores.
- [ ] Un enlace real abre la invitación con el nombre correcto; un token modificado da 404.
- [ ] Confirmar con un invitado de prueba actualiza su fila (F:K) en la hoja.
- [ ] `rsvpDeadline` y `date` tienen la zona horaria correcta.
- [ ] Fotos y canción finales cargadas; Lighthouse móvil ≥ 90.
- [ ] Borrar filas de prueba (o revocar sus tokens).

## Alternativas

Cualquier plataforma que ejecute Next.js con runtime Node funciona (Netlify, Render, Railway, un contenedor Docker con `next start`). Lo único imprescindible es definir las variables de entorno.
