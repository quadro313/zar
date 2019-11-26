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
    constructor(dice) {
        if(!dice.config) throw new Error("Side configuration required");
        else {
            if(R.is(Number, dice.config)) {
                for(let i = 0; i < dice.config; i++) {
                    this.sideConfiguration.push({
                        side: i+1,
                        value: i+1
                    });
                }
                this.biasMatrix = R.times(e => 1, dice.config)
            }
            else if(R.is(Array, dice.config)) {
                let side = 0;
                dice.config.forEach((e, index) => {
                    if(dice.unwrap) {
                        let flattenedBias = Math.round(e.bias) || 1;
                        for(let i = 0; i < flattenedBias; i++) {
                            this.sideConfiguration.push({
                                side: (side++)+1,
                                value: e.value,
                                label: e.label,
                                bias: 1
                            });
                            this.biasMatrix.push(1);
                        }
                    }
                    else {
                        e.side = (side++)+1;
                        let localClone = Object.assign({}, e);
                        this.sideConfiguration.push(localClone);
                        this.biasMatrix.push(e.bias);
                    }
                });
            }
            else throw new Error("Unrecognized configuration parameter.");
        }
        this.state = this.single();
    }

    //TODO rewrite so you get a consistent representation
    get sides() {
        return this.sideConfiguration;
    }

    //CONSIDER maybe call constructor here?? regardless make it return a fixed object.
    set sides(val) {
        constructor(val);
    }

    get token() {
        return this.diceToken;
    }

    set token(val) {
        this.diceToken = val;
    }

    //TODO sync this return value to sides() return value
    //FIXME currently returns dud 1 value for every unwrapped side, doesn't properly map unwrapped values
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

    //TODO rework a bit, so it accepts {side: x, bias: y} format.
    //FIXME argument validity testing.
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

        let difference = this.sides.length - this.biasConfiguration.length;
        weight += difference;

        return weight;
    }

    single() {
        let r = Math.floor(Math.random() * this.biasWeight);
        let side = -1;
        let roll;
        for(let i = 0; i < this.biasMatrix.length; i++) {
            r -= this.biasMatrix[i];
            if(r < 0) {
                side = i;
                break;
            }
        }

        if(R.is(Number, this.sideConfiguration)) {  // numeric dice
            roll = side + 1;
            this.state = roll;
            return roll; // pure numeric roll
        }
        else if(R.is(Array, this.sideConfiguration)) { // list definition
            roll = R.find(R.propEq('side', side+1))(this.sideConfiguration);
            this.state = roll;
            return roll;
        }
    }

    toString() {
        return `d${this.sides}`;
    }
}