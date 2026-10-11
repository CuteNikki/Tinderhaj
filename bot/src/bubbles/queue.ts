/**
 * Runs work one at a time per key, in the order it came in, so two things
 * happening to the same bubble (someone leaving while the owner locks it), or
 * someone hopping in and out of the join-to-create channel, never interleave.
 */
const tails = new Map<string, Promise<unknown>>();

export function queued<T>(key: string, work: () => Promise<T>): Promise<T> {
  const previous = tails.get(key) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(work);
  tails.set(key, next);
  // Forget the key once nothing else is waiting on it.
  next
    .finally(() => {
      if (tails.get(key) === next) tails.delete(key);
    })
    .catch(() => undefined);
  return next;
}
