"use strict";

import OpenXum from '../../../openxum-core/games/dakapo/index.mjs';
import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, e) {
    super(c, e, 10000);
  }
}

export default MCTSPlayer;