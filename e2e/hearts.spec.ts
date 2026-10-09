import { createUser } from './db';
import { expect, signIn, test } from './test';

test('a heart sent back is a match', async ({ page }) => {
  const alice = await createUser({ sharks: ['Bubbles'] });
  const bob = await createUser({ sharks: ['Finn'] });

  // Bubbles hearts Finn, from Bob's page.
  await signIn(page, alice.email);
  await page.goto(`/u/${bob.username}`);
  await page.getByRole('button', { name: 'Send Finn a heart from Bubbles' }).click();
  await expect(page.getByText('Bubbles sent Finn a heart.')).toBeVisible();

  // Bob sees it, and hearts back.
  await page.context().clearCookies();
  await signIn(page, bob.email);
  await page.goto('/dashboard/hearts?tab=received');
  await expect(page.getByText('Hearted your Finn')).toBeVisible();

  await page.goto(`/u/${alice.username}`);
  await page.getByRole('button', { name: 'Bubbles hearted Finn. Heart back' }).click();
  await expect(page.getByText('It’s a match! Finn and Bubbles hearted each other.')).toBeVisible();

  await page.goto('/dashboard/hearts?tab=matches');
  await expect(page.getByText('Matched with your Finn')).toBeVisible();
});
