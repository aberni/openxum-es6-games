"use strict";

class Coordinates {
    constructor(c, l) {
        this._colonne = c;
        this._ligne = l;
    }

    isValid() {
        return (this._colonne === 'A' && this._ligne === 3) ||
            (this._colonne === 'B' && this._ligne >= 2 && this._ligne <= 5) ||
            (this._colonne === 'C' && this._ligne >= 1 && this._ligne <= 7) ||
            (this._colonne === 'D' && this._ligne >= 2 && this._ligne <= 7) ||
            (this._colonne === 'E' && this._ligne >= 2 && this._ligne <= 8) ||
            (this._colonne === 'F' && this._ligne >= 3 && this._ligne <= 8) ||
            (this._colonne === 'G' && this._ligne >= 3 && this._ligne <= 9) ||
            (this._colonne === 'H' && this._ligne >= 5 && this._ligne <= 8) ||
            (this._colonne === 'I' && this._ligne === 7);
    }

    getRepresentation() {
        if (!this.isValid()) {
            return "invalid";
        }

        return this._colonne + this._ligne;
    }

    clone() {
        return new Coordinates(this._colonne, this._ligne);
    };

    getColonne() {
        return this._colonne;
    };

    getLigne() {
        return this._ligne;
    };

    hash() {
        return this._colonne.charCodeAt(0) + this._ligne * (4 * this._ligne) - 7;
    };

    equals(coordinate) {
        return this._colonne === coordinate.getColonne() &&
            this._ligne === coordinate.getLigne();
    };
}

export default Coordinates;