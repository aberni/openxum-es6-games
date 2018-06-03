"use strict";

class Move {
    constructor(c1, c2) {
        this._from = c1;
        this._to = c2;
    }

// public methods
    from() {
        return this._from;
    }

    to() {
        return this._to;
    }

    get() {
        return 'pp' + this._from.to_string() + this._to.to_string();
    }

    parse(str) {
        this._from = { x: str.charCodeAt(0) - 'a'.charCodeAt(0), y: str.charCodeAt(1) - '1'.charCodeAt(0) };
        this._to = { x: str.charCodeAt(2) - 'a'.charCodeAt(0), y: str.charCodeAt(3) - '1'.charCodeAt(0) };
    }


    to_object() {
        return {from: this._from, to: this._to };
    }

    to_string() {
        return 'move piece ' + this._from.to_string() + ' to ' + this._to.to_string();
    }
}

export default Move;