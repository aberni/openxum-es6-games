import lib from '../lib/openxum-core/openxum';


let victoire = 0;

for (let i = 0; i < 20; i += 1) {
  let e = new lib.OpenXum.Tintas.Engine(lib.OpenXum.Tintas.GameType.STANDARD, lib.OpenXum.Tintas.Color.PLAYER_1);
  let p1 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Tintas.Color.PLAYER_1, e);
  let p2 = new lib.OpenXum.Tintas.IaTintas.Alpha_beta_player(lib.OpenXum.Tintas.Color.PLAYER_2, e);
  //let p2 = new lib.OpenXum.RandomPlayer(lib.OpenXum.Tintas.Color.PLAYER_2, e);
  let p = p1;
  let moves = [];
  while (!e.is_finished()) {
    let move = p.move();

    moves.push(move);
    e.move(move);
    p = p === p1 ? p2 : p1;
  }
  console.log(e.winner_is());
  if (e.winner_is() === 0) {
    victoire += 1;
  }
}

console.log("victoire", victoire);