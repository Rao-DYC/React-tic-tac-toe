import { useState } from "react";

// this component will create individual squares
function Square({ value, onSquareClick }) {
    return (
        <button className="square" onClick={onSquareClick} >{value}</button>
    );
}

// this component will create all 9 squares in loop by calling Square component
function CreateSquares({ squares, checkClick }) {

    const data = [];
    for (let i = 0; i < 3; i++) {
        const rows = [];
        for (let j = 0; j < 3; j++) {

            const index = i * 3 + j; // Calculate a unique index for each square

            rows.push(
                <Square value={squares[index]} onSquareClick={() => checkClick(index)} key={index} />
            );
        }
        data.push(
            <div className="board-row" key={i}>{rows}</div>
        );
    }
    return data;
}

// this component will handle each move on board
function Board({ xIsNext, squares, onPlay }) {

    let winner = calculateWinner(squares);

    function handleClick(index) {

        if (squares[index] || winner) {
            return;
        }
        const nextSquares = squares.slice();

        nextSquares[index] = xIsNext ? 'X' : 'O';

        onPlay(nextSquares);
    }
    let status = winner ? "Winner: " + winner : "Next Player: " + (xIsNext ? "X" : "O");

    return (
        <>
            <div className="status">{status}</div>
            <CreateSquares squares={squares} checkClick={handleClick} />
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description = move > 0 ? 'Go to move #' + move : "Go to game start";

        return (
            <li key={move}>
                <button onClick={() => { jumpTo(move) }}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let len = lines.length;
    for (let i = 0; i < len; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}