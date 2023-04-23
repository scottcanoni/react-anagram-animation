import { useEffect, useState } from 'react';

export default function useFonts(...fontNames) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Inspired by https://stackoverflow.com/a/60138011
        if (!document || !document.fonts) {
            // eslint-disable-next-line no-console
            console.warn('Browser does not support document.fonts API');
            setIsLoaded(true);

            return;
        }

        Promise.all(fontNames.map((fontName) => document.fonts.load(`16px "${fontName}"`))).then(() => {
            setIsLoaded(true);
        });
    }, [fontNames]);

    return isLoaded;
};
