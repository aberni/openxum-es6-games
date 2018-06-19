// lib/openxum-core/games/neutreeko/index.mjs
"use strict";
import Coordinates from './coordinates.mjs';
import Engine from './engine.mjs';
import GameType from './game_type.mjs';
import Color from './color.mjs';
import Move from './move.mjs';
import IA from './ia_neutreeko.mjs';
import AlphaBetaMove from './alphabeta_move.mjs';

export default {
    Coordinates: Coordinates,
    Engine: Engine,
    GameType: GameType,
    Color: Color,
    Move: Move,
    AlphaBetaMove: AlphaBetaMove,
    IA: IA
}