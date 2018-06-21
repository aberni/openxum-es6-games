"use strict";

class Piece{
    constructor(color) {
        this._color = color;
    }

    //public methods

    getColor() {
        return this._color;
    }

    sameColor(piece){
        return this.getColor() === piece.getColor();
    }
}

export default Piece;