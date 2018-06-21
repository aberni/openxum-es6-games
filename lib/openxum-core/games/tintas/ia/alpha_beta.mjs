/**
 * Created by lcanonne on 20/06/18.
 */

import OpenXum from '../../../openxum/engine.mjs';
import Color from '../color.mjs';
import {is_color} from '../color.mjs'
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

        let color=this._engine.get_board().apply_move(move); // applique le mouvement et on recupere la couleur 7 si mouv invalide
        this._engine.add_points(color); // ajoute les points au joueur courant si la couleur est valide

        if(depth>=MAX_DEPTH){
            return this.get_value(); // Si on est sur une feuille
        }

        if(!is_color(color)){ // Si la couleur vaut empty on passe au joueur suivant
            this._engine.change_player();
        }
        // La case etait bonne on teste si on peut rejouer
        let possibles_moves=this._engine.get_board().get_moves(color);
        

    }








    create_node(move,player,depth,value){

        if(move==[]){
            return;
        }
        this._engine.apply_moves(move);
        if(depth>=MAX_DEPTH){
            console.log("feuille value :");
            console.log(this.get_value());
            return this.get_value();
        }
        if()
        let color=this._engine.get_board().get_cell_by_id(move.get_to()).get_color();
        this._engine.move(move);
        this._engine.set_color(color);
        console.log(color);
        let possibles_moves=this._engine.get_possible_move_list();
        console.log(this._engine.get_possible_move_list());
        console.log("JOUEUR N: ",player);
        console.log("Profondeur :",depth);

        let current_value;
        if(possibles_moves.length>1 && possibles_moves[0].get_to()!=-1){
            console.log("MOUVEMENT POSSIBLE");
            if(player===0){current_value=-101;}
            else{current_value=101;}
            for(let i=0;i<possibles_moves.length;i=i+1){
                let c = this.create_node(possibles_moves[i],player,depth+1,current_value);
                if(player===1 && current_value<c){current_value=c;}
                else if(player===0 && current_value>c){current_value=c;}
                if(player===1 && current_value>value){
                    this._engine.undo_move(move,color);
                    return current_value;
                }
                if(player===0 && current_value<value){
                    this._engine.undo_move(move,color);
                    return current_value;
                }
            }
        }
        else{
            console.log("ON CHANGE DE JOUEUR");
            this._engine.set_color(Color.EMPTY);
            possibles_moves=this._engine.get_possible_move_list();
            if(player===0){current_value=-101;}
            else{current_value=101;}
            for(let i=0;i<possibles_moves.length;i=i+1){
                let c = this.create_node(possibles_moves[i],(player+1)%2,depth+1,current_value);
                if(player===1 && current_value<c){current_value=c;}
                else if(player===0 && current_value>c){current_value=c;}
                if(player===1 && current_value>value){
                    this._engine.undo_move(move,color);
                    return current_value;
                }
                if(player===0 && current_value<value){
                    this._engine.undo_move(move,color);
                    return current_value;
                }
            }
        }
        this._engine.undo_move(move,color);
        return current_value;
    }


 }


export default Ia_alpha_beta;