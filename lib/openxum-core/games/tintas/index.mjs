"use strict";

// namespace Tintas
import Coordinates from './coordinates.mjs';
import Engine from './engine.mjs';
import Intersection from './intersections.mjs';
import Move from './move.mjs';
import GameType from './game_type.mjs';
import Color from './color.mjs';
import Player from './player.mjs';
import {convert_to_hexa,is_color} from './color.mjs';
// import ...

export default {
    Coordinates: Coordinates,
    Engine: Engine,
    Intersection: Intersection,
    Move: Move,
    GameType: GameType,
    Player: Player,
    Color: Color
}