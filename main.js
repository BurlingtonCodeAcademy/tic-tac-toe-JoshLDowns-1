let winningArrays = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
let player = 'x';
let playerXName = 'X';
let playerOName = 'O';
let currentPlayer = playerXName;
let onePlayer = false;
let twoPlayer = false;
let state;
let turnCount = 0;
let gameTimer;

let board = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };

let cells = Array.from(document.getElementsByClassName('cell'));

let textUpdate = document.getElementById('title-text');
let onePlayerStart = document.getElementById('one-player');
let twoPlayerStart = document.getElementById('two-player');
let minutes = document.getElementById('minutes');
let seconds = document.getElementById('seconds');
let menu = document.getElementById('menu');
let onePlayerNameInput = document.getElementById('one-player-name-input');
let twoPlayerNameInput = document.getElementById('two-player-name-input');
let gameBoard = document.getElementById('board');
let status = document.getElementById('status');
let playerOneName = document.getElementById('onePName');
let playerOneNameTwo = document.getElementById('onePNameTwo');
let playerTwoName = document.getElementById('twoPName');
let start = document.getElementById('start');
let playerXDisplay = document.getElementById('playerX');
let playerODisplay = document.getElementById('playerO');


onePlayerStart.addEventListener('click', () => {
    onePlayerStart.disabled = true;
    twoPlayerStart.disabled = true;
    onePlayer = true;
    onePlayerNameInput.style.display = 'flex';
    onePlayerNameInput.className = 'fade';
    start.disabled = false;
})

twoPlayerStart.addEventListener('click', () => {
    onePlayerStart.disabled = true;
    twoPlayerStart.disabled = true;
    twoPlayer = true;
    twoPlayerNameInput.style.display = 'flex';
    twoPlayerNameInput.className = 'fade';
    start.disabled = false;
})

start.addEventListener('click', () => {
    seconds.textContent = '00';
    minutes.textContent = '00';
    gameTimer = setInterval(gameClock, 1000);
    turnCount = 0;
    console.log(playerOneName.value);
    if (onePlayer === true && playerOneName !== 'X') {
        playerXName = playerOneName.value;
    }
    if (twoPlayer === true && playerOneNameTwo !== 'X') {
        playerXName = playerOneNameTwo.value;
    }
    if (twoPlayer === true && playerTwoName !== 'O') {
        playerOName = playerTwoName.value;
    }
    if (onePlayer === true) {
        onePlayerNameInput.className = 'fadeOut';
        onePlayerNameInput.style.display = 'none';
        menu.className = 'fadeOut';
        menu.style.display = 'none'
        if (playerXName !== 'X') {
            playerXDisplay.textContent = playerXName;
        }
        playerODisplay.textContent = 'Computer';
        gameBoard.style.display = 'grid'
        gameBoard.className = 'fade'
        status.style.display = 'flex'
        status.className = 'fade'
        player = 'x'
        textUpdate.textContent = `It's ${playerXName}'s turn!`
        cells.forEach((cell) => {
            cell.addEventListener('click', clicked)
            cell.textContent = '';
            cell.style.backgroundColor = '#f0f0f0';
        })
    } else {
        twoPlayerNameInput.className = 'fadeOut';
        twoPlayerNameInput.style.display = 'none';
        menu.className = 'fadeOut';
        menu.style.display = 'none'
        if (playerXName !== 'X') {
            playerXDisplay.textContent = playerXName;
        }
        if (playerOName !== 'O') {
            playerODisplay.textContent = playerOName;
        }
        gameBoard.style.display = 'grid'
        gameBoard.className = 'fade'
        status.style.display = 'flex'
        status.className = 'fade'
        player = 'x'
        textUpdate.textContent = `It's ${playerXName}'s turn!`
        cells.forEach((cell) => {
            cell.addEventListener('click', clicked)
            cell.textContent = '';
            cell.style.backgroundColor = '#f0f0f0';
        })
    }
})

function clicked() {
    turnCount += 1;
    console.log(turnCount);
    event.target.textContent = player.toUpperCase();
    board[event.target.id] = player;
    state = buildBoardState(board);
    let win = checkWin(state, player);
    if (win === true) {
        textUpdate.textContent = `${player === 'x' ? playerXName : playerOName} WINS!!!`
        return reset();
    } else {
        if (turnCount === 9) {
            textUpdate.textContent = `It's a draw!`
            return reset();
        }
        player = player === 'x' ? 'o' : 'x';
        if (twoPlayer === true) {
            return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
        } else if (onePlayer === true) {
            textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
            state = buildBoardState(board);
            let bestMove = makeMove(state, player)
            cells[bestMove].textContent = player.toUpperCase();
            board[bestMove.toString()] = player;
            state = buildBoardState(board);
            let aiWin = checkWin(state, player);
            if (aiWin === true) {
                textUpdate.textContent = `${player === 'x' ? playerXName : playerOName} WINS!!!`
                return reset();
            } else {
                turnCount += 1;
                player = player === 'x' ? 'o' : 'x';
                return textUpdate.textContent = `It's ${player === 'x' ? playerXName : playerOName}'s turn!`
            }
        }
    }
}

function checkWin(boardState, currentPlayer) {
    let player = currentPlayer === 'x' ? 'playerX' : 'playerO';
    for (let win of winningArrays) {
        let winCount = 0;
        for (let coordinate of win) {
            if (boardState[player].includes(coordinate)) {
                winCount += 1;
            }
        }
        if (winCount >= 3) {
            for (let coordinate of win) {
                cells[coordinate].style.backgroundColor = 'darkgray'
            }
            return true;
        }
    }
    return false;
}

function pad(number) {
    if ((number + '').length === 2) {
        return number + '';
    } else {
        return '0' + number;
    }
}

function gameClock() {
    let second = parseInt(seconds.textContent);
    let minute = parseInt(minutes.textContent);
    second += 1;
    if (second === 60) {
        second = 0;
        seconds.textContent = '00';
        minutes.textContent = pad(minute + 1);
    } else {
        seconds.textContent = pad(second);
    }
}

function stopClock() {
    clearInterval(gameTimer);
}

function buildBoardState(currentBoard) {
    let boardObj = { board: [], playerX: [], playerO: [] };
    let count = 0;
    for (let space in currentBoard) {
        if (currentBoard[space] === 'x') {
            boardObj.playerX.push(count);
        } else if (currentBoard[space] === 'o') {
            boardObj.playerO.push(count);
        } else {
            boardObj.board.push(count);
        }
        count += 1;
    }
    return boardObj;
}

function reset() {
    onePlayerStart.disabled = false;
    twoPlayerStart.disabled = false;
    board = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
    return stopClock();
}