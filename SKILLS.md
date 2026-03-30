# StreakForge — Project Initialization Prompt
## Paste this entire prompt into a new conversation to bootstrap the project

---

You are an expert Next.js 14 full-stack developer. I am building **StreakForge** — a personal streak management web application. Your job is to help me initialize and build this project from scratch, step by step, following every instruction in this prompt exactly.

---

## WHAT WE ARE BUILDING

StreakForge is a full-stack streak management app where:
- A user creates a **streak** by entering a project name (e.g., "Learn Rust") and a target number of days (e.g., 30)
- Every day, the user clicks **"Mark Today Done"** to check in and keep their streak alive
- The app shows a **visual dashboard** with a flame counter, calendar heatmap, progress ring, and milestone badges
- At milestones (5, 10, 15, 20, 25, 30, 60, 90, 100 days) the app shows **in-app confetti + sends a congratulation email**
- The app sends **daily reminder emails** via Nodemailer if the user hasn't checked in by their chosen time
- The user can **sync their streak to Google Calendar** (recurring daily event + milestone events)
- The user can **subscribe with Apple Calendar** via a webcal link or download a `.ics` file
- Users can use up to **2 streak freezes** per streak to survive a missed day
- Users can run **multiple parallel streaks** at the same time

---

## STRICT TECH STACK — NEVER DEVIATE WITHOUT ASKING

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) — single codebase, no separate backend |
| Language | TypeScript (strict mode) |
| Package Manager | pnpm |
| Auth | Better Auth (`better-auth`) — Google OAuth + GitHub OAuth + Email/Password |
| Database ORM | Prisma |
| Database | PostgreSQL (Supabase free tier) |
| Cache / Rate Limit | Upstash Redis (`@upstash/redis`) |
| Email | Nodemailer (`nodemailer` + `@types/nodemailer`) with Gmail SMTP or SMTP provider |
| Email Templates | Plain HTML strings inside Nodemailer (structured, styled, inline CSS) |
| Calendar — Google | Google Calendar REST API v3 via `googleapis` npm package |
| Calendar — Apple | `ical-generator` npm package for `.ics` files and webcal feed |
| UI Components | shadcn/ui (Radix UI) + Tailwind CSS v3 |
| State | Zustand (client-only) |
| Data Fetching | TanStack Query v5 |
| Animations | Framer Motion |
| Heatmap | `react-activity-calendar` |
| Dates | `date-fns` + `date-fns-tz` — NEVER moment.js or dayjs |
| Cron Jobs | Vercel Cron Jobs (`vercel.json`) |
| Hosting | Vercel |

---

## NODEMAILER SETUP — USE THIS EXACTLY

We use **Nodemailer** (not Resend, not SendGrid). All email is sent through SMTP.

### Installation
```bash
pnpm add nodemailer
pnpm add -D @types/nodemailer
```

### Nodemailer client singleton (`/lib/nodemailer.ts`)
```typescript
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',   // true for port 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
```

### Email sending helpers (`/lib/email.ts`)
```typescript
import { transporter } from './nodemailer'
import { reminderEmailHtml } from './email-templates/reminder'
import { milestoneEmailHtml } from './email-templates/milestone'
import { welcomeEmailHtml }   from './email-templates/welcome'

const FROM = `"StreakForge" <${process.env.SMTP_USER}>`

export async function sendReminderEmail(to: string, name: string, streakName: string, currentStreak: number, streakId: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `⏰ Don't break your "${streakName}" streak today!`,
    html: reminderEmailHtml({ name, streakName, currentStreak, streakId }),
  })
}

export async function sendMilestoneEmail(to: string, name: string, streakName: string, days: number, streakId: string) {
  const msg = MILESTONE_MESSAGES[days]
  await transporter.sendMail({
    from: FROM,
    to,
    subject: msg.subject,
    html: milestoneEmailHtml({ name, streakName, days, headline: msg.headline, subtext: msg.subtext, streakId }),
  })
}

