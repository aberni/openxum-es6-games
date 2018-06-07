"use strict";

import OpenXum from '../../openxum/engine.mjs';

class Engine extends OpenXum.Engine {
    constructor(type, current_color) {
        super();
        this._type = type;
        this._current_color = current_color;
        this._black_piece_count = 30;
        this._white_piece_count = 30;
        this._intersections = [];

        this._init_board();
    }

    // api methods

    apply_moves(moves) {
        throw new TypeError("Do not call abstract method apply_moves from child.");
    }

    clone() {
        throw new TypeError("Do not call abstract method clone from child.");
    }

    current_color() {
        return this._current_color;
    }

    get_name() {
        return "Manalath";
    }

    get_possible_move_list() {
        throw new TypeError("Do not call abstract method get_possible_move_list from child.");
    }

    is_finished() {
        throw new TypeError("Do not call abstract method is_finished from child.");
    }

    move(move) {
        throw new TypeError("Do not call abstract method move from child.");
    }

    parse(str) {
        throw new TypeError("Do not call abstract method parse from child.");
    }

    to_string() {
        throw new TypeError("Do not call abstract method to_string from child.");
    }

    winner_is() {
        throw new TypeError("Do not call abstract method winner_is from child.");
    }

    // private methods
    _init_board() {

    }
}

export default Engine;