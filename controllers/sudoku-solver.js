function validate(puzzle) {
  if (!puzzle) return { error: 'Required field missing' };
  if (/[^1-9.]/.test(puzzle)) return { error: 'Invalid characters in puzzle' };
  if (puzzle.length !== 81) return { error: 'Expected puzzle to be 81 characters long' };
  return true;
}

function checkRowPlacement(puzzle, row, col, value) {
  for (let c = 0; c < 9; c++) {
    if (c !== col && puzzle[row * 9 + c] === value) return false;
  }
  return true;
}

function checkColPlacement(puzzle, row, col, value) {
  for (let r = 0; r < 9; r++) {
    if (r !== row && puzzle[r * 9 + col] === value) return false;
  }
  return true;
}

function checkRegionPlacement(puzzle, row, col, value) {
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if ((r !== row || c !== col) && puzzle[r * 9 + c] === value) return false;
    }
  }
  return true;
}

function checkPlacement(puzzle, row, col, value) {
  const conflicts = [];
  if (!checkRowPlacement(puzzle, row, col, value)) conflicts.push('row');
  if (!checkColPlacement(puzzle, row, col, value)) conflicts.push('column');
  if (!checkRegionPlacement(puzzle, row, col, value)) conflicts.push('region');
  return conflicts;
}

function solvePuzzle(puzzle) {
  if (validate(puzzle) !== true) return validate(puzzle);

  const grid = puzzle.split('');
  function solve(index = 0) {
    if (index === 81) return true;
    if (grid[index] !== '.') return solve(index + 1);
    for (let d = 1; d <= 9; d++) {
      const value = d.toString();
      const row = Math.floor(index / 9);
      const col = index % 9;
      if (checkPlacement(grid.join(''), row, col, value).length === 0) {
        grid[index] = value;
        if (solve(index + 1)) return true;
        grid[index] = '.';
      }
    }
    return false;
  }

  if (solve()) return { solution: grid.join('') };
  return { error: 'Puzzle cannot be solved' };
}

module.exports = {
  validate,
  checkRowPlacement,
  checkColPlacement,
  checkRegionPlacement,
  checkPlacement,
  solvePuzzle
};
