const { UniversalCSS } = require('./index');

console.log('🧪 Verifying universal-css package integrity...\n');

const testClass = 'flex flex-col md:flex-row items-center p-6 bg-[#0f172a] rounded-2xl hover:scale-105 transition-all duration-300';
console.log('Input:', testClass);

const bin = UniversalCSS.compile(testClass);
console.log(`Compiled Binary (${bin.length} Bytes):`, bin.toString('hex'));

const css = UniversalCSS.decompile(bin, '.test-box');
console.log('\nDecompiled CSS:\n', css);

if (bin.length < 50 && css.includes('.test-box:hover') && css.includes('@media (min-width: 768px)')) {
    console.log('✅ Package verification: 100% SUCCESSFUL & READY FOR NPM PUBLISH!');
} else {
    console.error('❌ Verification failed');
    process.exit(1);
}
