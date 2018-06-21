"use strict";

// namespace Ordo
import GameType from './game_type.mjs';
import Color from './color.mjs';
import State from './state.mjs';
import MoveType from './move_type.mjs';
import Engine from './engine.mjs';
import Move from './move.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import File from './file.mjs';
import Piece from './piece.mjs';


export default {
    Coordinates: Coordinates,
    Engine: Engine,
    GameType: GameType,
    Intersection: Intersection,
    Piece: Piece,
    State: State,
    Color: Color,
    Move: Move,
    MoveType: MoveType,
    File: File
};