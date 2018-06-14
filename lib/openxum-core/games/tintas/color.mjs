"use strict";

let Color = { UNDEFINED:-1, YELLOW: 0, GREEN: 1 , BLUE: 2, RED: 3, ORANGE: 4, WHITE: 5, PURPLE: 6, EMPTY: 7, PAWN: 8};


function isColor(color){
    switch (color) {
        case Color.YELLOW:
            return true;
            break;
        case GREEN:
            return true;
            break;
        case BLUE:
            return true;
            break;
        case RED:
            return true;
            break;
        case ORANGE:
            return true;
            break;
        case WHITE:
            return true;
            break;
        case PURPLE:
            return true;
            break;
        case EMPTY:
            return false;
            break;
        case PAWN:
            return false;
            break;
        case UNDEFINED:
            return false;
            break;
        default:
            console.log('Error to read value in isColor function');
            return false;
    }
}

function convert_to_hexa(color) {
    switch (color) {
        case Color.YELLOW:
            return "#EFEF2D";
            break;
        case Color.GREEN:
            return "#00DB16";
            break;
        case Color.BLUE:
            return "#5B93E6";
            break;
        case Color.RED:
            return "#EC1919";
            break;
        case Color.ORANGE:
            return "#FF8C00";
            break;
        case Color.WHITE:
            return "#FFFFFF";
            break;
        case Color.PURPLE:
            return "#800080";
            break;
        case Color.EMPTY:
            return "#A47940";
            break;
        case Color.PAWN:
            return "#000000";
            break;
        case Color.UNDEFINED:
            return "#A47940";
            break;
        default:
            console.log('Error to read value in convert_to_hexa function');
            return false;
    }
}

export {convert_to_hexa};
export default Color;