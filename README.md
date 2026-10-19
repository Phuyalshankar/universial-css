# ⚡ Universal CSS (`universal-css`)

> **Mathematical Binary Opcode Engine for Tailwind & Modern CSS.**  
> *Ultra-fast, zero-overhead binary styling with standard W3C CSS output.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-Phuyalshankar%2Funiversal--css-black?logo=github)](https://github.com/Phuyalshankar/universial-css)
[![Specification](https://img.shields.io/badge/Spec-SPEC.md-informational.svg)](./SPEC.md)
[![Size](https://img.shields.io/badge/Engine_Size-15_KB-brightgreen.svg)]()

---

## 🌟 Architecture & The Escape Hatch

Universal CSS does not bundle megabytes of static CSS tables. Instead, it uses **Deterministic Design Token Math + Escape Hatch Architecture**:

1. **First-Class Core Utilities:** Common layout (`flex`, `grid`), spacing (`m-*`, `p-*`), dimensions (`w-*`, `h-*`), and colors are mapped directly to 1–2 byte opcodes.
2. **Modifier Bitmask:** Responsive breakpoints (`sm:`, `md:`, `lg:`) and pseudo-states (`hover:`, `focus:`) are stored in a single 1-byte bitmask.
3. **The `0xFE` Escape Hatch (100% Coverage):** Any arbitrary calculation (e.g. `w-[calc(100%-32px)]`), custom plugins, or unmapped classes are automatically routed through opcode `0xFE (RAW_CSS_STRING)`. This ensures **zero silent failures** and preservation of arbitrary CSS.
4. **Theme Customization:** Universal CSS uses the **Tailwind Default Scale** (`1 unit = 4px`). Custom design tokens from `tailwind.config.js` or non-standard scales are seamlessly routed through the `0xFE` fallback.

See [SPEC.md](./SPEC.md) for the complete binary specification.

---

## 📊 Measured Benchmark Data

*Measured using `process.hrtime.bigint()` over 10,000 median iterations (Reproducible via `node benchmark.js`).*

| Test Case | Original String Size | Binary Opcode Size | Wire Compression | Avg Compile Latency | Avg Decompile Latency |
|---|---|---|---|---|---|
| **Simple Component** (`flex items-center p-4 bg-slate-900 rounded-xl`) | 45 Bytes | 27 Bytes | **40.0% smaller** | 0.0033 ms (3.2 µs) | 0.0010 ms (1.0 µs) |
| **Medium Card** (`flex flex-col md:flex-row items-center justify-between p-6 m-auto w-full bg-[#0f172a] rounded-2xl shadow-lg border-2 gap-4 font-bold text-center`) | 144 Bytes | 60 Bytes | **58.3% smaller** | 0.0038 ms (3.8 µs) | 0.0020 ms (2.0 µs) |
| **Complex UI (Hover, Breakpoint, Animation, Calc)** (`flex flex-col items-center p-6 bg-[#0f172a] rounded-2xl md:flex-row md:justify-between lg:w-[800px] w-[calc(100%-32px)] hover:scale-105 hover:bg-[#1e293b] transition-all duration-300 ease-in-out animate-spin font-bold`) | 217 Bytes | 74 Bytes | **65.9% smaller** | 0.0049 ms (4.9 µs) | 0.0025 ms (2.5 µs) |

---

## 🛠️ Platform Support Status

- **Web (Browsers, Node.js, Next.js, Vite):** **Verified & Production-Ready** (Direct W3C Standard CSS & `@media` query generation).
- **Android (Skia / Hardware Views):** **Verified** (Working reference implementation in [`examples/android-skia/`](./examples/android-skia/)).
- **C/C++ Systems (Embedded, iOS Metal, Flutter FFI):** **Verified Header & GCC Tested** (Reference specification in [`tests/c-header/`](./tests/c-header/)).
- **Standalone iOS / Flutter Packages:** In development (Roadmap).

---

## 🚀 Quick Start

### 1. Web & React / Next.js
Install via NPM:
```bash
npm install universal-css
```

Simply import it once at the root of your project:
```javascript
import 'universal-css';

export default function App() {
  return (
    <div className="flex flex-col md:flex-row items-center p-6 bg-slate-900 rounded-2xl hover:scale-105 transition-all">
      <h1 className="text-xl font-bold text-sky-400">Universal CSS</h1>
    </div>
  );
}
```

### 2. Programmatic Node.js API
```javascript
const { compile, decompile } = require('universal-css');

// 1. Compile Tailwind string to Binary Opcode Buffer
const bin = compile('flex items-center p-4 bg-slate-900 rounded-xl hover:scale-105');
console.log('Binary Bytes:', bin); // <Buffer 00 02 00 15 00 28 04 ...>

// 2. Decompile back to standard W3C CSS
const css = decompile(bin, '.card');
console.log(css);
```

### 3. Command Line Interface (CLI)
```bash
# Compile Tailwind classes into Hex binary opcodes
npx universal-css compile "p-4 bg-slate-900 rounded-xl hover:scale-105"

# Decompile Hex opcodes back to pure CSS
npx universal-css decompile "0002001500280400500f172a0067018069"
```

---

## 📄 License
MIT License — Created by [Shankar Phuyal](https://github.com/Phuyalshankar). Free and Open-Source for personal, commercial, and enterprise deployments.
