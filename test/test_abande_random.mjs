import OpenXum from '../lib/openxum-core/index.mjs';
import AI from '../lib/openxum-ai/index.mjs';

let e = new OpenXum.Abande.Engine(0, OpenXum.Abande.Color.BLACK);
let p1 = new AI.Generic.RandomPlayer(OpenXum.Abande.Color.BLACK, e);
let p2 = new AI.Specific.Abande.MCTSPlayer(OpenXum.Abande.Color.WHITE, e);
//let p3 = new OpenXum.MinimaxPlayer(OpenXum.Abande.Color.WHITE, e);
let win = [];

win[OpenXum.Abande.Color.BLACK] = 0;
win[OpenXum.Abande.Color.WHITE] = 0;
win[OpenXum.Abande.Color.AVAILABLE] = 0;

for(let i=  0; i < 10; i++) {
  let p = p1;

  console.log(i+1);
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("Random :" + win[OpenXum.Abande.Color.BLACK] + " wins");
console.log("MCTS :" + win[OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);


for(let i=0;i<100;i++) {
  let p = p1;
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p1 ? p3 : p1;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("Random :" + win[OpenXum.Abande.Color.BLACK] + " wins");
console.log("MinMax :" + win[OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);

for(let i=0;i<100;i++) {
  let p = p2;
  while (!e.is_finished()) {
    let move = p.move();
    e.move(move);
    p = p === p2 ? p3 : p2;
  }
  win[e.winner_is()]++;
  e._reset();
}

console.log(win);
console.log("MCTS :" + win[OpenXum.Abande.Color.BLACK] + " wins");
console.log("MinMax :" + win[OpenXum.Abande.Color.WHITE] + " wins");
console.log("draw :" +win[OpenXum.Abande.Color.AVAILABLE] + " draw");
win.fill(0);
