import pino from 'pino';

const level = process.argv.includes('--debug') ? 'debug' : 'info';

/** Logs to the console, pretty, and to logs/pino.log. Pass --debug for more. */
export const logger = pino(
  { level },
  pino.transport({
    targets: [
      { target: 'pino-pretty', level, options: { colorize: true, ignore: 'pid,hostname', translateTime: 'SYS:yyyy/mm/dd HH:MM:ss' } },
      { target: 'pino/file', level, options: { destination: `${process.cwd()}/logs/pino.log`, mkdir: true } },
    ],
  }),
);

/**
 * Rows of objects as a table, for logging what was loaded.
 *
 * ┌──────┬─────┐
 * │ name │ age │
 * ├──────┼─────┤
 * │ Ada  │ 36  │
 * └──────┴─────┘
 */
export function table<T extends Record<string, unknown>>(data: T[]): string {
  if (!data.length) return '[]';

  // Emojis take two columns in a terminal.
  const width = (text: string) => [...text].reduce((total, char) => total + (/\p{Extended_Pictographic}/u.test(char) ? 2 : 1), 0);
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((header) => `${row[header]}`));
  const widths = headers.map((header, i) => Math.max(width(header), ...rows.map((row) => width(row[i]))));
  const line = (left: string, middle: string, right: string) => left + widths.map((w) => '─'.repeat(w + 2)).join(middle) + right;
  const formatRow = (row: string[]) => '│ ' + row.map((cell, i) => cell + ' '.repeat(widths[i] - width(cell))).join(' │ ') + ' │';

  return [line('┌', '┬', '┐'), formatRow(headers), line('├', '┼', '┤'), ...rows.map(formatRow), line('└', '┴', '┘')].join('\n');
}
