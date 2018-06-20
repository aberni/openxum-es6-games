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

    //TO DO
    /*to_string(){
        console.log(this._from);
        console.log(this._to);
        let a=new String("["+this._from+","+this._to+"]");
        console.log(a);
        return a;
    }

    parse(str){
        let a=parseInt(str.charCodeAt(1));
        let b=parseInt(str.charCodeAt(3));
        console.log(a);
        console.log(b);
        return new Move(a,b);
    }*/
}
export default Move;