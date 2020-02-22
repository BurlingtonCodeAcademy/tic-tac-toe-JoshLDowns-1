let bestValue;
let newScore; 

function detScore(player) {
    for (let win of winningArrays) {
        let winCount = 0;
        for (let coordinate of win) {
            if (player.includes(coordinate)) {
                winCount += 1;
            }
        }
        if (winCount >= 3) {
            return 10;
        }
    }
    return 0;
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
            newObj.score = newObj.score + detScore(newObj.playerX);
            newObj.score = newObj.score - detScore(newObj.playerO);
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
            newObj.score = newObj.score + detScore(newObj.playerX);
            newObj.score = newObj.score - detScore(newObj.playerO);
        }
    }
    return newStates;
}


function minMax(state, turn, depth) {
    if (state.score !== 0) {
        if (state.score === 10) {
            return 10 - depth;
        } else return -10 + depth;
    } else {
        let nextStates = newStates(state, turn === 'x' ? 'o' : 'x');
        if (nextStates.length === 0) {
            return 0;
        }
        if (turn === 'x') {
            bestValue = -Infinity;
            for (let nextState of nextStates) {
                newScore = minMax(nextState, 'o', depth+1);
                bestValue = Math.max(bestValue, newScore);
                return bestValue;
            }
        } else if (turn === 'o') {
            bestValue = Infinity;
            for (let nextState of nextStates) {
                newScore = minMax(nextState, 'x', depth+1);
                bestValue = Math.min(bestValue, newScore);
                return bestValue;
            }
        }
    }
}

function makeMove(boardState, player) {
    let scores = {};
    let openMoves = boardState.board;
    let nextMoves = newStates(boardState, player);
    for (let i = 0; i < openMoves.length; i++) {
        scores[openMoves[i]] = minMax(nextMoves[i], player, 0);
        if (player === 'x') {
            bestValue = -1000;
            scores[openMoves[i]] = Math.max(scores[openMoves[i]], bestValue);
        } else {
            bestValue = 1000;
            scores[openMoves[i]] = Math.min(scores[openMoves[i]], bestValue);
        }
        console.log(scores)
    }
    let moves = Object.keys(scores);
    let values = Object.values(scores);
    return player === 'x' ? moves[values.indexOf(Math.max(...values))] : moves[values.indexOf(Math.min(...values))];
}