export async function sendWelcomeEmail(to: string, name: string, streakName: string, targetDays: number) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `🔥 Your streak "${streakName}" is live — let's go!`,
    html: welcomeEmailHtml({ name, streakName, targetDays }),
  })
}
```

### Email templates location
All HTML email templates live in `/lib/email-templates/` as functions that return an HTML string.
They use **inline CSS only** (no external stylesheets — email clients strip them).
Structure: header with logo + flame emoji, body text, big CTA button, unsubscribe footer.

### Milestone messages (use these exact copy strings)
```typescript
export const MILESTONE_MESSAGES: Record<number, { subject: string; headline: string; subtext: string }> = {
  5:   { subject: "🔥 5-day streak! You're just getting started!",   headline: "5 Days Strong!",            subtext: "The first week is the hardest. You're proving you have what it takes." },
  10:  { subject: "🚀 10 days! Double digits!",                       headline: "10 Days — Double Digits!",  subtext: "You've crossed into double digits. This is where habits start to form." },
  15:  { subject: "⚡ Halfway to 30! 15 days done!",                  headline: "15 Days! Halfway There!",   subtext: "You're building something real. Keep the momentum going." },
  20:  { subject: "💪 20 days! Almost a month!",                      headline: "20 Days and Counting!",     subtext: "Science says habits take 21 days. You're one day away from automatic." },
  25:  { subject: "🏅 25 days! Silver streak!",                       headline: "25 Days — Silver Streak!",  subtext: "5 more days and you'll have a full month. You've got this." },
  30:  { subject: "🥇 30 days! ONE FULL MONTH!",                      headline: "30 Days — A Full Month!",   subtext: "You did it. One complete month. This is a massive achievement." },
  60:  { subject: "🔥🔥 60 days! Two months of consistency!",         headline: "60 Days — Two Months!",     subtext: "You're in the top 1% of people who stick with their goals. Incredible." },
  90:  { subject: "💎 90 days! Diamond streak!",                      headline: "90 Days — Diamond Streak!", subtext: "Three months. This isn't a habit anymore — it's a part of who you are." },
  100: { subject: "👑 100 DAYS! LEGENDARY!",                          headline: "100 Days — LEGENDARY!",     subtext: "One hundred days of showing up. You are an inspiration. Absolutely legendary." },
}

export const MILESTONES = [5, 10, 15, 20, 25, 30, 60, 90, 100] as const
```

---

## ENVIRONMENT VARIABLES — GENERATE `.env.example` WITH THESE EXACTLY

```env
# ── App ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Database (Supabase PostgreSQL) ───────────────────
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB?schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DB       # for Prisma migrations

# ── Better Auth ───────────────────────────────────────
BETTER_AUTH_SECRET=replace_with_32_plus_char_random_string
BETTER_AUTH_URL=http://localhost:3000

# ── Google OAuth + Calendar API ───────────────────────
# Create at: https://console.cloud.google.com → APIs & Services → Credentials
# Enable: Google Calendar API
# Authorized redirect URI: http://localhost:3000/api/auth/callback/google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── GitHub OAuth (optional) ───────────────────────────
# Create at: https://github.com/settings/applications/new
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ── Upstash Redis ─────────────────────────────────────
# Create at: https://console.upstash.com
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# ── Nodemailer SMTP ───────────────────────────────────
# For Gmail: enable App Passwords at myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false       # true for port 465, false for 587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password_here

# ── Vercel Cron Security ──────────────────────────────
# Generate: openssl rand -hex 32
CRON_SECRET=replace_with_random_string
```

---

## DATABASE SCHEMA — GENERATE THIS EXACT `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id              String    @id @default(cuid())
  name            String
  email           String    @unique
  emailVerified   Boolean   @default(false)
  image           String?
  timezone        String    @default("UTC")
  reminderTime    String    @default("09:00")     // HH:mm in user's timezone
  reminderEnabled Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  accounts  Account[]
  sessions  Session[]
  streaks   Streak[]
}

