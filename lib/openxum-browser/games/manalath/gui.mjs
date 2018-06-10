"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Manalath from '../../../openxum-core/games/manalath/index.mjs';

// grid constants definition
const begin_number = [0, 0, 0, 0, 0, 1, 2, 3, 4];
const end_number =   [4, 5, 6, 7, 8, 8, 8, 8, 8];

const begin_letter       = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_letter         = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const letter_line_offset = [ 0,   1,   2,   3,   4,   5,   6,   7,   8];

const begin_diagonal_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const begin_diagonal_number = [4,    3,   2,   1,   0,   0,   0,   0,   0];

const end_diagonal_letter = ['E', 'F', 'G',   'H', 'I', 'I', 'I', 'I', 'I'];
const end_diagonal_number = [8,    8,   8,     8,   8,   7,   6,   5,   4];


const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];


class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        this._tolerance = 15;
        this._delta_x = 0;
        this._delta_y = 0;
        this._delta_xy = 0;
        this._offset = 0;
        this._pointerX = -1;
        this._pointerY = -1;
        this._selected_color = Manalath.Color.NONE;
        this._selected_coordinates = null;
    }

    // public methods

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
        this._draw_state();

        this._show_intersection();
    }

    get_move() {
        throw new TypeError("Do not call abstract method get_move from child.");
    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    set_canvas(c) {
        super.set_canvas(c);

        this._canvas.addEventListener("click", (e) => {
            //this._on_click(e);
        });
        this._canvas.addEventListener("mousemove", (e) => {
            this._on_move(e);
        });

        this.draw();
    }

    unselect() {
        throw new TypeError("Do not call abstract method unselect from child.");
    }

    // private methods
    _compute_coordinates(letter, number) {
        return [this._offset + 1.5 * this._delta_x +
        (letter - 'A'.charCodeAt(0)) * this._delta_x - (number - 1) * 0.5 * this._delta_x,
            this._height / 2 + (number - 1) * this._delta_y - 2.5 * this._delta_y];
    }

    _compute_deltas() {
        this._offset = 100;
        this._delta_x = (this._width - 2 * this._offset) / 8;
        this._delta_y = this._delta_x;
        this._delta_xy = this._delta_y / 2;
    }

    _compute_letter(x, y) {
        let letter = 'X';
        let pt = this._compute_coordinates('A'.charCodeAt(0), 1);

        // translation to A1 and rotation
        let X = x - pt[0];
        let Y = y - pt[1];
        let cos_alpha = 1.0 / Math.sqrt(5);
        let sin_alpha = 2.0 * cos_alpha;

        let x2 = (X * sin_alpha + Y * cos_alpha);
        let delta_x2 = this._delta_x * sin_alpha;
        let index = Math.floor((x2 + this._tolerance) / delta_x2 + 1);

        if (index > 0 && index < 12) {
            let ref = (index - 1) * delta_x2 + this._tolerance;

            if (x2 < ref) {
                letter = letters[index - 1];
            }
        }
        return letter;
    }

    _compute_number(x, y) {
        let index = Math.floor(((y + this._tolerance) - this._height / 2 + 2.5 *
            this._delta_y) / this._delta_y) + 1;
        let number = -1;

        if (index > -1 && index < 9) {
            let ref = this._height / 2 + (index - 1) * this._delta_y -
                2.5 * this._delta_y + this._tolerance;

            if (y < ref) {
                number = index;
            }
        }
        return number;
    }

    _compute_pointer(x, y) {
        let change = false;
        let letter = this._compute_letter(x, y);

        if (letter !== 'X') {
            let number = this._compute_number(x, y);

            if (number !== -1) {
                if (true) {//this._engine._exist_intersection(letter, number)) {
                    let pt = this._compute_coordinates(letter.charCodeAt(0), number);

                    this._pointerX = pt[0];
                    this._pointerY = pt[1];
                    change = true;
                    console.log(letter + " " + number);
                } else {
                    this._pointerX = this._pointerY = -1;
                    change = true;
                }
            } else {
                if (this._pointerX !== -1) {
                    this._pointerX = this._pointerY = -1;
                    change = true;
                }
            }
        } else {
            if (this._pointerX !== -1) {
                this._pointerX = this._pointerY = -1;
                change = true;
            }
        }
        return change;
    }

    _draw_coordinates() {
        let pt;

        this._context.fillStyle = "#000000";
        this._context.font = "16px _sans";
        this._context.textBaseline = "bottom";
        // letters
        for (let l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            pt = this._compute_coordinates(l, begin_number[l - 'A'.charCodeAt(0)]);
            pt[0] += 5;
            pt[1] -= 5;

            this._context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        this._context.textBaseline = "bottom";
        for (let n = 0; n < 9; ++n) {
            pt = this._compute_coordinates(begin_letter[n].charCodeAt(0), n);
            pt[0] -= 15 + (n > 3 ? 5 : 0);
            pt[1] -= 3;

            this._context.fillText(n.toString(), pt[0], pt[1]);
        }
    }

    _draw_grid() {
        let _pt_begin;
        let _pt_end;

        this._context.lineWidth = 1;
        this._context.strokeStyle = "#000000";
        for (let l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            let index = l - 'A'.charCodeAt(0);

            _pt_begin = this._compute_coordinates(l, begin_number[index]);
            _pt_end = this._compute_coordinates(l, end_number[index]);
            this._context.moveTo(_pt_begin[0], _pt_begin[1]);
            this._context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (let n = 0; n < 9; ++n) {
            _pt_begin = this._compute_coordinates(begin_letter[n].charCodeAt(0), letter_line_offset[n]);
            _pt_end = this._compute_coordinates(end_letter[n].charCodeAt(0), letter_line_offset[n]);
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
    }

    _draw_piece(x, y, intersection, is_selected) {
        
    }

    _draw_state() {
        for (let index in this._engine._intersections) {
            let intersection = this._engine._intersections[index];

            if (intersection.get_state() !== Manalath.State.VACANT) {
                let coords = intersection.get_coordinates();
                let letter = coords.get_column().charCodeAt(0);
                let number = coords.get_line();
                let pt = this._compute_coordinates(letter, number);

                let is_selected = this._selected_coordinates && this._selected_coordinates.is_valid() &&
                    coords.hash() === this._selected_coordinates.hash();

                this._draw_piece(pt[0], pt[1], intersection, is_selected);
            }
        }
    }

    _get_click_position(e) {
        let rect = this._canvas.getBoundingClientRect();

        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
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

    _on_move(event) {
        if (this._engine.current_color() === this._color || this._gui !== null) {
            let pos = this._get_click_position(event);
            let letter = this._compute_letter(pos.x, pos.y);

            if (letter !== 'X') {
                let number = this._compute_number(pos.x, pos.y);

                if (number !== -1) {
                    if (this._compute_pointer(pos.x, pos.y)) {
                        this._manager.redraw();
                    }
                }
            }
        }
    }

    _show_intersection() {
        if (this._pointerX !== -1 && this._pointerY !== -1) {
            this._context.fillStyle = "#0000ff";
            this._context.strokeStyle = "#0000ff";
            this._context.lineWidth = 1;
            this._context.beginPath();
            this._context.arc(this._pointerX, this._pointerY, 5, 0.0, 2 * Math.PI);
            this._context.closePath();
            this._context.fill();
            this._context.stroke();
        }
    }
}

export default {
    Gui: Gui
};