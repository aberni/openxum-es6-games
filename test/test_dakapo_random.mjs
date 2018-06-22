import lib from '../lib/openxum-core/openxum';

let cpt=0;

for (let i=0; i<10; i++){
let e = new lib.OpenXum.Dakapo.Engine(0,0);
//let p1 = new lib.OpenXum.MCTSPlayer('Joueur 1', e);
let p1 = new lib.OpenXum.Dakapo.IA.IADakapo.IADakapoPlayer('Joueur 1', e,3);
let p2 = new lib.OpenXum.Dakapo.IA.IADakapo.IADakapoPlayer('Joueur 2', e,3);
//let p2 = new lib.OpenXum.MCTSPlayer('Joueur 2', e);
let p = p1;
let moves = [];

while (!e.is_finished()) {
  let move = p.move();
  moves.push(move);
  e.move(move);
  p = p === p1 ? p2 : p1;
}
if(e.winner_is() === 'Joueur 2'){
  cpt++;
}

}

console.log(cpt);