"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';


class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        // Retourne l'implémentation d'un mouvement par défaut du jeu
        return new Dakapo.Move();
    }

    get_current_color() {
        // Retourne la couleur du joueur courant
        return this._color === Dakapo.Color.RED ? 'red' : this._color === Dakapo.Color.BLUE ? 'blue' : this._color === Dakapo.Color.GREEN ? 'green' : 'yellow';
    }

    static get_name() {
        // Retourne le nom du jeu
        return 'dakapo';
    }

    get_winner_color() {
        // Retourne sous forme d'une chaîne de caractères la couleur du vainqueur
        return this._color === Dakapo.Color.RED ? 'red' : this._color === Dakapo.Color.BLUE ? 'blue' : this._color === Dakapo.Color.GREEN ? 'green' : 'yellow';
    }

    process_move() {
    }
}

export default {
    Manager: Manager
};