"use strict";

import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, e) {
    super(c, e, 4000000);
  }
}

export default MCTSPlayer;