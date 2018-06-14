"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Tintas from '../../../openxum-core/games/tintas/index.mjs';

class Manager extends OpenXum.Manager {
    constructor(e, g, o, s) {
        super(e, g, o, s);
        this.that(this);
    }

    build_move() {
        // Retourne l'implémentation d'un mouvement par défaut du jeu
        return new Move();
    }

    get_current_color() {
        // Retourne la couleur du joueur courant
        return this.engine().current_color();
    }

    static get_name() {
        // Retourne le nom du jeu
        return 'tintas';
    }

    get_winner_color() {
        let a=this.engine().winner_is();
        if(a==Player.PLAYER_1){
            console.log("winer is player 1")
        }
        if(a==Player.PLAYER_2){
            console.log("winer is player 2")
        }
    }

    process_move() {
        // À implémenter si le manager doit gérer des éléments annexes des coups
        // Par défaut, laisser vide
    }

    play() {
        if (this._engine.current_color() === this._gui.color() || this._opponent === this._gui) {
            this._move = this._gui.get_move(); // #1
            if (this._move) {
                this._apply_move(this._move);
                if (this._opponent.is_remote()) {
                    this._opponent.move(this._move);
                }
                this._gui.unselect(); // #2
                this.next();
            } else {
                this._that.process_move();
            }
        } else {
            this._apply_move(this._move);
            if (this._opponent.is_remote() && this._opponent.confirm()) {
                this._opponent.move(this._move);
            }
            this._gui.unselect();
            this.next();
        }
    }
}

export default {
    Manager: Manager
};