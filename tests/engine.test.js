/**
 * 🧪 Test Suite for Universal CSS Engine (v1.0.1)
 * Uses standard Node.js test runner (node:test & node:assert)
 */

const test = require('node:test');
const assert = require('node:assert/strict');
const { UniversalCSS } = require('../index');
const { OP, MASK, remFromUnits } = require('../src/TitanUniversalCss100');

test('remFromUnits helper - trailing zero and zero stability', () => {
    assert.equal(remFromUnits(0), '0rem');
    assert.equal(remFromUnits(2), '0.125rem');
    assert.equal(remFromUnits(4), '0.25rem');
    assert.equal(remFromUnits(16), '1rem');
    assert.equal(remFromUnits(100), '6.25rem');
});

test('Encoder: Spacing units encoding', () => {
    // p-0 -> 0, p-0.5 -> 2, p-1 -> 4, p-4 -> 16, p-96 -> 384 (fits in u8 or mod)
    const binP0 = UniversalCSS.compile('p-0');
    assert.equal(binP0[2], OP.P_ALL);
    assert.equal(binP0[3], 0);

    const binP05 = UniversalCSS.compile('p-0.5');
    assert.equal(binP05[2], OP.P_ALL);
    assert.equal(binP05[3], 2);

    const binP1 = UniversalCSS.compile('p-1');
    assert.equal(binP1[2], OP.P_ALL);
    assert.equal(binP1[3], 4);

    const binP4 = UniversalCSS.compile('p-4');
    assert.equal(binP4[2], OP.P_ALL);
    assert.equal(binP4[3], 16);

    const binGap = UniversalCSS.compile('gap-1.5');
    assert.equal(binGap[2], OP.GAP);
    assert.equal(binGap[3], 6);
});

test('Encoder: Named colors & Palette index', () => {
    const bin = UniversalCSS.compile('bg-slate-900 text-sky-400 bg-red-500');
    assert.ok(bin.includes(OP.BG_COLOR_NAMED));
    assert.ok(bin.includes(OP.TEXT_COLOR_NAMED));

    // Verify opacity fallback (/50 goes to RAW_CSS_STRING)
    const binAlpha = UniversalCSS.compile('bg-red-500/50');
    assert.ok(binAlpha.includes(OP.RAW_CSS_STRING));
});

test('Encoder: Font size scale codes', () => {
    const binXs = UniversalCSS.compile('text-xs');
    assert.ok(binXs.includes(OP.FONT_SIZE_SCALE));

    const binXl = UniversalCSS.compile('text-xl');
    assert.ok(binXl.includes(OP.FONT_SIZE_SCALE));

    const bin4xl = UniversalCSS.compile('text-4xl');
    assert.ok(bin4xl.includes(OP.FONT_SIZE_SCALE));
});

test('Encoder: Modifier bitmasks', () => {
    const binHover = UniversalCSS.compile('hover:bg-red-500');
    assert.equal(binHover[1], MASK.STATE_HOVER);

    const binCombo = UniversalCSS.compile('md:hover:flex-row');
    assert.equal(binCombo[1], MASK.BREAK_MD | MASK.STATE_HOVER);

    const binDark = UniversalCSS.compile('dark:text-white');
    assert.equal(binDark[1], MASK.STATE_DARK);
});

test('Encoder: Hex validation and fallback', () => {
    const binValid = UniversalCSS.compile('bg-[#0f172a]');
    assert.ok(binValid.includes(OP.BG_COLOR_RGB));
    assert.ok(binValid.includes(15));
    assert.ok(binValid.includes(23));
    assert.ok(binValid.includes(42));

    const binInvalid = UniversalCSS.compile('bg-[#xyz]');
    assert.ok(binInvalid.includes(OP.RAW_CSS_STRING));
    assert.ok(!binInvalid.includes(OP.BG_COLOR_RGB));
});

test('Encoder: Height arbitrary and pixels (h-[100px])', () => {
    const bin = UniversalCSS.compile('h-[100px]');
    assert.ok(bin.includes(OP.H_PX));
    // Check 100 in UInt16 BE (0x00 0x64)
    assert.ok(bin.includes(0x00));
    assert.ok(bin.includes(0x64));
});

test('Decoder: Round-trip and combinations', () => {
    const binCombo = UniversalCSS.compile('md:hover:bg-red-500');
    const cssCombo = UniversalCSS.decompile(binCombo, '.my-card');
    assert.ok(cssCombo.includes('@media (min-width: 768px)'));
    assert.ok(cssCombo.includes('.my-card:hover { background-color: #ef4444; }'));

    const binDark = UniversalCSS.compile('dark:bg-slate-900');
    const cssDark = UniversalCSS.decompile(binDark, '.my-card');
    assert.ok(cssDark.includes('@media (prefers-color-scheme: dark)'));
    assert.ok(cssDark.includes('.my-card { background-color: #0f172a; }'));
});

test('Decoder: Invalid version throws', () => {
    const invalidBuf = Buffer.from([0x99, OP.END]);
    assert.throws(() => {
        UniversalCSS.decompile(invalidBuf);
    }, /Unsupported protocol version: 0x99/);
});

test('Edge cases: Empty string, duplicates, whitespace', () => {
    const binEmpty = UniversalCSS.compile('');
    // Exactly Version (0x01) + END (0xFF) = 2 bytes
    assert.equal(binEmpty.length, 2);

    const binDuo = UniversalCSS.compile('p-4   p-4\t\t\np-4');
    const cssDuo = UniversalCSS.decompile(binDuo, '.node');
    const occurrences = cssDuo.match(/padding: 1rem/g);
    assert.equal(occurrences.length, 1);
});

test('Benchmark size target: compile complex string <= 12 bytes per token efficiency', () => {
    const bin = UniversalCSS.compile('p-4 bg-slate-900 rounded-xl hover:scale-105');
    // p-4 (3B) + bg-slate-900 (4B) + rounded-xl (2B) + hover:scale-105 (3B) + END (1B) + Version (1B)
    assert.ok(bin.length <= 16, `Actual size was ${bin.length} bytes`);
});
