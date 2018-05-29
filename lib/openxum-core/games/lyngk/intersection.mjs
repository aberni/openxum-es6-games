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

    getStackHeight() {
        return this._stack.length;
    };
}


export default Intersection;