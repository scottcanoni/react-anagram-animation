"use strict";

require("core-js/modules/es.array.push.js");
require("core-js/modules/es.iterator.constructor.js");
require("core-js/modules/es.iterator.filter.js");
require("core-js/modules/es.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Loader;
require("core-js/modules/es.error.cause.js");
var _useFonts = _interopRequireDefault(require("./useFonts"));
var _Anagram = _interopRequireDefault(require("./Anagram"));
var _constants = require("./constants");
require("./index.css");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
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
  return isFontLoaded ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Anagram.default, {
    words: words,
    animationOptions: _objectSpread(_objectSpread({}, _constants.DEFAULT_ANIMATION_OPTIONS), animationOptions)
  }) : null;
}