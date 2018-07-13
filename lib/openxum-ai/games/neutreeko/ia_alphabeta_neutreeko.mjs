"use strict";

import OpenXum from '../../../openxum-core/openxum/index.mjs';

class IAAlphaBeta extends OpenXum.Player {
    constructor(c, e) {
        super(c, e);
        this.MAX_DEPTH = 7;
        this._opponent_color = (e.first_color() === c) ? e.opponent_color() : e.first_color();
        this._n_tests = 0;
    }

    opponent_color() {
        return this._opponent_color;
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
        //return list[Math.floor(Math.random() * list.length)];
        let m = this.alphabetaMove();
        console.log('best: ' + m.formatted_string());
        console.log('n_tests = ' + this._n_tests);
        return m;
    }

    reinit(e) {
        this._engine = e;
    }

    alphabetaMove() {
        // Init
        let maxScore = -1001, score, tmpScore;

        let child = this._engine.clone();
        //console.log('alphabetamove');
        //console.log('turn '+child.current_color());
        let possible_moves = child.get_possible_move_list();
        let best_moves = [];

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            child.move(possible_moves[i]);

            // Evaluate move
            tmpScore = this.min(child, 0, -1001, 1001);
            score = Math.max(maxScore, tmpScore);
            console.log(possible_moves[i].formatted_string() + ' score: ' + tmpScore);

            // Update best_move
            if (score === 1000) {
                return possible_moves[i];
            }
            if (score > maxScore) {
                maxScore = score;
                while(best_moves.length>0) {
                    best_moves.pop();
                }
                best_moves.push(possible_moves[i]);
            } else if( tmpScore === maxScore ) {
                best_moves.push(possible_moves[i]);
            }

            // Undo move
            //console.log('alphabetaMove undoing move for '+this.color());
            child.undo_move(possible_moves[i]);
            //console.log('done');
        }

        // Return the best move
        console.log("best moves (score: "+score+"):");
        for(let i=0; i<best_moves.length; i++) {
            console.log("  - "+best_moves[i].formatted_string());
        }
        let index = Math.floor(Math.random() * best_moves.length);
        return best_moves[index];
    }


    min(child, depth, maxScore, minScore) {
        //console.log(child.getStateString());
        //console.log('min ' + depth + ' turn '+child.current_color());
        if (child.winner_is() === this.color()) { // IA win
            this._n_tests++;
            return (1000 - depth);
        }
        if (depth === this.MAX_DEPTH || child.is_finished()) { // MAX_DEPTH reached
            this._n_tests++;
            return 0;
        }

        let possible_moves = child.get_possible_move_list();

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            //console.log('------------');
            //console.log(child.getStateString());
            //console.log('min: '+child.current_color()+' '+this.color()+' testing '+possible_moves[i].formatted_string()+' depth:'+depth);
            child.move(possible_moves[i]);

            // Evaluate move
            minScore = Math.min(minScore, this.max(child, depth + 1, maxScore, minScore));
            //console.log(possible_moves[i].formatted_string() + ' minscore: '+minScore);

            // Undo move
            //console.log('min: undoing move for '+this.opponent_color());
            child.undo_move(possible_moves[i]);
            //console.log('min: done');

            // Alpha - Beta pruning
            if (minScore <= maxScore || child.winner_is() === this.opponent_color()) {
                //console.log('------------');
                return minScore;
            }
        }
        //console.log('------------');
        return minScore;
    }

    max(child, depth, maxScore, minScore) {
        //console.log(child.getStateString());
        //console.log('max ' + depth + ' turn '+child.current_color());
        if (child.winner_is() === this.opponent_color()) { // IA loose
            this._n_tests++;
            return (-1000 + depth);
        }
        if (depth === this.MAX_DEPTH || child.is_finished()) { // MAX_DEPTH reached
            this._n_tests++;
            return 0;
        }

        let possible_moves = child.get_possible_move_list();

        for (let i = 0; i < possible_moves.length; i++) { // For each possible move
            // Simulate the move
            //console.log('++++++++++++');
            //console.log(child.getStateString());
            //console.log('max: '+child.current_color()+' '+this.opponent_color()+' testing '+possible_moves[i].formatted_string()+' depth:'+depth);
            child.move(possible_moves[i]);

            // Evaluate move
            maxScore = Math.max(maxScore, this.min(child, depth + 1, maxScore, minScore));
            //console.log(possible_moves[i].formatted_string() + ' maxscore: '+maxScore);

            // Undo move
            //console.log('max: undoing move for '+this.color());
            child.undo_move(possible_moves[i]);
            //console.log('max: done');

            // Alpha - Beta pruning
            if (maxScore >= minScore || child.winner_is() === this.color()) {
                //console.log('++++++++++++');
                return maxScore;
            }
        }
        //console.log('++++++++++++');
        return maxScore;
    }

}

export default IAAlphaBeta;