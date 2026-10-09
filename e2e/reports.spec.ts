import { createUser, prisma } from './db';
import { expect, signIn, test } from './test';

test('a reported shark reaches the moderators, who deal with it', async ({ page }) => {
  const owner = await createUser({ sharks: ['Bubbles'] });
  const reporter = await createUser({ sharks: ['Finn'] });
  // Each run's own, as every moderator sees every report.
  const contact = `Discord: ${owner.username}`;
  const details = `It’s a dolphin, says ${reporter.username}.`;
  await prisma.user.update({ where: { id: owner.id }, data: { matchContact: contact } });
  const moderator = await createUser();
  await prisma.user.update({ where: { id: moderator.id }, data: { role: 'MODERATOR' } });

  // Finn and Bubbles are a match, so Finn's owner sees how to reach Bubbles' owner.
  const [bubbles, finn] = await Promise.all([owner.id, reporter.id].map((userId) => prisma.profile.findFirstOrThrow({ where: { userId } })));
  await prisma.heart.createMany({
    data: [
      { fromProfileId: bubbles.id, toProfileId: finn.id },
      { fromProfileId: finn.id, toProfileId: bubbles.id },
    ],
  });

  // Reporting Bubbles from its card, then again, which isn't needed.
  await signIn(page, reporter.email);
  for (const time of ['first', 'again']) {
    await page.goto(`/u/${owner.username}`);
    await page.getByRole('button', { name: 'Report Bubbles' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('combobox').click();
    await page.getByRole('option', { name: 'Not a shark plush' }).click();
    await dialog.getByRole('textbox').fill(details);
    await dialog.getByRole('button', { name: 'Report', exact: true }).click();
    await expect(page.getByText(time === 'first' ? 'Thanks for telling us.' : 'You’ve reported this already.')).toBeVisible();
  }

  // Reporting the way to reach Bubbles' owner, from the match.
  await page.goto('/dashboard/hearts?tab=matches');
  await page.getByRole('button', { name: 'Report', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Report how to reach Bubbles’s owner')).toBeVisible();
  await dialog.getByRole('combobox').click();
  await page.getByRole('option', { name: 'Spam or a scam' }).click();
  await dialog.getByRole('button', { name: 'Report', exact: true }).click();
  await expect(page.getByText('Thanks for telling us.')).toBeVisible();

  // The moderator sees both, with the note as it was, and deals with one.
  await page.context().clearCookies();
  await signIn(page, moderator.email);
  await page.goto('/moderation/reports');
  await expect(page.getByText(details)).toBeVisible();
  await expect(page.getByText(contact)).toBeVisible();
  await page.getByRole('listitem').filter({ hasText: details }).getByRole('button', { name: 'Dealt with' }).click();
  await expect(page.getByText('Marked as dealt with.')).toBeVisible();

  await page.goto('/moderation/reports?tab=handled');
  await expect(page.getByText(`Dealt with by @${moderator.username}`)).toBeVisible();
  const reports = await prisma.report.findMany({ where: { profileId: bubbles.id }, orderBy: { createdAt: 'asc' } });
  expect(reports.map(({ reason, status, contactNote }) => ({ reason, status, contactNote }))).toEqual([
    { reason: 'NOT_A_SHARK', status: 'RESOLVED', contactNote: null },
    { reason: 'SPAM', status: 'OPEN', contactNote: contact },
  ]);
});
