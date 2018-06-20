"use strict";

import OpenXum from '../../openxum/player.mjs';
import Color from './color.mjs';
import EfficientMove from './efficient_move.mjs';

class IANeutreeko extends OpenXum.Player {
    constructor(c, e) {
        super(c, e);
        this.POSITIVE_INFINITY = 1000;
        this.NEGATIVE_INFINITY = -1000;
        this.WIN_EFFICIENCY = 3;
        this.DRAW_EFFICIENCY = 2;
        this.DEFAULT_EFFICIENCY = 1;
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
        let m = this.chooseMove(this._engine, 6, this.NEGATIVE_INFINITY, this.POSITIVE_INFINITY);
        return m;
    }

    reinit(e) {
        this._engine = e;
    }

    chooseMove(node, depth, α, β) {
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
        let winningMove = this.getMoveToWin(node, depth, α, β);
        let avoidingLosingMove = this.getMoveToAvoidLosing(node, depth, α, β);
        console.log('winning: '+winningMove.to_string());
        console.log('avoiding: '+avoidingLosingMove.to_string());
        console.log(winningMove.efficiency() + ' vs ' + (depth * this.WIN_EFFICIENCY - avoidingLosingMove.efficiency()));
        if(winningMove.efficiency() > depth * this.WIN_EFFICIENCY - avoidingLosingMove.efficiency()) {
            console.log('best: winning');
            return winningMove.move();
        }
        console.log('best: avoiding');
        return avoidingLosingMove.move();
    }

    getMoveToWin(node, depth, α, β) {
        let move_list = node.get_possible_move_list();
        let v = this.NEGATIVE_INFINITY;
        let move = move_list[0];
        for(let i=0; i<move_list.length; i++) {
            let child = node.clone();
            child.move(move_list[i]);
            v = Math.max(v, this.alphabeta(child, depth-1, α, β, false));
            console.log('test winning: '+move_list[i].to_string()+' efficiency: ' + v);
            if(v > α) {
                move = move_list[i];
            }
            α = Math.max(α, v);
            if(β <= α) {
                break; // β cut-off
            }
        }
        return new EfficientMove(move, v, depth);
    }

    getMoveToAvoidLosing(node, depth, α, β) {
        let move_list = node.get_possible_move_list();
        let v = this.POSITIVE_INFINITY;
        let move = move_list[0];
        for(let i=0; i<move_list.length; i++) {
            let child = node.clone();
            child.move(move_list[i]);
            v = Math.min(v, this.alphabeta(child, depth-1, α, β, true));
            console.log('test avoiding: '+move_list[i].to_string()+' efficiency: ' + v);
            if(v < β) {
                move = move_list[i];
            }
            β = Math.min(β, v);
            if(β <= α) {
                break; // α cut-off
            }
        }
        return new EfficientMove(move, v, depth);
    }

    getEfficiency(node, depth) {
        if(node.is_finished()) {
            if(node._winner_color !== Color.NONE) {
                // There is a winner
                if(node._winner_color === node.current_color()) {
                    return this.WIN_EFFICIENCY*(depth+1);
                }
                else {
                    console.error('impossible case');
                    return 0;
                }
            }
            // This is a draw
            return this.DRAW_EFFICIENCY;
        } else {
            // Nothing happened
            return this.DEFAULT_EFFICIENCY;
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