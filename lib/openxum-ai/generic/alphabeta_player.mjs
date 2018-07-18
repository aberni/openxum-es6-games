"use strict";

import OpenXum from '../../openxum-core/openxum/index.mjs';

class AlphaBetaPlayer extends OpenXum.Player {
  constructor(color, opponent_color, engine, depth) {
    super(color, opponent_color, engine);

    if (this.evaluate === AlphaBetaPlayer.prototype.evaluate) {
      throw new TypeError("Please implement abstract method evaluate.");
    }

    this.MAX_DEPTH = depth;
    this._n_tests = 0;
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

  evaluate() {
    throw new TypeError("Do not call abstract method evaluate from child.");
  }

  move(move) {
    //return list[Math.floor(Math.random() * list.length)];
    this._n_tests = 0;
    let m = this._alphabetaMove();
    //console.log('best: ' + m.to_string());
    console.log(this._n_tests + " tests for AlphaBetaPlayer");
    return m;
  }

  reinit(e) {
    this._engine = e;
  }

  _alphabetaMove() {
    // Init
    let maxScore = -1001, score, tmpScore;

    //console.log('alphabetamove');
    //console.log('turn '+this._engine.current_color());
    let possible_moves = this._engine.get_possible_move_list();
    let best_moves = [];
    let child;

    for (let i = 0; i < possible_moves.length; i++) { // For each possible move
      // Simulate the move
      child = this._engine.clone();
      child.move(possible_moves[i]);

      // Evaluate move
      tmpScore = this._min(child, 0, -1001, 1001);
      score = Math.max(maxScore, tmpScore);
      //console.log(possible_moves[i].to_string() + ' score: ' + tmpScore);

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
    }

    // Return the best move
    /*
      console.log("best moves (score: "+score+"):");
      for(let i=0; i<best_moves.length; i++) {
          console.log("  - "+best_moves[i].to_string());
      }
      */
    let index = Math.floor(Math.random() * best_moves.length);
    return best_moves[index];
  }


  _min(father, depth, maxScore, minScore) {
    //console.log(child.getStateString());
    //console.log('min ' + depth + ' turn '+child.current_color());
    if (father.winner_is() === this.color()) { // IA won
      this._n_tests++;
      return (1000 - depth);
    }
    if(father.is_finished()) { // DRAW for IA
      this._n_tests++;
      return (this.MAX_DEPTH + 1 - depth);
    }
    if (depth === this.MAX_DEPTH) { // MAX_DEPTH reached
      this._n_tests++;
      return this.evaluate();
    }

    let possible_moves = father.get_possible_move_list();
    let child;

    for (let i = 0; i < possible_moves.length; i++) { // For each possible move
      child = father.clone();
      // Simulate the move
      //console.log('------------');
      //console.log(child.getStateString());
      //console.log('min: '+child.current_color()+' '+this.color()+' testing '+possible_moves[i].to_string()+' depth:'+depth);
      child.move(possible_moves[i]);

      // Evaluate move
      minScore = Math.min(minScore, this._max(child, depth + 1, maxScore, minScore));
      //console.log(possible_moves[i].to_string() + ' minscore: '+minScore);

      // Alpha - Beta pruning
      if (minScore <= maxScore || child.winner_is() === this.opponent_color()) {
        //console.log('------------');
        return minScore;
      }
    }
    //console.log('------------');
    return minScore;
  }

  _max(father, depth, maxScore, minScore) {
    //console.log(child.getStateString());
    //console.log('max ' + depth + ' turn '+child.current_color());
    if (father.winner_is() === this.opponent_color()) { // Opponent won
      this._n_tests++;
      return (-1000 + depth);
    }
    if(father.is_finished()) { // DRAW for opponent
      this._n_tests++;
      return (depth - this.MAX_DEPTH - 1);  // equals to -(this.MAX_DEPTH + 1 - depth)
    }
    if (depth === this.MAX_DEPTH) { // MAX_DEPTH reached
      this._n_tests++;
      return this.evaluate();
    }

    let possible_moves = father.get_possible_move_list();
    let child;

    for (let i = 0; i < possible_moves.length; i++) { // For each possible move
      child = father.clone();
      // Simulate the move
      //console.log('++++++++++++');
      //console.log(child.getStateString());
      //console.log('max: '+child.current_color()+' '+this.opponent_color()+' testing '+possible_moves[i].to_string()+' depth:'+depth);
      child.move(possible_moves[i]);

      // Evaluate move
      maxScore = Math.max(maxScore, this._min(child, depth + 1, maxScore, minScore));
      //console.log(possible_moves[i].to_string() + ' maxscore: '+maxScore);

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

export default AlphaBetaPlayer;