import { createUser, prisma } from './db';
import { expect, hydrated, signIn, test } from './test';

test('a new profile starts as a draft and can be sent for review', async ({ page }) => {
  const user = await createUser();
  await signIn(page, user.email);

  await page.goto('/dashboard/profiles/new');
  await hydrated(page.getByLabel('Display name'));
  await page.getByLabel('Display name').fill('Bubbles');
  await page.getByLabel('Pronouns').fill('they/them');
  await page.getByRole('button', { name: 'Create profile' }).click();

  await expect(page).toHaveURL('/dashboard/profiles');
  await expect(page.getByText('Bubbles', { exact: true })).toBeVisible();
  await expect(page.getByText('Draft', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText('Submitted for review!')).toBeVisible();
  await expect(page.getByText('Pending Review', { exact: true })).toBeVisible();

  const profile = await prisma.profile.findFirstOrThrow({ where: { userId: user.id } });
  expect(profile).toMatchObject({ displayName: 'Bubbles', pronouns: 'they/them', status: 'PENDING' });
});
