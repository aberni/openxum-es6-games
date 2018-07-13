"use strict";

class Piece {

  /**
   * @brief constructeur par defaut
   * @param color
   * @param coordinates
   */
  constructor(color, coordinates) {
    this._color = color;
    this._coordinates = coordinates;
  }

  set_coordinates(coordinates) {
    this._coordinates = coordinates;
  }

  color() {
    return this._color;
  }

  coordinates() {
    return this._coordinates;
  }

  equals(p) {
    if (p !== undefined) {
      return !(p.coordinates().x() !== this._coordinates.x() || p.coordinates().y() !== this._coordinates.y() || p.color() !== this._color);
    }

    return false;
  }

  clone() {
    return new Piece(this._color, this._coordinates.clone());
  }

  to_string() {
    return "[color: " + this._color + " coord: " + this._coordinates.formate() + "]";
  }

  formatted_string() {
    return this._color + ' ';
  }
}

export default Piece;