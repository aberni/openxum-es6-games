"use strict";

import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';
import AI from '../../../openxum-ai/games/dakapo/index.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';

export default {
  Gui: Gui,
  Manager: Manager,
  Settings: {
    ai: {
      mcts: AI.MCTSPlayer
    },
    colors: {
      first: Dakapo.Player.PLAYER_1,
      init: Dakapo.Player.PLAYER_1,
      list: [
        {key: Dakapo.Player.PLAYER_1, value: 'joueur 1'},
        {key: Dakapo.Player.PLAYER_2, value: 'joueur 2'}
      ]
    },
    modes: {
      init: Dakapo.GameType.STANDARD,
      list: [
        {key: Dakapo.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Dakapo.Player.PLAYER_1 ? Dakapo.Player.PLAYER_2 : Dakapo.Player.PLAYER_1;
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
