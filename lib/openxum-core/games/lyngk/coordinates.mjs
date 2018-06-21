"use strict";

class Coordinates {
    constructor(c, l) {
        this._column = c;
        this._line = l;
    }

    isValid() {
        return (this._column === 'A' && this._line === 3) ||
            (this._column === 'B' && this._line >= 2 && this._line <= 5) ||
            (this._column === 'C' && this._line >= 1 && this._line <= 7) ||
            (this._column === 'D' && this._line >= 2 && this._line <= 7) ||
            (this._column === 'E' && this._line >= 2 && this._line <= 8) ||
            (this._column === 'F' && this._line >= 3 && this._line <= 8) ||
            (this._column === 'G' && this._line >= 3 && this._line <= 9) ||
            (this._column === 'H' && this._line >= 5 && this._line <= 8) ||
            (this._column === 'I' && this._line === 7);
    }

    getRepresentation() {
        if (!this.isValid()) {
            return "invalid";
        }

        return this._column + this._line;
    }

    clone() {
        return new Coordinates(this._column, this._line);
    };

    getColumn() {
        return this._column;
    };

    getLine() {
        return this._line;
    };

    hash() {
        return this._column.charCodeAt(0) + this._line * (4 * this._line) - 7;
    };

    equals(coordinate) {
        return this._column === coordinate.getColumn() &&
            this._line === coordinate.getLine();
    };

    to_string() {
        return this.getRepresentation();
    }
}

export default Coordinates;