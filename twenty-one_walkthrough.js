const readline = require('readline-sync'); 

function total(cards) {
  // cards = [['H', '3'], ['S', 'Q'], ... ]
  let values = cards.map(card => card[1]);

  let sum = 0;
  values.forEach(value => {
    if (value === "A") {
      sum += 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  // correct for Aces
  values.filter(value => value === "A").forEach(_ => {
    if (sum > 21) sum -= 10;
  });

  return sum;
}

function busted(currentPlayerScore) {
  if (currentPlayerScore > 21) {
    return true;
  }
  return false;
}

function shuffle(array) {
  for (let index = array.length - 1; index > 0; index--) {
    let otherIndex = Math.floor(Math.random() * (index + 1)); // 0 to index
    [array[index], array[otherIndex]] = [array[otherIndex], array[index]]; // swap elements
  }
}

function playAgain() {
  console.log("Play again? Type 'Y' or 'N'.");
  
  let answer = readline.question().toUpperCase();
  while (answer !== "N" && answer !== "Y") {
    console.log("That's not a valid choice. Try again.");
    answer = readline.question().toUpperCase();
  }
  
  if (answer === 'N') keepPlaying = false;
}

function dealCards(deck, hand, amount) {
  
  for (let iter = 0; iter < amount; iter += 1) {
    let randomIndex = Math.floor(Math.random() * Math.floor(deck.length));
    hand.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
  }
}

function displayCards(hand) {
  
  return hand.map((_, index) => hand[index][1]).join(', ');
  
}


function hitOrStay(hand) {
  
}

function declareWinner(deck1, deck2) {
  
}

let keepPlaying = true;

while (keepPlaying) {
  
  let deck = [
              ['D', 1], ['D', 2], ['D', 3], ['D', 4], ['D', 5], ['D', 6], ['D', 7], ['D', 8], ['D', 9], ['D', 10], ['D', 'J'], ['D', 'Q'], ['D', 'K'], ['D', 'A'],
              ['H', 1], ['H', 2], ['H', 3], ['H', 4], ['H', 5], ['H', 6], ['H', 7], ['H', 8], ['H', 9], ['H', 10], ['H', 'J'], ['H', 'Q'], ['H', 'K'], ['H', 'A'],
              ['S', 1], ['S', 2], ['S', 3], ['S', 4], ['S', 5], ['S', 6], ['S', 7], ['S', 8], ['S', 9], ['S', 10], ['S', 'J'], ['S', 'Q'], ['S', 'K'], ['S', 'A'],
              ['C', 1], ['C', 2], ['C', 3], ['C', 4], ['C', 5], ['C', 6], ['C', 7], ['C', 8], ['C', 9], ['C', 10], ['C', 'J'], ['C', 'Q'], ['C', 'K'], ['C', 'A'],
             ];
  
  let playerCards = [];
  let dealerCards = [];
  
  shuffle(deck);
  
  playerCards = [];
  dealerCards = [];
  
  dealCards(deck, dealerCards, 2);
  dealCards(deck, playerCards, 2);
  
  console.log(`Dealer Card: ${displayCards(dealerCards[0])}`);
  console.log(`Your Cards: ${displayCards(playerCards)}`);
  
  while (true) {
    console.log("hit or stay?");
    let answer = readline.question().toLowerCase();
    
    while(answer !== 'stay' && answer !== 'hit') {
      answer = readline.question().toLowerCase();
    }
    
    if (answer === 'stay' || busted()) break;
    
    dealCards(deck, 1);
    displayCards(playerCards);
  }
  
  if (busted()) {
    console.log("You lose.");
    playAgain();
  } else {
    console.log("You chose to stay!");
  }
  
  while (true) {
    let move = hitOrStay(dealerCards);
    
    if (move === 'hit') {
      console.log("The dealer has chosen to hit");
    } else {
      break;
    }
  }
  
  if (busted()) {
    console.log("The dealer has busted. You win!");
  } else {
    console.log("The dealer has chosen to stay.");
    declareWinner(playerCards, dealerCards);
  }
  
  playAgain();
}

console.log('Thanks for playing 21!')