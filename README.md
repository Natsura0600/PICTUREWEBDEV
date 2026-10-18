# Picture Web Dev

Sitio en Vercel: `public/` (estático) + `api/` (funciones serverless) + `lib/`.

## Contacto
El WhatsApp (+54 11 5249-5689) está en la sección de llamado a la acción y el footer de `public/index.html` (enlace `wa.me/5491152495689`).

## Sección "Proyectos destacados" (public/index.html)
- Las vistas previas son capturas reales generadas en vivo por image.thum.io a partir de la URL de cada sitio.
- Si una captura no carga, la tarjeta muestra automáticamente un panel con el nombre y el dominio (no se rompe el diseño).
- Para usar capturas propias (recomendado): guardalas en `public/img/` (ej. `drop-rugby.jpg`, 1200x750) y cambiá el `src` de la `<img>` correspondiente a `/img/drop-rugby.jpg`.
- Para agregar un proyecto: duplicá un `<article class="card rv">` dentro de `.grid`.
