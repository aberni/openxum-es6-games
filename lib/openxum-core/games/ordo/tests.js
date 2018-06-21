QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "Undefined board OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  assert.ok(typeof e._board[0][0] === "undefined", "Passed!" );
  assert.ok(typeof e._board[0][4] === "undefined", "Passed!" );
  assert.ok(typeof e._board[4][0] === "undefined", "Passed!" );
  assert.ok(typeof e._board[4][4] === "undefined", "Passed!" );
});

QUnit.test( "Defined board OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  let alt = 0;
  let up = false;
  let yy;
  let color = 2;
  for (let y = 1; y < 8; y = y + 5) {
    for (let x = 0; x < 10; x++) {
      assert.equal(e._board[x][y].color() ,color,"Pion de la couleur" + color);
      if (alt === 2) {
        alt = 0;
        up = !up;
      }
      if (!up) {
        yy = y + 1;
      }
      else {
        yy = y - 1;
      }
      assert.equal(e._board[x][yy].color() , color , "Pion de la bonne couleur " + color);
      alt++;
    }
    color = 1;
  }

});


QUnit.test( "Constructor OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  assert.equal(e._current_round , 0, "Current round is at 0" );
  assert.equal(e._count_white_pawn , 20, "White has 20 pawns" );
  assert.equal(e._count_black_pawn , 20, "Black has 20 pawns" );
  assert.equal(e._cpt_mark, 0, "Mark count is at 0");
  assert.equal(e._disconnect_white , false, "Disconnect white is false" );
  assert.equal(e._disconnect_black , false, "Disconnect blaack is  false" );
  assert.equal(e._is_finished , false, "_is_finished is false");
  assert.equal(e._winner_color , -1, "_winner_color is NONE");
});


QUnit.test( " _verify_moving starting pos OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  assert.equal(e._verify_moving(e._board[1][2],1,3) , true,"Move D is possible" );
  assert.equal(e._verify_moving(e._board[1][2],2,2) , true,"Move R is possible" );
  assert.equal(e._verify_moving(e._board[1][2],3,2) , true,"Move R+ is possible" );
  assert.equal(e._verify_moving(e._board[1][2],0,3) , true,"Move DL is possible" );
  assert.equal(e._verify_moving(e._board[1][2],0,2) , false,"Move L isn't possible" );
  assert.equal(e._verify_moving(e._board[1][2],1,1) , false,"Move U isn't possible" );
  assert.equal(e._verify_moving(e._board[1][2],0,1) , false,"Move UL isn't possible" );
  assert.equal(e._verify_moving(e._board[1][2],2,1) , false,"Move UR isn't possible" );
  assert.equal(e._verify_moving(e._board[1][2],2,3) , false,"Move DR isn't possible" );
});


QUnit.test( " _verify_moving after mov OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  let col =  window.OpenXum.Ordo.Color.BLACK;
  let pieceT = new window.OpenXum.Ordo.Piece(col,new window.OpenXum.Ordo.Coordinates(3,3));
  e._board[3][3] = pieceT;
  assert.equal(e._verify_moving(e._board[3][3],2,3) , true,"Move L is possible" );
  assert.equal(e._verify_moving(e._board[3][3],4,3) , true,"Move R is possible" );
  assert.equal(e._verify_moving(e._board[3][3],2,2) , false,"Move UL isn't possible" );
  assert.equal(e._verify_moving(e._board[3][3],3,2) , false,"Move U isn't possible" );
  assert.equal(e._verify_moving(e._board[3][3],4,2) , false,"Move UR isn't possible" );
  assert.equal(e._verify_moving(e._board[3][3],2,4) , false,"Move DL isn't possible" );
  assert.equal(e._verify_moving(e._board[3][3],4,4) , false,"Move DR isn't possible" );
  assert.equal(e._verify_moving(e._board[3][3],3,4) , false,"Move D isn't possible" );
});

QUnit.test(" _get_possible_move_list OK", function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  let col =  window.OpenXum.Ordo.Color.BLACK;
  let pieceT = new window.OpenXum.Ordo.Piece(col,new window.OpenXum.Ordo.Coordinates(3,3));
  let pieceU = e._board[5][2];
  assert.equal(e._get_possible_move_list(pieceT).length,9,"We have nine moves");
  assert.equal(e._get_possible_move_list(pieceU).length,4,"We have four moves");
});

