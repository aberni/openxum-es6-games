"use strict";

import AlphaBeta from '../../generic/alphabeta_player.mjs';

class AlphaBetaPlayer extends AlphaBeta {
  constructor(c, o, e) {
    super(c, o, e, 5);
  }
}

export default AlphaBetaPlayer;