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
        this._count_white_pawn = 8;
        this._count_black_pawn = 20;
        this._disconnect_white = false;
        this._disconnect_black = false;
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

        this._check_voisin(move);

        this._check_pawn_taken(move);
        //this._check_winner();
        //console.log(this._check_winner());

        this._board[move.to().x()][move.to().y()] = piece;
        this._board[fromX][fromY] = undefined;

        this._check_winner();

        if (!this.is_finished()) {
            this._change_color();
        }
    }

    _check_voisin(move){
        let movX = move.to().x();
        let movY = move.to().y();
        //let piece_v = this._board[movX][movY] ;
        //let piece_test = new Piece(0,new Coordinates(movX,movY));
        console.log(this._is_connected(move.piece(),movX,movY));
        let nbVdumove = this._is_connected(move.piece(),movX,movY);
        if(nbVdumove ==0)
        {
            if(this._color === Color.BLACK)
            {this._disconnect_black = true;}
            else
            {this._disconnect_white = true;}
        }
        else{
            this._disconnect_white=false;
            this._disconnect_black=false;
        }
    }

    _check_pawn_taken(move){
        let pieceTaken = this._board[move.to().x()][move.to().y()];
        //console.log(move.to().x());
        //console.log(move.to().y());

        if(this._board[move.to().x()][move.to().y()] !== undefined) {
            if (pieceTaken.color() === Color.WHITE) {
                this._count_white_pawn--;
                console.log(this._count_white_pawn);
            }
            else {
                this._count_black_pawn--;
                console.log(this._count_black_pawn);
            }
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
        let taken;

        if(this._count_white_pawn === 1 && piece._color === this._color)
        {
            let pc = piece.coordinates();

            //Up
            if (pc.y() > 0) {
                for (let dy = 1; dy < pc.y()+1; dy++) {

                    if(this._board[pc.x()][pc.y()-dy] !== undefined && this._board[pc.x()][pc.y() - dy].color() !== piece.color() )
                    {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - dy)));
                            break;
                    }
                    if (this._board[pc.x()][pc.y() - dy] === undefined) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - dy)));
                    }
                    //else {break;}
                }
            }

            //Down
            if(pc.y() <= 7){
                for(let dy = 1; dy< 8 - pc.y(); dy++){
                    if(this._board[pc.x()][pc.y()+dy] !== undefined && this._board[pc.x()][pc.y()+dy].color() !== piece.color() )
                    {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() + dy)));
                            break;
                    }
                    if(this._board[pc.x()][pc.y()+dy] === undefined){
                        moves.push( new Move(piece.clone(), new Coordinates(pc.x(), pc.y()+dy)));
                    }
                    //else{break;}
                }
            }
            //Right
            if(pc.x() < 9){
                for(let dx = 1; dx < 10 - pc.x();dx++){
                    if(this._board[pc.x()+dx][pc.y()] !== undefined && this._board[pc.x()+dx][pc.y()].color() !== piece.color() )
                    {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y())));
                            break;
                    }

                    if(this._board[pc.x()+dx][pc.y()] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y())));
                    }
                    //else{break;}
                }
            }
            //Left
            if(pc.x() >0){
                for(let dx = 1; dx < pc.x()+1;dx++){
                    if(this._board[pc.x()-dx][pc.y()] !== undefined && this._board[pc.x()-dx][pc.y()].color() !== piece.color() )
                    {

                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y())));
                            break;
                    }
                    if(this._board[pc.x()-dx][pc.y()] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y())));
                    }
                    //else{break;}
                }
            }
            //BR
            if(pc.x() <= 9 && pc.y() <= 7 )
            {
                for(let dx = 1,dy = 1; dx < 10-pc.x() && dy < 7-pc.y();dx++,dy++){
                    if(this._board[pc.x()+dx][pc.y()+dy] !== undefined && this._board[pc.x()+dx][pc.y()+dy].color() !== piece.color() ) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x() + dx, pc.y() + dy)));
                        break;
                    }
                    if(this._board[pc.x()+dx][pc.y()+dy] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()+dy)));
                    }
                    //else{break;}
                }
            }
            //BL
            if(pc.x() > 0 && pc.y() <= 7 )
            {
                for(let dx = 1,dy = 1; dx < pc.x()+1 && dy < 8-pc.y();dx++,dy++){
                    if(this._board[pc.x()-dx][pc.y()+dy] !== undefined && this._board[pc.x()-dx][pc.y()+dy].color() !== piece.color() )
                    {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()+dy)));
                            break;
                    }
                    if(this._board[pc.x()-dx][pc.y()+dy] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()+dy)));
                    }
                    //else{break;}
                }
            }
            //UL
            if(pc.x() > 0 && pc.y() > 0 )
            {
                for(let dx = 1,dy = 1; dx < pc.x()+1 && dy < pc.y()+1;dx++,dy++){
                    if(this._board[pc.x()-dx][pc.y()-dy] !== undefined && this._board[pc.x()-dx][pc.y()-dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()-dx,pc.y()-dy))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()-dy)));
                            break;
                        }
                    }
                    if(this._board[pc.x()-dx][pc.y()-dy] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()-dy)));
                    }
                    //else{break;}
                }
            }
            //RU
            if(pc.x() <= 9 && pc.y() > 0 )
            {
                for(let dx = 1,dy = 1; dx < 10-pc.x() && dy < pc.y()+1;dx++,dy++){
                    if(this._board[pc.x()+dx][pc.y()-dy] !== undefined && this._board[pc.x()+dx][pc.y()-dy].color() !== piece.color() )
                    {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()-dy)));
                            break;
                    }
                    if(!this._is_connected(piece.clone(),pc.x()+dx,pc.y()-dy))
                    {
                        //console.log("pas connect UR");

                    }
                    if(this._board[pc.x()+dx][pc.y()-dy] === undefined){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()-dy)));
                    }
                    //else{break;}
                }
            }
        }

        if(piece._color ===this._color) {
            let pc = piece.coordinates();
            //Up
            if (pc.y() > 0) {
                for (let dy = 1; dy < pc.y()+1; dy++) {

                    moves = this._possible_moves_function(piece, pc.x(), pc.y()-dy, moves);

                    if(moves.length>=1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }

                    /*

                    if(this._board[pc.x()][pc.y()-dy] !== undefined && this._board[pc.x()][pc.y() - dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x(),pc.y()-dy)) {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - dy)));

                            break;
                        }
                    }
                    if(this._board[pc.x()][pc.y()-dy] !== undefined && this._board[pc.x()][pc.y() - dy].color() === piece.color())
                    {break;}
                    if (this._board[pc.x()][pc.y() - dy] === undefined && this._is_connected(piece.clone(),pc.x(),pc.y()-dy)>0) {
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() - dy)));
                    }*/
                    //else {break;}
                }
            }
            //Down
            if(pc.y() <= 7){
                for(let dy = 1; dy< 8 - pc.y(); dy++){

                    moves = this._possible_moves_function(piece, pc.x(), pc.y()+dy, moves);

                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }

                    /*
                    if(this._board[pc.x()][pc.y()+dy] !== undefined && this._board[pc.x()][pc.y()+dy].color() !== piece.color() )
                        {
                            if(this._is_connected(piece.clone(),pc.x(),pc.y()+dy))
                            {
                                moves.push(new Move(piece.clone(), new Coordinates(pc.x(), pc.y() + dy)));
                                break;
                            }
                        }
                    if(this._board[pc.x()][pc.y()+dy] !== undefined && this._board[pc.x()][pc.y() + dy].color() === piece.color())
                        {break;}
                   if(this._board[pc.x()][pc.y()+dy] === undefined && this._is_connected(piece.clone(),pc.x(),pc.y()+dy)>0){
                       moves.push( new Move(piece.clone(), new Coordinates(pc.x(), pc.y()+dy)));
                   }
                   */
                   //else{break;}
                }
            }
            //Right
            if(pc.x() < 9){
                for(let dx = 1; dx < 10 - pc.x();dx++){

                    moves = this._possible_moves_function(piece, pc.x()+dx, pc.y(), moves);

                    if(moves.length >= 1 &&moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }


                    /*
                    if(this._board[pc.x()+dx][pc.y()] !== undefined && this._board[pc.x()+dx][pc.y()].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()+dx,pc.y()))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y())));
                            break;
                        }
                    }
                    if(this._board[pc.x()+dx][pc.y()] !== undefined && this._board[pc.x()+dx][pc.y()].color() === piece.color())
                    {break;}
                    if(this._board[pc.x()+dx][pc.y()] === undefined && this._is_connected(piece.clone(),pc.x()+dx,pc.y())>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y())));
                    }
                    */
                    //else{break;}
                }
            }
            //Left
            if(pc.x() >0){
                for(let dx = 1; dx < pc.x()+1;dx++){
                    moves = this._possible_moves_function(piece, pc.x()-dx, pc.y(), moves);

                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }
                    /*
                    if(this._board[pc.x()-dx][pc.y()] !== undefined && this._board[pc.x()-dx][pc.y()].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()-dx,pc.y()))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y())));
                            break;
                        }
                    }
                    if(this._board[pc.x()-dx][pc.y()] !== undefined && this._board[pc.x()-dx][pc.y()].color() === piece.color())
                    {break;}
                    if(this._board[pc.x()-dx][pc.y()] === undefined && this._is_connected(piece.clone(),pc.x()-dx,pc.y())>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y())));
                    }*/
                    //else{break;}
                }
            }
            //BR
            if(pc.x() <= 9 && pc.y() <= 7 )
            {
                for(let dx = 1,dy = 1; dx < 10-pc.x() && dy < 7-pc.y();dx++,dy++){
                    moves = this._possible_moves_function(piece, pc.x()+dx, pc.y()+dy, moves);
                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }
                    /*
                    if(this._board[pc.x()+dx][pc.y()+dy] !== undefined && this._board[pc.x()+dx][pc.y()+dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()+dx,pc.y()+dy))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()+dy)));
                            break;
                        }
                    }
                    if(this._board[pc.x()+dx][pc.y()+dy] !== undefined && this._board[pc.x()+dx][pc.y()+dy].color() === piece.color())
                    {break;}
                    if(this._board[pc.x()+dx][pc.y()+dy] === undefined && this._is_connected(piece.clone(),pc.x()+dx,pc.y()+dy)>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()+dy)));
                    }
                    */
                    //else{break;}
                }
            }
            //BL
            if(pc.x() > 0 && pc.y() <= 7 )
            {
                for(let dx = 1,dy = 1; dx < pc.x()+1 && dy < 8-pc.y();dx++,dy++){
                    moves = this._possible_moves_function(piece, pc.x()-dx, pc.y()+dy, moves);
                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }

                    /*
                    if(this._board[pc.x()-dx][pc.y()+dy] !== undefined && this._board[pc.x()-dx][pc.y()+dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()-dx,pc.y()+dy))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()+dy)));
                            break;
                        }
                    }
                    if(this._board[pc.x()-dx][pc.y()+dy] !== undefined && this._board[pc.x()-dx][pc.y()+dy].color() === piece.color())
                    {break;}
                    if( !this._is_connected(piece.clone(),pc.x()-dx,pc.y()+dy))
                    {
                        //console.log("pas connect BL");

                    }

                    if(this._board[pc.x()-dx][pc.y()+dy] === undefined && this._is_connected(piece.clone(),pc.x()-dx,pc.y()+dy)>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()+dy)));
                    }
                    */
                    //else{break;}
                }
            }
            //UL
            if(pc.x() > 0 && pc.y() > 0 )
            {
                for(let dx = 1,dy = 1; dx < pc.x()+1 && dy < pc.y()+1;dx++,dy++){

                    let moves_sample = moves;

                    moves = this._possible_moves_function(piece, pc.x()-dx, pc.y()-dy, moves);

                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }

                    /*
                    if(this._board[pc.x()-dx][pc.y()-dy] !== undefined && this._board[pc.x()-dx][pc.y()-dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()-dx,pc.y()-dy))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()-dy)));
                            break;
                        }
                    }
                    if(this._board[pc.x()-dx][pc.y()-dy] !== undefined && this._board[pc.x()-dx][pc.y()-dy].color() === piece.color())
                    {break;}
                    if( !this._is_connected(piece.clone(),pc.x()-dx,pc.y()-dy))
                    {
                        //console.log("pas connect UL");

                    }

                    if(this._board[pc.x()-dx][pc.y()-dy] === undefined && this._is_connected(piece.clone(),pc.x()-dx,pc.y()-dy)>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()-dx, pc.y()-dy)));
                    }
                    */
                    //else{break;}
                }
            }
            //RU
            if(pc.x() <= 9 && pc.y() > 0 )
            {
                for(let dx = 1,dy = 1; dx < 10-pc.x() && dy < pc.y()+1;dx++,dy++){
                    //let moves_sample = moves;
                    moves = this._possible_moves_function(piece, pc.x()+dx, pc.y()-dy, moves);
                    if(moves.length >= 1 && moves[moves.length-1].to().x() === 50 && moves[moves.length-1].to().y() === 50 &&  moves[moves.length-1].piece().color() === this._color )
                    {
                        moves.pop();
                        break;
                    }

                    /*
                    if(this._board[pc.x()+dx][pc.y()-dy] !== undefined && this._board[pc.x()+dx][pc.y()-dy].color() !== piece.color() )
                    {
                        if(this._is_connected(piece.clone(),pc.x()+dx,pc.y()-dy))
                        {
                            moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()-dy)));
                            break;
                        }
                    }
                    if(this._board[pc.x()+dx][pc.y()-dy] !== undefined && this._board[pc.x()+dx][pc.y()-dy].color() === piece.color())
                    {break;}
                    if(!this._is_connected(piece.clone(),pc.x()+dx,pc.y()-dy))
                    {
                        //console.log("pas connect UR");

                    }
                    if(this._board[pc.x()+dx][pc.y()-dy] === undefined && this._is_connected(piece.clone(),pc.x()+dx,pc.y()-dy)>0){
                        moves.push(new Move(piece.clone(), new Coordinates(pc.x()+dx, pc.y()-dy)));
                    }
                    */
                    //else{break;}
                }
            }
        }
        //Piece de meme couleur
        //Recupere les coordonnées
        //On peut se deplace de notre position jusqu'a rencontre un pion adverse et que
        // l'on reste voisin d'un autre pion
        //console.log(moves);
        return moves;

    }

    _possible_moves_function(piece, x,y,moves){

        if(this._board[x][y] !== undefined && this._board[x][y].color() !== piece.color() )
        {
            if(this._is_connected(piece.clone(),x,y))
            {
                moves.push(new Move(piece.clone(), new Coordinates(x,y)));
                return moves;
            }
        }
        if(this._board[x][y] !== undefined && this._board[x][y].color() === piece.color())
        {

            moves.push(new Move(piece.clone(), new Coordinates(50,50)));
            return moves;
        }
        if(this._board[x][y] === undefined && this._is_connected(piece.clone(),x,y)>0){
            moves.push(new Move(piece.clone(), new Coordinates(x, y)));

        }

        return moves;

    }

    _is_connected(piece,x,y) {
        let color = piece.color();
        let nbvoisin = 0;
        //console.log(color);
        let coordOri = piece.coordinates();
        //console.log(color);
        //console.log(this._board[x][y-1].color());
        //console.log(this._board[x][y+1]._color);
        //Up
        if (y - 1 >= 0 && this._board[x][y - 1] !== undefined && this._board[x][y - 1].color() === color && (coordOri.y() !== y - 1 || coordOri.x() !== x)) {
            //console.log("top true");
            nbvoisin++;
        }
        //Down
        if (y + 1 <= 7 && this._board[x][y + 1] !== undefined && this._board[x][y + 1].color() === color && (coordOri.y() !== y + 1 || coordOri.x() !== x)) {
            //console.log("down true");
            nbvoisin++;
        }
        //Left
        if (x - 1 >= 0 && this._board[x - 1][y] !== undefined && this._board[x - 1][y].color() === color && ( coordOri.x() !== x - 1 || coordOri.y() !== y)) {
            //console.log("left true");
            nbvoisin++;
        }
        //Right
        if (x + 1 <= 9 && this._board[x + 1][y] !== undefined && this._board[x + 1][y].color() === color && ( coordOri.x() !== x + 1 || coordOri.y() !== y)) {
            //console.log("right true");
            nbvoisin++;
        }
        //UL
        if (x - 1 >= 0 && y - 1 >= 0 && this._board[x - 1][y - 1] !== undefined && this._board[x - 1][y - 1].color() === color && ( coordOri.x() !== x - 1 || coordOri.y() !== y - 1 )) {
            //console.log("LU true");
            nbvoisin++;
        }
        //UR
        if (x + 1 <= 9 && y - 1 >= 0 && this._board[x + 1][y - 1] !== undefined && this._board[x + 1][y - 1].color() === color && ( coordOri.x() !== x + 1 || coordOri.y() !== y - 1 )) {
            //console.log("RU true");
            nbvoisin++;
        }
        //LD
        if (x - 1 >= 0 && y + 1 <= 7 && this._board[x - 1][y + 1] !== undefined && this._board[x - 1][y + 1].color() === color && ( coordOri.x() !== x - 1 || coordOri.y() !== y + 1 )) {
            //console.log("LD true");
            nbvoisin++;
        }
        //RD
        if (x + 1 <= 9 && y + 1 <= 7 && this._board[x + 1][y + 1] !== undefined && this._board[x + 1][y + 1].color() === color && ( coordOri.x() !== x + 1 || coordOri.y() !== y + 1 )) {
            nbvoisin++;
        }
        else {
            return  nbvoisin;
        }
        return nbvoisin;
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

    _check_winner() {

        if(this._color === Color.WHITE){
            if(this._count_black_pawn === 0)
            {
                this._is_finished = true;
                return true;
            }
            for(let i=0 ; i< 10 ; i++){
                if(this._board[i][0] !== undefined && this._board[i][0]._color === Color.WHITE ){
                    this._is_finished = true;
                    return true;
                }
            }

        }
        if(this._color === Color.BLACK ){
            if(this._count_white_pawn === 0)
            {
                this._is_finished = true;
                return true;
            }
            for(let j = 0; j<10 ; j++){
                if(this._board[j][7] !== undefined && this._board[j][7]._color === Color.BLACK){
                    this._is_finished = true;
                    return true;
                }
            }
        }
        return false;

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
        /*
        for (let i = 0; i < 3; i++) {
            this._board[i*4][5] = new Piece(Color.WHITE, new Coordinates(i*4,5));
            this._board[1 + i*4][5] = new Piece(Color.WHITE, new Coordinates(1 +i*4,5));
            this._board[i*4][6] = new Piece(Color.WHITE, new Coordinates(i*4,6));
            this._board[1 + i*4][6] = new Piece(Color.WHITE, new Coordinates(1+i*4,6));
        }*/

    }
}

export default Engine;