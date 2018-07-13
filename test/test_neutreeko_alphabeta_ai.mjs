import AI from '../lib/openxum-ai/index.mjs';
import OpenXum from '../lib/openxum-core/index.mjs';

let black_win = 0;
let white_win = 0;
let black = OpenXum.Neutreeko.Color.BLACK;
let white = OpenXum.Neutreeko.Color.WHITE;
let e;
let p1;
let p2;

function getNameOfAI(player) {
  if(player === undefined) {
    return "undefined";
  }
  if(player instanceof AI.Specific.Neutreeko.MCTSPlayer) {
    return "MCTS";
  }
  if(player instanceof AI.Specific.Neutreeko.AlphaBetaAI) {
    return "AlphaBetaAI";
  }
  return "Other";
}

for (let i = 0; i < 2; ++i) {
  e = new OpenXum.Neutreeko.Engine(OpenXum.Neutreeko.GameType.STANDARD, black);
  p1 = new AI.Specific.Neutreeko.MCTSPlayer(black, e);
  p2 = new AI.Specific.Neutreeko.AlphaBetaAI(white, e);

  let p = p1;
  while (!e.is_finished()) {
    let startTime = new Date();
    let move = p.move();

    let endTime = new Date();
    console.log((endTime - startTime)/1000 + " seconds to get move");

    e.move(move);
    p = p === p1 ? p2 : p1;
  }

  if(e.winner_is() === black) {
    console.log("Winner is Black ("+getNameOfAI(p1)+")");
    black_win++;
  } else {
    console.log("Winner is White ("+getNameOfAI(p2)+")");
    white_win++;
  }
}

console.log(getNameOfAI(p1) + ": " + black_win + " wins");
console.log(getNameOfAI(p2) + ": " + white_win + " wins");