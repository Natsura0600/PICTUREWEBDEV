# Panel de proyectos + formulario de propuestas (Vercel + Cloudflare R2)

Sin Workers y sin D1. Dos páginas y unas funciones chicas:

```
public/index.html   formulario público: el cliente te envía su propuesta
public/admin.html   tu panel privado, en /admin
api/lead.js         POST: recibe propuestas (público) · GET/PATCH/DELETE: las gestionás vos
api/projects.js     tus proyectos (solo admin)
api/auth.js         login con contraseña, cookie firmada
lib/                R2 y autenticación
```

**Cómo se usa el panel** (`/admin`)
El menú de la izquierda explica cada sección, y cada pantalla tiene una línea que cuenta para qué sirve. Además hay una sección **Ayuda** con la guía completa.

- **Hoy:** lo que necesita tu atención, ordenado por urgencia: propuestas sin responder, entregas que vencen en 7 días o ya vencidas, proyectos entregados con saldo por cobrar y dominios u hosting que vencen en 30 días. Arriba, cuatro números (propuestas nuevas, proyectos en curso, falta cobrar, cobrado) y una guía de primeros pasos con el link de tu formulario para copiar.
- **Propuestas:** lo que te envían los clientes. Cada estado (Nueva, Contactada, Cotizada, Aceptada, Descartada) se explica, y al abrir una propuesta el panel te sugiere qué hacer ahora. Botones para responder por mail o WhatsApp, notas internas y **Convertir en proyecto**.
- **Proyectos:** una fila por proyecto con su fase, lo que viene ("Sigue: ..."), lo cobrado y la fecha de entrega; los que se entregan antes van arriba. Tiene buscador y filtros En curso / Entregados / Todos.
- **Página de cada proyecto:** fases en un recorrido de 5 pasos (Relevamiento, Diseño, Desarrollo, Revisión del cliente, Entregado) con un botón para pasar a la siguiente; tareas con la próxima destacada; **cobros** (registrás cada pago y el saldo se calcula solo); **bitácora** donde anotás lo que pasa (los cambios de fase y los cobros se anotan solos); y los datos del cliente, entrega, dominio y renovación. **No hay botón Guardar**: todo se guarda solo.

## 1. R2 (Cloudflare)
1. **R2 > Create bucket**. Puede quedar **privado**: acá no hay archivos públicos ni hace falta CORS.
2. **Manage API tokens > Create API token** con permiso *Object Read & Write* sobre ese bucket. Guardá Access Key ID y Secret. Tu Account ID está en la barra lateral de R2.

## 2. Vercel
1. Subí esta carpeta a GitHub e importala en Vercel (*Framework Preset: Other*, sin build command).
2. En **Settings > Environment Variables** cargá las de `.env.example`: las cuatro de R2, `ADMIN_PASSWORD` (larga) y `SESSION_SECRET` (32+ caracteres al azar).
3. **Deploy**. Cada vez que cambies variables, hacé *Redeploy*.
4. Entrá a `https://TU-DOMINIO/admin`. El formulario para tus clientes es la página principal (`/`).

## 3. Mail de aviso (opcional)
Creá una cuenta en resend.com, generá una API key y cargá `RESEND_API_KEY` y `NOTIFY_EMAIL`. Para que el aviso salga desde tu dominio, verificá el dominio en Resend y cargá `NOTIFY_FROM`. Sin esto todo funciona igual, solo que no te llega el mail.

## Personalizar
- El nombre "Estudio Norte" está en `public/index.html` y `public/admin.html` (buscalo y reemplazalo).
- Tipos de proyecto y rangos de presupuesto: están en `public/index.html` y en `api/lead.js` (`TIPOS` y `PRES`). Si cambiás uno, cambiá el otro igual.

## Seguridad
- Cada propuesta se guarda como un archivo separado, así que dos clientes enviando a la vez no se pisan.
- Todo lo que no sea enviar el formulario exige tu cookie de sesión (`HttpOnly`, `Secure`, `SameSite=Strict`, dura 7 días). Los intentos fallidos de contraseña se demoran.
- El formulario descarta bots con un campo trampa y un tiempo mínimo. Si recibís spam igual, el siguiente paso es agregar Cloudflare Turnstile.
- El servidor valida y recorta todo lo que recibe. El panel escapa el texto de los clientes antes de mostrarlo.
- `/admin` no se indexa en buscadores.

## Tené en cuenta
- Tus proyectos se guardan en un solo archivo (`projects.json`); está pensado para que lo edites solo vos. Si abrís el panel en dos pestañas y editás en ambas, gana la última que guarda.
- El monto cobrado de cada proyecto siempre es la suma de los cobros que registraste; el servidor lo recalcula al guardar.
- Para probar en tu compu: `npm i -g vercel`, copiá `.env.example` a `.env.local`, completalo y corré `vercel dev`.
