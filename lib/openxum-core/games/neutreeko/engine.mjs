// lib/openxum-core/games/neutreeko/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import Piece from './piece.mjs';
import Coordinates from './coordinates.mjs';
import Move from './move.mjs';

//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(type) {
       super();
       // Déclaration de tous les attributs nécessaires
        this._type = type;
        this._current_color = Color.BLACK;
        this._is_finished = false;
        this._winner_color = Color.NONE;
        this._initialize_board();
    }

    apply_moves(moves) {
       // Permet d'appliquer une liste de coups.
       // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
       // Permet de cloner le moteur de jeu.
       // Attention à bien dupliquer de tous les attributs.
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

        for(let x = 0; x < 5; x++) {
            for(let y = 0; y < 5; y++) {
                if (this._board[x][y] !== undefined) {
                    moves = moves.concat(this._get_possible_move_list(this._board[x][y]));
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

        for (let i = 0; i < 5; i++) {
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
            for(let x = pc.x() + 1; x < 5; x++) {
                if (this._board[x][pc.y()] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x, pc.y())));
                } else { break; }
            }

            // Left
            for(let x = pc.x() - 1; x >= 0; x--) {
                if (this._board[x][pc.y()] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x, pc.y())));
                } else { break; }
            }

            // Top
            for(let y = pc.y() - 1; y >= 0; y--) {
                if (this._board[pc.x()][y] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(pc.x(), y)));
                } else { break; }
            }

            // Bottom
            for(let y = pc.y()+1; y < 5 ; y++) {
                if (this._board[pc.x()][y] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(pc.x(), y)));
                } else { break; }
            }

            // Diag Bottom Right
            let  x = pc.x(), y = pc.y();
            for(let i = 1; x+i < 5 && y+i < 5; i++) {
                if (this._board[x+i][y+i] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x+i, y+i)));
                } else { break; }
            }

            // Diag Top Right
            for(let i = 1; x+i < 5 && y+i >= 0; i++) {
                if (this._board[x+i][y-i] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x+i, y-i)));
                } else { break; }
            }
            // Diag Bottom Left
            for(let i = 1; x-i >=0 && y+i < 5; i++) {
                if (this._board[x-i][y+i] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x-i, y+i)));
                } else { break; }
            }
            // Diag Top Left
            for(let i = 1; x-i >=0&& y+i >=0; i++) {
                if (this._board[x-i][y-i] === undefined) {
                    moves.push(new Move(piece.clone(), new Coordinates(x-i, y-i)));
                } else { break; }
            }
        }
        
        return moves;
    }

    move(move) {
        let fromX = move.from().x();
        let fromY = move.from().y();

        let piece = move.piece().clone();
        piece.set_coordinates(move.to());

        this._board[move.to().x()][move.to().y()] = piece;
        this._board[fromX][fromY] = undefined;

        console.log(this.getStateString());
        this._check_winner(move);

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
    
    _check_winner(move) {
        let color = move.piece().color();
        let x = move.to().x();
        let y = move.to().y();
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