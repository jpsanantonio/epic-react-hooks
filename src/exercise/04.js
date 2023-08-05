// useState: tic tac toe
// http://localhost:3000/isolated/final/04.js

import * as React from 'react';
import { useLocalStorageState } from '../utils';

function Board({ squares, onClick }) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    );
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

function Game() {
  const initialSquareValues = Array(9).fill(null);
  const [history, setHistory] = useLocalStorageState('history', [
    initialSquareValues,
  ]);
  const [currentSquares, setCurrentSquares] = useLocalStorageState(
    'squares',
    initialSquareValues,
  );
  const currentSquaresIndex = history.findIndex(
    item => item.toString() === currentSquares.toString(),
  );

  function handleClickHistory(event) {
    setCurrentSquares(history[event.target.value]);
  }

  const moves = history.map((item, index) => {
    const isCurrent = currentSquaresIndex === index;
    const message = index === 0 ? 'Go to game start' : `Go to move #${index}`;
    return (
      <li key={index}>
        <button disabled={isCurrent} onClick={handleClickHistory} value={index}>
          {message}
          {isCurrent && ' (current)'}
        </button>
      </li>
    );
  });

  const nextValue = calculateNextValue(currentSquares);
  const winner = calculateWinner(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (winner || currentSquares[square]) {
      return;
    }
    const currentSquaresCopy = [...currentSquares];
    currentSquaresCopy[square] = nextValue;
    setCurrentSquares(currentSquaresCopy);

    setHistory(prev => {
      prev = prev.slice(0, currentSquaresIndex + 1);
      prev.push(currentSquaresCopy);
      return prev;
    });
  }

  function restart() {
    setCurrentSquares(initialSquareValues);
    setHistory([initialSquareValues]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`;
}

function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return <Game />;
}

export default App;
