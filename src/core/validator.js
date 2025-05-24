export const isValidPlacement = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i].value === num) return false;
    if (i !== row && board[i][col].value === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c].value === num) return false;
    }
  }

  return true;
};

export const getErrorCells = (board) => {
  const errorCells = [];

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = board[row][col].value;
      if (val && !isValidPlacement(board, row, col, val)) {
        errorCells.push([row, col]);
      }
    }
  }

  return errorCells;
};


export const isBoardCompleteAndValid = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (!board[row][col].value || board[row][col].value === "") {
        return false;
      }
    }
  }

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col].value;
      if (!isValidPlacement(board, row, col, num)) return false;
    }
  }

  return true;
};
