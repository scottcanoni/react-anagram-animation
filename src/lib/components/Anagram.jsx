/* eslint-disable react/no-array-index-key */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { randomMinMax } from '../utils';

/**
 * Render and animate from one word to another word and back again.
 *
 * @param {[{string}]} words The 2 words to animate between.
 * @param {AnimationOptions} animationOptions Timing options for when to start, how fast forward/backwards, and when to loop.
 * @returns {JSX.Element}
 */
export default function Anagram({ words, animationOptions }) {
    const lettersRefs1 = useRef([...words[0]].map(() => createRef()));
    const lettersRefs2 = useRef([...words[1]].map(() => createRef()));
    const [swapAnimations, setSwapAnimations] = useState({});
    const playAnimation = useCallback((i, playing = true) => {
        setSwapAnimations((prevState) => {
            return {
                ...prevState,
                [i]: {
                    ...prevState[i],
                    playing,
                },
            };
        });
    }, [setSwapAnimations]);

    const {
        randomStartMin,
        randomStartMax,
        randomReverseMin,
        randomReverseMax,
        loopAnimation,
        waitToStart,
    } = animationOptions;

    useEffect(() => {
        const swaps = [];
        const destLettersPairedByIndex = [];

        [...words[0]].forEach((letter, i) => {
            // Find a matching dest character to execute the swap with
            const destLetterIndex = [...words[1]].findIndex((destLetter, srcIndex) => {
                return destLetter.toLowerCase() === letter.toLowerCase()
                    && destLettersPairedByIndex[srcIndex] !== true;
            });
            destLettersPairedByIndex[destLetterIndex] = true; // mark this source paired/used

            if (destLetterIndex === -1) {
                throw new Error(`Not sure how to animate since all source letters were paired already, disappear maybe?`);
            }

            // If the text wraps then the offset left isn't correct.
            const swap = {
                src: {
                    letter,
                    element: lettersRefs1.current[i].current,
                    offsetLeft: lettersRefs1.current[i].current.offsetLeft,
                    offsetTop: lettersRefs1.current[i].current.offsetTop,
                    // rect: lettersRefs1.current[i].current.getBoundingClientRect(),
                },
                dest: {
                    letter: words[1][destLetterIndex],
                    element: lettersRefs2.current[destLetterIndex].current,
                    offsetLeft: lettersRefs2.current[destLetterIndex].current.offsetLeft,
                    offsetTop: lettersRefs2.current[destLetterIndex].current.offsetTop,
                    // rect: lettersRefs2.current[destLetterIndex].current.getBoundingClientRect(),
                },
            };
            swaps.push(swap);
        });

        setSwapAnimations(swaps);

        const animateFunc = () => {
            swaps.forEach((swap, i) => {
                // Animate each character towards the destination
                setTimeout(() => {
                    playAnimation(i);
                }, randomMinMax(randomStartMin, randomStartMax));

                // Animate each character back to their original location
                setTimeout(() => {
                    playAnimation(i, false);
                }, randomMinMax(randomReverseMin, randomReverseMax));
            });

            // Repeat forever
            setTimeout(() => {
                animateFunc();
            }, loopAnimation);
        };

        // Start the process
        setTimeout(() => {
            animateFunc();
        }, waitToStart);

    }, [lettersRefs1, lettersRefs2, loopAnimation, playAnimation, randomReverseMax, randomReverseMin, randomStartMax, randomStartMin, waitToStart, words]);

    return (
        <div className="anagram-swap">
            <div className="word word-1 hidden">
                {
                    [...words[0]].map((letter, i) => {
                        return <span ref={lettersRefs1.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-2 hidden">
                {
                    [...words[1]].map((letter, i) => {
                        return <span ref={lettersRefs2.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-animation">
                {
                    [...words[0]].map((letter, i) => {
                        let letterStyles = {};
                        const swap = swapAnimations[i];
                        if (swap && swap.playing) {
                            const left = `${swap.dest.offsetLeft - swap.src.offsetLeft}px`;
                            const top = `${swap.dest.offsetTop - swap.src.offsetTop}px`;
                            // Trying to fix issue with wrapped text
                            // const left = `${swap.dest.rect.x - swap.src.rect.x}px`;
                            // const top = `${swap.dest.rect.y - swap.src.rect.y}px`;
                            letterStyles = { left, top };
                        }

                        return (
                            <span
                                key={`${i}${letter}`}
                                className="letter"
                                style={letterStyles}
                            >
                                {letter}
                            </span>
                        );
                    })
                }
            </div>
        </div>
    );
}
