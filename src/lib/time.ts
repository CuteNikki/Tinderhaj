const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** e.g. 'just now', '5 minutes ago', 'in 6 days'. */
export function relative(iso: string) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86_400],
    ['hour', 3_600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) {
      return relativeFormat.format(Math.round(seconds / size), unit);
    }
  }
  return 'just now';
}

/** e.g. 'Sep 23, 2:05 PM', with the year only when it isn't this year. */
export function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
