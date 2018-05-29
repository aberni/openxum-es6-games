"use strict";

const invalidCoordinates = [
    "A1", "B1", "D1", "E1", "F1", "G1", "H1", "I1",
    "A2", "F2", "G2", "H2", "I2",
    "H3", "I3",
    "A4", "H4", "I4",
    "A5", "I5",
    "A6", "B6", "I6",
    "A7", "B7",
    "A8", "B8", "C8", "D8", "I8",
    "A9", "B9", "C9", "D9", "E9", "F9", "H9", "I9"
];

class Coordinates {
    constructor(c, l) {
        this._colonne = c;
        this._ligne = l;
    }

    isValid() {
        let coords = c + l;

        for (let i = 0; i < invalidCoordinates.length; i++) {
            if (invalidCoordinates[i] === coords) {
                return false;
            }
        }

        return true;
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