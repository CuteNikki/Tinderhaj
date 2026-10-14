import { createServer } from 'node:http';
import { createServer as createSmtpServer } from 'node:net';

import { clearTestAccounts, prisma } from './db';
import { MAIL_PORT, SMTP_PORT } from './env';

type Email = { to: string[]; subject: string };

/**
 * Clears away accounts a stopped run left behind, and stands in for our mail
 * server: the server sends its emails here, and tests read them back from
 * GET /emails.
 */
export default async function globalSetup() {
  await clearTestAccounts();

  const emails: Email[] = [];
  const reader = createServer((req, res) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(emails));
  });
  const smtp = smtpServer(emails);
  await Promise.all([
    new Promise<void>((resolve) => reader.listen(MAIL_PORT, '127.0.0.1', resolve)),
    new Promise<void>((resolve) => smtp.listen(SMTP_PORT, '127.0.0.1', resolve)),
  ]);

  return async () => {
    reader.close();
    smtp.close();
    await clearTestAccounts();
    await prisma.$disconnect();
  };
}

/** Just enough SMTP to take every email, keeping who it's to and its subject. */
function smtpServer(emails: Email[]) {
  return createSmtpServer((socket) => {
    let buffer = '';
    let to: string[] = [];
    // The lines of the email being sent, while it's being sent
    let message: string[] | null = null;

    socket.write('220 e2e\r\n');
    socket.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split('\r\n');
      buffer = lines.pop()!;

      for (const line of lines) {
        if (message) {
          if (line !== '.') {
            message.push(line);
            continue;
          }
          const subject = message.find((header) => header.startsWith('Subject: '))?.slice('Subject: '.length) ?? '';
          emails.push({ to, subject });
          message = null;
          socket.write('250 OK\r\n');
          continue;
        }

        const command = line.slice(0, 4).toUpperCase();
        if (command === 'MAIL') to = [];
        if (command === 'RCPT') to.push(/<(.*)>/.exec(line)?.[1] ?? '');
        if (command === 'DATA') {
          message = [];
          socket.write('354 Go ahead\r\n');
        } else if (command === 'QUIT') {
          socket.end('221 Bye\r\n');
        } else {
          socket.write('250 OK\r\n');
        }
      }
    });
  });
}
