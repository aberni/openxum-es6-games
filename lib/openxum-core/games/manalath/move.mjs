"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(c, color) {
        this._to = c;
        this._chosen_color = color;
    }

    from() {
        return this._to;
    }

    to() {
        return this._to;
    }

    chosen_color() {
        return this._chosen_color;
    }

    get() {
        return this._to.to_string() + this._chosen_color;
    }

    parse(str) {
        if (!str || str.length !== 3) {
            throw new TypeError("Invalid string format " + str);
        }

        this._to = new Coordinates(str.charAt(0), parseInt(str.charAt(1)));
        this._chosen_color = parseInt(str.charAt(2));
    }

    to_object() {
        return {to: this._to, chosenColor: this._chosen_color };
    }

    to_string() {
        return 'move ' + this._chosen_color.toString() + ' piece ' + this._from.to_string() + ' to ' + this._to.to_string();
    }
}

export default Move;