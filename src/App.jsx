import React, { useState } from "react";
import SudokuGrid from "./components/SudokuGrid";
import NumberPad from "./components/NumberPad"
import { generateSudoku } from "./utils/sudokuGenerator";
import "./App.css";

function App() {
  const [board, setBoard] = useState(generateSudoku("medium"));
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

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
    const newBoard = board.map((r, i) =>
      r.map((cell, j) =>
        i === row && j === col ? { ...cell, value: val } : cell
      )
    );
    setBoard(newBoard);
  };

  const handleSelectCell = (row, col) => {
    setSelectedCell({ row, col });
  };
  

  return (
    <div className="App">
      <h1>Sudoku</h1>
      <SudokuGrid
        board={board}
        onSelect={handleSelectCell}
        selectedCell={selectedCell}
        onChange={handleChange}
      />

      <NumberPad
        onNumberClick={(num) => {
          const { row, col } = selectedCell;
          if (row === null || col === null) return;
          if (board[row][col].readOnly) return;

          const newBoard = board.map((r, i) =>
            r.map((cell, j) =>
              i === row && j === col ? { ...cell, value: num.toString() } : cell
            )
          );
          setBoard(newBoard);
        }}
        disabledNumbers={getUsedNumbers(board)}
      />
    </div>
  );
}

export default App;