model Account {
  id                   String    @id @default(cuid())
  userId               String
  provider             String
  providerAccountId    String
  accessToken          String?   @db.Text
  refreshToken         String?   @db.Text
  accessTokenExpiresAt DateTime?
  scope                String?
  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Streak {
  id             String       @id @default(cuid())
  userId         String
  name           String
  description    String?
  targetDays     Int
  color          String       @default("#F97316")
  emoji          String       @default("🔥")
  status         StreakStatus @default(ACTIVE)
  currentStreak  Int          @default(0)
  longestStreak  Int          @default(0)
  totalDays      Int          @default(0)
  freezesUsed    Int          @default(0)
  freezesAllowed Int          @default(2)
  startDate      DateTime     @default(now())
  completedAt    DateTime?
  googleCalEventId String?
  icalSecret     String       @unique @default(cuid())
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  user       User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  checkIns   CheckIn[]
  milestones Milestone[]

  @@index([userId, status])
}

model CheckIn {
  id        String   @id @default(cuid())
  streakId  String
  userId    String
  date      DateTime @db.Date
  note      String?
  isFrozen  Boolean  @default(false)
  createdAt DateTime @default(now())

  streak Streak @relation(fields: [streakId], references: [id], onDelete: Cascade)

  @@unique([streakId, date])
  @@index([streakId, date])
}

model Milestone {
  id         String   @id @default(cuid())
  streakId   String
  userId     String
  days       Int
  reachedAt  DateTime @default(now())
  emailSent  Boolean  @default(false)
  calEventId String?

  streak Streak @relation(fields: [streakId], references: [id], onDelete: Cascade)

  @@unique([streakId, days])
}

model ReminderLog {
  id        String       @id @default(cuid())
  userId    String
  streakId  String
  date      DateTime     @db.Date
  sentAt    DateTime     @default(now())
  type      ReminderType

  @@unique([streakId, date, type])
}

enum StreakStatus { ACTIVE PAUSED COMPLETED ABANDONED }
enum ReminderType {
  DAILY_REMINDER
  MILESTONE_5
  MILESTONE_10
  MILESTONE_15
  MILESTONE_20
  MILESTONE_25
  MILESTONE_30
  MILESTONE_60
  MILESTONE_90
  MILESTONE_100
}
```

---

## PROJECT FOLDER STRUCTURE — SCAFFOLD THIS EXACTLY

```
streakforge/
├── app/
│   ├── page.tsx                          ← Landing page
│   ├── layout.tsx                        ← Root layout with Providers
│   ├── dashboard/
│   │   └── page.tsx                      ← All user streaks
│   ├── streaks/
│   │   ├── new/
│   │   │   └── page.tsx                  ← Create streak form
│   │   └── [id]/
│   │       ├── page.tsx                  ← Streak detail + heatmap + check-in
│   │       └── settings/
│   │           └── page.tsx              ← Edit streak
│   ├── settings/
│   │   └── page.tsx                      ← User settings (timezone, reminder time)
│   ├── share/
│   │   └── [id]/
│   │       └── [icalSecret]/
│   │           └── page.tsx              ← Public read-only streak page
│   └── api/
│       ├── auth/
│       │   └── [...all]/
│       │       └── route.ts              ← Better Auth handler
│       ├── streaks/
│       │   ├── route.ts                  ← GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts              ← GET, PATCH, DELETE
│       │       ├── checkin/
│       │       │   └── route.ts          ← POST check-in
│       │       ├── freeze/
│       │       │   └── route.ts          ← POST use freeze
│       │       └── calendar/
│       │           ├── google/
│       │           │   └── route.ts      ← POST sync to Google Calendar
│       │           └── ical/
│       │               └── route.ts      ← GET download .ics
│       ├── calendar/
│       │   └── webcal/
│       │       └── [icalSecret]/
│       │           └── route.ts          ← GET live iCal feed (webcal://)
│       └── cron/
│           ├── daily-reminder/
│           │   └── route.ts              ← Hourly cron → sends reminder emails
│           └── milestone-check/
│               └── route.ts              ← Daily cron → checks + sends milestone emails
├── components/
│   ├── streak/
│   │   ├── StreakCard.tsx
│   │   ├── StreakHeatmap.tsx
│   │   ├── CheckInButton.tsx             ← 'use client'
│   │   ├── MilestoneBadge.tsx
│   │   ├── StreakProgress.tsx
│   │   ├── FreezeButton.tsx
│   │   └── StreakForm.tsx
│   ├── calendar/
│   │   ├── GoogleCalendarConnect.tsx
│   │   ├── AppleCalendarButton.tsx
│   │   └── CalendarSyncStatus.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── ui/                               ← shadcn/ui (auto-generated)
│   └── shared/
│       ├── FlameCounter.tsx
│       ├── ConfettiBlast.tsx
│       ├── EmptyState.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── auth.ts                           ← Better Auth server instance
│   ├── auth-client.ts                    ← Better Auth client instance
│   ├── db.ts                             ← Prisma singleton
│   ├── redis.ts                          ← Upstash Redis singleton
│   ├── nodemailer.ts                     ← Nodemailer transporter singleton
│   ├── email.ts                          ← sendReminderEmail(), sendMilestoneEmail(), sendWelcomeEmail()
│   ├── email-templates/
│   │   ├── reminder.ts                   ← reminderEmailHtml() → string
│   │   ├── milestone.ts                  ← milestoneEmailHtml() → string
│   │   └── welcome.ts                    ← welcomeEmailHtml() → string
│   ├── google-calendar.ts                ← Google Calendar API wrapper
│   ├── ical.ts                           ← ical-generator wrapper
│   ├── streak-engine.ts                  ← calculateCurrentStreak(), calculateLongestStreak(), hasCheckedInToday()
│   ├── validations.ts                    ← Zod schemas
│   ├── utils.ts                          ← cn(), formatDate(), getTodayInTimezone()
│   └── constants.ts                      ← MILESTONES, MILESTONE_MESSAGES, STREAK_COLORS, STREAK_EMOJIS
├── actions/
│   ├── streak.ts                         ← createStreak, updateStreak, deleteStreak
│   ├── checkin.ts                        ← checkInToday, useFreeze
│   ├── calendar.ts                       ← syncGoogleCalendar
│   └── settings.ts                       ← updateUserSettings
├── hooks/
│   ├── useCheckIn.ts
│   ├── useCountdown.ts
│   └── useStreakStore.ts
├── stores/
│   └── uiStore.ts
├── types/
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts
├── vercel.json
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## STEP-BY-STEP INITIALIZATION — FOLLOW IN THIS EXACT ORDER

### STEP 1 — Scaffold the Next.js project

Run this and answer the prompts as specified:
```bash
pnpm create next-app@latest streakforge \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=no \
  --import-alias="@/*"
cd streakforge
```

### STEP 2 — Install ALL dependencies in one go

```bash
# Core
pnpm add better-auth @prisma/client prisma

# Database
pnpm add @upstash/redis

# Email
pnpm add nodemailer
pnpm add -D @types/nodemailer

# Google Calendar + Apple iCal
pnpm add googleapis ical-generator

# UI
pnpm add @tanstack/react-query zustand framer-motion
pnpm add react-activity-calendar date-fns date-fns-tz
pnpm add lucide-react

# Dev
pnpm add -D @types/node

# Init Prisma
pnpm prisma init

# Init shadcn/ui (follow prompts — choose default style, slate base color)
pnpm dlx shadcn@latest init

# Add shadcn components we'll use
pnpm dlx shadcn@latest add button card badge input label
pnpm dlx shadcn@latest add dialog sheet progress separator
pnpm dlx shadcn@latest add toast dropdown-menu avatar skeleton
pnpm dlx shadcn@latest add form select tabs tooltip popover
```

### STEP 3 — Generate the Prisma schema

Replace the contents of `prisma/schema.prisma` with the schema defined in the DATABASE SCHEMA section above. Then run:

```bash
pnpm prisma generate
# (Do NOT migrate yet — user needs to set DATABASE_URL first)
```

### STEP 4 — Generate `.env.example`

Create `.env.example` with all variables from the ENVIRONMENT VARIABLES section above.
Create `.env.local` as a copy and instruct the user to fill it in before continuing.

### STEP 5 — Create `vercel.json` for Cron Jobs

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-reminder",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/milestone-check",
      "schedule": "5 0 * * *"
    }
  ]
}
```

### STEP 6 — Create all singleton lib files

Generate these files in order:

**`/lib/db.ts`** — Prisma singleton (prevent hot-reload connection leak)
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db = globalForPrisma.prisma ?? new PrismaClient({ log: ['error'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**`/lib/redis.ts`** — Upstash Redis singleton
```typescript
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
```

**`/lib/nodemailer.ts`** — Nodemailer transporter singleton
```typescript
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})
```

### STEP 7 — Create Better Auth setup

**`/lib/auth.ts`**
```typescript
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.events',
      ],
      accessType: 'offline',
      prompt: 'consent',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  account: {
    accountLinking: { enabled: true },
  },
})
```

**`/lib/auth-client.ts`**
```typescript
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
})

