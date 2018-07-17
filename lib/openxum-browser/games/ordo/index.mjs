"use strict";

import Ordo from '../../../openxum-core/games/ordo/index.mjs';
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
      first: Ordo.Color.BLACK,
      init: Ordo.Color.BLACK,
      list: [
        {key: Ordo.Color.BLACK, value: 'black'},
        {key: Ordo.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Ordo.GameType.STANDARD,
      list: [
        {key: Ordo.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Ordo.Color.BLACK ? Ordo.Color.WHITE : Ordo.Color.BLACK;
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