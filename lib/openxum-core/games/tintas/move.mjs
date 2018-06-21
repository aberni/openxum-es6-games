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

    get(){
        return this.clone();
    }

    to_string(){
        return this._from+' to '+this._to;
    }

    parse(str){
        let from=str.charAt(0)+str.charAt(1);
        let to=str.charAt(str.length-2)+str.charAt(str.length-1);
        this._from=parseInt(from);
        this._to=parseInt(to); }
}
export default Move;