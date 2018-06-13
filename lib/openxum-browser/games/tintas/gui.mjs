"use strict";

import OpenXum from '../../openxum/gui.mjs';
// ...

const begin_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_number = [1, 1, 1, 1, 1, 2, 3, 4, 5];
const end_number = [5, 6, 7, 8, 9, 9, 9, 9, 9];
const begin_diagonal_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_diagonal_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const begin_diagonal_number = [5, 4, 3, 2, 1, 1, 1, 1, 1];
const end_diagonal_number = [9, 9, 9, 9, 9, 8, 7, 6, 5];

// enums definition
const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        // Vos attributs...
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

        let dimension=this._width;
        let r=dimension/14;

        //this._draw_background();

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

        let x = [(1/2)*dimension-(3/2)*r, (1/2)*dimension-3*r,
            (1/2)*dimension-(3/2)*r, (1/2)*dimension-3*r, (1/2)*dimension-(9/2)*r,
            r, (5/2)*r, r, (5/2)*r, 4*r, (5/2)*r, 4*r, (5/2)*r, 4*r,(1/2)*dimension+(3/2)*r]
        let i;
        let y=r;
        for(i=0;i<15;i+=1){
                this._draw_hexagone(x[i], y, r);
                let j;
                let xb=x[i];
                for(j=0;j<nbHexa[i];j+=1) {
                    xb+=3*r;
                    this._draw_hexagone(xb, y, r);
                }
            y = y + r * (Math.sin(Math.PI / 3));
        }
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

    _draw_hexagone(x, y, r){
        let i;
         let yy = [y, y+Math.sin((Math.PI/3))*r, y+Math.sin((Math.PI/3))*r, y,y-Math.sin((Math.PI/3))*r ,y-Math.sin((Math.PI/3))*r];
        let xx = [x+r,x+Math.cos((Math.PI/3))*r ,x-Math.cos((Math.PI/3))*r, x-r ,x-Math.cos((Math.PI/3))*r,x+Math.cos((Math.PI/3))*r ];
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

        //this._context.strokeStyle="rgb(23,145,167)";
        this._context.fillStyle = "#D80101";
        this._context.beginPath();
        this._context.arc(x,y,r/2,0,Math.PI*2);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
/*
        this._context.strokeStyle = "rgb(23, 145, 167)";
        this._context.beginPath();
        this._context.moveTo(20, 20); // 1er point
        this._context.lineTo(130, 20); // 2e point
        this._context.closePath(); // On relie le 5e au 1er
        this._context.stroke();
        */
    }

    get_move() {
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
    }

    set_canvas(c) {
        super.set_canvas(c);

        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    }
}

export default {
    Gui: Gui
};