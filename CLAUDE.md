# Notter — Project Reference

## Overview

Notter is a Russian-language note-taking web app built on Next.js 13 (App Router). Users can create, edit, and share notes. Profiles exist for both individual users and organizations. The UI is in Russian.

## Tech Stack

- **Framework**: Next.js 13.5.7 (App Router, `"use client"` components throughout)
- **Auth**: Clerk (`@clerk/nextjs` v6) — handles sign-in/sign-up, user identity
- **Database**: Convex v1.17 — stores documents only
- **User/Org data**: External REST API at `NEXT_PUBLIC_QUALSU_API` (qual.su) — all user and org profiles live here, not in Convex
- **Editor**: BlockNote v0.22 with Mantine
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **State**: Zustand v5
- **HTTP client**: Axios (configured in `src/config/const/api.const.ts`)

## Project Structure

```
src/
├── app/
│   ├── (landing)/          # Public landing page + navbar
│   ├── (main)/             # Authenticated dashboard (document editor)
│   ├── (profile)/          # User & org profile pages
│   │   ├── _components/    # badge, verifed, documentList, moderatorPanel
│   │   ├── user/[username]/page.tsx
│   │   └── org/[orgname]/page.tsx
│   ├── (public)/           # Public document viewer (/view/[id], /[shortId])
│   ├── api/                # Client-side API functions (axios calls to qual.su)
│   │   ├── users/user.ts   # getByUsername, getById, etc.
│   │   └── orgs/org.ts     # getByUsername, etc.
│   ├── auth/               # Clerk sign-in/sign-up pages
│   ├── buy/                # Premium purchase flow
│   ├── layout.tsx          # Root layout (Convex + Clerk + Theme + Toast providers)
│   └── not-found.tsx       # Global 404 page (used as <Error404 /> inline)
├── components/
│   ├── ui/                 # shadcn/ui (Button, Skeleton, Dialog, etc.)
│   ├── editor.tsx          # BlockNote editor wrapper
│   ├── cover.tsx           # Cover image component
│   └── ...
├── config/
│   ├── const/api.const.ts  # Axios instance
│   ├── routing/            # pages.route.ts, api.route.ts, image.route.ts
│   └── types/
│       ├── api.types.ts    # User, Org, Mail, Order, UserBadge, OrgBadge
│       └── profile.types.ts # UsernameProps, OrgProps, DocumentListProps, etc.
└── lib/utils.ts            # cn() helper
```

## Key Data Models

### User (from qual.su API)
```ts
{ _id, username, name, firstname, lastname, avatar, badges, privated,
  pined, created, premium, moderator, documents, publicDocuments,
  verifiedDocuments, verifiedOrgs, watermark, owner, members, mail }
```

### Org (from qual.su API)
```ts
{ _id, username, owner, name, firstname, lastname, members, avatar,
  badges, privated, pined, created, premium, documents, publicDocuments,
  verifiedDocuments, verifiedOrgs, moderator, watermark, mail }
```

### Document (Convex)
```ts
{ title, userId, userName?, creatorName?, shortId, isShort?, isAcrhived,
  parentDocument?, content?, coverImage?, icon?, isPublished, lastEditor?,
  verifed?, views? }
// indexes: by_user, by_user_parent
```

## Routing

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/dashboard/[documentId]` | Document editor (authenticated) |
| `/user/[username]` | User profile |
| `/org/[orgname]` | Org profile |
| `/view/[documentId]` | Public document viewer |
| `/[shortId]` | Short URL document viewer |
| `/buy` | Premium purchase |

## Premium Tiers

- **Free** — 1 MB file uploads
- **Amber** (level 1) — 3 MB file uploads
- **Diamond** (level 2) — 10 MB file uploads

## Profile Pages — Important Pattern

Both `user/[username]/page.tsx` and `org/[orgname]/page.tsx` follow the same pattern:

1. `useUser()` from Clerk — provides `isLoaded` and current `user`
2. `useEffect` fetches profile from qual.su API → sets state (`profile`/`org`)
3. `useQuery(api.document.getById)` fetches pinned document from Convex
4. **Loading condition**: `!isLoaded || profileLoading || document === undefined` → show Skeleton
5. **Not found condition**: `!profile` after loading completes → show `<Error404 />`

The `profileLoading` / `orgLoading` flag is critical — without it, `profile === null` before the API call completes causes a flash of the 404 page.

## Common Gotchas

- **404 flash on profile pages**: Always use a dedicated loading flag (`profileLoading`, `orgLoading`) in addition to Clerk's `isLoaded` and Convex's `document === undefined`. The external API fetch is async and `profile` starts as `null`.
- **`not-found.tsx` is used inline**: `Error404` is imported and rendered as a component inside pages, not just as the Next.js route-level 404.
- **Convex query depends on profile data**: `useQuery(api.document.getById)` uses `profile?._id` and `profile?.pined`, so it returns `undefined` (loading) until profile is set. This creates a dependency chain: Clerk → qual.su API → Convex.
- **No `loading.tsx` files**: All loading states are handled inline with Skeleton components.

## Dev Commands

```bash
npm run dev          # Start dev server
npm run dev-https    # Start dev server with HTTPS
npm run build        # Production build
npm run lint         # ESLint
npm run knip         # Dead code analysis
```

## Environment Variables

- `NEXT_PUBLIC_QUALSU_API` — Base URL for the qual.su REST API (user/org data)
- Clerk env vars (standard `@clerk/nextjs` setup)
- Convex env vars (standard Convex setup)
