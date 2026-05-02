# Notter - Project Reference

## Overview

Notter is a Russian-language note-taking web app built on Next.js 13 App Router. Users can create, edit, and share notes. Profiles exist for both individual users and organizations. The UI is Russian-first.

## Tech Stack

- Framework: Next.js 13.5.7 (App Router)
- Auth: Clerk (`@clerk/nextjs` v6)
- Database: Convex v1.17 for document storage
- User and org data: external REST API at `NEXT_PUBLIC_QUALSU_API` (`qual.su`)
- Editor: BlockNote v0.22 with Mantine
- Styling: Tailwind CSS v3 + shadcn/ui
- State: Zustand v5
- HTTP client: Axios via `src/config/const/api.const.ts`

## Project Structure

```text
src/
|-- app/
|   |-- (landing)/          # Public landing page
|   |-- (main)/             # Authenticated dashboard and editor
|   |-- (profile)/          # User and org profile pages
|   |   |-- _components/    # badge, verifed, documentList, moderatorPanel
|   |   |-- user/[username]/page.tsx
|   |   `-- org/[orgname]/page.tsx
|   |-- (public)/           # Public document viewer
|   |-- api/                # Client-side API wrappers for qual.su
|   |-- auth/               # Clerk sign-in/sign-up pages
|   |-- buy/                # Premium purchase flow
|   |-- layout.tsx          # Root layout and providers
|   `-- not-found.tsx       # Global 404, also used inline
|-- components/
|   |-- ui/                 # shadcn/ui primitives
|   |-- hooks/              # custom hooks
|   |-- modal/              # modal components
|   `-- providers/          # Theme, Convex, modal providers
|-- config/
|   |-- const/api.const.ts  # Axios instance
|   |-- routing/            # pages.route.ts, api.route.ts, image.route.ts
|   `-- types/              # shared app and API types
`-- lib/utils.ts            # cn() helper
```

## Key Data Models

### User (qual.su API)

```ts
{
  _id, username, name, firstname, lastname, avatar, badges, privated,
  pined, created, premium, moderator, documents, publicDocuments,
  verifiedDocuments, verifiedOrgs, watermark, owner, members, mail
}
```

### Org (qual.su API)

```ts
{
  _id, username, owner, name, firstname, lastname, members, avatar,
  badges, privated, pined, created, premium, documents, publicDocuments,
  verifiedDocuments, verifiedOrgs, moderator, watermark, mail
}
```

### Document (Convex)

```ts
{
  title, userId, userName?, creatorName?, shortId, isShort?, isAcrhived,
  parentDocument?, content?, coverImage?, icon?, isPublished, lastEditor?,
  verifed?, views?
}
// indexes: by_user, by_user_parent
```

## Routing

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/dashboard/[documentId]` | Document editor |
| `/user/[username]` | User profile |
| `/org/[orgname]` | Org profile |
| `/view/[documentId]` | Public document viewer |
| `/[shortId]` | Short URL document viewer |
| `/buy` | Premium purchase |

## Premium Tiers

- Free: 1 MB file uploads
- Amber: 3 MB file uploads
- Diamond: 10 MB file uploads

## Profile Page Pattern

Both `src/app/(profile)/user/[username]/page.tsx` and `src/app/(profile)/org/[orgname]/page.tsx` follow the same loading chain:

1. `useUser()` from Clerk provides `isLoaded` and the current user.
2. `useEffect()` fetches profile data from qual.su.
3. `useQuery(api.document.getById)` fetches the pinned document from Convex.
4. Loading state is `!isLoaded || profileLoading/orgLoading || document === undefined`.
5. Not found state is `!profile` or `!org` after loading completes.

The dedicated `profileLoading` / `orgLoading` flag is important. Without it, `null` initial state causes a false 404 flash before the API request finishes.

## Source Of Truth Rules

- Profile and organization data come from the external qual.su API, not Convex.
- Convex is the source of truth for documents and document metadata only.
- Mixed pages depend on a 3-step chain:
  1. Clerk user/session
  2. qual.su profile or org fetch
  3. Convex query using fetched `_id` and `pined`

Do not move profile or org storage concerns into Convex unless the task is an explicit architecture change.

## API Behavior

- `src/app/api/client.ts` intentionally swallows request errors and returns `null`.
- New callers of `apiGet`, `apiPost`, `apiPut`, and `apiDelete` must handle `null` explicitly.
- Do not assume qual.su failures throw. Existing code generally expects nullable results instead.

## Compatibility Constraints

Preserve existing backend and schema names even if they are misspelled:

- `pined`
- `verifed`
- `isAcrhived`

Preserve existing file and route names unless the task is a deliberate migration:

- `src/app/(profile)/_components/verifed.tsx`
- `src/app/auth/sign-in/[[...sigin-in]]/page.tsx`

Avoid opportunistic renames. They are high-risk because they can silently break API, Convex, imports, or route wiring.

## Common Gotchas

- 404 flash on profile pages: always keep the dedicated async loading flag in addition to Clerk and Convex loading signals.
- `not-found.tsx` is used inline: it is imported and rendered as a component, not only as a route-level 404.
- Convex query depends on profile data: `useQuery(api.document.getById)` stays in loading state until profile or org data is available.
- No `loading.tsx` files: loading UX is handled inline with skeletons.
- `document === undefined` is a real loading state in Convex hooks. Do not collapse it into a simple falsy check.

## Localization And Encoding

- User-facing UI is Russian-first.
- Some existing files currently display mojibake in terminal output. Treat this as an encoding hazard.
- Do not perform broad text re-encoding unless the task is specifically about fixing encoding.
- Prefer narrow edits around the required change so existing Russian content is not accidentally corrupted.

## UI And Theme Notes

- Root layout uses `next/font/google` with `Inter`, `ThemeProvider`, `ConvexClientProvider`, and `react-hot-toast`.
- The default theme is dark, but many pages already use mixed light and dark utility classes.
- Reuse existing Tailwind and shadcn/ui patterns before introducing new UI abstractions.

## Dev Commands

```bash
npm run dev          # Start dev server
npm run dev-https    # Start dev server with HTTPS
npm run build        # Production build
npm run lint         # ESLint
npm run knip         # Dead code analysis
```

## Verification Checklist

- Minimum validation for app code changes: `npm run lint`
- Use `npm run build` when the change affects routing, type boundaries, or production-only behavior.
- There is no dedicated automated test suite configured in this repo right now, so lint and build are the main checks.

## Environment Variables

- `NEXT_PUBLIC_QUALSU_API` - Base URL for the qual.su REST API
- Clerk environment variables
- Convex environment variables
