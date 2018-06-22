/**
 * Created by lcanonne on 20/06/18.
 */

import OpenXum from '../../../openxum/engine.mjs';
import Color from '../color.mjs';
import Coordinates from '../coordinates.mjs';
import Cell from '../cell.mjs';
import Engine from '../engine.mjs';
import Player from '../player.mjs';
import Move from '../move.mjs';
import {is_color} from '../color.mjs'


const MAX_DEPTH=5;

class Ia_alpha_beta {
    constructor(c,e) {
        this._engine=e.clone();
    }

    get_value(){ //ok
        let value=0;
        let player_human =this._engine.get_player_1();
        let player_ia = this._engine.get_player_2();
        for(let i=0;i<7;i+=1){
            if(player_ia[i]>3 && player_human[i]>0){
                value+=25;
            }
            else if(player_human[i]>3 && player_ia[i]>0){
                value-=25;
            }
            else if(player_human[i]>0 && player_ia[i]<1){
                let x=player_human[i];
                value+=(x*(95*x-65))/42;
            }
            else if(player_ia[i]>0 && player_human[i]<1){
                let x=player_ia[i];
                value-=(x*(95*x-65))/42;
            }
        }
        return value;
    }

    ia_play(){
        let player=0;
        let value=0;
        let moves=this._engine.get_possible_move_list();
        let value_of_moves=new Array(moves.length);
        let ind_max=0;
        for(let i=0;i<moves.length;i+=1){
            value_of_moves[i]=this.create_node(moves[i],0,0);
            if(value_of_moves[i]>ind_max){
                ind_max=i;
            }
        }
        return moves[ind_max];

    }


    create_node(move,depth,value){

        console.log(move);

        let change_player=0;

        let player=this._engine.get_current_color(); // player du noeud courant

        let color=this._engine.get_board().apply_move(move); // applique le mouvement et on recupere la couleur 7 si mouv invalide
        this._engine.add_points(color); // ajoute les points au joueur courant si la couleur est valide

        console.log("Profondeur:",depth);

        if(depth>=MAX_DEPTH){
            return this.get_value(); // Si on est sur une feuille
        }

        if(!is_color(color)){ // Si la couleur vaut empty on passe au joueur suivant pour les prochaines noeuds
            this._engine.change_player();
            change_player=1;
        }

        // La case etait bonne on teste si on peut rejouer ou le cas echeant ou cherche les coups du joueur suivant
        let possibles_moves=this._engine.get_board().get_move(color);

        let current_value;

        if(player===1){current_value=-1001;}
        else{current_value=1001;}

        for(let i=0;i<possibles_moves.length;i=i+1){

            let c = this.create_node(possibles_moves[i],depth+1,current_value);

            if(player===1 && current_value<c){current_value=c;}
            else if(player===0 && current_value>c){current_value=c;}
            /*
             if(this._engine.get_current_color()===1 && current_value>value){
             this._engine.undo_move(move,color);
             if(change_player){
             this._engine.change_player();
             }
             return current_value;
             }
             if(this._engine.get_current_color()===0 && current_value<value){
             this._engine.undo_move(move,color);
             if(change_player){
             this._engine.change_player();
             }
             return current_value;
             }*/
        }
        this._engine.undo_move(move,color);
        if(change_player){
            this._engine.change_player();
        }

        console.log("la couleur du joueur du noeud :",player);

        console.log("valeur du noeud :",current_value);

        return current_value;

    }

 }


export default Ia_alpha_beta;