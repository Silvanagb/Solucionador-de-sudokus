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
  const grid = puzzleToGrid(puzzle);
  const conflicts = [];

  // fila
  for (let c = 0; c < 9; c++)
    if (grid[row][c] === value && c !== col) conflicts.push('row');
  // columna
  for (let r = 0; r < 9; r++)
    if (grid[r][col] === value && r !== row) conflicts.push('column');
  // región
  const sr = Math.floor(row / 3) * 3;
  const sc = Math.floor(col / 3) * 3;
  for (let r = sr; r < sr + 3; r++)
    for (let c = sc; c < sc + 3; c++)
      if (grid[r][c] === value && (r !== row || c !== col)) conflicts.push('region');

  return [...new Set(conflicts)];
}

function checkRowPlacement(puzzle, row, col, value) {
  return checkPlacement(puzzle, row, col, value).filter(x => x === 'row').length === 0;
}
function checkColPlacement(puzzle, row, col, value) {
  return checkPlacement(puzzle, row, col, value).filter(x => x === 'column').length === 0;
}
function checkRegionPlacement(puzzle, row, col, value) {
  return checkPlacement(puzzle, row, col, value).filter(x => x === 'region').length === 0;
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
