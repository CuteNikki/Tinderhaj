# Tinderhaj

Tinderhaj is a Next.js dating/profile platform built around profile discovery, account management, moderation, and verified user onboarding. The app includes sign-up and authentication flows, password reset emails, profile creation and review, and a discovery experience that surfaces verified profiles to users.

## Overview

This project combines:

- Next.js App Router for the web app and server actions
- Prisma + PostgreSQL for persistence
- UploadThing for image uploads
- Resend for transactional email
- Tailwind CSS and shadcn/ui-inspired components for the UI
- Zod validation for server-side input safety

The product flow is centered on creating a personal profile, submitting it for review, and then discovering other approved profiles.

## Features

- User registration and sign-in
- Secure session handling with HTTP-only cookies
- Password reset flow with email delivery
- Profile creation, editing, and deletion
- Avatar and banner uploads
- Profile moderation states: created, pending, rejected, and verified
- Discovery feed for verified profiles
- Account settings and username updates
- Moderator verification tools

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
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
NEXT_PUBLIC_APP_URL="http://localhost:3000"
UPLOADTHING_TOKEN="your_uploadthing_token"
```

Notes:

- `DATABASE_URL` is required for Prisma and the app database connection.
- `NEXT_PUBLIC_APP_URL` is used for password reset links.
- UploadThing variables are required for avatar/banner uploads to work.

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

The app stores session identifiers in an HTTP-only cookie and stores a matching session record in PostgreSQL. Authentication and user session logic live under `src/lib/session.ts`, with server actions in `src/lib/actions.ts`.

Password reset links are generated with a hashed token and emailed through Resend.

## Profile and Moderation Model

The Prisma schema defines the core models:

- `Account`: user account, credentials, roles, sessions
- `Session`: active authenticated sessions
- `PasswordResetToken`: reset token lifecycle management
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
- `NEXT_PUBLIC_APP_URL`
- UploadThing credentials

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run linting and build checks.
4. Submit a pull request with a short summary of the changes.

## License

This project does not currently declare a license. If you plan to publish or distribute it, add an explicit license before doing so.
