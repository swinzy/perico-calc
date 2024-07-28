const SELECTED_C = "option-selected";
const OPTION_CONTENT_C = "option-content"
const HIDDEN_C = "invisible";

const MIN_PLAYERS = 1;
const MAX_PLAYERS = 4;
const MIN_LOOT = 0;
const MAX_GOLDS = 6;
const MAX_PAINTINGS = 5;
const MAX_COCAINE = 12;
const MAX_WEED = 12;
const MAX_CASH = 20;

// As of July 2024 (untested)
const VALUE = {
    "gold":     496456, // 330888
    "cocaine":  445500, // 222750
    "weed":     393661, // 147623
    "painting": 375900, // 187950
    "cash":     335800  //  83950
};

const STACK_WEIGHT = {
    "gold":     0.6665,
    "cocaine":  0.5,
    "weed":     0.375,
    "painting": 0.5,
    "cash":     0.25
};

window.onload = initializeComponent;
window.players = [];
window.optionWrapper;
window.selectedOption = 0;

function initializeComponent() {
    window.optionWrapper = document.getElementById("option-wrapper");
    window.players = [document.getElementById("player1"), document.getElementById("player2"), document.getElementById("player3"), document.getElementById("player4")];

    selectOption(window.selectedOption);

    document.addEventListener("keydown", function(e) {
        switch(e.key) {
            case "ArrowDown":
                selectOption(window.selectedOption + 1);
                e.preventDefault();
                break;
            case "ArrowUp":
                selectOption(window.selectedOption - 1);
                e.preventDefault();
                break;
            case "ArrowLeft":
                changeSelectedOptionContent(-1);
                applySettings();
                updatePlayers(compute());
                break;
            case "ArrowRight":
                changeSelectedOptionContent(1);
                applySettings();
                updatePlayers(compute());
                break;
        }
    });
}

function updatePlayers(players) {
    for (let i = 0; i < MAX_PLAYERS; i++) {
        if (i < players.length)
            window.players[i].classList.remove(HIDDEN_C);
        else
            window.players[i].classList.add(HIDDEN_C);
    }
}

// Either I do not know how to write js or js just sucks :(
function applySettings() {
    const numPlayersSpan = document.getElementById("num-players");
    const numGoldsSpan = document.getElementById("num-golds");
    const numPaintingsSpan = document.getElementById("num-paintings");
    const numCocaineSpan = document.getElementById("num-cocaine");
    const numWeedSpan = document.getElementById("num-weed");
    const numCashSpan = document.getElementById("num-cash");

    const normPlayers = normalize(parseInt(numPlayersSpan.innerHTML), MIN_PLAYERS, MAX_PLAYERS);
    Settings.numPlayers = normPlayers;
    numPlayersSpan.innerHTML = normPlayers;

    const normGolds = normalize(parseInt(numGoldsSpan.innerHTML), MIN_LOOT, MAX_GOLDS);
    Settings.golds = normGolds;
    numGoldsSpan.innerHTML = normGolds;

    const normPaintings = normalize(parseInt(numPaintingsSpan.innerHTML), MIN_LOOT, MAX_PAINTINGS);
    Settings.paintings = normPaintings;
    numPaintingsSpan.innerHTML = normPaintings;

    const normCocaine = normalize(parseInt(numCocaineSpan.innerHTML), MIN_LOOT, MAX_COCAINE);
    Settings.cocaine = normCocaine;
    numCocaineSpan.innerHTML = normCocaine;

    const normWeed = normalize(parseInt(numWeedSpan.innerHTML), MIN_LOOT, MAX_WEED);
    Settings.weed = normWeed;
    numWeedSpan.innerHTML = normWeed;

    const normCash = normalize(parseInt(numCashSpan.innerHTML), MIN_LOOT, MAX_CASH);
    Settings.cash = normCash;
    numCashSpan.innerHTML = normCash;
}

