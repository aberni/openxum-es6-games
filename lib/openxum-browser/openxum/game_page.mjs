"use strict";

const GameType = { GUI: 0, ONLINE: 1, OFFLINE: 2, LOCAL_AI: 3, REMOTE_AI: 4 };

class GamePage {
  constructor(root, namespace, name, first_color, color, opponent_color, game_type, game_id,
              mode, username, owner_id, opponent_id, replay) {
    this._generated_board = null;
    this.build_engine(namespace, mode, first_color, name, game_type, color);
    this.build_gui(namespace, color, game_id, game_type);
    this.build_opponent(root, namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
    this.build_manager(root, namespace);
    this.set_gui();
    this.set_opponent(game_id);

    if (this._opponent !== this._gui && this._engine.current_color() === this._opponent.color() && !this._opponent.is_remote()) {
      this._manager.play_other(true);
    }
    if (replay) {
      this._opponent.replay_game();
    }
  }

// private methods
  build_engine(namespace, mode, color, name, game_type, color_player) {
    this._engine = new namespace.Engine(mode, color);
  }

  build_gui(namespace, color, game_id, game_type) {
    this._gui = new namespace.Gui(color, this._engine, game_id === '-1', game_type === GameType.GUI);
  }

  build_opponent(root, namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id) {
    if (game_type === GameType.REMOTE_AI) {
      this._opponent = new namespace.RestWebServicePlayer(opponent_color, this._engine, username, 'http://127.0.0.1/openxum-ws-php/index.php/');
      this._opponent.start();
    } else if (game_type === GameType.GUI) {
      this._opponent = this._gui;
    } else if (game_type === GameType.LOCAL_AI) {
//      if (this._engine.get_possible_move_list) {
//        this._opponent = new OpenXum.MCTSPlayer(opponent_color, this._engine);
//      } else {
        this._opponent = new root.RandomPlayer(opponent_color, this._engine);
//      }
    } else if (game_type === GameType.ONLINE) {
      if (username === owner_id) {
        this._opponent = new namespace.RemotePlayer(opponent_color, this._engine, owner_id, opponent_id, game_id);
      } else {
        this._opponent = new namespace.RemotePlayer(color, this._engine, owner_id, opponent_id, game_id);
      }
    } else if (game_type === GameType.OFFLINE) {
      // TODO
    }
  }

  build_manager(root, namespace) {
    this._manager = new namespace.Manager(this._engine, this._gui, this._opponent,
      new root.Status(document.getElementById("status")));
  }

  manager() {
    return this._manager;
  }

  set_gui() {
    this._canvas = document.getElementById("board");
    this._canvas_div = document.getElementById("boardDiv");
    if (this._canvas_div.clientHeight < this._canvas_div.clientWidth) {
      this._canvas.height = this._canvas_div.clientHeight * 0.95;
      this._canvas.width = this._canvas_div.clientHeight * 0.95;
    } else {
      this._canvas.height = this._canvas_div.clientWidth * 0.95;
      this._canvas.width = this._canvas_div.clientWidth * 0.95;
    }
    this._gui.set_canvas(this._canvas);
    this._gui.set_manager(this._manager);
  }

  set_opponent(game_id) {
    if (game_id !== '-1') {
      this._opponent.set_manager(this._manager);
      this._opponent.set_gui(this._gui);
    } else {
      if (this._opponent !== this._gui) {
        this._opponent.set_level(this._manager.load_level());
      }
      if (this._opponent.is_remote()) {
        this._opponent.set_manager(this._manager);
      }
    }
  }
}

export default {
  GameType: GameType,
  GamePage: GamePage
};