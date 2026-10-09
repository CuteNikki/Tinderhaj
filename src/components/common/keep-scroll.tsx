/**
 * On a reload, back to where you were straight away, while the page's loading
 * screen is up, rather than the browser waiting for the page to load (or for
 * it to be tall enough), then gliding there because scrolling is smooth.
 * Runs before anything's drawn. Loading screens mark themselves aria-busy, so it knows when they've gone. Leaves every other way of arriving to the
 * browser and Next, as before.
 */
const SCRIPT = `(() => {
  try {
    const key = 'scroll:' + location.pathname + location.search;
    addEventListener('pagehide', () => sessionStorage.setItem(key, String(scrollY)));
    const y = Number(sessionStorage.getItem(key));
    if (performance.getEntriesByType('navigation')[0]?.type !== 'reload' || !(y > 0)) return;

    const root = document.documentElement;
    history.scrollRestoration = 'manual';
    // Tall enough to be there, even while the loading screen is shorter than the page
    root.style.minHeight = y + innerHeight + 'px';
    root.style.scrollBehavior = 'auto';
    scrollTo(0, y);
    // Once the page itself is in: loaded, and its loading screen (marked aria-busy) gone, which can come a moment after
    const release = (force) => {
      if (!force && document.querySelector('[aria-busy=true]')) return;
      watch.disconnect();
      root.style.minHeight = '';
      root.style.scrollBehavior = '';
      history.scrollRestoration = 'auto';
    };
    const watch = new MutationObserver(() => release());
    addEventListener('load', () => {
      watch.observe(document.body, { childList: true, subtree: true });
      release();
    }, { once: true });
    // Never held for long, whatever happens
    setTimeout(() => release(true), 10000);
  } catch {}
})();`;

export function KeepScroll() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
