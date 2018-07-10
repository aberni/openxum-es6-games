"use strict";

// namespace Ordo
let Ordo = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Ordo = Object.assign(Ordo, Gui);
Ordo = Object.assign(Ordo, Manager);

export default Ordo;