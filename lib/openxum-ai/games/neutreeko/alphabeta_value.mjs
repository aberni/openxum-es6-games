"use strict";

class AlphaBetaValue {
  constructor(α, β) {
    this._α = α;
    this._β = β;
  }

  set_α(α) {
    this._α = α;
  }

  set_β(β) {
    this._β = β;
  }

  α() {
    return this._α;
  }

  β() {
    return this._β;
  }

  to_string() {
    return 'α:' + this.α() + ' β:' + this.β() + ' diff:' + (this.α() + this.β());
  }
}

export default AlphaBetaValue;