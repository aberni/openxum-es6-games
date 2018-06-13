"use strict";

import OpenXum from '../../openxum/engine.mjs';
import Coordinates from './coordinates.mjs';
import Piece from './piece.mjs';
import Color from './color.mjs';
import Move from './move.mjs';
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

    // public methods
    apply_moves(moves) {

    }

    clone() {
        let o = new Engine(this._type, this._color);
        let b = new Array(11);

        for(let i = 0; i < 10; i++) {
            b[i] = new Array(10);
        }

        for(let x = 0; x < 10; x++) {
            for(let y = 0; y < 8; y++) {
                if (this._board[x][y] !== undefined) {
                    b[x][y] = this._board[x][y].clone();
                }
            }
        }

        o._set(this._is_finished, this._winner_color, b, this._king);

        return o;
    }


    _set(isf, wc, b) {
        this._is_finished = isf;
        this._winner_color = wc;
        this._board = b;
    }

    current_color() {
        // Retourne le joueur en train de jouer.
        return this._color;
    }

    get_name() {
        // Retourne le nom du jeu.
        return 'Ordo';
    }

    get_type() {
        return this._type;
    }

    is_finished() {
        return this._is_finished;
    }

    move(move) {
        //acces coordo de la piece
        let fromX = move.from().x();
        let fromY = move.from().y();
        //clonage de la piece
        let piece = move.piece().clone();
        //Le clone a les coordo du moveyto
        piece.set_coordinates(move.to());

        this._board[move.to().x()][move.to().y()] = piece;
        this._board[fromX][fromY] = undefined;

        //this._check_pawn_taken(move);
        //this._check_winner();


        if (!this.is_finished()) {
            this._change_color();
        }
    }
    parse(str) {
        // TODO
    }

    to_string() {
        // TODO
    }
    //Retourne vrai si la piece peut se déplacer en x,y
    _verify_moving(piece, x, y) {
        //La liste des moves pour la piece
        let possible_moves = this._get_possible_move_list(piece);
        let val = false;

        //Verifie si x,y fait partie des moves possibles
        possible_moves.forEach(function(move) {
            if (move.to().x() === x && move.to().y() === y) {
                val = true;
            }
        });

        return val;
    }

    get_possible_move_list() {
        let moves = [];

        for(let x = 0; x < 10; x++) {
            for(let y = 0; y < 8; y++) {
                if (this._board[x][y] !== undefined) {
                    moves = moves.concat(this._get_possible_move_list(this._board[x][y]));
                }
            }
        }

        return moves;
    }

    _get_possible_move_list(piece){
        let moves = [];

        /*if(piece._color ===this._color) {
            let pc = piece.coordinates();
            //Up
            if (pc.y() > 0) {
                for (let dy = 1; dy < pc.y(); dy++) {
                    if (this._board[pc.x()][pc.y() - dy] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - dy)));
                    }
                    else {
                        break;
                    }
                }
            }
            //Down
            if(pc.y() < 8){
                for(let dy = 1; dy< 8 - pc.y(); dy++){

                   if(this._board[pc.x()][pc.y()+dy] === undefined) {
                       moves.push( new Move(piece.clone(), new Coordinates(pc.x(), pc.y()+dy)));
                   }
                   else{break;}
                }
            }
            //Right
            if(pc.x() <10){
                for(let dx = 1; dx < 10 - pc.x();dx++){

                    if(this._board[pc.x()+dx][pc.y()] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y())));
                    }
                    else{break;}
                }
            }
            //Left
            if(pc.x() >0){
                for(let dx = 1; dx < pc.x()+1;dx++){

                    if(this._board[pc.x()-dx][pc.y()] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y())));
                    }
                    else{break;}
                }
            }
        }*/

        if(piece._color ===this._color) {
            let pc = piece.coordinates();
            //Down
            if(pc.y() < 8){
                for(let dy = 1; dy< 8 - pc.y(); dy++){

                    if(this._board[pc.x()][pc.y()+dy] === undefined && this._is_connected(piece,pc.x(),pc.y()+dy) ) {
                        moves.push( new Move(piece.clone(), new Coordinates(pc.x(), pc.y()+dy)));
                    }
                    else{break;}
                }
            }

        }

        //Piece de meme couleur
        //Recupere les coordonnées
        //On veut aller en bas
        //Il faut rester inferieur a 8
        //On peut se deplace de notre position jusqu'a rencontre un pion adverse et que
        // l'on reste voisin d'un autre pion
        //console.log(moves);

        return moves;

    }

    _is_connected(piece,x,y){
        let color = piece.color();
        //console.log(color);
        //console.log(this._board[x][y-1].color());
        //console.log(this._board[x][y+1]._color);
        //Up
        if (this._board[x][y-1] !== undefined && this._board[x][y-1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //Down
        if(this._board[x][y+1] !== undefined && this._board[x][y+1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        /*//Left
        else if(this._board[x-1][y] !== undefined && this._board[x-1][y].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //Right
        else if(this._board[x+1][y] !== undefined && this._board[x+1][y].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //LU
        else if(this._board[x-1][y-1] !== undefined && this._board[x-1][y-1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //RU
        else if(this._board[x+1][y-1] !== undefined && this._board[x+1][y-1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //LD
        else if(this._board[x-1][y+1] !== undefined && this._board[x-1][y+1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}
        //RD
        else if(this._board[x+1][y+1] !== undefined && this._board[x][y+1].color() === color && x >= 0 && x < 10 && y >= 0 && y < 8 )
        {return true;}*/
        else{return false;}

    }

    winner_is() {
        return this._winner_color;
    }
    get_count_black_pawn() {
        return this._count_black_pawn;
    }

    get_count_white_pawn() {
        return this._count_white_pawn;
    }

    get_distance_to(c1, c2) {
        return Math.abs(c1.x() - c2.x()) + Math.abs(c1.y() - c2.y());
    }

    show_board() {
        console.log(" ");
        for(let x = 0; x < 11; x++) {
            let text = "";
            for(let y = 0; y < 11; y++) {
                let piece = this._board[x][y];

                if (piece === undefined) text += "*";
                else if (piece.isKing()) text += "K";
                else if (piece.color() === Color.WHITE) text +="W";
                else if (piece.color() === Color.BLACK) text += "B";
            }
            
            console.log(text);
        }
    }

    // private methods

    _change_color() {
        this._color = (this._color === Color.WHITE) ? Color.BLACK : Color.WHITE;
    }

    _initialize_board() {
        this._board = new Array(10);

        for (let i = 0; i < 10; i++) {
            this._board[i] = new Array(8);
        }

        for(let i = 0; i < 2;i++){
            this._board[2 + i*4][0] = new Piece(Color.BLACK, new Coordinates(2 + i*4,0));
            this._board[3 + i*4][0] = new Piece(Color.BLACK, new Coordinates(3 + i*4,0));
            this._board[2 + i*4][1] = new Piece(Color.BLACK, new Coordinates(2 + i*4,1));
            this._board[3 + i*4][1] = new Piece(Color.BLACK, new Coordinates(3 + i*4,1));
        }
        for (let i = 0; i < 3; i++) {
                this._board[i*4][1] = new Piece(Color.BLACK, new Coordinates(i*4,1));
                this._board[1 + i*4][1] = new Piece(Color.BLACK, new Coordinates(1 + i*4,1));
                this._board[i*4][2] = new Piece(Color.BLACK, new Coordinates(i*4,2));
                this._board[1 + i*4][2] = new Piece(Color.BLACK, new Coordinates(1 + i*4,2));
        }
        /*
        let sign=1;
        for(let i = 0 ; i <10 ; i++){

            this._board[i][1] = new Piece(Color.BLACK, new Coordinates(i,1));

            for(let j=0; j<2 ; j++){
                this._board[i][1+sign] = new Piece(Color.BLACK, new Coordinates(i,1+sign));

            }
            sign *=-1;
        }
        */
        for(let i = 0; i < 2;i++){
            this._board[2 + i*4][6] = new Piece(Color.WHITE, new Coordinates(2 + i*4,6));
            this._board[3 + i*4][6] = new Piece(Color.WHITE, new Coordinates(3 + i*4,6));
            this._board[2 + i*4][7] = new Piece(Color.WHITE, new Coordinates(2 + i*4,7));
            this._board[3 + i*4][7] = new Piece(Color.WHITE, new Coordinates(3 + i*4,7));
        }

        for (let i = 0; i < 3; i++) {
            this._board[i*4][5] = new Piece(Color.WHITE, new Coordinates(i*4,5));
            this._board[1 + i*4][5] = new Piece(Color.WHITE, new Coordinates(1 +i*4,5));
            this._board[i*4][6] = new Piece(Color.WHITE, new Coordinates(i*4,6));
            this._board[1 + i*4][6] = new Piece(Color.WHITE, new Coordinates(1+i*4,6));
        }

    }
}

export default Engine;