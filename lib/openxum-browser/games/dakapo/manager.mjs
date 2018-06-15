"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';


class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
        this.cpt = 1;
    }

    build_move() {
        // Retourne l'implémentation d'un mouvement par défaut du jeu
        return new Dakapo.Move();
    }

    get_current_color() {
        // Retourne la couleur du joueur courant
        this.cpt++;
        return this.cpt % 2 === 0 ? 'Joueur 2' : 'Joueur 1';
        //return this._engine._color === Dakapo.Color.RED ? 'red' : this._engine._color === Dakapo.Color.BLUE ? 'blue' : this._engine._color === Dakapo.Color.GREEN ? 'green' : 'yellow';
    }

    static get_name() {
        // Retourne le nom du jeu
        return 'dakapo';
    }

    get_winner_color() {
        // Retourne sous forme d'une chaîne de caractères la couleur du vainqueur
        return this.cpt % 2 === 0 ? 'Joueur 1' : 'Joueur 2';
        //return this._engine._color === Dakapo.Color.RED ? 'red' : this._engine._color === Dakapo.Color.BLUE ? 'blue' : this._engine._color === Dakapo.Color.GREEN ? 'green' : 'yellow';
    }

    process_move() {
    }
}

export default {
    Manager: Manager
};