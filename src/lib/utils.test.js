import { describe, expect, it } from 'vitest';
import { isAnagram, randomMinMax } from './utils';

describe('isAnagram', () => {
    it('accepts a real anagram pair regardless of case, spaces and punctuation', () => {
        expect(isAnagram('bad credit', 'debit card')).toBe(true);
        expect(isAnagram('React Anagram Animation', 'Magenta Raincoat Airman')).toBe(true);
        expect(isAnagram("A gentleman!", 'Elegant man')).toBe(true);
    });

    it('rejects words that are not anagrams', () => {
        expect(isAnagram('abc', 'xyz')).toBe(false);
        expect(isAnagram('abc', 'abcd')).toBe(false);
        expect(isAnagram('aab', 'abb')).toBe(false);
    });
});

describe('randomMinMax', () => {
    it('stays within the requested range', () => {
        for (let i = 0; i < 100; i += 1) {
            const value = randomMinMax(5, 10);
            expect(value).toBeGreaterThanOrEqual(5);
            expect(value).toBeLessThanOrEqual(10);
        }
    });

    it('returns the bound when min equals max, which the tests rely on for determinism', () => {
        expect(randomMinMax(7, 7)).toBe(7);
    });
});
