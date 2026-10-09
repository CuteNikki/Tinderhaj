import { newAccount } from './db';
import { MAIL_URL } from './env';
import { expect, hydrated, test } from './test';

test('signing up lands on your profiles and sends a verification email', async ({ page }) => {
  const { username, email } = newAccount();

  await page.goto('/sign-up');
  await hydrated(page.getByLabel('Username', { exact: true }));
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill('e2e-password');
  await page.getByRole('button', { name: 'Sign Up', exact: true }).click();

  await expect(page).toHaveURL('/dashboard/profiles');
  await expect(page.getByText('Account created! Check your inbox to verify your email.')).toBeVisible();

  // Sent without waiting on it, so it can arrive a moment after the page.
  await expect
    .poll(async () => {
      const emails: { to: string | string[]; subject: string }[] = await (await fetch(`${MAIL_URL}/emails`)).json();
      return emails.filter((sent) => [sent.to].flat().includes(email)).map((sent) => sent.subject);
    })
    .toEqual([expect.stringMatching(/verify/i)]);
});
