import React, { useState, useEffect, useMemo } from "react";
import SudokuGrid from "./components/SudokuGrid";
import NumberPad from "./components/NumberPad";
import { generateSudoku } from "./core/sudokuGenerator";
import {
  isBoardCompleteAndValid,
  isValidPlacement,
  getErrorCells,
} from "./core/validator";
import { saveVictory } from "./storage/games";
import "./App.css";

function App() {
  const [board, setBoard] = useState(generateSudoku("medium"));
  const [victory, setVictory] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [errorsCount, setErrorsCount] = useState(0);
  const [errorCellsSet, setErrorCellsSet] = useState(new Set());
  const [difficulty, setDifficulty] = useState("");

  const errorCells = useMemo(() => {
    const cells = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = board[row][col].value;
        if (val && !isValidPlacement(board, row, col, val)) {
          cells.push([row, col]);
        }
      }
    }

    return cells;
  }, [board]);

  const resetGame = () => {
    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((cell) => (cell.readOnly ? cell : { ...cell, value: "" }))
      )
    );
    setSeconds(0);
    setTimerActive(true);
    setErrorsCount(0);
    setErrorCellsSet(new Set());
  };

  const checkErrors = (board) => {
    let errorCount = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const val = board[row][col].value;
        if (val && val !== "" && !isValidPlacement(board, row, col, val)) {
          errorCount++;
        }
      }
    }
    setErrors(errorCount);
  };

  const getUsedNumbers = (board) => {
    const count = {};
    for (const row of board) {
      for (const cell of row) {
        if (cell.value) {
          count[cell.value] = (count[cell.value] || 0) + 1;
        }
      }
    }
    return Object.entries(count)
      .filter(([_, c]) => c >= 9)
      .map(([num]) => parseInt(num));
  };

  const handleChange = (row, col, val) => {
    if (board[row][col].readOnly) return;

    const newBoard = board.map((r, rIdx) =>
      r.map((cell, cIdx) =>
        rIdx === row && cIdx === col ? { ...cell, value: val } : cell
      )
    );

    setBoard(newBoard);

    if (val !== "") {
      const isCellValid = isValidPlacement(newBoard, row, col, val);
      const key = `${row},${col}`;

      if (!isCellValid && !errorCellsSet.has(key)) {
        setErrorsCount((prev) => prev + 1);
        setErrorCellsSet((prevSet) => {
          const updated = new Set(prevSet);
          updated.add(key);
          return updated;
        });
      }
    }

    if (isBoardCompleteAndValid(newBoard)) {
      setTimerActive(false);
      saveVictory(difficulty, seconds);
      setVictory(true);
    }
  };

  const handleSelectCell = (row, col) => {
    setSelectedCell({ row, col });
  };

  const startNewGame = (level) => {
    const puzzle = generateSudoku(level);
    setBoard(puzzle);
    setDifficulty(level);
    setSeconds(0);
    setTimerActive(true);
  };

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else if (!timerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  return (
    <div className="App">
      <h1>Sudoku</h1>

      <div className="controls">
        <div>Time: {seconds}s</div>
        <div>Errors: {errorsCount}</div>
        <button onClick={resetGame}>Reset</button>
      </div>

      {victory ? (
        <>
          <div className="victory">Victory</div>
          <div className="buttons-levels">
            <h2>New Game: choice your level</h2>
            <button onClick={() => startNewGame("easy")}>Easy</button>
            <button onClick={() => startNewGame("medium")}>Medium</button>
          </div>
        </>
      ) : !difficulty ? (
        <div className="buttons-levels">
          <h2>New Game: choice your level</h2>
          <button onClick={() => startNewGame("easy")}>Easy</button>
          <button onClick={() => startNewGame("medium")}>Medium</button>
        </div>
      ) : (
        <>
          <SudokuGrid
            board={board}
            onSelect={handleSelectCell}
            selectedCell={selectedCell}
            handleChange={handleChange}
            errorCells={errorCells}
          />

          <NumberPad
            onNumberClick={(num) => {
              const { row, col } = selectedCell;
              handleChange(row, col, String(num));
            }}
            disabledNumbers={getUsedNumbers(board)}
          />
        </>
      )}
    </div>
  );
}

export default App;