export const { signIn, signOut, signUp, useSession } = authClient
```

**`/app/api/auth/[...all]/route.ts`**
```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { GET, POST } = toNextJsHandler(auth)
```

### STEP 8 — Create `middleware.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { betterFetch } from '@better-fetch/fetch'

const protectedRoutes = ['/dashboard', '/streaks', '/settings']

export async function middleware(req: NextRequest) {
  const { data: session } = await betterFetch('/api/auth/get-session', {
    baseURL: req.nextUrl.origin,
    headers: { cookie: req.headers.get('cookie') ?? '' },
  })

  const isProtected = protectedRoutes.some(r =>
    req.nextUrl.pathname.startsWith(r)
  )

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/streaks/:path*', '/settings/:path*'],
}
```

### STEP 9 — Create `/lib/constants.ts`

Generate the full `MILESTONES`, `MILESTONE_MESSAGES`, `STREAK_COLORS`, and `STREAK_EMOJIS` constants from the Nodemailer section above.

### STEP 10 — Create `/lib/streak-engine.ts`

Generate the streak calculation pure functions:
- `getTodayInTimezone(timezone: string): Date`
- `calculateCurrentStreak(dates: Date[], timezone: string): number`
- `calculateLongestStreak(dates: Date[]): number`
- `hasCheckedInToday(checkInDates: Date[], timezone: string): boolean`
- `isMilestone(days: number): boolean`
- `getNextMilestone(currentStreak: number): number | null`

### STEP 11 — Create email templates

Generate three files in `/lib/email-templates/`:

**`reminder.ts`** — exports `reminderEmailHtml({ name, streakName, currentStreak, streakId })` returning an HTML string with:
- Subject preview: flame emoji + streak name
- Current streak count in large bold text
- Big orange CTA button "Mark Today Done →" linking to `${APP_URL}/streaks/${streakId}`
- Footer with unsubscribe note linking to `/settings`
- All styles inline — no external CSS

**`milestone.ts`** — exports `milestoneEmailHtml({ name, streakName, days, headline, subtext, streakId })` returning an HTML string with:
- Large milestone number as hero text (e.g. "30")
- Headline and subtext from `MILESTONE_MESSAGES`
- Trophy emoji based on milestone level
- CTA button "See Your Streak →"
- Share encouragement text

**`welcome.ts`** — exports `welcomeEmailHtml({ name, streakName, targetDays })` returning an HTML string with:
- Friendly intro: "Your streak is live!"
- Streak name + target days displayed prominently
- How freezes work (brief)
- CTA button "Start Your First Check-In →"

### STEP 12 — Create the cron route handlers

**`/app/api/cron/daily-reminder/route.ts`**

Logic:
1. Verify `Authorization: Bearer ${CRON_SECRET}` header — return 401 if missing
2. Get current UTC hour
3. Query all users where `reminderEnabled = true`
4. For each user: convert their `reminderTime` (HH:mm in their timezone) to UTC hour
5. If UTC hour matches current hour:
   - Check Redis key `reminder:{userId}:{YYYY-MM-DD}` — skip if exists
   - Find their active streaks where they haven't checked in today
   - For each such streak: call `sendReminderEmail()`
   - Write to `ReminderLog` table
   - Set Redis dedup key with 26h TTL
6. Return `{ ok: true, processed: N }`

**`/app/api/cron/milestone-check/route.ts`**

Logic:
1. Verify `CRON_SECRET` header — return 401 if missing
2. Query all ACTIVE streaks with their milestones and user
3. For each streak, for each value in `MILESTONES`:
   - If `streak.currentStreak >= milestone`:
     - Check if a `Milestone` record exists with `emailSent: true` — skip if yes
     - Call `sendMilestoneEmail()`
     - Upsert `Milestone` record with `emailSent: true`
     - If user has `googleCalEventId` → create a milestone event in Google Calendar
4. Return `{ ok: true }`

### STEP 13 — Run the first migration

After the user has filled in `.env.local`:
```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### STEP 14 — Run the dev server

