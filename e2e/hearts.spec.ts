import { createUser, prisma } from './db';
import { expect, hydrated, signIn, test } from './test';

test('a heart sent back is a match, and shows how to reach each other', async ({ page }) => {
  const alice = await createUser({ sharks: ['Bubbles'], contact: 'Bluesky: https://bsky.app/profile/bubbles.test' });
  const bob = await createUser({ sharks: ['Finn'] });

  // Bubbles hearts Finn, from Bob's page.
  await signIn(page, alice.email);
  await page.goto(`/u/${bob.username}`);
  await page.getByRole('button', { name: 'Send Finn a heart from Bubbles' }).click();
  await expect(page.getByText('Bubbles sent Finn a heart.')).toBeVisible();

  // Bob sees it, but not yet how to reach Alice.
  await page.context().clearCookies();
  await signIn(page, bob.email);
  await page.goto('/dashboard/hearts?tab=received');
  await expect(page.getByText('Hearted your Finn')).toBeVisible();
  await expect(page.getByText('bsky.app')).toHaveCount(0);

  // He hearts back.
  await page.goto(`/u/${alice.username}`);
  await page.getByRole('button', { name: 'Bubbles hearted Finn. Heart back' }).click();
  await expect(page.getByText('It’s a match! Finn and Bubbles hearted each other.')).toBeVisible();

  // The match shows Alice's way to reach her, its link clickable, and asks Bob for his.
  await page.goto('/dashboard/hearts?tab=matches');
  await expect(page.getByText('Matched with your Finn')).toBeVisible();
  await expect(page.getByRole('link', { name: 'https://bsky.app/profile/bubbles.test' })).toHaveAttribute('href', 'https://bsky.app/profile/bubbles.test');
  await expect(page.getByText('Your matches can’t see a way to reach you yet.')).toBeVisible();

  // Bob adds his.
  await page.getByRole('link', { name: 'Add one in Settings' }).click();
  const field = page.getByLabel('How to reach you');
  await hydrated(field);
  await field.fill('Discord: finn_owner');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Your matches can see how to reach you.')).toBeVisible();
  expect(await prisma.user.findUniqueOrThrow({ where: { id: bob.id }, select: { matchContact: true } })).toEqual({ matchContact: 'Discord: finn_owner' });
});
