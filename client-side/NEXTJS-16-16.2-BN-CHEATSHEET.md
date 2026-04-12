# Next.js 16 / 16.2 Quick Cheat Sheet

## Config

- `reactStrictMode: true` = development safety
- `reactCompiler: true` = React Compiler optimize
- `images.remotePatterns` = external image allowlist

## Important

- `Link href` typed route হতে পারে
- `router.replace` / `router.push` route type চেক করতে পারে
- duplicate `key` দিলে React bug/warning হয়
- clickable element-এ `cursor-pointer` ভালো UX দেয়

## Common errors

1. Missing `babel-plugin-react-compiler`
2. `string` href typed route mismatch
3. duplicate list key
4. stale build lock / another build running

## Build tips

- config বদলালে `pnpm build` চালাও
- typed route error পেলে shared `href` types দেখো
- external images হলে `remotePatterns` check করো

## This project

- Next.js `16.2.3`
- React `19.2.4`
- `reactStrictMode` on
- `reactCompiler` on
- compiler plugin installed
