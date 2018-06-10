"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(c1, c2) {
        this._from = c1;
        this._to = c2;
        this._chosen_color = color;
    }

    from() {
        return this._from;
    }

    to() {
        return this._to;
    }

    chosen_color() {
        return this._chosen_color;
    }

    get() {
        return this._from.to_string() + this._to.to_string();
    }

    parse(str) {
        this._from = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
        this._to = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
    }

    to_object() {
        return {from: this._from, to: this._to, chosenColor: this._chosen_color };
    }

    to_string() {
        return 'move ' + this._chosen_color.toString() + ' piece ' + this._from.to_string() + ' to ' + this._to.to_string();
    }
}

export default Move;