import { z } from 'zod';

import {
  MAX_BIO_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_INTEREST_LENGTH,
  MAX_PASSWORD_LENGTH,
  MAX_SIZE,
  MAX_USERNAME_LENGTH,
  MIN_DISPLAY_NAME_LENGTH,
  MIN_EMAIL_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_PRONOUNS_LENGTH,
  MIN_SIZE,
  MIN_USERNAME_LENGTH,
} from '@/constants/auth';

export const signInSchema = z.object({
  email: z
    .string()
    .email(`Email is invalid!`)
    .min(MIN_EMAIL_LENGTH, `Email must be at least ${MIN_EMAIL_LENGTH} characters.`)
    .max(MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters.`),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`),
});

export const signUpSchema = z.object({
  username: z
    .string()
    .nonempty(`Username is required!`)
    .regex(/^[a-z0-9_]+$/, `Username can only contain lowercase letters, numbers, and underscores.`)
    .min(MIN_USERNAME_LENGTH, `Username must be at least ${MIN_USERNAME_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Username must be at most ${MAX_USERNAME_LENGTH} characters.`),
  email: z
    .string()
    .nonempty(`Email is required!`)
    .email(`Email is invalid!`)
    .min(MIN_EMAIL_LENGTH, `Email must be at least ${MIN_EMAIL_LENGTH} characters.`)
    .max(MAX_EMAIL_LENGTH, `Email must be at most ${MAX_EMAIL_LENGTH} characters.`),
  password: z
    .string()
    .nonempty(`Password is required!`)
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`),
});

export const sessionSchema = z.object({
  accountId: z.string(),
  sessionId: z.string(),
});

export const sessionWithAccountSchema = sessionSchema.extend({
  Account: z.object({
    id: z.string(),
    email: z.string().email(),
    username: z.string(),
    canVerify: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  }),
});

export const createProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .nonempty('Display Name is required!')
    .min(MIN_DISPLAY_NAME_LENGTH, `Display Name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Display Name must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  birthday: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const input = new Date(date);
      input.setHours(0, 0, 0, 0);
      return input <= today;
    },
    { message: 'Birthday must be in the past or today.' },
  ),
  size: z.number().min(MIN_SIZE, 'Size must be at least 1cm.').max(MAX_SIZE, `I don't think your shark is ${MAX_SIZE}cm long...`),
  pronouns: z
    .string()
    .trim()
    .nonempty('Pronouns are required!')
    .min(MIN_PRONOUNS_LENGTH, `Pronouns must be at least ${MIN_PRONOUNS_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Pronouns must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  location: z
    .string()
    .trim()
    .nonempty('Location is required!')
    .min(MIN_PRONOUNS_LENGTH, `Location must be at least ${MIN_PRONOUNS_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Location must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  bio: z
    .string()
    .trim()
    .nonempty('Bio is required!')
    .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
});

export const updateProfileSchema = z.object({
  id: z.string(),
  isVerified: z.boolean().optional(),
  displayName: z
    .string()
    .trim()
    .nonempty('Display Name is required!')
    .min(MIN_DISPLAY_NAME_LENGTH, `Display Name must be at least ${MIN_DISPLAY_NAME_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Display Name must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  avatarUrl: z.string().trim().url().max(2000, 'Avatar URL must be at most 2000 characters.'),
  bannerUrl: z.string().trim().url().max(2000, 'Banner URL must be at most 2000 characters.'),
  birthday: z.date().refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const input = new Date(date);
      input.setHours(0, 0, 0, 0);
      return input <= today;
    },
    { message: 'Birthday must be in the past or today.' },
  ),
  size: z.number().min(MIN_SIZE, 'Size must be at least 1cm.').max(MAX_SIZE, `I don't think your shark is ${MAX_SIZE}cm long...`),
  pronouns: z
    .string()
    .trim()
    .min(MIN_PRONOUNS_LENGTH, `Pronouns must be at least ${MIN_PRONOUNS_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Pronouns must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  location: z
    .string()
    .trim()
    .min(MIN_PRONOUNS_LENGTH, `Location must be at least ${MIN_PRONOUNS_LENGTH} characters.`)
    .max(MAX_USERNAME_LENGTH, `Location must be at most ${MAX_USERNAME_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
  interests: z
    .array(
      z
        .string()
        .trim()
        .max(MAX_INTEREST_LENGTH, `Interest must be at most ${MAX_INTEREST_LENGTH} characters.`)
        .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
    )
    .max(3, 'You can only have up to 3 interests.'),
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, `Bio must be at most ${MAX_BIO_LENGTH} characters.`)
    .transform((val) => val.replace(/\n{2,}/g, '\n').replace(/[ \t]{2,}/g, ' ')),
});

/**
 * Transform will remove any extra new lines and spaces from the input.
 *
 * a\n\n\n\n\n\na => a\na
 * a\n\na\n\na => a\na\na
 * a            a => a a
 */
