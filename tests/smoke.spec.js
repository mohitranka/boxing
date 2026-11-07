import { expect, test } from '@playwright/test';

const boot = async (page) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('body')).not.toHaveClass(/booting/, { timeout: 20000 });
  return errors;
};

test('boot screen offers both modes', async ({ page }) => {
  const errors = await boot(page);
  await expect(page.locator('#boot-title')).toHaveText('Lantern Barge');
  for (const id of ['btn-camera', 'btn-keyboard', 'btn-train-camera', 'btn-train-keyboard']) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('keyboard mode starts a match', async ({ page }) => {
  const errors = await boot(page);
  await page.locator('#btn-keyboard').click();
  await expect(page.locator('#boot')).toBeHidden();
  await expect(page.locator('body')).not.toHaveClass(/phase-boot/);
  await expect(page.locator('#gl')).toBeVisible();
  expect(errors).toEqual([]);
});

test('training mode opens its HUD', async ({ page }) => {
  const errors = await boot(page);
  await page.locator('#btn-train-keyboard').click();
  await expect(page.locator('body')).toHaveClass(/phase-training/);
  await expect(page.locator('#boot')).toBeHidden();
  expect(errors).toEqual([]);
});
