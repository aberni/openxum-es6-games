"use strict";

class Stack {
    constructor() {
        this._pieces = [];
    }

    pushPiece(p) {
        this._pieces.push(p);
    }

    getHeight() {
        return this._pieces.length;
    }

    getHead() {
        return (this.getHeight() > 0) ? this._pieces[this.getHeight() - 1] : null;
    }

    pop() {
        let piece = this.getHead();
        if (piece === null) {
            return null;
        }

        this._pieces.splice(this.getHeight() - 1, 1);
        return piece;
    }

    clear() {
        this._pieces.splice(0, this.getHeight());
    }


}

export default Stack;