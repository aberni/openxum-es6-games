"use strict";

let Color = { UNDEFINED:-1, YELLOW: 0, GREEN: 1 , BLUE: 2, RED: 3, ORANGE: 4, WHITE: 5, PURPLE: 6, EMPTY: 7};


function isColor(color){
    switch (color) {
        case YELLOW:
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
        case UNDEFINED:
            return false;
            break;
        default:
            console.log('Error to read value in isColor function');
            return false;
    }
}
export default Color;
