import R from 'ramda'
import {randomInt} from 'mathjs'
import Dice from './Dice'
import XRegExp from 'xregexp'

export default class Notations {
    baseNotations = [
        {
            id: 1,
            name: 'simple',
            dice: [{label: 'numeric', config: 6}],
            get modifiers() {
                return {}
            },
            get flags() {
                return {}
            }
        },
        {
            id: 2,
            name: 'standard',
            dice: [{label: 'numeric', config: 6}],
            get modifiers() {
                return [{
                        id: 1,
                        name: "reroll",
                        token: "r",
                        parameters: [{
                            value: /\d+/,
                            operators: /[<>]?=?/,
                            evaluation: function (compareRules, dice) {
                                for (let i in dice.modifiedRolls) {
                                    while (math.evaluate(`${dice.modifiedRolls[i]}${compareRules}`)) {
                                        dice.modifiedRolls[i] = dice.single();
                                    }
                                }
                                return dice;
                            }
                        }]
                    },
                    {
                        id: 2,
                        name: "explode",
                        token: "!",
                        parameters: [{
                            value: /\d+/,
                            operators: /[<>]?=?/,
                            evaluation: function (compareRules, dice) {
                                for (let i = 0; i < dice.modifiedRolls.length; i++) {
                                    if (math.evaluate(`${dice.modifiedRolls[i]}${compareRules}`)) {
                                        let v = dice.single();
                                        if (i === dice.modifiedRolls.length) dice.modifiedRolls.push(v);
                                        else dice.modifiedRolls.splice(i + 1, 0, v);
                                    }
                                }
                                return dice;
                            }
                        }]
                    },
                    {
                        id: 3,
                        exclusiveWith: [2],
                        name: "compound",
                        token: "!!",
                        parameters: [{
                            value: /\d+/,
                            operators: /[<>]?=?/,
                            evaluation: function (compareRules, dice) {
                                for (let i = 0; i < dice.modifiedRolls.length; i++) {
                                    if (math.evaluate(`${dice.modifiedRolls[i]}${compareRules}`)) {
                                        let v = dice.single();
                                        do {
                                            dice.modifiedRolls[i] += v;
                                            v = dice.single();
                                        }
                                        while (math.evaluate(`${v}${compareRules}`))
                                    }
                                }
                                return dice;
                            }
                        }]
                    }
                ]
            },
            get flags() {
                return [{
                        id: 1,
                        name: "keep",
                        token: "k",
                        parameters: [{
                                value: [/\d+/, /H\d+/],
                                evaluation: function (compareRules, dice) {
                                    let mathExpr = math.evaluate(compareRules);
                                    if (typeof mathExpr === 'number') {
                                        let sorted = _.sortBy(dice.modifiedRolls, e => e).reverse();
                                        dice.results = sorted.slice(0, mathExpr);
                                    }
        
                                    return dice;
                                }
                            },
                            {
                                value: [/L\d+/],
                                evaluation: function (compareRules, dice) {
                                    let mathExpr = math.evaluate(compareRules);
                                    if (typeof mathExpr === 'number') {
                                        let sorted = _.sortBy(dice.modifiedRolls, (e) => e);
                                        dice.results = sorted.slice(0, mathExpr);
                                    }
        
                                    return dice;
                                }
                            }
                        ]
                    },
                    {
                        id: 2,
                        name: "drop",
                        token: "d",
                        parameters: [{
                            value: [/\d+/, /L\d+/],
                            evaluation: function (compareRules, dice) {
                                let mathExpr = math.evaluate(compareRules);
                                if (typeof mathExpr === 'number') {
                                    let sorted = _.sortBy(dice.results, (e) => e);
                                    dice.results = sorted.slice(mathExpr);
                                }
        
                                return dice;
                            }
                        },
                        {
                            value: [/H\d+/],
                            evaluation: function (compareRules, dice) {
                                let mathExpr = math.evaluate(compareRules);
                                if (typeof mathExpr === 'number') {
                                    let sorted = _.sortBy(dice.results, (e) => e).reverse();
                                    dice.results = sorted.slice(mathExpr);
                                }
        
                                return dice;
                            }
                        }
                    ]
                    }
                ]
            }
        }
    ];

    sel = this.baseNotations[0];

    n = [...this.baseNotations];
    constructor(notation) {
        this.sel = R.find(R.propEq('id', notation))(this.notations) || R.find(R.propEq('name', notation))(this.notations) || this.baseNotations[0];
    }

    get selected() {
        return this.sel;
    }

    set selected(val) {
        this.sel = R.find(R.propEq('id', val))(this.notations) || R.find(R.propEq('name', val))(this.notations) || this.baseNotations[0];
    }

    get notations() {
        return this.n;
    }

    //TODO maybe reconsider this?
    set notations(val) {
        if(R.is(Array, val)) this.notations = [...this.notations, ...val]
        else if(R.is(Object, val)) this.notations.push(val);
        else throw new Error("Unsupported notation");
    }

    get dicePatterns() {
        let p = this.selected.dice.map(e => {
            if(e==='numeric') return /^([^0\D]\d*)?d([^0\D]\d*)/;
            else return e.notation;
        })
    }

    get modifiers() {
        return this.selected.modifiers;
    }

    get flags() {
        return this.selected.flags;
    }

    spawnDice(string, amount) {
        let diceList = this.selected.dice;
        let a = (amount) ? (R.is(Number, amount)) ? amount : 1 : 1;
        if(string && string.length > 0) {
            let found = R.find(R.or(R.propEq('label', string), R.propEq('token', string)))(diceList);
            
            if(string==='numeric') {
                return R.times(() => new Dice(diceList[0].config), a);
            }
            else if(found) {
                return R.times(() => new Dice(found.config), a);
            }
            
        }
        else {
            return R.times(() => new Dice(diceList[randomInt(0, diceList.length)].config), a);
        }
    }
}