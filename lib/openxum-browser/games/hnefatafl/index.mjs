"use strict";

import Hnefatafl from '../../../openxum-core/games/hnefatafl/index.mjs';
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
      first: Hnefatafl.Color.BLACK,
      init: Hnefatafl.Color.BLACK,
      list: [
        {key: Hnefatafl.Color.BLACK, value: 'black'},
        {key: Hnefatafl.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Hnefatafl.GameType.STANDARD,
      list: [
        {key: Hnefatafl.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Hnefatafl.Color.BLACK ? Hnefatafl.Color.WHITE : Hnefatafl.Color.BLACK;
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