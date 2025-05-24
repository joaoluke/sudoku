import { solveWithLogic, isValid } from "./solver";

const isSafe = (board, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num || board[x][col] === num) return false;

    const startRow = 3 * Math.floor(row / 3);
    const startCol = 3 * Math.floor(col / 3);
    const r = startRow + Math.floor(x / 3);
    const c = startCol + (x % 3);
    if (board[r][c] === num) return false;
  }
  return true;
};

const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const generateSolution = (board) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (generateSolution(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const countSolutions = (board) => {
  let count = 0;

  const solve = (b) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num)) {
              b[row][col] = num;
              solve(b);
              b[row][col] = 0;
            }
          }
          return;
        }
      }
    }
    count++;
  };

  const boardCopy = board.map((r) => [...r]);
  solve(boardCopy);
  return count;
};

const isLogicallySolvable = (board, solution) => {
  const logicBoard = solveWithLogic(board);
  return JSON.stringify(logicBoard) === JSON.stringify(solution);
};

const removeCells = (fullSolution, level) => {
  const maxToRemove = level === "easy" ? 35 : level === "medium" ? 45 : 55;
  let removed = 0;

  const board = fullSolution.map((row) => [...row]);

  while (removed < maxToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] === 0) continue;

    const backup = board[row][col];
    board[row][col] = 0;

    const solutionCount = countSolutions(board);

    if (solutionCount !== 1 || !isLogicallySolvable(board, fullSolution)) {
      board[row][col] = backup;
    } else {
      removed++;
    }
  }

  return board.map((row, r) =>
    row.map((num, c) => ({
      value: num === 0 ? "" : num.toString(),
      readOnly: num !== 0,
    }))
  );
};

export const generateSudoku = (level = 'easy') => {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0));
  generateSolution(solution);
  return removeCells(solution, level);
};
