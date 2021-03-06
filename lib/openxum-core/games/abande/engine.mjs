"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/index.mjs';
import Phase from './move_type.mjs';

//grid constants definition
const grid_letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const end_number = [4, 5, 6, 7, 6, 5, 4];

class Engine extends OpenXum.Engine {
  constructor(t, c) {
    super();
    this._type = t;
    this._current_color = c;
    this._black_piece_number = 18;
    this._white_piece_number = 18;
    this._intersections = [];
    this._has_skipped = false;
    this._is_game_finished = false;
    for (let i = 0; i < grid_letter.length; ++i) {
      const l = grid_letter[i];
      for (let n = 1; n <= end_number[i]; ++n) {
        let coordinates = new Coordinates(l, n);
        this._intersections[coordinates.hash()] = new Intersection(coordinates);
      }
    }
  }

  apply_moves(moves) {
    //TODO
    //permet d'appliquer une liste de move
  }

  black_piece_number() {
    return this._black_piece_number;
  }

  clone() {
    let clone = new Engine(this._type, this._current_color);
    clone._black_piece_number = this._black_piece_number;
    clone._white_piece_number = this._white_piece_number;
    clone._has_skipped = this._has_skipped;
    clone._is_game_finished = this._is_game_finished;
    for (let i = 0; i < this._intersections.length; i++) {
      if (this._hash_exist(i)) {
        clone._intersections[i] = this._intersections[i].clone();
      }
    }
    return clone;
  }

  current_color() {
    return this._current_color;
  }


  get_name() {
    return 'Abande';
  }

  get_possible_move_list() {
    let list = [];
    if (this.black_piece_number() === 18 && this.white_piece_number() === 18) {
      for (let i = 0; i < this._intersections.length; ++i) {
        if (this._hash_exist(i) === true) {
          list.push(new Move(Phase.PUT_FIRST_PIECE, this.current_color(), this._coordinate_from_hash(i)));
        }
      }
    }
    else {
      for (let i = 0; i < this._intersections.length; ++i) {
        if (this._hash_exist(i) === true && this._intersections[i].getColor() === Color.AVAILABLE) {
          if ((this.current_color() === Color.BLACK && this._black_piece_number !== 0) || (this._current_color === Color.WHITE && this._white_piece_number !== 0)) {
            list.push(new Move(Phase.PUT_PIECE, this.current_color(), this._coordinate_from_hash(i)));
          }
        }
        else if (this._hash_exist(i) === true && this._intersections[i].getColor() === this.current_color()) {
          let neighbour_all = this._get_neighboor(this._intersections[i]);
          let neighbour_opposite = this._opposite_color_neighbour(neighbour_all, this.current_color());
          for (let n = 0; n < neighbour_opposite.length; ++n) {
            if (this._can_capture(this._coordinate_from_hash(i), this._coordinate_from_hash(neighbour_opposite[n])) === true) {
              list.push(new Move(Phase.CAPTURE_PIECE, this.current_color(), this._coordinate_from_hash(i), this._coordinate_from_hash(neighbour_opposite[n])));
            }
          }
        }
      }
      if ((this.current_color() === Color.BLACK && this._black_piece_number === 0) || (this._current_color === Color.WHITE && this._white_piece_number === 0)) {
        list.push(new Move(Phase.SKIP, this.current_color()));
      }
    }

    return list;
  }

  intersection() {
    return this._intersections;
  }


  is_finished() {
    return this._is_game_finished;
  }


  move(move) {
    let type = move.type();
    if (type === Phase.PUT_FIRST_PIECE) {
      this._put_first_piece(move.color(), move.coordinates());
    }
    else if (type === Phase.PUT_PIECE) {
      this._put_piece(move.color(), move.coordinates());
    }
    else if (type === Phase.CAPTURE_PIECE) {
      this._capture_piece(move.color(), move.from(), move.to());
    }
    else if (type === Phase.SKIP) {
      this._skip(move.color());
    }
  }

  parse(str) {
    //TODO
    //Modifie l'état du jeu en fonction de l'état passé sous forme d'un string
  }

  to_string() {
    //TODO
    //Construit une représentation du jeu sous forme d'un string
  }

  white_piece_number() {
    return this._white_piece_number;
  }

