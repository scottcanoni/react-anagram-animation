import React from 'react';
import useFonts from './useFonts';
import Anagram from './Anagram';
import { DEFAULT_ANIMATION_OPTIONS, DEFAULT_WORDS } from './constants';

import './index.css';

/**
 * Render and animate from one word to another word and back again.
 * @param {[string]} [words] The 2 words to animate between.
 * @param {AnimationOptions} [animationOptions] Timing options for when to start, how fast to animate forwards, backwards, and when to loop.
 * @param {string} [fontToObserve] A description of an embedded font to observe and wait until loaded.
 * @returns {JSX.Element|null}
 */
export default function Loader({ words = DEFAULT_WORDS, animationOptions = {}, fontToObserve }) {
    const isFontLoaded = useFonts(fontToObserve);

    return isFontLoaded ? <Anagram words={words} animationOptions={{
        ...DEFAULT_ANIMATION_OPTIONS,
        ...animationOptions,
    }} /> : null;
}
