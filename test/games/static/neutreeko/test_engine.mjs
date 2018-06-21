import lib from '../public/lib/openxum-core/openxum';

// functions
function test_state() {
    console.assert(stateString === expectedString, '\nexpected:\n'+expectedString+'\nactual:\n'+stateString);
}

function test_current_player(color) {
    console.assert(color === e.current_color(), '\nexpected color:\n'+color+'\nactual:\n'+e.current_color());
}

let color = lib.OpenXum.Neutreeko.Color.BLACK;
let opponent_color = lib.OpenXum.Neutreeko.Color.WHITE;
let e = new lib.OpenXum.Neutreeko.Engine(lib.OpenXum.Neutreeko.GameType.STANDARD, color);
let stateString;
let expectedString;


// test init engine
stateString = e.getStateString();
expectedString = '- 5 - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n- 0 - 0 - \n';
test_state();
console.log('test initialisation: ok');


// test move() engine with move
let from = new lib.OpenXum.Neutreeko.Coordinates(1,0);
let to = new lib.OpenXum.Neutreeko.Coordinates(1,3);
let move = new lib.OpenXum.Neutreeko.Move(from, to);
e.move(move);
stateString = e.getStateString();
expectedString = '- - - 5 - \n- - 0 - - \n- - - - - \n- 5 5 - - \n- 0 - 0 - \n';
test_state();
console.log('test move: ok');

// test undo_move() engine
e.undo_move(color, move);
stateString = e.getStateString();
expectedString = '- 5 - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n- 0 - 0 - \n';
test_state();
test_current_player(color);
console.log('test undo_move: ok');


//test finish() engine
//stroke of zero
let z1 = new lib.OpenXum.Neutreeko.Coordinates(2,1);
let z2 = new lib.OpenXum.Neutreeko.Coordinates(0,1);
let move1 = new lib.OpenXum.Neutreeko.Move(z1, z2);
e.move(move1);

//stroke of five

let c1 = new lib.OpenXum.Neutreeko.Coordinates(2,3);
let c2 = new lib.OpenXum.Neutreeko.Coordinates(2,0);
let move2 = new lib.OpenXum.Neutreeko.Move(c1, c2);
e.move(move2);

stateString = e.getStateString();
expectedString = '- 5 5 5 - \n0 - - - - \n- - - - - \n- - - - - \n- 0 - 0 - \n';
test_state();
console.log('test finish: ok');