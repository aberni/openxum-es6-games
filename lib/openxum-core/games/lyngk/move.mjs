"use strict";

import Coordinates from './coordinates.mjs';
import OpenXum from '../../openxum/index.mjs';

class Move extends OpenXum.Move {
  constructor(c1, c2) {
    super();
    this._from = c1;
    this._to = c2;
  }

// public methods
  decode(str) {
    this._from = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
    this._to = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
  }

  encode() {
    return this._from.to_string() + this._to.to_string();
  }

  from() {
    return this._from;
  }

  to() {
    return this._to;
  }

  to_object() {
    return {from: this._from, to: this._to};
  }

  to_string() {
    return 'move piece ' + this._from.to_string() + ' to ' + this._to.to_string();
  }
}

export default Move;