"use strict";

import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';
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
      first: Lyngk.Player.PLAYER_1,
      init: Lyngk.Player.PLAYER_1,
      list: [
        {key: Lyngk.Player.PLAYER_1, value: 'joueur 1'},
        {key: Lyngk.Player.PLAYER_2, value: 'joueur 2'}
      ]
    },
    modes: {
      init: Lyngk.GameType.STANDARD,
      list: [
        {key: Lyngk.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Lyngk.Player.PLAYER_1 ? Lyngk.Player.PLAYER_2 : Lyngk.Player.PLAYER_1;
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