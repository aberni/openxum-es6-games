import AI from '../lib/openxum-ai/index.mjs';
import OpenXum from '../lib/openxum-core/index.mjs';

let win = { 'Joueur 1': 0, 'Joueur 2': 0 };
for (let i = 0; i < 10; ++i) {
  let e = new OpenXum.Dakapo.Engine(0, 0);
  let p1 = new AI.Specific.Dakapo.MCTSPlayer('Joueur 1', e);
  let p2 = new AI.Generic.RandomPlayer('Joueur 2', e);
  let p = p1;

  while (!e.is_finished()) {
    let move = p.move();

    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  ++win[e.winner_is()];
}

console.log("Random: " + win['Joueur 2'] + " wins");
console.log("MCTS: " + win['Joueur 1'] + " wins");