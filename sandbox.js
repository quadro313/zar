import {Dice, Notations} from '/entry.js'

let d = new Dice([
    {side: 1, value: "cherry", label: "fruit"},
    {side: 2, value: "banana"},
    {side: 3, value: "grape"},
    {side: 4, value: "kiwi"},
    {side: 5, value: "apple"},
    {side: 6, value: "peach"},
    {side: 7, value: "pineapple"},
    {side: 8, value: "strawberry"}
]);


console.log(`${d.sides} total sides, ${d.biasWeight} weight`)
console.log(d.biasMatrix);
console.log(d.single());

