"use strict";

import OpenXum from '../../openxum/manager.mjs';
import Ordo from '../../../openxum-core/games/ordo/index.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    return new Ordo.Move();
  }

  get_current_color() {
    return this.engine().current_color() === Ordo.Color.WHITE ? 'White' : 'Black';
  }

  static get_name() {
    return 'ordo';
  }

  get_winner_color() {
    return this.engine().winner_is() === Ordo.Color.WHITE ? 'White' : 'Black';
  }

  process_move() {
  }
}

export default Manager;