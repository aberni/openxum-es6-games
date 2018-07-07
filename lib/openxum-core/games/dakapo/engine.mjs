"use strict";

import Color from './color.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Move from './move.mjs';
import Phase from './phase.mjs';

class Engine extends OpenXum.Engine {
  constructor() {
    super();

    this._phase = Phase.IN_GAME;
    this._color = Color.NONE;
    this._turn = 0;
    this._last_move = [];
    this.init_board_array();
    this._color_count = [1, 1, 1, 1];
  }

  apply_moves(moves) {
    for (let i = 0; i < moves.length; ++i) {
      this.move(new Move(moves[i]._color, moves[i]._abs, moves[i]._ord));
    }
  }

  clone() {
    let o = new Engine();

    o._set(this._phase, this._board);
    return o;
  }

  get_name() {
    return 'Dakapo';
  }

  get_possible_move_list() {
    let colors = [Color.BLUE, Color.RED, Color.YELLOW, Color.GREEN];
    let moves = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        for (let index in colors) {
          if (this._is_possible(new Move(colors[index], i, j)) === true) {
            moves.push(new Move(colors[index], i, j));
          }
        }
      }
    }
    return moves;
  }

  is_finished() {
    return (this._phase === Phase.FINISH || this._phase === Phase.TIE);
  }

  move(move) {
    if (!this.is_finished()) {
      if (this._is_possible(move)) {
        this._board[move._abs][move._ord] = parseInt(move._color);
        this._color = parseInt(move._color);
        this._color_count[this._color] = this._color_count[this._color] + 1;
        this._victory(move);
        this._last_move.push(move);
      }
    }
  }

  parse(str) {
  }

  to_string() {
  }

  current_color() {
    return this._turn % 2 === 0 ? 'Joueur 1' : 'Joueur 2';
  }

  winner_is() {
    return this.current_color();
  }

  _get_phase() {
    return this._phase;
  }

  _coord_pos_possible(move) {
    if (move._abs >= 8 || move._abs < 0 || move._ord >= 8 || move._ord < 0) {
      return false;
    }
    if (parseInt(move._color) === this._color) {
      return false;
    }
    if (this._board[move._abs][move._ord] !== Color.NONE) {
      return false;
    }
    if (this._color_count[parseInt(move._color)] > 15) {
      return false;
    }
  }

  _coord_adj_possible(move) {
    let caseadj = 0;
    let caseadj_max = 0;

    if (move._abs + 1 < 8) {
      caseadj_max++;
      if (this._board[move._abs + 1][move._ord] === parseInt(move._color)) {
        return false;
      }
      caseadj = this._board[move._abs + 1][move._ord] === Color.NONE ? caseadj + 1 : caseadj;
    }
    if (move._abs - 1 >= 0) {
      caseadj_max++;
      if (this._board[move._abs - 1][move._ord] === parseInt(move._color)) {
        return false;
      }
      caseadj = this._board[move._abs - 1][move._ord] === Color.NONE ? caseadj + 1 : caseadj;
    }
    if (move._ord + 1 < 8) {
      caseadj_max++;
      if (this._board[move._abs][move._ord + 1] === parseInt(move._color)) {
        return false;
      }
      caseadj = this._board[move._abs][move._ord + 1] === Color.NONE ? caseadj + 1 : caseadj;
    }
    if (move._ord - 1 >= 0) {
      caseadj_max++;
      if (this._board[move._abs][move._ord - 1] === parseInt(move._color)) {
        return false;
      }
      caseadj = this._board[move._abs][move._ord - 1] === Color.NONE ? caseadj + 1 : caseadj;
    }
    return !(caseadj === caseadj_max);
  }

  _is_possible(move) {
    if (this._coord_pos_possible(move) === false) return false;
    if (this._coord_adj_possible(move) === false) return false;
    return true;
  }

  _set(_phase, _board) {
    this._phase = _phase;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this._board[i][j] = _board[i][j];
      }
    }
  }

  _fullboard() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this._board[i][j] !== Color.NONE) {
          return false;
        }
      }
    }
    return true;
  }

  _victory(move) {
    if (this._fullboard() === true) {
      this._phase = Phase.TIE;
    } else if (this.get_possible_move_list().length === 0) {
      this._phase = Phase.FINISH;
    } else if (this._carre(move)) {
      this._phase = Phase.FINISH;
    } else {
      this._turn = this._turn + 1;
    }
  }

  init_board_array() {
    this._board = new Array(8);
    for (let x = 0; x < 8; x++) {
      this._board[x] = new Array(8);
    }
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        this._board[x][y] = -1;
      }
    }
    this._board[3][3] = 1;
    this._board[3][4] = 3;
    this._board[4][3] = 2;
    this._board[4][4] = 0;
  }

  _carre(move) {
    let x, y;
    let list = this._get_color_list(move);

    for (let k = 0; k < list.length; k++) {
      x = list[k]._abs - move._abs;
      y = list[k]._ord - move._ord;
      if (list[k]._abs + y < 8 && list[k]._abs + y >= 0 && list[k]._ord - x < 8 && list[k]._ord - x >= 0) {
        if (this._board[list[k]._abs + y][list[k]._ord - x] === parseInt(move._color)) {
          if (list[k]._abs + y - x < 8 && list[k]._abs + y - x >= 0 && list[k]._ord - x - y < 8 && list[k]._ord - x - y >= 0) {
            if (this._board[list[k]._abs + y - x][list[k]._ord - x - y] === parseInt(move._color)) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  _get_color_list(move) {
    let list = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this._board[i][j] === parseInt(move._color) && (i !== move._abs || j !== move._ord )) {
          list.push(new Move(this._board[i][j]._color, i, j));
        }
      }
    }
    return list;
  }

}
export default Engine;