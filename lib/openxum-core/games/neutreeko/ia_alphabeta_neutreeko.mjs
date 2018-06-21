"use strict";

import OpenXum from '../../openxum/player.mjs';
import Color from './color.mjs';

class IAAlphaBeta extends OpenXum.Player {
    constructor(c, e) {
        super(c, e);
        this.MAX_DEPTH = 8;
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
        let m = this.alphabetaMove();
        console.log('best: '+m.to_string());
        return m;
    }

    reinit(e) {
        this._engine = e;
    }

    alphabetaMove() {
        // Init
        let maxScore = -1001, score;

        let possible_moves = this._engine.get_possible_move_list();
        let best_move = possible_moves[0];

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            this._engine.move(possible_moves[i]);

            // Evaluate move
            score = Math.max(maxScore, this.min(0, -1001, 1001));
            console.log(possible_moves[i].to_string() + ' score: '+score);

            // Update best_move
            if (score > maxScore) {
                maxScore = score;
                best_move = possible_moves[i];
            }

            // Undo move
            this._engine.undo_move(this.color(), possible_moves[i]);
        }

        // Return the best move
        return best_move;
    }


    min(depth, maxScore, minScore) {
        if (this._engine.winner_is() === this.color()) { // IA win
            return (1000 - depth);
        }
        if (depth === this.MAX_DEPTH) { // MAX_DEPTH reached
            return 0;
        }

        let possible_moves = this._engine.get_possible_move_list();

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            this._engine.move(possible_moves[i]);

            // Evaluate move
            minScore = Math.min(minScore, this.max(depth + 1, maxScore, minScore));

            // Undo move
            this._engine.undo_move(this.color(), possible_moves[i]);

            // Alpha - Beta pruning
            if (minScore <= maxScore) {
                return minScore;
            }
        }
        return minScore;
    }

    max(depth, maxScore, minScore) {
        let winner_color = this._engine.winner_is();
        if (winner_color !== this.color() && winner_color !== Color.NONE) { // IA loose
            return (-1000 + depth);
        }
        if (depth === this.MAX_DEPTH) { // MAX_DEPTH reached
            return 0;
        }

        let possible_moves = this._engine.get_possible_move_list();

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            this._engine.move(possible_moves[i]);

            // Evaluate move
            minScore = Math.max(maxScore, this.min(depth + 1, maxScore, minScore));

            // Undo move
            this._engine.undo_move(this.color(), possible_moves[i]);

            // Alpha - Beta pruning
            if (maxScore >= minScore) {
                return maxScore;
            }
        }
        return maxScore;
    }

}

export default {
    IAAlphaBeta: IAAlphaBeta
};