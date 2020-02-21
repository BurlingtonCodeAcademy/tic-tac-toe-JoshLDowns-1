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
        return state.score;
    } else {
        let nextStates = newStates(state, turn === 'x' ? 'o' : 'x');
        if (nextStates.length === 0) {
            return state.score;
        }
        let currentScores = [];
        nextStates.forEach((a) => { currentScores.push(a.score) });
        if (turn === 'x' && currentScores.includes(10)) {
            return 10 - depth;
        } else if (turn === 'o' && currentScores.includes(-10)) {
            return -10 + depth;
        } else if (turn === 'x' && currentScores.includes(-10)) {
            return -10 - depth;
        } else if (turn === 'o' && currentScores.includes(10)) {
            return 10 + depth;
        } else {
            for (let nextState of nextStates) {
                return minMax(nextState, turn === 'x' ? 'o' : 'x', depth+1)
            }
        }
    }
}

function makeMove(boardState, player) {
    let scores = {};
    let openMoves = boardState.board;
    openMoves.forEach((a) => scores[a] = 0);
    let nextMoves = newStates(boardState, player);
    for (let i = 0; i < openMoves.length; i++) {
        scores[openMoves[i]] = minMax(nextMoves[i], player, 0)
    }
    //nextMoves.forEach((state)=>scores.push(minMax(state,turn,0)));
    let moves = Object.keys(scores);
    let values = Object.values(scores);
    let positiveScores = [];
    let negativeScores = [];
    values.forEach((value)=>{value<=0?negativeScores.push(value):positiveScores.push(value)});
    console.log(scores)
    if (player === 'x') {
        if (moves.includes('4')) {
            return 4;
        } else if (negativeScores.length>positiveScores.length && !Math.max(...negativeScores)>=10) {
            return moves[values.indexOf(Math.min(...values))]
        } else {
            return moves[values.indexOf(Math.max(...values))]
        }
    } else {
        if (moves.includes('4')) {
            return 4;
        } else if (negativeScores.length<positiveScores.length && (negativeScores.length === 0 || !Math.min(...negativeScores)<=-10)) {
            return moves[values.indexOf(Math.max(...values))]
        } else {
            return moves[values.indexOf(Math.min(...values))]
        }
    }
}