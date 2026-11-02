# metric-thread-calc

An offline Node.js + TypeScript CLI for basic ISO metric thread dimensions, aimed at machining students and CAD freelancers. All dimensions are in millimetres. No runtime dependencies or network access are needed.

Requires Node.js 24 or later. The build uses Node’s built-in TypeScript type stripping, so no compiler download is needed. It does not perform static type checking. Install and build:

```sh
npm install
npm test
npm link
metric-thread M10
metric-thread M10x1.25
metric-thread M8x1 --json
metric-thread list
metric-thread list --json
```

You can also run `node dist/cli.js M10` without linking. `--help` prints usage. Unknown sizes, unsupported pitches and invalid arguments produce an error on stderr and exit with status 1.

Omitting the pitch selects the coarse pitch. The explicit supported series spans M1.6–M64; see `src/data.ts` for coarse and fine combinations and source comments. Clearance hole series follow ISO 273. Thread series refer to ISO 261/724 and the corresponding GB/T 193/196 standards. This calculator implements basic dimensions, not tolerance classes or manufacturing limits.

The calculation uses:

| Value | Formula |
| --- | --- |
| Basic pitch diameter d2 | d − 0.6495P |
| Internal minor diameter d1 | d − 1.0825P |
| External minor diameter d3 | d − 1.2269P |
| Thread height H1 | 0.5413P |
| Approximate tap drill | d − P |

Results are rounded to three decimal places, with exact halfway cases rounded to even. The standard rounded drill is the nearest common 0.1 mm metric drill increment, choosing the smaller drill on an exact tie. It is a rounding convention, not an inventory lookup: check available drill sizes and the required thread engagement for your application. M12 has a calculated drill diameter of 10.25 mm and a rounded recommendation of 10.2 mm.

For M10, the default pitch is 1.5 mm, d2 is 9.026 mm, d1 is 8.376 mm, the tap drill is 8.5 mm, and the medium clearance hole is 11 mm. Clearance categories describe hole fit and are independent of coarse/fine thread pitch.

JSON output contains `designation`, `units`, `d`, `P`, `d2`, `d1`, `d3`, `H1`, `tapDrill`, `standardTapDrill`, and `clearance` (`fine`, `medium`, `coarse`). JSON numbers do not preserve trailing zeros. The library API exports `calculate(designation)` and `coarseTable()` from the package root.

## 中文说明

公制螺纹基本尺寸离线计算器，单位为毫米。运行 `metric-thread M10` 使用粗牙默认螺距，`metric-thread M10x1.25` 指定细牙，`--json` 输出 JSON。`metric-thread list` 显示 M1.6–M64 粗牙表。支持的规格与螺距见 `src/data.ts`，不支持的输入会报错并返回非零状态码。

输出包括中径、内外螺纹小径、牙高、估算攻丝底孔及 ISO 273 间隙孔。M12 理论底孔为 10.25 mm，按 0.1 mm 步长取最近值（中点向下）推荐 10.2 mm。本工具计算基本尺寸，不包含公差等级；加工时应结合材料、牙合率和实际钻头规格选择。

Licensed under MIT.
