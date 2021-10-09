import React from 'react';
import useFontFaceObserver from 'use-font-face-observer';
import Anagram from './Anagram';
import { DEFAULT_ANIMATION_OPTIONS, DEFAULT_WORDS } from './constants';

import './index.css';

/**
 * @typedef FontToObserve A description of an embedded font to observe and wait until loaded.
 * @property {string} [family] The font-family: Roboto, Inter, Open Sans, etc
 * @property {string|number} [weight] The font-weight: normal, bold, 800, etc
 * @property {string} [style] The font-style: normal, italic, oblique
 * @property {string} [stretch] The font stretch: normal, condensed, expanded, etc
 */

/**
 * Render and animate from one word to another word and back again.
 * @param {[{string}]} [words] The 2 words to animate between.
 * @param {AnimationOptions} [animationOptions] Timing options for when to start, how fast to animate forwards, backwards, and when to loop.
 * @param {FontToObserve} [fontToObserve] A description of an embedded font to observe and wait until loaded.
 * @returns {JSX.Element|null}
 */
export default function Loader ({ words = DEFAULT_WORDS, animationOptions = {}, fontToObserve }) {
    const animOptions = {
        ...DEFAULT_ANIMATION_OPTIONS,
        ...animationOptions,
    };

    const isFontLoaded = useFontFaceObserver(fontToObserve ? [fontToObserve] : []);

    return isFontLoaded ? <Anagram words={words} animationOptions={animOptions} /> : null;
}
