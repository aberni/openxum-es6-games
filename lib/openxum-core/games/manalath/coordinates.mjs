"use strict";

class Coordinates {
    constructor(c, l) {
        this._column = c;
        this._line = l;
    }

    is_valid() {
        throw new TypeError("This method must be implemented !");
    }

    clone() {
        return new Coordinates(this._column, this._line);
    };

    get_column() {
        return this._column;
    };

    get_line() {
        return this._line;
    };

    hash() {
        return this._column.charCodeAt(0) + this._line * (4 * this._line) - 7;
    };

    equals(coordinate) {
        return this._column === coordinate.get_column() &&
            this._line === coordinate.get_line();
    };

    to_string() {
        if (!this.is_valid()) {
            return "Invalid coordinates";
        }

        return this._column + this._line;
    }
}

export default Coordinates;