function normalize(value, min, max) {
    if (isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function changeSelectedOptionContent(byAmount) {
    let curr = parseInt(getSelectedOptionContent().innerHTML);
    //if (isNaN(curr)) curr = 1;
    getSelectedOptionContent().innerHTML = curr + byAmount;
}

function getSelectedOptionContent() {
    let option = window.optionWrapper.children[window.selectedOption];
    return option.getElementsByClassName(OPTION_CONTENT_C)[0];
}

function selectOption(index) {
    let len = window.optionWrapper.children.length;
    
    // Remove selected for all options
    for (let i = 0; i < len; i++) {
        window.optionWrapper.children[i].classList.remove(SELECTED_C);
    }

    // Keeping the index within 0 - (len-1)
    let modIndex = (len + index) % len;

    // Select index option
    window.optionWrapper.children[modIndex].classList.add(SELECTED_C);
    window.selectedOption = modIndex;
}

class Settings {
    static _numPlayers = 1;
    static _golds = 0;
    static _paintings = 0;
    static _cocaine = 0;
    static _weed = 0;
    static _cash = 0;

    static get numPlayers() { return Settings._numPlayers; };
    static get golds() { return Settings._golds; };
    static get paintings() { return Settings._paintings; };
    static get cocaine() { return Settings._cocaine; };
    static get weed() { return Settings._weed; };
    static get cash() { return Settings._cash; };

    static set numPlayers(value) {
        Settings._numPlayers = normalize(value, MIN_PLAYERS, MAX_PLAYERS);
    };

    static set golds(value) {
        Settings._golds = normalize(value, MIN_LOOT, MAX_GOLDS);
    }

    static set paintings(value) {
        Settings._paintings = normalize(value, MIN_LOOT, MAX_PAINTINGS);
    }

    static set cocaine(value) {
        Settings._cocaine = normalize(value, MIN_LOOT, MAX_COCAINE);
    }

    static set weed(value) {
        Settings._weed = normalize(value, MIN_LOOT, MAX_WEED);
    }

    static set cash(value) {
        Settings._cash = normalize(value, MIN_LOOT, MAX_CASH);
    }
}

class Player {
    static get MAX_CAPACITY() { return 1; };

    constructor() {
        this._items = [];
    }

    get capacity() {
        let weight = 0;
        this._items.forEach(item => {
            weight += item.weight;
        });
        return Player.MAX_CAPACITY - weight;
    }

    addItem(item) {
        if (item.weight > this.capacity) return false;
        this._items.push({name: item.name, weight: item.weight});
        return true;
    }
}

function compute() {
    // Load loot into an array
    let loot = [];
    for (let i = 0; i < Settings.cash; i++) {
        loot.push({
            name: "cash",
            weight: STACK_WEIGHT["cash"]
        });
    }

    for (let i = 0; i < Settings.paintings; i++) {
        loot.push({
            name: "painting",
            weight: STACK_WEIGHT["painting"]
        });
    }

    for (let i = 0; i < Settings.golds; i++) {
        loot.push({
            name: "gold",
            weight: STACK_WEIGHT["gold"]
        });
    }

    for (let i = 0; i < Settings.cocaine; i++) {
        loot.push({
            name: "cocaine",
            weight: STACK_WEIGHT["cocaine"]
        });
    }

    for (let i = 0; i < Settings.weed; i++) {
        loot.push({
            name: "weed",
            weight: STACK_WEIGHT["weed"]
        });
    }

    // Sort according to value (high -> low)
    loot.sort((a, b) => VALUE[b.name] - VALUE[a.name]);

    // Create players with empty bags
    let players = [];
    for (let i = 0; i < Settings.numPlayers; i++) {
        players.push(new Player());
    }

    // Use greedy approach to take loot (do not split paintings)
    players.forEach(player => {
        for (let i = 0; i < loot.length && player.capacity > 0; i++) {
            let item = loot[i];

            // Case 0: loot has depleted
            if (item.weight == 0) continue;

            // Case 1: does not fit
            if (item.name == "painting" && item.weight > player.capacity) {
                // Ignore item, move onto the next item
                continue;
            }

            // Case 2: partially fit
            if (item.weight > player.capacity) {
                item.weight -= player.capacity;
                let takenItem = { name: item.name, weight: player.capacity };
                player.addItem(takenItem);
                break; // Player full, no need to continue
            }

            // Case 3: partially fit
            player.addItem(item);
            item.weight = 0;
        }
    });

    return players;
}

function printPlayers(players) {
    let log = "";
    players.forEach(p => {
        log += p.capacity.toString() + " ";
    });
    console.log(log);
}



