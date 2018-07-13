"use strict";

import OpenXum from '../../openxum-core/openxum/index.mjs';
import MCTS from './mcts/player.mjs';

class MCTSPlayer extends OpenXum.Player {
  constructor(c, e, l) {
    super(c, e);
    this._level = 4000000;
  }

// public methods
  confirm() {
    return false;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    return (new MCTS.Player(this._color, this._engine, 4000000)).move();
  }

  reinit(e) {
    this._engine = e;
  }
}

export default MCTSPlayer;