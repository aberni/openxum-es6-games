"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';
import Move from '../../../openxum-core/games/lyngk/move.mjs';

const begin_letter = ['C', 'E', 'G', 'G', 'H', 'H', 'C', 'H', 'G'];
const end_letter = ['C', 'B', 'A', 'B', 'B', 'C', 'I', 'E', 'G'];

const begin_number = [3, 2, 1, 2, 2, 3, 3, 5, 7];
const end_number = [3, 5, 7, 7, 8, 8, 9, 8, 7];

const begin_diagonal_letter = ['B', 'A', 'B', 'B', 'C', 'C', 'E'];
const begin_diagonal_number = [5, 3, 3, 2, 2, 1, 2,];

const end_diagonal_letter = ['E', 'G', 'G', 'H', 'H', 'I', 'H'];
const end_diagonal_number = [8, 9, 8, 8, 7, 7, 5];

const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);
    this._tolerance = 15;
    this._delta_x = 0;
    this._delta_y = 0;
    this._delta_xy = 0;
    this._offset = 0;
    this._selected_color = Lyngk.Color.NONE;
    this._selected_coordinates = null;
    this._selected_piece = null;
    this._target_coordinates = null;
    this._can_claim_color = true;
  }

  draw() {
    this._compute_deltas();
    this._context.lineWidth = 1;

    // background
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#ffffff";
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    this._draw_grid();
    this._draw_coordinates();
    this._draw_state();
    this._draw_stack();
    this._draw_claimed_colors();
    this._draw_possible_moves();
    this._draw_available_colors();
  }

  get_move() {
    return new Lyngk.Move(this._selected_coordinates, this._target_coordinates);
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
    this._canvas.addEventListener("contextmenu", (e) => {
      this.unselect();
      this._manager.redraw();
    });

    this.draw();
  }

  unselect() {
    this._selected_coordinates = null;
    this._target_coordinates = null;
    this._can_claim_color = this._engine.get_player_colors(this._color).length < 2;
  }

  // private methods
  _compute_coordinates(letter, number) {
    return [this._offset + (letter - 'A'.charCodeAt(0)) * this._delta_x,
      7 * this._delta_y + this._delta_xy * (letter - 'A'.charCodeAt(0)) - (number - 1) * this._delta_y];
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

  _compute_deltas() {
    this._offset = 30;
    this._delta_x = (this._width - 2 * this._offset) / 9.0;
    this._delta_y = this._delta_x;
    this._delta_xy = this._delta_y / 2;
    this._offset = (this._width - 8 * this._delta_x) / 2;
  }

  _draw_available_colors() {
    let available_colors = this._engine.get_available_colors();
    let y = this._height - 30;
    let radius = this._delta_x * (1.0 / 3 + 1.0 / 10);
    let spacing = 5;
    let x = this._width / 2 - (available_colors.length / 2.0) * radius * 2 - Math.floor(available_colors.length / 2) * spacing + radius;

    for (let index in available_colors) {
      this._draw_piece_to_x_y(x, y, available_colors[index], 0, false);
      x += (radius * 2 + spacing);
    }
  }

  _draw_claimed_colors() {
    this._context.fillStyle = "#000000";
    this._context.textAlign = "start";
    this._context.textBaseline = "middle";
    this._context.font = " 15px calibri";
    this._draw_player_colors(Lyngk.Player.PLAYER_1, 8, 20);
    this._draw_player_colors(Lyngk.Player.PLAYER_2, 8, 50);
  }

  _draw_coordinates() {
    let pt;

    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#000000";
    this._context.font = "15px _calibri";
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
    }

    for (let i = 0; i < 7; ++i) {
      _pt_begin = this._compute_coordinates(begin_diagonal_letter[i].charCodeAt(0),
        begin_diagonal_number[i]);
      _pt_end = this._compute_coordinates(end_diagonal_letter[i].charCodeAt(0),
        end_diagonal_number[i]);
      this._context.moveTo(_pt_begin[0], _pt_begin[1]);
      this._context.lineTo(_pt_end[0], _pt_end[1]);
    }

    this._context.stroke();
  }

  _draw_piece(x, y, intersection, isSelected) {
    let color = intersection.getColor();
    let stackHeight = intersection.getHeightStack();

    this._draw_piece_to_x_y(x, y, color, stackHeight, isSelected);
  }

  _draw_piece_to_x_y(x, y, color, height, isSelected) {
    this._update_context_style_for_piece(color);
    this._context.beginPath();
    this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
    this._context.closePath();
    this._context.fill();

    this._context.lineWidth = 2;
    this._context.beginPath();
    this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
    this._context.closePath();
    this._context.stroke();

    if (isSelected) {
      this._context.lineWidth = 4;
      this._context.strokeStyle = "#ffff00";
      this._context.beginPath();
      this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    }
    if (height > 0) {
      this._context.textAlign = "center";
      this._context.textBaseline = "middle";
      this._context.fillStyle = "#000000";
      this._context.fillText(height, x, y);
    }
  }

  _draw_player_colors(player, startX, startY) {
    let playerName;

    if (player === Lyngk.Player.PLAYER_1) {
      playerName = "White: ";
    } else {
      playerName = "Black: ";
    }

    this._context.fillStyle = "#000000";
    this._context.textBaseline = "top";
    this._context.font = " 15px calibri";
    this._context.fillText(playerName, startX, startY);

    let radius = this._delta_x * (1.0 / 3 + 1.0 / 10) / 2;
    let ownedColors = this._engine.get_player_colors(player);

    startX += 40;
    startY += radius / 2;
    for (let i = 0; i < ownedColors.length; i++) {
      let color = ownedColors[i];

      this._update_context_style_for_piece(color);
      this._context.beginPath();
      this._context.arc(startX + (i + 1) * (radius * 2 + 5), startY, radius, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.fill();
      this._context.stroke();
    }
  }

  _draw_possible_moves() {
    if (this._selected_coordinates === null || !this._selected_coordinates.isValid()) {
      return;
    }

    let move_list = this._engine.get_possible_move_list(this._selected_coordinates);

    if (!move_list) {
      return;
    }
    this._context.setLineDash([5, 5]);
    move_list.forEach((coordinates) => {
      let letter = coordinates.getColumn().charCodeAt(0);
      let number = coordinates.getLine();
      let pt = this._compute_coordinates(letter, number);
      let x = pt[0];
      let y = pt[1];

      this._context.strokeStyle = "#000000";
      this._context.lineWidth = 6;
      this._context.beginPath();
      this._context.arc(x, y, this._delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.stroke();
    });
    this._context.setLineDash([]);
  }

  _draw_stack() {
    if (!this._selected_coordinates || !this._selected_coordinates.isValid()) {
      return;
    }

    let radius = this._delta_x * (1.0 / 3 + 1.0 / 10) / 2;
    let startX = 5 + radius;
    let startY = this._height - 30;

    let inter = this._engine.getIntersection(this._selected_coordinates);
    let stack = inter.getStack();
    let stackColors = stack.getColors();

    for (let i = 0; i < stackColors.length; i++) {
      let color = stackColors[i];

      this._update_context_style_for_piece(color);
      this._context.beginPath();
      this._context.arc(startX, startY - (i + 1) * (radius * 2 + 3), radius, 0.0, 2 * Math.PI);
      this._context.closePath();
      this._context.fill();
      this._context.stroke();
    }
  }

  _draw_state() {
    for (let index in this._engine._intersections) {
      let intersection = this._engine._intersections[index];

      if (intersection.getState() !== Lyngk.State.VACANT) {
        let coords = intersection.getCoordinate();
        let letter = coords.getColumn().charCodeAt(0);
        let number = coords.getLine();
        let pt = this._compute_coordinates(letter, number);

        let isSelected = this._selected_coordinates !== null && this._selected_coordinates.isValid() &&
          coords.hash() === this._selected_coordinates.hash();

        this._draw_piece(pt[0], pt[1], intersection, isSelected);
      }
    }
  }

  _get_click_position(e) {
    let rect = this._canvas.getBoundingClientRect();

    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _has_selected_a_piece() {
    return this._selected_coordinates !== null && this._selected_coordinates.isValid();
  }

  _on_click(event) {
    if (!this._engine.is_finished() && (this._engine.current_color() === this._color || this._gui !== null)) {
      let pos = this._get_click_position(event);
      let available_colors = this._engine.get_available_colors();
      let y = this._height - 30;
      let radius = this._delta_x * (1.0 / 3 + 1.0 / 10);
      let spacing = 5;
      let x = this._width / 2 - (available_colors.length / 2.0) * radius * 2 - Math.floor(available_colors.length / 2) * spacing + radius;

      if (pos.y > y - radius) {
        if (this._can_claim_color) {
          let index = Math.floor((pos.x - x + radius) / (radius * 2 + spacing));

          this._engine.request_color(available_colors[index]);
          this._can_claim_color = false;
          this.draw();
        }
      } else {
        let letter = this._compute_letter(pos.x, pos.y);

        if (letter !== 'X') {
          let number = this._compute_number(pos.x, pos.y);

          if (number !== -1) {
            let ok = false;

            if (this._has_selected_a_piece()) {
              if (this._selected_coordinates.getLine() === number && this._selected_coordinates.getColumn() === letter) {
                this._selected_coordinates = null;
                this.draw();
              } else {
                this._target_coordinates = new Lyngk.Coordinates(letter, number);

                if (this._engine._isMoveValid(this._selected_coordinates, this._target_coordinates)) {
                  ok = true;
                }
              }
            } else {
              if (this._engine._exist_intersection(letter, number)) {
                let intersection = this._engine.getIntersection(null, letter, number);

                if (!intersection.isVacant()) {
                  this._selected_coordinates = new Lyngk.Coordinates(letter, number);
                  this.draw();
                }
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

  _update_context_style_for_piece(color) {
    switch (color) {
      case Lyngk.Color.IVORY:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#666660";
        break;
      case Lyngk.Color.BLACK:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#373737";
        break;
      case Lyngk.Color.WHITE:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        break;
      case Lyngk.Color.RED:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ff0c10";
        break;
      case Lyngk.Color.GREEN:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#56a861";
        break;
      case Lyngk.Color.BLUE:
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#2f9fff";
        break;
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
}

export default {
  Gui: Gui
};