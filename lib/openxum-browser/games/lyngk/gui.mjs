"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';

const begin_letter = ['C', 'E', 'G', 'G', 'H', 'H', 'C', 'H', 'G'];
const end_letter =   ['C', 'B', 'A', 'B', 'B', 'C', 'I', 'E', 'G'];

const begin_number = [3, 2, 1, 2, 2, 3, 3, 5, 7];
const end_number =   [3, 5, 7, 7, 8, 8, 9, 8, 7];

const begin_diagonal_letter = ['B', 'A', 'B', 'B', 'C', 'C', 'E'];
const begin_diagonal_number = [ 5,   3,   3,   2,   2,   1,   2,];

const end_diagonal_letter =   ['E', 'G', 'G', 'H', 'H', 'I', 'H'];
const end_diagonal_number =   [8,    9,   8,   8,   7,   7,   5];


class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        this._delta_x = 0;
        this._delta_y = 0;
        this._delta_xy = 0;
        this._offset = 0;
    }

    draw() {
        this._compute_deltas();
        this._context.lineWidth = 1;

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        // grid
        this._draw_grid();
        this._draw_coordinates();

        // state
        this._draw_state();
    }

    get_move() {

    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    unselect() {

    }

    set_canvas(c) {
        super.set_canvas(c);

        this._canvas.addEventListener("click", (e) => {
            //this._on_click(e);
        });
        this._canvas.addEventListener("mousemove", (e) => {
            //this._on_move(e);
        });

        this.draw();
    }

    _compute_deltas() {
        this._offset = 30;
        this._delta_x = (this._width - 2 * this._offset) / 9.0;
        this._delta_y = this._delta_x;
        this._delta_xy = this._delta_y / 2;
        this._offset = (this._width - 8 * this._delta_x) / 2;
    }

    _draw_grid() {
        let _pt_begin;
        let _pt_end;

        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";

        for (let l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            let index = l - 'A'.charCodeAt(0);

            _pt_begin = this._compute_coordinates(l, begin_number[index]);
            _pt_end = this._compute_coordinates(l, end_number[index]);

            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (let n = 1; n < 9; ++n) {
            _pt_begin = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = this._compute_coordinates(end_letter[n - 1].charCodeAt(0), n);

            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
            this._context.stroke();
        }

        for (let i = 0; i < 7; ++i) {
            _pt_begin = this._compute_coordinates(begin_diagonal_letter[i].charCodeAt(0),
                begin_diagonal_number[i]);
            _pt_end = this._compute_coordinates(end_diagonal_letter[i].charCodeAt(0),
                end_diagonal_number[i]);

            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
            this._context.stroke();
        }
        this._context.stroke();
    }

    _draw_coordinates() {
        let pt;

        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#000000";
        this._context.font = "16px _sans";
        this._context.textBaseline = "top";
        // letters
        for (let l = 'A'.charCodeAt(0); l < 'J'.charCodeAt(0); ++l) {
            pt = this._compute_coordinates(l, begin_number[l - 'A'.charCodeAt(0)]);
            pt[1] += 5;
            this._context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        this._context.textBaseline = "bottom";
        for (let n = 1; n < 10; ++n) {
            pt = this._compute_coordinates(begin_letter[n - 1].charCodeAt(0), n);
            pt[0] -= 15 + (n > 9 ? 5 : 0);
            pt[1] -= 3;
            this._context.fillText(n.toString(), pt[0], pt[1]);
        }
    }

    _draw_state() {
        for (let index in this._engine._intersections) {
            let intersection = this._engine._intersections[index];

            if (intersection.getState() !== Lyngk.State.VACANT) {
                let coords = intersection.getCoordinate();
                let letter = coords.getColonne().charCodeAt(0);
                let number = coords.getLigne();
                let pt = this._compute_coordinates(letter, number);

                this._draw_piece(pt[0], pt[1], intersection.getColor(), false);
            }
        }
        //this._draw_rows();
    }

    _draw_piece(x, y, color, isSelected) {
        if (color === Gipf.Color.BLACK) {
            this._context.strokeStyle = "#000000";
            this._context.fillStyle = "#000000";
        } else {
            this._context.strokeStyle = "#ffffff";
            this._context.fillStyle = "#ffffff";
        }
        this._context.beginPath();
        this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();

        if (color === Lyngk.Color.WHITE) {
            this._context.strokeStyle = "#000000";
            this._context.fillStyle = "#000000";
        } else {
            this._context.strokeStyle = "#ffffff";
            this._context.fillStyle = "#ffffff";
        }

        this._context.lineWidth = 3;
        this._context.beginPath();
        this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.stroke();

        if (isSelected) {
            this._context.beginPath();
            this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10) / 2, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.stroke();
        }
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

    _compute_coordinates(letter, number) {
        return [this._offset + (letter - 'A'.charCodeAt(0)) * this._delta_x,
            7 * this._delta_y + this._delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * this._delta_y];
    }

    _compute_middle(first_letter, first_number, second_letter, second_number) {
        let pt1 = this._compute_coordinates(first_letter.charCodeAt(0), first_number);
        let pt2 = this._compute_coordinates(second_letter.charCodeAt(0), second_number);

        return {x: pt1[0] + (pt2[0] - pt1[0]) / 2, y: pt1[1] + (pt2[1] - pt1[1]) / 2};
    }
}

export default {
    Gui: Gui
};