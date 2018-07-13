"use strict";

import OpenXum from '../../../openxum-core/games/abande/index.mjs';
import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, e) {
    super(c, e, 100);
  }
}

export default MCTSPlayer;