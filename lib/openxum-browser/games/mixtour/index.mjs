"use strict";

import Mixtour from '../../../openxum-core/games/mixtour/index.mjs';
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
      first: Mixtour.Color.BLACK,
      init: Mixtour.Color.BLACK,
      list: [
        {key: Mixtour.Color.BLACK, value: 'black'},
        {key: Mixtour.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Mixtour.GameType.STANDARD,
      list: [
        {key: Mixtour.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Mixtour.Color.BLACK ? Mixtour.Color.WHITE : Mixtour.Color.BLACK;
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