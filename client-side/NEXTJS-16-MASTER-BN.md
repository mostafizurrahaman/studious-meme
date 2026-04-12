# Next.js 16 / 16.2 Master Note

এই ফাইলটা তিনটা অংশে সাজানো:

1. Quick cheat sheet
2. Detailed learning note
3. Deep notes

---

# অংশ ১: Quick Cheat Sheet

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

---

# অংশ ২: শেখার নোট

## ১) Next.js 16 / 16.2-এ মাথায় রাখার মূল বিষয়

- Next 16.x-এ build/type checking আগের চেয়ে বেশি কড়া হতে পারে।
- App Router + Turbopack + typed route mode একসাথে থাকলে ছোট ভুলও ধরা পড়ে।
- `next.config.ts` শুধু config ফাইল না, অনেক ক্ষেত্রে build behavior নিয়ন্ত্রণ করে।
- `Link`, `router.replace`, `router.push` এ route type mismatch সহজে error দেয়।
- React Compiler চালু করলে extra dependency লাগে।

## ২) এই প্রজেক্টে `next.config.ts` কী হয়েছে

বর্তমান কনফিগ:

```ts
reactStrictMode: true,
reactCompiler: true,
images: {
  remotePatterns: [...]
}
```

### `reactStrictMode`

- development-এ সম্ভাব্য সমস্যা আগে ধরে।
- unsafe pattern, double render side effect, ইত্যাদি ধরতে সাহায্য করে।

### `reactCompiler`

- React Compiler দিয়ে কিছু component rendering optimize হয়।
- এটা চালাতে `babel-plugin-react-compiler` লাগেছে।
- dependency না থাকলে `next build` fail করতে পারে।

### `images.remotePatterns`

- external trusted domain থেকে image use করার জন্য।
- এই প্রজেক্টে `malamal.com.bd` আর `i0.wp.com` allow করা হয়েছে।
- এতে `next/image` external image optimize করতে পারে।

## ৩) Typed routes: কেন সমস্যা হচ্ছিল

Next 16.2-এ typed route validation বেশি শক্ত। তাই এই ধরনের code সমস্যা করতে পারে:

```tsx
<Link href={someString} />
router.replace(dynamicString)
```

### কী ঠিক করা হয়েছে

- `CartItem.href` কে route-compatible টাইপে আনা হয়েছে।
- `SectionHeading.actionHref` কে route type দেওয়া হয়েছে।
- `CategoryPageClient` এ `router.replace(...)` এর জন্য route cast ব্যবহার করা হয়েছে।
- hero slides tuple হিসেবে রাখা হয়েছে যাতে route literal type preserve হয়।

### শেখার কথা

যদি Next typed route mode-এ error দেয়, আগে দেখো:

1. `href` literal route কিনা
2. array/object থেকে আসা string `Route` type এ যাচ্ছে কিনা
3. `Link` props-এ generic typing mismatch আছে কিনা

## ৪) Duplicate key bug

`src/app/compare/page.tsx` এ duplicate key warning ছিল।

### সমস্যা

- `key={`${label}-${value}`}` ব্যবহার করা হচ্ছিল।
- একই `value` repeated হলে key duplicate হচ্ছিল।

### ফিক্স

- এখন `index` যোগ করে key unique করা হয়েছে।

### কেন জরুরি

- React list render-এ key unique না হলে wrong DOM reuse হতে পারে।
- warning শুধু warning না, data mismatch-ও ঘটাতে পারে।

## ৫) `cursor-pointer` কেন যোগ করা হয়েছে

Clickable জায়গায় `cursor-pointer` দিলে UX পরিষ্কার হয়।

### কোথায় যোগ করা হয়েছে

- সব `button`
- `summary` / dropdown trigger
- কিছু clickable badges / controls

### লাভ

- user বুঝতে পারে element interactive
- storefront feel বেশি natural হয়

## ৬) Next.js 16 / 16.2-এ গুরুত্বপূর্ণ API/feature ধারণা

### App Router

- `src/app` ফোল্ডার-based routing
- `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` ইত্যাদি special file

### `next/link`

- client navigation দ্রুত করে
- Next 16-এ route typing বেশি strict হতে পারে

### `next/image`

- image optimization করে
- external image use করতে config লাগতে পারে

### Metadata

- `metadata` বা `generateMetadata` দিয়ে SEO control করা হয়
- এই প্রজেক্টে পেজভিত্তিক metadata ব্যবহার হয়েছে

## ৭) Cache / data behavior সম্পর্কে ধারণা

Next.js 16 docs-এ caching-related অনেক বিষয় আছে।

যেগুলো জানা ভালো:

- `use cache`
- `use cache: private`
- `use cache: remote`
- `cacheTag`
- `cacheLife`
- `revalidatePath`
- `revalidateTag`
- `staleTimes`

### সহজ ভাষায়

- `cacheTag` দিয়ে cached data group করা যায়।
- `revalidateTag` দিয়ে group invalidate করা যায়।
- `revalidatePath` দিয়ে নির্দিষ্ট path refresh করা যায়।
- cache strategy না বুঝে use করলে stale data দেখাতে পারে।

## ৮) Next.js 16.2 build-এ যেসব জিনিস বেশি ধরা পড়ে

- route type mismatch
- invalid `Link href`
- unsupported config option
- missing dependency
- bad external image config
- stale build process lock

### build debugging rule

Build fail হলে প্রথমে দেখো:

1. config valid কি না
2. dependency missing কি না
3. typed route error কি না
4. JSX key issue আছে কি না
5. runtime-only code server component-এ ঢুকে গেছে কি না

## ৯) Turbopack নিয়ে সংক্ষিপ্ত নোট

