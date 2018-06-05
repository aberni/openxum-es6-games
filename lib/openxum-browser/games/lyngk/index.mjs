"use strict";

// namespace Lyngk
let Lyngk = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';
import GamePage from './game_page.mjs';

Lyngk = Object.assign(Lyngk, Gui);
Lyngk = Object.assign(Lyngk, Manager);
Lyngk = Object.assign(Lyngk, GamePage);

export default Lyngk;