  winner_is() {
    if (this.is_finished() === true) {
      let score = this.count_score();
      if (score[Color.BLACK] > score[Color.WHITE]) {
        return Color.BLACK;
      }
      else if (score[Color.WHITE] > score[Color.BLACK]) {
        return Color.WHITE;
      }
      else {
        return Color.AVAILABLE;
      }
    }
  }

  _all_at_none() {
    for (let n = 0; n < this._intersections.length; ++n) {
      if (this._intersections[n] !== undefined) {
        this._intersections[n].setColor(Color.NONE);
      }
    }
  }

  _are_neighbour(from, to) {
    let toHash = to.hash();
    let neighbour = this._get_neighboor(this._intersections[from.hash()]);
    for (let i = 0; i < neighbour.length; ++i) {
      if (neighbour[i] === toHash) {
        return true;
      }
    }
    return false;
  }

  _are_opposite_color(from, to) {
    if (this._intersections[from.hash()].getColor() === Color.BLACK && this._intersections[to.hash()].getColor() === Color.WHITE) {
      return true;
    }
    if (this._intersections[from.hash()].getColor() === Color.WHITE && this._intersections[to.hash()].getColor() === Color.BLACK) {
      return true;
    }
    return false;
  }

  _can_capture(from, to) {
    if (this.black_piece_number() < 17 && this._are_opposite_color(from, to) && this._are_neighbour(from, to) && this._no_hole(from, to) && this._Stack_height_verif(from, to) === true) {
      return true;
    }
    return false;
  }

  _capture_piece(color, from, to) {
    if (this._is_current_player(color) && from.is_valid() && to.is_valid()) {
      if (this._can_capture(from, to) === true) {
        let height_from = this._intersections[from.hash()].getStackHeight();
        let height_to = this._intersections[to.hash()].getStackHeight();
        this._intersections[to.hash()].setStackHeight(height_from + height_to);
        this._intersections[from.hash()].setStackHeight(0);
        this._intersections[to.hash()].setColor(color);
        this._intersections[from.hash()].setColor(Color.AVAILABLE);
        this._change_old_available(from);
        this._change_current_player();
        this._has_skipped = false;
      }
    }
  }

  _change_current_player() {
    if (this.current_color() === Color.WHITE) {
      this._current_color = Color.BLACK;
    } else if (this.current_color() === Color.BLACK) {
      this._current_color = Color.WHITE;
    }
  }

  _change_old_available(from) {
    let list = this._get_neighboor(this._intersections[from.hash()]);
    for (let i = 0; i < list.length; ++i) {
      if (this._intersections[list[i]].getColor() === Color.AVAILABLE) {
        let check = this._get_neighboor(this._intersections[list[i]]);
        let change = true;
        for (let j = 0; j < check.length; ++j) {
          if (this._intersections[check[j]].getColor() === Color.BLACK || this._intersections[check[j]].getColor() === Color.WHITE) {
            change = false;
            break;
          }
        }
        if (change === true) {
          this._intersections[list[i]].setColor(Color.NONE);
        }
      }
    }
  }

  _coordinate_from_hash(hash) {
    let letter = String.fromCharCode(65 + (hash % 7));
    let number = Math.floor(hash / 7) + 1;
    return new Coordinates(letter, number);
  }

  count_score() {
    this._sleeping();
    let score = [];
    score[Color.WHITE] = 0;
    score[Color.BLACK] = 0;
    for (let i = 0; i < this._intersections.length; ++i) {
      if (this._intersections[i] !== undefined) {
        if (this._intersections[i].getColor() === Color.WHITE) {
          score[Color.WHITE] += this._intersections[i].getStackHeight();
        } else if (this._intersections[i].getColor() === Color.BLACK) {
          score[Color.BLACK] += this._intersections[i].getStackHeight();
        }
      }
    }
    return score;
  }

  _decrease_piece_number(color) {
    if (color === Color.BLACK) {
      --this._black_piece_number;
    }
    else if (color === Color.WHITE) {
      --this._white_piece_number;
    }
  }

