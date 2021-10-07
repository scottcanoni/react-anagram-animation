"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAnagram = isAnagram;
exports.randomMinMax = randomMinMax;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.sort.js");

require("core-js/modules/es.string.split.js");

function isAnagram(stringA, stringB) {
  // Sanitizing
  stringA = stringA.toLowerCase().replace(/[\W_]+/g, '');
  stringB = stringB.toLowerCase().replace(/[\W_]+/g, ''); // Sorting

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


function randomMinMax() {
  let min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  let max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  return Math.floor(Math.random() * (max - min)) + min;
}