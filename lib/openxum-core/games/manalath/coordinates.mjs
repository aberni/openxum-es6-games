"use strict";

class Coordinates {
  constructor(c, l) {
    this._column = c;
    this._line = l;
  }

  is_valid() {
    return (this._column === 'A' && this._line >= 0 && this._line <= 4) ||
      (this._column === 'B' && this._line >= 0 && this._line <= 5) ||
      (this._column === 'C' && this._line >= 0 && this._line <= 6) ||
      (this._column === 'D' && this._line >= 0 && this._line <= 7) ||
      (this._column === 'E' && this._line >= 0 && this._line <= 8) ||
      (this._column === 'F' && this._line >= 1 && this._line <= 8) ||
      (this._column === 'G' && this._line >= 2 && this._line <= 8) ||
      (this._column === 'H' && this._line >= 3 && this._line <= 8) ||
      (this._column === 'I' && this._line >= 4 && this._line <= 8);
  }

  clone() {
    return new Coordinates(this._column, this._line);
  }

  equals(coordinates) {
    return this._column === coordinates.get_column() &&
      this._line === coordinates.get_line();
  }

  get_column() {
    return this._column;
  }

  get_line() {
    return this._line;
  }

  hash() {
    return this._column.charCodeAt(0) + (this._line + 1) * (4 * (this._line + 1)) - 7;
  }

  to_string() {
    if (!this.is_valid()) {
      return "Invalid coordinates";
    }
    return this._column + this._line;
  }
}

export default Coordinates;