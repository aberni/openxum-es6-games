"use strict";

import Color from './color.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';
import MoveType from './move_type.mjs';

class Engine extends OpenXum.Engine {

  constructor(t, c) {
    super();

    this._type = t;
    this._color = c;
    this._black_piece_amount = 25;
    this._white_piece_amount = 25;
    this._black_points = 0;
    this._white_points = 0;
    this._towers = [];
    this._move_to_avoid = null;
    this._phase = Phase.MOVE_TOWER;
  }

  apply_moves(moves) {
    // Permet d'appliquer une liste de coups.
    // Le paramètre moves contient un tableau d'objets Move.
  }

  clone() {
    let o = new Engine(this._type, this._color);

    o._black_piece_amount = this._black_piece_amount;
    o._white_piece_amount = this._white_piece_amount;

    o._black_points = this._black_points;
    o._white_points = this._white_points;

    let nTowers = new Array(this._towers.length);
    for (let i = 0; i < nTowers.length; i++) {
      let npieces = new Array(this._towers[i].pieces.length);
      for (let j = 0; j < npieces.length; j++) {
        npieces[j] = this._towers[i].pieces[j];
      }
      nTowers[i] = {x: this._towers[i].x, y: this._towers[i].y, pieces: npieces};
    }

    o._towers = nTowers;
    o._move_to_avoid = this._move_to_avoid;
    o._phase = this._phase;
    return o;
  }

  current_color() {
    return this._color;
  }

  current_color_string() {
    return this._color === Color.BLACK ? 'Black' : 'White';
  }

  get_name() {
    return 'Mixtour';
  }

  get_possible_move_list() {
    let list = [];
    if ((this._color === Color.BLACK && this._black_piece_amount > 0) || (this._color === Color.WHITE && this._white_piece_amount > 0)) {
      list = list.concat(this._get_possible_putting_list());
    }
    for (let i = 0; i < this._towers.length; ++i) {
      const dest_tower = this._towers[i];
      list = list.concat(this._get_possible_moves_to_tower_list(dest_tower));
    }
    return list;
  }

  getTowers() {
    return this._towers;
  }

  get_black_points() {
    return this._black_points;
  }

  get_white_points() {
    return this._white_points;
  }

  get_black_piece_amount() {
    return this._black_piece_amount;
  }

  get_white_piece_amount() {
    return this._white_piece_amount;
  }

  is_finished() {
    return this._phase === Phase.FINISH;
  }

  move(move) {
    if (move.getType() === MoveType.PUT_PIECE) {
      this._put_piece(move);
    }
    else {
      this._move_piece(move);
    }
    this._next_color();
  }


  parse(str) {
    // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
    // chaîne de caractères
  }

  phase() {
    return this._phase;
  }

  to_string() {
    // Construit une représentation sous forme d'une chaîne de caractères
    // de l'état du jeu
  }

  verify_move(move) {
    const list = this.get_possible_move_list();
    for (let i = 0; i < list.length; ++i) {
      if (move.isEqual(list[i])) {
        return true;
      }
    }
    return false;
  }

  winner_is() {
    if (this._black_points >= 5) {
      return Color.BLACK;
    }
    else {
      return Color.WHITE;
    }
  }

  _add_point(pieces) {
    if (pieces[pieces.length - 1] === Color.WHITE) {
      this._white_points++;
      if (this._white_points >= 5) {
        this._phase = Phase.FINISH;
      }
    }
    else {
      this._black_points++;
      if (this._black_points >= 5) {
        this._phase = Phase.FINISH;
      }
    }
  }

  _add_reserve(pieces) {
    for (let i = 0; i < pieces.length; ++i) {
      pieces[i] === Color.WHITE ? this._white_piece_amount++ : this._black_piece_amount++;
    }
  }

  _get_moves_between_towers(dest_tower, start_tower) {
    let moves_between_towers = [];
    for (let j = 0; j < start_tower.pieces.length; ++j) {
      const move = new Move(MoveType.MOVE_TOWER, {x: start_tower.x, y: start_tower.y}, {
        x: dest_tower.x,
        y: dest_tower.y
      }, j);
      if (!this._move_to_avoid || !move.isEqual(this._move_to_avoid)) {
        moves_between_towers = moves_between_towers.concat(move);
      }
    }
    return moves_between_towers;
  }

