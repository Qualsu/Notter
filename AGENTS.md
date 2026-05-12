# Notter
Russian-first note-taking app on Next.js App Router.

## Stack
- Next.js 13.5.7, React, TypeScript
- Clerk for auth
- Convex for documents
- qual.su REST API for user/org profiles
- BlockNote + Mantine, Tailwind CSS + shadcn/ui

## Rules
- Profile and org data come from qual.su, not Convex.
- Convex is the source of truth for documents and metadata.
- Keep the profile loading chain: Clerk -> qual.su -> Convex.
- `document === undefined` in Convex means loading.
- `src/app/api/client.ts` returns `null` on request errors.
- Preserve `pined`, `verifed`, `isAcrhived`, and existing route/file names.
- Avoid false 404 flashes on profile pages.
- `not-found.tsx` is used inline, not only as a route.
- UI text is Russian-first; keep edits narrow and avoid broad re-encoding.
- Don't run `npm run build` or `npm start` yourself!
- Write the Russian language according to the UTF-8 encoding so that you don’t end up with any gibberis

## Commands
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run knip`
