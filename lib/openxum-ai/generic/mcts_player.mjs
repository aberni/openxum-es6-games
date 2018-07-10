"use strict";

import OpenXum from '../../openxum-core/openxum/player.mjs';
import MCTS from './mcts/player.mjs';

class MCTSPlayer extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
    this._level = 10000;
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
    return (new MCTS.Player(this._color, this._engine, 10000)).move();
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  MCTSPlayer: MCTSPlayer
};