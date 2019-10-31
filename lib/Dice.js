import R from 'ramda';
import {gcd, lcm, pow, multiply, sum} from 'mathjs'

export default class Dice {
    notation = '';
    diceToken = '';
    sideConfiguration = [];
    biasConfiguration = [];
    state = '';
    resolutionChain = {};

    //TODO validity testing
    //TODO rework numeric setup to be represented as object as well
    //TODO add side ID inferring, so obviously switch spec to 0-based indexes
    constructor(side) {
        this.sideConfiguration = side;
        if(R.is(Array, side)) {
            this.biasConfiguration = side.map(e => {
                return (e.bias) ? e.bias : 1;
            });
        }
        else this.biasConfiguration = R.times(e => 1, this.sides);
    }

    //TODO rewrite so you get a consistent representation
    get sides() {
        if(R.is(Number, this.sideConfiguration)) return this.sideConfiguration;
        else if(R.is(Array, this.sideConfiguration)) {
            return this.sideConfiguration.length;
        }
    }

    //TODO maybe call constructor here??
    set sides(val) {
        if(R.is(Number, val)) this.sideConfiguration = val;
        else if(R.is(Array, val)) this.sideConfiguration = val;
        else throw new Error("Unsupported side configurator.");
    }

    // sync this return value to sides() return value
    get biasedSides() {
        let filtered = this.biasMatrix.filter(e => !Number.isInteger(e));
        if(filtered.length > 0) {
            let decimals = filtered.map(e => e.toString().split('.')[1].length).reduce((prev, curr) => {
                return (prev > curr) ? prev : curr;
            });
    
            let p = pow(10, decimals); // get highest magnitude of 10 sufficient to convert all decimals to integers
            let remappedMatrix = filtered.map(e => multiply(e, p)); // reapply the 10^x back to the bias matrix
            let singleCoefficients = remappedMatrix.map(e => { // get the gcd for eacn number and simplify it towards 10^x
                let g = gcd(e, p);
                return p / g;
            });
            let l = (singleCoefficients.length > 1) ? lcm(...singleCoefficients) : singleCoefficients[0];
            let expandedMatrix = this.biasMatrix.map(e => multiply(e, l));
            return {
                amount: sum(expandedMatrix),
                configuration: expandedMatrix.reduce((obj, e, i) => {
                    obj[i+1] = e;
                    return obj;
                }, {})
            };
        }
        else return {
            amount: sum(this.biasMatrix),
                configuration: this.biasMatrix.reduce((obj, e, i) => {
                    obj[i+1] = e;
                    return obj;
                }, {})
        };
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