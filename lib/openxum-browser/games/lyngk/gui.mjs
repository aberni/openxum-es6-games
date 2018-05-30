import OpenXum from '../../openxum/gui.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';


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

    _compute_deltas() {
        this._offset = 30;
        this._delta_x = (this._width - 2 * this._offset) / 9.0;
        this._delta_y = this._delta_x;
        this._delta_xy = this._delta_y / 2;
        this._offset = (this._width - 8 * this._delta_x) / 2;
    }

    _draw_grid() {

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
    Gui : Gui
}