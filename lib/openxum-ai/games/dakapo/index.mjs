"use strict";

let IADakapo = {};

import Player from './player.mjs';
import IA from './ia_dakapo_player.mjs';

IADakapo = Object.assign(IADakapo, Player);
IADakapo = Object.assign(IADakapo, IA);

export default {
  IADakapo: IADakapo
};