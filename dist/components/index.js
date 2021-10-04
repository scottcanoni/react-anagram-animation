"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Anagram;

var _react = _interopRequireDefault(require("react"));

var _Anagram = _interopRequireDefault(require("./Anagram"));

require("./index.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Anagram(props) {
  return /*#__PURE__*/_react.default.createElement(_Anagram.default, props);
}