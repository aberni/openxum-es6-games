// lib/openxum-browser/games/ordo/index.mjs
let Ordo = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Ordo = Object.assign(Ordo, Gui);
Ordo = Object.assign(Ordo, Manager);

export default Ordo;