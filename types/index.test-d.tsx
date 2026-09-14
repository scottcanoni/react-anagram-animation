/*
 * Compile-time guard for the hand-written index.d.ts. This file is never
 * shipped and never run; `npm run typecheck` failing is the whole point.
 */
import Anagram, { isAnagram, DEFAULT_ANIMATION_OPTIONS, type AnimationOptions } from '../src/lib';

const matches: boolean = isAnagram('bad credit', 'debit card');
const options: AnimationOptions = { waitToStart: 0, timingFunction: 'ease-in-out' };
const loopDefault: number = DEFAULT_ANIMATION_OPTIONS.loopAnimation;

export const usage = (
    <>
        <Anagram />
        <Anagram words={['bad credit', 'debit card']} animationOptions={options} />
        <Anagram fontToObserve="Open Sans" className="hero" id="x" data-testid="y" />

        {/* @ts-expect-error three words is not a valid pair */}
        <Anagram words={['a', 'b', 'c']} />

        {/* @ts-expect-error timings are numbers, not strings */}
        <Anagram animationOptions={{ waitToStart: '500' }} />

        {/* @ts-expect-error unknown props are still rejected */}
        <Anagram notARealProp={1} />
    </>
);

export { matches, loopDefault };
