import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Piece from './piece.mjs';
import Plaer from './player.mjs';
import State from './state.mjs';


class Engine extends OpenXum.Engine {
    constructor(type, currentPlayer){
      super();
      this._type = type;
      this._currentPlayer = currentPlayer;
      this._intersections = [];
    }

    apply_moves(moves) {
        
    }

    clone() {
        
    }

    current_color() {
        
    }

    get_name() {
        
    }

    get_possible_move_list() {
        
    }

    is_finished() {
        
    }

    move(move) {
        
    }

    parse(str) {
        
    }

    to_string() {
        
    }

    winner_is() {
        
    }
}

export default Engine;