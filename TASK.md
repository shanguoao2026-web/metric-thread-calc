# Task: metric-thread-calc (Node.js + TypeScript CLI, no network)
Goal: ISO metric thread (ISO 261/724, GB/T 193/196) calculator for machining students and CAD freelancers.
- Command: `metric-thread M10` (coarse pitch default) and `metric-thread M10x1.25` (fine) print: nominal d, pitch P, basic pitch diameter d2 = d - 0.6495P, basic minor diameters d1 = d - 1.0825P (internal) and d3 = d - 1.2269P (external), thread height H1 = 0.5413P, recommended tap drill (d - P, also show standard rounded drill), and clearance holes (ISO 273 fine/medium/coarse). `--json` output. `metric-thread list` prints the coarse table M1.6–M64.
- Encode coarse/fine pitch series and ISO 273 clearance holes as data tables with source comments. Reject unknown sizes/pitches with a clear error and non-zero exit.
- Unit tests with known reference values: M10 coarse P=1.5, d2=9.026, d1=8.376, tap drill 8.5, clearance medium 11; M6 P=1, d2=5.350, tap 5.0, clearance medium 6.6; M8x1 d2=7.350, tap 7.0; M12 P=1.75, tap 10.2. `npm test` must pass.
- README in English plus short Chinese section, MIT LICENSE, .gitignore with node_modules, dist, *.log. No personal data or local absolute paths.
