'use strict';

function puzzleToGrid(puzzle) {
  const grid = [];
  for (let i = 0; i < 81; i += 9) {
    grid.push(puzzle.slice(i, i + 9).split(''));
  }
  return grid;
}

function gridToPuzzle(grid) {
  return grid.flat().join('');
}

function validate(puzzle) {
  if (!puzzle) return { error: 'Required field(s) missing' };
  if (puzzle.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
  if (!/^[1-9.]+$/.test(puzzle)) return { error: 'Invalid characters in puzzle' };
  return true;
}

function checkPlacement(puzzle, row, col, value) {
  const conflicts = [];

  // Revisar fila
  for (let c = 0; c < 9; c++) {
    if (c !== col && puzzle[row * 9 + c] === value) {
      conflicts.push('row');
      break;
    }
  }

  // Revisar columna
  for (let r = 0; r < 9; r++) {
    if (r !== row && puzzle[r * 9 + col] === value) {
      conflicts.push('column');
      break;
    }
  }

  // Revisar región
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && puzzle[r * 9 + c] === value) {
        conflicts.push('region');
        r = 10; // break doble for
        break;
      }
    }
  }

  return conflicts;
}

function checkRowPlacement(puzzle, row, col, value) {
  for (let c = 0; c < 9; c++) {
    if (c !== col && puzzle[row * 9 + c] === value) {
      return false;
    }
  }
  return true;
}

function checkColPlacement(puzzle, row, col, value) {
  for (let r = 0; r < 9; r++) {
    if (r !== row && puzzle[r * 9 + col] === value) {
      return false;
    }
  }
  return true;
}

function checkRegionPlacement(puzzle, row, col, value) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && puzzle[r * 9 + c] === value) {
        return false;
      }
    }
  }
  return true;
}

function solve(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === '.') {
        for (let d = 1; d <= 9; d++) {
          const v = String(d);
          if (checkPlacement(gridToPuzzle(grid), r, c, v).length === 0) {
            grid[r][c] = v;
            if (solve(grid)) return true;
            grid[r][c] = '.';
          }
        }
        return false;
      }
    }
  }
  return true;
}

function solvePuzzle(puzzle) {
  const v = validate(puzzle);
  if (v !== true) return v;
  const grid = puzzleToGrid(puzzle);
  if (!solve(grid)) return { error: 'Puzzle cannot be solved' };
  return { solution: gridToPuzzle(grid) };
}

module.exports = {
  validate,
  checkPlacement,
  checkRowPlacement,
  checkColPlacement,
  checkRegionPlacement,
  solvePuzzle
};
