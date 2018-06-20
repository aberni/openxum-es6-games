"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs'

class Cell { //final version

    constructor(coordinates,color,id) {
        this._coordinates=coordinates;
        this._color =color;
        this._id =id;
    }

    // public methods

    clone() {
        let cell = new Cell(this.coordinates.clone(),this._color,this._id);//Create copy
        return cell;
    }

    set_color(color) {
        this._color=color;
    }

    get_color() {
        return this._color;
    }

    get_coordinates() {
        return this._coordinates;
    }
	
    set_coordinates(coordinates){
        this._coordinates=coordinates;
    }

    set_id(id) {
        this._id=id;
    }

    get_id() {
        return this._id;
    }

}

export default Cell
