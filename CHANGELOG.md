# Changelog

## 2.0.0

A correctness and packaging release. The component worked in the author's demo and was broken or unusable almost everywhere else: it doubled its own animation under React StrictMode, threw on import in any SSR context, and rendered invisible white text by default.

### Breaking

1. **The stylesheet is gone.** The package ships and imports no CSS. Only the three structural rules that make letter measurement possible are applied inline. The cosmetics it used to force on every consumer — `color: #fff`, `text-transform: uppercase`, `width/height: 100%` — are yours to set now. See *Migrating from v1* in the README for a copy-paste block that restores the old look.
2. **Class names are namespaced.** `.word` → `.anagram-word`, `.letter` → `.anagram-letter`, `.word-animation` → `.anagram-word-animation`. `.hidden` is gone; it collided with Tailwind's `.hidden { display: none }`, which would have silently zeroed every measurement.
3. **Importing the CSS is now an error.** `react-anagram-animation/dist/components/index.css` does not exist.
4. **Deep imports no longer resolve.** The package has an `exports` map and a single bundled entry, so `react-anagram-animation/dist/utils` and similar paths fail. Use the named exports.
5. **`main` moved** from `dist/index.js` to `dist/index.cjs`. There is no `dist/index.js`, so a stale deep require fails loudly instead of throwing a syntax error.
6. **Browser floor raised** from roughly Chrome 67 / Safari 11.1 to Chrome 80 / Firefox 74 / Safari 13.1 / Edge 80 — all shipped by March 2020, and below what React 19 itself supports.
7. **`prefers-reduced-motion: reduce` is now respected.** Users with that setting see the word at rest, with no timers scheduled. There is no opt-out.
8. **Non-anagram input no longer throws.** It logs one error and renders the first word unanimated, instead of taking down the consumer's React tree.
9. **`engines` now requires Node >= 18.**

### Fixed

- **Animation no longer doubles under React 18/19 StrictMode.** The effect installed a self-recursive `setTimeout` chain with no cleanup, so StrictMode's double invocation left two permanently out-of-phase loops running. This was the default development experience in CRA, Next.js and Vite.
- **The animation loop no longer outlives the component.** It kept firing `setState` after unmount.
- **Changing props no longer stacks a second loop** on top of the first.
- **The component no longer restarts on every parent render.** `words` was in the effect dependencies, so an inline `words={['a', 'b']}` — a new array reference each render — reset the animation to frame zero whenever anything above it re-rendered.
- **Passing a longer word pair no longer crashes.** Per-letter refs were created once at mount, so a later, longer `words` threw `Cannot read properties of undefined (reading 'current')`.
- **Works under SSR and React Server Components.** The built output used to `require('./index.css')` from CommonJS, which throws in Node. It now renders the first word as real text on the server.
- **Letters no longer pop in a frame late.** Measurement moved to `useLayoutEffect` (falling back to `useEffect` on the server so no warning is logged).
- **Positions are re-measured on resize**, orientation change, or a late webfont swap, instead of leaving every letter flying to a stale coordinate.
- **`fontToObserve` fixes:** the hook re-ran its effect on every render; omitting the prop called `document.fonts.load('16px "undefined"')`; a rejected font load left the component rendering `null` forever with no explanation.
- **Screen readers read the phrase once**, not three times. The two hidden measurement copies are `aria-hidden`.

### Added

- **TypeScript types**, hand-written and shipped in the package. `words` is a two-element tuple, so a third word is a compile error.
- **ESM build** (`dist/index.mjs`) alongside CommonJS, with an `exports` map, `sideEffects: false` and sourcemaps.
- **`DEFAULT_ANIMATION_OPTIONS`** is now exported from the entry point.
- **Rest props are forwarded** to the root element, so `className`, `id`, `style`, `data-*` and `aria-*` all work.
- **A test suite** of 21 tests. Nine of them fail against the 1.5.1 source.
- **CI that actually enforces things** — lint, typecheck, test and build on Node 20, 22 and 24. Previously CI ran only `npm run build`, and the linter had never run at all.
- **A LICENSE file.** `package.json` declared WTFPL but no license text was published.
- **A permanent hosted demo** on GitHub Pages, replacing a hand-maintained CodeSandbox link.
- **npm provenance** on publish.

### Removed

- **`core-js`** — the only runtime dependency, and unnecessary. `useBuiltIns: 'usage'` was injecting ES2025 iterator helpers and an `Error.cause` polyfill the code never used. **The package now has zero runtime dependencies.**
- **Babel**, `sass`, `cross-env` and `rimraf` from the toolchain. The library is built by Vite.
- A fake `uuidv4` that was used only for React keys.
- Dead files from the published tarball: a `.scss` source and a `.css.map` pointing at a file that was not included.

## 1.5.1 and earlier

See the [commit history](https://github.com/scottcanoni/react-anagram-animation/commits/main).
