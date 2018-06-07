"use strict";

import Color from "./color.mjs";
import State from "./state.mjs";

class Intersection {
    constructor(coordinates) {
        this._coordinates = coordinates;
        this._piece = null;
    }

    clone() {
        let intersection = new Intersection(this._coordinates.clone());
        intersection.set_piece(this._piece);
        return intersection;
    }

    set_piece(piece) {
        this._piece = piece;
    }

    get_state() {
        return piece ? State.ONE_PIECE : State.VACANT;
    }

    get_line() {
        return this._coordinates.get_line();
    }

    get_column() {
        return this._coordinates.get_column();
    }

    get_color() {
        return piece ? piece.get_color() : Color.NONE;
    }

    get_coordinates() {
        return this._coordinates;
    }

    equals(intersection) {
        return this._coordinates.equals(intersection.get_coordinates());
    }
}

export default Intersection;