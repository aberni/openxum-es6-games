"use stric"

import Vector from "./vector.mjs";

class ThreeInConnectedRow {
    /**
     * Constructor
     * @param c1 coordinates of piece_1
     * @param c2 coordinates of piece_2
     * @param c3 coordinates of piece_3
     */
    constructor(c1, c2, c3) {
        this._v1 = new Vector(c1, c2);
        this._v2 = new Vector(c1, c3);
    }

    is_connected_row() {
        return this._two_pieces_connected() && this._is_raw();
    }

    /**
     * Return true if v1 = k * v2 with k = {-1, 0.5, 2}
     * @returns {*}
     * @private
     */
    _is_raw() {
        return (
            this._v1.equals( this._v2.multiple(2) ) ||
            this._v1.equals( this._v2.multiple(-1) ) ||
            this._v1.equals( this._v2.multiple(0.5) )
        );
    }

    _two_pieces_connected(v) {
        if(arguments.length === 0) {
            return this._two_pieces_connected(this._v1) || this._two_pieces_connected(this._v2);
        } else {
            return (
                (v._x === 0 || v._x === 1 || v._x === -1) &&
                (v._y === 0 || v._y === 1 || v._y === -1)
            );
        }
    }


}

export default ThreeInConnectedRow;