const readline = require('readline-sync');

const INITIAL_MARKER = ' ';
const HUMAN_MARKER = 'X';
const COMPUTER_MARKER = 'O';
const INITIAL_SCORE = 0;
const SCORE_NEEDED_TO_WIN = 3;
const INITIAL_ROUND = 1;
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

  if (round === INITIAL_ROUND && boardIsEmpty)  {
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

function playerChoosesSquare(board) {
  let square; // declared here so we can use it outside the loop

  while (true) {
    prompt(`Choose a square: ${joinOr(emptySquares(board), ',', 'or')}`);
    square = readline.question().trim(); // input trimmed to allow spaces in input

    if (emptySquares(board).includes(square)) break;

    prompt("Sorry, that's not a valid choice.");
  }

  board[square] = HUMAN_MARKER;
}

function computerChoosesSquare(board) {
  let possibleMoves = emptySquares(board);
  let randomIndex;
  
  if (detectIfWinImminent(board)) {
    // filter - possibleMoves.filter()
    // view which moves have already been made  //winninglines
    // check if there are any impending wins
    // if there is 1, play there
    // if there are more than 1, find out how many
    // based on that, choose random index for square
  } else {
    randomIndex = Math.floor(Math.random() * emptySquares(board).length);
  }
  
  let square = emptySquares(board)[randomIndex];
  
  board[square] = COMPUTER_MARKER;
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

function detectIfPlayerWinImminent(board) {
  let existingPlayerMoves = Object.entries(board)
                            .filter(element => element[1] === HUMAN_MARKER)
                            .map(element => element[0]);
  let unplayedMoves = emptySquares(board);
  
  for (let line = 0; line < WINNING_LINES.length; line++) {
    for (let moveOpt = 0; moveOpt < unplayedMoves.length; moveOpt++) {
      if //need to create copy of board obj and test by pushing uplayed move to it one by one. If detect round winner func returns winner, return true;
    }
  }
  return false;
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
}

function joinOr(array, punctuation, separator) {
  let elementsLeft = array.length;
  
  switch (elementsLeft) {
    case 1: return array[0];
    case 2: return array[0] + ' ' + separator + array[1];
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

while (true) {////////////////////////////////////// <<<<<<<<<<<<<< game start
  let score = initializeScore();
  let round = INITIAL_ROUND;

  while (!someoneWonGame(score)) {
    let board = initializeBoard();

    while (true) {
      displayBoard(board, round, score);//would be cool to write program where you could easily see your functions

      playerChoosesSquare(board);
      if (someoneWonRound(board) || boardFull(board)) break;

      computerChoosesSquare(board);
      if (someoneWonRound(board) || boardFull(board)) break;
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

  prompt('Play again? (y or n)');
  let answer = readline.question().toLowerCase()[0];
  if (answer !== 'y') break;
}

prompt('Thanks for playing Tic Tac Toe!');