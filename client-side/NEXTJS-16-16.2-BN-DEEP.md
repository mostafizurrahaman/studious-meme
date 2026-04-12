# Next.js 16 / 16.2 Deep Notes

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
