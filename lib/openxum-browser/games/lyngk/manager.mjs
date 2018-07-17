"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';
import Player from '../../../openxum-core/games/lyngk/player.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Lyngk.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Player.PLAYER_1 ? 'Player 1' : 'Player 2';
  }

  static get_name() {
    return 'lyngk';
  }

  get_winner_color() {
    return this.engine().winner_is() === Player.PLAYER_1 ? 'player 1' : 'player 2';
  }

  process_move() {
  }
}

export default Manager;