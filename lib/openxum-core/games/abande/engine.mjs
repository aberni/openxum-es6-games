"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Etat from './etat.mjs';
import Intersection from './intersection.mjs';
import Move from './move.mjs';
import Phase from './move_type.mjs';
import OpenXum from "../../../openxum-browser";

//grid constants definition
const grid_letter = ['A','B','C','D','E','F','G'];
const end_number=[4,5,6,7,6,5,4];

//enums definition
const letters = ['A','B','C','D','E','F','G'];

class Engine extends OpenXum.Engine {
    constructor(t,c) {
        super();
        this._type =t;
        this._current_color = Color.BLACK;
        this._phase = Phase.PUT_FIRST_PIECE;
        this._black_piece_number=18;
        this._white_piece_number=18;
        this._intersections = [];
        for(let i = 0; i < grid_letter.length; ++i) {
            const l = grid_letter[i];
            for(let n=1; j <= end_number[i]; ++n)
            {
                let coordinates = new Coordinates(l,n);
                this._intersections[coordinates.hash()] = new Intersection(coordinates);
            }
        }
    }

    clone() {
        let clone = new Engine(this._type, this._current_color);

        clone._set(this._phase, this._black_piece_number,this._white_piece_number,this._intersections);
        return clone;
    }

    type(){
        return this._type;
    }

    current_color() {
        return this._current_color;
    }

    phase() {
        return this._phase;
    }

    black_piece_number() {
        return this._black_piece_number;
    }

    white_piece_number() {
        return this._white_piece_number;
    }

    intersection() {
        return this._intersections;
    }

    apply_moves(moves) {
        //TODO
        //permet d'appliq*uer une liste de move
    }


    get_name() {
        return 'Abande';
    }

    get_possible_move_list(){
        //TODO
        //Retourne la liste de tous les move possible
    }

    is_finished(){
        //TODO
        //retourne si la partie est terminer ou non
    }

    move(move){
        //TODO
        //permet d'applique un move est mettre à jour les états
    }

    parse(str){
        //TODO
        //Modifie l'état du jeu en fonction de l'état passé sous forme d'un string
    }

    to_string() {
        //TODO
        //Construit une représentation du jeu sous forme d'un string
    }

    winner_is() {
        //TODO
        //Indique le joueur gagnant
    }


    _set(phase,black_piece_number,white_piece_number,intersection)
    {
        this._phase = phase;
        this._black_piece_number = black_piece_number;
        this._white_piece_number = white_piece_number;
        this._intersections = intersection;
    }

    _put_first_piece(move_str){
        move_str.charAt(0)
    }
}