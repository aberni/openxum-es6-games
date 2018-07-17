"use strict";

import Dvonn from '../../../openxum-core/games/dvonn/index.mjs';
import AI from '../../../openxum-ai/generic/index.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';

export default {
  Gui: Gui,
  Manager: Manager,
  Settings: {
    ai: {
      mcts: AI.RandomPlayer // TODO: MCTSPlayer
    },
    colors: {
      first: Dvonn.Color.BLACK,
      init: Dvonn.Color.BLACK,
      list: [
        {key: Dvonn.Color.BLACK, value: 'black'},
        {key: Dvonn.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Dvonn.GameType.STANDARD,
      list: [
        {key: Dvonn.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Dvonn.Color.BLACK ? Dvonn.Color.WHITE : Dvonn.Color.BLACK;
    },
    types: {
      init: 'ai',
      list: [
        {key: 'gui', value: 'GUI'},
        {key: 'ai', value: 'AI'},
        {key: 'online', value: 'Online'},
        {key: 'offline', value: 'Offline'}
      ]
    }
  }
};