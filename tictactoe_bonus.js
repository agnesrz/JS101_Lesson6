const readline = require('readline-sync');

const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const INITIAL_SCORE = 0;
const SCORE_NEEDED_TO_WIN = 3;
const PLAYER_WHO_STARTS = 'choose';
const PLAYER1 = 'player';
const PLAYER2 = 'computer';
const FIRST_ROUND = 1;
const BEST_SQUARE = '5';
const WINNING_LINES = [
  [1, 2, 3], [4, 5, 6], [7, 8, 9], // rows
  [1, 4, 7], [2, 5, 8], [3, 6, 9], // columns
  [1, 5, 9], [3, 5, 7]             // diagonals
];

function prompt(message) {
  console.log(`=> ${message}`);
}

function displayScoreInfo(boardObj, round) {// need to lookup why function can't access score variable in outer scope
  let boardIsEmpty = Object.values(boardObj)
                    .every(curVal => curVal === INITIAL_MARKER);

  if (round === FIRST_ROUND && boardIsEmpty)  {
    console.log(`The first player to win ${SCORE_NEEDED_TO_WIN} games wins!`);
  }
}

function displayBoard(board, round) {
  console.clear();
  displayScoreInfo(board, round);

  console.log('');
  prompt(`You are ${HUMAN_MARKER}. Computer is ${COMPUTER_MARKER}.`);

  console.log('');
  console.log('     |     |');
  console.log(`  ${board['1']}  |  ${board['2']}  |  ${board['3']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['4']}  |  ${board['5']}  |  ${board['6']}`);
  console.log('     |     |');
  console.log('-----+-----+-----');
  console.log('     |     |');
  console.log(`  ${board['7']}  |  ${board['8']}  |  ${board['9']}`);
  console.log('     |     |');
  console.log('');
}

function initializeBoard() {
  let board = {};

  for (let square = 1; square <= 9; square++) {
    board[String(square)] = INITIAL_MARKER;
  }

  return board;
}

function initializeScore() {
  return {player: INITIAL_SCORE, computer: INITIAL_SCORE};
}

function chooseSquare(board, round, score, currentPlayer) {
  let square;

  if (currentPlayer === 'player') {
    displayBoard(board, round, score);
    prompt(`Choose a square: ${joinOr(emptySquares(board), ',', 'or')}`);
    square = readline.question().trim();

    while (!emptySquares(board).includes(square)) {
      prompt("Sorry, that's not a valid choice.");
      square = readline.question().trim();
    }
    board[square] = HUMAN_MARKER;
  } else {
    let index;
    let moveOptions = smartMoves(board, COMPUTER_MARKER) ||
                      smartMoves(board, HUMAN_MARKER) ||
                      emptySquares(board);

    moveOptions.includes(BEST_SQUARE) ? index = moveOptions.indexOf(BEST_SQUARE) :
                                        index = Math.floor(Math.random() * moveOptions.length);
    square = moveOptions[index];
    board[square] = COMPUTER_MARKER;
  }
}

function emptySquares(board) {
  return Object.keys(board).filter(key => board[key] === INITIAL_MARKER);
}

function boardFull(board) {
  return emptySquares(board).length === 0;
}

function someoneWonRound(board) {
  return !!detectRoundWinner(board);
}

function someoneWonGame(scoreBoard) {
  return Object.values(scoreBoard).includes(SCORE_NEEDED_TO_WIN);
}

function smartMoves(board, marker) {
  let unplayedMoves = emptySquares(board);
  let smartMoves = [];

  for (let idx = 0; idx < unplayedMoves.length; idx += 1) {
    let testBoard = Object.assign({}, board);
    let move = unplayedMoves[idx];

    testBoard[move] = marker;

    if (someoneWonRound(testBoard)) {
      smartMoves.push(move);
    }
  }
  return smartMoves.length > 0 ? smartMoves : null;
}

function detectRoundWinner(board) {
  for (let line = 0; line < WINNING_LINES.length; line++) {
    let [sq1, sq2, sq3] = WINNING_LINES[line];

    if (
      board[sq1] === HUMAN_MARKER &&
      board[sq2] === HUMAN_MARKER &&
      board[sq3] === HUMAN_MARKER
    ) {
      return 'Player';
    } else if (
      board[sq1] === COMPUTER_MARKER &&
      board[sq2] === COMPUTER_MARKER &&
      board[sq3] === COMPUTER_MARKER
    ) {
      return 'Computer';
    }
  }

  return null;
}

function detectGameWinner(scoreBoard) {
  for (let key in scoreBoard) {
    if (scoreBoard[key] === SCORE_NEEDED_TO_WIN) {
      return key[0].toUpperCase() + key.slice(1);
    }
  }
  return undefined;
}

function joinOr(array, punctuation, separator) {
  let elementsLeft = array.length;

  switch (elementsLeft) {
    case 1: return array[0];
    case 2: return array[0] + ' ' + separator + ' ' + array[1];
    default: break;
  }

  let firstPart = array.slice(0, array.length - 1).join(punctuation + ' ');
  let lastPart = array[array.length - 1];

  return `${firstPart} ${separator} ${lastPart}`;
}

function displayScore(score) {
  console.log('');
  console.log('CURRENT SCORE');
  prompt(`Player: ${score.player}`);
  prompt(`Computer: ${score.computer}`);
  console.log('');
}

function determineFirstPlayer() {
  if (PLAYER_WHO_STARTS === 'choose') {
    prompt("Would you like to make the first move? Press 'Y' for 'Yes' and 'N' for 'No.'");
    let answer = readline.question().trim().toUpperCase();

    while (answer !== 'Y' && answer !== 'N') {
      prompt("That's not a valid answer. Please try again");
      answer = readline.question().trim().toUpperCase();
    }
    return answer === 'Y' ? 'player' : 'computer';
  } else {
    return PLAYER_WHO_STARTS;
  }
}

function alternatePlayer(currentPlayer) {
  return currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
}

while (true) {//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< game start
  let score = initializeScore();
  let round = FIRST_ROUND;
  let currentPlayer = determineFirstPlayer();

  while (!someoneWonGame(score)) {
    let board = initializeBoard();

    while (!someoneWonRound(board) && !boardFull(board)) {
      chooseSquare(board, round, score, currentPlayer);
      currentPlayer = alternatePlayer(currentPlayer);
    }

    displayBoard(board);

    if (someoneWonRound(board)) {
      let winner = detectRoundWinner(board);
      prompt(`${winner} won this round!`);
      winner === 'Player' ? score.player += 1 : score.computer += 1;
    } else {
      prompt("It's a tie!");
    }

    if (someoneWonGame(score)) {
      let winner = detectGameWinner(score);
      prompt(`${winner} has won the game!`);
      break;
    }

    round += 1;

    displayScore(score);

    prompt('Press any key to continue to the next round.');
    readline.question();
  }

  prompt('Play again? (Y or N)');
  let response = readline.question().trim().toUpperCase();

  while (response !== 'Y' && response !== 'N') {
    prompt("Sorry, that's not a valid choice");
    response = readline.question().trim().toUpperCase();
  }

  if (response === 'N') break;
}

prompt('Thanks for playing Tic Tac Toe!');