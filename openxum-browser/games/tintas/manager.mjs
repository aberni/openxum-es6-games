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
        return new Tintas.Move();
    }

    get_current_color() {
        // Retourne la joueur courant
        let a=this.engine()._current;
        if(a===0){
            return "Player 1";
        }
        if(a===1){
            return "Player 2";
        }
        console.log("Error to in function manager get_current_color");
        return false;
    }

    static get_name() {
        return 'tintas';
    }

    get_winner_color() {
        let a=this.engine().winner_is();
        if(a==Player.PLAYER_1){
            return a;
            console.log("winer is player 1")
        }
        if(a==Player.PLAYER_2){
            console.log("winer is player 2")
            return a;
        }
        console.log("winer is undefined");
        return a;


    }

    process_move() {
        console.log("process_move   ");
    }


}

export default {
    Manager: Manager
};