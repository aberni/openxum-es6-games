"use strict";

import Color from './color.mjs';
import Position from './position.mjs';

class Move {
  constructor(c, x, y) {
    this._color = c;
    this._abs = x;
    this._ord = y;
  }

// public methods
  color() {
    return this._color;
  }

  // a quoi sert elle ?
  get() {
    return (this._color === Color.RED ? 'R' : 'Y') + this._letter + this._number +
      (this._position === Position.BOTTOM ? 'b' :
        (this._position === Position.TOP ? 't' :
          (this._position === Position.RIGHT ? 'r' : 'l')));
  }



  parse(str) {
    this._color = str.charAt(0) === 'R' ? Color.RED :
        str.charAt(0) === 'B' ? Color.BLUE :
            str.charAt(0) === 'G' ? Color.GREEN :
                Color.YELLOW;
    this._abs = str.charCodeAt(1) - '1'.charCodeAt(0) + 1;
    this._ord = str.charCodeAt(2) - '1'.charCodeAt(0) + 1;
  }

  to_object() {
    return {
      color: this._color,
      abs: this._abs,
      ord: this._ord
    };
  }

  to_string() {
    return 'put ' + (this._color === Color.RED ? 'red' : this._color === Color.BLUE ? 'blue' : this._color === Color.GREEN ? 'green' : 'yellow') +
      ' at (' + this._abs + ',' + this._ord + ').';
  }
}

export default Move;