```bash
pnpm dev
```

Verify at `http://localhost:3000` that the app loads without errors.

---

## GOOGLE CALENDAR INTEGRATION RULES

- `googleapis` npm package handles all Calendar API calls
- OAuth access token + refresh token stored in the `Account` table — **never sent to the browser**
- When access token is expired (`accessTokenExpiresAt < now`): use refresh token to get new one → save to DB → proceed
- Creating a streak calendar event: recurring daily `FREQ=DAILY;COUNT={targetDays}` event starting from `streak.startDate`
- Creating a milestone event: one-time all-day event on the date the milestone was reached
- Store returned Google event IDs in `Streak.googleCalEventId` and `Milestone.calEventId`
- If user deletes a streak: also delete the Google Calendar event via `calendar.events.delete()`
- Required Google Cloud setup: enable **Google Calendar API** + set **Authorized redirect URI** to `{APP_URL}/api/auth/callback/google`

---

## APPLE CALENDAR / iCAL INTEGRATION RULES

- Use `ical-generator` npm package — never write raw `.ics` strings manually
- Two delivery methods:
  - **Download** (`GET /api/streaks/[id]/calendar/ical`): generates a snapshot `.ics` file with all planned streak dates
  - **Webcal subscribe** (`GET /api/calendar/webcal/[icalSecret]`): live-updating feed that Apple Calendar polls automatically
