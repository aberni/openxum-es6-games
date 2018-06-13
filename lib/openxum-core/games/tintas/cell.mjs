"use strict";

import Color from './color.mjs';

class Cell {

    constructor(coordinates,color,id) {
        this._coordinates=coordinates;
        this._color =color;
        this._id =id;
    }

    // public methods

    clone() {
        let cell = new Cell(this._x,this._y,this._z,this._color,this._id);//Create copy
        return cell;
    }

    setColor(color) {
        this._color=color;
    }

    getColor() {
        return this._color;
    }

    getCoordinates() {
        return this._coordinates;
    }
	
    setCoordinates(coordinates){
        this._coordinates=coordinates;
    }

    setId(id) {
        this._id=id;
    }

    getId() {
        return this._id;
    }

    print(){
        console.log("id: "+this.getId()+" Color: "+this.getColor());//print Cell information
    }

}

export default Cell
