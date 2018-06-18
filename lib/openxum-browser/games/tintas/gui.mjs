"use strict";

import OpenXum from '../../openxum/gui.mjs';
import * as myColor from '../../../openxum-core/games/tintas/color.mjs';
import Engine from '../../../openxum-core/games/tintas/engine.mjs';
import Move from '../../../openxum-core/games/tintas/move.mjs';
import Player from '../../../openxum-core/games/tintas/player.mjs';
// ...

const rows = [[0],[1,2,3],[4,5,6],[7,8,9],[10,11,12,13],[14,15,16,17],[18,19,20,21],[22,23,24,25,26],
    [27,28,29,30],[31,32,33,34],[35,36,37,38],[39,40,41],[42,43,44],[45,46,47],[48]]; // cells id of each row
const nb_hexa=[0,2,2,2,3,3,3,4,3,3,3,2,2,2,0]; //number of cell for each rows - 1

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
        this._current=Player.PLAYER_1;
    }

    draw() { // final version
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#A47940";

        // draw the border of the board
        this._round_rect(0, 0, this._canvas.width, this._canvas.height,17,true,true);

        // implémenter le reste du rendu ici
        this._draw_grid();
    }

    _draw_grid() {

        this._dimension=this._width;
        this._r=this._dimension/14;
        this._c=this._r*Math.sin(Math.PI/3)/2;

        // draw 49 cells

        // x coordinate of the first cell of each row
        let x = [(1/2)*this._dimension-(3/2)*this._r, (1/2)*this._dimension-3*this._r,
            (1/2)*this._dimension-(3/2)*this._r, (1/2)*this._dimension-3*this._r, (1/2)*this._dimension-(9/2)*this._r,
            this._r, (5/2)*this._r, this._r, (5/2)*this._r, 4*this._r, (5/2)*this._r, 4*this._r, (5/2)*this._r, 4*this._r,(1/2)*this._dimension+(3/2)*this._r]
        let y=this._r; // get the y coord of the first cell
        let yT=this._r*Math.sin(Math.PI/3); // get the difference between two consecutives cell (y)

        let ind=0;
        for(let i=0;i<15;i+=1){ // for each row
            let xb=x[i]; // get the x coord of the first cell
            this._draw_cell(xb, y,myColor.convert_to_hexa(this.engine()._board.get_cell_by_id(ind).get_color())); // draw the ind-th cell
            ind+=1;
            for(let j=0;j<nb_hexa[i];j+=1) { // for each cell on the i-th row (except the first which is already designed)
                xb+=3*this._r; // the x coordinate of the next cell
                this._draw_cell(xb, y,myColor.convert_to_hexa(this.engine()._board.get_cell_by_id(ind).get_color()));
                ind+=1;
            }
            y = y + yT; // the y coordinate of the next row
        }
    }



    _draw_cell(x, y,color){ // final version
        //add the coordinates of the cell.
        this._coord.push([x,y]);

        this._draw_hexagone(x,y);

        this._draw_circle(color,x,y);
    }

    _draw_hexagone(x,y){
        // x and y coordinate of each points of the hexagone
        let yy = [y, y+Math.sin((Math.PI/3))*this._r, y+Math.sin((Math.PI/3))*this._r, y,y-Math.sin((Math.PI/3))*this._r ,y-Math.sin((Math.PI/3))*this._r];
        let xx = [x+this._r,x+Math.cos((Math.PI/3))*this._r ,x-Math.cos((Math.PI/3))*this._r, x-this._r ,x-Math.cos((Math.PI/3))*this._r,x+Math.cos((Math.PI/3))*this._r ];

        // draw the hexagone
        this._context.strokeStyle="#795100";
        this._context.fillStyle = "#A47940";
        this._context.lineWidth = 2;
        this._context.beginPath();
        this._context.moveTo(xx[0],yy[0]);
        for(let i=1;i<6;i=i+1) {
            this._context.lineTo(xx[i],yy[i]);
        }
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
    }

    _draw_circle(color,x,y){
        this._context.fillStyle = color;
        this._context.beginPath();
        this._context.arc(x,y,this._c,0,Math.PI*2);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
    }

    _get_click_position(e) { // get the x and y coordinates of a click
        let rect = this._canvas.getBoundingClientRect();
        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
    }

    _in_circle(id,x,y){ // return true if the point is in the cell number id, else false,
        return Math.sqrt(Math.pow((x-this._coord[id][0]),2) + Math.pow(y-this._coord[id][1],2)) < this._c;
    }


    _get_id(x, y) { // return the id of the cell based on coordinates of the click

        let indice = Math.trunc((y-this._r+this._c)/(2*this._c)); // get the row where the player clicked


        let tab=rows[indice]; // get the cell on the row
        for(let i in tab){ // for each cell on the row
            if (this._in_circle(tab[i],x,y)){ // if the click is on a cell
                return tab[i]; // return the id of the cell
            }
        }
        return null;
    }

    _on_click(event) {
        //if ((this._engine.current_color() === this._color || this._gui) && !this._is_animating) {
        this._pawn=this._id;
        const pos = this._get_click_position(event); // pos of the mouse
        let id = this._get_id(pos.x, pos.y);
        if (id || id==='0') {
            console.log(id);
            if(!this._played){
                this._played=true;
                this._id=id;
                this._manager.play();
            }
        }
        //}

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



    color(){
        return Player.PLAYER_1;
    }

    get_move() {
        let a= new Move(this._pawn, this._id);
        return a;
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