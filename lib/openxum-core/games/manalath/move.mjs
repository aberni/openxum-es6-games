"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(c, color) {
        this._to = c;
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
        this._to = new Coordinates(str.charAt(2), parseInt(str.charAt(3)));
    }

    to_object() {
        return {to: this._to, chosenColor: this._chosen_color };
    }

    to_string() {
        return 'move ' + this._chosen_color.toString() + ' piece ' + this._from.to_string() + ' to ' + this._to.to_string();
    }
}

export default Move;