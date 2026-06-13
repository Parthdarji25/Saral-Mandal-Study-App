# Deployment Guide

## Local Development

```bash
npm install
npm run dev
```

Use `.env.local` for Supabase credentials.

## Supabase

Apply migrations:

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Required services:

- Authentication: Email/password enabled
- Storage: `study-pdfs` bucket created by migration
- Database: RLS enabled by migration

## Vercel

Add these environment variables in Project Settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

Do not add `SUPABASE_SERVICE_ROLE_KEY` unless you create server-only maintenance jobs that require it.

## Post-Deploy Checklist

- Sign up with a test student account.
- Promote one known email to admin through SQL.
- Confirm student cannot open `/admin`.
- Confirm two student accounts cannot read each other's scores, notes, tasks, planner rows, or quiz attempts.
- Upload a test PDF as admin and confirm authenticated students can download it.
