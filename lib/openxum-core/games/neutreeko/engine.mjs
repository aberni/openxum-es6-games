"use strict";

import OpenXum from '../../openxum/index.mjs';
import Board from './board.mjs';
import piece from "./piece.mjs";
import Color from "./color.mjs";
import Coordinates from "./coordinates.mjs";
import Move from './move.mjs';
import ThreeInConnectedRow from './three_in_connected_row.mjs';
import Dimension from './dimension.mjs';

class Engine extends OpenXum.Engine {
  constructor(game_type, first_color) {
    super();
    this._game_type = game_type;
    this._current_color = first_color;
    this._first_color = first_color;
    this._opponent_color = (first_color === Color.BLACK) ? Color.WHITE : Color.BLACK;
    this._winner_color = Color.NONE;
    this._finished = false;

    this._pieces = new Array(2);
    this._pieces[0] = new Array(3);
    this._pieces[1] = new Array(3);

    this._board = new Board(Dimension.DEFAULT_WIDTH, Dimension.DEFAULT_HEIGHT);

    this._init_pieces();
  }

  apply_moves(moves) {
  }

  clone() {
    let e = new Engine(this._game_type, this._first_color);
    e._winner_color = this._winner_color;
    e._finished = this._finished;
    e._current_color = this._current_color;

    // delete pieces in the board
    for(let i=0; i<this._pieces.length; i++) {
      for(let j=0; j<e._pieces[i].length; j++) {
        e._board.pop_piece(e._pieces[i][j]);
      }
    }

    // change coordinates and place the pieces
    for(let i=0; i<this._pieces.length; i++) {
      for(let j=0; j<e._pieces[i].length; j++) {
        e._pieces[i][j].set_coordinates(this._pieces[i][j].coordinates().clone());
        e._board.place_piece(e._pieces[i][j]);
      }
    }

    return e;
  }

  first_color() {
    return this._first_color;
  }

  opponent_color() {
    return this._opponent_color;
  }

  current_color() {
    return this._current_color;
  }

  get_name() {
    return "Neutreeko";
  }

  get_possible_move_list() {
    let moves = [];
    let index = this._get_pieces_player_index();
    for(let i=0; i<this._pieces[index].length; i++) {
      moves = moves.concat( this._get_possible_move_list(this._pieces[index][i]) );
    }
    //console.log(moves.length+' coups possibles pour '+this.current_color());
    return moves;
  }

  is_finished() {
    return this._finished;
  }

  move(move) {
    console.assert(
      move !== undefined,
      'move is undefined'
    );
    let piece = this._board.getPieceAt(move.from().x(), move.from().y());
    console.assert(
      piece !== undefined,
      'no piece at ' + move.from().formatted_string() + '\n' + this.to_string()
    );
    this._board.move_piece(
      piece,
      move.to()
    );

    this._check_connected_row();
    this._change_color();
  }

  undo_move(move) {
    console.assert(
      move !== undefined,
      'move is undefined'
    );
    let piece = this._board.getPieceAt(move.to().x(), move.to().y());
    console.assert(
      piece !== undefined,
      'no piece at ' + move.to().formatted_string() + '\n' + this.to_string()
    );
    this._board.move_piece(
      piece,
      move.from()
    );

    this._change_color();
    this._winner_color = Color.NONE;
    this._finished = false;
  }

  parse(str) {
  }

  to_string() {
    return this._board.formatted_string() + '\n' + 'current color: ' + this._current_color + ' winner color: ' + this._winner_color;
  }

  winner_is() {
    return this._winner_color;
  }

  ////////////////////////////////
  // private methods
  ////////////////////////////////

