"use strict";

import Color from './color.mjs';

class Stack {
    constructor() {
        this._pieces = [];
    }

    pushPiece(p) {
        this._pieces.push(p);
    }

    getHeight() {
        return this._pieces.length;
    }

    getHead() {
        return (this.getHeight() > 0) ? this._pieces[this.getHeight() - 1] : null;
    }

    pop() {
        let piece = this.getHead();
        if (piece === null) {
            return null;
        }

        this._pieces.splice(this.getHeight() - 1, 1);
        return piece;
    }

    clear() {
        this._pieces.splice(0, this.getHeight());
    }

    getPiece(index) {
        return this._pieces[index];
    }

    isFull() {
        return this.getHeight() === 5;
    }

    hasCommonColor(stack) {
        let i,j;
        for (i = 0; i < this.getHeight() ; i++) {
            if(this.getPiece(i).getColor() === Color.WHITE) {
                continue;
            }
            for (j = 0; j < stack.getHeight() ; j++) {
                if(stack.getPiece(j).getColor() === Color.WHITE) {
                    continue;
                }
                if(this.getPiece(i).sameColor(stack.getPiece(j))){
                    return true;
                }
            }
        }
        return false;
    }

    isGreaterThan(stack) {
        return this.getHeight() > stack.getHeight();
    }


}

export default Stack;