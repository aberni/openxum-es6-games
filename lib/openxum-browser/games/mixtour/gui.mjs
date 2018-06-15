"use strict";

import OpenXum from '../../openxum/gui.mjs';
import Mixtour from '../../../openxum-core/games/mixtour/index.mjs';

class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);

        this._selected_coordinates = null;
        this._selected_piece = null;
        this._move=null;
    }

    draw() {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.lineWidth = 10;
        //background
        this._context.strokeStyle = "#000000";
        this._context.fillStyle = "#6e4106";
        this._round_rect(0, 0, this._canvas.width, this._canvas.height, 17, true, true);
        this._draw_grid();
        this._draw_state();
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
        // TODO
    }

    set_canvas(c) {
        super.set_canvas(c);

        this._height = this._canvas.height;
        this._width = this._canvas.width;
        //size of a grid square
        this._deltaX = (this._width * 0.95 - 10) / 5;
        this._deltaY = (this._height * 0.95 - 10) / 5;
        //distance between the grid and the edge of the play area
        this._offsetX = this._width / 2 - this._deltaX * 2.5;
        this._offsetY = this._height / 2 - this._deltaY * 2.5;

        //size of a piece (up to 5 pieces can be displayed on a single square)
        this._sizePieceX = (this._deltaX * 0.60);
        this._sizePieceY = (this._deltaX * 0.80 / 5);

        //distance between a piece and the edge of the square
        this._offsetPieceX = (this._deltaX * 0.20);
        this._offsetPieceY = (this._deltaY * 0.10);

        this._canvas.addEventListener("click", (e) => {
            this._on_click(e);
        });

        this.draw();
    }

    unselect() {
        this._selected_coordinates = null;
        this._selected_piece = null;
        this._move=null;
    }


    _compute_square_coordinates(x, y){
        return {
            x: Math.floor((x - this._offsetX) / (this._deltaX)),
            y: Math.floor((y - this._offsetY) / (this._deltaY))
        };
    }

    _draw_grid() {
        this._context.lineWidth = 1;
        this._context.fillStyle = "#8c5206";
        this._context.strokeStyle = "#000000";
        for (let i = 0; i < 5; ++i) {
            for (let j = 0; j < 5; ++j) {
                this._context.beginPath();
                this._context.rect(this._offsetX + i * this._deltaX, this._offsetY + j * this._deltaY, this._deltaX , this._deltaY);
                if(this._selected_coordinates && i===this._selected_coordinates.x && j===this._selected_coordinates.y) {
                    this._context.fillStyle = "#edb76f";
                    this._context.fill();
                    this._context.fillStyle = "#8c5206";
                }
                else {
                    this._context.fill();
                }
                this._context.stroke();
            }
        }
    }

    _draw_tower(tower) {
        //coordinates of the bottom-left point of the tower
        let towerBaseX = this._offsetX + tower.x * this._deltaX + this._offsetPieceX;
        let towerBaseY = this._offsetY + (tower.y+1) * this._deltaY - this._offsetPieceY;
        //draw each piece that is part of the tower
        for (let j = 0; j < tower.pieces.length; ++j) {
            this._context.fillStyle = tower.pieces[j] === Mixtour.Color.WHITE ? "#ffffff" : "#000000";
            this._context.beginPath();
            this._context.rect(towerBaseX , towerBaseY - (j + 1) * this._sizePieceY, this._sizePieceX, this._sizePieceY);
            this._context.stroke();
            this._context.stroke();
            this._context.fill();
        }
        if(this._selected_piece && tower===this._selected_piece.tower){
            this._context.beginPath();
            this._context.lineWidth = 5;
            this._context.strokeStyle="#ff0000";
            this._context.rect(towerBaseX , towerBaseY - (tower.pieces.length) * this._sizePieceY, this._sizePieceX, this._sizePieceY * (tower.pieces.length-this._selected_piece.piece));
            this._context.stroke();
            this._context.lineWidth = 1;
            this._context.strokeStyle="#838383"

        }
    }

    _draw_state() {
        this._context.lineWidth = 1;
        this._context.strokeStyle = "#838383";
        let towers = this._engine.getTowers();
        for (let i = 0; i < towers.length; ++i) {
            this._draw_tower(towers[i]);
        }
    }

    _find_piece(x, y) {
        const coordinates = this._compute_square_coordinates(x, y);
        let k = 0;
        let found = false;
        const towers=this._engine.getTowers();
        while (!found && k<towers.length) {
            if (towers[k].x === coordinates.x && towers[k].y === coordinates.y) {
                found = true;
            } else {
                ++k;
            }
        }
        if (found) {
            let pieceRank=this._find_piece_rank(towers[k],x,y);
            if(pieceRank>=0) {
                return {tower : towers[k], piece: pieceRank};
            }
        }
        return null;
    }

    _find_piece_rank(tower,x,y){
        const posInSquareX=x-tower.x*this._deltaX-this._offsetX;
        const posInSquareY=y-tower.y*this._deltaY-this._offsetY;
        if(posInSquareX<this._offsetPieceX || posInSquareX> this._deltaX-this._offsetPieceX)
        {
            return -1;
        }

        const pieceRank=4-Math.floor((posInSquareY-this._offsetPieceY)/this._sizePieceY);
        if(pieceRank<0 || pieceRank>=tower.pieces.length)
        {
            return -1;
        }
        else
        {
            return pieceRank;
        }
    }

    _get_click_position(e) {
        const rect = this._canvas.getBoundingClientRect();

        return {x: (e.clientX - rect.left) * this._scaleX, y: (e.clientY - rect.top) * this._scaleY};
    }

    _on_click(event) {
        if(this._engine.phase() === Mixtour.Phase.MOVE_TOWER) {
            const pos = this._get_click_position(event);
            const select = this._find_piece(pos.x, pos.y);

            if (select) {
                if (this._selected_piece && select.tower === this._selected_piece.tower && select.piece === this._selected_piece.piece) {
                    this._selected_piece = null;
                }
                else {
                    this._selected_piece = select;
                }
                this._selected_coordinates = null;
            }
            else {
                const coords = this._compute_square_coordinates(pos.x, pos.y);
                if (coords.x >= 0 && coords.x < 5 && coords.y >= 0 && coords.y < 5) {
                    if (!this._selected_piece) {
                        if (this._selected_coordinates && this._selected_coordinates.x === coords.x && this._selected_coordinates.y === coords.y) {
                            this._move = new Mixtour.Move(Mixtour.MoveType.PUT_PIECE, 0,
                                {x: this._selected_coordinates.x, y: this._selected_coordinates.y}, 1);
                            if (this._engine.verify_move(this._move)) {
                             this._manager.play();
                             }
                        }
                        else {
                            this._selected_coordinates = coords;
                        }
                    }
                    else {
                        this._selected_coordinates = coords;
                        this._move=new Mixtour.Move(Mixtour.MoveType.MOVE_TOWER,
                            {x: this._selected_piece.tower.x, y: this._selected_piece.tower.y},
                            {
                                x: this._selected_coordinates.x,
                                y: this._selected_coordinates.y
                            }, this._selected_piece.piece);
                        if (this._engine.verify_move(this._move)) {
                            this._manager.play();
                         }
                         else
                         {
                         this._selected_coordinates=null;
                         }
                    }
                }
            }
            this.draw();
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