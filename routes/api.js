'use strict';

const solver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;
    
if (!puzzle) {
  return res.json({ error: 'Required field missing' });
}

const validation = solver.validate(puzzle);
if (validation !== true) {
  return res.json(validation);
}

   app.route('/api/check').post((req, res) => {
  const { puzzle, coordinate, value } = req.body;

  if (!puzzle || !coordinate || !value) {
    return res.json({ error: 'Required field(s) missing' });
  }

  if (/[^1-9.]/.test(puzzle)) {
    return res.json({ error: 'Invalid characters in puzzle' });
  }

  if (puzzle.length !== 81) {
    return res.json({ error: 'Expected puzzle to be 81 characters long' });
  }

  if (!/^[A-I][1-9]$/.test(coordinate)) {
    return res.json({ error: 'Invalid coordinate' });
  }

  if (!/^[1-9]$/.test(value)) {
    return res.json({ error: 'Invalid value' });
  }

  const row = coordinate.charCodeAt(0) - 65;
  const col = parseInt(coordinate[1]) - 1;

  if (puzzle[row * 9 + col] === value) {
    return res.json({ valid: true });
  }

  const conflicts = solver.checkPlacement(puzzle, row, col, value);

  if (conflicts.length === 0) {
    return res.json({ valid: true });
  }

  return res.json({ valid: false, conflict: conflicts });
});
};
