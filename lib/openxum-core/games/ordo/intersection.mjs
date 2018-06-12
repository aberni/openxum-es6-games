"use strict";

import State from './state.mjs';

class Intersection {
    constructor(coordinate) {
        this._coordinate = coordinate;
        this._state = State.VACANT;
    }

    clone() {
        let intersection = new Intersection(this._coordinate.clone());

        intersection.set(this._state);
        return intersection;
    }

    // implémentation des autres méthodes qui semblent nécessaires ...
}

export default Intersection;