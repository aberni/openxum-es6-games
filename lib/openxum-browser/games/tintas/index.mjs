"use strict";

import Tintas from '../../../openxum-core/games/tintas/index.mjs';
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
      first: Tintas.Player.PLAYER_1,
      init: Tintas.Player.PLAYER_1,
      list: [
        {key: Tintas.Player.PLAYER_1, value: 'joueur 1'},
        {key: Tintas.Player.PLAYER_2, value: 'joueur 2'}
      ]
    },
    modes: {
      init: Tintas.GameType.STANDARD,
      list: [
        {key: Tintas.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Tintas.Player.PLAYER_1 ? Tintas.Player.PLAYER_2 : Tintas.Player.PLAYER_1;
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
