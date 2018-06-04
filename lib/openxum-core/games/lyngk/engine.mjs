import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Piece from './piece.mjs';
import Player from './player.mjs';
import Stack from './stack.mjs';
import State from './state.mjs';


// enums definition
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

class Engine extends OpenXum.Engine {
    constructor(type) {
        super();
        this._type = type;
        this._nbPiecesForEachColor = [0, 0, 0, 0, 0, 0];
        this._availableColors = [
            Color.BLACK,
            Color.IVORY,
            Color.BLUE,
            Color.RED,
            Color.GREEN,
            Color.WHITE
        ];
        this._currentPlayer = Math.floor(Math.random() * 2);
        this._colorsPlayer1 = [];
        this._colorsPlayer2 = [];
        this._intersections = [];
        this.init();
    }

    init() {
        let i, line, coord;
        for (i = 0; i < letters.length; i++) {
            for (line = 1; line < 10; line += 1) {
                coord = new Coordinates(letters[i], line);
                this._initializeInter(coord);
            }
        }
        this._availableColors = [
            Color.BLACK,
            Color.IVORY,
            Color.BLUE,
            Color.RED,
            Color.GREEN,
            Color.WHITE
        ];
    }

    getAvailableColors() {
        return this._availableColors;
    }

    isColorAvailable(color) {
        for (let c in this._colorsPlayer1){
            if(c === color) {
                return false;
            }
        }

        for (let c in this._colorsPlayer2) {
            if(c === color) {
                return false;
            }
        }

        return true;
    }

    colorOwnedByPlayer(color, player) {

    }

    colorRequested(color) {
        if(this.isColorAvailable(color)) {
            switch (this.getCurrentPlayer())  {
                case Player.PLAYER_1 :
                    this._colorsPlayer1.push(color);
                    break;
                case Player.PLAYER_2 :
                    this._colorsPlayer2.push(color);
                    break;
            }
            return true;
        }
        return false;
    }

    getCurrentPlayer() {
        return this._currentPlayer;
    }

    switchPlayer() {
        this._currentPlayer = this.getCurrentPlayer() === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
    }

    apply_moves(moves) {

    }

    clone() {
        let e = new Engine(this._type);
        e._set(this._nbPiecesForEachColor, this._availableColors,
            this._currentPlayer, this._intersections);
        return o;
    }

    current_color() {

    }

    get_name() {
        return 'Lyngk';
    }

    get_possible_move_list() {

    }

    is_finished() {

    }

    move(move) {
        let c1 = move.from();
        let c2 = move.to();
        let interDest = this.getIntersection(c2);
        if( !this._isMoveValid(c1, c2) || interDest.getState() === State.VACANT){
            return false;
        }
        let interOrigin = this.getIntersection(c1);
        interDest.putPieces(interOrigin.getStack().getPieces());
        interOrigin.clearStack();
        this.switchPlayer();
        return true;
    }

    parse(str) {

    }

    to_string() {

    }

    winner_is() {

    }

    getIntersection(coord, c, l){
        if(coord){
            return this._intersections[coord.hash()];
        }
        return this._intersections[new Coordinates(c, l).hash()];
    }

    _exist_intersection(letter, number) {
        let coordinates = new Coordinates(letter, number);

        if (coordinates.isValid()) {
            return this._intersections[coordinates.hash()] !== null;
        } else {
            return false;
        }
    }

    //private methods
    _initializeInter(coord) {
        if (coord.isValid()) {
            let color = this._getRandomColor();
            let piece = new Piece(color);
            let inter = new Intersection(coord);
            inter.putPiece(piece);
            this._majColorsAvailable();
            this._intersections[coord.hash()] = inter;
        }
    }

    _getRandomColor() {
        let indexAvailableColors = Math.floor(Math.random() * this._availableColors.length);
        let randomColor = this._availableColors[indexAvailableColors];
        this._nbPiecesForEachColor[randomColor] += 1;

        return randomColor;
    }

    _majColorsAvailable() {
        let cIndex;
        for (cIndex = 0; cIndex < this._availableColors.length; cIndex++) {
            if (this._availableColors[cIndex] !== Color.WHITE) {
                this._majArrayColorsAvailable(cIndex, 8);
            } else {
                this._majArrayColorsAvailable(cIndex, 3);
            }
        }
    }

    _majArrayColorsAvailable(cIndex, maxPieces) {
        if(this._nbPiecesForEachColor[this._availableColors[cIndex]] === maxPieces) {
            this._availableColors.splice(cIndex, 1);
        }
    }

    _isOpponentInter(inter) {
        let colorInter = inter.getColor();
        let opponent = this.getCurrentPlayer() === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;
        switch (opponent) {
            case Player.PLAYER_1 :
                break;
            case Player.PLAYER_2:
                break;
        }
    }

    _isMoveValid(c1, c2) {
        let origin = this.getIntersection(c1);
        let dest = this.getIntersection(c2);
        let stackOrigin = origin.getStack();
        let stackDest = dest.getStack();

        if(
            this._isOpponentInter(dest) ||
            stackDest.isFull() ||
            stackOrigin.isFull() ||
            stackDest.isGreaterThan(stackOrigin) ||
            stackOrigin.hasCommonColor(stackDest)
        ) {
            return false;
        }

        return this._checkDirections(origin, dest);
    }

    _checkDirections(origin, dest) {
        let dir;
        let currentLine = origin.getLine();
        let currentColumn = origin.getColumn();
        for (dir = 0; dir < 6; dir++) {
            let neighbourCoord = this._getNeighbourCoord(currentLine, currentColumn, dir);
            if (
                neighbourCoord !== null &&
                neighbourCoord.isValid() &&
                neighbourCoord.equals(dest.getCoordinate()) &&
                !origin.equals(dest)
            ) {
                return true;
            }
        }

        return false;
    }

    _getNeighbourCoord(line, column, direction) {
        let neighbourCoord, neighbourInter = null;
        let neighbors = [];
        do {
            neighbors = [
                [line + 1, column],
                [line - 1, column],
                [line + 1, String.fromCharCode(column.charCodeAt(0) + 1)],
                [line, String.fromCharCode(column.charCodeAt(0) - 1)],
                [line, String.fromCharCode(column.charCodeAt(0) + 1)],
                [line - 1, String.fromCharCode(column.charCodeAt(0) - 1)]
            ];
            line = neighbors[direction][0];
            column = neighbors[direction][1];
            neighbourCoord = new Coordinates(column, line);
            if(neighbourCoord.isValid()){
                neighbourInter = this.getIntersection(neighbourCoord);
            } else {
                return null;
            }
        } while (neighbourInter === null || neighbourInter.getState() === State.VACANT);

        return neighbourCoord;
    }

    _set(nbPiecesForEachColor, availableColors, currentPlayer, intersections){
        this._nbPiecesForEachColor = nbPiecesForEachColor;
        this._availableColors = availableColors;
        this._currentPlayer = currentPlayer;
        for (let index in intersections) {
            this._intersections[index] = intersections[index].clone();
        }
    }

}

export default Engine;