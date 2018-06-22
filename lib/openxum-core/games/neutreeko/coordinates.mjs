  "use strict";

class Coordinates {
    constructor(c, l) {
        this._column = c;
        this._line = l;
    }

    isValid() {
        // Retourne si la coordonnée est valide, c'est-à-dire si elle existe
        // au sein du système de coordonnées décidé au préalable.
        return this._column >= 0 && this._column < 5 && this._line >= 0 && this._line < 5;
    }

    clone() {
        return new Coordinates(this._column, this._line);
    };

    x() {
        return this._column;
    };

    y() {
        return this._line;
    };

    hash() {
        // Construit une représentation unique d'une intersection
        // Cela va notamment nous servir pour retrouver une intersection
        // plus efficacement.
        return this._column.charCodeAt(0) + this._line * (4 * this._line) - 7;
    };

    equals(coordinate) {
        return this._column === coordinate.x() &&
            this._line === coordinate.y();
    };

    to_string() {
        if (!this.isValid()) {
            return "invalid";
        }
        return this._column + "" + this._line;
    }

    formate() {
        return String.fromCharCode('A'.charCodeAt(0) + this.x()) + (this.y()+1);
    }
}

export default Coordinates;