- The webcal URL is `webcal://{domain}/api/calendar/webcal/{streak.icalSecret}` — use `icalSecret` (a cuid), never the real streak ID
- Response headers for webcal: `Content-Type: text/calendar; charset=utf-8` + `Cache-Control: no-cache, no-store`
- Events show ✅ prefix for completed days and plain emoji for upcoming days

---

## CHECK-IN RULES (Non-negotiable)

- Only **one check-in per streak per day** — enforced at three layers:
  1. Redis dedup key `checkin:{streakId}:{YYYY-MM-DD}` checked first (fast path)
  2. DB `@@unique([streakId, date])` constraint (final guard)
  3. UI button disabled after check-in (optimistic)
- After check-in: recalculate `currentStreak` and `longestStreak` using `streak-engine.ts`
- If `currentStreak >= targetDays`: set `streak.status = COMPLETED` and `streak.completedAt = now()`
- Always call `revalidatePath('/dashboard')` and `revalidatePath('/streaks/{id}')` after check-in
- Milestone detection happens in the cron job — NOT inline in the check-in action (prevents double sends)
- Return `{ milestoneReached: number | null }` from check-in action so the UI can show in-app confetti

---

## SECURITY RULES (Always enforce these)

| Rule | Requirement |
|---|---|
| SR-01 | All sessions managed by Better Auth — httpOnly cookie, never localStorage |
| SR-02 | Google access/refresh tokens stored in DB only — never sent to client |
| SR-03 | Every Server Action + Route Handler validates with Zod before any DB call |
| SR-04 | Cron routes verify `Authorization: Bearer {CRON_SECRET}` — 401 if missing |
| SR-05 | Check-in deduplicated via Redis + DB unique constraint |
| SR-06 | iCal webcal URL uses `icalSecret` (random cuid) — not the streak's real database ID |
| SR-07 | All secrets in `process.env` — nothing hardcoded |
| SR-08 | Rate limit check-in: max 5 requests/min per user via Upstash Redis |
| SR-09 | Nodemailer SMTP credentials only in env vars — never in code |
| SR-10 | Every email includes an unsubscribe link to `/settings` |

