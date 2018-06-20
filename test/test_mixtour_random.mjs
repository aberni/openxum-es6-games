import lib from '../lib/openxum-core/openxum';

//let moves = [];

let black_win = 0;
let white_win = 0;
for (let i = 0; i < 100; ++i) {
  let e = new lib.OpenXum.Mixtour.Engine(0);
  let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Mixtour.Color.WHITE, e);
  let p2 = new lib.OpenXum.Mixtour.Player(lib.OpenXum.Mixtour.Color.BLACK, e, 3);
  let p = p1;
  while (!e.is_finished()) {
    let move = p.move();

    /*if (move.constructor === Array) {
     for (let i = 0; i < move.length; ++i) {
     console.log(move[i].to_string());
     }
     } else {
     console.log(move.to_string());
     }*/

    //moves.push(move);
    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  if (e.winner_is() === lib.OpenXum.Mixtour.Color.BLACK) {
    black_win++;
    console.log("Winner is black");
  } else {
    if (e.winner_is() === lib.OpenXum.Mixtour.Color.WHITE) {
      white_win++;
      console.log("Winner is white");
    }
    else{
      console.log("No winner");
    }
  }
}

console.log("black wins: " + black_win);
console.log("white wins: " + white_win);

