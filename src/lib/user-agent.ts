/** Turns a user agent into something like "Firefox on Windows". */
export function describeUserAgent(userAgent: string | null | undefined) {
  if (!userAgent) return 'Unknown device';

  const browser =
    [
      ['Edg/', 'Edge'],
      ['OPR/', 'Opera'],
      ['Firefox/', 'Firefox'],
      ['Chrome/', 'Chrome'],
      ['Safari/', 'Safari'],
    ].find(([token]) => userAgent.includes(token))?.[1] ?? 'Browser';

  const os =
    [
      ['iPhone', 'iPhone'],
      ['iPad', 'iPad'],
      ['Android', 'Android'],
      ['Windows', 'Windows'],
      ['Mac OS', 'macOS'],
      ['Linux', 'Linux'],
    ].find(([token]) => userAgent.includes(token))?.[1] ?? null;

  return os ? `${browser} on ${os}` : browser;
}
