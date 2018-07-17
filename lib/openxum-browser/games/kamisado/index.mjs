"use strict";

import Kamisado from '../../../openxum-core/games/kamisado/index.mjs';
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
      first: Kamisado.Color.BLACK,
      init: Kamisado.Color.BLACK,
      list: [
        {key: Kamisado.Color.BLACK, value: 'black'},
        {key: Kamisado.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Kamisado.GameType.STANDARD,
      list: [
        {key: Kamisado.GameType.SIMPLE, value: 'simple'},
        {key: Kamisado.GameType.STANDARD, value: 'standard'},
        {key: Kamisado.GameType.LONG, value: 'long'},
        {key: Kamisado.GameType.MARATHON, value: 'marathon'}
      ]
    },
    opponent_color(color) {
      return color === Kamisado.Color.BLACK ? Kamisado.Color.WHITE : Kamisado.Color.BLACK;
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