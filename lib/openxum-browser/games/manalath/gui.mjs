"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Manalath from '../../../openxum-core/games/manalath/index.mjs';

// grid constants definition
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

        this._tolerance = 15;
        this._delta_x = 0;
        this._delta_y = 0;
        this._delta_xy = 0;
        this._offset = 0;
        this._pointerX = -1;
        this._pointerY = -1;
        this._selected_color = Manalath.Color.NONE;
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
        return [this._offset + (letter - 'A'.charCodeAt(0)) * this._delta_x,
            7 * this._delta_y + this._delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * this._delta_y];
    }

    _compute_deltas() {
        this._offset = 30;
        this._delta_x = (this._width - 2 * this._offset) / 9.0;
        this._delta_y = this._delta_x;
        this._delta_xy = this._delta_y / 2;
        this._offset = (this._width - 8 * this._delta_x) / 2;
    }

    _compute_letter(x, y) {
        let index = Math.floor((x - this._offset) / this._delta_x);
        let x_ref = this._offset + this._delta_x * index;
        let x_ref_2 = this._offset + this._delta_x * (index + 1);
        let _letter = 'X';

        if (x < this._offset) {
            _letter = 'A';
        } else if (x <= x_ref + this._delta_x / 2 && x >= x_ref && x <= x_ref + this._tolerance) {
            _letter = letters[index];
        } else if (x > x_ref + this._delta_x / 2 && x >= x_ref_2 - this._tolerance) {
            _letter = letters[index + 1];
        }
        return _letter;
    }

    _compute_number(x, y) {
        let pt = this._compute_coordinates('A'.charCodeAt(0), 1);

        // translation to A1 and rotation
        let X = x - pt[0];
        let Y = y - pt[1];
        let sin_alpha = 1.0 / Math.sqrt(5);
        let cos_alpha = 2.0 * sin_alpha;

        let x2 = Math.floor((X * sin_alpha - Y * cos_alpha) + pt[0]);
        let delta_x2 = Math.floor(this._delta_x * cos_alpha);

        let index = Math.floor((x2 - this._offset) / delta_x2);
        let x_ref = Math.floor(this._offset + delta_x2 * index);
        let x_ref_2 = Math.floor(this._offset + delta_x2 * (index + 1));

        let _number = -1;

        if (x2 > 0 && x2 < this._offset) {
            _number = 1;
        } else if (x2 <= x_ref + delta_x2 / 2 && x2 >= x_ref && x2 <= x_ref + this._tolerance) {
            _number = index + 1;
        } else if (x2 > x_ref + delta_x2 / 2 && x2 >= x_ref_2 - this._tolerance) {
            _number = index + 2;
        }
        return _number;
    }

    _compute_pointer(x, y) {
        let change = false;
        let letter = this._compute_letter(x, y);

        if (letter !== 'X') {
            let number = this._compute_number(x, y);

            if (number !== -1) {
                if (this._engine._exist_intersection(letter, number)) {
                    let pt = this._compute_coordinates(letter.charCodeAt(0), number);

                    this._pointerX = pt[0];
                    this._pointerY = pt[1];
                    change = true;
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

    _draw_grid() {
        let _pt_begin;
        let _pt_end;

        //this._draw_background();

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