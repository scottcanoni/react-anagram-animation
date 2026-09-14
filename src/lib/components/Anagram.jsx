/*
 * Index-based keys are correct in this file: within a given word pair the
 * letter arrays are fixed length and never reordered, so the index is the
 * stable identity. The letter is appended only to keep keys readable.
 */
/* eslint-disable react/no-array-index-key */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { randomMinMax } from '../utils';

/**
 * The only styles this component cannot live without. Everything cosmetic
 * (color, font, size, casing) is deliberately left to the consumer's own CSS,
 * which can target the `anagram-*` class names with no specificity fight.
 */
const STYLES = {
    root: { position: 'relative' },
    word: { position: 'relative' },
    // `visibility: hidden` and NOT `display: none`: the measurement words must
    // still participate in layout or offsetLeft/offsetTop return 0 and the
    // whole animation collapses. `left: -1000px` keeps the duplicated text out
    // of view; it is safe here because this component animates by a *relative
    // delta*, which is invariant to where the measured word actually sits.
    hidden: { position: 'absolute', left: '-1000px', visibility: 'hidden' },
    letter: { whiteSpace: 'pre', display: 'inline-block', position: 'relative', left: 0, top: 0, zIndex: 10 },
};

// Measuring must happen before paint, or the letters visibly pop in a frame
// late. Falling back to useEffect on the server avoids React's "useLayoutEffect
// does nothing on the server" warning in every SSR consumer's logs.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * The `typeof window.matchMedia === 'function'` check is not optional: jsdom
 * has no matchMedia, so omitting it breaks every consumer's test suite.
 */
