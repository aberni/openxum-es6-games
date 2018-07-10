"use strict";

import Coordinates from './coordinates.mjs';


class Move {
  /**
   * @brief constructeur par défaut
   * @param c1 point départ
   * @param c2 point final
   */
  constructor(c1, c2) {
    this._from = c1;
    this._to = c2;
  }

// public methods
  from() {
    return this._from;
  }

  to() {
    return this._to;
  }

  get() {
    return this._from.to_string() + this._to.to_string();
  }

  parse(str) {
    this._from = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
    this._to = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
  }

  to_object() {
    return {from: this._from, to: this._to};
  }

  to_string() {
    return 'move piece ' + this.from().to_string() + ' to ' + this.to().to_string();
  }

  formate() {
    return 'move piece ' + this.from().formate() + ' to ' + this.to().formate();
  }
}

export default Move;