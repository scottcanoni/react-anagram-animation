/* eslint-disable react/no-array-index-key */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { randomMinMax, uuidv4 } from '../utils';

/**
 * Render and animate from one word to another word and back again.
 *
 * @param {[{string}]} words The 2 words to animate between.
 * @param {AnimationOptions} animationOptions Timing options for when to start, how fast forward/backwards, and when to loop.
 * @returns {JSX.Element}
 */
export default function Anagram({ words, animationOptions }) {
    const [swapAnimations, setAnimations] = useState([]);
    const lettersRefs1 = useRef([...words[0]].map(() => createRef()));
    const lettersRefs2 = useRef([...words[1]].map(() => createRef()));
    const updateAnimation = useCallback((i, update = {}) => {
        setAnimations((prevState) => {
            const newState = [
                ...prevState,
            ];
            newState[i] = {
                ...prevState[i],
                ...update,
            }

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
                id: uuidv4(), // for a unique key
                letter, // the displayed letter
                playing: false, // if this letter is animating to the destination
                // the source location, starting place and letter
                src: {
                    letter: words[0][i],
                    element: lettersRefs1.current[i].current,
                    offsetLeft: lettersRefs1.current[i].current.offsetLeft,
                    offsetTop: lettersRefs1.current[i].current.offsetTop,
                    // rect: lettersRefs1.current[i].current.getBoundingClientRect(),
                },
                // the destination location and letter
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

        setAnimations(swaps);

        const animateFunc = () => {
            swaps.forEach((swap, i) => {
                // Animate each character towards the destination
                const forwardStartTime = randomMinMax(randomStartMin, randomStartMax);
                setTimeout(() => {
                    updateAnimation(i, { playing: true });
                }, forwardStartTime);

                // Animate each character back to their original location
                const reverseStartTime = randomMinMax(randomReverseMin, randomReverseMax);
                setTimeout(() => {
                    updateAnimation(i, { playing: false });
                }, reverseStartTime);
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

    }, [lettersRefs1, lettersRefs2, loopAnimation, updateAnimation, randomReverseMax, randomReverseMin, randomStartMax, randomStartMin, waitToStart, words]);

    return (
        <div className="anagram-swap">
            <div className="word word-1 hidden">
                {
                    [...words[0]].map((letter, i) => {
                        // eslint-disable-next-line react/no-array-index-key
                        return <span ref={lettersRefs1.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-2 hidden">
                {
                    [...words[1]].map((letter, i) => {
                        // eslint-disable-next-line react/no-array-index-key
                        return <span ref={lettersRefs2.current[i]} className="letter" key={`${i}${letter}`}>{letter}</span>;
                    })
                }
            </div>
            <div className="word word-animation">
                {
                    swapAnimations.map((renderedLetter, i) => {
                        const { id, letter, playing, src, dest } = renderedLetter;

                        let letterStyles = {};
                        if (playing) {
                            const left = `${dest.offsetLeft - src.offsetLeft}px`;
                            const top = `${dest.offsetTop - src.offsetTop}px`;
                            // Trying to fix issue with wrapped text
                            // const left = `${dest.rect.x - src.rect.x}px`;
                            // const top = `${dest.rect.y - src.rect.y}px`;
                            letterStyles = { left, top };
                        }

                        return (
                            <span key={id} className="letter" style={letterStyles}>
                                {letter}
                            </span>
                        );
                    })
                }
            </div>
        </div>
    );
}
