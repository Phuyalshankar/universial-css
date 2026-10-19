# ⚡ Universal CSS (`universal-css`)

> **Deterministic Binary Opcode Engine for Tailwind CSS Design Tokens.**  
> *Ultra-fast binary compilation and zero-overhead decompilation into standard W3C CSS.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Phuyalshankar%2Funiversial--css-black?logo=github)](https://github.com/Phuyalshankar/universial-css)
[![Specification](https://img.shields.io/badge/Spec-SPEC.md-informational.svg)](./SPEC.md)
[![Size](https://img.shields.io/badge/Engine_Size-15_KB-brightgreen.svg)]()

---

## 🌟 Architecture: Core Token Coverage & Escape Hatch

Universal CSS maps high-frequency Tailwind utilities into compact 1–2 byte binary opcodes, while safely routing unmapped or arbitrary rules through an escape hatch:

### 1. First-Class Supported Design Tokens:
- **Spacing (in `rem`):** `p-*`, `m-*`, `px-*`, `py-*`, `gap-*` (supports full integer and fractional scales: `0.5`, `1`, `1.5`, `2`, `4`, etc.).
- **Named Color Palette:** 19 core colors (`slate`, `gray`, `zinc`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `pink`, `rose`) × 10 shades (`50` to `900`), plus `white` and `black`.
- **Custom Hex Colors:** Validated 3-digit and 6-digit hex (e.g. `bg-[#0f172a]`, `text-[#38bdf8]`).
- **Typography:** `text-xs` (0.75rem) through `text-4xl` (2.25rem), `font-bold`, `text-center`.
- **Layout & Sizing:** `flex`, `grid`, `flex-row`, `flex-col`, `items-center`, `justify-between`, `w-full`, `h-full`, `w-[px]`.
- **States & Variants:** Multi-modifier combinations including `hover:`, `focus:`, `active:`, `disabled:`, `dark:` and responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`).

### 2. The `0xFE` Fallback Escape Hatch:
Any arbitrary calculation (`w-[calc(100%-32px)]`), custom theme variable, or unrecognized plugin class is automatically wrapped into opcode `0xFE (RAW_CSS_STRING)`. This ensures **zero silent failures** and preservation of arbitrary CSS.

---

## 📊 Measured Benchmark Data

*Measured using `process.hrtime.bigint()` across 10,000 median iterations on Node.js (Reproducible via `node benchmark.js`):*

| Test Case | Original String Size | Binary Opcode Size | Wire Compression | Avg Compile Latency | Avg Decompile Latency |
|---|---|---|---|---|---|
| **Simple Component** (`flex items-center p-4 bg-slate-900 rounded-xl`) | 45 Bytes | 16 Bytes | **64.4% smaller** | 0.0039 ms (3.9 µs) | 0.0017 ms (1.7 µs) |
| **Medium Responsive Card** (`flex flex-col md:flex-row items-center justify-between p-6 m-auto w-full bg-[#0f172a] rounded-2xl shadow-lg border-2 gap-4 font-bold text-center`) | 144 Bytes | 61 Bytes | **57.6% smaller** | 0.0090 ms (9.0 µs) | 0.0035 ms (3.5 µs) |
| **Complex UI (Hover, Breakpoint, Animation, Calc)** (`flex flex-col items-center p-6 bg-[#0f172a] rounded-2xl md:flex-row md:justify-between lg:w-[800px] w-[calc(100%-32px)] hover:scale-105 hover:bg-[#1e293b] transition-all duration-300 ease-in-out animate-spin font-bold`) | 217 Bytes | 102 Bytes | **53.0% smaller** | 0.0137 ms (13.7 µs) | 0.0038 ms (3.8 µs) |

---

## 🛠️ Verification & Test Suite

Run the comprehensive unit test suite:
```bash
node tests/engine.test.js
```
Validates:
- Spacing correctness in `rem` (`p-0.5`, `p-1`, `p-4`, `gap-1.5`)
- Pseudo-state outputs (`hover:`, `dark:`, `focus:`)
- Breakpoint + state combinations (`md:hover:flex-row`)
- Font size rem scale and named color lookups
- Malformed hex fallback to `0xFE`
- Deduplication and whitespace normalization

---

## 🚀 Quick Start

```javascript
const { compile, decompile } = require('universal-css');

// Compile to Binary
const bin = compile('flex md:hover:flex-row p-4 gap-1.5 bg-slate-900 text-sky-400');

// Decompile back to W3C Standard CSS
const css = decompile(bin, '.card');
console.log(css);
```

---

## 📄 License
MIT License — Created by [Shankar Phuyal](https://github.com/Phuyalshankar). Free and Open-Source for personal, commercial, and enterprise deployments.
