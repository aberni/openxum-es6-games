"use strict";

import Color from './color.mjs';
import isColor from './color.mjs';
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';

import Move from './move.mjs';

function isValid(cell){
    return cell<49 && cell>=0;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class Board {
    constructor() {
        this._board=new Array(); //an array of cells
        this._idPawn=49;
    }

// private methods

    _randomBoardTest(){ //initialize the board with random color
        let numberColor=new Array(0,0,0,0,0,0,0); // array with the number of iteration of each color
        let i;
        for(i=0;i<49;i+=1){ // for each cell of the board
            let num;
            let bool=false;
            do {
                num =getRandomInt(0, 6);
                if(numberColor[num]<7){ // add 1 to the color iteration number
                    numberColor[num]+=1;
                    bool=true;
                }
            }while(!bool);// while the color isnt already 7 times presents
            this._board.push(new Cell( new Coordinates(i),num,i)); //change the color of the cell based on the number generated
        }
    }

    _randomBoard(){ //initialize the board with random color
        let numberColor=new Array(0,0,0,0,0,0,0); // array with the number of iteration of each color
        let i;
        for(i=0;i<47;i+=1){ // for each cell of the board
            let num;
            do {
                num =getRandomInt(0, 6);
            }while(numberColor[num]<7);// while the color isnt already 7 times presents
            numberColor[num]+=1;// add 1 to the color iteration number
            this._board[i].set_color(num); //change the color of the cell based on the number generated
        }
    }

    _boardOk(){ // check if the board is playable
        return true;
    }

// public methods

    print(){
        let a;
        for(a in this._board){
            a.print();
        }
    }

    clone(){
        let a=new Board();
        for(i=0;i<47;i+=1){
            a._board[i]=this._board[i].clone();
        }
        a._idPawn=this._idPawn;
        return a;
    }

    get_cell_by_id(id){
        return this._board[id];
    }

    initBoard() { //initialize the board
        do {
            this._createBoard();
            this._randomBoard();
            console.log("init board");
        }while(!this._boardOk());
    }

    get_id_at_coord(c){ // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
        let cell;
        for(cell in this._board) {
            if(Object.is(cell.get_coordinates(),c)){
                return cell.get_id();
            }
        }
        return -1;
    }

    get_cell_by_coord(c){ // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
        let cell;
        for(cell=0;cell<49;cell+=1) {
            if(Object.is(this._board[cell].get_coordinates(),c)){
                return cell;
            }
        }
        return -1;
    }

    get_one_move(color,matrice){
        let coordinates;
        let c;
        console.log(this._idPawn.get_coordinates());
        coordinates=new Coordinates(this._idPawn.get_coordinates()); //get the coordinates of _idpawn
        let id=this._idPawn;
        do{
            coordinates.matrix(matrice);//move to the the next cell
            id = this.get_id_at_coord(c);// get the id of the cell
            if(isColor(this._board[id]. get_color())) { // if the cell isn't empty and have a valid color
                if(isColor(color) && !Object.is(color,this._board[id].get_color())){
                    return -1;
                }else{
                    return id;
                }
            }
        }while(!isValid(id));// if the cell isn't valid (we are out of the board)
        return -1;
    }

    get_move(color){ //if color is not defined that mean this is the first coup of the player,
        let trMat=((-1,-1,0),(0,-1,-1),(-1,0,-1),(1,1,0),(0,1,1),(1,0,1));
        let tabMove=[];
        let coordinate;
        let mat;
        if(isValid(this._idPawn)) { // Check if the pawn is already placed
            let idA=-1;
            for(mat in trMat){
                idA = this.get_one_move(color, mat);
                if(isValid(idA)){
                    tabMove.push(new Move(this._idPawn,idA));
                }
            }
            if(tabMove.length>0){ // if we can play
                return tabMove;
            }
            else{ // if there is no move available in each direction
                let i;
                for(i=0;i<49;i+=1){
                    if(isColor(this._board[i])){
                        tabMove.push(new Move(this._idPawn,this._board[i])); // the pawn can move to all the cells which are playable
                    }
                }
                return tabMove;
            }
        }

        else { //if the pawn isn't placed
            let i;
            for(i=0;i<49;i+=1){
                tabMove.push(new Move(this._idPawn,i)); // the pawn can move to all the cells
            }
            return tabMove;
        }
    }

    apply_move(Move){ // Apply the move to the board
        if(isValid(this._idPawn)) {
            this._board[_idPawn].set_color(7);
        }
        this._board[Move.get_to()].set_color(8);
        console.log(this._board);
    }
}


export default Board;