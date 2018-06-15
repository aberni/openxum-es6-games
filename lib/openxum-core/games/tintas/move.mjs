"use strict";

import Coordinates from './coordinates.mjs';

class Move { //final version
    constructor(id_a, id_b) {
        this._from= id_a;
        this._to = id_b;
    }

    clone(){
        return new Move(this._from,this._to);
    }

    get_to(){
        return this._to;
    }

    get_from(){
        return this._from;
    }

}
export default Move;