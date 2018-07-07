"use strict";

// namespace Mixtour
let Mixtour = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Mixtour = Object.assign(Mixtour, Gui);
Mixtour = Object.assign(Mixtour, Manager);

export default Mixtour;