"use strict";

require("core-js/modules/es.iterator.filter.js");
require("core-js/modules/es.iterator.for-each.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Anagram;
require("core-js/modules/es.error.cause.js");
require("core-js/modules/es.array.push.js");
require("core-js/modules/es.iterator.constructor.js");
require("core-js/modules/es.iterator.map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = require("react");
var _utils = require("../utils");
var _jsxRuntime = require("react/jsx-runtime");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /* eslint-disable react/no-array-index-key */ /**
 * Render and animate from one word to another word and back again.
 *
 * @param {[{string}]} words The 2 words to animate between.
 * @param {AnimationOptions} animationOptions Timing options for when to start, how fast forward/backwards, and when to loop.
 * @returns {JSX.Element}
 */
function Anagram(_ref) {
  let {
    words,
    animationOptions
  } = _ref;
  const [swapAnimations, setAnimations] = (0, _react.useState)([]);
  const lettersRefs1 = (0, _react.useRef)([...words[0]].map(() => /*#__PURE__*/(0, _react.createRef)()));
  const lettersRefs2 = (0, _react.useRef)([...words[1]].map(() => /*#__PURE__*/(0, _react.createRef)()));
  const updateAnimation = (0, _react.useCallback)(function (i) {
    let update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    setAnimations(prevState => {
      const newState = [...prevState];
      newState[i] = _objectSpread(_objectSpread({}, prevState[i]), update);
      return newState;
    });
  }, [setAnimations]);
  const {
    randomStartMin,
    randomStartMax,
    randomReverseMin,
    randomReverseMax,
    loopAnimation,
    waitToStart,
    transitionDuration,
    timingFunction
  } = animationOptions;
  (0, _react.useEffect)(() => {
    const swaps = [];
    const destLettersPairedByIndex = [];
    [...words[0]].forEach((letter, i) => {
      // Find a matching dest character to execute the swap with
      const destLetterIndex = [...words[1]].findIndex((destLetter, srcIndex) => {
        return destLetter.toLowerCase() === letter.toLowerCase() && destLettersPairedByIndex[srcIndex] !== true;
      });
      destLettersPairedByIndex[destLetterIndex] = true; // mark this source paired/used

      if (destLetterIndex === -1) {
        throw new Error("Not sure how to animate since all source letters were paired already, disappear maybe?");
      }

      // If the text wraps then the offset left isn't correct.
      const swap = {
        id: (0, _utils.uuidv4)(),
        // for a unique key
        letter,
        // the displayed letter
        playing: false,
        // if this letter is animating to the destination
        // the source location, starting place and letter
        src: {
          letter: words[0][i],
          element: lettersRefs1.current[i].current,
          offsetLeft: lettersRefs1.current[i].current.offsetLeft,
          offsetTop: lettersRefs1.current[i].current.offsetTop
        },
        // the destination location and letter
        dest: {
          letter: words[1][destLetterIndex],
          element: lettersRefs2.current[destLetterIndex].current,
          offsetLeft: lettersRefs2.current[destLetterIndex].current.offsetLeft,
          offsetTop: lettersRefs2.current[destLetterIndex].current.offsetTop
        }
      };
      swaps.push(swap);
    });
    setAnimations(swaps);
    const animateFunc = () => {
      swaps.forEach((swap, i) => {
        // Animate each character towards the destination
        const forwardStartTime = (0, _utils.randomMinMax)(randomStartMin, randomStartMax);
        setTimeout(() => {
          updateAnimation(i, {
            playing: true
          });
        }, forwardStartTime);

        // Animate each character back to their original location
        const reverseStartTime = (0, _utils.randomMinMax)(randomReverseMin, randomReverseMax);
        setTimeout(() => {
          updateAnimation(i, {
            playing: false
          });
        }, reverseStartTime);
      });

      // Repeat forever
      setTimeout(() => {
        animateFunc();
      }, loopAnimation);
    };

    // Start the process
    setTimeout(() => {
      animateFunc();
    }, waitToStart);
  }, [lettersRefs1, lettersRefs2, loopAnimation, updateAnimation, randomReverseMax, randomReverseMin, randomStartMax, randomStartMin, waitToStart, transitionDuration, timingFunction, words]);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "anagram-swap",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "word word-1 hidden",
      children: [...words[0]].map((letter, i) => {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          ref: lettersRefs1.current[i],
          className: "letter",
          children: letter
        }, "".concat(i).concat(letter));
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "word word-2 hidden",
      children: [...words[1]].map((letter, i) => {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          ref: lettersRefs2.current[i],
          className: "letter",
          children: letter
        }, "".concat(i).concat(letter));
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "word word-animation",
      children: swapAnimations.map(renderedLetter => {
        const {
          id,
          letter,
          playing,
          src,
          dest
        } = renderedLetter;
        const letterStyles = {
          transition: "left ".concat(transitionDuration, "ms ").concat(timingFunction, ", top ").concat(transitionDuration, "ms ").concat(timingFunction)
        };
        if (playing) {
          letterStyles.left = "".concat(dest.offsetLeft - src.offsetLeft, "px");
          letterStyles.top = "".concat(dest.offsetTop - src.offsetTop, "px");
        }
        return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          className: "letter",
          style: letterStyles,
          children: letter
        }, id);
      })
    })]
  });
}