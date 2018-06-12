// lib/openxum-core/games/ordo/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Coordinates from './coordinates.mjs';
import Piece from './piece.mjs';
import Color from './color.mjs';
//import Move from './move.mjs';
//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(t,c) {
        super();
        // Déclaration de tous les attributs nécessaires
        this._type = t;
        this._color = c;
        this._current_round = 0;
        this._count_white_pawn = 20;
        this._count_black_pawn = 20;
        this._is_finished = false;
        this._winner_color = Color.NONE;
        this._initialize_board();
    }

    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        // Permet de cloner le moteur de jeu.
        // Attention à bien dupliquer de tous les attributs.
    }

    current_color() {
        // Retourne le joueur en train de jouer.
        return this._color;
    }

    get_name() {
        // Retourne le nom du jeu.
        return 'Ordo';
    }

    get_possible_move_list() {
        // Retourne la liste de tous les coups possibles
        // La liste retournée doit être un tableau d'objet Move.
    }

    is_finished() {
        // Retourne si la partie est terminée ou non.
        return this._is_finished;
    }

    move(move) {
        // Permet d'appliquer un coup et mets à jour l'état du jeu.
    }

    parse(str) {
        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    to_string() {
        // Construit une représentation sous forme d'une chaîne de caractères
        // de l'état du jeu
    }

    winner_is() {
        // Indique le joueur qui a gagné.
        return this._winner_color;
    }
    _initialize_board(){
        this._board = new Array(8);

        for (let i = 0; i < 8; i++) {
            this._board[i] = new Array(10);
        }
        for(let i = 0; i < 2;i++){
            this._board[0][2 + i*4] = new Piece(Color.BLACK, new Coordinates(0, 2 + i*4));
            this._board[0][3 + i*4] = new Piece(Color.BLACK, new Coordinates(0, 3 + i*4));
            this._board[1][2 + i*4] = new Piece(Color.BLACK, new Coordinates(1, 2 + i*4));
            this._board[1][3 + i*4] = new Piece(Color.BLACK, new Coordinates(1, 3 + i*4));
        }

        for (let i = 0; i < 3; i++) {
                this._board[1][i*4] = new Piece(Color.BLACK, new Coordinates(1, i*4));
                this._board[1][1 + i*4] = new Piece(Color.BLACK, new Coordinates(1,1 + i*4));
                this._board[2][i*4] = new Piece(Color.BLACK, new Coordinates(2, i*4));
                this._board[2][1 + i*4] = new Piece(Color.BLACK, new Coordinates(2, 1 + i*4));
        }
        for(let i = 0; i < 2;i++){
            this._board[6][2 + i*4] = new Piece(Color.WHITE, new Coordinates(6,2 + i*4));
            this._board[6][3 + i*4] = new Piece(Color.WHITE, new Coordinates(6,3 + i*4));
            this._board[7][2 + i*4] = new Piece(Color.WHITE, new Coordinates(7,2 + i*4));
            this._board[7][3 + i*4] = new Piece(Color.WHITE, new Coordinates(7,3 + i*4));
        }

        for (let i = 0; i < 3; i++) {
            this._board[5][i*4] = new Piece(Color.WHITE, new Coordinates(5, i*4));
            this._board[5][1 + i*4] = new Piece(Color.WHITE, new Coordinates(5, 1 +i*4));
            this._board[6][i*4] = new Piece(Color.WHITE, new Coordinates(6, i*4));
            this._board[6][1 + i*4] = new Piece(Color.WHITE, new Coordinates(6, 1+i*4));
        }
    }
}

export default Engine;