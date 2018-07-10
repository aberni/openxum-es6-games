// lib/openxum-browser/games/neutreeko/manager.mjs
import OpenXum from '../../openxum/manager.mjs';
import Neutreeko from '../../../openxum-core/games/neutreeko/index.mjs';
import Color from '../../../openxum-core/games/neutreeko/color.mjs';

class Manager extends OpenXum.Manager {
  constructor(e, g, o, s) {
    super(e, g, o, s);
    this.that(this);
  }

  build_move() {
    // Retourne l'implémentation d'un mouvement par défaut du jeu
    return new Neutreeko.Move();
  }

  get_current_color() {
    // Retourne la couleur du joueur courant
    // return this.engine().current_color() === Color.WHITE ? 'White' : 'Black';
    switch (this.engine().current_color()) {
      case Color.WHITE:
        return 'White';
        break;
      case Color.BLACK:
        return 'Black';
        break;
      case Color.BLUE:
        return 'Blue';
        break;
      case Color.RED:
        return 'Red';
        break;
      case Color.GREEN:
        return 'Green';
        break;
      case Color.IVORY:
        return 'Ivory';
        break;
      default:
        return 'Nobody';
    }
  }

  static get_name() {
    // Retourne le nom du jeu
    return 'neutreeko';
  }

  get_winner_color() {
    // Retourne sous forme d'une chaîne de caractères la couleur du vainqueur
    switch (this.engine().winner_is()) {
      case Color.WHITE:
        return 'White';
        break;
      case Color.BLACK:
        return 'Black';
        break;
      case Color.BLUE:
        return 'Blue';
        break;
      case Color.RED:
        return 'Red';
        break;
      case Color.GREEN:
        return 'Green';
        break;
      case Color.IVORY:
        return 'Ivory';
        break;
      default:
        return 'Nobody';
    }
    //return this.engine().winner_is() === Color.WHITE ? 'white' : 'black';
  }

  process_move() {
    // À implémenter si le manager doit gérer des éléments annexes des coups
    // Par défaut, laisser vide
  }
}

export default {
  Manager: Manager
};