"use strict";

// namespace Tintas
let Tintas = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Tintas = Object.assign(Tintas, Gui);
Tintas = Object.assign(Tintas, Manager);

export default Tintas;