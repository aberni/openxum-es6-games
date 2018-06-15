"use strict";

import Color from './color.mjs';
import Move from './move.mjs';
import OpenXum from '../../openxum/engine.mjs';
import Phase from './phase.mjs';
import MoveType from './move_type.mjs';

class Engine extends OpenXum.Engine
{

    constructor(t, c)
    {
        super();

        this._type = t;
        this._color = c;
        this._black_piece_amount = 25;
        this._white_piece_amount = 25;
        this._black_points=0;
        this._white_points=0;
        this._towers = [];
        this._last_move = null;
        this._phase = Phase.MOVE_TOWER;
    }

    apply_moves(moves)
    {
        // Permet d'appliquer une liste de coups.
        // Le paramètre moves contient un tableau d'objets Move.
    }

    clone()
    {

    }

    current_color()
    {
        return this._color;
    }

    current_color_string()
    {
        return this._color === Color.BLACK ? 'Black' : 'White';
    }

    get_name()
    {
        return 'Mixtour';
    }

    get_possible_move_list()
    {
        let list = [];
        let move_to_avoid;
        if(this._last_move)
        {
            move_to_avoid=new Move(this._last_move.getType(), this._last_move.getTo(), this._last_move.getFrom(), this._last_move.getPiece());
        }
        else
        {
            move_to_avoid=null;
        }
        if((this._color===Color.BLACK && this._black_piece_amount>0) || (this._color===Color.WHITE && this._white_piece_amount>0))
        {
            list = list.concat(this._get_possible_putting_list());
        }
        for(let i=0; i<this._towers.length; ++i)
        {
            const dest_tower=this._towers[i];
            list = list.concat(this._get_possible_moves_to_tower_list(move_to_avoid, dest_tower));
        }
        return list;
    }

    getTowers()
    {
        return this._towers;
    }

    is_finished()
    {
        return this._phase === Phase.FINISH;
    }

    move(move)
    {
        if(move.getType()===MoveType.PUT_PIECE)
        {
            let new_tower={x : move.getTo().x, y : move.getTo().y, pieces : [this._color]};
            this._towers=this._towers.concat(new_tower);
            this._remove_piece_from_reserve();
            this._last_move=null;
        }
        else
        {
            let index_tower_from;
            let index_tower_to;
            for(let i=0; i<this._towers.length; ++i)
            {
                if(this._towers[i].x=== move.getFrom().x && this._towers[i].y=== move.getFrom().y)
                {
                    index_tower_from=i;
                }
                else
                {
                    if(this._towers[i].x=== move.getTo().x && this._towers[i].y=== move.getTo().y)
                    {
                        index_tower_to=i;
                    }
                }
            }

            let to_move=this._towers[index_tower_from].pieces.slice(move.getPiece());
            this._towers[index_tower_to].pieces= this._towers[index_tower_to].pieces.concat(to_move);

            if(this._towers[index_tower_to].pieces.length>=5)
            {
                this._add_point();
                if(index_tower_from > index_tower_to)
                {
                    index_tower_from--;
                }
                this._add_reserve(this._towers[index_tower_to].pieces);
                this._remove_tower(index_tower_to);
            }

            if(move.getPiece()===0)
            {
                this._remove_tower(index_tower_from);
            }
            else
            {
                this._towers[index_tower_from].pieces.splice(move.getPiece());
            }
            this._last_move=move;
        }
        this._next_color();
    }


    parse(str)
    {
        // Modifier l'état du jeu en fonction de l'état passé sous forme d'une
        // chaîne de caractères
    }

    phase()
    {
        return this._phase;
    }

    to_string()
    {
        // Construit une représentation sous forme d'une chaîne de caractères
        // de l'état du jeu
    }

    verify_move(move)
    {
        const list=this.get_possible_move_list();
        for(let i=0; i<list.length;++i)
        {
            if(move.isEqual(list[i]))
            {
                return true;
            }
        }
        return false;
    }

    winner_is()
    {
        if (this.is_finished())
        {
            return this._color;
        }
    }

    _add_point()
    {
        if(this._color===Color.WHITE)
        {
            this._white_points++;
            if(this._white_points>=5)
            {
                this._phase=Phase.FINISH;
            }
        }
        else
        {
            this._black_points++;
            if(this._black_points>=5)
            {
                this._phase=Phase.FINISH;
            }
        }
    }

    _add_reserve(pieces)
    {
        for(let i=0; i< pieces.length; ++i)
        {
            pieces[i] === Color.WHITE ? this._white_piece_amount++ : this._black_piece_amount++;
        }
    }

    _get_moves_between_towers(move_to_avoid, dest_tower, start_tower)
    {
        let moves_between_towers=[];
        for(let j=0; j<start_tower.pieces.length; ++j)
        {
            const move=new Move(MoveType.MOVE_TOWER, {x : start_tower.x, y: start_tower.y}, {x : dest_tower.x, y : dest_tower.y} , j);
            if(!move_to_avoid || !move.isEqual(move_to_avoid))
            {
                moves_between_towers=moves_between_towers.concat(move);
            }
        }
        return moves_between_towers;
    }

    _get_possible_moves_to_tower_list(move_to_avoid, dest_tower)
    {
        let move_list=[];

        //TOP
        let i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x, dest_tower.y - (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x, dest_tower.y - (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //BOTTOM
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x,dest_tower.y + (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x, dest_tower.y + (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //LEFT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x - (i +1),dest_tower.y))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x - (i+1), dest_tower.y);
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //RIGHT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x + (i +1),dest_tower.y))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x + (i+1), dest_tower.y);
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //TOP-LEFT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x - (i + 1),dest_tower.y - (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x - (i + 1), dest_tower.y - (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //TOP-RIGHT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x + (i + 1),dest_tower.y - (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x + (i + 1), dest_tower.y - (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //BOTTOM-LEFT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x - (i + 1),dest_tower.y + (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x - (i + 1), dest_tower.y + (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        //BOTTOM-RIGHT
        i = 0;
        while (i < dest_tower.pieces.length && !this._search_tower(dest_tower.x + (i + 1),dest_tower.y + (i + 1)))
        {
            ++i;
        }
        if (i < dest_tower.pieces.length)
        {
            const start_tower = this._search_tower(dest_tower.x + (i + 1), dest_tower.y + (i + 1));
            move_list=move_list.concat(this._get_moves_between_towers(move_to_avoid, dest_tower, start_tower));
        }

        return move_list;
    }

    _get_possible_putting_list()
    {
        let putting_list=[];
        for(let i=0; i<5; ++i)
        {
            for(let j=0; j<5; ++j)
            {
                if(!this._search_tower(i,j))
                {
                    putting_list = putting_list.concat(new Move(MoveType.PUT_PIECE, 0, {x:i, y:j}, 1));
                }
            }
        }
        return putting_list;
    }

    _next_color()
    {
        this._color= this._color===Color.WHITE ? Color.BLACK : Color.WHITE;
    }

    _remove_piece_from_reserve()
    {
        if (this._color === Color.BLACK)
        {
            --this._black_piece_amount;
        }
        else
        {
            --this._white_piece_amount;
        }
    }

    _remove_tower(index_tower_to_remove)
    {
        this._towers.splice(index_tower_to_remove,1);
    }

    _search_tower(x,y)
    {
        for(let i=0; i<this._towers.length; ++i)
        {
            if(this._towers[i].x===x && this._towers[i].y===y)
            {
                return this._towers[i];
            }
        }
        return null;
    }
}

export default Engine;