  _get_possible_move_list(piece) {
    let moves = [];
    let pc = piece.coordinates();
    let x, y, i;
    x = pc.x(); y = pc.y();

    // Right
    while(x+1 < this._board.getWidth() && this._board.getPieceAt(x+1, pc.y()) === undefined) {
      x++;
    }
    if(x !== pc.x()) {
      moves.push(new Move(pc.clone(), new Coordinates(x, pc.y())));
    }
    x = pc.x();

    // Left
    while(x-1 >= 0 && this._board.getPieceAt(x-1, pc.y()) === undefined) {
      x--;
    }
    if(x !== pc.x()) {
      moves.push(new Move(pc.clone(), new Coordinates(x, pc.y())));
    }
    x = pc.x();

    // Bottom
    while(y+1 < this._board.getHeight() && this._board.getPieceAt(pc.x(), y+1) === undefined) {
      y++;
    }
    if(y !== pc.y()) {
      moves.push(new Move(pc.clone(), new Coordinates(pc.x(), y)));
    }
    y = pc.y();

    // Top
    while(y-1 >= 0 && this._board.getPieceAt(pc.x(), y-1) === undefined) {
      y--;
    }
    if(y !== pc.y()) {
      moves.push(new Move(pc.clone(), new Coordinates(pc.x(), y)));
    }
    y = pc.y();

    // Diag Bottom Right
    i = 1;
    while(x+i < this._board.getWidth() && y+i < this._board.getHeight() && this._board.getPieceAt(x+i, y+i) === undefined) {
      i++;
    }
    if(i > 1) {
      moves.push(new Move(pc.clone(), new Coordinates(x+i-1, y+i-1)));
    }

    // Diag Top Right
    i = 1;
    while(x+i < this._board.getWidth() && y-i >= 0 && this._board.getPieceAt(x+i, y-i) === undefined) {
      i++;
    }
    if (i>1){
      moves.push(new Move(pc.clone(), new Coordinates(x+i-1, y-i+1)));
    }

    // Diag Bottom Left
    i = 1;
    while( x-i >= 0 && y+i < this._board.getHeight() && this._board.getPieceAt(x-i, y+i) === undefined) {
      i++;
    }
    if(i > 1) {
      moves.push(new Move(pc.clone(), new Coordinates(x-i+1, y+i-1)));
    }

    // Diag Top Left
    i = 1;
    while(x-i >= 0 && y-i >= 0 && this._board.getPieceAt(x-i, y-i) === undefined) {
      i++;
    }
    if(i > 1) {
      moves.push(new Move(pc.clone(), new Coordinates(x-i+1, y-i+1)));
    }

    return moves;

  }

  _init_pieces() {
    this._pieces[0][0] = new piece(this._first_color, new Coordinates(1, 0));
    this._pieces[0][1] = new piece(this._first_color, new Coordinates(3, 0));
    this._pieces[0][2] = new piece(this._first_color, new Coordinates(2, 3));

    this._pieces[1][0] = new piece(this._opponent_color, new Coordinates(1, 4));
    this._pieces[1][1] = new piece(this._opponent_color, new Coordinates(3, 4));
    this._pieces[1][2] = new piece(this._opponent_color, new Coordinates(2, 1));

    //console.log('pieces created: done');

    for(let i=0; i<this._pieces.length; i++) {
      for(let j=0; j<this._pieces[i].length; j++) {
        this._board.place_piece(this._pieces[i][j]);
      }
    }

    //console.log('place pieces: done');
  }

  _get_pieces_player_index() {
    if(this._current_color === this._first_color) {
      return 0;
    } else {
      return 1;
    }
  }

  _check_connected_row() {
    let index = this._get_pieces_player_index();
    let threeInConnectedRow = new ThreeInConnectedRow(
      this._pieces[index][0].coordinates(),
      this._pieces[index][1].coordinates(),
      this._pieces[index][2].coordinates()
    );
    if(threeInConnectedRow.is_connected_row()) {
      //console.log("Connected row !");
      this._winner_color = this._current_color;
      this._finished = true;
    } else {
      //console.log("No winner :(");
    }
  }

  _verify_moving(piece, x, y) {
    let possible_move = this._get_possible_move_list(piece);

    for(let i=0; i<possible_move.length; i++) {
      if (possible_move[i].to().x() === x && possible_move[i].to().y() === y) {
        return true;
      }
    }

    return false;
  }

  _change_color() {
    this._current_color = (this._current_color === this._first_color) ?
      this._opponent_color : this._first_color;
  }
}

export default Engine;