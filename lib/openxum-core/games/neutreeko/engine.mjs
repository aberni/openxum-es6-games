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
        this._first_color = first_color;
        this._opponent_color = Color.WHITE;
        this._is_finished = false;
        this._winner_color = Color.NONE;
        this._stateboard = [];
        this._count_state = [];
        this._pawns = [];

        this._initialize_board();
    }

    first_color() {
        return this._first_color;
    }

    opponent_color() {
        return this._opponent_color;
    }

    clone() {
        // Permet de cloner le moteur de jeu.
        let o = new Engine(this._type, this._first_color);

        o._is_finished = this._is_finished;
        o._winner_color = this._winner_color;
        o._current_color = this._current_color;

        for(let j=0; j<5; j++) {
            for(let i=0; i<5; i++) {
                if (this._board[i][j] !== undefined) {
                    o._board[i][j] = this._board[i][j].clone();
                } else {
                    o._board[i][j] = undefined;
                }
            }
        }

        for(let i=0; i<this._pawns.length; i++) {
            for(let j=0; j<this._pawns[i].length; j++) {
                o._pawns[i][j] = this._pawns[i][j].clone();
            }
        }

        for(let i=0; i<this._stateboard.length; i++) {
            o._stateboard.push(this._stateboard[i]);
        }

        for(let i=0; i<this._count_state.length; i++) {
            o._count_state.push(this._count_state[i]);
        }

        return o;
    }

    apply_moves(moves) {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
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

        let indexPlayer;
        if(this._first_color === this.current_color()) {
            indexPlayer = 0;
        } else {
            indexPlayer = 1;
        }

        for(let i=0; i<3; i++) {
            moves = moves.concat(this._get_possible_move_list(this._pawns[indexPlayer][i]));
            /*
            let possible_moves = );
            console.log('nombre de coups possibles: '+possible_moves.length);

            console.log(this._pawns[indexPlayer][i].to_string() + " possible_moves: ");
            possible_moves.forEach(function(element) {
                console.log(element.to_string());
            });

            moves = moves.concat(possible_moves);
            */
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

        this._pawns = new Array(2); // Two players
        // Three pawns per player
        this._pawns[0] = new Array(3);
        this._pawns[1] = new Array(3);

        this._pawns[0][0] = new Piece(this._first_color, new Coordinates(2, 1));
        this._pawns[0][1] = new Piece(this._first_color, new Coordinates(1, 4));
        this._pawns[0][2] = new Piece(this._first_color, new Coordinates(3, 4));

        this._pawns[1][0] = new Piece(this._opponent_color, new Coordinates(1, 0));
        this._pawns[1][1] = new Piece(this._opponent_color, new Coordinates(3, 0));
        this._pawns[1][2] = new Piece(this._opponent_color, new Coordinates(2, 3));

        this._board[2][1] = this._pawns[0][0].clone();
        this._board[1][4] = this._pawns[0][1].clone();
        this._board[3][4] = this._pawns[0][2].clone();

        this._board[1][0] = this._pawns[1][0].clone();
        this._board[3][0] = this._pawns[1][1].clone();
        this._board[2][3] = this._pawns[1][2].clone();


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
            x= pc.x(); y=pc.y();
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
        let piece = this._board[move.from().x()][move.from().y()];
        //console.assert(piece !== undefined, 'no piece at '+move.from().formate());
        //console.assert(piece.color() === this.current_color(), 'piece at '+move.to().formate()+' is '+piece.color()+' expected:'+this.current_color());

        let indexPlayer;
        if(this._first_color === piece.color()) {
            indexPlayer = 0;
        } else {
            indexPlayer = 1;
        }
        for(let i=0; i<3; i++) {
            if(this._pawns[indexPlayer][i].equals(piece)) {
                this._pawns[indexPlayer][i].set_coordinates(move.to());
            }
        }

        piece.set_coordinates(move.to());

        this._board[move.to().x()][move.to().y()] = piece.clone();
        this._board[move.from().x()][move.from().y()] = undefined;

        //console.log(move.to_string());
        //console.log(this.getStateString());
        this._check_winner(move);
        this._check_draw();
        if (!this.is_finished()) {
            this._change_color();
        }
    }

    undo_move(move) {
        //let oldcurrent = this.current_color();
        if(this.is_finished()) {
            this._is_finished = false;
            this._winner_color = Color.NONE;
        } else {
            this._change_color();
        }
        //console.log('undo: current player from '+oldcurrent+' to '+this.current_color());

        let piece = this._board[move.to().x()][move.to().y()].clone();
        //console.assert(piece !== undefined, 'no piece at '+move.to().formate());
        //console.assert(piece.color() === this.current_color(), 'piece at '+move.to().formate()+' is '+piece.color()+' expected:'+this.current_color());

        let indexPlayer;
        if(this._first_color === this.current_color()) {
            indexPlayer = 0;
        } else {
            indexPlayer = 1;
        }
        for(let i=0; i<3; i++) {
            if(this._pawns[indexPlayer][i].equals(piece)) {
                this._pawns[indexPlayer][i].set_coordinates(move.from());
            }
        }

        piece.set_coordinates(move.from());

        this._board[move.from().x()][move.from().y()] = piece;
        this._board[move.to().x()][move.to().y()] = undefined;

        let found = false;
        let i = 0;

        while (!found && i<this._stateboard.length) {
            if (this.board_strings_equal(this.board_to_string(), this._stateboard[i])) {
                if(this._count_state[i] === 1) {
                    this._count_state.splice(i, 1);
                    this._stateboard.splice(i, 1);
                } else {
                    this._count_state[i]--;
                }
                found = true;
            } else {
                ++i;
            }
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
            //console.log("winner: "+this._winner_color);
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
            //console.log("winner: "+this._winner_color);
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
            //console.log("winner: "+this._winner_color);
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
            //console.log("winner: "+this._winner_color);
        }
    }

    _change_color() {
        this._current_color = (this._current_color === this._first_color) ? this._opponent_color : this._first_color;
    }

}

export default Engine;