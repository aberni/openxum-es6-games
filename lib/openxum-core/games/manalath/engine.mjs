"use strict";

import Coordinates from "./coordinates.mjs";
import Intersection from "./intersection.mjs";
import OpenXum from '../../openxum/index.mjs';
import Piece from './piece.mjs';
import Player from './player.mjs';
import State from './state.mjs';
import Color from './color.mjs';
import Move from './move.mjs';

// enums definition
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class Engine extends OpenXum.Engine {
  constructor(type, current_color) {
    super();
    this._type = type;
    this._current_color = current_color;
    this._black_piece_count = 30;
    this._white_piece_count = 30;
    this._intersections = [];
    this._end = -1;
    this._player_end = false;
    this._listeners = [];
    this._init_board();
  }

  apply_moves(moves) {
  }

  clone() {
    let e = new Engine(this._type, this._current_color);

    e._set(this._black_piece_count, this._white_piece_count, this._intersections);
    return e;
  }

  current_color() {
    return this._current_color;
  }

  get_intersection(coordinates, c, l) {
    if (coordinates) {
      return this._intersections[coordinates.hash()];
    }
    return this._intersections[new Coordinates(c, l).hash()];
  }

  get_name() {
    return "Manalath";
  }

  get_possible_move_list(color) {
    if (color === null || color === undefined) {
      // random color
      color = Math.floor(Math.random() * 2) === 0 ? Color.WHITE : Color.BLACK;
    }
    return this._get_array_moves(color);
  }

  is_finished() {
    return this._end !== -1;
  }

  move(move) {
    let c2 = move.to();
    let chosen_color = move.chosen_color();
    let destination_intersection = this.get_intersection(c2);

    if (!this._is_move_valid(c2, chosen_color)) {
      this._clear_marks_intersection();
      return false;
    }
    destination_intersection.set_piece(new Piece(chosen_color));
    if (chosen_color === Color.WHITE) {
      --this._white_piece_count;
    } else {
      --this._black_piece_count;
    }
    this._is_finished();
    this._switch_player();
    this._clear_marks_intersection();
    return true;
  }

  parse(str) {
  }

  to_string() {
  }

  winner_is() {
    if (this._end === 0) {
      return this._player_end === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
    } else if (this._end === 1) {
      return this._player_end;
    }
  }

  // private methods
  _clear_marks_intersection() {
    for (let i in this._intersections) {
      this._intersections[i].clear_mark();
    }
  }

  _count_neighbor_with_same_color(coordinates, origin_color, first) {
    let intersection = this.get_intersection(coordinates);
    let color = intersection.get_color();

    if (!first && (color !== origin_color || intersection.is_marked())) {
      return 0;
    }

    let current_line = intersection.get_line();
    let current_column = intersection.get_column();
    let nb_piece_same_color = 1;

    intersection.set_marked();
    for (let dir = 0; dir < 6; dir++) {
      let neighbor_coordinates = this._get_neighbor_coordinates(current_line, current_column, dir);
      let neighbor_intersection = null;

      if (neighbor_coordinates !== null) {
        neighbor_intersection = this.get_intersection(neighbor_coordinates);
      }
      if (neighbor_intersection !== null && !neighbor_intersection.is_marked() &&
        neighbor_intersection.get_color() === origin_color) {
        nb_piece_same_color += this._count_neighbor_with_same_color(neighbor_coordinates, origin_color, false);
      }
    }
    return nb_piece_same_color;
  }

  _exist_intersection(letter, number) {
    let coordinates = new Coordinates(letter, number);

    if (coordinates.is_valid()) {
      return this._intersections[coordinates.hash()] !== null;
    } else {
      return false;
    }
  }

  _get_array_moves(color) {
    let possible_moves = [];

    for (let i in this._intersections) {
      this._clear_marks_intersection();
      let inter = this._intersections[i];

      if (inter.get_state() !== State.VACANT ||
        (this._count_neighbor_with_same_color(inter.get_coordinates(), color, true) >= 6)
      ) {
        continue;
      }
      possible_moves.push(new Move(inter.get_coordinates(), color));
    }
    this._clear_marks_intersection();
    return possible_moves;
  }

  _get_neighbor_coordinates(line, column, dir) {
    let neighbors = [
      [line + 1, column],
      [line - 1, column],
      [line + 1, String.fromCharCode(column.charCodeAt(0) + 1)],
      [line, String.fromCharCode(column.charCodeAt(0) - 1)],
      [line, String.fromCharCode(column.charCodeAt(0) + 1)],
      [line - 1, String.fromCharCode(column.charCodeAt(0) - 1)]
    ];

    line = neighbors[dir][0];
    column = neighbors[dir][1];

    let neighborCoord = new Coordinates(column, line);

    if (neighborCoord.is_valid()) {
      return neighborCoord;
    }
    return null;
  }

  _init_board() {
    let i, line;

    for (i = 0; i < letters.length; i++) {
      for (line = 0; line < 9; line += 1) {
        this._initialize_intersection(new Coordinates(letters[i], line));
      }
    }
  }

  _initialize_intersection(coord) {
    if (coord.is_valid()) {
      this._intersections[coord.hash()] = new Intersection(coord);
    }
  }

  _is_finished() {
    let ancient_player = this.current_color();

    for (let i in this._intersections) {
      this._clear_marks_intersection();
      let intersection = this._intersections[i];

      if (intersection.get_state() === State.VACANT || intersection.get_color() !== ancient_player) {
        continue;
      }

      let nb_pieces_same_color = this._count_neighbor_with_same_color(intersection.get_coordinates(), ancient_player, true);

      this._clear_marks_intersection();
      if (nb_pieces_same_color === 4) {
        this._end = 0;
        this._player_end = ancient_player;
        break;
      }
      if (nb_pieces_same_color === 5) {
        this._end = 1;
        this._player_end = ancient_player;
        break;
      }
    }
  }

  _is_move_valid(coord, chosen_color) {
    if ((chosen_color === Color.BLACK && this._black_piece_count === 0) ||
      (chosen_color === Color.WHITE && this._white_piece_count === 0) ||
      chosen_color === Color.NONE
    ) {
      return false;
    }
    return this._count_neighbor_with_same_color(coord, chosen_color, true) < 6;
  }

  _set(black_pieces_count, white_pieces_count, intersections) {
    this._black_piece_count = black_pieces_count;
    this._white_piece_count = white_pieces_count;

    for (let i in intersections) {
      this._intersections[i] = intersections[i].clone();
    }
  }

  _switch_player() {
    this._current_color = this._current_color === Color.WHITE ? Color.BLACK : Color.WHITE;
  }
}

export default Engine;