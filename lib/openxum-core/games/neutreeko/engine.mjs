// lib/openxum-core/games/neutreeko/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import Piece from './piece.mjs';
import Coordinates from './coordinates.mjs';
import Move from './move.mjs';

//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(type, first_color) {
        super();
        // Déclaration de tous les attributs nécessaires
        this._type = type;
        this._current_color = first_color;
        this._is_finished = false;
        this._winner_color = Color.NONE;
        this._initialize_board();
        this._stateboard = [];
        this._count_state = [];
    }

    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        // Permet de cloner le moteur de jeu.
        let o = new Engine(this._type, this._current_color);
        let b = new Array(5);

        for(let i = 0; i < 5; i++) {
            b[i] = new Array(5);
        }

        for(let j=0; j<5; j++) {
            for(let i=0; i<5; i++) {
                if (this._board[i][j] !== undefined) {
                    b[i][j] = this._board[i][j].clone();
                } else {
                    b[i][j] = undefined;
                }
            }
        }

        o._set(this._is_finished, this._winner_color, b);

        return o;
    }

    current_color() {
        return this._current_color;
    }

    get_name() {
        return 'Neutreeko';
    }

    get_possible_move_list() {
        // Retourne la liste de tous les coups possibles
        // La liste retournée doit être un tableau d'objet Move.
        let moves = [];
        let coor = [];

        for(let x = 0; x < 5; x++) {
            for(let y = 0; y < 5; y++) {
                if (this._board[x][y] !== undefined) {
                    if(this._board[x][y].color() === this.current_color()) {
                        let possible_moves = this._get_possible_move_list(this._board[x][y]);
                        /*
                         console.log("x:"+x+" y:"+y+" possible_moves: ");
                         possible_moves.forEach(function(element) {
                         console.log(element.to_string());
                         });
                         */
                        moves = moves.concat(possible_moves);
                    }
                }
            }
        }

        return moves;
    }

    is_finished() {
        // Retourne si la partie est terminée ou non.
        return this._is_finished;
    }

    parse(str) {
        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    to_string() {
        // Construit une représentation sous forme d'une chaîne de caractères
        // de l'état du jeu
    }

    winner_is() {
        return this._winner_color;
    }

    _initialize_board() {
        this._board = new Array(5);

        for(let i = 0; i < 5; i++) {
            this._board[i] = new Array(5);
        }

        for(let j=0; j<5; j++) {
            for(let i=0; i<5; i++) {
                this._board[i][j] = undefined;
            }
        }

        this._board[2][1] = new Piece(Color.BLACK, new Coordinates(2, 1));
        this._board[1][4] = new Piece(Color.BLACK, new Coordinates(1, 4));
        this._board[3][4] = new Piece(Color.BLACK, new Coordinates(3, 4));

        this._board[1][0] = new Piece(Color.WHITE, new Coordinates(1, 0));
        this._board[3][0] = new Piece(Color.WHITE, new Coordinates(3, 0));
        this._board[2][3] = new Piece(Color.WHITE, new Coordinates(2, 3));
    }

    _get_possible_move_list(piece) {
        let moves = [];
        if (piece.color() === this._current_color) {
            let pc = piece.coordinates();
            // Right
            let x = pc.x(), y = pc.y();
            while(x+1 < 5) {
                if (this._board[x+1][pc.y()] !== undefined) {
                    break;
                }
                x++;
            }
            if(x !== pc.x()) {
                moves.push(new Move(pc, new Coordinates(x, pc.y())));
            }
            //Left
            x= pc.x();
            while(x-1 >= 0) {
                if (this._board[x-1][y] !== undefined) {
                    break;
                }
                x--;
            }
            if(x !== pc.x()) {
                moves.push(new Move(pc, new Coordinates(x, pc.y())));
            }
            //Bottom
            x= pc.x();
            while(y+1 < 5) {
                if (this._board[x][y+1] !== undefined) {
                    break;
                }
                y++;
            }
            if(y !== pc.y()) {
                moves.push(new Move(pc, new Coordinates(x, y)));
            }
            //Top
            x= pc.x(),y=pc.y();
            while(y-1 >= 0) {
                if (this._board[x][y-1] !== undefined) {
                    break;
                }
                y--;
            }
            if(y !== pc.y()) {
                moves.push(new Move(pc, new Coordinates(x, y)));
            }
            // Diag Bottom Right
            x = pc.x(); y = pc.y();
            let i;
            for(i = 1; x+i < 5 && y+i < 5; i++) {
                if (this._board[x+i][y+i] !== undefined) {
                    break;
                }
            }
            if(i > 1) {
                moves.push(new Move(pc, new Coordinates(x+i-1, y+i-1)));
            }


            // Diag Top Right
            for(i = 1; x+i < 5 && y-i >= 0; i++) {
                if (this._board[x+i][y-i] !== undefined) {

                    break;
                }
            }
            if (i>1){
                moves.push(new Move(pc, new Coordinates(x+i-1, y-i+1)));
            }


            // Diag Bottom Left
            for(i = 1; x-i >=0 && y+i < 5; i++) {
                if (this._board[x-i][y+i] !== undefined) {
                    break;
                }
            }
            if(i > 1) {
                moves.push(new Move(pc, new Coordinates(x-i+1, y+i-1)));
            }

            // Diag Top Left
            for(i = 1; x-i >=0 && y-i >=0; i++) {
                if (this._board[x-i][y-i] !== undefined) {
                    break;
                }
            }
            if(i > 1) {
                moves.push(new Move(pc, new Coordinates(x-i+1, y-i+1)));
            }
        }

        return moves;
    }

    board_strings_equal(board_string_1, board_string_2) {
        for(let i=0; i<board_string_1.length && i<board_string_2.length; i++) {
            if(board_string_1[i] !== board_string_2[i]) {
                return false;
            }
        }
        return true;
    }

    board_to_string() {
        let state = "";
        for(let j=0; j<5; j++) {
            for(let i=0; i<5; i++) {
                let piece = this._board[i][j];
                if(piece === undefined) {
                    state += "-";
                }
                else {
                    state += piece.color();
                }
            }
        }
        return state;
    }

    _check_draw() {
        if(this._stateboard.length === 0 ){
            this._stateboard.push(this.board_to_string());
            this._count_state.push(1);
        } else {
            let found = false;
            let i = 0;

            while (!found && i<this._stateboard.length) {
                if (this.board_strings_equal(this.board_to_string(), this._stateboard[i])) {
                    //console.log('yep');
                    if(this._count_state[i] === 2) {
                        this._is_finished = true;
                        return;
                    }
                    this._count_state[i]++;
                    found = true;
                } else {
                    ++i;
                }
            }
            if (!found) {
                    //console.log('nope');
                    this._stateboard.push(this.board_to_string());
                    this._count_state.push(1);
                }
            }

        //console.log('_stateboard_length ' + this._stateboard.length);

    }
    move(move) {
        let fromX = move.from().x();
        let fromY = move.from().y();

        let piece = this._board[fromX][fromY];
        piece.set_coordinates(move.to());

        this._board[move.to().x()][move.to().y()] = piece;
        this._board[fromX][fromY] = undefined;

        //console.log(move.to_string());
        //console.log(this.getStateString());
        this._check_winner(move);
        this._check_draw();
        if (!this.is_finished()) {
            this._change_color();
        }
    }

    _verify_moving(piece, x, y) {
        let possible_moves = this._get_possible_move_list(piece);
        let val = false;

        possible_moves.forEach(function(move) {
            if (move.to().x() === x && move.to().y() === y) {
                val = true;
            }
        });

        return val;
    }

    getStateString() {
        let state = "";
        for(let j=0; j<5; j++) {
            for(let i=0; i<5; i++) {
                let piece = this._board[i][j];
                if(piece === undefined) {
                    state += "-";
                }
                else {
                    state += piece.color();
                }
                state += " ";
            }
            state += "\n";
        }
        return state;
    }

    _set(isf, wc, b) {
        this._is_finished = isf;
        this._winner_color = wc;
        this._board = b;
    }

    _check_winner(move) {
        let x = move.to().x();
        let y = move.to().y();
        let color = this._board[x][y].color();
        // Define borders before checking
        let xLeft, xRight, yTop, yBot;
        xLeft = (x - 2 >= 0) ? x - 2 : 0;
        xRight = (x + 2 < 5) ? x + 2 : 4;
        yTop = (y - 2 >= 0) ? y - 2 : 0;
        yBot = (y + 2 < 5) ? y + 2 : 4;

        //console.log("Checking xLeft: "+ xLeft + " xRight: " + xRight + " yTop: " + yTop + " yBot: " + yBot);

        let count = 0;

        // Check in line
        for(let k=x+1; k<=xRight; k++) {
            if(this._board[k][y] === undefined) break;
            if(this._board[k][y].color() === color) count++;
            else break;
        }
        for(let k=x-1; k>=xLeft; k--) {
            if(this._board[k][y] === undefined) break;
            if(this._board[k][y].color() === color) count++;
            else break;
        }
        if(count >= 2) {
            this._winner_color = color;
            this._is_finished = true;
            console.log("winner: "+this._winner_color);
            return;
        }

        // Check in column
        count = 0;
        for(let l=y+1; l<=yBot; l++) {
            if(this._board[x][l] === undefined) break;
            if(this._board[x][l].color() === color) count++;
            else break;
        }
        for(let l=y-1; l>=yTop; l--) {
            if(this._board[x][l] === undefined) break;
            if(this._board[x][l].color() === color) count++;
            else break;
        }
        if(count >= 2) {
            this._winner_color = color;
            this._is_finished = true;
            console.log("winner: "+this._winner_color);
            return;
        }

        // Check in diag (Left Top) -> (Right Bot)
        count = 0;
        let k=x+1, l=y+1;
        while(k<=xRight && l<=yBot) {
            if(this._board[k][l] === undefined) break;
            if(this._board[k][l].color() === color) count++;
            else break;
            k++; l++;
        }
        k=x-1; l=y-1;
        while(k>=xLeft && l>=yTop) {
            if(this._board[k][l] === undefined) break;
            if(this._board[k][l].color() === color) count++;
            else break;
            k--; l--;
        }
        if(count >= 2) {
            this._winner_color = color;
            this._is_finished = true;
            console.log("winner: "+this._winner_color);
            return;
        }

        // Check in diag (Left Bot) -> (Right Top)
        count = 0;
        k=x-1; l=y+1;
        while(k>=xLeft && l<=yBot) {
            if(this._board[k][l] === undefined) break;
            if(this._board[k][l].color() === color) count++;
            else break;
            k--; l++;
        }
        k=x+1; l=y-1;
        while(k<=xRight && l>=yTop) {
            if(this._board[k][l] === undefined) break;
            if(this._board[k][l].color() === color) count++;
            else break;
            k++; l--;
        }
        if(count >= 2) {
            this._winner_color = color;
            this._is_finished = true;
            console.log("winner: "+this._winner_color);
        }
    }

    _change_color() {
        this._current_color = (this._current_color === Color.BLACK) ? Color.WHITE : Color.BLACK;
    }

}

export default Engine;