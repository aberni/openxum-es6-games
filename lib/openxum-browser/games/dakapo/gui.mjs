"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Kamisado from '../../../openxum-core/games/dakapo/index.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

    }

// public methods
    draw() {
        // fond
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        this._context.lineWidth = 10;
        this._context.strokeStyle = "#757D75";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, false, true);

        this._draw_grid();


    }

    get_move() {
    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    move(move, color) {
        this._manager.play();
        // TODO !!!!!
    }

    set_canvas(c) {
        super.set_canvas(c);

        this._height = this._canvas.height;
        this._width = this._canvas.width;
        this._deltaX = (this._width * 0.95 - 10) / 8;
        this._deltaY = (this._height * 0.95 - 10) / 8;
        this._offsetX = this._width / 2 - this._deltaX * 4;
        this._offsetY = this._height / 2 - this._deltaY * 4;

        this._scaleX = this._height / this._canvas.offsetHeight;
        this._scaleY = this._width / this._canvas.offsetWidth;

        this._canvas.addEventListener("click", (e) => {
            this._on_click(e);
        });

        this.draw();
    }

    unselect() {
    }

    // private methods

    _compute_coordinates(x, y) {
        return {
            x: Math.floor((x - this._offsetX) / (this._deltaX + 4)),
            y: Math.floor((y - this._offsetY) / (this._deltaY + 4))
        };
    }

    _draw_grid() {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                this._context.fillStyle = "#000000";
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

}

export default {
    Gui: Gui
};