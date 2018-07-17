"use strict";

import OpenXum from '../../../openxum-core/games/dvonn/index.mjs';
import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, e) {
    super(c, e, 100);
  }
}

export default MCTSPlayer;