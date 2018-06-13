// lib/openxum-core/games/neutreeko/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import Piece from './piece.mjs';
import Coordinates from './coordinates.mjs';
import Move from './move.mjs';

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
        let moves = [];

        for(let x = 0; x < 5; x++) {
            for(let y = 0; y < 5; y++) {
                if (this._board[x][y] !== undefined) {
                    moves = moves.concat(this._get_possible_move_list(this._board[x][y]));
                }
            }
        }

        return moves;
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

    _get_possible_move_list(piece) {
        let moves = [];

        if (piece.color() === this._color) {
            let pc = piece.coordinates();

            // Right
            if (pc.x() < 4) {
                for(let x = 1; x < (5 - pc.x()); x++) {
                    if (this._board[pc.x() + x][pc.y()] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x() + x, pc.y())));
                    }
                    else {
                        break;
                    }
                }
            }

            // Left
            if (pc.x() > 0) {
                for(let x = 1; x < pc.x() + 1; x++) {
                    if (this._board[pc.x() - x][pc.y()] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x() - x, pc.y())));
                    }
                    else {
                        break;
                    }
                }
            }

            // Top
            if (pc.y() > 0) {
                for(let y = 1; y < pc.y() + 1; y++) {
                    if (this._board[pc.x()][pc.y() - y] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - y)));
                    }
                    else {
                        break;
                    }
                }
            }

            // Bottom
            if (pc.y() < 4) {
                for(let y = 1; y < (5 - pc.y()); y++) {
                    if (this._board[pc.x()][pc.y() + y] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() + y)));
                    }
                    else {
                        break;
                    }
                }
            }
        }
        
        return moves;
    }
}

export default Engine;