QUnit.test("_check_group_connection OK",function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  let col =  window.OpenXum.Ordo.Color.BLACK;
  let piece = new window.OpenXum.Ordo.Piece(col,new window.OpenXum.Ordo.Coordinates(1,2));
  let mov = new window.OpenXum.Ordo.Move(piece,new window.OpenXum.Ordo.Coordinates(1,2));
  e._check_group_connection(mov);
  assert.equal(e._cpt_mark,20,"We are still connected");
})

QUnit.test( " _check_pawns_taken OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  let col =  window.OpenXum.Ordo.Color.BLACK;
  assert.equal(e._count_white_pawn,20,"There are 20 pawns")
  let piece = new window.OpenXum.Ordo.Piece(col,new window.OpenXum.Ordo.Coordinates(1,4));
  let mov = new window.OpenXum.Ordo.Move(piece,new window.OpenXum.Ordo.Coordinates(1,5));
  e._check_pawn_taken(mov);
  assert.equal(e._count_white_pawn,19,"We took a pawn");

});


QUnit.test( " _check_winner with black 0 pawns OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 1;
  e._count_black_pawn = 0;
  e._check_winner();
  assert.equal(e.is_finished(),true,"Game has ended");
  assert.equal(e.winner_is(),1,"Winner is white" );
});

QUnit.test( " _check_winner with white 0 pawns OK", function( assert ) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = 2;
  e._count_white_pawn = 0;
  e._check_winner();
  assert.equal(e.is_finished(),true,"Game has ended");
  assert.equal(e.winner_is(),2,"Winner is black" );
});

QUnit.test(" _check_winner with a black pawn touchdown OK ",function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = window.OpenXum.Ordo.Color.BLACK;
  e._board[1][7] = new window.OpenXum.Ordo.Piece(e._color,new window.OpenXum.Ordo.Coordinates(1,7));
  e.show_board();
  e._check_winner();
  assert.equal(e.winner_is(),2,"Winner is black" );
});

QUnit.test(" _check_winner with a white pawn touchdown OK ",function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = window.OpenXum.Ordo.Color.WHITE;
  e._board[0][0] = new window.OpenXum.Ordo.Piece(e._color,new window.OpenXum.Ordo.Coordinates(0,0));
  e.show_board();
  e._check_winner();
  assert.equal(e.winner_is(),1,"Winner is white" );
});


QUnit.test(" _check_winner with a disconnect black OK ",function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = window.OpenXum.Ordo.Color.BLACK;
  let mov = new window.OpenXum.Ordo.Move(e._board[4][2],new window.OpenXum.Ordo.Coordinates(4,3));
  e.move(mov);
  let movtis = new window.OpenXum.Ordo.Move(e._board[2][7],new window.OpenXum.Ordo.Coordinates(1,7));
  e.move(movtis)
  let movbis = new window.OpenXum.Ordo.Move(e._board[5][2],new window.OpenXum.Ordo.Coordinates(5,3));
  e.move(movbis);
  e.show_board();
  e._check_winner();
  assert.equal(e.winner_is(),1,"Winner is white" );
});

QUnit.test(" _check_winner with a disconnec white OK ",function(assert) {
  let e = new window.OpenXum.Ordo.Engine();
  e._color = window.OpenXum.Ordo.Color.WHITE;
  let mov = new window.OpenXum.Ordo.Move(e._board[4][5],new window.OpenXum.Ordo.Coordinates(4,4));
  e.move(mov);
  let movtis = new window.OpenXum.Ordo.Move(e._board[0][2],new window.OpenXum.Ordo.Coordinates(0,3));
  e.move(movtis)
  let movbis = new window.OpenXum.Ordo.Move(e._board[5][5],new window.OpenXum.Ordo.Coordinates(5,4));
  e.move(movbis);
  e.show_board();
  e._check_winner();
  assert.equal(e.winner_is(),2,"Winner is black" );
});







