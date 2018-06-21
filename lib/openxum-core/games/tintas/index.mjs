"use strict";

// namespace Tintas
import Coordinates from './coordinates.mjs';
import Engine from './engine.mjs';
import Move from './move.mjs';
import GameType from './game_type.mjs';
import Color from './color.mjs';
import Player from './player.mjs';
import Board from './board.mjs';
import Cell from './cell.mjs';
import {convert_to_hexa,is_color} from './color.mjs';
import IaTintas from './ia/index.mjs';
// import ...

export default {
    Coordinates: Coordinates,
    Engine: Engine,
    Move: Move,
    GameType: GameType,
    Player: Player,
    Color: Color,
    Board: Board,
    Cell: Cell,
    IaTintas:IaTintas
};