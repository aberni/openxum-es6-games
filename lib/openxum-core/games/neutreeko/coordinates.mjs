"use strict";

class Coordinates {
  /**
   * @brief constructeur par défaut
   * @param c numéro de colonne
   * @param l numéro de ligne
   */
  constructor(c, l) {
    this._column = c;
    this._line = l;
  }

  /**
   *@brief test des coordonnées
   * @returns {boolean}
   */
  isValid() {

    return this._column >= 0 && this._column < 5 && this._line >= 0 && this._line < 5;
  }

  /**
   * @brief création d'une nouvelle coordonnée
   * @returns {Coordinates.constructor}
   */

  clone() {
    return new Coordinates(this._column, this._line);
  };

  /**
   * x variable attribuée à colonne
   * @returns {*}
   */

  x() {
    return this._column;
  };

  /**
   * y variable attribuée à ligne
   * @returns {*}
   */

  y() {
    return this._line;
  };


  /**
   * @brief retrouve une insertion
   * @returns {number}
   */
  hash() {

    return this._column.charCodeAt(0) + this._line * (4 * this._line) - 7;
  };

  /**
   * @brief en cas d'égalité des coordonnées
   * @param coordinate
   * @returns {boolean}
   */
  equals(coordinate) {
    return this._column === coordinate.x() &&
      this._line === coordinate.y();
  };

  /**
   * @brief méthode pour afficher un message sur test isValaid()
   * @returns {*}
   */
  to_string() {
    if (!this.isValid()) {
      return "invalid";
    }
    return this._column + "" + this._line;
  }

  /**
   * @brief formater les coordonnées
   * @returns {string}
   */
  formatted_string() {
    return String.fromCharCode('A'.charCodeAt(0) + this.x()) + (this.y() + 1);
  }
}

export default Coordinates;