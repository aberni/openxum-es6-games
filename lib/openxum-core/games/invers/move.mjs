"use strict";

import Color from './color.mjs';
import OpenXum from '../../openxum/index.mjs';
import Position from './position.mjs';

class Move extends OpenXum.Move {
  constructor(c, l, n, p) {
    super();
    this._color = c;
    this._letter = l;
    this._number = n;
    this._position = p;
  }

// public methods
  color() {
    return this._color;
  }

  decode(str) {
    this._color = str.charAt(0) === 'R' ? Color.RED : Color.YELLOW;
    this._letter = str.charAt(1);
    this._number = str.charCodeAt(2) - '1'.charCodeAt(0) + 1;
    this._position = str.charAt(3) === 'b' ? Position.BOTTOM :
      str.charAt(3) === 't' ? Position.TOP :
        str.charAt(3) === 'r' ? Position.RIGHT : Position.LEFT;
  }

  encode() {
    return (this._color === Color.RED ? 'R' : 'Y') + this._letter + this._number +
      (this._position === Position.BOTTOM ? 'b' :
        (this._position === Position.TOP ? 't' :
          (this._position === Position.RIGHT ? 'r' : 'l')));
  }

  letter() {
    return this._letter;
  }

  number() {
    return this._number;
  }

  position() {
    return this._position;
  }

  to_object() {
    return {
      color: this._color,
      letter: this._letter,
      number: this._number,
      position: this._position
    };
  }

  to_string() {
    return 'put ' + (this._color === Color.RED ? 'red' : 'yellow') +
      ' title at ' + this._letter + this._number + ' from ' +
      (this._position === Position.BOTTOM ? 'bottom' :
        (this._position === Position.TOP ? 'top' :
          (this._position === Position.RIGHT ? 'right' : 'left')));
  }
}

export default Move;