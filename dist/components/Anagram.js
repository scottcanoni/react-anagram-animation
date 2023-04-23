"use strict";

require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Anagram;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var _utils = require("../utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
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
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "anagram-swap"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-1 hidden"
  }, [...words[0]].map((letter, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRefs1.current[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-2 hidden"
  }, [...words[1]].map((letter, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRefs2.current[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-animation"
  }, swapAnimations.map(renderedLetter => {
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
    return /*#__PURE__*/_react.default.createElement("span", {
      key: id,
      className: "letter",
      style: letterStyles
    }, letter);
  })));
}