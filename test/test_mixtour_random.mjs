import lib from '../lib/openxum-core/openxum';

let e = new lib.OpenXum.Mixtour.Engine(0);
let p1 = new lib.OpenXum.MCTSPlayer(lib.OpenXum.Mixtour.Color.WHITE, e);
let p2 = new lib.OpenXum.Mixtour.Player(lib.OpenXum.Mixtour.Color.BLACK, e);
let p = p1;
let moves = [];

//let black_win = 0;
//let white_win = 0;
//for (let i = 0; i < 10; ++i) {
  while (!e.is_finished()) {
    let move = p.move();

    if (move.constructor === Array) {
     for (let i = 0; i < move.length; ++i) {
     console.log(move[i].to_string());
     }
     } else {
     console.log(move.to_string());
     }

     moves.push(move);
    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  console.log("Winner is " + (e.winner_is() === lib.OpenXum.Mixtour.Color.BLACK ? "black" : "white"));
  /*if (e.winner_is() === lib.OpenXum.Mixtour.Color.BLACK) {
    black_win++;
  } else {
    white_win++;
  }
}

//console.log("black wins: " + black_win);
//console.log("white wins: " + white_win);*/
