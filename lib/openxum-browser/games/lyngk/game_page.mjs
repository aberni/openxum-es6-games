"use strict";

import OpenXum from '../../openxum/game_page.mjs';
import Color from '../../../openxum-core/games/lyngk/color.mjs';


class GamePage extends OpenXum.GamePage {
    constructor(namespace, name, first_color, color, opponent_color, game_type, game_id,
                mode, username, owner_id, opponent_id, replay) {
        super(namespace, name, first_color, color, opponent_color, game_type, game_id, mode, username, owner_id,
            opponent_id, replay);
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

        let div = $('<div/>', {class: 'form-group row'});
        let list = $('<select/>', {class: 'form-control col-md-7', id: 'colors'});

        list.appendTo(div);
        let claimButton = $('<a/>', {class: 'btn btn-success btn-md active col-md-5', id: 'claim', href: '#',
            html: 'Claim'}).appendTo(div);

        let that = this;
        claimButton.click(function() {
            let selectedColor = $('#colors').val();

            if (that._gui._on_claim_click(selectedColor)) {
                that.removeClaimColor(selectedColor);
            }
        });
        div.appendTo(row);
        row.appendTo(main);
    }

    build_engine(namespace, mode, color, name, game_type, color_player) {
        super.build_engine(namespace, mode, color, name, game_type, color_player);
        this.postEngineEvents();
    }

    postEngineEvents() {
        let that = this;
        let list = $('#colors');
        list.find("option").remove();

        let availableColors = this._engine.getAvailableColors();
        availableColors.forEach(function(color) {
            that.add_link_to_list(list, color, that.get_color_label(color));
        });
    }

    removeClaimColor(selectedColor) {
        let selector = "#colors option[value='" + selectedColor + "']";
        $(selector).remove();
    }

    add_link_to_list(list, value, label) {
        let option = $('<option/>', {value : value, html: label});
        option.appendTo(list);
    }


    get_color_label(color) {
        switch (color) {
            case Color.WHITE:
                return "Blanc";
            case Color.BLACK:
                return "Noir";
            case Color.BLUE:
                return "Bleu";
            case Color.GREEN:
                return "Vert";
            case Color.IVORY:
                return "Ivoire";
            case Color.RED:
                return "Rouge";
            default:
                return "?";
        }
    }

}

export default {
    GamePage : GamePage
}