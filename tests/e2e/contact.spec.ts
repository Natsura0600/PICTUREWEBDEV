import { expect, test } from '@playwright/test';

test.describe('Formulario de contacto', () => {
  test('muestra errores accesibles si faltan datos', async ({ page }) => {
    await page.goto('/contacto');
    await page.waitForTimeout(3200); // el anti-spam descarta envíos instantáneos
    await page.getByRole('button', { name: 'Enviar consulta' }).click();

    await expect(page.getByRole('alert').filter({ hasText: 'Revisá los campos marcados' })).toBeVisible();
    const nombre = page.getByLabel('Nombre y apellido');
    await expect(nombre).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByText('Escribí tu nombre.')).toBeVisible();
  });

  test('envía una consulta válida y conserva lo escrito tras un error', async ({ page }) => {
    await page.goto('/contacto?plan=sistema');
    await expect(page.getByLabel('¿Qué necesitás?')).toHaveValue('Sistema a medida');

    await page.getByLabel('Nombre y apellido').fill('María López');
    await page.getByLabel('Email').fill('maria@');
    await page
      .getByLabel('Contanos tu idea')
      .fill('Necesito turnos online para mi barbería con tres barberos.');
    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: 'Enviar consulta' }).click();

    await expect(page.getByText('Revisá tu email: parece incompleto.')).toBeVisible();
    await expect(page.getByLabel('Nombre y apellido')).toHaveValue('María López');

    await page.getByLabel('Email').fill('maria@barberia.com');
    await page.getByRole('button', { name: 'Enviar consulta' }).click();

    const ok = page.getByTestId('contact-success');
    await expect(ok).toContainText('Recibimos tu consulta.');
    await expect(ok).toContainText('maria@barberia.com');
  });

  test('el honeypot descarta a un bot sin darle pistas', async ({ page }) => {
    await page.goto('/contacto');
    await page.getByLabel('Nombre y apellido').fill('Bot');
    await page.getByLabel('Email').fill('bot@spam.com');
    await page.getByLabel('¿Qué necesitás?').selectOption('Otro');
    await page.getByLabel('Contanos tu idea').fill('Comprá seguidores baratos ahora mismo en nuestra web.');
    await page.locator('#empresa_web').fill('https://spam.example', { force: true });
    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: 'Enviar consulta' }).click();
    await expect(page.getByTestId('contact-success')).toBeVisible();
  });
});

test.describe('Navegación', () => {
  test('cada proyecto tiene su página y un 404 propio para lo que no existe', async ({ page }) => {
    await page.goto('/proyectos');
    const cards = page.getByRole('link', { name: /: ver caso$/ });
    await expect(cards).toHaveCount(5);
    await cards.first().click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    const res = await page.goto('/proyectos/no-existe');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /no existe/ })).toBeVisible();
  });

  test('el panel sigue en /admin y no se indexa', async ({ request }) => {
    const res = await request.get('/admin');
    expect(res.status()).toBe(200);
    expect(res.headers()['x-robots-tag']).toContain('noindex');
    expect(await res.text()).toContain('Panel');
  });
});

test.describe('Menú en celular', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('abre, navega y devuelve el foco', async ({ page }) => {
    await page.goto('/');
    const open = page.getByRole('button', { name: 'Abrir menú' });
    await open.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(open).toBeFocused();

    await open.click();
    await page.getByRole('dialog').getByRole('link', { name: 'Servicios' }).click();
    await expect(page).toHaveURL(/\/servicios$/);
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
