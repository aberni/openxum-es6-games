"use strict";

import Color from './color.mjs'

class Cell {

    constructor(x,y,z,color,id) {
        this._x = x;
        this._y = y;
        this._z = z;
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

    getX(){
        return this._x;
    }

    getY(){
        return this._y;
    }

    getZ(){
        return this._z;
    }

    getPos(){
        let tab=new Array();// create an array to store location
        tab[0]=this._x;
        tab[1]=this._y;
        tab[2]=this._z;
        return tab;
    }

}

export default Cell