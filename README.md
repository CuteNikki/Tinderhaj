# Tinderhaj

Tinderhaj is a Next.js dating/profile platform built around profile discovery, account management, moderation, and verified user onboarding. The app includes sign-up and authentication flows, password reset emails, profile creation and review, and a discovery experience that surfaces verified profiles to users.

## Overview

This project combines:

- Next.js App Router for the web app and server actions
- Better Auth for sign-in, sessions, two-step sign-in, and passkeys
- Prisma + PostgreSQL for persistence
- UploadThing for image uploads
- Resend for transactional email
- Tailwind CSS and shadcn/ui-inspired components for the UI
- Zod validation for server-side input safety

The product flow is centered on creating a personal profile, submitting it for review, and then discovering other approved profiles.

## Features

- User registration and sign-in with [Better Auth](https://www.better-auth.com)
- Email verification, and email changes confirmed from the old address first
- Two-step sign-in with an authenticator app, email codes, or backup codes, and trusted devices
- Passkeys (fingerprint, face, or device PIN)
- Sign-in with Google, Apple, Microsoft, GitHub, Discord, X, Twitch, or Facebook, each turned on by setting its credentials, and connecting or disconnecting them from Account Settings
- A list of active sessions, with signing out other devices
- Password change and password reset flow with email delivery
- Account deletion confirmed by an email link
- Profile creation, editing, and deletion
- Avatar and banner uploads
- Profile moderation states: created, pending, rejected, and verified
- Discovery feed for verified profiles
- Account settings: username, email, password, two-step sign-in, passkeys, sessions
- Moderator verification tools

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Better Auth
- Prisma ORM
- PostgreSQL
- UploadThing
- Resend
- Zod

## Project Structure

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   ├── lib/
│   └── generated/
├── .env
├── next.config.ts
├── package.json
├── tsconfig.json
├── components.json
└── README.md
```

## Prerequisites

Before running the app locally, make sure you have:

- Node.js 20+
- npm, pnpm, bun, or yarn
- PostgreSQL running locally or available remotely
- A Resend API key for password reset emails
- An UploadThing account and configured secrets if you use profile uploads

## Environment Variables

Create a `.env` file in the project root with values similar to:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tinderhaj"
RESEND_API_KEY="your_resend_api_key"
RESEND_FROM_EMAIL="Tinderhaj <no-reply@your-domain.com>"
BETTER_AUTH_SECRET="a random string, e.g. from openssl rand -base64 32"
BETTER_AUTH_URL="http://localhost:3000"
UPLOADTHING_TOKEN="your_uploadthing_token"

# Optional: social sign-in. Each provider shows up once both of its values are set.
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
APPLE_CLIENT_ID=""
APPLE_CLIENT_SECRET=""
APPLE_APP_BUNDLE_IDENTIFIER=""
MICROSOFT_CLIENT_ID=""
MICROSOFT_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
TWITTER_CLIENT_ID=""
TWITTER_CLIENT_SECRET=""
TWITCH_CLIENT_ID=""
TWITCH_CLIENT_SECRET=""
FACEBOOK_CLIENT_ID=""
FACEBOOK_CLIENT_SECRET=""
```

Notes:

- `DATABASE_URL` is required for Prisma and the app database connection.
- `BETTER_AUTH_SECRET` signs session cookies and encrypts two-step sign-in secrets. Keep it the same across deploys, or everyone is signed out and authenticator apps stop working.
- `BETTER_AUTH_URL` is where the site runs, e.g. `https://tinderhaj.com`. Links in emails and sign-in provider callbacks point there, and passkeys only work on its domain. On Vercel it can be left out: production then uses the project's production domain (`VERCEL_PROJECT_PRODUCTION_URL`) and preview deployments their own address. Anywhere else it is required in production, where the server won't start without it; in development it defaults to `http://localhost:3000`.
- UploadThing variables are required for avatar/banner uploads to work.
- Social sign-in providers are optional. Register an app with each provider and set its redirect URL to `<BETTER_AUTH_URL>/api/auth/callback/<provider>`, e.g. `http://localhost:3000/api/auth/callback/github`. The provider ids are `google`, `apple`, `microsoft`, `github`, `discord`, `twitter` (X), `twitch`, and `facebook`.
  - Apple's client secret is a signed JWT you generate from your Apple key, and it expires after at most six months. `APPLE_APP_BUNDLE_IDENTIFIER` is only needed for signing in from an iOS app.
  - X only shares the email address if the app asks for it ("Request email from users" in the X developer portal); without it, signing in with X fails.
  - Microsoft accepts both personal and work or school accounts.

## Installation

```bash
npm install
```

If the project uses Bun for the Prisma generation hook, you can also install with Bun:

```bash
bun install
```

## Database Setup

Generate Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

If you want to seed the database:

```bash
npx tsx prisma/seed.ts
```

## Running the App

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev      # start the Next.js dev server
npm run build    # production build
npm run start    # start the production server
npm run lint     # ESLint checks
npm run format   # Prettier formatting
```

## Authentication and Session Flow

Sign-in runs on Better Auth, configured in `src/lib/auth.ts` and served from `/api/auth/*`. Sessions are kept in PostgreSQL and an HTTP-only cookie; server code reads them with `getSession()` and `requireUser()` from `src/lib/session.ts`, and client components call Better Auth through `authClient` from `src/lib/auth-client.ts`.

Better Auth calls the username `name`. It checks usernames on sign-up and on changes against the same rules as the forms. People who sign up with a provider get a username made from their handle or name there (e.g. `nikki_b`, or `nikki_b_4821` if taken), which they can change in Account Settings.

Signing in with a provider joins an existing account with the same email only when both the provider and Tinderhaj have verified that email. Otherwise the person is asked to sign in another way and connect the provider from Account Settings. Passwords are hashed with scrypt as `salt:hash` (`src/lib/password-hasher.ts`), the same way as before Better Auth, so older accounts keep their passwords.

Emails (verification, email changes, password resets, sign-in codes, and account deletion) are sent through Resend from `src/lib/email.ts`.

## Profile and Moderation Model

The Prisma schema defines the core models:

- `User`: username, email, role, and whether two-step sign-in is on
- `Account`: ways to sign in; holds the password
- `Session`: active sessions, with IP address and browser
- `Verification`: email links and trusted devices
- `TwoFactor`: authenticator app secrets and backup codes
- `Passkey`: passkeys
- `Profile`: user profile content, moderation status, verification timestamps

Profile states include:

- `CREATED`
- `PENDING`
- `REJECTED`
- `VERIFIED`

## Deployment

This app is designed for deployment on modern Node.js hosting platforms such as Vercel. For production, ensure you configure:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` unless Vercel's production domain is the right address
- UploadThing credentials

Better Auth rate limits sign-in, sign-up, and code requests per IP address in production. It reads the address from `x-forwarded-for`, which Vercel sets. Behind a proxy that doesn't, every visitor shares one limit.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run linting and build checks.
4. Submit a pull request with a short summary of the changes.

## License

This project does not currently declare a license. If you plan to publish or distribute it, add an explicit license before doing so.
