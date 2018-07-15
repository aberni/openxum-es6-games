import AI from '../lib/openxum-ai/index.mjs';
import OpenXum from '../lib/openxum-core/index.mjs';

let win = [0, 0];
for (let i = 0; i < 10; ++i) {
  let e = new OpenXum.Invers.Engine(OpenXum.Invers.GameType.STANDARD, OpenXum.Invers.Color.RED);
  let p1 = new AI.Specific.Invers.MCTSPlayer(OpenXum.Invers.Color.RED, e);
  let p2 = new AI.Generic.RandomPlayer(OpenXum.Invers.Color.YELLOW, e);
  let p = p1;

  while (!e.is_finished()) {
    let move = p.move();

    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  ++win[e.winner_is()];
}

console.log("Random: " + win[OpenXum.Invers.Color.YELLOW] + " wins");
console.log("MCTS: " + win[OpenXum.Invers.Color.RED] + " wins");