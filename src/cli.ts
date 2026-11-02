#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import { calculate, coarseTable } from './index.js';
const usage = 'Usage: metric-thread <M10|M10x1.25|list> [--json]';
export function main(args: string[]) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0]!)) {
    console.log(usage);
    return;
  }
  const json = args.includes('--json');
  const positional = args.filter(arg => arg !== '--json');
  if (positional.length !== 1 || args.filter(arg => arg === '--json').length > 1) {
    throw new Error(usage);
  }
  if (positional[0] === 'list') {
    const rows = coarseTable();
    console.log(json ? JSON.stringify(rows, null, 2) :
      'Coarse metric threads (mm)\nThread\tNominal d\tPitch P\n' +
      rows.map(r => `${r.designation}\t${r.d}\t${r.P}`).join('\n'));
    return;
  }
  const r = calculate(positional[0]!);
  console.log(json ? JSON.stringify(r, null, 2) : [
    `${r.designation} — all dimensions in mm`,
    `Nominal diameter d: ${r.d.toFixed(3)}`, `Pitch P: ${r.P.toFixed(3)}`,
    `Basic pitch diameter d2: ${r.d2.toFixed(3)}`,
    `Basic internal minor diameter d1: ${r.d1.toFixed(3)}`,
    `Basic external minor diameter d3: ${r.d3.toFixed(3)}`,
    `Thread height H1: ${r.H1.toFixed(3)}`,
    `Tap drill (d - P): ${r.tapDrill.toFixed(3)}`,
    `Standard rounded drill: ${r.standardTapDrill.toFixed(1)}`,
    `Clearance holes (ISO 273): fine ${r.clearance.fine}, medium ${r.clearance.medium}, coarse ${r.clearance.coarse}`
  ].join('\n'));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
try { main(process.argv.slice(2)); }
catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}

}
