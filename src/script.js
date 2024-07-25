const VALUE = 0
const WEIGHT = 1
const VWRATIO = 2

// Set value and weight for loot
const LOOT = new Map();
//LOOT.set("gold", { 330888, 0.6665 }); // 496456
//LOOT.set("cocaine", { 222750, 0.5 }); // 445500
//LOOT.set("weed", { 147623, 0.375 });  // 393661
//LOOT.set("painting", { 187950, 0.5 });// 375900
//LOOT.set("cash", { 83950, 0.25 });    // 335800

// Calculate vwratio
for (const [key, val] of LOOT.entries()) {
    let value = val[VALUE];
    let weight = val[WEIGHT];
    let vwratio = value / weight;
    LOOT.set(key, { value, weight, vwratio });
}

let players = 3;
let gold = 2;
let cash = 3;
let painting = 1;

let loot = [];

for (let i = 0; i < painting; i++) {
    loot.push({
        name: "painting",
        value: 187950,
        weight: 0.5
    })
}
for (let i = 0; i < gold; i++) {
    loot.push({
        name: "gold",
        value: 330888,
        weight: 0.6665
    })
}
for (let i = 0; i < cash; i++) {
    loot.push({
        name: "cash",
        value: 83950,
        weight: 0.25
    })
}

console.log(loot);

loot.sort((a, b) => b.value / b.weight - a.value / b.weight);

console.log(loot);

let p1 = [];
let p2 = [];
let p3 = [];

let p1c = 0;
let p2c = 0;
let p3c = 0;

console.log(p1, p2, p3);
console.log(p1c, p2c, p3c);

loot.forEach(item => {
    if (item.weight > 0) {
        if (p1c < 1) {
            let weightTaking = Math.min(item.weight, 1 - p1c);
            item.weight -= weightTaking;
            p1c += weightTaking;
            p1.push({
                name: item.name,
                value: 0,
                weight: weightTaking
            });
        }
    }
});

console.log(p1, p2, p3);
console.log(p1c, p2c, p3c);
