/* eslint-disable react/no-array-index-key */
import React, { createRef, useEffect, useState, useCallback } from 'react';
import { randomMinMax } from '../utils';
import useFontFaceObserver from 'use-font-face-observer';

const DEFAULT_WORDS = ['TacosNTonic', 'ScottCanoni'];

export default function Anagram({ family, weight, style, stretch, words = DEFAULT_WORDS }) {
    const wordContainerRef1 = createRef();
    const wordContainerRef2 = createRef();
    const animationContainerRef = createRef();
    const lettersRef1 = [...words[0]].map(() => createRef());
    const lettersRef2 = [...words[1]].map(() => createRef());
    const animationLettersRef = [...words[0]].map(() => createRef());
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

    /* @type FontFace */
    const fontFace = {
        family,
        weight,
        style,
        stretch,
    };

    const isFontLoaded = useFontFaceObserver(family ? [fontFace] : []);

    useEffect(() => {
        if (!isFontLoaded) {
            // wait until fonts are loaded
            return;
        }

        const swaps = [];
        const destLettersPairedByIndex = [];

        [...words[0]].forEach((letter, i) => {
            if (!letter.trim()) { // ignore spaces
                return;
            }

            // Find a matching dest character to execute the swap with
            const destLetterIndex = [...words[1]].findIndex((destLetter, srcIndex) => {
                return destLetter.toLowerCase() === letter.toLowerCase()
                    && destLettersPairedByIndex[srcIndex] !== true;
            });
            destLettersPairedByIndex[destLetterIndex] = true; // mark this source paired/used

            if (destLetterIndex === -1) {
                throw new Error(`Not sure how to animate since all source letters were paired already, disappear maybe?`);
            }

            const swap = {
                src: {
                    letter,
                    element: lettersRef1[i].current,
                    offsetLeft: lettersRef1[i].current.offsetLeft,
                },
                dest: {
                    letter: words[1][destLetterIndex],
                    element: lettersRef2[destLetterIndex].current,
                    offsetLeft: lettersRef2[destLetterIndex].current.offsetLeft,
                },
            };
            swaps.push(swap);
        });

        setSwapAnimations(swaps);

        const animateFunc = () => {
            swaps.forEach((swap, i) => {
                setTimeout(() => {
                    playAnimation(i);
                }, randomMinMax(0, 3000));

                setTimeout(() => {
                    playAnimation(i, false);
                }, randomMinMax(6000, 9000));
            });

            setTimeout(() => {
                animateFunc();
            }, 12000);
        };

        animateFunc();

    }, [isFontLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="anagram-swap">
            <div className="word word-1 hidden" ref={wordContainerRef1}>
                {
                    [...words[0]].map((letter, i) => {
                        return <span ref={lettersRef1[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-2 hidden" ref={wordContainerRef2}>
                {
                    [...words[1]].map((letter, i) => {
                        return <span ref={lettersRef2[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-animation" ref={animationContainerRef}>
                {
                    [...words[0]].map((letter, i) => {
                        let letterStyles = {};
                        const swap = swapAnimations[i];
                        if (isFontLoaded && swap && swap.playing) {
                            const left = `${swap.dest.offsetLeft - swap.src.offsetLeft}px`;
                            letterStyles = { left };
                        }

                        return (
                            <span
                                key={`${i}${letter}`}
                                className="letter"
                                style={letterStyles}
                                ref={animationLettersRef[i]}
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
