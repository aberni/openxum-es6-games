"use strict";

import Color from './color.mjs';

class Move {
  constructor(c, x, y) {
    this._color = c;
    this._abs = x;
    this._ord = y;
  }

  color() {
    return parseInt(this._color);
  }

  get() {
    return (parseInt(this._color) === Color.RED ? 'r' :
        parseInt(this._color) === Color.BLUE ? 'b' :
          parseInt(this._color) === Color.GREEN ? 'g' :
            'y')
      + this._abs + this._ord;
  }

  parse(str) {
    this._color = str.charAt(0) === 'r' ? Color.RED :
      str.charAt(0) === 'b' ? Color.BLUE :
        str.charAt(0) === 'g' ? Color.GREEN :
          Color.YELLOW;
    this._abs = str.charCodeAt(1) - '1'.charCodeAt(0) + 1;
    this._ord = str.charCodeAt(2) - '1'.charCodeAt(0) + 1;
  }

  to_object() {
    return {
      color: parseInt(this._color),
      abs: this._abs,
      ord: this._ord
    };
  }

  to_string() {
    return 'put ' + (parseInt(this._color) === Color.RED ? 'red' :
        parseInt(this._color) === Color.BLUE ? 'blue' :
          parseInt(this._color) === Color.GREEN ? 'green' :
            'yellow')
      + ' at (' + this._abs + ',' + this._ord + ').';
  }
}

export default Move;