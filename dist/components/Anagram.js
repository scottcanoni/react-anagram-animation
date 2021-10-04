"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Anagram;

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.trim.js");

var _react = _interopRequireWildcard(require("react"));

var _utils = require("../utils");

var _useFontFaceObserver = _interopRequireDefault(require("use-font-face-observer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_WORDS = ['TacosNTonic', 'ScottCanoni'];

function Anagram(_ref) {
  let {
    family,
    weight,
    style,
    stretch,
    words = DEFAULT_WORDS
  } = _ref;
  const wordContainerRef1 = /*#__PURE__*/(0, _react.createRef)();
  const wordContainerRef2 = /*#__PURE__*/(0, _react.createRef)();
  const animationContainerRef = /*#__PURE__*/(0, _react.createRef)();
  const lettersRef1 = [...words[0]].map(() => /*#__PURE__*/(0, _react.createRef)());
  const lettersRef2 = [...words[1]].map(() => /*#__PURE__*/(0, _react.createRef)());
  const animationLettersRef = [...words[0]].map(() => /*#__PURE__*/(0, _react.createRef)());
  const [swapAnimations, setSwapAnimations] = (0, _react.useState)({});
  const playAnimation = (0, _react.useCallback)(function (i) {
    let playing = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    setSwapAnimations(prevState => {
      return _objectSpread(_objectSpread({}, prevState), {}, {
        [i]: _objectSpread(_objectSpread({}, prevState[i]), {}, {
          playing
        })
      });
    });
  }, [setSwapAnimations]);
  /* @type FontFace */

  const fontFace = {
    family,
    weight,
    style,
    stretch
  };
  const isFontLoaded = (0, _useFontFaceObserver.default)(family ? [fontFace] : []);
  (0, _react.useEffect)(() => {
    if (!isFontLoaded) {
      // wait until fonts are loaded
      return;
    }

    const swaps = [];
    const destLettersPairedByIndex = [];
    [...words[0]].forEach((letter, i) => {
      if (!letter.trim()) {
        // ignore spaces
        return;
      } // Find a matching dest character to execute the swap with


      const destLetterIndex = [...words[1]].findIndex((destLetter, srcIndex) => {
        return destLetter.toLowerCase() === letter.toLowerCase() && destLettersPairedByIndex[srcIndex] !== true;
      });
      destLettersPairedByIndex[destLetterIndex] = true; // mark this source paired/used

      if (destLetterIndex === -1) {
        throw new Error("Not sure how to animate since all source letters were paired already, disappear maybe?");
      }

      const swap = {
        src: {
          letter,
          element: lettersRef1[i].current,
          offsetLeft: lettersRef1[i].current.offsetLeft
        },
        dest: {
          letter: words[1][destLetterIndex],
          element: lettersRef2[destLetterIndex].current,
          offsetLeft: lettersRef2[destLetterIndex].current.offsetLeft
        }
      };
      swaps.push(swap);
    });
    setSwapAnimations(swaps);

    const animateFunc = () => {
      swaps.forEach((swap, i) => {
        setTimeout(() => {
          playAnimation(i);
        }, (0, _utils.randomMinMax)(0, 3000));
        setTimeout(() => {
          playAnimation(i, false);
        }, (0, _utils.randomMinMax)(6000, 9000));
      });
      setTimeout(() => {
        animateFunc();
      }, 12000);
    };

    animateFunc();
  }, [isFontLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "anagram-swap"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-1 hidden",
    ref: wordContainerRef1
  }, [...words[0]].map((letter, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRef1[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-2 hidden",
    ref: wordContainerRef2
  }, [...words[1]].map((letter, i) => {
    return /*#__PURE__*/_react.default.createElement("span", {
      ref: lettersRef2[i],
      className: "letter",
      key: "".concat(i).concat(letter)
    }, letter);
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "word word-animation",
    ref: animationContainerRef
  }, [...words[0]].map((letter, i) => {
    let letterStyles = {};
    const swap = swapAnimations[i];

    if (isFontLoaded && swap && swap.playing) {
      const left = "".concat(swap.dest.offsetLeft - swap.src.offsetLeft, "px");
      letterStyles = {
        left
      };
    }

    return /*#__PURE__*/_react.default.createElement("span", {
      key: "".concat(i).concat(letter),
      className: "letter",
      style: letterStyles,
      ref: animationLettersRef[i]
    }, letter);
  })));
}