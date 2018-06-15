"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';
import Player from '../../../openxum-core/games/lyngk/player.mjs';

class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        return new Lyngk.Move();
    }

    get_current_color() {
        return this.engine().current_color() === Player.PLAYER_1 ? 'White' : 'Black';
    }

    static get_name() {
        return 'lyngk';
    }

    get_winner_color() {
        return this.engine().winner_is() === Player.PLAYER_1 ? 'white' : 'black';
    }

    process_move() { }
}

export default {
    Manager: Manager
};