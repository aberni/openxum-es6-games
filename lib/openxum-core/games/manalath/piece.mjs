"use strict";

class Piece {
  constructor(color) {
    this._color = color;
  }

  get_color() {
    return this._color;
  }

  same_color(piece) {
    return this.get_color() === piece.get_color();
  }
}

export default Piece;