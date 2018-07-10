"use strict";

class Piece {
  constructor(c, co) {
    this._color = c;
    this._coordinates = co;
    this._marked = false;
  }

  set_coordinates(c) {
    this._coordinates = c;
  }

  color() {
    return this._color;
  }

  coordinates() {
    return this._coordinates;
  }

  clone() {
    return new Piece(this._color, this._coordinates);
  }
}

export default Piece;