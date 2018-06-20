"use strict";

class AlphaBetaMove {
    constructor(move, value) {
        this._value = value;
        this._move = move;
    }

    set_value(value) {
        this._value = value;
    }

    set_move(move) {
        this._move = move;
    }

    move() {
        return this._move;
    }

    value() {
        return this._value;
    }

    to_string() {
        return this._move.to_string() + ' efficiency: ' + this.value();
    }
}

export default AlphaBetaMove;