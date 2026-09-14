# React Anagram Animation

**Animate between two anagram words in React — every letter glides to its new position.**

![React Anagram Animation demo: BAD CREDIT rearranging into DEBIT CARD](https://raw.githubusercontent.com/scottcanoni/react-anagram-animation/main/docs/demo.gif)

[![npm version](https://img.shields.io/npm/v/react-anagram-animation.svg)](https://www.npmjs.com/package/react-anagram-animation)
[![npm downloads](https://img.shields.io/npm/dm/react-anagram-animation.svg)](https://www.npmjs.com/package/react-anagram-animation)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-anagram-animation)](https://bundlephobia.com/package/react-anagram-animation)
[![CI](https://github.com/scottcanoni/react-anagram-animation/actions/workflows/node.js.yml/badge.svg)](https://github.com/scottcanoni/react-anagram-animation/actions/workflows/node.js.yml)
[![license](https://img.shields.io/npm/l/react-anagram-animation.svg)](./LICENSE)

Every letter of the first word is paired with the matching letter of the second, then animated from where it starts to where it ends up. Nothing fades, nothing is faked — the letters you are reading are the letters that move.

- **Zero runtime dependencies**
- **TypeScript types included**
- **SSR / Next.js App Router safe** — no CSS import, no browser globals at module scope
- **Respects `prefers-reduced-motion`**
- **ESM and CommonJS**, React 17, 18 and 19

## Install

```bash
npm install react-anagram-animation
```

## Quick start

```jsx
import Anagram from 'react-anagram-animation';

export default function Hero() {
    return <Anagram words={['bad credit', 'debit card']} />;
}
```

There is no stylesheet to import. Style it like any other text:

```css
.anagram-swap {
    font-family: 'Open Sans', sans-serif;
    font-size: 42px;
    font-weight: bold;
    color: #fff;
    text-transform: uppercase;
}
```

**[Live demo →](https://scottcanoni.github.io/react-anagram-animation/)**

## Usage

Control the timing with `animationOptions`. Every value is in milliseconds.

```jsx
<Anagram
    words={['React Anagram Animation', 'Magenta Raincoat Airman']}
    animationOptions={{
        randomStartMin: 0,
        randomStartMax: 3000,
        randomReverseMin: 6000,
        randomReverseMax: 6000,
        loopAnimation: 20000,
        waitToStart: 5000,
        transitionDuration: 2000,
        timingFunction: 'ease-in-out',
    }}
/>
```

If the text uses a webfont, name it with `fontToObserve` so the letters are measured after the font loads rather than before:

```jsx
<Anagram fontToObserve="Open Sans" />
```

Any other prop — `className`, `id`, `style`, `data-*`, `aria-*` — is forwarded to the root element.

## API

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `words` | `[string, string]` | `['React Anagram Animation', 'Magenta Raincoat Airman']` | Exactly two words that are anagrams of each other, **including spaces and punctuation**. |
| `animationOptions` | `AnimationOptions` | see below | Timing. Any subset; the rest fall back to the defaults. |
| `fontToObserve` | `string` | — | Font family to wait for before measuring. Omit to render immediately. |

### AnimationOptions

All times are in milliseconds. The randomness is what produces the jumbled, staggered effect — set `min` equal to `max` to make every letter move in lockstep instead.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `randomStartMin` | `number` | `0` | Minimum wait before a letter starts moving. |
| `randomStartMax` | `number` | `3000` | Maximum wait before a letter starts moving. Should be `>= randomStartMin`. |
| `randomReverseMin` | `number` | `6000` | Minimum wait before a letter heads back. |
| `randomReverseMax` | `number` | `9000` | Maximum wait before a letter heads back. Should be `>= randomReverseMin`. |
| `loopAnimation` | `number` | `12000` | Wait before the next full cycle. Should be `>= randomReverseMax + transitionDuration`. |
| `waitToStart` | `number` | `0` | Wait before the very first run. |
| `transitionDuration` | `number` | `1000` | How long a letter takes to travel. Should be `<= randomReverseMin - randomStartMax`. |
| `timingFunction` | `string` | `'ease-in-out'` | Any CSS [timing function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function), including `cubic-bezier(...)`. |

### Named exports

```js
import Anagram, { isAnagram, DEFAULT_ANIMATION_OPTIONS } from 'react-anagram-animation';

isAnagram('bad credit', 'debit card'); // true — ignores case, spaces and punctuation
DEFAULT_ANIMATION_OPTIONS.loopAnimation; // 12000
```

CommonJS consumers reach the component through `.default`:

```js
const Anagram = require('react-anagram-animation').default;
```

## Styling

The package ships **no CSS**. Only a handful of structural rules (the ones that make measurement possible) are applied inline; everything visual is yours. Target these class names:

| Class | Element |
| :--- | :--- |
| `.anagram-swap` | Root element. Set `font`, `color`, `text-transform` here. |
| `.anagram-word` | Each of the three word layers. |
| `.anagram-word-animation` | The visible, animating layer. |
| `.anagram-letter` | Every individual letter. |

## TypeScript

Types ship with the package; nothing extra to install.

```tsx
import Anagram, { type AnimationOptions } from 'react-anagram-animation';

const options: AnimationOptions = { transitionDuration: 2000 };

<Anagram words={['bad credit', 'debit card']} animationOptions={options} />;
```

`words` is typed as a two-element tuple, so a third word is a compile error. If you hoist the array, use `as const`:

```tsx
const words = ['bad credit', 'debit card'] as const;
```

## SSR and Next.js

The component is safe to import from a server component or any SSR context: it imports no CSS and touches no browser globals at module scope. On the server it renders the first word as real text (good for crawlers), then measures and animates after hydration.

It is a client component, so in the Next.js App Router use it from a file with `'use client'`.

## Accessibility

- **`prefers-reduced-motion: reduce` is respected.** The word renders at rest and no timers are scheduled at all. There is no prop to override this — the animation is decorative.
- The two hidden measurement copies are `aria-hidden`, so a screen reader reads the phrase **once**.

## Which package do I want?

| | |
| :--- | :--- |
| **Both words are true anagrams** | **This package.** Smaller, and every letter is accounted for — each one travels to a real destination. |
| **Any two words or phrases** | [`react-text-swap-animation`](https://www.npmjs.com/package/react-text-swap-animation). Handles unmatched letters by fading them in and out. |

## Migrating from v1

v2 removes the stylesheet that used to ship with the package. It forced `color: #fff`, `text-transform: uppercase` and `width: 100%` on every consumer, which made the component render invisibly on a light background.

**To restore the v1 appearance, add this to your own CSS:**

```css
.anagram-swap {
    color: #fff;
    text-transform: uppercase;
    text-align: left;
    width: 100%;
    margin: 0 auto;
    padding: 0;
}
```

Other breaking changes:

- **Class names are namespaced.** `.word` → `.anagram-word`, `.letter` → `.anagram-letter`, and `.hidden` is gone. (`.hidden` collided with Tailwind's `.hidden { display: none }`.)
- **No more `import 'react-anagram-animation/dist/components/index.css'`** — there is no CSS file.
- **Deep imports are gone.** `react-anagram-animation/dist/utils` and friends no longer resolve; use the named exports.
- **`main` is now `dist/index.cjs`**, alongside a real ESM build at `dist/index.mjs`.
- **Browser floor is now ~Chrome 80 / Safari 13.1** (was ~Chrome 67), because `core-js` was dropped.
- **`prefers-reduced-motion` is respected**, so some users will see a static word.
- **Non-anagram input no longer throws.** It logs an error and renders the first word.

See [CHANGELOG.md](./CHANGELOG.md) for the full list.

## Contributing

```bash
npm install
npm start        # demo at http://localhost:5173
npm test
npm run lint
npm run build    # builds the library into dist/
```

## License

WTFPL — see [LICENSE](./LICENSE).
