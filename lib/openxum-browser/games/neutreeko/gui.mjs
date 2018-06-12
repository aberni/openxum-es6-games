// lib/openxum-browser/games/neutreeko/gui.mjs
"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Neutreeko from '../../../openxum-core/games/neutreeko/index.mjs'

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._move = undefined;
        this._selected_piece = undefined;
    }

   draw() {
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
           this._context.lineWidth = 1;

           // background
           this._context.fillStyle = "#0000A2";
           this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);
           this._draw_grid();
           this._draw_state();

       // implémenter le reste du rendu ici
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

    unselect() {
        // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
    }

    set_canvas(c) {
        super.set_canvas(c);

        // Ajouts des événements
        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => {
            // ...
        });

        this._deltaX = (this._canvas.width ) / 5;
        this._deltaY = (this._canvas.height ) / 5;
        //this._offsetX = this._canvas.width / 2 - this._deltaX * 3;
        //this._offsetY = this._canvas.height / 2 - this._deltaY * 3;
        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    }
    move() {

    }

    _round_rect(x, y, width, height, radius, fill, stroke) {
        this._context.clearRect(x,y, width, height);
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

    _draw_grid() {
        let i, j;

        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#cfcfd4";
        for (i = 0; i < 5; ++i) {
            for (j = 0; j < 5; ++j) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + j * this._deltaY);
                this._context.lineTo(this._offsetX + (i + 1) * this._deltaX - 2, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.lineTo(this._offsetX + i * this._deltaX, this._offsetY + (j + 1) * this._deltaY - 2);
                this._context.moveTo(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY);

                this._context.closePath();
                this._context.fill();


            }
        }
    }

    _draw_state() {
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                if (this._engine._board[x][y] !== undefined) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                }
            }
        }

        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }
    }

    _draw_piece(x, y, piece) {
        let radius = (this._deltaX / 2.3);

        if (piece.color() === Neutreeko.Color.BLACK) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
        }
        else {
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";
        }

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

    }
    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

}


export default {
  Gui: Gui
};