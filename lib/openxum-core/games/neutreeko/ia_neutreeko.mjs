"use strict";

import OpenXum from '../../openxum/player.mjs';
import Color from './color.mjs';
import AlphaBetaMove from './alphabeta_move.mjs';

class IANeutreeko extends OpenXum.Player {
    constructor(c, e) {
        super(c, e);
        this.POSITIVE_INFINITY = 1000;
        this.NEGATIVE_INFINITY = -1000;
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
        let m = this.alphabetaMove(this._engine, 6, this.NEGATIVE_INFINITY, this.POSITIVE_INFINITY, true);
        //console.log('Best move: '+m.to_string());
        return m;
    }

    reinit(e) {
        this._engine = e;
    }

    alphabetaMove(node, depth, α, β, maximizingPlayer) {
        if(depth === 0 || node.is_finished()) {
            if( node.is_finished() ) {
                console.error('IA cant play if the game is finished');
            } else {
                let move_list = node.get_possible_move_list();
                let move;
                let bestEfficiency = this.NEGATIVE_INFINITY;
                for(let i=0; i<move_list.length; i++) {
                    let child = node.clone();
                    child.move(move_list[i]);
                    if(this.getEfficiency(child, depth) > bestEfficiency) {
                        move = move_list[i];
                    }
                }
                return move;
            }
        }
        if(maximizingPlayer) {
            let move_list = node.get_possible_move_list();
            let v = this.NEGATIVE_INFINITY;
            let move = move_list[0];
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.max(v, this.alphabeta(child, depth-1, α, β, false));
                if(v > α) {
                    move = move_list[i];
                }
                α = Math.max(α, v);
                if(β <= α) {
                    break; // β cut-off
                }
            }
            return move;
        } else {
            let move_list = node.get_possible_move_list();
            let v = this.POSITIVE_INFINITY;
            let move = move_list[0];
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.min(v, this.alphabeta(child, depth-1, α, β, true));
                if(v < β) {
                    move = move_list[i];
                }
                β = Math.min(β, v);
                if(β <= α) {
                    break; // α cut-off
                }
            }
            return v;
        }
    }

    getEfficiency(node, depth) {
        if(node.is_finished()) {
            if(node._winner_color !== Color.NONE) {
                // There is a winner
                return (node._winner_color === node.current_color()) ? 3*(depth+1) : 0;
            }
            // This is a draw
            return 2*(depth+1);
        } else {
            // Nothing happened
            return 1;
        }
    }


    alphabeta(node, depth, α, β, maximizingPlayer) {
        if(depth === 0 || node.is_finished()) {
            return this.getEfficiency(node, depth);
        }
        let move_list = node.get_possible_move_list();
        if(maximizingPlayer) {
            let v = this.NEGATIVE_INFINITY;
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.max(v, this.alphabeta(child, depth-1, α, β, false));
                α = Math.max(α, v);
                if(β <= α) {
                    break; // β cut-off
                }
            }
            return v;
        } else {
            let v = this.POSITIVE_INFINITY;
            for(let i=0; i<move_list.length; i++) {
                let child = node.clone();
                child.move(move_list[i]);
                v = Math.min(v, this.alphabeta(child, depth-1, α, β, true));
                β = Math.min(β, v);
                if(β <= α) {
                    break; // α cut-off
                }
            }
            return v;
        }
    }
}

export default {
    IANeutreeko: IANeutreeko
};

/*
 if(depth === 0 || node.is_finished()) {
 if(node.is_finished()) {
 console.error('The game is finished.. The IA can\'t play.');
 } else {
 let move_list = node.get_possible_move_list();
 let alphaBetaValue = new AlphaBetaValue(move_list[0],this.POSITIVE_INFINITY);
 for(let i=0; i<move_list.length; i++) {
 let child = node.clone();
 child.move(move_list[i]);
 this.alphabeta(child, depth-1, α, β, true);
 }
 return alphaBetaValue;
 }
 }
 if(maximizingPlayer) {
 let move_list = node.get_possible_move_list();
 let alphaBetaValue = new AlphaBetaValue(move_list[0],this.POSITIVE_INFINITY);
 for(let i=0; i<move_list.length; i++) {
 let child = node.clone();
 child.move(move_list[i]);
 alphaBetaValue.move = move_list[i];
 alphaBetaValue.value = Math.max(alphaBetaValue.value, this.alphabeta(child, depth-1, α, β, false));
 α = Math.max(α, alphaBetaValue.value);
 if(β <= α) {
 break; // β cut-off
}
}
return alphaBetaValue;
} else {
    let move_list = node.get_possible_move_list();
    let alphaBetaValue = new AlphaBetaValue(move_list[0],this.NEGATIVE_INFINITY);
    for(let i=0; i<move_list.length; i++) {
        let child = node.clone();
        child.move(move_list[i]);
        alphaBetaValue.move = move_list[i];
        alphaBetaValue.value = Math.min(alphaBetaValue.value, this.alphabeta(child, depth-1, α, β, true));
        β = Math.min(β, alphaBetaValue.value);
        if(β <= α) {
            break; //α cut-off
        }
    }
    return alphaBetaValue;
}

*/