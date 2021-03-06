(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'react', 'prop-types'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('react'), require('prop-types'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.React, global.propTypes);
    global.TextTruncate = mod.exports;
  }
})(this, function (module, exports, _react, _propTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _propTypes2 = _interopRequireDefault(_propTypes);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _objectWithoutProperties(obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var TextTruncate = function (_Component) {
    _inherits(TextTruncate, _Component);

    function TextTruncate() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, TextTruncate);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TextTruncate.__proto__ || Object.getPrototypeOf(TextTruncate)).call.apply(_ref, [this].concat(args))), _this), _this.onResize = function () {
        if (_this.rafId) {
          window.cancelAnimationFrame(_this.rafId);
        }
        _this.rafId = window.requestAnimationFrame(_this.update.bind(_this));
      }, _this.update = function () {
        _this.forceUpdate();
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(TextTruncate, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var canvas = document.createElement('canvas');
        var docFragment = document.createDocumentFragment();
        var style = window.getComputedStyle(this.scope);
        var font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family']].join(' ');

        docFragment.appendChild(canvas);
        this.canvas = canvas.getContext('2d');
        this.canvas.font = font;
        this.forceUpdate();
        window.addEventListener('resize', this.onResize);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        if (this.rafId) {
          window.cancelAnimationFrame(this.rafId);
        }
      }
    }, {
      key: 'measureWidth',
      value: function measureWidth(text) {
        return this.canvas.measureText(text).width;
      }
    }, {
      key: 'getRenderText',
      value: function getRenderText() {
        var _props = this.props,
            containerClassName = _props.containerClassName,
            line = _props.line,
            text = _props.text,
            textTruncateChild = _props.textTruncateChild,
            truncateText = _props.truncateText,
            element = _props.element,
            props = _objectWithoutProperties(_props, ['containerClassName', 'line', 'text', 'textTruncateChild', 'truncateText', 'element']);

        var scopeWidth = this.scope.getBoundingClientRect().width;

        // return if display:none
        if (scopeWidth === 0) {
          return null;
        }

        // return if all of text can be displayed
        if (scopeWidth >= this.measureWidth(text)) {
          return _react2.default.createElement(
            'div',
            props,
            text
          );
        }

        var childText = '';
        if (textTruncateChild && typeof textTruncateChild.type === 'string') {
          var type = textTruncateChild.type;
          if (type.indexOf('span') >= 0 || type.indexOf('a') >= 0) {
            childText = textTruncateChild.props.children;
          }
        }

        var currentPos = 1;
        var maxTextLength = text.length;
        var truncatedText = '';
        var splitPos = 0;
        var startPos = 0;
        var displayLine = line;
        var width = 0;
        var lastIsEng = false;
        var lastSpaceIndex = -1;

        while (displayLine--) {
          var ext = displayLine ? '' : truncateText + ' ' + childText;
          while (currentPos <= maxTextLength) {
            truncatedText = text.substr(startPos, currentPos);
            width = this.measureWidth(truncatedText + ext);
            if (width < scopeWidth) {
              splitPos = text.indexOf(' ', currentPos + 1);
              if (splitPos === -1) {
                currentPos += 1;
                lastIsEng = false;
              } else {
                lastIsEng = true;
                currentPos = splitPos;
              }
            } else {
              do {
                currentPos--;
                truncatedText = text.substr(startPos, currentPos);
                if (truncatedText[truncatedText.length - 1] === ' ') {
                  truncatedText = text.substr(startPos, currentPos - 1);
                }
                if (lastIsEng) {
                  lastSpaceIndex = truncatedText.lastIndexOf(' ');
                  if (lastSpaceIndex > -1) {
                    currentPos = lastSpaceIndex;
                    truncatedText = text.substr(startPos, currentPos);
                  }
                }
                width = this.measureWidth(truncatedText + ext);
              } while (width >= scopeWidth && truncatedText.length > 0);
              startPos += currentPos;
              break;
            }
          }

          if (currentPos >= maxTextLength) {
            startPos = maxTextLength;
            break;
          }
        }

        if (startPos === maxTextLength) {
          return _react2.default.createElement(
            'div',
            props,
            text
          );
        }
        return _react2.default.createElement(
          'div',
          props,
          text.substr(0, startPos) + truncateText + ' ',
          textTruncateChild
        );
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        var _props2 = this.props,
            element = _props2.element,
            text = _props2.text,
            containerClassName = _props2.containerClassName;


        var renderText = this.scope ? this.getRenderText() : text;
        var rootProps = {
          ref: function ref(el) {
            _this2.scope = el;
          },
          className: containerClassName,
          style: { overflow: 'hidden' }
        };

        return (0, _react.createElement)(element, rootProps, renderText);
      }
    }]);

    return TextTruncate;
  }(_react.Component);

  TextTruncate.propTypes = {
    containerClassName: _propTypes2.default.string,
    element: _propTypes2.default.string,
    line: _propTypes2.default.number,
    text: _propTypes2.default.string,
    textTruncateChild: _propTypes2.default.node,
    truncateText: _propTypes2.default.string
  };
  TextTruncate.defaultProps = {
    element: 'div',
    line: 1,
    text: '',
    truncateText: '…'
  };
  exports.default = TextTruncate;
  ;
  module.exports = exports['default'];
});
