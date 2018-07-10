/**
 * Created by lcanonne on 20/06/18.
 */
import OpenXum from '../../../openxum-core/openxum/player.mjs';
import Ia_alpha_beta from './alpha_beta.mjs';

class Alpha_beta_player extends OpenXum.Player {
  constructor(c, e) {
    super(c, e);
  }

  // public methods
  confirm() {
    return false;
  }

  is_ready() {
    return true;
  }

  is_remote() {
    return false;
  }

  move() {
    return (new Ia_alpha_beta(this._color, this._engine)).ia_play();
  }

  reinit(e) {
    this._engine = e;
  }
}

export default {
  Alpha_beta_player: Alpha_beta_player
};