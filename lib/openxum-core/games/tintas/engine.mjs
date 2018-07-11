// lib/openxum-core/games/lyngk/engine.mjs

import OpenXum from '../../openxum/index.mjs';
import Color from './color.mjs';
import {is_color} from './color.mjs'
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';
import Board from './board.mjs';
import Player from './player.mjs';
import Move from './move.mjs';
import {is_valid} from './board.mjs';
//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
  constructor(type, color, clone) {
    super();
    this._board = new Board();
    this._player_1 = [0, 0, 0, 0, 0, 0, 0];
    this._player_2 = [0, 0, 0, 0, 0, 0, 0];
    this._current = Player.PLAYER_1;
    this._currentColor = Color.EMPTY;
    if (clone === undefined) {
      this._board.init_board();
    }
  }

  get_player_1() {
    return this._player_1;
  }

  get_player_2() {
    return this._player_2;
  }

  apply_moves(moves) {
    let a;
    for (a = 0; a < moves.length; a += 1) {
      this._board.apply_move(moves[a]);
    }
  }

  clone() {
    let a;
    a = new Engine(0, 0, 0);
    a._board = this._board.clone();
    for (let i = 0; i < 7; i += 1) {
      a._player_1[i] = this._player_1[i];
      a._player_2[i] = this._player_2[i];
    }
    a._current = this._current;
    a._last_color = this._last_color;
    return a;
  }

  get_board() {
    return this._board;
  }

  set_color(color) {
    this._currentColor = color;
  }

  set_current(player) {
    this._current = player;
  }

  current_color() {
    return this._current;
  }

  get_current_color() {
    return this._current;
  }

  get_name() {
    return "tintas";
  }

  get_possible_move_list() {
    return this._board.get_move(this._last_color);
  }

  have_empty_stack(player) {
    for (let i = 0; i < 7; i = i + 1) {
      if (player[i] === 0) {
        return true;
      }
    }
    return false;
  }

  player_stack_win() {
    let pile_max_1 = 0;
    let pile_max_2 = 0;
    for (let i = 0; i < 7; i = i + 1) {
      if (this._player_1[i] >= 4) {
        pile_max_1 += 1;
      }
      if (this._player_2[i] >= 4) {
        pile_max_2 += 1;
      }
    }
    if ((pile_max_1 >= 4) && !this.have_empty_stack(this._player_1)) {
      return true;
    }
    if ((pile_max_2 >= 4) && !this.have_empty_stack(this._player_2)) {
      return true;
    }
    return false;
  }

  player_full_win() {
    for (let i = 0; i < 7; i += 1) {
      if (this._player_1[i] === 7) {
        return true;
      }
      else if (this._player_2[i] === 7) {
        return true;
      }
    }
    return false;
  }


  is_finished() {
    return this.player_stack_win() || this.player_full_win();
  }

  add_points(color) {
    if (is_color(color)) {
      if (this._current == Player.PLAYER_1) {
        this._player_1[color] += 1;
      }
      else if (this._current == Player.PLAYER_2) {
        this._player_2[color] += 1;
      }
    }
  }

  classic_move(move) {
    this._last_color = this._board.apply_move(move);
    if (is_color(this._last_color)) {
      this.add_points(this._last_color);
    }
    let list = this.get_possible_move_list();
    if (list.length === 1 && list[0].get_from() === -1 && list[0].get_to() === -1) {
      this.move(new Move(-1, -1));
    }
  }

  pass_bouton_move() {
    this.change_player();
  }

  pass_move(move) {
    this.change_player();
    this._last_color = this._board.apply_move(move);
  }

  first_move(move) {
    this._last_color = this._board.apply_move(move);
    this.add_points(this._last_color);
    this.change_player();
  }

  move(move) {
    if (move.get_from() === -1 && move.get_to() === -1) {
      this.pass_bouton_move();
    }
    else if (move.get_to() === 50) {
      this.pass_move(move);
    }
    else if (move.get_from() === 49) {
      this.first_move(move);
    }
    else {
      this.classic_move(move);
    }
  }

  change_player() {
    this._last_color = Color.EMPTY;
    if (this._current === Player.PLAYER_1) {
      this._current = Player.PLAYER_2;
    }
    else {
      this._current = Player.PLAYER_1;
    }
  }

  parse(str) {
    let i = 0;
    let indice = 0;
    while (indice < 49) {
      this.get_cell_by_id().set_color(parseInt(str.charAt(indice)));
      i += 1;
    }
    for (let r; i < 7; i += 1) {
      this._player_1[r] = str[i];
      i += 1;
    }
    for (let e; i < 7; i += 1) {
      this._player_2[e] = str[i];
      i += 1;
    }
    this._currentPlayer = str[i];
    i++;
    this._currentColor = str[i];
  }

  to_string() {
    let result = "";
    let tmp = 0;
    for (let i = 0; i < 49; i += 1) {
      result += this.board.get_cell_by_id(i) + "\n";
    }
    for (let i; i < 7; i += 1) {
      result += this._player_1[i] + "\n";
    }
    for (let e; i < 7; i += 1) {
      result += this._player_2[e] + "\n";
    }
    result += this._currentPlayer + "\n";
    result += this._last_color + "\n";
    return result;
  }

  get_player_stack_win() {
    let pile_max_1 = 0;
    let pile_max_2 = 0;
    for (let i = 0; i < 7; i = i + 1) {
      if (this._player_1[i] >= 4) {
        pile_max_1 += 1;
      }
      if (this._player_2[i] >= 4) {
        pile_max_2 += 1;
      }
    }
    if (pile_max_1 >= 4) {
      return Player.PLAYER_1;
    }
    return Player.PLAYER_2;
  }

  get_player_full_win() {
    for (let i = 0; i < 7; i += 1) {
      if (this._player_1[i] === 7) {
        return Player.PLAYER_1;
      }
      else if (this._player_2[i] === 7) {
        return Player.PLAYER_2;
      }
    }
    return false;
  }

  winner_is() {
    if (this.player_full_win()) {
      return this.get_player_full_win();
    }
    return this.get_player_stack_win();
  }

}

export default Engine;