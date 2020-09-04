//// note to self - SOME BUGS I NEED TO FIX; sometimes there is a premature 'you've busted' other times it skips asking me to stay to go to dealer's turn

const readline = require('readline-sync');
const fullDeck = {diamonds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'],
                  hearts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'],
                  spades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace'],
                  clubs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King', 'Ace']};


function initializeDeck(fullDeck) {
  let deck = [];
  for (let key in fullDeck) {
    for (let index = 0; index < fullDeck[key].length; index += 1) {
      deck.push([key[0], fullDeck[key][index]]);
    }
  }

  return deck;
}

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
    if (sum > GAME) sum -= 10;
  });

  return sum;
}

function busted(score) {
  if (score > GAME) {
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

function displayCards(playerHand, playerScore, dealerHand, dealerScore, numDealerCardsToDisplay = 'all') {
  let playerCards = playerHand.map(currVal => currVal[1]);
  let dealerCards = dealerHand.map(currVal => currVal[1]);

  if (numDealerCardsToDisplay === 'all') {
    console.log(`Dealer's cards: ${dealerCards.join(', ')} (total score of ${dealerScore})`);
  } else {
    let hiddenCards = dealerHand.filter((_, idx) => idx > 0)
                                .map(_ => '[Hidden]')
                                .join(', ');

    console.log(`Dealers cards:  ${dealerCards[0]}, ${hiddenCards}`);
  }

  console.log(`Your cards:     ${playerCards.join(', ')} (total score of ${playerScore})`);

}

function hitOrStay(score) {
  if (score >= 17) return 'stay';

  return 'hit';
}

function winner(playerScore, dealerScore, gameLevel) {// game level refers to whether the score is for the 'round' or the entire 'game'
  if (gameLevel === 'game' && WINNING_POINTS > 1) {
    return playerScore > dealerScore ? 'player' : 'dealer';
  } else if (busted(dealerScore) || (playerScore > dealerScore && !busted(playerScore))) {
    return 'player';
  } else if (busted(playerScore) || (playerScore < dealerScore && !busted(dealerScore))) {
    return 'dealer';
  } else {
    return 'tie';
  }
}

function declareWinner(playerScore, dealerScore, gameLevel) {// game level refers to whether the score is for the 'round' or the entire 'game'
  switch (winner(playerScore, dealerScore, gameLevel)) {
    case 'player': console.log(`Congratulations! You have won the ${gameLevel}!\n`);
      break;
    case 'dealer': console.log(`The dealer has won the ${gameLevel}!\n`);
      break;
    default: console.log("It's a tie!\n");
  }
}

function pressAnyKey() {
  console.log('\nPress any key to continue.');
  readline.question();
  console.clear();
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< START OF GAME
const WINNING_POINTS = 2;
const GAME = 21;
let keepPlaying = true;
let playerTotalScore = 0;
let dealerTotalScore = 0;
let playerBusted = false; 
let dealerBusted = false;
let gameLevel = WINNING_POINTS > 1 ? 'round' : 'game';

console.log(`Welcome to ${GAME}!\n`);

while (keepPlaying) {
  let currentRound = 0;
  
  while (true) {
    currentRound += 1;
    let deck = initializeDeck(fullDeck);
    let playerCards = [];
    let dealerCards = [];
 
    if (WINNING_POINTS > 1) {
      currentRound > 1 ? console.log(`CURRENT SCORE\nYou: ${playerTotalScore}\nDealer: ${dealerTotalScore}`) :
                         console.log(`The first player to win ${WINNING_POINTS} rounds wins.`);
      pressAnyKey();
    }

    shuffle(deck);
  
    console.log('The deck is being shuffled. Press any key to be dealt your cards.\n');
    readline.question();
  
    dealCards(deck, dealerCards, 2);
    dealCards(deck, playerCards, 2);
  
    let playerScore = total(playerCards);
    let dealerScore = total(dealerCards);
  
    while (true) {
      console.clear();
      displayCards(playerCards, playerScore, dealerCards, dealerScore, 1);
  
      console.log("\nHit or stay?\n");
      let answer = readline.question().toLowerCase();
  
      while (answer !== 'stay' && answer !== 'hit') {
        console.log("That's not a valid choice. Please try again.");
        answer = readline.question().toLowerCase();
      }
  
      if (answer === 'hit') {
        dealCards(deck, playerCards, 1);
        playerScore = total(playerCards);
      }
      
      if (busted(playerScore)) playerBusted = true;
      
      if (answer === 'stay' || playerBusted) break;
    }
  
    console.clear();
  
    if (playerBusted) {
      console.log("You have busted!");
    } else {
      console.log("You chose to stay!");
    }
  
    while (true) {
      if (busted(dealerScore)) dealerBusted = true;
      
      if (playerBusted || dealerBusted || hitOrStay(dealerScore) === 'stay') {
        break;
      } else {
        pressAnyKey();
        console.log("The dealer has chosen to hit.\n");
        dealCards(deck, dealerCards, 1);
        dealerScore = total(dealerCards);
        displayCards(playerCards, playerScore, dealerCards, dealerScore, 1);
      }
    }
  
    if (dealerBusted) {
      console.clear();
      console.log("The dealer has busted.");
    } else if (!playerBusted) {
      console.clear();
      console.log("The dealer has chosen to stay.");
    }
  
    pressAnyKey();
    declareWinner(playerScore, dealerScore, gameLevel);
    displayCards(playerCards, playerScore, dealerCards, dealerScore);
    
    if (WINNING_POINTS > 1) {
      switch (winner(playerScore, dealerScore)) {
        case 'player': playerTotalScore += 1;
          break;
        case 'dealer': dealerTotalScore += 1;
      }
      pressAnyKey();      
      
      if (playerTotalScore === WINNING_POINTS || dealerTotalScore === WINNING_POINTS) {
        declareWinner(playerTotalScore, dealerTotalScore, 'game');
        break;
      }      
    } else {
      console.log();
      break;
    }

  }
  playAgain();
  console.clear();
}

console.log(`Thanks for playing ${GAME}!\n`);