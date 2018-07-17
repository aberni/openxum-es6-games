"use strict";

import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, o, e) {
    super(c, o, e, 5000000);
  }
}

export default MCTSPlayer;