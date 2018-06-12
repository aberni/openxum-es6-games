// lib/openxum-core/games/neutreeko/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import Piece from './piece.mjs';
import Coordinates from './coordinates.mjs';

//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(type) {
       super();
       // Déclaration de tous les attributs nécessaires
        this._type = type;
        this._current_color = Color.BLACK;
        this._count_white_pawn = 3;
        this._count_black_pawn = 3;
        this._is_finished = false;
        this._winner_color = Color.NONE;
       //this._intersections = [];
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
       return this._current_color;
    }

    get_name() {
       return 'Neutreeko';
    }

    get_possible_move_list() {
       // Retourne la liste de tous les coups possibles
       // La liste retournée doit être un tableau d'objet Move.
    }

    is_finished() {
       // Retourne si la partie est terminée ou non.
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
       return this._winner_color;
    }

    _initialize_board() {
        this._board = new Array(5);

        for (let i = 0; i < 5; i++) {
            this._board[i] = new Array(5);
        }

        this._board[2][1] = new Piece(Color.BLACK, new Coordinates(2, 1));
        this._board[1][4] = new Piece(Color.BLACK, new Coordinates(1, 4));
        this._board[3][4] = new Piece(Color.BLACK, new Coordinates(3, 4));

        this._board[1][0] = new Piece(Color.WHITE, new Coordinates(1, 0));
        this._board[3][0] = new Piece(Color.WHITE, new Coordinates(3, 0));
        this._board[2][3] = new Piece(Color.WHITE, new Coordinates(2, 3));
    }
}

export default Engine