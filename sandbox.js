import {
    DiceManager
} from '/entry.js'
import Dice from './lib/Dice';

let dm = new DiceManager();
let zombieNotation = {
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
        {label: "numeric"},
        {
            label: "boom",
            unwrap: true,
            config: [
                {
                    label: "bomb",
                    value: "@@@",
                    bias: 1
                },
                {
                    label: "safe",
                    value: "o",
                    bias: 5
                }
            ]
        }
    ]
};

dm.addNotation(zombieNotation);
dm.selectedNotation = 'zombie-dice';
dm.spawnDice("boom", 10);

for(let i = 0; i < 20; i++) {
    dm.reroll();
}