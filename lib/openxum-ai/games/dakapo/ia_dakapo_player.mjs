"use strict";

import OpenXum from '../../../openxum-core/openxum/player.mjs';
import Player from './player.mjs';

class IADakapoPlayer extends OpenXum.Player {
  constructor(c, o, e, d) {
    super(c, o, e);

    this._depth = d;
  }

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
    return (new Player(this._color, this._engine, this._depth)).move();
  }

  reinit(e) {
    this._engine = e;
  }

}

export default IADakapoPlayer;