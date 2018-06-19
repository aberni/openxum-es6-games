// lib/openxum-core/games/lyngk/engine.mjs

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import {is_color} from './color.mjs'
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';
import Board from './board.mjs';
import Player from './player.mjs';
import Move from './move.mjs';
//import les autres classes dont vous avez besoin

class Engine extends OpenXum.Engine {
    constructor(type) {
        super();
        // Déclaration de tous les attributs nécessaires
        this._board=new Board();
        this._players=[0,0,0,0,0,0,0];
        this._player_1=[0,0,0,0,0,0,0];
        this._player_2=[0,0,0,0,0,0,0];
        this._current=Player.PLAYER_1;
        this._currentColor=Color.EMPTY;
        this._board.init_board();
    }

    apply_moves(moves) {
        let a;
        for(a=0;a<moves.length;a+=1){
            this._board.apply_move(moves[a]);
        }
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone() {
        let a;
        a=new Engine();
        a._board=this._board.clone();
        a._players=this._players;
        a._player_1=this._player_1;
        a._player_2=this._player_2;
        a._current=this._current;
        a._currentColor=this._currentColor;
        return a;
        // Permet de cloner le moteur de jeu.
        // Attention à bien dupliquer de tous les attributs.
    }

    get_board(){
        this._board;
    }

    current_color() {
        return this._current;
    }
    get_current_color() {
        console.log(this._current);
        return this._current;
    }

    get_name() {
        return "tintas";
    }

    get_possible_move_list() {
        return this._board.get_move(this._currentColor);
        // Retourne la liste de tous les coups possibles
        // La liste retournée doit être un tableau d'objet Move.
    }

    is_finished() {

        for(let i=0;i<7;i+=1){
            if(this._player_1[i]===7){
                return true;
            }
        }

        for(let i=0;i<7;i+=1){
            if(this._player_2[i]===7){
                return true;
            }
        }

        let pile_max=0;
        for(let i=0;i<7;i=i+1){
            if(this._player_1[i]>=4){
                pile_max+=1;
            }
            if(this._player_1[i]<1){
                break;
            }
        }

        if(pile_max>=4){
            return true;
        }

        pile_max=0;
        for(let i=0;i<7;i=i+1){
            if(this._player_2[i]>=4){
                pile_max+=1;
            }
            if(this._player_2[i]<1){
                break;
            }
        }
        if(pile_max>=4){
            return true;
        }

        return false;
    }

    add_points(color){
        if(this._current==Player.PLAYER_1){
            this._player_1[color]+=1;
        }
        else if(this._current==Player.PLAYER_2){
            this._player_2[color]+=1;
        }
    }


    move(move) {
        if (move.get_from() === -1 && move.get_to() === -1) {
            this.changePlayer();
            return;
        }

        if (move.get_to() === 50) {
            this.changePlayer();
            this._currentColor = this._board.apply_move(move);
            return;
        }

        if (move.get_from() === 49) {
            this._currentColor = this._board.apply_move(move);
            this.add_points(this._currentColor);
            this.changePlayer();
            return;
        }

        this._currentColor = this._board.apply_move(move);
        if (is_color(this._currentColor)) {
            this.add_points(this._currentColor);
        }
        let list = this.get_possible_move_list();
        if(list.length===1 && list[0].get_from()===-1 && list[0].get_to()===-1) {
            this.move(new Move(-1, -1));
        }
    }

    changePlayer(){
        this._currentColor=Color.EMPTY;
        if(this._current===Player.PLAYER_1){
            this._current=Player.PLAYER_2;
        }
        else{
            this._current=Player.PLAYER_1;
        }
    }
    parse(str) {
        let i=0;
        let indice=0;
        while(indice<49){
            switch (str[i]) {
                case "0":
                    this._board.get_cell_by_id(indice).set_color(Color.YELLOW);
                    indice+=1;
                    break;
                case "1":
                    this._board.get_cell_by_id(indice).set_color(Color.GREEN);
                    indice+=1;
                    break;
                case "2":
                    this._board.get_cell_by_id(indice).set_color(Color.BLUE);
                    indice+=1;
                    break;
                case "3":
                    this._board.get_cell_by_id(indice).set_color(Color.RED);
                    indice+=1;
                    break;
                case "4":
                    this._board.get_cell_by_id(indice).set_color(Color.ORANGE);
                    indice+=1;
                    break;
                case "5":
                    this._board.get_cell_by_id(indice).set_color(Color.WHITE);
                    indice+=1;
                    break;
                case "6":
                    this._board.get_cell_by_id(indice).set_color(Color.PURPLE);
                    indice+=1;
                    break;
                case "7":
                    this._board.get_cell_by_id(indice).set_color(Color.EMPTY);
                    indice+=1;
                    break;
                case "8":
                    this._board.get_cell_by_id(indice).set_color(Color.PAWN);
                    indice+=1;
                    break;
                case "-1":
                    this._board.get_cell_by_id(indice).set_color(Color.UNDEFINED);
                    indice+=1;
                    break;
                case "\n":
                    break;
                default:
                    console.log('Error to read value in parse method');
            }
            i+=1;
        }
        for (let r; i < 7; i += 1) {
            this._player_1[r]=str[i];
            i+=1;
        }
        for (let e; i < 7; i += 1) {
            this._player_2[e]=str[i];
            i+=1;
        }
        this._currentPlayer=str[i];
        i++;
        this._currentColor=str[i];

        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    to_string() {
        let result = "";
        let tmp = 0;
        for (let i = 0; i < 49; i += 1) {
            tmp = this.board.get_cell_by_id(i);
            switch (tmp) {
                case Color.YELLOW:
                    result += "0" + "\n";
                    break;
                case Color.GREEN:
                    result += "1" + "\n";
                    break;
                case Color.BLUE:
                    result += "2" + "\n";
                    break;
                case Color.RED:
                    result += "3" + "\n";
                    break;
                case Color.ORANGE:
                    result += "4" + "\n";
                    break;
                case Color.WHITE:
                    result += "5" + "\n";
                    break;
                case Color.PURPLE:
                    result += "6" + "\n";
                    break;
                case Color.EMPTY:
                    result += "7" + "\n";
                    break;
                case Color.PAWN:
                    result += "8" + "\n";
                    break;
                case Color.UNDEFINED:
                    result += "-1" + "\n";
                    break;
                default:
                    console.log('Error to read tmp value in to_string method');
            }

        }
        for (let i; i < 7; i += 1) {
         result+=this._player_1[i]+"\n";
        }
        for (let e; i < 7; i += 1) {
            result+=this._player_2[e]+"\n";
        }
        result+=this._currentPlayer+"\n";
        result+=this._currentColor+"\n";
        return result;
    }

    winner_is() {

        for(let i=0;i<7;i+=1){
            if(this._player_1[i]===7){
                return Player.PLAYER_1;
            }
        }

        for(let i=0;i<7;i+=1){
            if(this._player_2[i]===7){
                return Player.PLAYER_2;
            }
        }

        let pile_max=0;
        for(let i=0;i<7;i=i+1){
            if(this._player_1[i]>=4){
                pile_max+=1;
            }
            if(this._player_1[i]<1){
                break;
            }
        }

        if(pile_max>=4){
            return Player.PLAYER_1;
        }

        pile_max=0;
        for(let i=0;i<7;i=i+1){
            if(this._player_2[i]>=4){
                pile_max+=1;
            }
            if(this._player_2[i]<1){
                break;
            }
        }
        if(pile_max>=4){
            return Player.PLAYER_2;
        }

        return false;
    }

}

export default Engine;