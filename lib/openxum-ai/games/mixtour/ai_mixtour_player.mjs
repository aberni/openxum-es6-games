"use strict";

import Color from '../../../openxum-core/games/mixtour/color.mjs';
import OpenXum from '../../../openxum-core/openxum/player.mjs';


class Player extends OpenXum.Player {
  constructor(c, o, e, d) {
    super(c, o, e);
    this._max_depth = d;
  }

// public methods
  confirm() {
    return true;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    let list = this._engine.get_possible_move_list();
    let best_move = list[0];
    let eval_max = this._limited_depth_alpha_beta(this._engine, list[0], 1, null);

    for (let i = 1; i < list.length; ++i) {
      const potential_max = this._limited_depth_alpha_beta(this._engine, list[i], 1, eval_max);
      if (potential_max > eval_max) {
        eval_max = potential_max;
        best_move = list[i];
      }
    }
    return best_move;
  }

  reinit(e) {
    this._engine = e;
  }

  _check_alpha_beta_value(color, alpha_beta, evaluation) {
    return (color === this._color && evaluation < alpha_beta) || (color !== this._color && evaluation > alpha_beta);
  }

  _compute_eval_value(engine, white_mult, black_mult) {
    let evaluation = 0;
    if (engine.is_finished()) {
      if (engine.winner_is() === Color.WHITE) {
        evaluation = white_mult * 5000;
      }
      else {
        if (engine.winner_is() === Color.BLACK) {
          evaluation = black_mult * 5000;
        }
      }
    }
    else {
      let _size_white_controlled_towers = this._compute_sum_size_controlled_towers(engine.get_towers(), Color.WHITE);
      let _size_black_controlled_towers = this._compute_sum_size_controlled_towers(engine.get_towers(), Color.BLACK);
      evaluation += 50 * (white_mult * engine.get_white_points() + black_mult * engine.get_black_points()) +
        white_mult * _size_white_controlled_towers + black_mult * _size_black_controlled_towers;
    }
    return evaluation;
  }

  _compute_sum_size_controlled_towers(towers, color) {
    let size_controlled_towers = 0;
    for (let i = 0; i < towers.length; ++i) {
      const tower_height = towers[i].pieces.length;
      if (towers[i].pieces[tower_height - 1] === color) {
        size_controlled_towers += tower_height;
      }
    }
    return size_controlled_towers;
  }

  _eval(engine) {
    let white_mult;
    let black_mult;
    if (this._color === Color.WHITE) {
      white_mult = 1;
      black_mult = -1;
    }
    else {
      white_mult = -1;
      black_mult = 1;
    }

    let evaluation = this._compute_eval_value(engine, white_mult, black_mult);

    return evaluation;
  }

  _is_better_evaluation(color, potential_evaluation, evaluation) {
    return (color === this._color && potential_evaluation > evaluation) ||
      (color !== this._color && potential_evaluation < evaluation);
  }

  _limited_depth_alpha_beta(engine, move_to_execute, depth, alpha_beta) {
    let e = engine.clone();
    let evaluation;
    e.move(move_to_execute);

    if (e.is_finished() || depth >= this._max_depth) {
      evaluation = this._eval(e);
    }
    else {
      let list = e.get_possible_move_list();
      evaluation = this._limited_depth_alpha_beta(e, list[0], depth + 1, null);

      let i = 1;
      while (i < list.length && ( !alpha_beta || this._check_alpha_beta_value(e.current_color(), alpha_beta, evaluation))) {
        const potential_evaluation = this._limited_depth_alpha_beta(e, list[i], depth + 1, evaluation);
        if (this._is_better_evaluation(e.current_color(), potential_evaluation, evaluation)) {
          evaluation = potential_evaluation;
        }
        i++;
      }
    }
    return evaluation;
  }

}

export default Player;