import Dice from './Dice'
import Notations from './Notations'
import R from 'ramda'

export default class DiceManager {
    n = new Notations();
    dice = [];

    constructor(notation) {
        this.n = new Notations(notation);
    }

    availableNotations(outputMode) {
        switch(outputMode) {
            default: return [];
            case "names": return this.n.notations.map(e => e.name); break;
            case "dice": return this.n.notations.map(e => ({id: e.id, name: e.name, dice: e.dice})); break
            case "full": return this.n.notations;
        }
    }

    get selectedNotation() { return this.n.selected; }

    set selectedNotation(newNotation) {
        this.n.selected = newNotation;
        this.dice = [];
    }

    get dice() { return this.dice; }
    get sides() { return this.dice.map(e => e.state); }
    get values() { return this.dice.map(e => e.state.value); }

    addNotation(notation) {
        this.n.notations = notation;
    }

    applyModifiers(modifierString) {

    }

    applyFlags(flagString) {

    }

    spawnDice(string, amount) {
        let diceList = this.selectedNotation.dice;
        let amt = (amount) ? (R.is(Number, amount)) ? amount : 1 : 1;
        if(string && string.length > 0) {
            let found = R.find(R.or(R.propEq('label', string), R.propEq('token', string)))(diceList);
            let numericPattern = /^(numeric|d)-?(\d+)?/;
            
            if(numericPattern.test(string) && diceList.find(e => numericPattern.test(e.label))) {
                let sides = string.match(numericPattern)[2] || 6; //INFO default side parameter for numeric dice. if side is unspecified it will default to the OR'd value here
                let diceConfig = {label: string.match(numericPattern)[0], config: +sides};
                R.times(() => new Dice(diceConfig), amt).forEach(e => {this.dice.push(e)});
            }
            else if(found) {
                R.times(() => new Dice(found), amt).forEach(e => {this.dice.push(e)});
            }
            else throw new Error("Selected notation contains no such labeled dice.");
            
        }
        else {
           R.times(() => new Dice(diceList[randomInt(0, diceList.length)]), amt).forEach(e => {this.dice.push(e)});
        }
    }

    reroll(which) {
        if(which) {
            this.dice[which].single();
        }
        else this.dice.forEach(e => {e.single()});
    }
}