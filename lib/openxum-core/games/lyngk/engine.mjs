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
        this._player1Out = false;
        this._player2Out = false;
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
        return !this.colorOwnedByPlayer(Player.PLAYER_1) &&
            !this.colorOwnedByPlayer(Player.PLAYER_2);
    }

    colorOwnedByPlayer(color, player) {
        switch (player) {
            case Player.PLAYER_1 :
                for (let c in this._colorsPlayer1) {
                    if (c === color) {
                        return true;
                    }
                }
                return false;

            case Player.PLAYER_2 :
                for (let c in this._colorsPlayer2) {
                    if (c === color) {
                        return true;
                    }
                }
                return false;
        }
    }

    colorRequested(color) {
        if (this.isColorAvailable(color)) {
            switch (this.getCurrentPlayer()) {
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
            this._currentPlayer, this._intersections, this._colorsPlayer1, this._colorsPlayer2);
        return o;
    }

    current_color() {
        return this.getCurrentPlayer();
    }

    get_name() {
        return 'Lyngk';
    }

    get_possible_move_list(coord) {
        return this._getNeighborsOfCoord(this._intersections[coord.hash()]);
    }

    is_finished() {
        if (!this.stillOneMovePossible(Player.PLAYER_1)) {
            this._player1Out = true;
        }
        if (!this.stillOneMovePossible(Player.PLAYER_1)) {
            this._player2Out = true;
        }

        return this._player1Out && this._player2Out;

    }

    stillOneMovePossible(player) {
        for (let index in this._intersections) {
            if(this._intersections[index].getState() === State.VACANT ||
                this._intersections[index].getState() === State.FULL_STACK
            ) {
                continue;
            }
            let neighborsCoord = this._getNeighborsOfCoord(this._intersections[index]);
            if (neighborsCoord !== false) {
                for (let indexNeighbor in neighborsCoord) {
                    let sump = this._intersections[index].getHeightStack() + this._intersections[neighborsCoord[indexNeighbor].hash()].getHeightStack();
                    let colorNeighbor = this._intersections[neighborsCoord[indexNeighbor].hash()].getColor();
                    if (this.colorOwnedByPlayer(colorNeighbor, player) ||
                        this.isColorAvailable(colorNeighbor)
                        || (sump <= 5)
                        || !this._intersections[index].getStack().hasCommonColor(this._intersections[neighborsCoord[indexNeighbor].hash()].getStack())
                    ) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    move(move) {
        let c1 = move.from();
        let c2 = move.to();
        let interDest = this.getIntersection(c2);
        if (!this._isMoveValid(c1, c2) || interDest.getState() === State.VACANT) {
            return false;
        }
        let interOrigin = this.getIntersection(c1);
        interDest.putPieces(interOrigin.getStack().getPieces());
        interOrigin.clearStack();
        if (this._player1Out) {
            this._currentPlayer = Player.PLAYER_2;
        } else {
            if (this._player2Out) {
                this._currentPlayer = Player.PLAYER_1;
            } else {
                this.switchPlayer();
            }
        }
        return true;
    }

    parse(str) {

    }

    to_string() {

    }

    winner_is() {
        let nbStackPiecesPlayer1 = [0, 0, 0, 0, 0];
        let nbStackPiecesPlayer2 = [0, 0, 0, 0, 0];

        for (let index in this._intersections) {
            if (this._intersections[index].getState() !== State.VACANT) {
                let colorInter = this._intersections[index].getColor();
                if (this._colorsPlayer1.indexOf(colorInter) !== -1) {
                    ++nbStackPiecesPlayer1[this._intersections[index].getHeightStack() - 1]
                } else {
                    ++nbStackPiecesPlayer2[this._intersections[index].getHeightStack() - 1]
                }
            }
        }

        for (let i = 4; i >= 0; --i) {
            if (nbStackPiecesPlayer1[i] > nbStackPiecesPlayer2[i]) {
                return Player.PLAYER_1;
            } else {
                if (nbStackPiecesPlayer1[i] < nbStackPiecesPlayer2[i]) {
                    return Player.PLAYER_2;
                }
            }
        }

        return 'match nul';

    }

    getIntersection(coord, c, l) {
        if (coord) {
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
        if (this._nbPiecesForEachColor[this._availableColors[cIndex]] === maxPieces) {
            this._availableColors.splice(cIndex, 1);
        }
    }

    _isOpponentInter(inter) {
        let colorInter = inter.getColor();
        let opponent = this.getCurrentPlayer() === Player.PLAYER_1 ? Player.PLAYER_2 : Player.PLAYER_1;

        return this.colorOwnedByPlayer(colorInter, opponent);

    }

    _isMoveValid(c1, c2) {
        let origin = this.getIntersection(c1);
        let dest = this.getIntersection(c2);
        
        if (!origin || !dest)
            return false;

        let stackOrigin = origin.getStack();
        let stackDest = dest.getStack();

        if (
            this._isOpponentInter(dest) ||
            stackDest.isFull() ||
            stackOrigin.isFull() ||
            dest.getState() === State.VACANT ||
            origin.getState() === State.VACANT ||
            stackDest.isGreaterThan(stackOrigin) ||
            stackOrigin.hasCommonColor(stackDest) ||
            origin.equals(dest)
        ) {
            return false;
        }

        let _neighborsCoord = this._getNeighborsOfCoord(origin);

        for (let index in _neighborsCoord) {
            if (_neighborsCoord[index].equals(c2) && !_neighborsCoord[index].equals(c1)) {
                return true;
            }
        }

        return false;
    }

    _getNeighborsOfCoord(origin) {
        let dir;
        let _neighbors = [];
        let currentLine = origin.getLine();
        let currentColumn = origin.getColumn();
        for (dir = 0; dir < 6; dir++) {
            let neighbourCoord = this._getNeighbourCoord(currentLine, currentColumn, dir);

            if(!neighbourCoord)
                continue;

            let neighbourInter = this._intersections[neighbourCoord.hash()];
            if (
                neighbourCoord !== null &&
                neighbourCoord.isValid() &&
                !neighbourInter.getState() !== State.VACANT &&
                !this._isOpponentInter(neighbourInter) &&
                !neighbourInter.getStack().isGreaterThan(origin.getStack()) &&
                !neighbourInter.getStack().hasCommonColor(origin.getStack()) &&
                !neighbourInter.getStack().isFull()

            ) {
                _neighbors.push(neighbourCoord);
            }
        }
        return _neighbors.length > 0 ? _neighbors : false;
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
            if (neighbourCoord.isValid()) {
                neighbourInter = this.getIntersection(neighbourCoord);
            } else {
                return null;
            }
        } while (neighbourInter === null || neighbourInter.getState() === State.VACANT);

        return neighbourCoord;
    }

    _set(nbPiecesForEachColor, availableColors, currentPlayer, intersections, colorsPlayer1, colorsPlayer2) {
        this._nbPiecesForEachColor = nbPiecesForEachColor;
        this._availableColors = availableColors;
        this._currentPlayer = currentPlayer;
        this._colorsPlayer1 = colorsPlayer1;
        this._colorsPlayer2 = colorsPlayer2;
        for (let index in intersections) {
            this._intersections[index] = intersections[index].clone();
        }
    }

}

export default Engine;