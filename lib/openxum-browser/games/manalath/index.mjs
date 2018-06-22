"use strict";

// namespace Manalath
let Manalath = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';
import GamePage from './game_page.mjs';

Manalath = Object.assign(Manalath, GamePage);
Manalath = Object.assign(Manalath, Gui);
Manalath = Object.assign(Manalath, Manager);

export default Manalath;