"use strict";
import Color from '../color.mjs';

class Player {
  constructor(c, e, depth) {
    this._color = c;
    this._engine = e;
    this._depth = depth;
    this._cpt = 0;
  }

  move() {
    let possibleMoves = this._engine.get_possible_move_list();
    let chosenMove = possibleMoves[Math.floor(Math.random() * (possibleMoves.length - 1))];
    let clone = this._engine.clone();
    let score = -99999;

    this._cpt = this._cpt + possibleMoves.length - 1;
    for (let i = 0; i < possibleMoves.length - 1; i++) {
      if (this._engine._carre(possibleMoves[i])) {
        chosenMove = possibleMoves[i];
        break;
      }
      let score_tempo = this._get_score(possibleMoves[i], clone, this._depth, -1);
      if (score_tempo > score) {
        score = score_tempo;
        chosenMove = possibleMoves[i];
      }
    }
    return chosenMove;
  }


  _get_score(move, aclone, depth, turn) {

    aclone.move(move);
    let list = aclone.get_possible_move_list();

    if (depth === 0) {
      this._cpt = this._cpt + 1;
      if (turn > 0) {
        return this._evaluer_max(move, aclone);
      }
      else if (turn < 0) {
        return this._evaluer_min(move, aclone);
      }
    }

    let score = 0;

    for (let i = 0; i < list.length - 1; i++) {
      let score_tempo = this._get_score(list[i], aclone, depth - 1, -turn);

      if (turn * score_tempo >= turn * score) {
        score = score_tempo;
      }
    }
    return score;
  }

  _evaluer_min(move, clone) {
    if (clone._carre(move)) {
      return -1000;
    }
    return 0;
  }

  _evaluer_max(move, clone) {
    if (clone._carre(move)) {
      return 1000;
    }
    return 0;
  }


}

export default Player;

