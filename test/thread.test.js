import test from 'node:test';
import assert from 'node:assert/strict';
import { main } from '../dist/cli.js';
import { calculate, coarseTable, SERIES, CLEARANCES } from '../dist/index.js';
const cli = (...args) => {
  const result = { status: 0, stdout: '', stderr: '' };
  const log = console.log;
  console.log = value => { result.stdout += String(value) + '\n'; };
  try { main(args); }
  catch (error) { result.status = 1; result.stderr = `Error: ${error.message}\n`; }
  finally { console.log = log; }
  return result;
};

test('known reference dimensions', () => {
  const m10 = calculate('M10');
  assert.equal(m10.P, 1.5);
  assert.equal(m10.d2, 9.026);
  assert.equal(m10.d1, 8.376);
  assert.equal(m10.d3, 8.16);
  assert.equal(m10.H1, .812);
  assert.equal(m10.tapDrill, 8.5);
  assert.equal(m10.clearance.medium, 11);
  const m6 = calculate('M6');
  assert.equal(m6.P, 1);
  assert.equal(m6.d2, 5.350);
  assert.equal(m6.tapDrill, 5);
  assert.equal(m6.clearance.medium, 6.6);
  assert.equal(calculate('M8x1').d2, 7.350);
  assert.equal(calculate('M8x1').tapDrill, 7);
  assert.equal(calculate('M12').P, 1.75);
  assert.equal(calculate('M12').tapDrill, 10.25);
  assert.equal(calculate('M12').standardTapDrill, 10.2);
});
test('every supported combination has dimensions and clearance', () => {
  for (const [d, coarse, fine] of SERIES) {
    assert.ok(CLEARANCES[d]);
    for (const p of [coarse, ...fine]) {
      const r = calculate(`M${d}x${p}`);
      assert.ok(r.d3 > 0 && r.d3 < r.d2 && r.d2 < d);
      assert.ok(r.clearance.fine > d);
    }
  }
  assert.equal(coarseTable()[0].d, 1.6);
  assert.equal(coarseTable().at(-1).d, 64);
});
test('CLI JSON, text and list output', () => {
  const result = cli('M10', '--json');
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), calculate('M10'));
  assert.match(cli('M6').stdout, /Basic pitch diameter d2: 5.350/);
  assert.match(cli('M12').stdout, /Standard rounded drill: 10.2/);
  assert.match(cli('list').stdout, /M64\s+64\s+6/);
  assert.deepEqual(JSON.parse(cli('--json', 'list').stdout), coarseTable());
  assert.equal(cli('--help').status, 0);
});
test('invalid inputs fail without printing results', () => {
  for (const args of [[], ['M13'], ['M10x1.1'], ['M0'], ['M10x0'], ['M10junk'],
    ['M10', 'M6'], ['--wat'], ['M10', '--json', '--json']]) {
    const result = cli(...args);
    assert.equal(result.status, 1, args.join(' '));
    assert.match(result.stderr, /Error:/);
    assert.equal(result.stdout, '');
  }
  assert.match(cli('M10x1.1').stderr, /Supported pitches:/);
});