  _sleeping() {
    for (let i = 0; i < this._intersections.length; ++i) {
      if (this._intersections[i] !== undefined && this._intersections[i].getColor() !== Color.NONE && this._intersections[i].getColor() !== Color.AVAILABLE) {
        let otherColor;
        if (this._intersections[i].getColor() === Color.BLACK) {
          otherColor = Color.WHITE;
        }
        else {
          otherColor = Color.BLACK;
        }
        let list = this._get_neighboor(this._intersections[i]);
        let isSleeping = true;
        for (let l = 0; l < list.length; ++l) {
          if (this._intersections[list[l]].getColor() === otherColor) {
            isSleeping = false;
            break;
          }
        }
        if (isSleeping === true) {
          this._intersections[i].setColor(Color.NONE);
        }
      }
    }
  }

  _get_colored(neighbour) {
    let list = [];
    for (let n = 0; n < neighbour.length; n++) {
      if (this._intersections[neighbour[n]].getColor() === Color.BLACK || this._intersections[neighbour[n]].getColor() === Color.WHITE) {
        list.push(neighbour[n]);
      }
    }
    return list;
  }

  _get_neighboor(intersection) {
    let coordinate = intersection.getCoordinate();
    let zone = coordinate.letter();
    let hash = coordinate.hash();
    let list = [];
    if (zone === 'D') {
      list = this._get_neighboor_middle(hash);
    } else if (zone >= 'A' && zone <= 'C') {
      list = this._get_neighboor_bottom(hash);
    } else if (zone >= 'E' && zone <= 'G') {
      list = this._get_neighboor_top(hash);
    }
    return list;
  }

  _get_neighboor_bottom(hash) {
    let list = [];
    if (hash % 7 !== 0) {
      if (this._hash_exist(hash - 8) === true) {
        list.push(hash - 8);
      }
      if (this._hash_exist(hash - 1) === true) {
        list.push(hash - 1);
      }
    }
    if (this._hash_exist(hash - 7) === true) {
      list.push(hash - 7);
    }
    if (this._hash_exist(hash + 1) === true) {
      list.push(hash + 1);
    }
    if (this._hash_exist(hash + 7) === true) {
      list.push(hash + 7);
    }
    if (this._hash_exist(hash + 8) === true) {
      list.push(hash + 8);
    }
    return list;
  }

  _get_neighboor_middle(hash) {
    let list = [];
    if (this._hash_exist(hash - 8) === true) {
      list.push(hash - 8);
    }
    if (this._hash_exist(hash - 7) === true) {
      list.push(hash - 7);
    }
    if (this._hash_exist(hash - 6) === true) {
      list.push(hash - 6);
    }
    if (this._hash_exist(hash - 1) === true) {
      list.push(hash - 1);
    }
    if (this._hash_exist(hash + 1) === true) {
      list.push(hash + 1);
    }
    if (this._hash_exist(hash + 7) === true) {
      list.push(hash + 7);
    }
    return list;
  }

  _get_neighboor_top(hash) {
    let list = [];
    if (hash % 7 !== 6) {
      if (this._hash_exist(hash + 1) === true) {
        list.push(hash + 1);
      }
      if (this._hash_exist(hash - 6) === true) {
        list.push(hash - 6);
      }
    }
    if (this._hash_exist(hash - 7) === true) {
      list.push(hash - 7);
    }
    if (this._hash_exist(hash - 1) === true) {
      list.push(hash - 1);
    }
    if (this._hash_exist(hash + 6) === true) {
      list.push(hash + 6);
    }
    if (this._hash_exist(hash + 7) === true) {
      list.push(hash + 7);
    }
    return list;
  }

  _hash_exist(hash) {
    if (hash < 0) {
      return false;
    } else if (hash >= this._intersections.length) {
      return false;
    } else if (hash <= 44 && hash >= 40) {
      return false;
    } else if (hash <= 36 && hash >= 34) {
      return false;
    } else if (hash === 28) {
      return false;
    } else {
      return true;
    }
  }

  _have_piece(color) {
    if (color === Color.BLACK && this._black_piece_number > 0) {
      return true;
    }
    if (color === Color.WHITE && this._white_piece_number > 0) {
      return true;
    }
    return false;
  }

  _is_current_player(color) {
    if (this._current_color === color) {
      return true;
    }
    else {
      return false;
    }
  }