function prefersReducedMotion() {
    return typeof window !== 'undefined'
        && typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Render and animate from one word to another word and back again.
 *
 * @param {[string, string]} words The 2 words to animate between.
 * @param {AnimationOptions} animationOptions Timing options for when to start, how fast forward/backwards, and when to loop.
 * @returns {JSX.Element}
 */
export default function Anagram({ words, animationOptions, className, style, ...rest }) {
    const [swapAnimations, setAnimations] = useState([]);
    const [isDegraded, setIsDegraded] = useState(false);
    const rootRef = useRef(null);
    const word1Ref = useRef(null);
    const word2Ref = useRef(null);
    const updateAnimation = useCallback((i, update = {}) => {
        setAnimations((prevState) => {
            const newState = [
                ...prevState,
            ];
            newState[i] = {
                ...prevState[i],
                ...update,
            };

            return newState;
        });
    }, [setAnimations]);

    const {
        randomStartMin,
        randomStartMax,
        randomReverseMin,
        randomReverseMax,
        loopAnimation,
        waitToStart,
        transitionDuration,
        timingFunction,
    } = animationOptions;

    // Depend on the two strings, never on the `words` array. An inline
    // `words={['a', 'b']}` is a new reference on every parent render, which
    // used to tear down and restart the animation from frame zero each time.
    const [word1, word2] = words;

    useIsomorphicLayoutEffect(() => {
        /**
         * Pair every source letter with an unused destination letter and record
         * where each end sits. Returns null when no such pairing exists, which
         * is the caller's cue to degrade instead of crash.
         */
        const buildSwaps = () => {
            const srcElements = word1Ref.current.children;
            const destElements = word2Ref.current.children;
            const destChars = [...word2];
            const destPaired = [];
            const swaps = [];

            for (const [i, letter] of [...word1].entries()) {
                const destLetterIndex = destChars.findIndex((destLetter, destIndex) => {
                    return destLetter.toLowerCase() === letter.toLowerCase()
                        && destPaired[destIndex] !== true;
                });

                if (destLetterIndex === -1) {
                    return null;
                }

                destPaired[destLetterIndex] = true; // mark this destination used

                const srcElement = srcElements[i];
                const destElement = destElements[destLetterIndex];

                swaps.push({
                    letter, // the displayed letter
                    destIndex: destLetterIndex, // needed to re-measure on resize
                    playing: false, // if this letter is animating to the destination
                    // the source location, starting place and letter
                    src: {
                        letter,
                        offsetLeft: srcElement.offsetLeft,
                        offsetTop: srcElement.offsetTop,
                    },
                    // the destination location and letter
                    dest: {
                        letter: destChars[destLetterIndex],
                        offsetLeft: destElement.offsetLeft,
                        offsetTop: destElement.offsetTop,
                    },
                });
            }

            return swaps;
        };

        const swaps = buildSwaps();

        if (swaps === null) {
            console.error(
                '[react-anagram-animation] Cannot animate because a letter of '
                + `"${word1}" has no unused match in "${word2}". The two words must be `
                + 'anagrams of each other, including spaces and punctuation. Use the '
                + 'exported isAnagram() helper to check first. Rendering the first '
                + 'word without animation.',
            );
            setIsDegraded(true);

            return undefined;
        }

        setIsDegraded(false);
        setAnimations(swaps);

        // Purely decorative motion, so honour the OS setting unconditionally
        // and leave the letters at rest.
        if (prefersReducedMotion()) {
            return undefined;
        }

        let cancelled = false;
        const timers = new Set();
        // Every timer is registered so it can be cancelled, and self-prunes on
        // fire so the set stays bounded despite the endless loop.
        const later = (fn, ms) => {
            const id = setTimeout(() => {
                timers.delete(id);

                if (!cancelled) {
                    fn();
                }
            }, ms);
            timers.add(id);
        };

        const animateFunc = () => {
            swaps.forEach((swap, i) => {
                // Animate each character towards the destination
                later(() => updateAnimation(i, { playing: true }), randomMinMax(randomStartMin, randomStartMax));

                // Animate each character back to their original location
                later(() => updateAnimation(i, { playing: false }), randomMinMax(randomReverseMin, randomReverseMax));
            });

            // Repeat forever. Registering the recursion is what makes it
            // cancellable.
            later(animateFunc, loopAnimation);
        };

        // Start the process
        later(animateFunc, waitToStart);

        // Offsets are captured once, so a viewport resize, an orientation
        // change or a late webfont swap would leave every letter flying to a
        // stale coordinate. Re-measure in place, preserving `playing` so a
        // transition already in flight simply retargets.
        const remeasure = () => {
            const srcElements = word1Ref.current.children;
            const destElements = word2Ref.current.children;

            setAnimations((previous) => previous.map((swap, i) => ({
                ...swap,
                src: {
                    ...swap.src,
                    offsetLeft: srcElements[i].offsetLeft,
                    offsetTop: srcElements[i].offsetTop,
                },
                dest: {
                    ...swap.dest,
                    offsetLeft: destElements[swap.destIndex].offsetLeft,
                    offsetTop: destElements[swap.destIndex].offsetTop,
                },
            })));
        };

        let frame = 0;
        // jsdom has no ResizeObserver, so this must stay optional.
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(remeasure);
        });

        observer?.observe(rootRef.current);

        // Without this the loop outlived unmount, and React 18/19 StrictMode
        // double-invocation left two permanently out-of-phase animations.
        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);
            timers.clear();
            observer?.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [word1, word2, updateAnimation, loopAnimation, randomReverseMax, randomReverseMin, randomStartMax, randomStartMin, waitToStart]);

    return (
        <div
            className={className ? `anagram-swap ${className}` : 'anagram-swap'}
            style={{ ...STYLES.root, ...style }}
            ref={rootRef}
            {...rest}
        >
            <div className="anagram-word anagram-word-1" style={{ ...STYLES.word, ...STYLES.hidden }} aria-hidden="true" ref={word1Ref}>
                {
                    [...word1].map((letter, i) => {
                        return <span className="anagram-letter" style={STYLES.letter} key={`${i}-${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="anagram-word anagram-word-2" style={{ ...STYLES.word, ...STYLES.hidden }} aria-hidden="true" ref={word2Ref}>
                {
                    [...word2].map((letter, i) => {
                        return <span className="anagram-letter" style={STYLES.letter} key={`${i}-${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="anagram-word anagram-word-animation" style={STYLES.word}>
                {
                    isDegraded
                        ? <span className="anagram-letter" style={STYLES.letter}>{word1}</span>
                        : swapAnimations.map((renderedLetter, i) => {
                            const { letter, playing, src, dest } = renderedLetter;

                            const letterStyles = {
                                ...STYLES.letter,
                                transition: `left ${transitionDuration}ms ${timingFunction}, top ${transitionDuration}ms ${timingFunction}`,
                            };

                            if (playing) {
                                letterStyles.left = `${dest.offsetLeft - src.offsetLeft}px`;
                                letterStyles.top = `${dest.offsetTop - src.offsetTop}px`;
                            }

                            return (
                                <span key={`${i}-${letter}`} className="anagram-letter" style={letterStyles}>
                                    {letter}
                                </span>
                            );
                        })
                }
            </div>
        </div>
    );
}
