//----- variable declarations and html element targeting -----//

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
let playAgain = document.getElementById('playAgain');

//----------- Event Listeners ----------//

//event listner for one player button
onePlayerStart.addEventListener('click', () => {
    onePlayerStart.disabled = true;
    twoPlayerStart.disabled = true;
    onePlayer = true;
    onePlayerNameInput.style.display = 'flex';
    onePlayerNameInput.className = 'fade';
    start.disabled = false;
})
//event listener for two player button
twoPlayerStart.addEventListener('click', () => {
    onePlayerStart.disabled = true;
    twoPlayerStart.disabled = true;
    twoPlayer = true;
    twoPlayerNameInput.style.display = 'flex';
    twoPlayerNameInput.className = 'fade';
    start.disabled = false;
})
//event listener for start button
start.addEventListener('click', () => {
    seconds.textContent = '00';
    minutes.textContent = '00';
    gameTimer = setInterval(gameClock, 1000);
    turnCount = 0;
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
        onePlayerNameInput.style.zIndex = '-10';
        if (playerXName !== 'X') {
            playerXDisplay.textContent = playerXName;
        }
        playerODisplay.textContent = 'Computer';
        startGame();
    } else {
        twoPlayerNameInput.className = 'fadeOut';
        twoPlayerNameInput.style.zIndex = '-10';
        if (playerXName !== 'X') {
            playerXDisplay.textContent = playerXName;
        }
        if (playerOName !== 'O') {
            playerODisplay.textContent = playerOName;
        }
        startGame();
    }
});
//event listener for play again button
playAgain.addEventListener('click', restart)

//-------- basic game functions ---------//

//starts the game after 'start' is clicked
function startGame() {
    menu.className = 'fadeOut';
    menu.style.zIndex = '-10';
    gameBoard.style.display = 'grid';
    gameBoard.className = 'fade'
    gameBoard.style.zIndex = '1';
    status.style.display = 'flex';
    status.className = 'fade';
    start.disabled = true;
    player = 'x';
    textUpdate.textContent = `It's ${playerXName}'s turn!`;
    cells.forEach((cell) => {
        cell.addEventListener('click', clicked);
        cell.style.backgroundColor = '#f0f0f0';
    })
}
//on click function for cell divs.  All basic game logic is included here.
function clicked() {
    turnCount += 1;
    event.target.textContent = player.toUpperCase();
    event.target.removeEventListener('click', clicked);
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
            cells[bestMove].removeEventListener('click', clicked);
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
//determines if there is a win on the board
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
//pads numbers with a zero for the clock if they are single digit
function pad(number) {
    if ((number + '').length === 2) {
        return number + '';
    } else {
        return '0' + number;
    }
}
//builds the display for the clock
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
//turns off the clock
function stopClock() {
    clearInterval(gameTimer);
}
//builds the current board state with each players moves to be passed into the minimax function
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
//resets the board so it's ready for a new game
function reset() {
    onePlayerStart.disabled = false;
    twoPlayerStart.disabled = false;
    board = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false };
    setTimeout(() => {
        gameBoard.className = 'fadeAway';
        gameBoard.style.zIndex = '-10';
        cells.forEach((cell) => {
            cell.textContent = '';
            cell.removeEventListener('click', clicked);
        });
        status.className = 'fadeOut';
        status.zIndex = '-10';
    }, 1000);
    setTimeout(() => {
        playAgain.className = 'fade';
        playAgain.style.zIndex = '1';
    }, 3000);
    return stopClock();
}
//restarts the game when play again is clicked
function restart() {
    playAgain.className = 'fadeOut';
    playAgain.style.zIndex = '-10';
    onePlayerNameInput.style.opacity = '0';
    twoPlayerNameInput.style.opacity = '0';
    playerXName = 'X';
    playerOName = 'O';
    playerXDisplay.textContent = 'Player One';
    playerODisplay.textContent = 'Player Two';
    onePlayer = false;
    twoPlayer = false;
    setTimeout(()=>{
        menu.className = 'fade';
        menu.style.zIndex = '1';
        textUpdate.textContent ='Tic Tac Toe'
    }, 1000);
}