"use strict";

import OpenXum from "../../index.mjs";


class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
    }

    draw() {
        throw new TypeError("Do not call abstract method draw from child.");
    }

    get_move() {
        throw new TypeError("Do not call abstract method get_move from child.");
    }

    is_animate() {
        throw new TypeError("Do not call abstract method is_animate from child.");
    }

    is_remote() {
        throw new TypeError("Do not call abstract method is_remote from child.");
    }

    unselect() {
        throw new TypeError("Do not call abstract method unselect from child.");
    }
}

export default {
    Gui: Gui
};