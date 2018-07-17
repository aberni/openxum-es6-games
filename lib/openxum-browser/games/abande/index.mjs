"use strict";

import Abande from '../../../openxum-core/games/abande/index.mjs';
import AI from '../../../openxum-ai/games/abande/index.mjs';
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
      first: Abande.Color.BLACK,
      init: Abande.Color.BLACK,
      list: [
        {key: Abande.Color.BLACK, value: 'black'},
        {key: Abande.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Abande.GameType.STANDARD,
      list: [
        {key: Abande.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Abande.Color.BLACK ? Abande.Color.WHITE : Abande.Color.BLACK;
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
