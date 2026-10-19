/**
 * ⚡ Reproducible Benchmark Suite for Universal CSS
 * Measures real latency using process.hrtime.bigint() over 10,000 iterations.
 */

const { UniversalCSS } = require('./index');

console.log('🏁 Running Universal CSS Benchmark Suite...\n');

const testCases = [
    {
        name: 'Simple Component',
        input: 'flex items-center p-4 bg-slate-900 rounded-xl'
    },
    {
        name: 'Medium Responsive Card',
        input: 'flex flex-col md:flex-row items-center justify-between p-6 m-auto w-full bg-[#0f172a] rounded-2xl shadow-lg border-2 gap-4 font-bold text-center'
    },
    {
        name: 'Complex Interactive UI (Hover, Breakpoints, Animations, Calc)',
        input: 'flex flex-col items-center p-6 bg-[#0f172a] rounded-2xl md:flex-row md:justify-between lg:w-[800px] w-[calc(100%-32px)] hover:scale-105 hover:bg-[#1e293b] transition-all duration-300 ease-in-out animate-spin font-bold'
    }
];

const ITERATIONS = 10000;

for (const tc of testCases) {
    console.log(`───────────────────────────────────────────────────────────────`);
    console.log(`📊 Test Case: ${tc.name}`);
    console.log(`Input String: "${tc.input}"`);

    const inputBytes = Buffer.byteLength(tc.input, 'utf8');

    // 1. Compile benchmark
    const startCompile = process.hrtime.bigint();
    let compiledBin;
    for (let i = 0; i < ITERATIONS; i++) {
        compiledBin = UniversalCSS.compile(tc.input);
    }
    const endCompile = process.hrtime.bigint();
    const avgCompileNs = Number(endCompile - startCompile) / ITERATIONS;
    const avgCompileMs = avgCompileNs / 1_000_000;

    const outputBytes = compiledBin.length;
    const compressionRatio = ((1 - outputBytes / inputBytes) * 100).toFixed(1);

    // 2. Decompile benchmark
    const startDecompile = process.hrtime.bigint();
    let decompiledCss;
    for (let i = 0; i < ITERATIONS; i++) {
        decompiledCss = UniversalCSS.decompile(compiledBin);
    }
    const endDecompile = process.hrtime.bigint();
    const avgDecompileNs = Number(endDecompile - startDecompile) / ITERATIONS;
    const avgDecompileMs = avgDecompileNs / 1_000_000;

    console.log(`  • Original String Size:     ${inputBytes} Bytes`);
    console.log(`  • Binary Opcode Size:       ${outputBytes} Bytes`);
    console.log(`  • Wire Compression Ratio:   ${compressionRatio}% smaller`);
    console.log(`  • Avg Compile Latency:      ${avgCompileMs.toFixed(4)} ms (${Math.round(avgCompileNs)} ns)`);
    console.log(`  • Avg Decompile Latency:    ${avgDecompileMs.toFixed(4)} ms (${Math.round(avgDecompileNs)} ns)`);
}

console.log(`───────────────────────────────────────────────────────────────\n✅ Benchmark suite completed across ${ITERATIONS} iterations per test case.`);
