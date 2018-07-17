"use strict"

import Neutreeko from '../../../openxum-core/games/neutreeko/index.mjs';
import AI from '../../../openxum-ai/generic/index.mjs';
import Gui from './gui.mjs';
import Manager from './manager.mjs';

export default  {
  Gui: Gui,
  Manager: Manager,
  Settings: {
    ai: {
      mcts: AI.RandomPlayer // TODO: MCTSPlayer
    },
    colors: {
      first: Neutreeko.Color.BLACK,
      init: Neutreeko.Color.BLACK,
      list: [
        {key: Neutreeko.Color.BLACK, value: 'black'},
        {key: Neutreeko.Color.WHITE, value: 'white'}
      ]
    },
    modes: {
      init: Neutreeko.GameType.STANDARD,
      list: [
        {key: Neutreeko.GameType.STANDARD, value: 'standard'}
      ]
    },
    opponent_color(color) {
      return color === Neutreeko.Color.BLACK ? Neutreeko.Color.WHITE : Neutreeko.Color.BLACK;
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