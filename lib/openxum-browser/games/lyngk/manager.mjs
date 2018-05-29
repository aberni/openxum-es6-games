"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';

class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        return new Lyngk.Move();
    }

    get_current_color() {
        return this.engine().current_color() === Lyngk.Color.BLACK ? 'Black' : 'White';
    }

    static get_name() {
        return 'lyngk';
    }

    get_winner_color() {
        return this.engine().winner_is() === Lyngk.Color.BLACK ? 'black' : 'white';
    }

    process_move() { }
}

export default {
    Manager: Manager
};