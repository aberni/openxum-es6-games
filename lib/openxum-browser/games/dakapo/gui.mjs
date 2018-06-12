"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        // Vos attributs...
        this._offsetX = 0;
        this._offsetY = 0;
        this._deltaX = 0;
        this._deltaY = 0;
    }

   draw() {
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)
        this._context.lineWidth = 1;

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#FFFFFF";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        this._draw_grid(); // Dessiner le plateau
        //this._draw_coordinates(); // Dessiner les coordonnées
        //this._draw_state(); // Dessiner les pièces
        //this._draw_stack(); // Dessiner la pile de l'intersection sélectionnée
        //this._draw_claimed_colors(); // Dessiner les couleurs réclamées par les joueurs
        //this._draw_possible_moves(); // Dessiner les mouvements possibles
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

        // Ajouts des événements
        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => {
            // ...
        });

        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    }

    _draw_grid() {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                this._context.fillStyle = "#FFFFFF";
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

    /*_draw_state() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this._engine._board[x][y] !== undefined) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                }
            }
        }
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_piece(x, y, piece) {
        let radius = (this._deltaX / 2.3);

        if (piece.color() === Dakapo.Color.RED) {
            this._context.strokeStyle = "#FF0000";
            this._context.fillStyle = "#FF0000";
        }
        if (piece.color() === Dakapo.Color.GREEN) {
            this._context.strokeStyle = "#008000";
            this._context.fillStyle = "#008000";
        }
        if (piece.color() === Dakapo.Color.BLUE) {
            this._context.strokeStyle = "#0000FF";
            this._context.fillStyle = "#0000FF";
        }
        if (piece.color() === Dakapo.Color.YELLOW) {
            this._context.strokeStyle = "#FFFF00";
            this._context.fillStyle = "#FFFF00";
        }

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
    }*/

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
}


export default {
    Gui: Gui
};