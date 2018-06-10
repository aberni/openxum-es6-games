"use strict";

import OpenXum from '../../openxum/game_page.mjs';
import Color from '../../../openxum-core/games/manalath/color.mjs';


class GamePage extends OpenXum.GamePage {
    constructor(namespace, name, first_color, color, opponent_color, game_type, game_id,
                mode, username, owner_id, opponent_id, replay) {
        super(namespace, name, first_color, color, opponent_color, game_type, game_id, mode, username, owner_id,
            opponent_id, replay);

        $('body').on('contextmenu', 'canvas', function(e){ return false; });
    }

    build_buttons() {
        let row = $('<div/>', {class: 'row'});
        let col = $('<div/>', {class: 'col-md-3'});
        let main = $('#main');

        $('<a/>', {class: 'btn btn-success btn-md active', id: 'status', href: '#', html: 'Ready!'}).appendTo(col);
        $('<a/>', {class: 'btn btn-warning btn-md active', id: 'replay', href: '#', html: 'Replay'}).appendTo(col);
        $('<a/>', {
            class: 'btn btn-danger btn-md active', id: 'list', href: '#', html: 'Move list',
            'data-toggle': 'modal', 'data-target': '#moveListModal'
        }).appendTo(col);
        col.appendTo(row);

        let div = $('<div/>', {class: 'form-group col-md-9'});
        let list = $('<select/>', {class: 'form-control col-md-2', id: 'colors', style: 'display: inline;'});

        this.add_link_to_list(list, Color.WHITE, GamePage.get_color_label(Color.WHITE));
        this.add_link_to_list(list, Color.BLACK, GamePage.get_color_label(Color.BLACK));

        list.appendTo(div);
        div.appendTo(row);
        row.appendTo(main);
    }


    add_link_to_list(list, value, label) {
        let option = $('<option/>', {value : value, html: label});
        option.appendTo(list);
    }

    static get_color_label(color) {
        switch (color) {
            case Color.WHITE:
                return "Blanc";
            case Color.BLACK:
                return "Noir";
            default:
                return "?";
        }
    }
}

export default {
    GamePage : GamePage
}