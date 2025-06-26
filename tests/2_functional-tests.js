const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings');

const { assert } = chai;
chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: puzzlesAndSolutions[0][0] })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
          done();
        });
    });

    test('Solve a puzzle with missing puzzle string', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field missing' });
          done();
        });
    });

    test('Solve a puzzle with invalid characters', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5..9..1....3.4..x..9.6.1.3...8...4..5.6.3.2.8..4..1....7..' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Solve a puzzle with incorrect length', function (done) {
      chai
        .request(server)
        .post('/api/solve')
        .send({ puzzle: '1.5..2.84..63.12.7.2..5..9..1....3.4..9.6.1.3...8...4..5.6.3.2.8..4..1....7..' }) // 80 chars
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });
test('Solve a puzzle that cannot be solved', function(done) {
  chai
    .request(server)
    .post('/api/solve')
    .send({
      puzzle: '11.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3......9..5....1....3.7.2..9.47.6..1'
    })
    .end(function(err, res) {
      assert.equal(res.status, 200);
      assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
      done();
    });
});

  suite('POST /api/check', () => {
    const puzzle = puzzlesAndSolutions[0][0];

    test('Check a puzzle placement with all fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: true });
          done();
        });
    });

    test('Check a puzzle placement with single conflict', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A2', value: '6' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: ['column'] });
          done();
        });
    });

    test('Check a puzzle placement with multiple conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A2', value: '5' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column'] });
          done();
        });
    });

    test('Check a puzzle placement with all conflicts', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A2', value: '2' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { valid: false, conflict: ['row', 'column', 'region'] });
          done();
        });
    });

    test('Check a puzzle placement with missing required fields', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Required field(s) missing' });
          done();
        });
    });

    test('Check a puzzle placement with invalid characters', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzle.replace('.', 'x'), coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
          done();
        });
    });

    test('Check a puzzle placement with incorrect length', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle: puzzle.slice(0, 80), coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
          done();
        });
    });

    test('Check a puzzle placement with invalid coordinate', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'Z2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid coordinate' });
          done();
        });
    });

    test('Check a puzzle placement with invalid value', function (done) {
      chai
        .request(server)
        .post('/api/check')
        .send({ puzzle, coordinate: 'A2', value: '10' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.deepEqual(res.body, { error: 'Invalid value' });
           done();
          });
      });
    });
  });
});