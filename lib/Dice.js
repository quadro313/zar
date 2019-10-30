import R from 'ramda';
import mathjs from 'mathjs'

export default class Dice {
    notation = '';
    diceToken = '';
    sideConfiguration = [];
    biasConfiguration = [];
    state = '';
    resolutionChain = {};

    constructor(side) {
        this.sideConfiguration = side;
        this.biasConfiguration = R.times(e => 1, this.sides);
    }

    get sides() {
        if(R.is(Number, this.sideConfiguration)) return this.sideConfiguration;
        else if(R.is(Array, this.sideConfiguration)) {
            return this.sideConfiguration.length;
        }
    }

    set sides(val) {
        if(R.is(Number, val)) this.sideConfiguration = val;
        else if(R.is(Array, val)) this.sideConfiguration = val;
        else throw new Error("Unsupported side configurator.");
    }

    get biasMatrix() {
        return this.biasConfiguration;
    }

    set biasMatrix(val) {
        if(R.all(e => R.is(Number, e), val)) this.biasConfiguration = val;
        else {
            R.forEach(e => {
                if(e.side <= this.sides && e.side > 0) {
                    if(R.is(Number), e.bias) this.biasConfiguration[e.side-1] = e.bias;
                }
            }, val);
        }
    }

    get biasWeight() {
        let weight = this.biasMatrix.reduce((acc, val, ind) => {
            return acc + val;
        }, 0);

        let difference = this.sides - this.biasConfiguration.length;
        weight += difference;

        return weight;
    }

    single() {
        let r = Math.floor(Math.random() * this.biasWeight);
        let side = -1;
        for(let i = 0; i < this.biasMatrix.length; i++) {
            r -= this.biasMatrix[i];
            if(r < 0) {
                side = i;
                break;
            }
        }

        if(R.is(Number, this.sideConfiguration)) {  // numeric dice
            return side + 1; // pure numeric roll
        }
        else if(R.is(Array, this.sideConfiguration)) { // list definition
            return R.find(R.propEq('side', side+1))(this.sideConfiguration);
        }
    }
}

