const readline = require('readline-sync');
const messages = require('./tictactoe_messages.json');

function displayBoard(boardObj) {
  console.log('');
  console.log(boardObj.top.line1);
  console.log(boardObj.top.line2);
  console.log(boardObj.top.line3);
  console.log(boardObj.middle.line1);
  console.log(boardObj.middle.line2);
  console.log(boardObj.middle.line3);
  console.log(boardObj.bottom.line1);
  console.log(boardObj.bottom.line2);
  console.log(boardObj.bottom.line3 + '\n');
}

function displayMoveOptions(optionsObj) {
  for (let key in optionsObj) {
    console.log(optionsObj[key]);
  }
}

function prompt(message) {
  console.log(`=> ${message}`);
}

function invalidAnswer(choice, optionsObj) {
  return !Object.keys(optionsObj).includes(choice);
}

function updateBoard(playerIsGuest, move, boardObj) {
  let piece = playerIsGuest ? "X" : '0';
  let [key1, key2, index] = getBoardStringLocation(move);
  let stringToUpdate = boardObj[key1][key2];
  let updatedString = stringToUpdate.slice(0, index)
    + piece + stringToUpdate.slice(index + 1);

  boardObj[key1][key2] = updatedString;
}

function getBoardStringLocation(move) {
  switch (move) {
    case '1':
      return ['top', 'line2', 5];
    case '2':
      return ['top', 'line2', 9];
    case '3':
      return ['top', 'line2', 13];
    case '4':
      return ['middle', 'line2', 5];
    case '5':
      return ['middle', 'line2', 9];
    case '6':
      return ['middle', 'line2', 13];
    case '7':
      return ['bottom', 'line2', 5];
    case '8':
      return ['bottom', 'line2', 9];
    case '9':
      return ['bottom', 'line2', 13];
  }
  return undefined;
}

function getComputerMove(optionsObj) {
  let maxValue = Object.keys(optionsObj).length;
  let randomNum = Math.floor(Math.random() * maxValue);
  return Object.keys(optionsObj)[randomNum];
}

function weHaveAWinner(playedMoves) {
  let winningCombinations = ['123', '456', '789', '159',
                             '357', '147', '258', '369'];
  let winningComboExists = false;

  winningCombinations.forEach(element => {
    if (element.split('').every(digit => playedMoves.includes(digit))) {
      winningComboExists = true;
    }
  });

  return winningComboExists;
}

prompt(messages.welcome);
prompt(messages.continue);
readline.question();
console.clear();

while (true) {
  let board = {top: {line1: '       |   |  ', line2: '       |   |  ', line3: '     __|___|__'},
               middle: {line1: '       |   |  ', line2: '       |   |  ', line3: '     __|___|__'},
               bottom: {line1: '       |   |  ', line2: '       |   |  ', line3: '       |   |  '}};
  let moveOptions = {1: '1. Row 1, Column 1', 2: '2. Row 1, Column 2',
                     3: '3. Row 1, Column 3', 4: '4. Row 2, Column 1',
                     5: '5: Row 2, Column 2', 6: '6: Row 2, Column 3',
                     7: '7. Row 3, Column 1', 8: '8: Row 3, Column 2',
                     9: '9: Row 3, Column 3'};

  let guestMoves = [];
  let computerMoves = [];
  let currentPlayerGuest = true;
  let winner = false;

  while (Object.keys(moveOptions).length > 0) {
    let move;

    console.clear();
    displayBoard(board);

    if (currentPlayerGuest) {
      prompt(messages.yourTurn);
      prompt(messages.selectMove);

      displayMoveOptions(moveOptions);

      move = readline.prompt();
      while (invalidAnswer(move, moveOptions)) {
        prompt(messages.invalid);
        move = readline.prompt();
      }

      console.clear();
      guestMoves.push(move);
      winner = weHaveAWinner(guestMoves);

    } else {
      prompt(messages.compTurn);
      prompt(messages.continue);
      readline.question();
      console.clear();

      move = getComputerMove(moveOptions);
      computerMoves.push(move);

      winner = weHaveAWinner(computerMoves);
    }

    updateBoard(currentPlayerGuest, move, board);
    delete moveOptions[move];

    if (winner) {
      if (currentPlayerGuest) {
        displayBoard(board);
        prompt(messages.win);
        break;
      } else {
        displayBoard(board);
        prompt(messages.lose);
        break;
      }
    }

    if (Object.keys(moveOptions).length === 0) {
      displayBoard(board);
      prompt(messages.tie);
      break;
    }

    currentPlayerGuest = !currentPlayerGuest;
  }

  prompt(messages.playAgain);
  let answer = readline.question().toLowerCase('');

  while ((answer !== 'y') && (answer !== 'n')) {
    prompt(messages.invalid);
    answer = readline.question().toLowerCase('');
  }

  if (answer === 'n') break;
}