"use strict";

const pos=[-4,-1,3,
    -4,-2,2,   -3,0,3,    -2,2,4,
    -3,-1,2,   -2,1,3,    -1,3,4,
    -3,-2,1,   -2,0,2,    -1,2,3,
    -3,-3,0,   -2,-1,1,   -1,1,2,    0,3,3,
    -3,4,-1,   -2,-2,0,   -1,0,1,    0,2,2,
    -2,-3,-1,  -1,-1,0,    0,1,1,    1,3,2,
    -2,-4,-2,  -1,-2,-1,   0,0,0,    1,2,1,   2,4,2,
    -1,-3,2,    0,-1,-1,   1,1,0,    2,3,1,
    0,-2,-2,    1,0,-1,    2,2,0,    3,4,1,
    0,-3,-3,    1,-1,-2,    2,1,1,    3,3,0,
    1,-2,-3,    2,0,-2,    3,2,1,
    1,-3,-4,    2,-1,-3,   3,1,-2,
    2,-2,-4,    3,0,-3,    4,2,-2,
    4,1,-3
];


class Coordinates{ //final version
    constructor(i) {
        this._pos_x = pos[i*3];
        this._pos_y = pos[i*3+1];
        this._pos_z = pos[i*3+2];
    }

// public methods

    is_valid(){ // return true if the coordinates own to a cell, else return false
        let i;
        for(i=0;i<49;i++){
            if(this._pos_x==pos[i*3] && this._pos_y==pos[i*3+1] && this._pos_z==pos[i*3+2]){
                return true;
            }
        }
        return false;
    }

    matrix(trans_mat){ //apply the matrix transition to the current coordinates
        if(trans_mat.length===3){
            this._pos_x+=trans_mat[0];
            this._pos_y+=trans_mat[1];
            this._pos_z+=trans_mat[2];
        }
    }

    clone() {
        return new Coordinates(this._pos_x, this._pos_y,this._pos_z);
    }

    get_pos_x(){
        return this._pos_x;
    }

    get_pos_y(){
        return this._pos_y;
    }

    get_pos_z(){
        return this._pos_z;
    }

}

export default Coordinates;