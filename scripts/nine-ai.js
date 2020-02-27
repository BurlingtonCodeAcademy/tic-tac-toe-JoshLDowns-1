function detScore(maxPlayer, minPlayer, openBoard) {
    let currentBoard = openBoard.board;
    let availableWinsMax = [];
    let availableWinsMin = [];
    let openCountMax = 0;
    let openCountMin = 0;
    let winCount = 0;
    let score = 0;
    let minimizeScore = 0;
    //builds an array of open winning paths on the board for both players (max for current player, min for opponent)
    for (let win of winningArrays) {
        openCountMax = 0;
        openCountMin = 0;
        for (let space of win) {
            if (currentBoard.includes(space) || maxPlayer.includes(space)) {
                openCountMax += 1;
            }
            if (currentBoard.includes(space) || minPlayer.includes(space)) {
                openCountMin += 1;
            }
        }
        if (openCountMax >= 3) {
            availableWinsMax.push(win);
        }
        if (openCountMin >= 3) {
            availableWinsMin.push(win);
        }
    }
    //maximizes score of next board if opponent has no paths to victory
    if (availableWinsMin.length === 0) {
        score += 15;
    }
    //tries not to send opponent to full board (giving them free moves);
    if (currentBoard.length === 0) {
        score -= 20;
    }

    if (currentBoard.length === 9) {
        score += 20;
    }
    //maximizes chance not to get blocked on next board (by minimizing score of that board)
    for (let openWin of availableWinsMax) {
        winCount = 0;
        for (let coordinate of openWin) {
            if (maxPlayer.includes(coordinate)) {
                winCount += 1;
            }
        }

        winCount >= 2 ? score -= 20 : winCount === 1 ? score -=10: score -= 0;
    }
    //minimizes possible losing outcomes on next board
    for (let openWin of availableWinsMin) {
        minimizeScore = 0;
        for (coordinate of openWin) {
            if (minPlayer.includes(coordinate)) {
                minimizeScore += 1;
            }
        }
        minimizeScore >= 2 ? score -= 20 : minimizeScore === 1 ? score -= 10 : score -= 0;
    }
    return score;
}

//builds next possible boardstates for each available move for the current player
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

//builds each board that ai could send opponent to
function newBoards (boardNow, fullBoard, player) {
    let openMoves = boardNow.board;
    let boards = [];
    for (let i = 0; i < openMoves.length; i++) {
        boards.push(buildBoardState(fullBoard[openMoves[i]]));
    }
    for (let board of boards) {
        board.score = detScore(player==='x'?boardNow.playerX:boardNow.playerO, player==='x'?boardNow.playerO:boardNow.playerX, board);
    }
    return boards;
}

//checks if AI can win on current board and returns move
function winNow (boardState, player) {
    let currentPlayer = player === 'x' ? 'playerX' : 'playerO';

    for (let win of winningArrays) {
        let potentialWinCount = 0;
        for (let coordinate of win) {
            if (boardState[currentPlayer].includes(coordinate)) {
                potentialWinCount += 1;
            }
        }
        if (potentialWinCount === 2) {
            for (let space of win) {
                if (!boardState[currentPlayer].includes(space)) {
                    return space;
                }
            }
        }
    }
    return false;
}

//currently random move when board completely opens up... planning on working on this
function bestOpenMove(allBoards) {
    let availableBoards = [];
    let availableBoardIndexs = [];
    let boardCount = 0
    for (let i = 0; i < 9; i++) {
        if (!allBoards[i].finished===true) {
            availableBoards.push(allBoards[i]);
            availableBoardIndexs.push(boardCount);
            boardCount ++;
        }
    }
    let nextBoard = availableBoardIndexs[Math.floor(Math.random()*availableBoardIndexs.length)]
    let nextBoardState = buildBoardState(availableBoards[nextBoard])
    let availableNextMoves = nextBoardState.board[Math.floor(Math.random()*nextBoardState.board.length)]

    return [nextBoard, availableNextMoves]
}

//returns best possible move based on scores from each potential board state
function makeMove(globalBoard, boardState, player, finished) {
    let scores = {};
    let openMoves = boardState.board;
    if (finished===true) {
        return bestOpenMove(globalBoard)
    }
    let potentialWinMove = winNow(boardState, player);
    if (potentialWinMove !== false && openMoves.includes(potentialWinMove)) {
        return potentialWinMove;
    }
    let nextBoards = newBoards(boardState, globalBoard, player);
    for (let i = 0; i < openMoves.length; i++) {
        scores[openMoves[i]] = nextBoards[i].score;
    }
    let moves = Object.keys(scores);
    let values = Object.values(scores);
    return moves[values.indexOf(Math.max(...values))];
}
