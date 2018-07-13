"use strict";

class Vector {
  /**
   * Constructor
   * @param arg1 coordinates (from)
   * @param arg2 coordinates (to)
   */
  constructor(arg1, arg2) {
    if (typeof arg1 === "number" && typeof arg2 === "number") {
      this._x = arg1;
      this._y = arg2;
    } else if (typeof arg1 === "object" && typeof arg2 === "object") {
      this._x = arg1.y() - arg2.y();
      this._y = arg1.x() - arg2.x();
    } else {
      throw new Error("Invalid arguments");
    }
    console.assert(this._x !== 0 || this._y !== 0, "vector created: (0,0)");
  }

  x() {
    return this._x;
  }

  y() {
    return this._y;
  }

  getSquareLength() {
    return this._x * this._x + this._y * this._y;
  }

  getLength() {
    return Math.sqrt(this.getSquareLength());
  }

  multiple(coef) {
    return new Vector(this._x * coef , this._y * coef);
  }

  equals(v) {
    return v._x === this._x && v._y === this._y;
  }

  to_string() {
    return '('+this._x+','+this._y+')';
  }
}

export default Vector;