  _neighboor_dispo(coordinate) {
    let list = this._get_neighboor(this._intersections[coordinate.hash()]);
    for (let i = 0; i < list.length; ++i) {
      if (this._intersections[list[i]].getColor() === Color.NONE) {
        this._intersections[list[i]].setColor(Color.AVAILABLE);
      }
    }
  }

  _no_hole(from, to) {
    let color_from = this._intersections[from.hash()].getColor();
    this._intersections[from.hash()].setColor(Color.AVAILABLE);
    let neighbour = this._get_neighboor(this._intersections[from.hash()]);
    let one_neighbour = true;
    for (let l = 0; l < neighbour.length; ++l) {
      if (neighbour[l] !== to.hash() && (this._intersections[neighbour[l]].getColor() === Color.BLACK || this._intersections[neighbour[l]].getColor() === Color.WHITE)) {
        one_neighbour = false;
        break;
      }
    }
    if (one_neighbour === true) {
      this._intersections[from.hash()].setColor(color_from);
      return true;
    }
    let painted = this._paint_board(to.hash());
    let right_neighbour = this._get_colored(neighbour);
    for (let n = 0; n < right_neighbour.length; ++n) {
      if (painted[right_neighbour[n]] === false) {
        this._intersections[from.hash()].setColor(color_from);
        return false;
      }
    }
    this._intersections[from.hash()].setColor(color_from);
    return true;
  }

  _opposite_color_neighbour(neighbour, color) {
    let opposite;
    if (color === Color.BLACK) {
      opposite = Color.WHITE;
    }
    else if (color === Color.WHITE) {
      opposite = Color.BLACK;
    }
    let list = [];
    for (let n = 0; n < neighbour.length; n++) {
      if (this._intersections[neighbour[n]].getColor() === opposite) {
        list.push(neighbour[n]);
      }
    }
    return list;
  }

  _paint_board(start_hash) {
    let painted = new Array(this._intersections.length);
    painted.fill(false);
    painted[start_hash] = true;

    let need_paint = this._get_colored(this._get_neighboor(this._intersections[start_hash]));
    for (let n = 0; n < need_paint.length; n++) {
      if (painted[need_paint[n]] === false) {
        painted[need_paint[n]] = true;
        let neighbour = this._get_colored(this._get_neighboor(this._intersections[need_paint[n]]));
        for (let i = 0; i < neighbour.length; ++i) {
          need_paint.push(neighbour[i]);
        }
      }
    }
    return painted;
  }

  _put_first_piece(color, place) {
    if (this._is_current_player(color) && place.is_valid()) {
      this._decrease_piece_number(color);
      this._all_at_none();
      this._intersections[place.hash()].setColor(color);
      this._intersections[place.hash()].stackHeightIncrement();
      this._neighboor_dispo(place);
      this._change_current_player();
    }
  }

  _put_piece(color, place) {
    if (this._is_current_player(color) && place.is_valid()) {
      if (this._intersections[place.hash()].getColor() === Color.AVAILABLE && this._have_piece(this.current_color())) {
        this._decrease_piece_number(color);
        this._intersections[place.hash()].setColor(color);
        this._intersections[place.hash()].stackHeightIncrement();
        this._neighboor_dispo(place);
        this._change_current_player();
        this._has_skipped = false;
      }
    }
  }

  _reset() {
    for (let i = 0; i < this._intersections.length; ++i) {
      if (this._intersections[i] !== undefined) {
        this._intersections[i].setColor(Color.AVAILABLE);
        this._intersections[i].setStackHeight(0);
      }
    }
    this._black_piece_number = 18;
    this._white_piece_number = 18;
    this._current_color = Color.BLACK;
    this._is_game_finished = false;
    this._has_skipped = false;
  }

  _skip(color) {
    if (this._is_current_player(color)) {
      if ((color === Color.BLACK && this._black_piece_number === 0) || (color === Color.WHITE && this._white_piece_number === 0)) {
        if (this._has_skipped === false) {
          this._has_skipped = true;
          this._change_current_player();
        }
        else if (this._has_skipped === true) {
          this._is_game_finished = true;
        }
      }
    }
  }

  _Stack_height_verif(from, to) {
    if (this._intersections[from.hash()].getStackHeight() + this._intersections[to.hash()].getStackHeight() <= 3) {
      return true;
    }
    else {
      return false;
    }
  }

}

export default Engine;
