"use strict";

import Color from './color.mjs';
import {convert_to_hexa,is_color} from './color.mjs';
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';

import Move from './move.mjs';

function is_valid(cell){
    return cell<49 && cell>=0;
}

function get_random_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


class Board {
    constructor() {
        this._board=new Array(); //an array of cells
        this._id_pawn=49;
    }

// private methods

    _random_board(){ //final version
        let number_color=new Array(0,0,0,0,0,0,0); // array with the number of iteration of each color
        for(let i=0;i<49;i+=1){ // for each cell of the board
            let num;
            let bool=false;
            do {
                num =get_random_int(0, 6);
                if(number_color[num]<7){ // add 1 to the color iteration number
                    number_color[num]+=1;
                    bool=true;
                }
            }while(!bool);// while the color isnt already 7 times presents
            this._board.push(new Cell( new Coordinates(i),num,i)); //change the color of the cell based on the number generated
        }
    }

    _board_ok(){ // TO DO
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
        for(let i=0;i<47;i+=1){
            a._board[i]=this._board[i].clone();
        }
        a._id_pawn=this._id_pawn;
        return a;
    }

    get_cell_by_id(id){
        return this._board[id];
    }

    init_board() { //initialize the board
        do {
            this._random_board();
        }while(!this._board_ok());
    }

    init_board_test1(){
        this._random_board();
        this._id_pawn=16;
        this._board[2].set_color(7);
        this._board[6].set_color(7);
        this._board[8].set_color(7);
        this._board[9].set_color(7);
        this._board[11].set_color(4);
        this._board[12].set_color(7);
        this._board[16].set_color(8);
        this._board[19].set_color(1);
        this._board[20].set_color(7);
        this._board[24].set_color(7);
        this._board[25].set_color(7);
        this._board[30].set_color(2);
        this._board[32].set_color(7);
        this._board[40].set_color(7);
        this._board[46].set_color(7);

    }


    get_id_at_coord(c){ // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
        for(let id=0;id<49;id+=1) {
            let comp=this._board[id].get_coordinates();
            //console.log("identifiant teste : ",id);
            //console.log(comp,c);
            if(comp.get_pos_x()===c.get_pos_x() && comp.get_pos_y()===c.get_pos_y() && comp.get_pos_z()===c.get_pos_z()){
                return id;
            }
        }
        return -1;
    }

    get_cell_by_coord(c){ // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
        let cell = this.get_id_at_coord(c);
        if(c.is_valid()) {
            return cell;
        }
        return -1;
    }

    get_one_move(color,matrice){
        let coordinates;
        let c;
        console.log(this._id_pawn.get_coordinates());
        coordinates=new Coordinates(this._id_pawn.get_coordinates()); //get the coordinates of _idpawn
        let id=this._id_pawn;
        do{
            coordinates.matrix(matrice);//move to the the next cell
            id = this.get_id_at_coord(c);// get the id of the cell
            if(is_color(this._board[id]. get_color())) { // if the cell isn't empty and have a valid color
                if(is_color(color) && !Object.is(color,this._board[id].get_color())){
                    return -1;
                }else{
                    return id;
                }
            }
        }while(!is_valid(id));// if the cell isn't valid (we are out of the board)
        return -1;
    }












    get_move_test(color){ //if color is not defined that mean this is the first coup of the player,
        console.log(this._id_pawn);
        const tr_mat=((-1,-1,0),(0,-1,-1),(-1,0,-1),(1,1,0),(0,1,1),(1,0,1));
        let tab_move=[];
        if(is_valid(this._id_pawn)) { // Check if the pawn is already placed
            let id=-1;
            for (let mat in tr_mat){
                id = this.get_one_move(color, tr_mat[mat]);
                if(is_valid(id)){
                    tab_move.push(new Move(this._id_pawn,id));
                }
            }
            if(tab_move.length>0){ // if we can play
                console.log(tab_move);
                return tab_move;
            }
            else{ // if there is no move available in each direction
                for(let i=0;i<49;i+=1){
                    if(is_color(this._board[i].get_color())){
                        tab_move.push(new Move(this._id_pawn,this._board[i])); // the pawn can move to all the cells which are playable
                    }
                }
                console.log(tab_move);
                return tab_move;
            }
        }
        else { //if the pawn isn't placed
            let i;
            for(i=0;i<49;i+=1){
                tab_move.push(new Move(this._id_pawn,i)); // the pawn can move to all the cells
            }
            console.log(tab_move);
            return tab_move;
        }
    }

    get_one_move_test(color,matrice){
        let coordinates;
        console.log("on parcours une direction possible");
        coordinates=new Coordinates(this._id_pawn); //get the coordinates of _idpawn
        console.log("coordonnee du pion",coordinates);
        let id=this._id_pawn;
        do{
            console.log("COORDONNEES DU POINTS COURANT AVANT TRANSITION");
            console.log(coordinates);
            coordinates.matrix(matrice);//move to the the next cell
            console.log("COORDONNEES DU POINTS COURANT APRES TRANSITION");
            console.log(coordinates);
            id = this.get_id_at_coord(coordinates);// get the id of the cell
            if(!is_valid(id)){
                return -1;
            }
            console.log("ok",id);
            console.log(this._board[id]. get_color());
            if(is_color(this._board[id]. get_color())) { // if the cell isn't empty and have a valid color
                console.log("Identifiant de la celulle visite :",id, " couleur de la cellule visite :",this._board[id].get_color());
                if(is_color(color) && !Object.is(color,this._board[id].get_color())){
                    return -1;
                }else{
                    return id;
                }
            }
            console.log("Identifiant de la celulle visite :",id, " couleur de la cellule visite :",this._board[id].get_color());
        }while(is_valid(id));// if the cell isn't valid (we are out of the board)
        return -1;
    }

    get_move(color){ //if color is not defined that mean this is the first coup of the player,
        console.log(this._id_pawn);
        const tr_mat=[[-1,-1,0],[0,-1,-1],[1,0,-1],[1,1,0],[0,1,1],[1,0,1]];
        let tab_move=[];
        if(is_valid(this._id_pawn)) { // Check if the pawn is already placed
            console.log("le pion est sur le plateau on cherche les coups possibles")
            let id=-1;
            for (let j=0;j<tr_mat.length;j=j+1){
                console.log("appel a la fonction de recuperation d'un coup possible dans une direction");
                id = this.get_one_move_test(color, tr_mat[j]);
                console.log("un des coups possibles :",id);
                if(is_valid(id)){
                    tab_move.push(new Move(this._id_pawn,id));
                }
            }
            if(tab_move.length>0){ // if we can play
                console.log(tab_move);
                return tab_move;
            }
            else{ // if there is no move available in each direction
                for(let i=0;i<49;i+=1){
                    if(is_color(this._board[i].get_color())){
                        tab_move.push(new Move(this._id_pawn,this._board[i])); // the pawn can move to all the cells which are playable
                    }
                }
                console.log(tab_move);
                return tab_move;
            }
        }
        else { //if the pawn isn't placed
            let i;
            for(i=0;i<49;i+=1){
                tab_move.push(new Move(this._id_pawn,i)); // the pawn can move to all the cells
            }
            console.log(tab_move);
            return tab_move;
        }
    }

    apply_move(Move){ // Apply the move to the board
        if(is_valid(this._id_pawn)) {
            this._board[this._id_pawn].set_color(7);
        }
        this._board[Move.get_to()].set_color(8);
        console.log(this._board);
    }
}


export default Board;