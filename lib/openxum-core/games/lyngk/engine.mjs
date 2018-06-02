import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Intersection from './intersection.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Piece from './piece.mjs';
import Player from './player.mjs';
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

    }

    current_color() {

    }

    get_name() {

    }

    get_possible_move_list() {

    }

    is_finished() {

    }

    move(move) {

    }

    parse(str) {

    }

    to_string() {

    }

    winner_is() {

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
            this._availableColors.splice(color, 1);
        }
    }
}

export default Engine;