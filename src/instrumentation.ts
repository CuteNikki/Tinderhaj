/**
 * When the server starts: the emails that go out on a schedule (see
 * lib/schedule.ts). Only on Node, the server that runs all the time, and not
 * in the edge runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { startSchedule } = await import('@/lib/schedule');
  startSchedule();
}
