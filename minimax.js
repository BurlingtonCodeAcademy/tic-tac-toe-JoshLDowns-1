let bestValue;
let newScore;

function detScore(maxPlayer, minPlayer, currentBoard) {
    let availableWinsMax = [];
    let availableWinsMin = [];
    let openCountMax = 0;
    let openCountMin = 0;
    let winCount = 0;
    let score = 0;
    let minimizeScore = 0;

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

    for (let openWin of availableWinsMax) {
        winCount = 0;
        for (let coordinate of openWin) {
            if (maxPlayer.includes(coordinate)) {
                winCount += 1;
            }
        }

        winCount >= 3 ? score += 20 : winCount >= 2 ? score += 3 : winCount === 1 ? score += 1 : score += 0;
    }

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

function newStates(boardState, turn) {

    let openMoves = boardState.board;
    let newStates = [];

    if (turn === 'x') {
        for (let i = 0; i < openMoves.length; i++) {
            let newObj = { board: [], playerX: [], playerO: [], score: 0 };
            openMoves.forEach((a) => { newObj.board.push(a) });
            boardState.playerX.forEach((a) => { newObj.playerX.push(a) });
            boardState.playerO.forEach((a) => { newObj.playerO.push(a) });
            newStates.push(newObj);
            newStates[i].playerX.push(openMoves[i]);
            newStates[i].board.splice(i, 1);
            newObj.score = detScore(newObj.playerX, newObj.playerO, newObj.board);
        }
    } else {
        for (let i = 0; i < openMoves.length; i++) {
            let newObj = { board: [], playerX: [], playerO: [], score: 0 };
            openMoves.forEach((a) => { newObj.board.push(a) });
            boardState.playerX.forEach((a) => { newObj.playerX.push(a) });
            boardState.playerO.forEach((a) => { newObj.playerO.push(a) });
            newStates.push(newObj);
            newStates[i].playerO.push(openMoves[i]);
            newStates[i].board.splice(i, 1);
            newObj.score = detScore(newObj.playerO, newObj.playerX, newObj.board);
        }
    }

    return newStates;
}

function makeMove(boardState, player) {
    let scores = {};
    let openMoves = boardState.board;
    let nextMoves = newStates(boardState, player);
    for (let i = 0; i < openMoves.length; i++) {
        scores[openMoves[i]] = nextMoves[i].score;
    }
    let moves = Object.keys(scores);
    let values = Object.values(scores);
    if (values.reduce((a,b)=>a+b) === -18 && values.length === 6) {
        return 1
    } else return moves[values.indexOf(Math.max(...values))];
}