  _get_possible_moves_in_direction(dest_tower, DirectionX, DirectionY) {

    let move_list = [];
    let distance = 0;
    while (distance < dest_tower.pieces.length && !this._search_tower(dest_tower.x + DirectionX * (distance + 1), dest_tower.y + DirectionY * (distance + 1))) {
      ++distance;
    }
    if (distance < dest_tower.pieces.length) {
      const start_tower = this._search_tower(dest_tower.x + DirectionX * (distance + 1), dest_tower.y + DirectionY * (distance + 1));
      move_list = move_list.concat(this._get_moves_between_towers(dest_tower, start_tower));
    }
    return move_list;
  }

  _get_possible_moves_to_tower_list(dest_tower) {
    let move_list = [];
    for (let DirectionX = -1; DirectionX <= 1; ++DirectionX) {
      for (let DirectionY = -1; DirectionY <= 1; ++DirectionY) {
        if (DirectionX !== 0 || DirectionY !== 0) {
          move_list = move_list.concat(this._get_possible_moves_in_direction(dest_tower, DirectionX, DirectionY));
        }
      }
    }


    return move_list;
  }

  _get_possible_putting_list() {
    let putting_list = [];
    for (let i = 0; i < 5; ++i) {
      for (let j = 0; j < 5; ++j) {
        if (!this._search_tower(i, j)) {
          putting_list = putting_list.concat(new Move(MoveType.PUT_PIECE, {x: -1, y: -1}, {x: i, y: j}, 0));
        }
      }
    }
    return putting_list;
  }

  _move_piece(move) {
    let index_tower_from = this._search_tower_index(move.getFrom().x, move.getFrom().y);
    let index_tower_to = this._search_tower_index(move.getTo().x, move.getTo().y);

    this._move_to_avoid = new Move(move.getType, move.getTo(), move.getFrom(), this._towers[index_tower_to].pieces.length);
    this._process_move(move, index_tower_from, index_tower_to);
  }


  _next_color() {
    this._color = this._color === Color.WHITE ? Color.BLACK : Color.WHITE;
  }

  _process_move(move, index_tower_from, index_tower_to) {
    let to_move = this._towers[index_tower_from].pieces.slice(move.getPiece());
    this._towers[index_tower_to].pieces = this._towers[index_tower_to].pieces.concat(to_move);
    if (this._towers[index_tower_to].pieces.length >= 5) {
      this._add_point(this._towers[index_tower_to].pieces);
      if (index_tower_from > index_tower_to) {
        index_tower_from--;
      }
      this._add_reserve(this._towers[index_tower_to].pieces);
      this._remove_tower(index_tower_to);
    }
    if (move.getPiece() === 0) {
      this._remove_tower(index_tower_from);
    }
    else {
      this._towers[index_tower_from].pieces.splice(move.getPiece());
    }
  }

  _put_piece(move) {
    let new_tower = {x: move.getTo().x, y: move.getTo().y, pieces: [this._color]};
    this._towers = this._towers.concat(new_tower);
    this._remove_piece_from_reserve();
    this._move_to_avoid = null;
  }

  _remove_piece_from_reserve() {
    if (this._color === Color.BLACK) {
      --this._black_piece_amount;
    }
    else {
      --this._white_piece_amount;
    }
  }

  _remove_tower(index_tower_to_remove) {
    this._towers.splice(index_tower_to_remove, 1);
  }

  _search_tower(x, y) {
    for (let i = 0; i < this._towers.length; ++i) {
      if (this._towers[i].x === x && this._towers[i].y === y) {
        return this._towers[i];
      }
    }
    return null;
  }

  _search_tower_index(x, y) {

    for (let i = 0; i < this._towers.length; ++i) {
      if (this._towers[i].x === x && this._towers[i].y === y) {
        return i;
      }
    }
    return null;
  }
}

export default Engine;