import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

export function hashPassword(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize(), salt, 64, (err, hash) => {
      if (err) reject(err);

      resolve(hash.toString('hex').normalize());
    });
  });
}

export function generateSalt() {
  return randomBytes(16).toString('hex').normalize();
}

export async function comparePasswords({ hashedPassword, password, salt }: { hashedPassword: string; password: string; salt: string }) {
  const inputHashedPassword = await hashPassword(password, salt);

  return timingSafeEqual(Buffer.from(inputHashedPassword, 'hex'), Buffer.from(hashedPassword, 'hex'));
}
