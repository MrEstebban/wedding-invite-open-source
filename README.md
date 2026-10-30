# wedding-invite-open-source

Invitación digital de boda, mobile-first y personalizada por invitado o familia, con confirmación de asistencia (RSVP) guardada en Google Sheets.

- Sobre con sello de cera dirigido a cada invitado ("Ana María Espinoza · 2 personas").
- Secciones a pantalla completa que aparecen al hacer scroll: portada, cuenta regresiva, cita, padres, ceremonia y recepción, itinerario, mesa de regalos, código de vestimenta, RSVP.
- Enlaces seguros: `/invite/q8Zt3x0bJ4m1Yk9vR2cP7w` (token aleatorio de 128 bits, sin datos del invitado, revocable).
- RSVP con límite de asistentes por invitado, fecha límite y posibilidad de actualizar la respuesta.
- Música de fondo con botón flotante, compatible con móviles.

**Stack:** Next.js (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Google Sheets API · Vercel.

## Inicio rápido

```bash
npm install
cp .env.example .env.local   # credenciales de Google y URL pública
npm run tokens               # genera tokens y enlaces en la hoja
npm run dev
```

Abre el enlace de la columna L de la hoja (o `http://localhost:3000/invite/<token>`).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `npm start` | Build y servidor de producción |
| `npm run lint` / `npm run typecheck` | ESLint y TypeScript |
| `npm run tokens` | Asigna tokens y enlaces a los invitados nuevos |
| `npm run tokens -- --rotate=12,15` | Revoca y regenera los enlaces de los invitados 12 y 15 |

## Personalizar

Todo el contenido está en [`src/config/event.ts`](src/config/event.ts). Fotos en `public/images/`, canción en `public/audio/song.mp3`.

## Documentación

- [Arquitectura, modelo de datos y flujos](docs/ARCHITECTURE.md)
- [Despliegue paso a paso (Google Cloud + Vercel)](docs/DEPLOYMENT.md)
- [Seguridad y escalabilidad](docs/SECURITY.md)

## Licencia

[MPL-2.0](LICENSE)
