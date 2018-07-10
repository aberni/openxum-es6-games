"use strict";

import OpenXum from '../../openxum/gui.mjs';
import * as myColor from '../../../openxum-core/games/tintas/color.mjs';
import Color from '../../../openxum-core/games/tintas/color.mjs';
import Engine from '../../../openxum-core/games/tintas/engine.mjs';
import Move from '../../../openxum-core/games/tintas/move.mjs';
import Player from '../../../openxum-core/games/tintas/player.mjs';
// ...

const rows = [[0], [1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12, 13], [14, 15, 16, 17], [18, 19, 20, 21], [22, 23, 24, 25, 26],
  [27, 28, 29, 30], [31, 32, 33, 34], [35, 36, 37, 38], [39, 40, 41], [42, 43, 44], [45, 46, 47], [48]]; // cells id of each row
const nb_hexa = [0, 2, 2, 2, 3, 3, 3, 4, 3, 3, 3, 2, 2, 2, 0]; //number of cell for each rows - 1

class Gui extends OpenXum.Gui {
  constructor(c, e, l, g) {
    super(c, e, l, g);
    // Vos attributs...
    this._coord = [];
    this._dimension = 0;
    this._r = 0;
    this._c = 0;
    this._played = false;
    this._pawn = 49;
    this._id = 49;
    this._current = Player.PLAYER_1;
    this._pass = false;
  }

  draw() { // final version
    // La méthode principale de la classe qui se charge de dessiner à l'écran
    // (le plateau, les pièces, les mouvements possibles, ...)

    // background
    this._context.strokeStyle = "#000000";
    this._context.fillStyle = "#A47940";

    // draw the border of the board
    this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

    // implémenter le reste du rendu ici
    this._draw_grid();
  }

  _draw_grid() {
    this._dimension = this._width - 100;
    this._r = this._dimension / 14;
    this._c = this._r * Math.sin(Math.PI / 3) / 2;
    let x = [(1 / 2) * this._dimension - (3 / 2) * this._r, (1 / 2) * this._dimension - 3 * this._r,
      (1 / 2) * this._dimension - (3 / 2) * this._r, (1 / 2) * this._dimension - 3 * this._r, (1 / 2) * this._dimension - (9 / 2) * this._r,
      this._r, (5 / 2) * this._r, this._r, (5 / 2) * this._r, 4 * this._r, (5 / 2) * this._r, 4 * this._r, (5 / 2) * this._r, 4 * this._r, (1 / 2) * this._dimension + (3 / 2) * this._r]
    let y = this._r; // get the y coord of the first cell
    let yT = this._r * Math.sin(Math.PI / 3);
    let ind = 0;
    for (let i = 0; i < 15; i += 1) { // for each row
      let xb = x[i] + 50; // get the x coord of the first cell
      this._draw_cell(xb, y, myColor.convert_to_hexa(this.engine().get_board().get_cell_by_id(ind).get_color())); // draw the ind-th cell
      ind += 1;
      for (let j = 0; j < nb_hexa[i]; j += 1) { // for each cell on the i-th row (except the first which is already designed)
        xb += 3 * this._r; // the x coordinate of the next cell
        this._draw_cell(xb, y, myColor.convert_to_hexa(this.engine().get_board().get_cell_by_id(ind).get_color()));
        ind += 1;
      }
      y = y + yT; // the y coordinate of the next row
    }
  }

  _draw_cell(x, y, color) { // final version
    //add the coordinates of the cell.
    this._coord.push([x, y]);

    this._draw_hexagone(x, y);

    this._draw_circle(color, x, y);

    this._draw_score_board();

    this._click_zone();
  }

  _draw_hexagone(x, y) {
    // x and y coordinate of each points of the hexagone
    let yy = [y, y + Math.sin((Math.PI / 3)) * this._r, y + Math.sin((Math.PI / 3)) * this._r, y, y - Math.sin((Math.PI / 3)) * this._r, y - Math.sin((Math.PI / 3)) * this._r];
    let xx = [x + this._r, x + Math.cos((Math.PI / 3)) * this._r, x - Math.cos((Math.PI / 3)) * this._r, x - this._r, x - Math.cos((Math.PI / 3)) * this._r, x + Math.cos((Math.PI / 3)) * this._r];

    // draw the hexagone
    this._context.strokeStyle = "#795100";
    this._context.fillStyle = "#A47940";
    this._context.lineWidth = 2;
    let list = this.engine().get_possible_move_list();
    for (let i = 0; i < list.length; i += 1) {
      if (this._get_id(x, y) === list[i].get_to()) {
        this._context.fillStyle = "#DEB887";
      }
    }
    this._context.beginPath();
    this._context.moveTo(xx[0], yy[0]);
    for (let i = 1; i < 6; i = i + 1) {
      this._context.lineTo(xx[i], yy[i]);
    }
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }

  _draw_circle(color, x, y) {
    this._context.fillStyle = color;
    this._context.beginPath();
    this._context.arc(x, y, this._c, 0, Math.PI * 2);
    this._context.closePath();
    this._context.fill();
    this._context.stroke();
  }


  _draw_score_board() {
    this._context.fillStyle = "#DEB887";
    this._context.strokeStyle = "#795100";
    this._context.lineWidth = 2;
    this._round_rect(20, 480, 480, 80, 20, "#DEB887", "#795100");
    this._score_player();
  }


  _click_zone() {
    let list = this.engine().get_possible_move_list();
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].get_to() === 50) {
        this._context.fillStyle = "#DEB887";
        this._context.strokeStyle = "#795100";
        this._context.lineWidth = 2;
        this._round_rect(435, 425, 115, 40, 20, "#DEB887", "#795100");
        this._context.fill();
        this._context.font = "20px Arial";
        this._context.fillStyle = "black";
        this._context.fillText("Pass turn", 450, 450);
      }
    }
  }

  _score_list(y, yy, player) {
    let list = [Color.YELLOW, Color.GREEN, Color.BLUE, Color.RED, Color.ORANGE, Color.WHITE, Color.PURPLE];
    let x = 150;
    let xx = 120;
    for (let i = 0; i < 7; i += 1) {
      this._context.fillStyle = myColor.convert_to_hexa(list[i]);
      this._context.beginPath();
      this._context.arc(x, y, this._c, 0, Math.PI * 2);
      this._context.closePath();
      this._context.fill();
      x += 50;
      xx += 50;
      this._context.font = "20px Arial";
      this._context.fillStyle = "black";
      if (player === 1) {
        this._context.fillText(this.engine()._player_1[i], xx, yy);
      }
      if (player === 2) {
        this._context.fillText(this.engine()._player_2[i], xx, yy);
      }
    }

  }

  _score_player() {
    let y = 500;
    let yy = 507;
    this._context.font = "20px Arial";
    this._context.fillStyle = "black";
    this._context.fillText("Player 1", 30, yy);
    this._score_list(y, yy, 1);
    y = 540;
    yy = 547;
    this._context.font = "20px Arial";
    this._context.fillStyle = "black";
    this._context.fillText("Player 2", 30, yy);
    this._score_list(y, yy, 2);
  }


  _get_click_position(e) { // get the x and y coordinates of a click
    let rect = this._canvas.getBoundingClientRect();
    return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
  }

  _in_circle(id, x, y) { // return true if the point is in the cell number id, else false,
    return Math.sqrt(Math.pow((x - this._coord[id][0]), 2) + Math.pow(y - this._coord[id][1], 2)) < this._c;
  }


  _get_id(x, y) { // return the id of the cell based on coordinates of the click

    this._round_rect(435, 425, 115, 40, 20, "#DEB887", "#795100");

    if (x >= 435 && x <= 550 && y >= 425 && y <= 465) {
      return 50;
    }

    let indice = Math.trunc((y - this._r + this._c) / (2 * this._c)); // get the row where the player clicked


    let tab = rows[indice]; // get the cell on the row
    for (let i in tab) { // for each cell on the row
      if (this._in_circle(tab[i], x, y)) { // if the click is on a cell
        return tab[i]; // return the id of the cell
      }
    }
    return null;
  }

  _on_click(event) {
    this._pass = false;
    const pos = this._get_click_position(event); // pos of the mouse
    let id = this._get_id(pos.x, pos.y);
    if (id || id === 0 || id === 50) {
      if (this._engine.current_color() === this.color()) {
        this._pawn = this.engine().get_board().get_id_pawn();
        let list = this.engine().get_possible_move_list();
        if (list.length === 1 && list[0].get_to() === -1) {
          this.engine().changePlayer();
          this._manager.redraw();
          this._pass = true;
          this._manager.play();
          return;
        }
        let move = new Move(this._pawn, id);
        for (let i = 0; i < list.length; i += 1) {
          if ((move.get_from() === list[i].get_from()) && (list[i].get_to() === move.get_to())) {
            this._id = id;
            this._manager.play();
          }
        }
      }
    }
    this._manager.redraw();
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


  color() {
    return Player.PLAYER_1;
  }

  get_move() {
    let a;
    if (this.pass) {
      a = new Move(-1, -1);
    }
    else {
      a = new Move(this._pawn, this._id);
    }
    return a;
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
    this._played = true;
  }

  set_canvas(c) {
    super.set_canvas(c);

    this.draw(); // Ne pas oublier de dessiner le plateau une première fois !
    this._canvas.addEventListener("click", (e) => {
      this._on_click(e);
    });
  }


}

export default {
  Gui: Gui
};