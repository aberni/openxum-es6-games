"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Mixtour from '../../../openxum-core/games/mixtour/index.mjs';

class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        return new Mixtour.Move();
    }

    get_current_color() {
        return this.engine().current_color() === Mixtour.Color.WHITE? 'WHITE' : 'BLACK';
    }

    static get_name() {
        return 'mixtour';
    }

    get_winner_color() {
        return this.engine().winner_is()=== Mixtour.Color.WHITE? 'WHITE' : 'BLACK';
    }

    process_move() {
    }
}

export default {
    Manager: Manager
};