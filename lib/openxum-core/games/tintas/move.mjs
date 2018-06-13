"use strict";

import Coordinates from './coordinates.mjs';

class Move {
    constructor(idA, idB) {
        this._from = new Coordinates(idA); //an array of cells
        this._to = new Coordinates(idB);
    }

    clone(){
        return new Move(this._from,this._to);
    }

    getTo(){
        return this._to;
    }

    getFrom(){
        return this._from;
    }

}
export default Moves;