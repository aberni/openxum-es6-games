"use strict";

class EfficientMove {
  constructor(move, efficiency, depth) {
    this._move = move;
    this._efficiency = efficiency;
    this._depth = depth;
  }

  set_efficiency(efficiency) {
    this._efficiency = efficiency;
  }

  set_move(move) {
    this._move = move;
  }

  set_depth(depth) {
    this._depth = depth;
  }

  move() {
    return this._move;
  }

  efficiency() {
    return this._efficiency;
  }

  depth() {
    return this._depth;
  }

  to_string() {
    return this._move.to_string() + ' efficiency: ' + this.efficiency() + ' depth: ' + this.depth();
  }
}

export default EfficientMove;