"use strict";

import Coordinates from './coordinates.mjs';
import OpenXum from '../../openxum/index.mjs';

class Move extends OpenXum.Move {
  constructor(id_a, id_b) {
    this._from = id_a;
    this._to = id_b;
  }

  clone() {
    return new Move(this._from, this._to);
  }

  decode(str) {
    let from = str.charAt(0) + str.charAt(1);
    let to = str.charAt(str.length - 2) + str.charAt(str.length - 1);
    this._from = parseInt(from);
    this._to = parseInt(to);
  }

  encode() {
    return (this._from >= 10 ? '' : '0') + this._from + (this._to >= 10 ? '' : '0') + this._to;
  }

  get_to() {
    return this._to;
  }

  get_from() {
    return this._from;
  }

  to_object() {
    return { from: this._from, to: this._to };
  }

  to_string() {
    return this._from + ' to ' + this._to;
  }
}

export default Move;