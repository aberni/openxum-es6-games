// MARCHE PAS
QUnit.test( "is_valid", function( assert ) {
    let coordinates = new window.OpenXum.Tintas.Coordinates(1);
    assert.ok( coordinates.is_valid(), "Passed!" );
});

QUnit.test( "matrix", function( assert ) {
    let coordinates = new window.OpenXum.Tintas.Coordinates(1);
    let coordinates2 = new window.OpenXum.Tintas.Coordinates(1);
    coordinates2.matrix([1,1,1]);
    let coord = [coordinates.get_pos_x()+1,coordinates.get_pos_y()+1,coordinates.get_pos_z()+1];
    let coord2 = [coordinates2.get_pos_x(),coordinates2.get_pos_y(),coordinates2.get_pos_z()];
    assert.deepEqual( coord, coord2, "Passed!" );
});

QUnit.test( "clone", function( assert ) {
    let coordinates = new window.OpenXum.Tintas.Coordinates(1);
    let coord = coordinates.clone();
    assert.deepEqual( coord, coordinates, "Passed!" );
});

