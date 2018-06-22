// lib/openxum-browser/games/neutreeko/gui.mjs
"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Neutreeko from '../../../openxum-core/games/neutreeko/index.mjs';
import Move from '../../../openxum-core/games/neutreeko/move.mjs';
import Coordinates from '../../../openxum-core/games/neutreeko/coordinates.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._move = undefined;
        this._is_animating = false;
        this._selected_piece = undefined;
        this._letters = ['A','B','C','D','E'];
        this._numbers = ['1','2','3','4','5'];
    }

   draw() {
        // La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
           this._context.lineWidth = 1;

           // background
           this._context.fillStyle = "#a25d30";
           this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);
           this._draw_grid();
           this._draw_labels();
           this._draw_state();

       // implémenter le reste du rendu ici
    }

    get_move() {
        // Retourne le mouvement à effectuer par le manager pour le tour actuel
        // Un objet de type Move doit être construit ; si ce n'est pas le cas,
        // alors la méthode process_move sera invoquée
        return this._move;
    }

    is_animate() {
        // Retourne true si le coup provoque des animations
        // (déplacement de pions, par exemple).
        return this._is_animating;
    }

    is_remote() {
        // Indique si un joueur joue à distance
        return false;
    }

    unselect() {
        // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
        this._selected_piece = undefined;
    }

    set_canvas(c) {
        super.set_canvas(c);

        // Ajouts des événements
        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => { let pos = this._get_click_position(e); if(pos.x >= 0 && pos.x < 5 && pos.y >= 0 && pos.y < 5) this._on_click(pos.x, pos.y); });

        this._deltaX = (this._canvas.width *0.87) / 5;
        this._deltaY = (this._canvas.height *0.87) / 5;
        this._offsetX = this._canvas.width / 2 - this._deltaX * 2.5;
        this._offsetY = this._canvas.height / 2 - this._deltaY * 2.5;
        this._context.font = "30px Arial";
        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    }

    move(move, color) {
        this._is_animating = false;
        this._manager.play();
        // TODO !!!!!
    }

    _draw_grid() {
        let i, j;

        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#d4d4d4";
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
                    if (this._selected_piece === undefined || (this._selected_piece!== undefined && !this._selected_piece.coordinates().equals(this._engine._board[x][y].coordinates()))) {
                        let pt = this._compute_coordinates(x, y);
                        this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                    }
                }
            }
        }

        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }
    }

    _draw_piece(x, y, piece) {
        let radius = (this._deltaX / 2.3);

            switch(piece.color())
            {
                case Neutreeko.Color.BLACK :
                    this._context.strokeStyle = "#000000"; this._context.fillStyle = "#000000"; break;
                case Neutreeko.Color.RED :
                    this._context.fillStyle = "#ff0000"; this._context.strokeStyle = "#ff0000";break;
                case Neutreeko.Color.BLUE :
                    this._context.fillStyle = "#0000ff"; this._context.strokeStyle = "#0000ff";break;
                case Neutreeko.Color.GREEN :
                    this._context.fillStyle = "#008000"; this._context.strokeStyle = "#008000";break;
                case Neutreeko.Color.IVORY :
                    this._context.fillStyle = "#fffff0"; this._context.strokeStyle = "#fffff0";break;
                case Neutreeko.Color.WHITE :
                    this._context.fillStyle = "#ffffff"; this._context.strokeStyle = "#ffffff";break;
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

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * this._scaleX - this._offsetX;
        let y = (e.clientY - rect.top) * this._scaleY - this._offsetY;

        return { x: Math.floor(x / this._deltaX), y: Math.floor(y / this._deltaX) };
    }

    _on_click(x, y) {
        if (!this._engine.is_finished()) {
            if (this._engine._board[x][y] !== undefined && this._engine._board[x][y].color() === this._engine.current_color()) {
                this._selected_piece = this._engine._board[x][y];
            }
            else {
                if (this._selected_piece !== undefined) {
                    if(this._selected_piece.coordinates().x() !== x || this._selected_piece.coordinates().y() !== y) {
                        if(this._engine._verify_moving(this._selected_piece, x, y)) {
                            this._move = new Move(this._selected_piece.coordinates(), new Coordinates(x, y));
                            this._is_animating = true;
                            this._animate_move();
                        }  else {
                            this.unselect();
                        }
                    }
                }
            }

            this.draw();
        }
    }

    _draw_selected_piece() {
        if(! this.is_animate() ) {
            let x = this._selected_piece.coordinates().x();
            let y = this._selected_piece.coordinates().y();
            let possible_moves = this._engine._get_possible_move_list(this._selected_piece);
            let pt = this._compute_coordinates(x, y);
            this._draw_piece(pt[0], pt[1], this._selected_piece);
            let radius = (this._deltaX / 2.3);
            this._context.lineWidth = 4;
            this._context.strokeStyle = "#d8370f";
            this._context.beginPath();
            this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.stroke();

            this._context.fillStyle = "#2ad84a";
            radius = (this._deltaX / 10);

            for(let i = 0; i < possible_moves.length; i++) {
                let move = possible_moves[i];
                pt = this._compute_coordinates(move.to().x(), move.to().y());

                this._context.beginPath();
                this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
                this._context.closePath();
                this._context.fill();
            }
        }
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

    _animate(val, deplacement) {
        let from = this._move.from();
        let to = this._move.to();

        let ptF = this._compute_coordinates(from.x(), from.y());
        let ptT = this._compute_coordinates(to.x(), to.y());

        let newX = ptF[0];
        let newY = ptF[1];
        let speed = 30;
        let continueAnimate = true;

        switch(deplacement) {
            case 0: // Right
                newX = ptF[0] + val;
                continueAnimate = newX <= ptT[0];
                break;

            case 1: // Left
                newX = ptF[0] - val;
                continueAnimate = newX >= ptT[0];
                break;

            case 2: // Bot
                newY = ptF[1] + val;
                continueAnimate = newY <= ptT[1];
                break;

            case 3: // Top
                newY = ptF[1] - val;
                continueAnimate = newY >= ptT[1];
                break;
            case 4: // Bot Right
                newX = ptF[0] + val/2;
                newY = ptF[1] + val/2;
                continueAnimate = newX <= ptT[0] && newY <= ptT[1];
                break;

            case 5: // Bot Left
                newX = ptF[0] - val/2;
                newY = ptF[1] + val/2;
                continueAnimate = newX >= ptT[0] && newY <= ptT[1];
                break;

            case 6: // Top Right
                newX = ptF[0] + val/2;
                newY = ptF[1] - val/2;
                continueAnimate = newX <= ptT[0] && newY >= ptT[1];
                break;

            case 7: // Top Left
                newX = ptF[0] - val/2;
                newY = ptF[1] - val/2;
                continueAnimate = newX >= ptT[0] && newY >= ptT[1];
                break;
        }

        if (continueAnimate) {
            this.draw();
            this._draw_piece(newX, newY, this._selected_piece);
            let that = this;
            setTimeout(function() {
                that._animate(val + speed, deplacement);
            }, 10);
        }
        else {
            this.draw();
            this._draw_piece(ptT[0], ptT[1], this._selected_piece);
            let that = this;
            setTimeout(function() {
                that.move();
            }, 50);
        }
    }

    _animate_move() {

        //Remove temporary the piece from the board to animate
        //this._engine._board[this._selected_piece.coordinates().x()][this._selected_piece.coordinates().y()] = undefined;

        let that = this;
        let deplacement = -1;

        let from = this._move.from();
        let to = this._move.to();

        if (from.x() < to.x()) {
            if(from.y() < to.y())
                deplacement = 4;
            else if(from.y() > to.y())
                deplacement = 6;
            else
                deplacement = 0;
        } else if(from.x() > to.x()) {
            if(from.y() < to.y())
                deplacement = 5;
            else if(from.y() > to.y())
                deplacement = 7;
            else
                deplacement = 1;
        } else {
            if (from.y() < to.y())
                deplacement = 2;
            else
                deplacement = 3;
        }

        setTimeout(function() {
            that._animate(0, deplacement);
        }, 50);
    }
    _draw_labels() {
        let i;
        this._context.lineWidth = 1;
        //this._context.strokeStyle = "#d8d2ce";
        this._context.fillStyle = "#d4d4d4";
        // LEFT
        for (i = 0; i < 5; ++i) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX - 25, this._offsetY + (i + 0.3) * this._deltaY);
                this._context.fillText(this._numbers[i],this._offsetX - 25, this._offsetY + (i + 0.6) * this._deltaY);
                this._context.closePath();
                this._context.fill();
            }
        // TOP
        for (i = 0; i < 5; ++i) {
                this._context.beginPath();
                this._context.moveTo(this._offsetX + this._deltaX * (i + 0.3), this._offsetY - 25);
                this._context.fillText(this._letters[i],this._offsetX + this._deltaX * (i + 0.4), this._offsetY - 5);
                this._context.closePath();
                this._context.fill();
        }
    }
}


export default {
  Gui: Gui
};