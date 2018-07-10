"use strict";

import OpenXum from '../../openxum/player.mjs';
import Color from './color.mjs';
import EfficientMove from './efficient_move.mjs';
import AlphaBetaValue from './alphabeta_value.mjs';

class IANeutreeko extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
    this.POSITIVE_INFINITY = 1000;
    this.NEGATIVE_INFINITY = -1000;
    this.WIN_EFFICIENCY = 100;
    this.DRAW_EFFICIENCY = 10;
    this.DEFAULT_EFFICIENCY = 0;
    this.MAX_DEPTH = 6;
  }

  confirm() {
    return true;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move(move) {
    let list = this._engine.get_possible_move_list();
    //return list[Math.floor(Math.random() * list.length)];
    let m = this.chooseMove(this._engine, this.MAX_DEPTH, this.NEGATIVE_INFINITY, this.POSITIVE_INFINITY);
    //let m = this.αβMove(this._engine, this.MAX_DEPTH, this.DEFAULT_EFFICIENCY, this.DEFAULT_EFFICIENCY);
    return m;
  }

  reinit(e) {
    this._engine = e;
  }

  getEfficiency2(node, depth) {
    if (node.is_finished()) {
      if (node._winner_color !== Color.NONE) {
        // There is a winner
        if (node._winner_color === this.color()) {
          return this.WIN_EFFICIENCY * (depth + 1);
        }
        else {
          return -this.WIN_EFFICIENCY * (depth + 1);
        }
      }
      // This is a draw
      if (this.color() === node.current_color()) {
        return this.DRAW_EFFICIENCY;
      } else {
        return -this.DRAW_EFFICIENCY;
      }
    } else {
      // Nothing happened
      return this.DEFAULT_EFFICIENCY;
    }
  }

  αβ(node, depth, α, β) {
    let efficiency = this.getEfficiency2(node, depth);
    let best_value = new AlphaBetaValue(α, β);
    if (node.is_finished()) {
      if (this.color() === node.current_color()) {
        return new AlphaBetaValue(α + efficiency, β);
      } else {
        return new AlphaBetaValue(α, β + efficiency);
      }
    }
    if (depth !== 0) {
      let move_list = node.get_possible_move_list();
      let value;
      if (this.color() === node.current_color()) {
        for (let i = 0; i < move_list.length; i++) {
          node.move(move_list[i]);
          value = this.αβ(node, depth - 1, α + efficiency, β);
          if (node.is_finished()) {
            node.undo_move(this.color(), move_list[i]);
            return value;
          } else {
            node.undo_move(this.color(), move_list[i]);
            if (value.α() > best_value.α()) {
              best_value.set_α(value.α());
            }
          }
        }
      } else {
        for (let i = 0; i < move_list.length; i++) {
          node.move(move_list[i]);
          value = this.αβ(node, depth - 1, α, β + efficiency);
          if (node.is_finished()) {
            node.undo_move(this.color(), move_list[i]);
            return value;
          } else {
            node.undo_move(this.color(), move_list[i]);
            if (value.β() < best_value.β()) {
              best_value.set_β(value.β());
            }
          }
        }
      }
    }
    return best_value;
  }

  αβMove(node, depth, α, β) {
    let move_list = node.get_possible_move_list();
    let best_move = move_list[0];
    let value;
    let best_value = new AlphaBetaValue(α, β);
    for (let i = 0; i < move_list.length; i++) {
      let child = node.clone();
      child.move(move_list[i]);
      value = this.αβ(child, depth - 1, α, β);
      console.log(move_list[i].to_string() + ' ' + value.to_string());
      if (value.α() + value.β() > best_value.α() + best_value.β()) {
        best_value.set_α(value.α());
        best_value.set_β(value.β());
        best_move = move_list[i];
      }
    }
    console.log('best choice: ' + best_move.to_string());
    return best_move;
  }

  chooseMove(node, depth, α, β) {
    if (depth === 0 || node.is_finished()) {
      if (node.is_finished()) {
        console.error('IA cant play if the game is finished');
      } else {
        let move_list = node.get_possible_move_list();
        let move;
        let bestEfficiency = this.NEGATIVE_INFINITY;
        for (let i = 0; i < move_list.length; i++) {
          let child = node.clone();
          child.move(move_list[i]);
          if (this.getEfficiency(child, depth) > bestEfficiency) {
            move = move_list[i];
          }
        }
        return move;
      }
    }
    let winningMove = this.getMoveToWin(node, depth, α, β);
    let avoidingLosingMove = this.getMoveToAvoidLosing(node, depth, α, β);
    console.log('winning: ' + winningMove.to_string());
    console.log('avoiding: ' + avoidingLosingMove.to_string());
    console.log(winningMove.efficiency() + ' vs ' + (depth * this.WIN_EFFICIENCY - avoidingLosingMove.efficiency()));
    if (winningMove.efficiency() > depth * this.WIN_EFFICIENCY - avoidingLosingMove.efficiency()) {
      console.log('best: winning');
      return winningMove.move();
    }
    console.log('best: avoiding');
    return avoidingLosingMove.move();
  }

  getMoveToWin(node, depth, α, β) {
    let move_list = node.get_possible_move_list();
    let v = this.NEGATIVE_INFINITY;
    let move = move_list[0];
    for (let i = 0; i < move_list.length; i++) {
      let child = node.clone();
      child.move(move_list[i]);
      v = Math.max(v, this.alphabeta(child, depth - 1, α, β, false));
      console.log('test winning: ' + move_list[i].to_string() + ' efficiency: ' + v);
      console.log(child.getStateString());
      if (v > α) {
        move = move_list[i];
      }
      α = Math.max(α, v);
      if (β <= α) {
        break; // β cut-off
      }
    }
    return new EfficientMove(move, v, depth);
  }

  getMoveToAvoidLosing(node, depth, α, β) {
    let move_list = node.get_possible_move_list();
    let v = this.POSITIVE_INFINITY;
    let move = move_list[0];
    for (let i = 0; i < move_list.length; i++) {
      let child = node.clone();
      child.move(move_list[i]);
      v = Math.min(v, this.alphabeta(child, depth - 1, α, β, true));
      console.log('test avoiding: ' + move_list[i].to_string() + ' efficiency: ' + v);
      console.log(child.getStateString());
      if (v < β) {
        move = move_list[i];
      }
      β = Math.min(β, v);
      if (β <= α) {
        break; // α cut-off
      }
    }
    return new EfficientMove(move, v, depth);
  }

  getEfficiency(node, depth) {
    if (node.is_finished()) {
      if (node._winner_color !== Color.NONE) {
        // There is a winner
        if (node._winner_color === node.current_color()) {
          return this.WIN_EFFICIENCY * (depth + 1);
        }
        else {
          console.error('impossible case');
          return 0;
        }
      }
      // This is a draw
      return this.DRAW_EFFICIENCY;
    } else {
      // Nothing happened
      return this.DEFAULT_EFFICIENCY;
    }
  }


  alphabeta(node, depth, α, β, maximizingPlayer) {
    if (depth === 0 || node.is_finished()) {
      return this.getEfficiency(node, depth);
    }
    let move_list = node.get_possible_move_list();
    if (maximizingPlayer) {
      let v = this.NEGATIVE_INFINITY;
      for (let i = 0; i < move_list.length; i++) {
        let child = node.clone();
        child.move(move_list[i]);
        v = Math.max(v, this.alphabeta(child, depth - 1, α, β, false));
        α = Math.max(α, v);
        if (β <= α) {
          break; // β cut-off
        }
      }
      return v;
    } else {
      let v = this.POSITIVE_INFINITY;
      for (let i = 0; i < move_list.length; i++) {
        let child = node.clone();
        child.move(move_list[i]);
        v = Math.min(v, this.alphabeta(child, depth - 1, α, β, true));
        β = Math.min(β, v);
        if (β <= α) {
          break; // α cut-off
        }
      }
      return v;
    }
  }
}

export default {
  IANeutreeko: IANeutreeko
};