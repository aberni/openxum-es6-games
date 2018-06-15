"use strict";

import OpenXum from '../../openxum/gui.mjs';
import * as myColor from '../../../openxum-core/games/tintas/color.mjs';
import Engine from '../../../openxum-core/games/tintas/engine.mjs';
import Move from '../../../openxum-core/games/tintas/move.mjs';
// ...

const begin_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_number = [1, 1, 1, 1, 1, 2, 3, 4, 5];
const end_number = [5, 6, 7, 8, 9, 9, 9, 9, 9];
const begin_diagonal_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_diagonal_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_diagonal_number = [5, 4, 3, 2, 1, 1, 1, 1, 1];
const end_diagonal_number = [9,  9, 9, 9, 9, 8, 7, 6, 5];

// enums definition
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        // Vos attributs...
        this._coord = [];
        this._dimension=0;
        this._r=0;
        this._c=0;
        this._played=false;
        this._pawn=49;
        this._id=49;


    }
    current_color(){
        return this.engine().get_current_color();
    }
    draw() {
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#A47940";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height,17,true,true);

        // implémenter le reste du rendu ici
        this._draw_grid();
    }

    _draw_grid() {
        let _pt_begin;
        let _pt_end;

        this._dimension=this._width;
        this._r=this._dimension/14;
        this._c=this._r*Math.sin(Math.PI/3)/2;


        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#FEECAE";

        for (let l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            let index = l - 'A'.charCodeAt(0);

            _pt_begin = this._compute_coordinates(l, begin_number[index]);
            _pt_end = this._compute_coordinates(l, end_number[index]);
            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (let n = 1; n < 10; ++n) {
            _pt_begin = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = this._compute_coordinates(end_letter[n - 1].charCodeAt(0), n);
            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (let i = 0; i < 9; ++i) {
            _pt_begin = this._compute_coordinates(begin_diagonal_letter[i].charCodeAt(0),
                begin_diagonal_number[i]);
            _pt_end = this._compute_coordinates(end_diagonal_letter[i].charCodeAt(0),
                end_diagonal_number[i]);
            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
        }

        this._context.stroke();


        let nbHexa=[0,2,2,2,3,3,3,4,3,3,3,2,2,2,0];

        let x = [(1/2)*this._dimension-(3/2)*this._r, (1/2)*this._dimension-3*this._r,
            (1/2)*this._dimension-(3/2)*this._r, (1/2)*this._dimension-3*this._r, (1/2)*this._dimension-(9/2)*this._r,
            this._r, (5/2)*this._r, this._r, (5/2)*this._r, 4*this._r, (5/2)*this._r, 4*this._r, (5/2)*this._r, 4*this._r,(1/2)*this._dimension+(3/2)*this._r]
        let i;
        let y=this._r;
        let ind=0;
        let color;
        for(i=0;i<15;i+=1){
            color =myColor.convert_to_hexa(this.engine()._board.get_cell_by_id(ind).get_color());
            let xb=x[i];
            this._draw_hexagone(xb, y,color);
            let j;
            ind+=1;
            for(j=0;j<nbHexa[i];j+=1) {
                color =myColor.convert_to_hexa(this.engine()._board.get_cell_by_id(ind).get_color());
                ind+=1;
                xb+=3*this._r;
                this._draw_hexagone(xb, y,color);
            }
            y = y + this._r*Math.sin(Math.PI/3);
        }
    }

    _draw_hexagone(x, y,color){
        this._coord.push([x,y]);
        let i;
        let yy = [y, y+Math.sin((Math.PI/3))*this._r, y+Math.sin((Math.PI/3))*this._r, y,y-Math.sin((Math.PI/3))*this._r ,y-Math.sin((Math.PI/3))*this._r];
        let xx = [x+this._r,x+Math.cos((Math.PI/3))*this._r ,x-Math.cos((Math.PI/3))*this._r, x-this._r ,x-Math.cos((Math.PI/3))*this._r,x+Math.cos((Math.PI/3))*this._r ];
        this._context.strokeStyle="#795100";
        this._context.fillStyle = "#A47940";
        this._context.lineWidth = 2;
        this._context.beginPath();
        this._context.moveTo(xx[0],yy[0]);

        for(i=1;i<6;i=i+1) {
            this._context.lineTo(xx[i],yy[i]);
        }

        this._context.closePath();
        this._context.fill();
        this._context.stroke();
        //console.log("ok");
        this._context.fillStyle = color;
        this._context.beginPath();
        this._context.arc(x,y,this._c,0,Math.PI*2);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

    }

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();

        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
    }

    _in_circle(id,x,y){
        return Math.sqrt(Math.pow((x-this._coord[id][0]),2) + Math.pow(y-this._coord[id][1],2)) < this._c;
    }


    _get_id(x, y) {
        let rows = [[0],[1,2,3],[4,5,6],[7,8,9],[10,11,12,13],[14,15,16,17],[18,19,20,21],[22,23,24,25,26],
        [27,28,29,30],[31,32,33,34],[35,36,37,38],[39,40,41],[42,43,44],[45,46,47],[48]];

        let indice = Math.trunc((y-this._r+this._c)/(2*this._c));

        let tab=rows[indice];
       for(let i in tab){
            if (this._in_circle(tab[i],x,y)){
                return tab[i];
            }
        }

        return null;
    }

    _on_click(event) {
        //if ((this._engine.current_color() === this._color || this._gui) && !this._is_animating) {
        this._pawn=this._id;
        const pos = this._get_click_position(event); // pos of the mouse
            let id = this._get_id(pos.x, pos.y);
            if (id || id=='0') {
                console.log(id);
                if(!this._played){
                    this._played=true;
                    this._id=id;
                    this._manager.play();
                }
            }
        //}

    }



    _compute_coordinates(letter, number) {
       return [this._offset + (letter - 'A'.charCodeAt(0)) * this._delta_x,
           7 * this._delta_y + this._delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * this._delta_y];
    }

    _round_rect(x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        this._context.beginPath();
        this._context.moveTo(x + radius, y);
        this._context.lineTo(x + width - radius, y);
        this._context.quadraticCurveTo(x + width, y, x + width, y + radius);
        this._context.lineTo(x + width, y + height - radius);
        this._context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this._context.lineTo(x + radius, y + height);
        this._context.quadraticCurveTo(x, y + height, x, y + height - radius);
        this._context.lineTo(x, y + radius);
        this._context.quadraticCurveTo(x, y, x + radius, y);
        this._context.closePath();
        if (stroke) {
            this._context.stroke();
        }
        if (fill) {
            this._context.fill();
        }
    }



    get_move() {
        return new Move(this._pawn, this._id);
        // Retourne le mouvement à effectuer par le manager pour le tour actuel
        // Un objet de type Move doit être construit ; si ce n'est pas le cas,
        // alors la méthode process_move sera invoquée
    }

    is_animate() {
        // Retourne true si le coup provoque des animations
        // (déplacement de pions, par exemple).
        return false;
    }

    is_remote() {
        // Indique si un joueur joue à distance
        return false;
    }

    move(move, color) {
        this._manager.play();
        // TODO !!!!!
    }

    unselect() {
        // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
        this._played=true;
    }

    set_canvas(c) {
        super.set_canvas(c);

        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
        this._canvas.addEventListener("click", (e) => {
            this._on_click(e);
        });
    }
}

export default {
    Gui: Gui
};