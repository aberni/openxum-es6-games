"use strict";

import Color from "./color.mjs";
import State from "./state.mjs";

class Intersection {
  constructor(coordinates) {
    this._coordinates = coordinates;
    this._piece = null;
    this._marked = false;
  }

  clear_mark() {
    this._marked = false;
  }

  clone() {
    let intersection = new Intersection(this._coordinates.clone());

    intersection.set_piece(this._piece);
    intersection._marked = this._marked;
    return intersection;
  }

  equals(intersection) {
    return this._coordinates.equals(intersection.get_coordinates());
  }

  get_column() {
    return this._coordinates.get_column();
  }

  get_color() {
    return this._piece !== null ? this._piece.get_color() : Color.NONE;
  }

  get_coordinates() {
    return this._coordinates;
  }

  get_line() {
    return this._coordinates.get_line();
  }

  get_state() {
    return this._piece !== null ? State.ONE_PIECE : State.VACANT;
  }

  is_marked() {
    return this._marked;
  }

  is_vacant() {
    return this.get_state() === State.VACANT;
  }

  set_marked() {
    this._marked = true;
  }

  set_piece(piece) {
    this._piece = piece;
  }
}

export default Intersection;