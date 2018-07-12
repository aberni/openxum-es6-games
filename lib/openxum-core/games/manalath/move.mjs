"use strict";

import Coordinates from './coordinates.mjs';
import Color from './color.mjs';
import OpenXum from '../../openxum/index.mjs';

class Move extends OpenXum.Move {
  constructor(c, color) {
    super();
    this._to = c;
    this._chosen_color = color;
  }

  chosen_color() {
    return this._chosen_color;
  }

  decode(str) {
    if (!str || str.length !== 3) {
      throw new TypeError("Invalid string format " + str);
    }
    this._to = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
    this._chosen_color = str.charAt(2) === "w" ? Color.WHITE : Color.BLACK;
  }

  encode() {
    return this._to.to_string() + (this._chosen_color === Color.WHITE ? "w" : "b");
  }

  to() {
    return this._to;
  }

  to_object() {
    return {to: this._to, chosenColor: this._chosen_color};
  }

  to_string() {
    return 'place ' + (this._chosen_color === Color.WHITE ? "white" : "black") + ' piece at ' + this._to.to_string();
  }
}

export default Move;