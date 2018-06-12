// lib/openxum-browser/games/ordo/gui.mjs
import OpenXum from '../../openxum/gui.mjs';
// ...

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        // Vos attributs...
    }

    draw() {
        /*// La méthode principale de la classe qui se charge de dessiner à l'écran
        // (le plateau, les pièces, les mouvements possibles, ...)

        // background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#ffffff";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);

        // implémenter le reste du rendu ici*/

        this._context.lineWidth = 1;

        // background
        this._context.fillStyle = "#4C3629";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, false);

        this._draw_grid();
        this._draw_state();
    }

    get_move() {
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

    unselect() {
        // Remet à zéro tous les attributs relatifs au coup qui vient d'être joué
    }

    set_canvas(c) {
        /*super.set_canvas(c);

        // Ajouts des événements
        // Par exemple, pour intercepter les clics de la souris
        this._canvas.addEventListener("click", (e) => {
            // ...
        });

        this.draw(); // Ne pas oublier de dessiner le plateau une première fois !*/
        super.set_canvas(c);
        this._canvas.addEventListener("click", (e) => { let pos = this._get_click_position(e); if(pos.x >= 0 && pos.x < 11 && pos.y >= 0 && pos.y < 11) this._on_click(pos.x, pos.y); });

        this._deltaX = (this._canvas.width * 0.95 - 40) / 11;
        this._deltaY = (this._canvas.height * 0.95 - 40) / 11;
        this._offsetX = this._canvas.width / 2 - this._deltaX * 5.5;
        this._offsetY = this._canvas.height / 2 - this._deltaY * 5.5;

        this.draw();
    }

    _draw_state() {
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 11; x++) {
                if (this._engine._board[x][y] !== undefined) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                }
            }
        }

        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }
    }

    _draw_state() {
        for (let y = 0; y < 11; y++) {
            for (let x = 0; x < 11; x++) {
                if (this._engine._board[x][y] !== undefined) {
                    let pt = this._compute_coordinates(x, y);
                    this._draw_piece(pt[0], pt[1], this._engine._board[x][y]);
                }
            }
        }

        if (this._selected_piece !== undefined) {
            this._draw_selected_piece();
        }
    }

    _compute_coordinates(x, y) {
        return [this._offsetX + x * this._deltaX + (this._deltaX / 2) - 1, this._offsetY + y * this._deltaY + (this._deltaY / 2) - 1];
    }

    _draw_piece(x, y, piece) {
        let radius = (this._deltaX / 2.3);

        if (piece.color() === Hnefatafl.Color.BLACK) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
        }
        else {
            this._context.strokeStyle = "#F0F0F0";
            this._context.fillStyle = "#F0F0F0";
        }

        this._context.lineWidth = 1;
        this._context.beginPath();
        this._context.arc(x, y, radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.fill();
        this._context.stroke();

        if (piece.isKing()) {
            this._context.strokeStyle = "#303030";
            this._context.fillStyle = "#303030";
            this._context.beginPath();
            this._context.moveTo(x - (radius * 0.4), y + (radius * 0.2));
            this._context.lineTo(x - (radius * 0.4), y - (radius * 0.4));
            this._context.lineTo(x - (radius * 0.2), y - (radius * 0.1));

            this._context.lineTo(x, y - (radius * 0.4));

            this._context.lineTo(x + (radius * 0.2), y - (radius * 0.1));
            this._context.lineTo(x + (radius * 0.4), y - (radius * 0.4));
            this._context.lineTo(x + (radius * 0.4), y + (radius * 0.2));
            this._context.lineTo(x - (radius * 0.4), y + (radius * 0.2));
            this._context.stroke();
            this._context.fill();
        }
    }

    _draw_selected_piece() {
        let x = this._selected_piece.coordinates().x();
        let y = this._selected_piece.coordinates().y();
        let possible_moves = this._engine._get_possible_move_list(this._selected_piece);
        let pt = this._compute_coordinates(x, y);
        let radius = (this._deltaX / 2.3);

        this._context.lineWidth = 4;
        this._context.strokeStyle = "#d8370f";
        this._context.beginPath();
        this._context.arc(pt[0], pt[1], radius, 0.0, 2 * Math.PI);
        this._context.closePath();
        this._context.stroke();

        this._context.fillStyle = "#d8370f";
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