- Next 16.x-এ Turbopack default workflow-এর অংশ হয়ে উঠেছে।
- এটা দ্রুত, কিন্তু strict behavior exposed করে।
- কখনও পুরোনো webpack-friendly code এখানে fail করতে পারে।

### এই প্রজেক্টে যা পাওয়া গেছে

- build প্রথমে React Compiler dependency issue ধরেছে
- তারপর typed route issue ধরেছে
- তারপর আরও route-specific type error ধরেছে

এটা ভাল, কারণ production-এর আগে bug ধরা পড়ে।

## ১০) এই প্রজেক্টে করা বাস্তব ফিক্স

- compare page duplicate key ঠিক করা হয়েছে
- interactive element-এ `cursor-pointer` যোগ করা হয়েছে
- `reactCompiler` চালু করা হয়েছে
- React Compiler dependency add করা হয়েছে
- route typing-related type errors ধরা ও ঠিক করা হয়েছে

## ১১) যদি তুমি নতুন feature বানাও, কীভাবে ভাববে

### UI বানালে

- interactive element-এ pointer cursor দাও
- button vs link আলাদা রাখো
- list render করলে stable unique key দাও

### routing বানালে

- route literal হলে ভালো
- dynamic string হলে typed route check করো

### config বানালে

- Next 16 docs দেখে option confirm করো
- unsupported option blindভাবে add কোরো না

## ১২) ছোট cheat sheet

```txt
React Compiler = extra optimization, extra dependency
typedRoutes = stricter route typing
remotePatterns = external image allowlist
duplicate key = React list bug
cursor-pointer = better interactive UX
Turbopack = strict fast build system
```

## ১৩) এই প্রজেক্টের current Next.js setup

- Next.js `16.2.3`
- React `19.2.4`
- `reactStrictMode: true`
- `reactCompiler: true`
- `babel-plugin-react-compiler` installed
- image remote patterns configured

## ১৪) Bottom line

Next.js 16 / 16.2-এ সবচেয়ে বড় শিখন হলো:

- config discipline
- route typing discipline
- React list key discipline
- better UX details
- strict build feedback

অর্থাৎ, Next 16 তে app build হবে ঠিকই, কিন্তু sloppy code অনেক দ্রুত ধরা পড়ে।

---

# অংশ ৩: Deep Notes

## ১. Next.js 16 কেন আলাদা

Next.js 16 / 16.2-এ মূল focus ছিল stricter build behavior, typed route safety, React Compiler support, আর Turbopack workflow আরও বাস্তব করা।

এটার মানে:

- sloppy config দ্রুত ধরা পড়ে
- dynamic route/string mismatch সহজে error দেয়
- build আগে warning, পরে fail না হয়ে direct fail করতে পারে

## ২. `next.config.ts`

### `reactStrictMode`

এটা React-এর সম্ভাব্য side effect, unsafe render pattern, আর development-time bug ধরতে সাহায্য করে।

### `reactCompiler`

React Compiler component rendering optimize করার সুযোগ দেয়। কিন্তু dependency ছাড়া এটা চালানো যায় না।

এই প্রজেক্টে:

- `babel-plugin-react-compiler` add করা হয়েছে
- build সফল করতে dependency issue resolve করা হয়েছে

### `images.remotePatterns`

External images জন্য allowlist দরকার হয়। না থাকলে `next/image` fail করতে পারে।

## ৩. Typed routes deep view

Next 16.2-এ typed routes stricter হয়েছে।

### Problem pattern

```tsx
<Link href={someString} />
router.replace(dynamicPath)
```

### Why it fails

- `someString` route literal না-ও হতে পারে
- `Link` exact route type expect করতে পারে
- `router.replace` typed route utility ব্যবহার করতে পারে

### Fix patterns

- literal route type keep করা
- shared type-এ route-compatible `href` ব্যবহার করা
- প্রয়োজন হলে `Route` cast করা

## ৪. Duplicate key analysis

React list key unique হতে হবে।

### Bad

```tsx
key={`${label}-${value}`}
```

যদি `value` repeat হয়, key repeat হবে।

### Good

```tsx
key={`${label}-${index}`}
```

এতে একই value থাকলেও key unique থাকে।

## ৫. cursor-pointer UX

Clickable element-এ cursor pointer user confidence বাড়ায়।

যেমন:

- buttons
- details summary
- filter chips
- action links

## ৬. Build debugging flow

Next.js 16 build error পেলে order হবে:

1. config valid কি না
2. dependency missing কি না
3. typed route mismatch আছে কি না
4. duplicate key issue আছে কি না
5. stale build worker lock আছে কি না

## ৭. Cache concept

Next docs-এ caching and revalidation খুব গুরুত্বপূর্ণ:

- `cacheTag`
- `cacheLife`
- `revalidatePath`
- `revalidateTag`
- `use cache`

Simple idea:

- tag = grouping
- revalidate = refresh
- path = page-level refresh

## ৮. Turbopack note

Turbopack দ্রুত, কিন্তু strict. তাই hidden mismatch আগে ধরে ফেলে। এটা good sign, কারণ production-এ গিয়ে crash হওয়া কমে।

## ৯. এই project-এ বাস্তব changes

- compare page duplicate key fix
- pointer cursor improvements
- React Compiler config enable
- compiler dependency add
- route typing mismatch fix

## ১০. Final mindset

Next.js 16 শেখার মূল কথা:

- route type ভুল হলে build বলবে
- config ভুল হলে build বলবে
- list key ভুল হলে React বলবে
- interactivity unclear হলে UX খারাপ হবে

অর্থাৎ, Next 16 আপনাকে clean code লিখতে বাধ্য করে।
