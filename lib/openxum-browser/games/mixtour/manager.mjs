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
        //TODO
        //return this.engine().current_color() === Player.PLAYER_1 ? 'White' : 'Black';
    }

    static get_name() {
        return 'mixtour';
    }

    get_winner_color() {
        //TODO
        //return this.engine().winner_is() === Player.PLAYER_1 ? 'white' : 'black';
    }

    process_move() {
    }
}

export default {
    Manager: Manager
};