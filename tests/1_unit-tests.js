const chai = require('chai');
const assert = chai.assert;

const solver = require('../controllers/sudoku-solver.js');

suite('Unit Tests', () => {

  const validPuzzle =
    '135762984946381257728459613694517832812936745357824196589173426461298375273645189';
  const invalidCharPuzzle =
    '13576298494638125X728459613694517832812936745357824196589173426461298375273645189';
  const shortPuzzle = '123';

  const unsolvablePuzzle =
    '115762984946381257728459613694517832812936745357824196589173426461298375273645189';

  test('Valid puzzle string of 81 characters', () => {
    const result = solver.validate(validPuzzle);
    assert.deepEqual(result, true);
  });

  test('Puzzle string with invalid characters', () => {
    const result = solver.validate(invalidCharPuzzle);
    assert.deepEqual(result, { error: 'Invalid characters in puzzle' });
  });

  test('Puzzle string with incorrect length', () => {
    const result = solver.validate(shortPuzzle);
    assert.deepEqual(result, { error: 'Expected puzzle to be 81 characters long' });
  });

  test('Valid row placement', () => {
    const result = solver.checkRowPlacement(validPuzzle, 0, 2, '4'); // fila 0, col 2
    assert.isTrue(result);
  });

  test('Invalid row placement', () => {
    const result = solver.checkRowPlacement(validPuzzle, 0, 2, '1');
    assert.isFalse(result);
  });

  test('Valid column placement', () => {
    const result = solver.checkColPlacement(validPuzzle, 0, 2, '4');
    assert.isTrue(result);
  });

  test('Invalid column placement', () => {
    const result = solver.checkColPlacement(validPuzzle, 0, 2, '3');
    assert.isFalse(result);
  });

  test('Valid region (3x3 grid) placement', () => {
    const result = solver.checkRegionPlacement(validPuzzle, 0, 2, '4');
    assert.isTrue(result);
  });

  test('Invalid region (3x3 grid) placement', () => {
    const result = solver.checkRegionPlacement(validPuzzle, 0, 2, '1');
    assert.isFalse(result);
  });

  test('Valid puzzle passes solver', () => {
    const input =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3......9..5....5.7.9..6.8.2.3..9..5.1.3.';
    const result = solver.solvePuzzle(input);
    assert.deepEqual(result, {
      solution:
        '135762984946381257728459613694517832812936745357824196589173426461298375273645189',
    });
  });

  test('Invalid puzzle fails solver', () => {
    const result = solver.solvePuzzle(unsolvablePuzzle);
    assert.deepEqual(result, { error: 'Puzzle cannot be solved' });
  });

  test('Solver returns expected solution', () => {
    const input =
      '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3......9..5....5.7.9..6.8.2.3..9..5.1.3.';
    const result = solver.solvePuzzle(input);
    assert.deepEqual(result, {
      solution:
        '135762984946381257728459613694517832812936745357824196589173426461298375273645189',
    });
  });

});
