import { useState } from 'react';
import { act, render, cleanup, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useFonts from './useFonts';

function Probe({ fontName }) {
    const isLoaded = useFonts(fontName);

    return <span data-testid="state">{isLoaded ? 'loaded' : 'waiting'}</span>;
}

/** Re-renders its child without changing the font name. */
function Rerenderer({ fontName }) {
    const [, setTick] = useState(0);

    return (
        <>
            <button type="button" onClick={() => setTick((n) => n + 1)}>rerender</button>
            <Probe fontName={fontName} />
        </>
    );
}

let load;

beforeEach(() => {
    load = vi.fn().mockResolvedValue([]);
    // jsdom has no FontFaceSet, so it has to be supplied.
    Object.defineProperty(document, 'fonts', { value: { load }, configurable: true });
});

afterEach(() => {
    cleanup();
    delete document.fonts;
    vi.restoreAllMocks();
});

describe('useFonts', () => {
    it('never asks the browser to load a font when none was named', async () => {
        render(<Probe />);

        // The old rest-param signature produced document.fonts.load('16px "undefined"').
        expect(load).not.toHaveBeenCalled();
        expect(screen.getByTestId('state').textContent).toBe('loaded');
    });

    it('loads the named font exactly once across re-renders', async () => {
        const { rerender } = render(<Rerenderer fontName="Open Sans" />);

        await act(async () => {
            rerender(<Rerenderer fontName="Open Sans" />);
            rerender(<Rerenderer fontName="Open Sans" />);
        });

        // The deps array used to be a fresh array each render, so this ran
        // on every single render.
        expect(load).toHaveBeenCalledTimes(1);
        expect(load).toHaveBeenCalledWith('16px "Open Sans"');
    });

    it('re-runs when the font name actually changes', async () => {
        const { rerender } = render(<Probe fontName="Open Sans" />);

        await act(async () => {
            rerender(<Probe fontName="Roboto" />);
        });

        expect(load).toHaveBeenCalledTimes(2);
    });

    it('renders anyway when the font fails to load', async () => {
        load.mockRejectedValue(new Error('bad font shorthand'));

        render(<Probe fontName="Bad )( Font" />);

        // Without the rejection handler this stayed "waiting" forever and the
        // component rendered null with no clue why.
        await vi.waitFor(() => {
            expect(screen.getByTestId('state').textContent).toBe('loaded');
        });
    });
});
