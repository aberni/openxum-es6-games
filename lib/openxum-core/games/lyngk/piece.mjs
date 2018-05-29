"use strict";

class Piece{
    constructor(color) {
        this._color = color;
    }

    //public methods

    getColor() {
        return this._color;
    }
}

export default Piece;