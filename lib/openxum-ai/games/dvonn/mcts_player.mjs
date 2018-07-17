"use strict";

import OpenXum from '../../../openxum-core/games/dvonn/index.mjs';
import MCTS from '../../generic/mcts_player.mjs';

class MCTSPlayer extends MCTS {
  constructor(c, o, e) {
    super(c, o, e, 100);
  }
}

export default MCTSPlayer;