"use strict";

class Board {
    constructor(width, height) {
        this._width = width;
        this._height = height;

        console.assert(width > 0 && height > 0, "Width and Height of board must be positive and not equal to zero");

        this._board = new Array(width);

        for (let i = 0; i < width; i++) {
            this._board[i] = new Array(height);
            for(let j=0; j < height; j++) {
                this._board[i][j] = undefined;
            }
        }
        //console.log('board created: done');
    }

    getHeight() { return this._height; }
    getWidth() { return this._width; }

    getPieceAt(i,j) {
        console.assert(
            i>=0 && i<this._width && j>=0 && j<this._height,
            'Invalide coordinates: ' + i + ',' + j
        );

        return this._board[i][j];
    }

    formatted_string() {
        let str = '';
        for(let j=0; j < this._height; j++) {
            for (let i = 0; i < this._width; i++) {
                if(this._board[i][j] === undefined) {
                    str += '- ';
                } else {
                    str += this._board[i][j].formatted_string();
                }
            }
            str += '\n';
        }
        return str;
    }

    place_piece(piece) {
        this._board[piece.coordinates().x()][piece.coordinates().y()] = piece;
    }

    pop_piece(piece) {
        this._board[piece.coordinates().x()][piece.coordinates().y()] = undefined;
    }

    move_piece(piece, newCoordinates) {
        this.pop_piece(piece);
        piece.set_coordinates(newCoordinates);
        this.place_piece(piece);
    }
}

export default Board;