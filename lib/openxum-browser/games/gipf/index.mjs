"use strict";

import Gipf from '../../../openxum-core/games/gipf/index.mjs';
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
      first: Gipf.Color.BLACK,
      init: Gipf.Color.BLACK,
      list: [
        {key: Gipf.Color.BLACK, value: 'black'},
        {key: Gipf.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Gipf.GameType.BASIC,
      list: [
        {key: Gipf.GameType.BASIC, value: 'basic'},
        {key: Gipf.GameType.STANDARD, value: 'standard'},
        {key: Gipf.GameType.TOURNAMENT, value: 'tournament'}
      ]
    },
    opponent_color(color) {
      return color === Gipf.Color.BLACK ? Gipf.Color.WHITE : Gipf.Color.BLACK;
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