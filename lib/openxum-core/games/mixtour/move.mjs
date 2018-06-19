"use strict";

import MoveType from './move_type.mjs';

class Move
{
    constructor(ty, f, to, p)
    {
        this._type = ty;
        this._from=f;
        this._to = to;
        this._piece=p;
    }

// METHODES PUBLIQUES

    get()
    {
        if(this._type===MoveType.PUT_PIECE)
        {
            return "ajout " + String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y);
        }
        else
        {
            return "move from " + String.fromCharCode('a'.charCodeAt(0) + this._from.x) +(this._from.y) + "to" + String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y) + this._piece;
        }
    }

    to_string(){
      if(this._type===MoveType.PUT_PIECE)
      {
        return "put " + String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y);
      }
      else
      {
        return "move from " + String.fromCharCode('a'.charCodeAt(0) + this._from.x) + (this._from.y) + " to " + String.fromCharCode('a'.charCodeAt(0) + this._to.x) + (this._to.y) + " piece number : " + this._piece;
      }
    }

    getType()
    {
        return this._type;
    }

    getFrom()
    {
        return this._from;
    }

    getTo()
    {
        return this._to;
    }

    getPiece()
    {
        return this._piece;
    }

    isEqual(move2)
    {
        return this.type===move2.type && this._from.x===move2._from.x && this._from.y===move2._from.y && this._to.x===move2._to.x && this._to.y===move2._to.y && this._piece===move2._piece;
    }

    to_object()
    {
        // Retourne les données de classe sous forme d'objet.
        // Cet objet est utilisé pour envoyer le move à un api rest
        // (rest_web_service_player)
        return {type : this._type,from: this._from, to: this._to, piece : this._piece};
    }
}

export default Move;