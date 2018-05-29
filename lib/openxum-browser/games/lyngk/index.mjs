"use strict";

// namespace Invers
let Lyngk = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Lyngk = Object.assign(Lyngk, Gui);
Lyngk = Object.assign(Lyngk, Manager);

export default Lyngk;