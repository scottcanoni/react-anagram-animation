"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Anagram;

require("core-js/modules/web.dom-collections.iterator.js");

var _react = _interopRequireWildcard(require("react"));

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    waitToStart
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
      } // If the text wraps then the offset left isn't correct.


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
          offsetTop: lettersRefs1.current[i].current.offsetTop // rect: lettersRefs1.current[i].current.getBoundingClientRect(),

        },
        // the destination location and letter
        dest: {
          letter: words[1][destLetterIndex],
          element: lettersRefs2.current[destLetterIndex].current,
          offsetLeft: lettersRefs2.current[destLetterIndex].current.offsetLeft,
          offsetTop: lettersRefs2.current[destLetterIndex].current.offsetTop // rect: lettersRefs2.current[destLetterIndex].current.getBoundingClientRect(),

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
        }, forwardStartTime); // Animate each character back to their original location

        const reverseStartTime = (0, _utils.randomMinMax)(randomReverseMin, randomReverseMax);
        setTimeout(() => {
          updateAnimation(i, {
            playing: false
          });
        }, reverseStartTime);
      }); // Repeat forever

      setTimeout(() => {
        animateFunc();
      }, loopAnimation);
    }; // Start the process


    setTimeout(() => {
      animateFunc();
    }, waitToStart);
  }, [lettersRefs1, lettersRefs2, loopAnimation, updateAnimation, randomReverseMax, randomReverseMin, randomStartMax, randomStartMin, waitToStart, words]);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "anagram-swap"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-1 hidden"
  }, [...words[0]].map((letter, i) => {
    // eslint-disable-next-line react/no-array-index-key
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRefs1.current[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-2 hidden"
  }, [...words[1]].map((letter, i) => {
    // eslint-disable-next-line react/no-array-index-key
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRefs2.current[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-animation"
  }, swapAnimations.map((renderedLetter, i) => {
    const {
      id,
      letter,
      playing,
      src,
      dest
    } = renderedLetter;
    let letterStyles = {};

    if (playing) {
      const left = "".concat(dest.offsetLeft - src.offsetLeft, "px");
      const top = "".concat(dest.offsetTop - src.offsetTop, "px"); // Trying to fix issue with wrapped text
      // const left = `${dest.rect.x - src.rect.x}px`;
      // const top = `${dest.rect.y - src.rect.y}px`;

      letterStyles = {
        left,
        top
      };
    }

    return /*#__PURE__*/_react.default.createElement("span", {
      key: id,
      className: "letter",
      style: letterStyles
    }, letter);
  })));
}