"use strict";

import Paletto from '../../../openxum-core/games/paletto/index.mjs';
import AI from '../../../openxum-ai/generic/index.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';

export default {
  Gui: Gui,
  Manager: Manager,
  Settings: {
    ai: {
      mcts: AI.RandomPlayer
    },
    colors: {
      first: Paletto.Color.PLAYER_1,
      init: Paletto.Color.PLAYER_1,
      list: [
        {key: Paletto.Color.PLAYER_1, value: 'joueur 1'},
        {key: Paletto.Color.PLAYER_2, value: 'joueur 2'}
      ]
    },
    modes: {
      init: Paletto.GameType.STANDARD,
      list: [
        {key: Paletto.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Paletto.Color.PLAYER_1 ? Paletto.Color.PLAYER_2 : Paletto.Color.PLAYER_1;
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
