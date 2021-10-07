export function isAnagram(stringA, stringB) {
    // Sanitizing
    stringA = stringA.toLowerCase().replace(/[\W_]+/g, '');
    stringB = stringB.toLowerCase().replace(/[\W_]+/g, '');

    // Sorting
    const stringASorted = stringA.split('').sort().join('');
    const stringBSorted = stringB.split('').sort().join('');

    return stringASorted === stringBSorted;
}

/**
 * Get a random number between `min` and `max`
 * @param {number} min The minimum number you want to include in the random output
 * @param {number} max The maximum number you want to include in the random output
 * @returns {number} A random number including and between the `min` and `max`
 */
export function randomMinMax(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min;
}
