import React from "react";
import Cell from "./Cell";
import "../styles/SudokuGrid.css";

const SudokuGrid = ({
  board,
  handleChange,
  onSelect,
  selectedCell,
  errorCells,
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

            const isError = errorCells.some(
              (ec) => ec[0] === rowIndex && ec[1] === colIndex
            );

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                value={cell.value}
                readOnly={cell.readOnly}
                onChangeCell={(val) => {
                  handleChange(rowIndex, colIndex, val);
                }}
                onSelect={() => onSelect(rowIndex, colIndex)}
                isError={isError}
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
