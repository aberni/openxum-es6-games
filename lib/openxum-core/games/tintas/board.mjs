"use strict";

import Color from './color.mjs';
import {convert_to_hexa, is_color} from './color.mjs';
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';

import Move from './move.mjs';

function is_valid(cell) { // final version
  return cell < 49 && cell >= 0;
}

function get_random_int(min, max) { // final version
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const tr_mat = [[-1, -1, 0], [0, -1, -1], [1, 0, -1], [1, 1, 0], [0, 1, 1], [-1, 0, 1]];

class Board {
  constructor() {
    this._board = new Array(); //an array of cells
    this._id_pawn = 49;
    this._flag = [];
    this._init_flag();

  }


/////////////////////
// private methods //
/////////////////////

  _random_board() { //final version
    let number_color = new Array(0, 0, 0, 0, 0, 0, 0); // array with the number of iteration of each color
    for (let i = 0; i < 49; i += 1) { // for each cell of the board
      let num;
      let bool = false;
      do {
        num = get_random_int(0, 6);
        if (number_color[num] < 7) { // add 1 to the color iteration number
          number_color[num] += 1;
          bool = true;
        }
      } while (!bool);// while the color isnt already 7 times presents
      this._board[i].set_color(num);
    }
  }

  _board_ok() { // TO DO

    for (let i = 0; i < 49; i += 1) {
      if (!this._flag[i]) {
        let flag = this._flag_count();
        this._too_much_friend(i);
        let new_count_flag = this._flag_count();
        if (new_count_flag - flag > 6) {
          this._init_flag();
          return false;
        }
        this.marque(this.get_cell_by_id(i).get_color(), i);
      }
    }
    this._id_pawn = 49;
    this._init_flag();

    return true;
  }

  marque(color, j) {
    for (let i = j + 1; i < 49; i += 1) {
      if (!this._flag[i]) {
        if (this.get_cell_by_id(i).get_color() === color) {
          this._flag[i] = 1;
        }
      }
    }
  }

  _too_much_friend(i) {
    if (this._flag[i]) {
      return;
    }
    this._flag[i] = 1;
    let color = this._board[i].get_color();
    for (let r = 0; r < 6; r += 1) {
      this._id_pawn = i;
      let id = this._get_one_move(color, tr_mat[r]);
      if (is_valid(id) && !this._flag[id]) {
        this._too_much_friend(id);
      }

    }

  }

  _init_flag() {
    for (let g = 0; g < 49; g += 1) {
      this._flag[g] = 0;
    }
  }

  _flag_count() {
    let new_count_flag = 0;
    for (let v = 0; v < 49; v += 1) {
      if (this._flag[v]) {
        new_count_flag += 1;
      }
    }
    return new_count_flag;
  }

// public methods

  clone() {
    let a = new Board();
    for (let i = 0; i < 49; i += 1) {
      a._board[i] = this._board[i].clone();
    }
    a._id_pawn = this._id_pawn;
    return a;
  }

  get_cell_by_id(id) { //final version
    return this._board[id];
  }

  //final version
  init_board() { //initialize the board
    for (let i = 0; i < 49; i += 1) { // for each cell of the board
      this._board.push(new Cell(new Coordinates(i), 7, i)); //change the color of the cell based on the number generated
    }
    do {
      this._random_board();
    } while (!this._board_ok());
  }

  //final version
  get_id_at_coord(c) { // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
    for (let id = 0; id < 49; id += 1) {
      let comp = this._board[id].get_coordinates();
      //console.log("identifiant teste : ",id);
      //console.log(comp,c);
      if (comp.get_pos_x() === c.get_pos_x() && comp.get_pos_y() === c.get_pos_y() && comp.get_pos_z() === c.get_pos_z()) {
        return id;
      }
    }
    return -1;
  }

  // final version
  get_cell_by_coord(c) { // compare the coordinates with coordinates of each cells and return the id of the cell, -1 if not found
    //console.log("c : "+c);
    let coord_cell = this.get_id_at_coord(c);
    //console.log("coord_cell : "+coord_cell);
    if (c.is_valid()) {
      return this._board[coord_cell];
    }
    return -1;
  }

  // final version
  _get_one_move(color, matrice) { // final version
    let coordinates;
    coordinates = new Coordinates(this._id_pawn); //get the coordinates of _idpawn
    let id = this._id_pawn;
    do {
      coordinates.matrix(matrice);//move to the the next cell
      id = this.get_id_at_coord(coordinates);// get the id of the cell
      if (!is_valid(id)) {
        return -1;
      }
      if (is_color(this._board[id].get_color())) { // if the cell isn't empty and have a valid color
        if (is_color(color) && !Object.is(color, this._board[id].get_color())) {
          return -1;
        } else {
          return id;
        }
      }
    } while (is_valid(id));// if the cell isn't valid (we are out of the board)
    return -1;
  }

  //if we can't play in any direction
  _get_move_spe() { //ok
    let i;
    let tab_move = [];
    for (i = 0; i < 49; i += 1) {
      if (is_color(this._board[i].get_color())) {
        tab_move.push(new Move(this._id_pawn, i)); // the pawn can move to all the cells which are playable
      }
    }
    return tab_move;
  }

  // final version
  get_move(color) { //if color is not defined that means this is the first coup of the player,

    if (this._id_pawn === 49) {
      return this._get_move_spe(); //ok
    }
    let tab_move = [];
    let id = -1;
    for (let j = 0; j < tr_mat.length; j = j + 1) {
      id = this._get_one_move(color, tr_mat[j]);
      if (is_valid(id)) {
        tab_move.push(new Move(this._id_pawn, id));
      }
    }

    if (tab_move.length > 0) { // if we can play
      if (is_color(color)) {
        tab_move.push(new Move(this._id_pawn, 50));
      }
      return tab_move;
    }

    else if (is_color(color)) { // player already played one move
      tab_move.push(new Move(-1, -1));
      return tab_move;
    }
    else {
      return this._get_move_spe();
    }
  }

  //final version
  apply_move(move) { // Apply the move to the board
    if (!is_valid(move.get_to())) {
      return 7;
    }
    let color = this._board[move.get_to()].get_color();
    if (is_valid(this._id_pawn)) {
      this._board[this._id_pawn].set_color(7);
    }
    this._board[move.get_to()].set_color(8);
    this._id_pawn = move.get_to();
    return color;
  }


  get_id_pawn() {
    return this._id_pawn;
  }

}

export default Board;
export {is_valid};