---

## THINGS YOU MUST NEVER DO

- ❌ Never use NextAuth / Auth.js — use Better Auth only
- ❌ Never use Resend, SendGrid, or Mailgun — use Nodemailer only
- ❌ Never use `moment.js` or `dayjs` — use `date-fns` and `date-fns-tz`
- ❌ Never create a separate Express or Fastify server — everything lives in Next.js
- ❌ Never run user code or send email from a `'use client'` component
- ❌ Never import Prisma, auth server, transporter, or Redis in a `'use client'` file
- ❌ Never send milestone emails inline in the check-in action — cron only
- ❌ Never skip `CRON_SECRET` verification on cron route handlers
- ❌ Never use `new PrismaClient()` inline — always import from `/lib/db.ts`
- ❌ Never expose the real streak `id` in the webcal URL — use `icalSecret`
- ❌ Never skip Zod validation in Server Actions or Route Handlers
- ❌ Never hardcode any API key, password, secret, or connection string

---

## HOW TO PROCEED AFTER READING THIS PROMPT

Follow the steps below in order. After each step, confirm it is complete before moving to the next.

1. Scaffold the Next.js project (Step 1)
2. Install all dependencies (Step 2)
3. Set up Prisma schema (Step 3)
4. Create `.env.example` and `.env.local` (Step 4)
5. Create `vercel.json` (Step 5)
6. Create lib singletons: `db.ts`, `redis.ts`, `nodemailer.ts` (Step 6)
7. Set up Better Auth: `auth.ts`, `auth-client.ts`, route handler (Step 7)
8. Create `middleware.ts` (Step 8)
9. Create `constants.ts` with milestones and messages (Step 9)
10. Create `streak-engine.ts` with all calculation functions (Step 10)
11. Create the three Nodemailer HTML email templates (Step 11)
12. Create the two Vercel Cron route handlers (Step 12)
13. Run `prisma migrate dev --name init` (Step 13)
14. Run `pnpm dev` and verify the app starts (Step 14)

**After initialization is confirmed working, we will build features in this order:**
- Phase 1: Streak creation form + basic dashboard
- Phase 2: Daily check-in button + streak engine wiring
- Phase 3: Heatmap, flame counter, progress ring
- Phase 4: Milestone badges + in-app confetti
- Phase 5: Nodemailer reminder + milestone email sending
- Phase 6: Google Calendar sync
- Phase 7: Apple Calendar (.ics download + webcal feed)
- Phase 8: User settings (timezone, reminder time, email preferences)
- Phase 9: Streak freeze system
- Phase 10: Public shareable streak page + final polish

**Ask me which phase to start with, or say "start from Phase 1" to begin immediately.**