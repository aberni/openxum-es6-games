"use strict";

import MoveType from './move_type.mjs';

class Move {
  constructor(ty, f, to, p) {
    this._type = ty;
    this._from = f;
    this._to = to;
    this._piece = p;
  }

// METHODES PUBLIQUES

  get() {
    if (this._type === MoveType.PUT_PIECE) {
      return "P" + "," + this._to.x + "," + this._to.y;
    }
    else {
      return "M" + "," + this._from.x + "," + this._from.y + "," + this._to.x + "," + this._to.y + "," + this._piece;
    }
  }

  get_type() {
    return this._type;
  }

  get_from() {
    return this._from;
  }

  get_to() {
    return this._to;
  }

  get_piece() {
    return this._piece;
  }

  is_equal(move2) {
    return this.type === move2.type && this._from.x === move2._from.x && this._from.y === move2._from.y && this._to.x === move2._to.x && this._to.y === move2._to.y && this._piece === move2._piece;
  }

  parse(str) {
    let to_process = str.split(',');
    if (to_process[0] === "P") {
      this._type = MoveType.PUT_PIECE;
      this._from = {x: -1, y: -1};
      this._to = {x: parseInt(to_process[1]), y: parseInt(to_process[2])};
      this._piece = parseInt(to_process[3]);
    }
    else {
      if (to_process[0] === "M") {
        this._type = MoveType.MOVE_TOWER;
        this._from = {x: parseInt(to_process[1]), y: parseInt(to_process[2])};
        this._to = {x: parseInt(to_process[3]), y: parseInt(to_process[4])};
        this._piece = parseInt(to_process[5]);
      }
    }
  }

  to_object() {
    // Retourne les données de classe sous forme d'objet.
    // Cet objet est utilisé pour envoyer le move à un api rest
    // (rest_web_service_player)
    return {type: this._type, from: this._from, to: this._to, piece: this._piece};
  }

  to_string() {
    if (this._type === MoveType.PUT_PIECE) {
      return "put " + String.fromCharCode('A'.charCodeAt(0) + this._to.x) + (this._to.y);
    }
    else {
      return "move from " + String.fromCharCode('A'.charCodeAt(0) + this._from.x) + (this._from.y) + " to " + String.fromCharCode('A'.charCodeAt(0) + this._to.x) + (this._to.y) + " piece number : " + this._piece;
    }
  }

}

export default Move;