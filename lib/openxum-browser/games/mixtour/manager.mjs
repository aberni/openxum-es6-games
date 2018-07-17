"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Mixtour from '../../../openxum-core/games/mixtour/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Mixtour.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Mixtour.Color.WHITE ? 'White' : 'Black';
  }

  static get_name() {
    return 'mixtour';
  }

  get_winner_color() {
    if (this.engine().winner_is() === Mixtour.Color.WHITE) {
      return 'White';
    } else if (this.engine().winner_is() === Mixtour.Color.BLACK) {
      return 'Black';
    }
    return 'Nobody';
  }

  process_move() {
  }
}

export default Manager;