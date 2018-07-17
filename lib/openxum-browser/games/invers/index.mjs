"use strict";

import Invers from '../../../openxum-core/games/invers/index.mjs';
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
      first: Invers.Color.RED,
      init: Invers.Color.RED,
      list: [
        {key: Invers.Color.RED, value: 'red'},
        {key: Invers.Color.YELLOW, value: 'yellow'}
      ]
    },
    modes: {
      init: Invers.GameType.STANDARD,
      list: [
        {key: Invers.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Invers.Color.RED ? Invers.Color.YELLOW : Invers.Color.RED;
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