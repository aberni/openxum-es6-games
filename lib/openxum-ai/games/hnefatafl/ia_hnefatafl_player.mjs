"use strict";

import OpenXum from '../../../openxum-core/openxum/player.mjs';
import IAHnefatafl from './player.mjs';

class IAHnefataflPlayer extends OpenXum.Player {
  constructor(c, o, e) {
    super(c, o, e);
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
    return (new IAHnefatafl.Player(this._color, this._engine, 3)).ia_play();
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  IAHnefataflPlayer: IAHnefataflPlayer
};