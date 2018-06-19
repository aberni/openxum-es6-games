"use strict";

import OpenXum from '../../openxum/player.mjs';
import Color from './color.mjs';
import Move from './move.mjs';
import Coordinates from './coordinates.mjs';
const infinite_plus = 100;
const infinite_minus = -100;

class AlphaBetaValue {
    constructor(value, move) {
        this.value;
        this.move;
    }

}

class IANeutreeko extends OpenXum.Player {
    constructor(c, e) {
        super(c, e);
    }

    confirm() {
        return true;
    }

    is_ready() {
        return true;
    }

    is_remote() {
        return false;
    }

    move(move) {
        let list = this._engine.get_possible_move_list();
        //return list[Math.floor(Math.random() * list.length)];
        return this.alphabetaMove(this._engine, 3, infinite_minus, infinite_plus, true).move;
    }

    reinit(e) {
        this._engine = e;
    }

    alphabetaMove(node, depth, α, β, maximizingPlayer) {
        if(depth === 0 || node.is_finished()) {
            if(node.is_finished()) {
                console.error('The game is finished.. The IA can\'t play.');
            } else {
                // Nothing happened
                console.error('The IA can\'t play. First possible move returned if possible');
            }
            let list = node.get_possible_move_list();
            if(list.length > 0) {
               return list[0];
            } else {
               return new Move(new Coordinates(0,0), new Coordinates(0,0));
            }
        }
        if(maximizingPlayer) {
            let move_list = node.get_possible_move_list();
            let alphaBetaValue = new AlphaBetaValue(move_list[0], infinite_plus);
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                alphaBetaValue.move = move_list[i];
                alphaBetaValue.value = Math.max(alphaBetaValue.value, this.alphabeta(child, depth-1, α, β, false));
                α = Math.max(α, alphaBetaValue.value);
                if(β <= α) {
                    break; /* β cut-off */
                }
            }
            return alphaBetaValue;
        } else {
            let move_list = node.get_possible_move_list();
            let alphaBetaValue = new AlphaBetaValue(move_list[0], infinite_plus);
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                alphaBetaValue.move = move_list[i];
                alphaBetaValue.value = Math.min(alphaBetaValue.value, this.alphabeta(child, depth-1, α, β, true));
                β = Math.min(β, alphaBetaValue.value);
                if(β <= α) {
                    break; /* α cut-off */
                }
            }
            return alphaBetaValue;
        }
    }

    alphabeta(node, depth, α, β, maximizingPlayer) {
        if(depth === 0 || node.is_finished()) {
            if(node.is_finished()) {
                if(node._winner_color !== OpenXum.Neutreeko.Color.NONE) {
                    // There is a winner
                    return (node._winner_color === node.current_color()) ? 3 : 0;
                }
                // This is a draw
                return 2;
            } else {
                // Nothing happened
                return 1;
            }
        }
        if(maximizingPlayer) {
            let v = infinite_minus;
            let move_list = node.get_possible_move_list();
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.max(v, this.alphabeta(child, depth-1, α, β, false));
                α = Math.max(α, v);
                if(β <= α) {
                    break; /* β cut-off */
                }
            }
            return v;
        } else {
            let v = infinite_plus;
            let move_list = node.get_possible_move_list();
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.min(v, this.alphabeta(child, depth-1, α, β, true));
                β = Math.min(β, v);
                if(β <= α) {
                    break; /* α cut-off */
                }
            }
            return v;
        }
    }
}

export default {
    IANeutreeko: IANeutreeko
};