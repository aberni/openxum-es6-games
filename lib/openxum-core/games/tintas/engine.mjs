// lib/openxum-core/games/lyngk/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';
import Board from './board.mjs';
import Player from './player.mjs';
//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(type) {
        super();
        // Déclaration de tous les attributs nécessaires
        this._board=new Board();
        this._players=[];
        this._players[Player.PLAYER_1]=[];
        this._players[Player.PLAYER_2]=[];
        this._current=Player.PLAYER_1;
        this._currentColor=Color.UNDEFINED;
        //this._board._createBoard();
        //this._board.test1();
    }

    apply_moves(moves) {
        let a;
        for(a in moves){
            this.move(a);
        }
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        let a;
        a=new Engine();
        a._board=this._board.clone();
        a._players=this._players;
        a._players[Player.PLAYER_1]=this._players[Player.PLAYER_1];
        a._players[Player.PLAYER_2]=this._players[Player.PLAYER_2];
        a._current=this._current;
        a._currentColor=this._currentColor;
        return a;
        // Permet de cloner le moteur de jeu.
        // Attention à bien dupliquer de tous les attributs.
    }

    current_color() {
        return this.current;
    }

    get_name() {
        return "tintas";
    }

    get_possible_move_list() {
        return this._board.get_move_test();
        // Retourne la liste de tous les coups possibles
        // La liste retournée doit être un tableau d'objet Move.
    }

    is_finished() {
        for(let i=0;i<7;i+=1){
            if(this._players[Player.PLAYERS_1][i]==7){
                return true;
            }
        }

        for(let i=0;i<7;i+=1){
            if(this._players[Player.PLAYERS_2][i]==7){
                return true;
            }
        }

        if(grille.full()==true){
            return true;
        }

        return false;
    }

    move(move) {
        let tab=this._board.get_move(this._current);
        console.log(move);
        for(let a=0;a<tab.length;a+=1) {
            if (move.get_to()==tab[a].get_to() && move.get_from == tab[a].get_from){
                //this._currentColor = this._board.get_cell_by_coord(move.get_to()).get_color();
                this._board.apply_move(move);
            }
        }
        this._current=move.get_to();
        this.changePlayer();
        for(let i=0;i<tab.length;i=i+1){
            /*
            if(this._board.get_cell_by_coord(tab[i].get_to()).get_color()==this._currentColor){
                this.changePlayer();
            }
            */
        }
    }

    changePlayer(){
        if(this._currentPlayer==Player.PLAYER_1){
            this._currentPlayer=Player.PLAYER_2;
        }
        if(this._currentPlayer==Player.PLAYER_2){
            this._currentPlayer=Player.PLAYER_1;
        }
    }
    parse(str) {
        let i=0;
        while(str[i]!=null){
            switch (str[i]) {
                case "0":
                    this._board.get_cell_by_id(i).set_color(Color.YELLOW);
                    break;
                case "1":
                    this._board.get_cell_by_id(i).set_color(Color.GREEN);
                    break;
                case "2":
                    this._board.get_cell_by_id(i).set_color(Color.BLUE);
                    break;
                case "3":
                    this._board.get_cell_by_id(i).set_color(Color.RED);
                    break;
                case "4":
                    this._board.get_cell_by_id(i).set_color(Color.ORANGE);
                    break;
                case "5":
                    this._board.get_cell_by_id(i).set_color(Color.WHITE);
                    break;
                case "6":
                    this._board.get_cell_by_id(i).set_color(Color.PURPLE);
                    break;
                case "7":
                    this._board.get_cell_by_id(i).set_color(Color.EMPTY);
                    break;
                case "8":
                    this._board.get_cell_by_id(i).set_color(Color.PAWN);
                    break;
                case "-1":
                    this._board.get_cell_by_id(i).set_color(Color.UNDEFINED);
                    break;
                default:
                    console.log('Error to read value in parse method');
            }
            

        }
        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    to_string() {
        let result="";
        let tmp=0;
        for(let i=0;i<49;i+=1){
            tmp=this.board.get_cell_by_id(i);
            switch (tmp) {
                case Color.YELLOW:
                    result+="0"+"\n";
                    break;
                case Color.GREEN:
                    result+="1"+"\n";
                    break;
                case Color.BLUE:
                    result+="2"+"\n";
                    break;
                case Color.RED:
                    result+="3"+"\n";
                    break;
                case Color.ORANGE:
                    result+="4"+"\n";
                    break;
                case Color.WHITE:
                    result+="5"+"\n";
                    break;
                case Color.PURPLE:
                    result+="6"+"\n";
                    break;
                case Color.EMPTY:
                    result+="7"+"\n";
                    break;
                case Color.PAWN:
                    result+="8"+"\n";
                    break;
                case Color.UNDEFINED:
                    result+="-1"+"\n";
                    break;
                default:
                    console.log('Error to read tmp value in to_string method');
            }

        }
        return result;
    }

    winner_is() {
        let player1=0;
        let player2=0;
        

        for(let i=0;i<7;i+=1){
            if(this._players[Player.PLAYERS_1][i]==7){
                return Player.PLAYERS_1;
            }
            if(this._players[Player.PLAYERS_1][i]>=4){
                player1+=1;
            }
        }

        for(let i=0;i<7;i+=1){
            if(this._players[Player.PLAYERS_2][i]==7){
                return Player.PLAYERS_2;
            }
            if(this._players[Player.PLAYERS_2][i]>=4){
                player2+=1;
            }
        }

        if(player1<player2){
            return Player.PLAYERS_1;
        }

        return Player.PLAYERS_2;
    }

}

export default Engine;