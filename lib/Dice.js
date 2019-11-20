import R from 'ramda';
import {gcd, lcm, pow, multiply, sum} from 'mathjs'

export default class Dice {
    notation = '';
    diceToken = '';
    sideConfiguration = [];
    biasConfiguration = [];
    state = '';
    resolutionChain = {};

    //FIXME validity testing
    //FIXME rework numeric setup to be represented as object as well
    //TODO add side ID inferring, so obviously switch spec to 0-based indexes
    constructor(dice) {
        if(!dice.config) throw new Error("Dice configuration required");
        else {
            console.log(dice);
        }
        // if(R.is(Object, dice)) {
        //     //TODO some structure checks in here
        //     if(dice.unwrap) {
        //         let i = 0;
        //         dice.config.forEach(e => {
        //             let flattenedBias = Math.round(e.bias); //CONSIDER proper unrwapping instead of round-up bias
        //             e.bias = 1;
        //             for(let j = 0; j < flattenedBias; j++) {
        //                 e.dice = i;
        //                 let localClone = Object.assign({} ,e);
        //                 this.sideConfiguration.push(localClone);
        //                 i++;
        //             }
        //         });
        //     } else {
        //         let i = 0;
        //         dice.config.forEach(e => {
        //             for(let j = 0; j < flattenedBias; j++) {
        //                 e.side = i;
        //                 let localClone = Object.assign({} ,e);
        //                 this.sideConfiguration.push(localClone);
        //                 i++;
        //             }
        //         });
        //     }
        // }
        // else {
        //     for(let i = 0; i < dice; i++) {
        //         this.sideConfiguration.push({
        //             dice: i,
        //             value: i+1,
        //             label: i+1
        //         })
        //     }
        //     this.biasMatrix = R.times(e => 1, dice);
        // }
    }

    //TODO rewrite so you get a consistent representation
    get sides() {
        if(R.is(Number, this.sideConfiguration)) return this.sideConfiguration;
        else if(R.is(Array, this.sideConfiguration)) {
            return this.sideConfiguration.length;
        }
    }

    //CONSIDER maybe call constructor here?? regardless make it return a fixed object.
    set sides(val) {
        if(R.is(Number, val)) this.sideConfiguration = val;
        else if(R.is(Array, val)) this.sideConfiguration = val;
        else throw new Error("Unsupported side configurator.");
    }

    get token() {
        return this.diceToken;
    }

    set token(val) {
        this.diceToken = val;
    }

    //TODO sync this return value to sides() return value
    // what this does is it forces a bias unwrap while maintaining existing bias ratios
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

    toString() {
        return `d${this.sides}`
    }
}