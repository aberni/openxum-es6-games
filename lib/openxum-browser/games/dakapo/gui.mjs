"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Dakapo from '../../../openxum-core/games/dakapo/index.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
        this._deltaX = 0;
        this._deltaY = 0;
        this._offsetX = 0;
        this._offsetY = 0;
        this._move = undefined;
        this._selected_piece = undefined;
        this._selected_color = Dakapo.Color.RED;
    }

    // public methods
    draw() {
        this._context.lineWidth = 1;

        // background
        this._context.fillStyle = "#4C3629";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);

        this._draw_grid();
        this._draw_state();
        this._draw_free_tiles();
    }

    get_move() {
        return this._move;
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
        this._canvas.addEventListener("click", (e) => { let pos = this._get_click_position(e); if(pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8) this._on_click(pos.x, pos.y); });

        this._deltaX = (this._canvas.width * 0.95 - 40) / 8;
        this._deltaY = (this._canvas.height * 0.95 - 40) / 8;
        this._offsetX = this._canvas.width / 2 - this._deltaX * 4;
        this._offsetY = this._canvas.height / 2 - this._deltaY * 4;

        this.draw();
    }

    unselect() {
        this._selected_color = Dakapo.Color.NONE;
        this.draw();
    }

    // private methods
    _draw_free_tile(index, color, selected) {
        if (selected) {
            this._context.lineWidth = 5;
        } else {
            this._context.lineWidth = 2;
        }
        this._context.strokeStyle = "#ffffff";
        this._context.fillStyle = color;
        this._context.beginPath();
        if (index === 1) {
            this._context.moveTo(this._offsetX - 25, this._offsetY - 25);
            this._context.lineTo(this._offsetX - 5, this._offsetY - 25);
            this._context.lineTo(this._offsetX - 5, this._offsetY - 5);
            this._context.lineTo(this._offsetX - 25, this._offsetY - 5);
            this._context.lineTo(this._offsetX - 25, this._offsetY - 25);
        } else if (index === 2) {
            this._context.moveTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY - 25);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 5, this._offsetY - 25);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 5, this._offsetY - 5);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY - 5);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY - 25);
        } else if (index === 3) {
            this._context.moveTo(this._offsetX - 25, this._offsetY + 8 * this._deltaY + 5);
            this._context.lineTo(this._offsetX - 5, this._offsetY + 8 * this._deltaY + 5);
            this._context.lineTo(this._offsetX - 5, this._offsetY + 8 * this._deltaY + 25);
            this._context.lineTo(this._offsetX - 25, this._offsetY + 8 * this._deltaY + 25);
            this._context.lineTo(this._offsetX - 25, this._offsetY + 8 * this._deltaY + 5);
        } else if (index === 0) {
            this._context.moveTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY + 8 * this._deltaY + 5);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 5, this._offsetY + 8 * this._deltaY + 5);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 5, this._offsetY + 8 * this._deltaY + 25);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY + 8 * this._deltaY + 25);
            this._context.lineTo(this._offsetX + 8 * this._deltaX + 25, this._offsetY + 8 * this._deltaY + 5);
        }

        this._context.closePath();
        this._context.fill();
        this._context.stroke();
    }

    _draw_free_tiles() {
        let index = 0;
        let i;
            this._draw_free_tile(index, 'blue', this._selected_color === index);
            ++index;
            this._draw_free_tile(index, 'green', this._selected_color === index);
            ++index;
        this._draw_free_tile(index, 'red', this._selected_color === index);
        ++index;
        this._draw_free_tile(index, 'yellow', this._selected_color === index);
    }


    _on_click(x, y) {
        this._move = new Dakapo.Move(this._selected_color,x,y);
        this._engine._board[this._move._abs][this._move._ord]=this._move._color;
        //this.move(this._move, Dakapo.Color.RED);
        this.draw();
    }



    _draw_state() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this._engine._board[x][y] !== Dakapo.Color.NONE) {
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

        if (piece === Dakapo.Color.RED) {
            this._context.strokeStyle = "#FF0000";
            this._context.fillStyle = "#FF0000";
        }
        if (piece === Dakapo.Color.GREEN) {
            this._context.strokeStyle = "#008000";
            this._context.fillStyle = "#008000";
        }
        if (piece === Dakapo.Color.BLUE) {
            this._context.strokeStyle = "#0000FF";
            this._context.fillStyle = "#0000FF";
        }
        if (piece === Dakapo.Color.YELLOW) {
            this._context.strokeStyle = "#FFFF00";
            this._context.fillStyle = "#FFFF00";
        }

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();
    }

    _draw_grid() {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#D59D6C";
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
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

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left) * this._scaleX - this._offsetX;
        let y = (e.clientY - rect.top) * this._scaleY - this._offsetY;

        return { x: Math.floor(x / this._deltaX), y: Math.floor(y / this._deltaX) };
    }

}

export default {
    Gui: Gui
};