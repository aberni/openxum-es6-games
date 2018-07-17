"use strict";

import Graphics from '../../graphics/index.mjs';
import OpenXum from '../../openxum/gui.mjs';
import Manalath from '../../../openxum-core/games/manalath/index.mjs';
import Move from '../../../openxum-core/games/manalath/move.mjs';

// grid constants definition
const begin_number = [0, 0, 0, 0, 0, 1, 2, 3, 4];
const end_number = [4, 5, 6, 7, 8, 8, 8, 8, 8];

const begin_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const end_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const letter_line_offset = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const begin_diagonal_letter = ['A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E'];
const begin_diagonal_number = [4, 3, 2, 1, 0, 0, 0, 0, 0];

const end_diagonal_letter = ['E', 'F', 'G', 'H', 'I', 'I', 'I', 'I', 'I'];
const end_diagonal_number = [8, 8, 8, 8, 8, 7, 6, 5, 4];

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

    // background
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#ffffff";
    Graphics.board.draw_round_rect(this._context, 0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    // grid
    this._draw_grid();
    this._draw_coordinates();
    this._draw_black_white_pieces();
    this._draw_state();
    this._draw_possible_moves();
    this._draw_available_pieces();
    this._show_intersection();
  }

  get_move() {
    return new Move(this._selected_coordinates, this._selected_color);
  }

  is_animate() {
    return false;
  }

  is_remote() {
    return false;
  }

  move(move, color) {
    this._manager.play();
    // TODO
  }

  set_canvas(c) {
    super.set_canvas(c);
    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });
    this._canvas.addEventListener("mousemove", (e) => {
      this._on_move(e);
    });
    this.draw();
  }

  unselect() {
    this._selected_color = Manalath.Color.NONE;
    this._selected_coordinates = null;
  }

  // private methods
  _compute_coordinates(letter, number) {
    return [this._offset + 1.5 * this._delta_x +
    (letter - 'A'.charCodeAt(0)) * this._delta_x - (number - 1) * 0.5 * this._delta_x,
      this._height / 2 + (number - 1) * this._delta_y - 2.5 * this._delta_y];
  }

  _compute_deltas() {
    this._offset = 50;
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

  _draw_available_pieces() {
    this._context.fillStyle = "#000000";
    this._context.textAlign = "start";
    this._context.textBaseline = "middle";
    this._context.font = " 15px calibri";
    this._draw_player_pieces(Manalath.Color.WHITE, 8, 20);
    this._context.textAlign = "end";
    this._draw_player_pieces(Manalath.Color.BLACK, this._width - 8, 20);
  }

  _draw_black_white_pieces() {
    this._draw_piece(this._width / 2 - 50, 30, Manalath.Color.WHITE, this._selected_color === Manalath.Color.WHITE);
    this._draw_piece(this._width / 2 + 50, 30, Manalath.Color.BLACK, this._selected_color === Manalath.Color.BLACK);
  }

  _draw_player_pieces(color, x, y) {
    let playerName;

    if (color === Manalath.Color.WHITE) {
      playerName = "White: " + this._engine._white_piece_count;
    } else {
      playerName = "Black: " + this._engine._black_piece_count;
    }
    this._context.fillText(playerName, x, y);
  }

  _draw_coordinates() {
    let pt;

    this._context.fillStyle = "#000000";
    this._context.font = "15px colibri";
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
      this._context.fillText((n + 1).toString(), pt[0], pt[1]);
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

  _draw_piece(x, y, color, is_selected) {
    Graphics.marble.draw_marble(this._context, x, y, 2 * this._delta_x / 3,
      color === Manalath.Color.WHITE ? "white" : "black");
    if (is_selected) {
      this._context.strokeStyle = "#ffff00";
      this._context.lineWidth = 4;
      this._context.beginPath();
      this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
  }

  _draw_possible_moves() {
    if (this._selected_color !== Manalath.Color.NONE) {
      let move_list = this._engine.get_possible_move_list(this._selected_color);

      if (!move_list) {
        return;
      }

      move_list.forEach((move) => {
        let coords = move.to();
        let letter = coords.get_column().charCodeAt(0);
        let number = coords.get_line();
        let pt = this._compute_coordinates(letter, number);
        let x = pt[0];
        let y = pt[1];

        this._context.strokeStyle = "#48e723";
        this._context.lineWidth = 4;
        this._context.beginPath();
        this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10) / 2, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.stroke();
      });
    }
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

        this._draw_piece(pt[0], pt[1], intersection.get_color(), is_selected);
      }
    }
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _on_click(event) {
    if (!this._engine.is_finished() && (this._engine.current_color() === this._color || this._gui !== null)) {
      let pos = this._get_click_position(event);

      if (pos.y < this._delta_x / 3 + 30) {
        if (pos.x > this._width / 2 - 50 - this._delta_x / 3 && pos.x < this._width / 2 - 50 + this._delta_x / 3) {
          this._selected_color = Manalath.Color.WHITE;
          this.draw();
        } else if (pos.x > this._width / 2 + 50 - this._delta_x / 3 && pos.x < this._width / 2 + 50 + this._delta_x / 3) {
          this._selected_color = Manalath.Color.BLACK;
          this.draw();
        }
      } else {
        let letter = this._compute_letter(pos.x, pos.y);

        if (letter !== 'X') {
          let number = this._compute_number(pos.x, pos.y);

          if (number !== -1) {
            let ok = false;

            if (this._engine._exist_intersection(letter, number)) {
              let inter = this._engine.get_intersection(null, letter, number);

              if (inter.is_vacant()) {
                this._selected_coordinates = new Manalath.Coordinates(letter, number);
                ok = this._selected_color !== Manalath.Color.NONE;
              }
            }
            if (ok) {
              this._manager.play();
            }
          }
        }
      }
    }
  }

  _on_move(event) {
    if (!this._engine.is_finished() && (this._engine.current_color() === this._color || this._gui !== null)) {
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

  _update_context_style_for_piece(color) {
    switch (color) {
      case Manalath.Color.BLACK:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#373737";
        break;
      case Manalath.Color.WHITE:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        break;
    }
  }
}

export default Gui;