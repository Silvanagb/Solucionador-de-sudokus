function validate(puzzle) {
  if (!puzzle) return { error: 'Required field missing' };
  if (/[^1-9.]/.test(puzzle)) return { error: 'Invalid characters in puzzle' };
  if (puzzle.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
  return true;
}

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

function checkPlacement(puzzle, row, col, value) {
  const grid = puzzleToGrid(puzzle);
  const conflicts = [];

  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === value && i !== col) conflicts.push('row');
    if (grid[i][col] === value && i !== row) conflicts.push('column');
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (grid[r][c] === value && (r !== row || c !== col)) conflicts.push('region');
    }
  }

  return [...new Set(conflicts)];
}

// Funciones individuales para FCC Unit Tests:
function checkRowPlacement(puzzle, row, col, value) {
  const grid = puzzleToGrid(puzzle);
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === value && i !== col) return false;
  }
  return true;
}

function checkColPlacement(puzzle, row, col, value) {
  const grid = puzzleToGrid(puzzle);
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === value && i !== row) return false;
  }
  return true;
}

function checkRegionPlacement(puzzle, row, col, value) {
  const grid = puzzleToGrid(puzzle);
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (grid[r][c] === value && (r !== row || c !== col)) return false;
    }
  }
  return true;
}

function solve(grid) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === '.') {
        for (let d = 1; d <= 9; d++) {
          const value = String(d);
          if (checkPlacement(gridToPuzzle(grid), r, c, value).length === 0) {
            grid[r][c] = value;
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
  const validation = validate(puzzle);
  if (validation !== true) return validation;

  const grid = puzzleToGrid(puzzle);
  if (!solve(grid)) return { error: 'Puzzle cannot be solved' };

  return { solution: gridToPuzzle(grid) };
}

module.exports = {
  validate,
  solvePuzzle,
  checkPlacement,
  checkRowPlacement,
  checkColPlacement,
  checkRegionPlacement,
};
