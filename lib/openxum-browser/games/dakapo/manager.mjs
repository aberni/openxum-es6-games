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
<<<<<<< HEAD
        return this._color === Dakapo.Color.RED ? 'red' : this._color === Dakapo.Color.BLUE ? 'blue' : this._color === Dakapo.Color.GREEN ? 'green' : 'yellow';
=======
        return this._color === Dakapo.Color.RED ? 'red' : this._color === Dakapo.Color.BLUE ? 'blue' : this._color === Dakapo.Color.GREEN ? 'green' : 'NICOLAS';
>>>>>>> 3f8157784b56d7ddacb54701e4e7f33e6e75dc3c
    }

    process_move() {
    }
}

export default {
    Manager: Manager
};