"use strict";

import Coordinates from './coordinates.mjs';

class Move { //final version
    constructor(id_a, id_b) {
        this._from= id_a;
        this._to = id_b;
    }

    clone(){
        console.log("get de move")
        return new Move(this._from,this._to);
    }

    get_to(){
        return this._to;
    }

    get_from(){
        return this._from;
    }

    get(){
        console.log("get de move")
        return this.clone();
    }

}
export default Move;