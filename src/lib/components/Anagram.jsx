/* eslint-disable react/no-array-index-key */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { randomMinMax } from '../utils';
import useFontFaceObserver from 'use-font-face-observer';

const DEFAULT_WORDS = ['TacosNTonic', 'ScottCanoni'];

export default function Anagram({ family, weight, style, stretch, words = DEFAULT_WORDS }) {
    const wordContainerRef1 = createRef();
    const wordContainerRef2 = createRef();
    const animationContainerRef = createRef();
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

    /* @type FontFace */
    const fontFace = {
        family,
        weight,
        style,
        stretch,
    };
    const enableFontFaceObserver = family || weight || style || stretch;
    const isFontLoaded = useFontFaceObserver(enableFontFaceObserver ? [fontFace] : []);

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
                    element: lettersRefs1.current[i].current,
                    offsetLeft: lettersRefs1.current[i].current.offsetLeft,
                },
                dest: {
                    letter: words[1][destLetterIndex],
                    element: lettersRefs2.current[destLetterIndex].current,
                    offsetLeft: lettersRefs2.current[destLetterIndex].current.offsetLeft,
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

    }, [isFontLoaded, lettersRefs1, lettersRefs2, playAnimation, words]);

    return (
        <div className="anagram-swap">
            <div className="word word-1 hidden" ref={wordContainerRef1}>
                {
                    [...words[0]].map((letter, i) => {
                        return <span ref={lettersRefs1.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-2 hidden" ref={wordContainerRef2}>
                {
                    [...words[1]].map((letter, i) => {
                        return <span ref={lettersRefs2.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
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
