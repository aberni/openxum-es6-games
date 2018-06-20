
QUnit.test( "test test", function( assert ) {
    var moteur = new window.OpenXum.Dakapo.Engine();
    assert.equal( moteur.get_name(), "Dakapo");
});

QUnit.test( "test carre simple", function( assert ) {
    var moteur = new window.OpenXum.Dakapo.Engine();
    moteur.move(new window.OpenXum.Dakapo.Move(3, 3, 2));
    moteur.move(new window.OpenXum.Dakapo.Move(0, 4, 2));
    moteur.move(new window.OpenXum.Dakapo.Move(3, 5, 2));
    moteur.move(new window.OpenXum.Dakapo.Move(0, 5, 3));
    moteur.move(new window.OpenXum.Dakapo.Move(3, 5, 4));

    assert.equal( moteur.is_finished(), true);
    assert.equal( moteur.current_color(), moteur.winner_is());
    assert.equal( moteur.current_color(), 'Joueur 1');
});



QUnit.test( "test carre diago", function( assert ) {
    var moteur = new window.OpenXum.Dakapo.Engine();

    moteur.move(new window.OpenXum.Dakapo.Move(1, 2, 4));
    moteur.move(new window.OpenXum.Dakapo.Move(2, 5, 4));
    moteur.move(new window.OpenXum.Dakapo.Move(0, 5, 3));
    moteur.move(new window.OpenXum.Dakapo.Move(2, 5, 2));
    moteur.move(new window.OpenXum.Dakapo.Move(1, 4, 2));
    moteur.move(new window.OpenXum.Dakapo.Move(2, 6, 3));

    assert.equal( moteur.is_finished(), true);
    assert.equal( moteur.current_color(), moteur.winner_is());
    assert.equal( moteur.current_color(), 'Joueur 2');

});

QUnit.test( "test move list", function( assert ) {
    var moteur = new window.OpenXum.Dakapo.Engine();
    assert.equal( moteur.get_possible_move_list().length, 24);

    moteur.move(new window.OpenXum.Dakapo.Move(0, 2, 3));
    assert.equal( moteur.get_possible_move_list().length, 22);
});


QUnit.test( "test is_possible", function( assert ) {
    var moteur = new window.OpenXum.Dakapo.Engine();
    assert.equal( moteur._is_possible(new window.OpenXum.Dakapo.Move(0, 7, 7)), false);
    assert.equal( moteur._is_possible(new window.OpenXum.Dakapo.Move(2, 5, 3)), false);
    assert.equal( moteur._is_possible(new window.OpenXum.Dakapo.Move(3, 5, 3)), true);

});
