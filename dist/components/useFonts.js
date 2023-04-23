"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useFonts;
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.promise.js");
var _react = require("react");
function useFonts() {
  for (var _len = arguments.length, fontNames = new Array(_len), _key = 0; _key < _len; _key++) {
    fontNames[_key] = arguments[_key];
  }
  const [isLoaded, setIsLoaded] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    // Inspired by https://stackoverflow.com/a/60138011
    if (!document || !document.fonts) {
      // eslint-disable-next-line no-console
      console.warn('Browser does not support document.fonts API');
      setIsLoaded(true);
      return;
    }
    Promise.all(fontNames.map(fontName => document.fonts.load("16px \"".concat(fontName, "\"")))).then(() => {
      setIsLoaded(true);
    });
  }, [fontNames]);
  return isLoaded;
}
;