"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Loader;
require("core-js/modules/es.symbol.description.js");
var _react = _interopRequireDefault(require("react"));
var _useFonts = _interopRequireDefault(require("./useFonts"));
var _Anagram = _interopRequireDefault(require("./Anagram"));
var _constants = require("./constants");
require("./index.css");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Render and animate from one word to another word and back again.
 * @param {[string]} [words] The 2 words to animate between.
 * @param {AnimationOptions} [animationOptions] Timing options for when to start, how fast to animate forwards, backwards, and when to loop.
 * @param {string} [fontToObserve] A description of an embedded font to observe and wait until loaded.
 * @returns {JSX.Element|null}
 */
function Loader(_ref) {
  let {
    words = _constants.DEFAULT_WORDS,
    animationOptions = {},
    fontToObserve
  } = _ref;
  const isFontLoaded = (0, _useFonts.default)(fontToObserve);
  return isFontLoaded ? /*#__PURE__*/_react.default.createElement(_Anagram.default, {
    words: words,
    animationOptions: _objectSpread(_objectSpread({}, _constants.DEFAULT_ANIMATION_OPTIONS), animationOptions)
  }) : null;
}