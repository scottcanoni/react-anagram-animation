"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Loader;

var _react = _interopRequireDefault(require("react"));

var _useFontFaceObserver = _interopRequireDefault(require("use-font-face-observer"));

var _Anagram = _interopRequireDefault(require("./Anagram"));

var _constants = require("./constants");

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
function Loader(_ref) {
  let {
    words = _constants.DEFAULT_WORDS,
    animationOptions = {},
    fontToObserve
  } = _ref;

  const animOptions = _objectSpread(_objectSpread({}, _constants.DEFAULT_ANIMATION_OPTIONS), animationOptions);

  const isFontLoaded = (0, _useFontFaceObserver.default)(fontToObserve ? [fontToObserve] : []);
  return isFontLoaded ? /*#__PURE__*/_react.default.createElement(_Anagram.default, {
    words: words,
    animationOptions: animOptions
  }) : null;
}