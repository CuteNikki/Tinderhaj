import { logger } from 'utility/logger';

/**
 * Asks for a page's shared image the way Discord will, so it's drawn and in
 * the site's CDN by the time Discord asks: Discord gives up on a slow one,
 * drawing it the first time is slow, and a link it gave up on stays without a
 * card for a while. Best effort, like warmSharedImage in the site's
 * src/lib/discord-feed.ts.
 */
export async function warmSharedImage(page: string) {
  try {
    const html = await (await fetch(page, { signal: AbortSignal.timeout(8_000) })).text();
    // Exactly the address in the page, with its query, since that's what the CDN keeps it under.
    const image = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
    if (image) await fetch(image, { signal: AbortSignal.timeout(8_000) }).then((response) => response.arrayBuffer());
  } catch (err) {
    logger.debug({ err, page }, 'Warming shared image failed');
  }
}
