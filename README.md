[![Tinderhaj: The dating site for Blåhaj. A Blåhaj plush shark next to the words “Meet sharks”.](https://tinderhaj.com/opengraph-image)](https://tinderhaj.com)

# Tinderhaj

Tinderhaj is a dating site for plush sharks, named after IKEA's Blåhaj and built with Next.js. Owners create a profile for each of their sharks, a moderator checks it by hand, and once it's verified other sharks can find it in discovery and send it a heart. Two sharks that heart each other are a match.

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
- A way to be reached, set in Account Settings, that only the owners of matching sharks see
- A public page for every account at `/u/<username>` with all its verified sharks, and a preview picture of them when the link is shared

### Moderation

- Every profile is reviewed before anyone else can see it: created, pending, rejected, or verified
- Rejections name the fields that need fixing and can carry a note from the moderator
- A users page for moderators, with roles: users, moderators, and admins
- Bans for a day, three days, a week, a month, or until lifted, with a reason the banned person sees when they try to sign in. Moderators ban users; admins also ban moderators.
- Admins change roles, sign accounts out everywhere, send password reset links, and delete accounts
- Reports: signed-in users flag a shark from its card, or a match's way to be reached, with a reason. Moderators see them in a queue and mark them dealt with or dismissed, with a count in the navbar.

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
├── bot/                # The Discord bot, its own package (see Discord Bot)
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

# Optional: roles on the Discord server for what people do on the site. Needs Discord sign-in above.
DISCORD_BOT_TOKEN=""
DISCORD_GUILD_ID=""
DISCORD_ROLE_LINKED=""
DISCORD_ROLE_VERIFIED=""
DISCORD_ROLE_MATCHED=""
DISCORD_ROLE_MODERATOR=""
DISCORD_ROLE_ADMIN=""
# Optional: a channel on the same server where newly verified sharks are posted. Needs DISCORD_BOT_TOKEN.
DISCORD_CHANNEL_NEW_SHARKS=""
# Optional: a channel only moderators see, where sharks waiting for review are posted. Needs DISCORD_BOT_TOKEN.
DISCORD_CHANNEL_REVIEW_QUEUE=""
# Optional: the Discord bot in bot/ (see Discord Bot below).
DISCORD_CHANNEL_JOIN_TO_CREATE=""
DISCORD_CHANNEL_BUBBLE_CONTROLS=""
DISCORD_CHANNEL_LOG=""
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
- Discord roles are optional, and need Discord sign-in. People who connect Discord get roles on the server for what they've done on the site: `Linked` for connecting at all, `Verified Shark Owner` for a verified shark, `Matched` for a match, `Site Moderator` for moderators and admins, and `Site Admin` for admins. They're given and taken back as those change, all of them while an account is banned, and each person can refresh theirs from Account Settings.
  - In the same Discord application as sign-in, add a bot under **Bot** and copy its token into `DISCORD_BOT_TOKEN`. Invite it to the server with the **Manage Roles** permission (OAuth2 → URL Generator, scope `bot`).
  - In the server's role list, drag the bot's role above every role it gives, or Discord refuses to let it give them.
  - With Developer Mode on (Discord settings → Advanced), right-click the server and each role to copy their ids into `DISCORD_GUILD_ID` and the `DISCORD_ROLE_*` variables. A role left empty isn't given.
- The new sharks feed is optional too. When a moderator verifies a shark for the first time, the bot posts its link in the channel whose id is in `DISCORD_CHANNEL_NEW_SHARKS`, and Discord shows it as the shark's card. A shark verified again after its owner edits it isn't posted twice. The bot needs **View Channel**, **Send Messages** and **Embed Links** in that channel.
- The review queue works the same way. When a shark is sent for review, the bot posts it in the channel whose id is in `DISCORD_CHANNEL_REVIEW_QUEUE`, with a button to the verification page. Once a moderator verifies or rejects it, the message is edited to say so and by whom; if the owner takes the shark back to edit it, or deletes it, the message is removed. Keep the channel visible to moderators only. The bot needs the same three permissions there.

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
npm run test:e2e       # Playwright end-to-end tests, see below
```

GitHub Actions runs the four checks, a production build and the end-to-end tests, against a fresh PostgreSQL database, on every push and pull request (`.github/workflows/ci.yml`).

## End-to-End Tests

The Playwright tests in `e2e/` sign up, create a profile and send it for review, and send a heart that becomes a match. They run against a production build in Chromium.

They make accounts, so they need a database of their own in `E2E_DATABASE_URL`, never the one in `.env`. A throwaway one in Docker works:

```bash
docker run -d --rm --name tinderhaj-e2e -e POSTGRES_PASSWORD=postgres -p 55432:5432 postgres:17-alpine
DATABASE_URL=postgresql://postgres:postgres@localhost:55432/postgres npx prisma migrate deploy

npx playwright install chromium
npm run build
E2E_DATABASE_URL=postgresql://postgres:postgres@localhost:55432/postgres npm run test:e2e
```

The server runs on port 3100 and sends its emails to a stand-in for Resend on port 3199, so nothing leaves your machine. Accounts the tests make have `@e2e.test` addresses and are removed when the run ends.

## Authentication and Session Flow

Sign-in runs on Better Auth, configured in `src/lib/auth.ts` and served from `/api/auth/*`. Sessions are kept in PostgreSQL and an HTTP-only cookie; server code reads them with `getSession()` and `requireUser()` from `src/lib/session.ts`, and client components call Better Auth through `authClient` from `src/lib/auth-client.ts`.

Better Auth calls the username `name`. It checks usernames on sign-up and on changes against the same rules as the forms. People who sign up with a provider get a username made from their handle or name there (e.g. `nikki_b`, or `nikki_b_4821` if taken), which they can change in Account Settings.

Signing in with a provider joins an existing account with the same email only when both the provider and Tinderhaj have verified that email. Otherwise the person is asked to sign in another way and connect the provider from Account Settings. Passwords are hashed with scrypt as `salt:hash` (`src/lib/password-hasher.ts`), the same way as before Better Auth, so older accounts keep their passwords.

Emails (verification, email changes, password resets, sign-in codes, and account deletion) are sent through Resend from `src/lib/email.ts`.

## Profile and Moderation Model

The Prisma schema defines the core models:

- `User`: username, email, role, whether two-step sign-in is on, how matches can reach them, and any ban (reason, expiry, and who gave it)
- `Account`: ways to sign in; holds the password
- `Session`: active sessions, with IP address and browser
- `Verification`: email links and trusted devices
- `TwoFactor`: authenticator app secrets and backup codes
- `Passkey`: passkeys
- `Profile`: a shark's profile content, moderation status, rejection feedback, and submission and verification timestamps
- `Heart`: a heart from one shark to another, and when its receiver saw it. A heart each way is a match.
- `Report`: a shark, or its owner's way to be reached, reported to moderators: the reason, who reported it, and who handled it.

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

## Discord Bot

`bot/` holds the Tinderhaj bot: the same bot as the role sync, new sharks feed and review queue, but running all the time, so it can see who joins voice channels and answer buttons and commands. It's built like [CuteNikki/DiscordBot](https://github.com/CuteNikki/DiscordBot/tree/v2) (a file per command, button, modal and event, loaded from their folders) on discord.js 14, and runs with Bun. It uses the site's database (`DATABASE_URL`) with the client generated from `prisma/schema.prisma`, where its own tables (`Bubble`, `BubbleSettings`) are too. It reads site data directly, but only changes its own tables: the site's data is left to the site's code, which keeps its cache, Discord roles and posts in step.

- **Bubbles (join-to-create).** Joining the voice channel in `DISCORD_CHANNEL_JOIN_TO_CREATE` makes a voice channel of your own in the same category and takes you there; joining again while you have one takes you back to it.
  - Its chat opens with a panel that shows the bubble as it is (owner, how many are in it, locked or open, hidden or visible) and is kept up to date. From it the owner can lock or hide it, change its name (what comes after the 🫧︱ every bubble starts with; left empty, it goes back to their display name) and user limit, pick who's let in even while it's locked or hidden and who's kept out, pop it, or pick someone in it to kick, keep out or hand it over to. `/bubble`, or the button the bot keeps in `DISCORD_CHANNEL_BUBBLE_CONTROLS` if that's set, shows the same panel from anywhere.
  - A bubble remembers its owner's choices: their next one starts with the same name, limit, lock, visibility and lists.
  - If the owner is gone for 30 seconds, the bubble goes to someone still there. Once everyone's left, it's deleted. Bubbles are only ever deleted if they're in the bot's database.
  - Owners get no permissions on the channel themselves; the bot makes every change. A bubble's permissions are worked out from the category's and its settings, so changes made to a bubble's permissions by hand are undone at its next change. Staff (roles with Administrator, Manage Channels or Timeout Members) can always see and join bubbles, can't be kept out, and can change anyone's.
- **`/shark member`** posts someone's verified sharks (or yours), and **`/shark random`** a random one, as links Discord shows as cards. It says the same for someone who hasn't connected Discord as for someone with no sharks.
- **Moderation.** `/warn`, `/timeout`, `/untimeout`, `/kick`, `/ban` and `/unban`, each for whoever has the matching Discord permission (Timeout Members, Kick Members or Ban Members). Nobody can act on someone whose top role is as high as theirs. Before a warn, timeout, kick or ban, the bot DMs them what happened and why, without saying who did it. `/purge` deletes up to 100 messages in a channel at once, optionally only one member's, for whoever has Manage Messages there; Discord doesn't let bots bulk delete messages older than 2 weeks, so those are left.
  - Every moderation is a numbered case in the `Moderation` table, including ones done by hand in Discord (found in the audit log), so `/history view` shows everything that's happened to someone. `/history remove` takes out one made by mistake, and says so in the log. Nothing happens automatically: moderators decide.
- **Log.** Everything goes to the channel in `DISCORD_CHANNEL_LOG`: joins (flagging new accounts) and leaves, name changes, edited and deleted messages, voice joins, leaves and moves, moderation, and every other change the audit log records (channels, roles, nicknames, invites and so on), with who made it. The bot's own changes are left out, since bubbles change channels all the time and its commands log themselves.

Setting it up:

1. Set `SITE_URL` for the bot if the site isn't at `https://tinderhaj.com`, e.g. `http://localhost:3000` locally, so `/shark` links to it.
2. Give the bot's role **Manage Channels**, **Manage Roles**, **Move Members**, **View Channel**, **Connect**, **Speak**, **Video**, **Send Messages**, **Embed Links** and **Read Message History** in the join-to-create category (it can only give owners what it has itself), and **View Channel**, **Send Messages** and **Read Message History** in the bubble controls channel. For moderation and the log it also needs **View Audit Log**, **Ban Members**, **Kick Members** and **Timeout Members**, **View Channel** and **Read Message History** everywhere it should log messages from, and its role above everyone it should be able to moderate.
3. In the Discord Developer Portal, under **Bot**, turn on **Server Members Intent** and **Message Content Intent**: the log needs them for joins and leaves and for what edited and deleted messages said.
4. Copy the join-to-create voice channel's id into `DISCORD_CHANNEL_JOIN_TO_CREATE`, optionally a text channel's into `DISCORD_CHANNEL_BUBBLE_CONTROLS`, and the log channel's into `DISCORD_CHANNEL_LOG`. Keep the log channel visible to moderators only.
5. Apply the site's migrations, which include the bot's tables (see Database Setup).
6. Run it. Locally, `cd bot && bun install && bun run dev` reads the site's `.env` and uses the client the site generated. On a server, `cd bot && docker compose up -d --build` builds it from the repo root, generating the client from the site's schema, and reads `../.env` as well. The compose file joins the external `postgres_default` network, so `DATABASE_URL` can use the Postgres container's name as its host; take that out if your Postgres isn't a container on that network. Logs go to `bot/logs`.

7. Register its commands on the server in `DISCORD_GUILD_ID`: `bun run register` in `bot/`, or `docker compose exec tinderhaj-bot bun run register` on the server. Discord keeps them, so this isn't done on start; run it again only when commands are added, removed or changed. It replaces what was there, so removed commands go too.

`bun run typecheck` checks the bot, and the site's checks leave `bot/` out.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run `typecheck`, `lint`, `lint:classes`, `format:check`, and `test:e2e`, which CI runs too.
4. Submit a pull request with a short summary of the changes.

## License

This project does not currently declare a license. If you plan to publish or distribute it, add an explicit license before doing so.
