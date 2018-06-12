"use strict";

const posX=[-4,-4,-3,-3,-3,-3,-3,
    -2,-2,-2,-2,-2,-2,-2
    -1,-1,-1,-1,-1,-1,-1,
    0,0,0,0,0,0,0,
    1,1,1,1,1,1,1,
    2,2,2,2,2,2,2,
    3,3,3,3,3,4,4
];

const posY=[2,3,-1,0,1,2,3,
    -2,-1,0,1,2,3,4,
    -2,-1,0,1,2,3,4,
    -3,-2,-1,0,1,2,3,
    -4,-3,-2,-1,0,1,2,
    -4,-3,-2,-1,0,1,2,
    -3,-2,-1,0,1,-3,-2
];

const posZ=[-2,-1,-4,-3,-2,-1,0,
    -4,-3,-2,-1,0,1,2,
    -3,-2,-1,0,1,2,3,
    -3,-2,-1,0,1,2,3,
    -3,-2,-1,0,1,2,3,
    -2,-1,0,1,2,3,4,
    0,1,2,3,4,1,2
];

class Coordinates{
    constructor(i) {
        this._posX = posX[i];
        this._posY = posY[i];
        this._posZ = posZ[i];
    }

// public methods

    isValid(){
        let i;
        for(i=0;i<49;i++){
            if(_posX==posX[i] && _posY==posY[i] && _posZ==posZ[i]){
                return true;
            }
        }
        return false;
    }

    matrix(transMat){ //apply the matrix transition to the current coordinates
        if(transMat.length==3){
            this._posX+=transMat[0];
            this._posY+=transMat[1];
            this._posZ+=transMat[2];
        }


    }
    // BEGIN USELESS
    /*
    getRepresentation() {
        if (!this.isValid()) {
            return "invalid";
        }

        return " x = " + this._column + this._line;
    }

    to_string() {
        return this.getRepresentation();
    }
    */
    // END USELESS
    clone() {
        return new Coordinates(this._posX, this._posY,this._postZ);
    };

    getPosX(){
        return _posX;
    }

    getPosY(){
        return _posY;
    }

    getPosZ(){
        return _posZ;
    }

}

export default Coordinates;