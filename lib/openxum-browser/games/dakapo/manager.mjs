"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s, w) {
    super(e, g, o, s, w);
    this.that(this);
  }

  build_move() {
    return new Dakapo.Move();
  }

  get_current_color() {
    return this._engine.current_color() === Dakapo.Player.PLAYER_1 ? 'Player 1' : 'Player 2';
  }

  static get_name() {
    return 'dakapo';
  }

  get_winner_color() {
    return this._engine.winner_is() === Dakapo.Player.PLAYER_1 ? 'Player 1' : 'Player 2';
  }

  process_move() {
  }
}

export default Manager;