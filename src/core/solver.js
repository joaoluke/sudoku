export const initializeCandidates = (board) => {
  const candidates = [];

  for (let r = 0; r < 9; r++) {
    candidates[r] = [];
    for (let c = 0; c < 9; c++) {
      if (board[r][c] !== 0) {
        candidates[r][c] = [];
      } else {
        candidates[r][c] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
    }
  }

  return candidates;
};

export const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
};

const getCandidates = (board, row, col) => {
  if (board[row][col] !== 0) return [];

  const used = new Set();

  for (let i = 0; i < 9; i++) {
    used.add(board[row][i]);
    used.add(board[i][col]);

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    used.add(board[boxRow][boxCol]);
  }

  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !used.has(n));
};

const findHiddenSingles = (board) => {
  const newBoard = board.map((r) => [...r]);
  let updated = false;

  const scanRegion = (cells) => {
    const positions = {};

    for (const [row, col] of cells) {
      const candidates = getCandidates(newBoard, row, col);
      for (const num of candidates) {
        if (!positions[num]) positions[num] = [];
        positions[num].push([row, col]);
      }
    }

    for (const num in positions) {
      if (positions[num].length === 1) {
        const [r, c] = positions[num][0];
        newBoard[r][c] = parseInt(num);
        updated = true;
      }
    }
  };

  for (let row = 0; row < 9; row++) {
    scanRegion([...Array(9)].map((_, col) => [row, col]));
  }

  for (let col = 0; col < 9; col++) {
    scanRegion([...Array(9)].map((_, row) => [row, col]));
  }

  for (let br = 0; br < 3; br++) {
    for (let bc = 0; bc < 3; bc++) {
      const cells = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          cells.push([br * 3 + r, bc * 3 + c]);
        }
      }
      scanRegion(cells);
    }
  }

  return { board: newBoard, updated };
};

export const solveWithLogic = (board) => {
  let newBoard = board.map((r) => [...r]);
  let progress = true;

  while (progress) {
    progress = false;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newBoard[row][col] === 0) {
          const candidates = getCandidates(newBoard, row, col);
          if (candidates.length === 1) {
            newBoard[row][col] = candidates[0];
            progress = true;
          }
        }
      }
    }

    const result = findHiddenSingles(newBoard);
    newBoard = result.board;
    if (result.updated) progress = true;
  }

  return newBoard;
};
