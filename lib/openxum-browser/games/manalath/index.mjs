"use strict";

// namespace Manalath
let Manalath = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Manalath = Object.assign(Manalath, Gui);
Manalath = Object.assign(Manalath, Manager);

export default Manalath;