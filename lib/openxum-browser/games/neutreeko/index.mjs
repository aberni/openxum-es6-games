// lib/openxum-browser/games/neutreeko/index.mjs
let Neutreeko = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Neutreeko = Object.assign(Neutreeko, Gui);
Neutreeko = Object.assign(Neutreeko, Manager);

export default Neutreeko;