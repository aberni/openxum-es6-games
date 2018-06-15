"use strict";

let Dakapo = {};

import Gui from './gui.mjs';
import Manager from './manager.mjs';

Dakapo = Object.assign(Dakapo, Gui);
Dakapo = Object.assign(Dakapo, Manager);

export default Dakapo;