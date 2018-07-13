"use strict";

import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, e) {
    super(c, e, 1000000);
  }
}

export default MCTSPlayer;