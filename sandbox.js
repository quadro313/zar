import {Dice} from '/entry.js'

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
d.biasMatrix = [{side: 1, bias: 0.5}, {side: 6, bias: 21}, {side: 20, bias: 0}, {side: -5, bias: 10}, {side: 0, bias: "x"}]

console.log(`${d.sides} total sides, ${d.biasWeight} weight`)
console.log(d.biasMatrix);
console.log(d.single());