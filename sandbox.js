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
                    side: 1,
                    value: 'B',
                    label: 'brains',
                    bias: 3
                },
                {
                    side: 2,
                    value: 'S',
                    label: 'shotgun',
                    bias: 1
                },
                {
                    side: 3,
                    value: 'R',
                    label: 'runner',
                    bias: 2
                }
            ]
        },
        {
            label: 'yellow',
            unwrap: true,
            config: [{
                    side: 1,
                    value: 'B',
                    label: 'brains',
                    bias: 2
                },
                {
                    side: 2,
                    value: 'S',
                    label: 'shotgun',
                    bias: 2
                },
                {
                    side: 3,
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
                    side: 1,
                    value: 'B',
                    label: 'brains',
                    bias: 1
                },
                {
                    side: 2,
                    value: 'S',
                    label: 'shotgun',
                    bias: 3
                },
                {
                    side: 3,
                    value: 'R',
                    label: 'runner',
                    bias: 2
                }
            ]
        }
    ]
};

let d = new Dice(4);

console.log(d);

notations.selected = 'zombie-dice';
let bag = notations.spawnDice('green', 1);

for(let d1 of bag) {
    console.log(d1);
}