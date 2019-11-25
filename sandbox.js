import {
    Notations
} from '/entry.js'
import Dice from './lib/Dice';

let notations = new Notations();
notations.notations = {
    name: 'zombie-dice',
    dice: [{
            label: 'green',
            unwrap: true,
            config: [{
                    value: 'B',
                    label: 'brains',
                    bias: 3
                },
                {
                    value: 'S',
                    label: 'shotgun',
                    bias: 1
                },
                {
                    value: 'R',
                    label: 'runner',
                    bias: 2
                }
            ]
        },
        {
            label: 'yellow',
            unwrap: false,
            config: [{
                    value: 'B',
                    label: 'brains',
                    bias: 2
                },
                {
                    value: 'S',
                    label: 'shotgun',
                    bias: 2
                },
                {
                    value: 'R',
                    label: 'runner',
                    bias: 2
                }
            ]
        },
        {
            label: 'red',
            unwrap: true,
            config: [{
                    value: 'B',
                    label: 'brains',
                    bias: 1
                },
                {
                    value: 'S',
                    label: 'shotgun',
                    bias: 3
                },
                {
                    value: 'R',
                    label: 'runner',
                    bias: 2
                }
            ]
        },
        {label: "numeric"}
    ]
};

notations.selected = 'zombie-dice';
let bag = notations.spawnDice('green', 1);

let rolls = 20;
for(let d1 of bag) {
    for(let i = 0; i < rolls; i++) {
        console.log(d1.single());
    }
}