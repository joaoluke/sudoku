import React from "react";
import Cell from "./Cell";
import "../styles/SudokuGrid.css";

const SudokuGrid = ({
  board,
  onChange,
  onSelect,
  isSelected,
  selectedCell,
}) => {
  const selectedValue =
    selectedCell.row !== null && selectedCell.col !== null
      ? board[selectedCell.row][selectedCell.col].value
      : "";

  const getBlockIndex = (r, c) => ({
    blockRow: Math.floor(r / 3),
    blockCol: Math.floor(c / 3),
  });

  const selectedBlock =
    selectedCell.row !== null
      ? getBlockIndex(selectedCell.row, selectedCell.col)
      : null;

  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => {
            const inSameRow = rowIndex === selectedCell.row;
            const inSameCol = colIndex === selectedCell.col;

            const { blockRow, blockCol } = getBlockIndex(rowIndex, colIndex);
            const inSameBlock =
              selectedBlock &&
              blockRow === selectedBlock.blockRow &&
              blockCol === selectedBlock.blockCol;

            const isSameValue =
              selectedValue !== "" && cell.value === selectedValue;

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell.value}
                readOnly={cell.readOnly}
                onChange={(val) => onChange(rowIndex, colIndex, val)}
                onSelect={() => onSelect(rowIndex, colIndex)}
                isSelected={
                  selectedCell.row === rowIndex && selectedCell.col === colIndex
                }
                highlight={{
                  row: inSameRow,
                  col: inSameCol,
                  block: inSameBlock,
                  sameValue: isSameValue,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
