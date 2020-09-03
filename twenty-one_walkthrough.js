const readline = require('readline-sync');

function total(cards) {
  // cards = [['H', '3'], ['S', 'Q'], ... ]
  let values = cards.map(card => card[1]);

  let sum = 0;
  values.forEach(value => {
    if (value === "Ace") {
      sum += 11;
    } else if (['Jack', 'Queen', 'King'].includes(value)) {
      sum += 10;
    } else {
      sum += Number(value);
    }
  });

  // correct for Aces
  values.filter(value => value === "Ace").forEach(_ => {
    if (sum > 21) sum -= 10;
  });

  return sum;
}

function busted(hand) {
  if (total(hand) > 21) {
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

function displayCards(playerHand, dealerHand, numDealerCardsToDisplay = 'all') {
  let playerCards = playerHand.map(currVal => currVal[1]);
  let dealerCards = dealerHand.map(currVal => currVal[1]);

  if (numDealerCardsToDisplay === 'all') {
    console.log(`Dealer's cards: ${dealerCards.join(', ')}`);
  } else {
    let hiddenCards = dealerHand.filter((_, idx) => idx > 0)
                                .map(_ => '[Hidden]')
                                .join(', ');

    console.log(`Dealers cards: ${hiddenCards}, ${dealerCards[0]}`);
  }

  console.log(`Your cards:     ${playerCards.join(', ')}`);

}


function hitOrStay(hand) {
  if (total(hand) >= 17) return 'stay';

  return 'hit';
}

function declareWinner(playerCards, dealerCards) {
  if (busted(dealerCards) ||
      (total(playerCards) > total(dealerCards) && !busted(playerCards))) {
    console.log('Congratulations! You have won the game!\n');
  } else if (busted(playerCards) ||
             (total(playerCards) < total(dealerCards) &&
              !busted(dealerCards))) {
    console.log('The dealer has won the game!\n');
  } else {
    console.log("It's a tie!\n");
  }
}

function pressAnyKey() {
  console.log('\nPress any key to continue.');
  readline.question();
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< START OF GAME
let keepPlaying = true;

console.log('Welcome to 21!\n');

while (keepPlaying) {
  let deck = [
    ['D', 1], ['D', 2], ['D', 3], ['D', 4], ['D', 5], ['D', 6], ['D', 7], ['D', 8], ['D', 9], ['D', 10], ['D', 'Jack'], ['D', 'Queen'], ['D', 'King'], ['D', 'Ace'],
    ['H', 1], ['H', 2], ['H', 3], ['H', 4], ['H', 5], ['H', 6], ['H', 7], ['H', 8], ['H', 9], ['H', 10], ['H', 'Jack'], ['H', 'Queen'], ['H', 'King'], ['H', 'Ace'],
    ['S', 1], ['S', 2], ['S', 3], ['S', 4], ['S', 5], ['S', 6], ['S', 7], ['S', 8], ['S', 9], ['S', 10], ['S', 'Jack'], ['S', 'Queen'], ['S', 'King'], ['S', 'Ace'],
    ['C', 1], ['C', 2], ['C', 3], ['C', 4], ['C', 5], ['C', 6], ['C', 7], ['C', 8], ['C', 9], ['C', 10], ['C', 'Jack'], ['C', 'Queen'], ['C', 'King'], ['C', 'Ace'],
  ];

  let playerCards = [];
  let dealerCards = [];

  shuffle(deck);

  console.log('The deck is being shuffled. Press any key to be dealt your cards.\n');
  readline.question();

  dealCards(deck, dealerCards, 2);
  dealCards(deck, playerCards, 2);

  while (true) {
    console.clear();
    displayCards(playerCards, dealerCards, 1);

    console.log("\nHit or stay?\n");
    let answer = readline.question().toLowerCase();

    while (answer !== 'stay' && answer !== 'hit') {
      console.log("That's not a valid choice. Please try again.");
      answer = readline.question().toLowerCase();
    }

    if (answer === 'hit') dealCards(deck, playerCards, 1);
    if (answer === 'stay' || busted(playerCards)) break;
  }

  console.clear();

  if (busted(playerCards)) {
    console.log("You have busted!\n");
  } else {
    console.log("You chose to stay!");
  }

  pressAnyKey();

  while (true) {
    if (hitOrStay(dealerCards) === 'stay' ||
        busted(dealerCards) ||
        busted(playerCards)) {
      break;
    } else {
      console.clear();
      console.log("The dealer has chosen to hit.\n");
      dealCards(deck, dealerCards, 1);
      displayCards(playerCards, dealerCards, 1);

      pressAnyKey();
    }
  }

  if (busted(dealerCards)) {
    console.clear();
    console.log("The dealer has busted.\n");
  } else if (!busted(playerCards)) {
    console.clear();
    console.log("The dealer has chosen to stay.\n");
  }

  pressAnyKey();
  console.clear();
  declareWinner(playerCards, dealerCards);
  displayCards(playerCards, dealerCards);
  console.log();

  playAgain();
  console.clear();
}

console.log('Thanks for playing 21!');