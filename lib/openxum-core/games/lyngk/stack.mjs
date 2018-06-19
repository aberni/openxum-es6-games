"use strict";

import Color from './color.mjs';

class Stack {
    constructor(s) {
        this._pieces = [];
        if(s) {
            this._pieces = s;
        }
    }

    clone() {
        let stack = new Stack(null);
        stack.set(this._pieces);
        return stack;
    }

    set(pieces) {
        this._pieces = pieces;
    }

    pushPiece(p) {
        this._pieces.push(p);
    }

    pushPieces(pArray) {
        this._pieces = this._pieces.concat(pArray);
    }

    getPieces() {
        return this._pieces;
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
        this._pieces = [];
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

    getColors() {
        return this._pieces.map(function(piece) {
            return piece.getColor();
        });
    }
}

export default Stack;