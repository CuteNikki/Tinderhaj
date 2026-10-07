import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

/**
 * Passwords are kept as `salt:hash`, both hex. The scrypt settings are the
 * ones Tinderhaj always used, so passwords from before Better Auth still work.
 */
function scryptHex(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) return reject(err);

      resolve(hash.toString('hex'));
    });
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');

  return `${salt}:${await scryptHex(password, salt)}`;
}

export async function verifyPassword({ hash, password }: { hash: string; password: string }) {
  const [salt, expected] = hash.split(':');

  if (!salt || !expected) return false;

  const actual = Buffer.from(await scryptHex(password, salt), 'hex');
  const stored = Buffer.from(expected, 'hex');

  return actual.length === stored.length && timingSafeEqual(actual, stored);
}
