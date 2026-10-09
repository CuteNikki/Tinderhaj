import { test as base, expect, type Locator, type Page } from '@playwright/test';

import { PASSWORD } from './db';

export { expect };

let count = 0;

export const test = base.extend({
  // Better Auth allows 3 sign-ins from an address in 10 seconds. As if behind
  // a proxy, each test comes from an address of its own, so tests running at
  // the same time don't share the limit.
  extraHTTPHeaders: async ({}, use, testInfo) => {
    await use({ 'x-forwarded-for': `10.${testInfo.parallelIndex % 256}.${testInfo.retry % 256}.${++count % 256}` });
  },
});

/**
 * Waits for React to take over a field from the server's HTML. Typed into
 * before then, it goes back to empty when React does.
 */
export async function hydrated(field: Locator) {
  await expect.poll(() => field.evaluate((element) => Object.keys(element).some((key) => key.startsWith('__reactProps')))).toBe(true);
}

export async function signIn(page: Page, email: string) {
  await page.goto('/sign-in');
  await hydrated(page.getByLabel('Email', { exact: true }));
  await page.getByLabel('Email', { exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  await expect(page).toHaveURL('/dashboard/profiles');
}
