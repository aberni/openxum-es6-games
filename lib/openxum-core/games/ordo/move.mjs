"use strict";

import Color from './color.mjs';
import Coordinates from './coordinates.mjs';
import OpenXum from '../../openxum/index.mjs';
import Piece from './piece.mjs';

class Move extends OpenXum.Move {
  constructor(p, t) {
    super();
    this._piece = p;
    this._to = t;
  }

  // public methods
  decode(str) {
    let color = Color.NONE;

    if (str.charAt(0) === 'W') {
      color = Color.WHITE;
    }
    else if (str.charAt(0) === 'B') {
      color = Color.BLACK;
    }

    let coords = str.split(/[()]+/).filter(function (e) {
      return e;
    });

    this._to = new Coordinates(parseInt(coords[2].split(',')[0]), parseInt(coords[2].split(',')[1]));
    this._color = color;
    this._piece = new Piece(color, new Coordinates(parseInt(coords[1].split(',')[0]), parseInt(coords[1].split(',')[1])));
  }

  encode() {
    return (this._piece.color() === Color.WHITE ? 'W' : 'B') + this._piece.coordinates().to_string() + this._to.to_string();
  }

  piece() {
    return this._piece;
  }

  from() {
    return this._piece.coordinates();
  }

  to() {
    return this._to;
  }

  to_object() {
    return null; // TODO
  }

  to_string() {
    return 'move' + (this._piece.color() === Color.WHITE ? " white pawn" : " black pawn") + " from " + this._piece.coordinates().to_string() + " to " + this._to.to_string();
  }
}

export default Move;