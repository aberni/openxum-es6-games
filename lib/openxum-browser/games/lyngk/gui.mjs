import OpenXum from '../../openxum/gui.mjs';
import Lyngk from '../../../openxum-core/games/lyngk/index.mjs';


class Gui extends OpenXum.Gui {
    constructor(c, e, l, g) {
        super(c, e, l, g);
    }

    draw() {

    }

    get_move() {

    }

    is_animate() {
        return false;
    }

    is_remote() {
        return false;
    }

    unselect() {

    }
}

export default {
    Gui : Gui
}