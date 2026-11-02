import { SERIES, CLEARANCES } from './data.js';
export { SERIES, CLEARANCES } from './data.js';
// Round decimal halfway cases to even, matching the reference dimensions.
const round = (n: number) => {
  const scaled = n * 1000;
  const low = Math.floor(scaled);
  return (Math.abs(scaled - low - .5) < 1e-8
    ? low + (low % 2) : Math.round(scaled)) / 1000;
};

export function calculate(designation: string) {
  const match = /^M(\d+(?:\.\d+)?)(?:[x×](\d+(?:\.\d+)?))?$/i.exec(designation);
  if (!match) throw new Error('Invalid thread. Use M10 or M10x1.25.');
  const d = Number(match[1]);
  const row = SERIES.find(([size]) => size === d);
  if (!row) throw new Error(`Unknown size M${d}. Use "metric-thread list" for supported sizes.`);
  const pitch = match[2] === undefined ? row[1] : Number(match[2]);
  if (![row[1], ...row[2]].includes(pitch)) {
    throw new Error(`Unknown pitch ${pitch} for M${d}. Supported pitches: ${[row[1], ...row[2]].join(', ')} mm.`);
  }
  const clearance = CLEARANCES[d];
  if (!clearance) throw new Error(`Missing clearance data for M${d}.`);
  const tap = round(d - pitch);
  return {
    designation: `M${d}x${pitch}`, units: 'mm', d, P: pitch,
    d2: round(d - .6495 * pitch), d1: round(d - 1.0825 * pitch),
    d3: round(d - 1.2269 * pitch), H1: round(.5413 * pitch),
    tapDrill: tap,
    // Common metric drill increments: nearest 0.1 mm, ties toward smaller drill.
    standardTapDrill: Number((Math.ceil(tap * 10 - .5 - 1e-9) / 10).toFixed(1)),
    clearance: { fine: clearance[0], medium: clearance[1], coarse: clearance[2] }
  };
}

export function coarseTable() {
  return SERIES.map(([d, P]) => ({ designation: `M${d}`, d, P }));
}
