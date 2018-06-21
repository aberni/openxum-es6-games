/**
 * Created by lcanonne on 20/06/18.
 */

import OpenXum from '../../openxum/engine.mjs';
import Color from './color.mjs';
import {is_color} from './color.mjs'
import Coordinates from './coordinates.mjs';
import Cell from './cell.mjs';
import Engine from './engine.mjs';
import Player from './player.mjs';
import Move from './move.mjs';

const MAX_DEPTH=2;

class Ia_alpha_beta {
    constructor(e) {
        this._engine=e.clone()
    }

    get_value(){
        let value=0;
        let player_human =this._engine.get_player_1();
        let player_ia = this._engine.get_player_2()
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
        let moves=this._engine.get_possible_moves();
        let value_of_moves=[moves.length];
        let ind_max=0;
        for(let i=0;i<moves.length;i+=1){
            value_of_moves[i]=create_node(moves[i],0,0,0);
            if(value_of_moves[i]>ind_max){
                ind_max=i;
            }
        }
        return moves[i];

    }

    create_node(move,player,depth,value){
        let color=this._engine.get_board().get_cell_by_id(move.get_to()).get_color();
        this._engine.move(move);
        let possibles_moves=this._engine.get_possible_moves();
        if(depth>=MAX_DEPTH && possibles_moves[0].get_to()==-1){
            return this.get_value();
        }
        let current_value;
        if(possibles_moves.length>1 && possibles_moves[0].get_to()!=-1){
            if(player===0){current_value=-101;}
            else{current_value=101;}
            for(let i=0;i<possibles_moves.length;i=i+1){
                let c = create_node(possibles_moves[i],player,depth,current_value);
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
            this._engine.set_color(Color.EMPTY);
            possibles_moves=this._engine.get_possible_moves();
            if(player===0){current_value=-101;}
            else{current_value=101;}
            for(let i=0;i<possibles_moves.length;i=i+1){
                let c = create_node(possibles_moves[i],(player+1)%2,depth+1,current_value);
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