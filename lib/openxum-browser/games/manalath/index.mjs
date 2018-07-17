"use strict";

import Manalath from '../../../openxum-core/games/manalath/index.mjs';
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
      first: Manalath.Color.BLACK,
      init: Manalath.Color.BLACK,
      list: [
        {key: Manalath.Color.BLACK, value: 'black'},
        {key: Manalath.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Manalath.GameType.STANDARD,
      list: [
        {key: Manalath.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Manalath.Color.BLACK ? Manalath.Color.WHITE : Manalath.Color.BLACK;
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