# Supabase setup for Kairo

## 1. Environment variables

Copy `.env.example` to `.env.local` and fill in values from **Supabase → Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Restart `npm run dev` after saving.

## 2. Auth redirect URLs

In **Supabase → Authentication → URL Configuration**, add:

| Environment | Site URL | Redirect URLs |
|-------------|----------|---------------|
| Local | `http://localhost:3000` | `http://localhost:3000/auth/callback` |

If email confirmation is enabled, users confirm via email then log in at `/login`.

## 3. What the app expects (column names)

The Next.js app queries these tables with **snake_case** columns. If your SQL uses different names, update `src/types/database.ts` and `src/lib/data/*` to match.

| Table | Key columns used by the app |
|-------|----------------------------|
| `profiles` | `id`, `full_name`, `username`, `avatar_url`, `bio`, `onboarding_completed` |
| `simulation_state` | `user_id`, `xp`, `level`, `current_sprint`, `current_day`, `reputation_score`, `streak` |
| `tickets` | `user_id`, `ticket_ref`, `title`, `status`, `priority`, … |
| `calendar_events` | `user_id`, `title`, `starts_at`, `ends_at`, `event_type` |
| `conversations` | `user_id`, `persona`, `title`, `last_message_at` |
| `messages` | `conversation_id`, `sender_type`, `body`, `read_at` |
| `notifications` | `user_id`, `read_at` |
| `score_events` | `user_id`, `category`, `delta` |

`level` should be one of: `junior`, `mid`, `senior`, `staff`, `principal`.

`ticket` statuses: `open`, `assigned`, `in_progress`, `in_review`, `completed`, `failed`, `declined`.

## 4. Row Level Security (required)

Each table must allow the signed-in user to read/write **their own rows** (`user_id = auth.uid()` or `id = auth.uid()` for `profiles`).

Example for `profiles`:

```sql
alter table profiles enable row level security;

create policy "Users read own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);
```

Repeat for `simulation_state`, `tickets`, `conversations`, `messages`, `calendar_events`, `notifications`, `score_events`, etc.

Without RLS policies, the dashboard will look empty or show errors in the browser network tab.

## 5. Signup automation (you already have this)

On `auth.users` insert, your trigger should create:

- `profiles`
- `simulation_state`
- `subscriptions` (plan `free`)
- `ai_world_state`
- welcome `notifications` row

The app does **not** create these in code — it relies on your trigger.

## 6. Test flow

1. `npm run dev`
2. Open `http://localhost:3000/signup`
3. Create account → should land on `/dashboard`
4. In Supabase Table Editor, confirm rows exist for your user id
5. Seed a ticket or calendar event with your `user_id` to see live data on the dashboard

## 7. Optional: seed demo ticket

```sql
insert into tickets (user_id, ticket_ref, title, type, status, priority, xp_reward)
values (
  'YOUR_USER_UUID',
  'BUG-221',
  'Payment gateway error',
  'bug',
  'open',
  'high',
  40
);
```

Adjust columns to match your exact schema if the insert fails.
