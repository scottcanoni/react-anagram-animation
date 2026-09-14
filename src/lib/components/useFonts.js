import { useEffect, useState } from 'react';

/**
 * Wait for an embedded font to load before reporting ready.
 *
 * Resolves immediately when no font is named, when there is no DOM (SSR), or
 * when the browser has no `document.fonts`. Seeding state with `!fontName`
 * means the server renders real markup instead of nothing in the common case.
 *
 * @param {string} [fontName] Font family name to await.
 * @returns {boolean} Whether it is safe to measure and animate.
 */
export default function useFonts(fontName) {
    const [isLoaded, setIsLoaded] = useState(!fontName);

    useEffect(() => {
        // `typeof document` and not `!document`: a bare `document` reference
        // is a ReferenceError under Node, not a falsy value.
        if (!fontName || typeof document === 'undefined' || !document.fonts) {
            setIsLoaded(true);

            return undefined;
        }

        let cancelled = false;
        const done = () => {
            if (!cancelled) {
                setIsLoaded(true);
            }
        };

        // Both handlers are `done` on purpose. `document.fonts.load` rejects on
        // an unparseable font shorthand, and leaving `isLoaded` false would
        // render nothing forever with no clue why. Degrade to animating.
        document.fonts.load(`16px "${fontName}"`).then(done, done);

        return () => {
            cancelled = true;
        };
    }, [fontName]);

    return isLoaded;
}
