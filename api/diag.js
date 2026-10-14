// DIAGNÓSTICO TEMPORAL. Muestra qué variables de entorno ve el servidor (nunca sus valores).
// Cuando termines de configurar, BORRÁ este archivo del repositorio.
const NEED = ['ADMIN_PASSWORD', 'SESSION_SECRET', 'R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET'];

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const estado = {};
  for (const n of NEED) {
    const v = process.env[n];
    estado[n] = v === undefined ? 'NO EXISTE' : String(v).trim() === '' ? 'existe pero está VACÍA' : `ok (${String(v).trim().length} caracteres)`;
  }
  // nombres parecidos que no coinciden exacto (errores de tipeo, espacios, guiones)
  const parecidas = Object.keys(process.env).filter(
    (k) => /admin|session|r2|passw|secret|bucket/i.test(k) && !NEED.includes(k) && !/^(AWS_|VERCEL|NOW_|LAMBDA|_|TZ)/.test(k)
  );
  res.status(200).json({
    version_del_codigo: 'auth-v2',
    entorno: process.env.VERCEL_ENV || 'desconocido (¿local?)',
    commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || 'no disponible',
    variables: estado,
    nombres_parecidos_que_no_coinciden: parecidas,
  });
}
