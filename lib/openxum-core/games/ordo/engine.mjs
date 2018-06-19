"use strict";

import OpenXum from '../../openxum/engine.mjs';
import Coordinates from './coordinates.mjs';
import Piece from './piece.mjs';
import Color from './color.mjs';
import Move from './move.mjs';
import File from './file.mjs';
//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();
    // Déclaration de tous les attributs nécessaires
    this._type = t;
    this._color = c;
    this._current_round = 0;
    this._count_white_pawn = 20;
    this._count_black_pawn = 20;
    this._cpt_mark = 0;
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

    for (let i = 0; i < 10; i++) {
      b[i] = new Array(10);
    }

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        if (this._board[x][y] !== undefined) {
          b[x][y] = this._board[x][y].clone();
        }
      }
    }

    o._set(this._is_finished, this._winner_color, b);

    return o;
  }

  _clonage() {
    let b = new Array(10);

    for (let i = 0; i < 10; i++) {
      b[i] = new Array(8);
    }

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        if (this._board[x][y] !== undefined) {
          b[x][y] = this._board[x][y].clone();
        }
      }
    }

    return b;
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

    //console.log(this._disconnect_black);
    this._check_pawn_taken(move);
    //this._check_voisin(move);
    //this._check_winner();
    //console.log(this._check_winner());

    this._board[move.to().x()][move.to().y()] = piece;
    this._board[fromX][fromY] = undefined;
    console.log("COuleur du joueur " + this._color);
    this._check_winner();
    if (this._count_black_pawn > 1 && this._count_white_pawn > 1) {
      let that = this.clone();
      //console.log(that._check_group_connection(move));

      if (this.current_color() === Color.BLACK && that._check_group_connection(move, Color.BLACK) !== this._count_black_pawn) {
        this._disconnect_black = true;
      }
      if (this.current_color() === Color.WHITE && that._check_group_connection(move, Color.WHITE) !== this._count_white_pawn) {
        this._disconnect_white = true;
      }
      console.log("deco black " + this._disconnect_black);
      console.log("deco white " + this._disconnect_white);
      //console.log(that._check_group_connection(move));
    }


    if (!this.is_finished()) {
      this._cpt_mark = 0;
      this._change_color();
    }
    //this._check_voisin(move);
  }

  _check_voisin(move) {
    let movX = move.to().x();
    let movY = move.to().y();
    let connect_tmp = false;
    ;
    console.log(this._is_connected(move.piece(), movX, movY));
    let nbVdumove = this._is_connected(move.piece(), movX, movY);
    if (nbVdumove === 1) {
      for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
          if (movX - 1 + i >= 0 && movY - 1 + j >= 0 && movX - 1 + i <= 9 && movY - 1 + j <= 7) {
            console.log(movX - 1 + i, movY - 1 + j);
            //console.log("nbvoisin");
            //console.log(this._is_connected(move.piece(), movX - 1 + i, movY - 1 + j));
            if (this._board[movX - 1 + i][movY - 1 + j] !== undefined && this._is_connected(move.piece(), movX - 1 + i, movY - 1 + j) >= 2) {
              console.log("On a bien deux voisins");
              connect_tmp = true;
            }
          }
        }
      }
    }
    if (nbVdumove > 1) {
      connect_tmp = true;
    }
    console.log("connect " + connect_tmp);
    if (this.current_color() === Color.BLACK && connect_tmp === false) {
      this._disconnect_black = true;
    }
    if (this.current_color() === Color.WHITE && connect_tmp === false) {
      this._disconnect_white = true;
    }
    console.log("deco black " + this._disconnect_black);
    console.log("deco white " + this._disconnect_white);

    return connect_tmp;
  }

  _check_group_connection(move, color_group) {
    let move_coord = move.to();
    let piece = this._board[move_coord.x()][move_coord.y()];

    //parcourir les connections entre les pièce avec une file
    let file = new File();

    file.add(piece);
    piece._marked = true;
    this._cpt_mark++;
    console.log(piece);
    piece = file.remove();

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (move.to().x() + i >= 0 && move.to().y() + j >= 0 && move.to().x() + i < 10 && move.to().y() + j < 8) {
          if (this._board[move.to().x() + i][move.to().y() + j] !== undefined && this._board[move.to().x() + i][move.to().y() + j].color() === this._color ) {
            if (this._board[move.to().x() + i][move.to().y() + j]._marked === false ) {
              piece = this._board[move.to().x() + i][move.to().y() + j];
              this._check_group_connection(new Move(piece, piece.coordinates()));
            }
          }
        }
      }
    }
    return this._cpt_mark;
  }

  _check_pawn_taken(move) {
    let pieceTaken = this._board[move.to().x()][move.to().y()];
    //console.log(move.to().x());
    //console.log(move.to().y());

    if (this._board[move.to().x()][move.to().y()] !== undefined) {
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
    possible_moves.forEach(function (move) {
      if (move.to().x() === x && move.to().y() === y) {
        val = true;
      }
    });

    return val;
  }

  get_possible_move_list() {
    let moves = [];

    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 8; y++) {
        if (this._board[x][y] !== undefined) {
          moves = moves.concat(this._get_possible_move_list(this._board[x][y]));
        }
      }
    }

    return moves;
  }

  _get_possible_move_list(piece) {
    let moves = [];

    if ((this._count_white_pawn === 1 || this._count_black_pawn === 1) && piece._color === this._color) {
      let pc = piece.coordinates();
      //Up
      for (let dy = 1; dy < pc.y() + 1; dy++) {
        moves = this._possible_moves_singleton(piece, pc.x(), pc.y() - dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //Down
      for (let dy = 1; dy < 8 - pc.y(); dy++) {
        moves = this._possible_moves_singleton(piece, pc.x(), pc.y() + dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //Right
      for (let dx = 1; dx < 10 - pc.x(); dx++) {
        moves = this._possible_moves_singleton(piece, pc.x() + dx, pc.y(), moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //Left
      for (let dx = 1; dx < pc.x() + 1; dx++) {
        moves = this._possible_moves_singleton(piece, pc.x() - dx, pc.y(), moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //BR
      for (let dx = 1, dy = 1; dx < 10 - pc.x() && dy < 7 - pc.y(); dx++, dy++) {
        moves = this._possible_moves_singleton(piece, pc.x() + dx, pc.y() + dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //BL
      for (let dx = 1, dy = 1; dx < pc.x() + 1 && dy < 8 - pc.y(); dx++, dy++) {
        moves = this._possible_moves_singleton(piece, pc.x() - dx, pc.y() + dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //UL
      for (let dx = 1, dy = 1; dx < pc.x() + 1 && dy < pc.y() + 1; dx++, dy++) {
        moves = this._possible_moves_singleton(piece, pc.x() - dx, pc.y() - dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //RU
      for (let dx = 1, dy = 1; dx < 10 - pc.x() && dy < pc.y() + 1; dx++, dy++) {
        moves = this._possible_moves_singleton(piece, pc.x() + dx, pc.y() - dy, moves);
        if (moves.length >= 1 && this._board[moves[moves.length - 1].to().x()][moves[moves.length - 1].to().y()] !== undefined) {
          break;
        }
      }
      //}
    }

    if (piece._color === this._color) {
      let pc = piece.coordinates();
      //Up
      if (this._disconnect_black === true && this._color === Color.BLACK) {
        for (let dy = 1; dy < pc.y() + 1; dy++) {
          moves = this._possible_moves_function(piece, pc.x(), pc.y() - dy, moves);
          if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
            moves.pop();
            break;
          }
        }
      }
      //Down
      for (let dy = 1; dy < 8 - pc.y(); dy++) {
        moves = this._possible_moves_function(piece, pc.x(), pc.y() + dy, moves);
        if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
          moves.pop();
          break;
        }
      }
      //Right
      for (let dx = 1; dx < 10 - pc.x(); dx++) {
        moves = this._possible_moves_function(piece, pc.x() + dx, pc.y(), moves);
        if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
          moves.pop();
          break;
        }
      }
      //Left
      for (let dx = 1; dx < pc.x() + 1; dx++) {
        moves = this._possible_moves_function(piece, pc.x() - dx, pc.y(), moves);
        if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
          moves.pop();
          break;
        }
      }
      //BR
      for (let dx = 1, dy = 1; dx < 10 - pc.x() && dy < 7 - pc.y(); dx++, dy++) {
        moves = this._possible_moves_function(piece, pc.x() + dx, pc.y() + dy, moves);
        if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
          moves.pop();
          break;
        }
      }
      //BL
      for (let dx = 1, dy = 1; dx < pc.x() + 1 && dy < 8 - pc.y(); dx++, dy++) {
        moves = this._possible_moves_function(piece, pc.x() - dx, pc.y() + dy, moves);
        if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
          moves.pop();
          break;
        }
      }
      //UL
      if (this._disconnect_black === true && this._color === Color.BLACK) {
        for (let dx = 1, dy = 1; dx < pc.x() + 1 && dy < pc.y() + 1; dx++, dy++) {
          moves = this._possible_moves_function(piece, pc.x() - dx, pc.y() - dy, moves);
          if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
            moves.pop();
            break;
          }
        }
      }
      //RU
      if (this._disconnect_black === true && this._color === Color.BLACK) {
        for (let dx = 1, dy = 1; dx < 10 - pc.x() && dy < pc.y() + 1; dx++, dy++) {
          moves = this._possible_moves_function(piece, pc.x() + dx, pc.y() - dy, moves);
          if (moves.length >= 1 && moves[moves.length - 1].to().x() === 50 && moves[moves.length - 1].to().y() === 50 && moves[moves.length - 1].piece().color() === this._color) {
            moves.pop();
            break;
          }
        }
      }
    }
    //console.log(moves);
    return moves;
  }

  _possible_moves_function(piece, x, y, moves) {

    if (this._board[x][y] !== undefined && this._board[x][y].color() !== piece.color()) {
      if (this._is_connected(piece.clone(), x, y)) {
        moves.push(new Move(piece.clone(), new Coordinates(x, y)));
        return moves;
      }
    }
    if (this._board[x][y] !== undefined && this._board[x][y].color() === piece.color()) {

      moves.push(new Move(piece.clone(), new Coordinates(50, 50)));
      return moves;
    }
    if (this._board[x][y] === undefined && this._is_connected(piece.clone(), x, y) > 0) {
      moves.push(new Move(piece.clone(), new Coordinates(x, y)));

    }
    return moves;
  }

  _possible_moves_singleton(piece, x, y, moves) {
    if (this._board[x][y] !== undefined && this._board[x][y].color() !== piece.color()) {
      console.log("Move avec capture");
      moves.push(new Move(piece.clone(), new Coordinates(x, y)));
      return moves;
    }
    if (this._board[x][y] === undefined) {
      moves.push(new Move(piece.clone(), new Coordinates(x, y)));
    }
    return moves;
  }

  _is_connected(piece, x, y) {
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
      return nbvoisin;
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
    for (let x = 0; x < 11; x++) {
      let text = "";
      for (let y = 0; y < 11; y++) {
        let piece = this._board[x][y];

        if (piece === undefined) text += "*";
        else if (piece.isKing()) text += "K";
        else if (piece.color() === Color.WHITE) text += "W";
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

    if (this._color === Color.WHITE) {
      if (this._count_black_pawn === 0) {
        this._winner_color = Color.WHITE;
        this._is_finished = true;
      }
      for (let i = 0; i < 10; i++) {
        if (this._board[i][0] !== undefined && this._board[i][0]._color === Color.WHITE) {
          this._winner_color = Color.WHITE;
          this._is_finished = true;
        }
      }

      if (this._disconnect_black === true) {
        this._winner_color = Color.WHITE;
        this._is_finished = true;
      }
    }
    if (this._color === Color.BLACK) {
      if (this._count_white_pawn === 0) {
        this._winner_color = Color.BLACK;
        this._is_finished = true;
      }
      for (let j = 0; j < 10; j++) {
        if (this._board[j][7] !== undefined && this._board[j][7]._color === Color.BLACK) {
          this._is_finished = true;
        }
      }
      if (this._disconnect_white === true) {
        this._winner_color = Color.BLACK;
        this._is_finished = true;
      }
    }
    return false;

  }

  _initialize_board() {
    this._board = new Array(10);
    for (let i = 0; i < 10; i++) {
      this._board[i] = new Array(8);
    }
    let alt = 0;
    let up = false;
    let yy;
    let color = Color.BLACK;
    for (let y = 1; y < 8; y = y + 5) {
      for (let x = 0; x < 10; x++) {
        this._board[x][y] = new Piece(color, new Coordinates(x, y));
        if (alt === 2) {
          alt = 0;
          up = !up;
        }
        if (!up) {
          yy = y + 1;
        }
        else {
          yy = y - 1;
        }
        this._board[x][yy] = new Piece(color, new Coordinates(x, yy));
        alt++;
      }
      color = Color.WHITE;
    }

  }
}

export default Engine;