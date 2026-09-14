import { StrictMode } from 'react';
import { act, render, cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import Anagram from './index';

/*
 * jsdom does no layout: offsetLeft/offsetTop are hardcoded to 0, so every
 * computed delta would be "0px" and the moved state would be indistinguishable
 * from the resting state. Stubbing the offsets with a letter's index within its
 * own word gives a deterministic fake layout, which makes both the playing
 * state machine and the delta arithmetic observable.
 *
 * These are still not real pixels. That the letters land in the right place on
 * screen is verified in a browser, not here.
 */
const COLUMN_WIDTH = 10;
const descriptors = {};

beforeAll(() => {
    descriptors.offsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
    descriptors.offsetTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetTop');

    Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
        configurable: true,
        get() {
            return [...(this.parentElement?.children ?? [])].indexOf(this) * COLUMN_WIDTH;
        },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetTop', { configurable: true, get: () => 0 });
});

afterAll(() => {
    for (const [name, descriptor] of Object.entries(descriptors)) {
        if (descriptor) {
            Object.defineProperty(HTMLElement.prototype, name, descriptor);
        }
        else {
            delete HTMLElement.prototype[name];
        }
    }
});

const WORDS = ['bad credit', 'debit card'];
const LETTER_COUNT = WORDS[0].length; // 10

// min === max everywhere so the RNG cannot make these flake.
const DETERMINISTIC = {
    waitToStart: 100,
    randomStartMin: 1000,
    randomStartMax: 1000,
    randomReverseMin: 5000,
    randomReverseMax: 5000,
    loopAnimation: 10000,
    transitionDuration: 500,
    timingFunction: 'linear',
};

const animatedLetters = (container) => [
    ...container.querySelectorAll('.anagram-word-animation .anagram-letter'),
];

// Timer callbacks call setState, so they have to run inside act() for React to
// flush the re-render before the assertions look at the DOM.
const advance = (ms) => act(() => {
    vi.advanceTimersByTime(ms);
});

beforeEach(() => {
    vi.useFakeTimers();
});

afterEach(() => {
    cleanup();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe('<Anagram>', () => {
    it('renders every letter of the first word in the animation layer', () => {
        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        expect(animatedLetters(container).map((el) => el.textContent).join('')).toBe(WORDS[0]);
    });

    it('clears every timer on unmount so the loop cannot outlive the component', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const { unmount } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        expect(vi.getTimerCount()).toBeGreaterThan(0);

        unmount();
        expect(vi.getTimerCount()).toBe(0);

        // Nothing may resurrect the loop, and no setState-after-unmount warning.
        advance(60_000);
        expect(vi.getTimerCount()).toBe(0);
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('runs a single animation loop under StrictMode, not two out of phase', () => {
        render(
            <StrictMode>
                <Anagram words={WORDS} animationOptions={DETERMINISTIC} />
            </StrictMode>,
        );

        // Past waitToStart, animateFunc has scheduled two timers per letter
        // plus one for the next loop. Double invocation would double this.
        advance(DETERMINISTIC.waitToStart + 1);
        expect(vi.getTimerCount()).toBe(LETTER_COUNT * 2 + 1);
    });

    it('toggles letters into and back out of the moved state', () => {
        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        const isMoved = () => animatedLetters(container).some((el) => el.style.left !== '0px');

        expect(isMoved()).toBe(false);

        // waitToStart + randomStart
        advance(DETERMINISTIC.waitToStart + DETERMINISTIC.randomStartMin + 1);
        expect(isMoved()).toBe(true);

        // ...and back again at randomReverse
        advance(DETERMINISTIC.randomReverseMin);
        expect(isMoved()).toBe(false);
    });

    it('offsets each letter by the distance between its source and destination', () => {
        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        advance(DETERMINISTIC.waitToStart + DETERMINISTIC.randomStartMin + 1);

        // 'b' is at index 0 of "bad credit" and index 2 of "debit card", so it
        // travels two columns right. 'd' is at index 2 and pairs with the 'd'
        // at index 0, so it travels two columns left.
        const letters = animatedLetters(container);

        expect(letters[0].textContent).toBe('b');
        expect(letters[0].style.left).toBe(`${2 * COLUMN_WIDTH}px`);
        expect(letters[2].textContent).toBe('d');
        expect(letters[2].style.left).toBe(`${-2 * COLUMN_WIDTH}px`);
    });

    it('keeps looping after one full cycle', () => {
        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);
        const isMoved = () => animatedLetters(container).some((el) => el.style.left !== '0px');

        advance(DETERMINISTIC.waitToStart + DETERMINISTIC.loopAnimation);
        advance(DETERMINISTIC.randomStartMin + 1);

        expect(isMoved()).toBe(true);
        expect(vi.getTimerCount()).toBeGreaterThan(0);
    });

    it('renders at rest and schedules nothing when reduced motion is preferred', () => {
        vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));

        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        expect(animatedLetters(container)).toHaveLength(LETTER_COUNT);
        expect(vi.getTimerCount()).toBe(0);

        advance(60_000);
        expect(animatedLetters(container).every((el) => el.style.left === '0px')).toBe(true);
    });

    it('degrades instead of throwing when the words are not anagrams', () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<Anagram words={['abc', 'xyz']} animationOptions={DETERMINISTIC} />)).not.toThrow();

        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy.mock.calls[0][0]).toContain('react-anagram-animation');
    });

    it('still shows the first word when it cannot animate', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});

        const { container } = render(<Anagram words={['abc', 'xyz']} animationOptions={DETERMINISTIC} />);

        expect(container.querySelector('.anagram-word-animation').textContent).toBe('abc');
    });

    it('forwards unknown props to the root element', () => {
        const { container } = render(
            <Anagram words={WORDS} animationOptions={DETERMINISTIC} id="hero" data-testid="swap" />,
        );
        const root = container.querySelector('.anagram-swap');

        expect(root.id).toBe('hero');
        expect(root.getAttribute('data-testid')).toBe('swap');
    });

    it('hides the two measurement words from assistive technology', () => {
        const { container } = render(<Anagram words={WORDS} animationOptions={DETERMINISTIC} />);

        expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(2);
        expect(container.querySelector('.anagram-word-animation').getAttribute('aria-hidden')).toBeNull();
    });
});
