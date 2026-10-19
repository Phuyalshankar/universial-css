/**
 * 🧪 Test Suite for Universal CSS Engine (tests/engine.test.js)
 * Covers:
 *   1. p-0.5, p-1, p-4, gap-1.5 spacing in rem
 *   2. hover:bg-slate-900 output
 *   3. dark:text-white output
 *   4. md:hover:flex-row combination output
 *   5. text-xl, bg-sky-400 font size & named color
 *   6. invalid hex fallback (bg-[#xyz])
 *   7. empty string, duplicate class, tab whitespace
 */

const assert = require('assert');
const { UniversalCSS } = require('../index');

console.log('🧪 Running comprehensive test suite (tests/engine.test.js)...\n');

// ─── Test 1: Spacing Correctness (rem + fractional scale) ───────────────────
console.log('• Testing Test 1: Spacing in rem (p-0.5, p-1, p-4, gap-1.5)...');
{
    const bin = UniversalCSS.compile('p-0.5 p-1 p-4 gap-1.5');
    const css = UniversalCSS.decompile(bin, '.test-spacing');
    
    assert(css.includes('padding: 0.125rem'), `Expected 0.125rem for p-0.5, got: ${css}`);
    assert(css.includes('padding: 0.25rem'), `Expected 0.25rem for p-1, got: ${css}`);
    assert(css.includes('padding: 1rem'), `Expected 1rem for p-4, got: ${css}`);
    assert(css.includes('gap: 0.375rem'), `Expected 0.375rem for gap-1.5, got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 2: Hover Output ───────────────────────────────────────────────────
console.log('• Testing Test 2: hover:bg-slate-900...');
{
    const bin = UniversalCSS.compile('hover:bg-slate-900');
    const css = UniversalCSS.decompile(bin, '.test-hover');

    assert(css.includes('.test-hover:hover'), `Expected .test-hover:hover, got: ${css}`);
    assert(css.includes('background-color: #0f172a'), `Expected #0f172a for slate-900, got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 3: Dark Mode Output ───────────────────────────────────────────────
console.log('• Testing Test 3: dark:text-white...');
{
    const bin = UniversalCSS.compile('dark:text-white');
    const css = UniversalCSS.decompile(bin, '.test-dark');

    assert(css.includes('@media (prefers-color-scheme: dark)'), `Expected dark media query, got: ${css}`);
    assert(css.includes('color: #ffffff'), `Expected #ffffff for text-white, got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 4: Breakpoint + State Combination (md:hover:flex-row) ─────────────
console.log('• Testing Test 4: md:hover:flex-row combination...');
{
    const bin = UniversalCSS.compile('md:hover:flex-row');
    const css = UniversalCSS.decompile(bin, '.test-combo');

    assert(css.includes('@media (min-width: 768px)'), `Expected min-width 768px, got: ${css}`);
    assert(css.includes('.test-combo:hover { flex-direction: row; }'), `Expected nested hover within media query, got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 5: Font Size rem & Named Color (text-xl, bg-sky-400) ──────────────
console.log('• Testing Test 5: text-xl, bg-sky-400...');
{
    const bin = UniversalCSS.compile('text-xl bg-sky-400');
    const css = UniversalCSS.decompile(bin, '.test-font-color');

    assert(css.includes('font-size: 1.25rem'), `Expected 1.25rem for text-xl, got: ${css}`);
    assert(css.includes('background-color: #38bdf8'), `Expected #38bdf8 for sky-400, got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 6: Invalid Hex Fallback ───────────────────────────────────────────
console.log('• Testing Test 6: Invalid hex fallback (bg-[#xyz])...');
{
    const bin = UniversalCSS.compile('bg-[#xyz]');
    const css = UniversalCSS.decompile(bin, '.test-invalid-hex');

    assert(css.includes('bg-[#xyz]'), `Expected fallback raw string bg-[#xyz], got: ${css}`);
    console.log('  ✅ Passed!');
}

// ─── Test 7: Empty String, Duplicate Classes, Tab Whitespace ────────────────
console.log('• Testing Test 7: Edge cases (empty string, duplicates, tabs)...');
{
    const binEmpty = UniversalCSS.compile('');
    assert(binEmpty.length >= 1, 'Empty string should yield at least version byte');

    const binTabs = UniversalCSS.compile("\t\tflex   \n  flex   p-4\tp-4  ");
    const cssTabs = UniversalCSS.decompile(binTabs, '.test-edge');

    // Count occurrences of 'display: flex'
    const matches = cssTabs.match(/display: flex/g);
    assert(matches && matches.length === 1, `Expected deduplicated flex, got count: ${matches ? matches.length : 0}`);
    assert(cssTabs.includes('padding: 1rem'), `Expected 1rem padding, got: ${cssTabs}`);
    console.log('  ✅ Passed!');
}

console.log('\n🎉 ALL 7 TEST SUITES PASSED CLEANLY (100% SUCCESS)!');
