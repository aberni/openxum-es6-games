"use strict";

import State from './state.mjs';

const stateRange = {};
stateRange[0] = State.VACANT;
stateRange[1] = State.ONE_PIECE;
stateRange[2] = State.STACK;
stateRange[3] = State.STACK;
stateRange[4] = State.STACK;
stateRange[5] = State.FULL_STACK;

class Intersection {
    constructor(coordinate){
        this._coordinate = coordinate;
        this._state = State.VACANT;
        this._stack = [];
    }

    getState() {
        return this._state;
    }

    setState(s){
        this._state = s;
    }

    getStack() {
        return this._stack;
    }

    getCoordinate() {
        return this._coordinate;
    }

    getHeightStack() {
        return this.getStack().length;
    };

    getHeadStack() {
        let lenght = this.getHeightStack();
        return lenght > 0 ? this.getStack()[lenght - 1] : null;
    }

    getColorStack() {
        if(this.getHeightStack() > 0){
            return this.getHeadStack().getColor();
        }
        return null;
    }

    updateState() {
        this.setState(stateRange[this.getHeadStack()]);
        return this.getState();
    }

    putPiece(p){
        this._stack.push(p);
        this.updateState();
    }

    takeOffPiece(){
        let piece = this.getHeadStack();
        if (piece == null) { return null; }

        this.getStack().splice(this.getHeightStack() -1, 1);
        this.updateState();
        return piece;
    }

    clearStack() {
        this.getStack().splice(0, this.getHeightStack());
        this.updateState();
    }
}


export default Intersection;