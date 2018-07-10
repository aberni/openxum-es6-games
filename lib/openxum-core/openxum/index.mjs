"use strict";

// namespace OpenXum
let OpenXum = {};

import Engine from './engine.mjs';
import Player from './player.mjs';

OpenXum = Object.assign(OpenXum, Engine);
OpenXum = Object.assign(OpenXum, Player);

import Games from '../games/index.mjs';

OpenXum = Object.assign(OpenXum, Games);

export default {
  OpenXum: OpenXum
};