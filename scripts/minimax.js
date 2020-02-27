//---- minimax function elements (detScore is the actual minimax algorithm) ----//
//---- works when players play idealy, see corner case note in makeMove function ----//

//determines the score of the current potential move based on the board state//
function detScore(maxPlayer, minPlayer, currentBoard) {
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
    //maximizes possible winning outcomes
    for (let openWin of availableWinsMax) {
        winCount = 0;
        for (let coordinate of openWin) {
            if (maxPlayer.includes(coordinate)) {
                winCount += 1;
            }
        }

        winCount >= 3 ? score += 20 : winCount >= 2 ? score += 3 : winCount === 1 ? score += 1 : score += 0;
    }
    //minimizes possible losing outcomes
    for (let openWin of availableWinsMin) {
        minimizeScore = 0;
        for (coordinate of openWin) {
            if (minPlayer.includes(coordinate)) {
                minimizeScore += 1;
            }
        }

        minimizeScore >= 2 ? score -= 10 : minimizeScore === 1 ? score -= 3 : score -= 0;
    }

    return score;
}

//builds next possible boardstates for each available move for the current player
function newStates(boardState, turn) {
    let openMoves = boardState.board;
    let newStates = [];
    //creats an object for each new board state and stores them in an array
    for (let i = 0; i < openMoves.length; i++) {
        let newObj = { board: [], playerX: [], playerO: [], score: 0 };
        openMoves.forEach((a) => { newObj.board.push(a) });
        boardState.playerX.forEach((a) => { newObj.playerX.push(a) });
        boardState.playerO.forEach((a) => { newObj.playerO.push(a) });
        newStates.push(newObj);
        turn === 'x'?newStates[i].playerX.push(openMoves[i]):newStates[i].playerO.push(openMoves[i]);
        newStates[i].board.splice(i, 1);
        if (turn === 'x') {
            newObj.score = detScore(newObj.playerX, newObj.playerO, newObj.board);
        } else {
            newObj.score = detScore(newObj.playerO, newObj.playerX, newObj.board);
        }
    }
    return newStates;
}

//returns best possible move based on scores from each potential board state
function makeMove(boardState, player) {
    let scores = {};
    let openMoves = boardState.board;
    let nextMoves = newStates(boardState, player);
    for (let i = 0; i < openMoves.length; i++) {
        scores[openMoves[i]] = nextMoves[i].score;
    }
    let moves = Object.keys(scores);
    let values = Object.values(scores);
    //quick corner case check for the 4th move when opponent doesn't play idealy
    if (values.reduce((a,b)=>a+b) === -18 && values.length === 6) {
        return 1
    } else return moves[values.indexOf(Math.max(...values))];
}