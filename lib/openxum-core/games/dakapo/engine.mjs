"use strict";

import Color from './color.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Move from './move.mjs';
import Phase from './phase.mjs';

class Engine extends OpenXum.Engine {
    constructor() {
        super();

        this._phase = Phase.EN_COURS;
        this._color = Color.NONE;
        this.init_board_array();

    }

    // public methods
    apply_moves(moves) {
        for (let i = 0; i < moves.length; ++i) {
            this.move(new Move(moves[i].color, moves[i].abs, moves[i].ord));
        }
    }

    clone() {
        let o = new Engine();
        o._set(this._phase, this._board);
        return o;
    }

    current_color() {
        return this._color;
    }

    get_name() {
        return 'Dakapo';
    }

    get_possible_move_list() {
        let list = this._get_possible_coordinates();
        let colors = [Color.BLUE,Color.RED,Color.YELLOW,Color.GREEN];
        let moves = [];

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                for( let color in colors) {
                    if (this._is_possible(new Move(color, i, j))) {
                        moves.push(new Move(color, i, j));
                    }
                }
            }
            return moves;
        }
    }


    is_finished() {
        return this._phase === Phase.FINISH;
    }

    move(move) {
        if(this.is_finished() === false) {
            this._board[move._abs][move._ord] = move._color;
            this._color = move._color;
            this._victory(move);
        }
    }

    parse(str) {
        // TODO

    }

    to_string() {
        // TODO

    }

    winner_is() {
        if (this.is_finished()) {
            return true;
        } else {
            return false;
        }
    }

    // private methods

    _get_phase() {
        return this._phase;
    }

    _is_possible(move) {
        if(move._x >= 8 || move._x < 0 || move._y >= 8 || move._y >= 8){
            return false;
        }
        if(move._color === this._color){
            return false;
        }
        else if(this_board[move._abs][move._ord] !== Color.NONE ){
            return false;
        }
        else if(this_board[move._abs+1][move._ord] === move._color ){
            return false;
        }
        else if(this_board[move._abs-1][move._ord] === move._color){
            return false;
        }
        else if(this_board[move._abs][move._ord+1] === move._color){
            return false;
        }
        else if(this_board[move._abs][move._ord-1] === move._color) {
            return false;
        }
        else if(this_board[move._abs][move._ord-1] === Color.NONE && this_board[move._abs][move._ord+1] === Color.NONE && this_board[move._abs-1][move._ord] === Color.NONE && this_board[move._abs+1][move._ord] === Color.NONE) {
            return false;
        }
        return true;
    }


    _set(_phase,_board) {
        this._phase = _phase;
        this._board = _board;
    }

    _fullboard(){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(this._board[i][j] !== Color.NONE){
                    return true;
                }
            }
        }
        return false;
    }

    // regarde si on a gagné
    _victory(move){
        if(this._fullboard() === true){
            this._phase = Phase.TIE;
        }
        else if(this.get_possible_move_list().length === 0){
            this._phase = Phase.FINISH;
        }

    }



// Appelé dans le constructeur
    init_board_array() {
        this._board = new Array(8);
        for (let x = 0; x < 8; x++) {
            this._board[x] = new Array(8);
        }
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this._board[x][y] = -1;
            }
        }
        this._board[3][3] = 1;
        this._board[3][4] = 2;
        this._board[4][3] = 3;
        this._board[4][4] = 0;
    }


}

export default Engine;