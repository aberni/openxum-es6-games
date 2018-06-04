"use strict";

import State from './state.mjs';
import Stack from './stack.mjs';

const stateRange = {};
stateRange[0] = State.VACANT;
stateRange[1] = State.ONE_PIECE;
stateRange[2] = State.STACK;
stateRange[3] = State.STACK;
stateRange[4] = State.STACK;
stateRange[5] = State.FULL_STACK;

class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._state = State.VACANT;
        this._stack = new Stack(null);
    }

    clone() {
        let intersection = new Intersection(this._coordinate.clone());
        intersection.set(this._state, this._stack);
        return intersection;
    }

    set(state, stack) {
        this._state = state;
        this._stack = stack.clone();
    }

    getState() {
        return this._state;
    }

    setState(s) {
        this._state = s;
    }

    getStack() {
        return this._stack;
    }

    getCoordinate() {
        return this._coordinate;
    }

    getLine() {
        return this.getCoordinate().getLine();
    }

    getColumn() {
        return this.getCoordinate().getColumn();
    }

    getHeightStack() {
        return this._stack.getHeight();
    };

    getHeadStack() {
        return this._stack.getHead();
    }

    getColor() {
        let headPiece = this.getHeadStack();
        if (headPiece !== null && headPiece !== undefined) {
            return headPiece.getColor();
        }
        return null;
    }

    updateState() {
        this.setState(stateRange[this.getHeightStack()]);
        return this.getState();
    }

    putPiece(p) {
        this._stack.pushPiece(p);
        this.updateState();
    }

    putPieces(pArray) {
        this._stack.pushPieces(pArray);
        this.updateState();
    }

    takeOffPiece() {
        let piece = this._stack.pop();
        this.updateState();
        return piece;
    }

    clearStack() {
        this._stack.clear();
        this.updateState();
    }

    equals(intersection){
        return this.getCoordinate().equals(intersection.getCoordinate());
    }
}


export default Intersection;