let dealerSum = 0;
let playerSum = 0;

let dealerAceCount = 0;
let playerAceCount = 0;

let hidden;
let deck;

let message = "";

let canHit = true;

window.onload = function () {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let suits = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + suits[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let cardImg = document.createElement("img"); // <img>
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-cards").append(cardImg);

    for (let i = 0; i < 2; i++) {
        playerDraw()
    }

    checkBB(true);

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("player-sum").innerText = playerSum;

}

function dealerDraw() {
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
}

function playerDraw() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    document.getElementById("player-cards").append(cardImg);

    let returnValue = reduceAce(playerSum, playerAceCount);
    playerSum = returnValue[0];
    playerAceCount = returnValue[1];

    document.getElementById("player-sum").innerText = playerSum;
}

function hit() {
    if (!canHit) {
        return;
    }
    playerDraw()

    checkBB(false);
}

function stand() {
    if (!canHit) {
        return;
    }
    dealerDraw();

    let returnValue = reduceAce(dealerSum, dealerAceCount);
    dealerSum = returnValue[0];
    dealerAceCount = returnValue[1];

    checkWin();
}

function checkBB(start) {
    if (playerSum > 21) {
        showMessage("Busted");
    }
    else if (start == true && playerSum == 21 && dealerSum < 21) {
        showMessage("Blackjack");
    }
    else if (playerSum == 21 && dealerSum <= 21) {
        checkWin();
    }
}

function checkWin() {
    if (dealerSum > 21) {
        showMessage("You Won");
    }
    else if (playerSum == dealerSum) {
        showMessage("Push");
    }
    else if (playerSum < dealerSum) {
        showMessage("You Lost");
    }
    else if (playerSum > dealerSum) {
        showMessage("You Won");
    }
}

function showMessage(msg) {
    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png"
    document.getElementById("outcome").innerText = msg;
    document.getElementById("dealer-sum").innerText = dealerSum;
}

function getValue(card) {
    let data = card.split("-"); // 4-C -> [4, C]
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(cardSum, cardAceCount) {
    while (cardSum > 21 && cardAceCount > 0) {
        cardSum -= 10;
        cardAceCount -= 1;
    }
    let returnArray = [];
    returnArray.push(cardSum)
    returnArray.push(cardAceCount)
    return returnArray;
}