import { createServer } from 'node:http';

import { clearTestAccounts, prisma } from './db';
import { MAIL_PORT } from './env';

/**
 * Clears away accounts a stopped run left behind, and stands in for Resend:
 * the server sends its emails here, and tests read them back from
 * GET /emails.
 */
export default async function globalSetup() {
  await clearTestAccounts();

  const emails: unknown[] = [];
  const server = createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    if (req.method === 'GET') return void res.end(JSON.stringify(emails));

    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      emails.push(JSON.parse(body));
      res.end(JSON.stringify({ id: crypto.randomUUID() }));
    });
  });
  await new Promise<void>((resolve) => server.listen(MAIL_PORT, '127.0.0.1', resolve));

  return async () => {
    server.close();
    await clearTestAccounts();
    await prisma.$disconnect();
  };
}
