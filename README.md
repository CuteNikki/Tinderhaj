[![Tinderhaj: The dating site for Blåhaj. A Blåhaj plush shark next to the words “Meet sharks”.](https://tinderhaj.com/opengraph-image)](https://tinderhaj.com)

# Tinderhaj

Tinderhaj is a dating site for IKEA's Blåhaj plush sharks, built with Next.js. Owners create a profile for each of their sharks, a moderator checks it by hand, and once it's verified other sharks can find it in discovery and send it a heart. Two sharks that heart each other are a match.

## Overview

This project combines:

- Next.js App Router for the web app and server actions
- Better Auth for sign-in, sessions, two-step sign-in, and passkeys
- Prisma + PostgreSQL for persistence
- UploadThing for image uploads
- Resend for transactional email
- Tailwind CSS and shadcn/ui-inspired components for the UI
- Zod validation for server-side input safety

The product flow is centered on creating a profile for a shark, submitting it for review, and then discovering and hearting other verified sharks.

## Features

### Sharks and discovery

- Up to 5 shark profiles per account, each with its own avatar, banner, and details, created, edited, and deleted from the dashboard
- Discovery of every verified shark, searchable by name, location, pronouns, or interests, in a fresh shuffle each visit, with newly verified sharks boosted for their first 3 days
- Hearts: each verified shark can heart up to 50 others a day, and two sharks that heart each other are a match
- A Hearts page with matches, hearts received, and hearts sent, and a count of unseen hearts in the navbar
- A public page for every account at `/u/<username>` with all its verified sharks, and a preview picture of them when the link is shared

### Moderation

- Every profile is reviewed before anyone else can see it: created, pending, rejected, or verified
- Rejections name the fields that need fixing and can carry a note from the moderator
- A users page for moderators, with roles: users, moderators, and admins
- Bans for a day, three days, a week, a month, or until lifted, with a reason the banned person sees when they try to sign in. Moderators ban users; admins also ban moderators.
- Admins change roles, sign accounts out everywhere, send password reset links, and delete accounts

### Accounts and sign-in

- User registration and sign-in with [Better Auth](https://www.better-auth.com)
- Email verification, and email changes confirmed from the old address first
- Two-step sign-in with an authenticator app, email codes, or backup codes, and trusted devices
- Passkeys (fingerprint, face, or device PIN)
- Sign-in with Google, Apple, Microsoft, GitHub, Discord, X, Twitch, or Facebook, each turned on by setting its credentials, and connecting or disconnecting them from Account Settings
- A list of active sessions, with signing out other devices
- Password change and password reset flow with email delivery
- Account deletion confirmed by an email link
- Account settings: username, email, password, two-step sign-in, passkeys, sessions

### Pages and the rest

- About, Features, Guide, Community, and Contact pages, and the Guidelines moderators review profiles by
- Privacy policy, Terms, and Imprint
- Open Graph images for sharing, a sitemap, and a robots.txt that keeps private pages out of search engines
- Light and dark themes, following the device or chosen by hand

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
├── generated/          # Prisma client, made by `prisma generate`
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   ├── components/
│   ├── constants/
│   └── lib/
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
npm run dev            # start the Next.js dev server
npm run build          # production build
npm run start          # start the production server
npm run lint           # ESLint checks
npm run lint:classes   # classes Tailwind would write another way, e.g. w-[16px] for w-4
npm run typecheck      # TypeScript, after generating Next's route types
npm run format         # Prettier formatting
npm run format:check   # Prettier, without changing files
```

GitHub Actions runs the four checks and a production build, against a fresh PostgreSQL database, on every push and pull request (`.github/workflows/ci.yml`).

## Authentication and Session Flow

Sign-in runs on Better Auth, configured in `src/lib/auth.ts` and served from `/api/auth/*`. Sessions are kept in PostgreSQL and an HTTP-only cookie; server code reads them with `getSession()` and `requireUser()` from `src/lib/session.ts`, and client components call Better Auth through `authClient` from `src/lib/auth-client.ts`.

Better Auth calls the username `name`. It checks usernames on sign-up and on changes against the same rules as the forms. People who sign up with a provider get a username made from their handle or name there (e.g. `nikki_b`, or `nikki_b_4821` if taken), which they can change in Account Settings.

Signing in with a provider joins an existing account with the same email only when both the provider and Tinderhaj have verified that email. Otherwise the person is asked to sign in another way and connect the provider from Account Settings. Passwords are hashed with scrypt as `salt:hash` (`src/lib/password-hasher.ts`), the same way as before Better Auth, so older accounts keep their passwords.

Emails (verification, email changes, password resets, sign-in codes, and account deletion) are sent through Resend from `src/lib/email.ts`.

## Profile and Moderation Model

The Prisma schema defines the core models:

- `User`: username, email, role, whether two-step sign-in is on, and any ban (reason, expiry, and who gave it)
- `Account`: ways to sign in; holds the password
- `Session`: active sessions, with IP address and browser
- `Verification`: email links and trusted devices
- `TwoFactor`: authenticator app secrets and backup codes
- `Passkey`: passkeys
- `Profile`: a shark's profile content, moderation status, rejection feedback, and submission and verification timestamps
- `Heart`: a heart from one shark to another, and when its receiver saw it. A heart each way is a match.

Roles are `USER`, `MODERATOR`, and `ADMIN`; what each can do is in `src/lib/roles.ts`.

Profile states include:

- `CREATED`
- `PENDING`
- `REJECTED`
- `VERIFIED`

Only verified profiles from accounts that aren't banned show up in discovery, on user pages, and in hearts.

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
3. Run `typecheck`, `lint`, `lint:classes`, and `format:check`, which CI runs too.
4. Submit a pull request with a short summary of the changes.

## License

This project does not currently declare a license. If you plan to publish or distribute it, add an explicit license before doing so.
