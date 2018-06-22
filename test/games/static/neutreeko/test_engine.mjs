import lib from '../public/lib/openxum-core/openxum';

// functions
function test_state(expectedString) {
    console.assert(expectedString === e.getStateString(), '\nexpected:\n'+expectedString+'\nactual:\n'+e.getStateString());
}

function test_current_player(color) {
    console.assert(color === e.current_color(), '\nexpected color:\n'+color+'\nactual:\n'+e.current_color());
}

let color = lib.OpenXum.Neutreeko.Color.BLACK;
let opponent_color = lib.OpenXum.Neutreeko.Color.WHITE;
let e = new lib.OpenXum.Neutreeko.Engine(lib.OpenXum.Neutreeko.GameType.STANDARD, color);
let expectedString;
let from, to;
let move;


// test init engine
expectedString = '- 5 - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n- 0 - 0 - \n';
test_current_player(color);
test_state(expectedString);
console.log('test initialisation: ok');


// test move() engine with move
from = new lib.OpenXum.Neutreeko.Coordinates(1,4);
to = new lib.OpenXum.Neutreeko.Coordinates(0,4);
move = new lib.OpenXum.Neutreeko.Move(from, to);
e.move(move);
expectedString = '- 5 - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n0 - - 0 - \n';
test_state(expectedString);
test_current_player(opponent_color);

console.log('test move 1: ok');


from = new lib.OpenXum.Neutreeko.Coordinates(1,0);
to = new lib.OpenXum.Neutreeko.Coordinates(1,4);
move = new lib.OpenXum.Neutreeko.Move(from, to);
e.move(move);
expectedString = '- - - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n0 5 - 0 - \n';
test_state(expectedString);
test_current_player(color);

console.log('test move 2: ok');


// test undo_move() engine
e.undo_move(move);
expectedString = '- 5 - 5 - \n- - 0 - - \n- - - - - \n- - 5 - - \n0 - - 0 - \n';
test_state(expectedString);
test_current_player(opponent_color);
console.log('test undo_move: ok');