'use strict';

const { solvePuzzle, validate, checkPlacement } = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  app.route('/api/solve').post((req, res) => {
    const puzzle = req.body.puzzle;

    const validation = validate(puzzle);
    if (validation !== true) return res.json(validation);

    const result = solvePuzzle(puzzle);
    return res.json(result);
  });

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    const validation = validate(puzzle);
    if (validation !== true) return res.json(validation);

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: 'Required field(s) missing' });
    }

    if (!/^[A-I][1-9]$/.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    const row = coordinate.charCodeAt(0) - 65;
    const col = parseInt(coordinate[1]) - 1;

    const index = row * 9 + col;

    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    const conflicts = checkPlacement(puzzle, row, col, value);

    if (conflicts.length === 0) {
      return res.json({ valid: true });
    }

    return res.json({ valid: false, conflict: conflicts });
  });
};
