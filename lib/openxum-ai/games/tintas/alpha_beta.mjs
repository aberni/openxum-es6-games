/**
 * Created by lcanonne on 20/06/18.
 */

import OpenXum from '../../../openxum-core/openxum/engine.mjs';
import Color from '../../../openxum-core/games/tintas/color.mjs';
import Coordinates from '../../../openxum-core/games/tintas/coordinates.mjs';
import Cell from '../../../openxum-core/games/tintas/cell.mjs';
import Engine from '../../../openxum-core/games/tintas/engine.mjs';
import Player from '../../../openxum-core/games/tintas/player.mjs';
import Move from '../../../openxum-core/games/tintas/move.mjs';
import {is_color} from '../../../openxum-core/games/tintas/color.mjs'


const MAX_DEPTH = 6;

class Ia_alpha_beta {
  constructor(c, e) {
    this._engine = e.clone();
  }

  get_value(engine) { //ok
    let value = 0;
    let player_ia = engine.get_player_1();
    let player_human = engine.get_player_2();
    for (let i = 0; i < 7; i += 1) {
      if (player_ia[i] > 3 && player_human[i] > 0) {
        value += 25;
      }
      else if (player_human[i] > 3 && player_ia[i] > 0) {
        value -= 25;
      }
      else if (player_human[i] > 0 && player_ia[i] < 1) {
        let x = player_human[i];
        value += (x * (95 * x - 65)) / 42;
      }
      else if (player_ia[i] > 0 && player_human[i] < 1) {
        let x = player_ia[i];
        value -= (x * (95 * x - 65)) / 42;
      }
    }
    return value;
  }

  ia_play() {
    let engine = this._engine.clone();
    let player = 0;
    let value = 0;
    let moves = this._engine.get_possible_move_list();
    let value_of_moves = new Array(moves.length);
    let ind_max = 0;
    for (let i = 0; i < moves.length; i += 1) {
      value_of_moves[i] = this.create_node(engine, moves[i], 0, 0);
      if (value_of_moves[i] > value_of_moves[ind_max]) {
        ind_max = i;
      }
    }
    return moves[ind_max];
  }


  create_node(engine, move, depth, value) {

    let current_engine = engine.clone(); // engine du noeud

    let player = current_engine.get_current_color(); // couleur du joueur du noeud
    current_engine.move(move); //applique le move passe en parametre
    let current_value;


    if (depth >= MAX_DEPTH) {
      current_value = this.get_value(current_engine); // Si on est sur une feuille
    }
    else {
      let cc = [];
      let possibles_moves = current_engine.get_possible_move_list();
      if (player === 1) {
        current_value = -1001;
      } //max ou min
      else {
        current_value = 1001;
      }
      for (let i = 0; i < possibles_moves.length; i = i + 1) {

        let c = this.create_node(current_engine, possibles_moves[i], depth + 1, current_value);
        cc.push(c);

        if (player === 1 && current_value < c) { // Si c'est l'ia on cherche le max
          current_value = c;
        }
        else if (player === 0 && current_value > c) { // sinon si c'est l'humain on cherche le min
          current_value = c;
        }
      }
    }
    return current_value;

  }
}


export default Ia_alpha_beta;