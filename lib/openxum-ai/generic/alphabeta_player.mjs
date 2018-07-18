"use strict";

import OpenXum from '../../openxum-core/openxum/index.mjs';

class AlphaBetaPlayer extends OpenXum.Player {
  constructor(color, opponent_color, engine, depth) {
    super(color, opponent_color, engine);
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

  move(move) {
    //return list[Math.floor(Math.random() * list.length)];
    this._n_tests = 0;
    let m = this.alphabetaMove();
    //console.log('best: ' + m.to_string());
    console.log(this._n_tests + " tests for AlphaBetaPlayer");
    return m;
  }

  reinit(e) {
    this._engine = e;
  }

  alphabetaMove() {
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
      tmpScore = this.min(child, 0, -1001, 1001);
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


  min(father, depth, maxScore, minScore) {
    //console.log(child.getStateString());
    //console.log('min ' + depth + ' turn '+child.current_color());
    if (father.winner_is() === this.color()) { // IA win
      this._n_tests++;
      return (1000 - depth);
    }
    if (depth === this.MAX_DEPTH || father.is_finished()) { // MAX_DEPTH reached or DRAW
      this._n_tests++;
      return 0;
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
      minScore = Math.min(minScore, this.max(child, depth + 1, maxScore, minScore));
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

  max(father, depth, maxScore, minScore) {
    //console.log(child.getStateString());
    //console.log('max ' + depth + ' turn '+child.current_color());
    if (father.winner_is() === this.opponent_color()) { // IA loose
      this._n_tests++;
      return (-1000 + depth);
    }
    if (depth === this.MAX_DEPTH ||  father.is_finished()) { // MAX_DEPTH reached or DRAW
      this._n_tests++;
      return 0;
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
      maxScore = Math.max(maxScore, this.min(child, depth + 1, maxScore, minScore));
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