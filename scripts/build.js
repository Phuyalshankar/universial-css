'use strict';
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

const engineCode = fs.readFileSync(path.join(__dirname, '../src/TitanUniversalCss100.js'), 'utf8');

// Strip module.exports at the end of engineCode to cleanly encapsulate
const cleanEngineCode = engineCode.replace(/if\s*\(typeof module !== 'undefined'[\s\S]*$/, '');

const standaloneBundle = `/**
 * ⚡ Universal CSS (v1.0.1) — Standalone Runtime Bundle
 * 100% Tailwind CSS compiled to 15KB Binary Opcodes
 * Browser ✅ | Node.js ✅ | React / Vue / Svelte ✅ | Zero Dependencies ✅
 * Author: Shankar Phuyal <https://github.com/Phuyalshankar>
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        var exports = factory();
        root.UniversalCSS = exports.UniversalCSS;
        root.TitanUniversalEngine = exports;
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ─── 1. CORE ENGINE ─────────────────────────────────────────────────────────
${cleanEngineCode}

    // ─── 2. STANDALONE JIT RUNTIME & AUTO-INJECTOR ──────────────────────────────
    class UniversalCSS {
        static compiledClasses = new Set();
        static styleSheet = null;

        static compile(classString) {
            const encoder = new TitanUniversalCss100Encoder();
            encoder.encodeClasses(classString);
            return encoder.toBuffer();
        }

        static decompile(binaryBuffer, selector = '.u-node') {
            return TitanUniversalCss100Decoder.decodeToCSS(binaryBuffer, selector);
        }

        static getStyleSheet() {
            if (typeof document === 'undefined') return null;
            if (!this.styleSheet) {
                let el = document.getElementById('universal-css-runtime');
                if (!el) {
                    el = document.createElement('style');
                    el.id = 'universal-css-runtime';
                    document.head.appendChild(el);
                }
                this.styleSheet = el;
            }
            return this.styleSheet;
        }

        static processClassToken(token) {
            if (!token || typeof token !== 'string') return '';
            const clean = token.trim();
            if (!clean || this.compiledClasses.has(clean)) return '';
            this.compiledClasses.add(clean);

            const esc = clean.replace(/([\\[\\]:#./%])/g, '\\\\$1');
            const bin = this.compile(clean);
            const css = this.decompile(bin, '.' + esc);
            if (css && css.trim()) {
                const sheet = this.getStyleSheet();
                if (sheet) sheet.appendChild(document.createTextNode('\\n' + css.trim()));
                return css;
            }
            return '';
        }

        static scan(root) {
            if (typeof document === 'undefined') return;
            const target = root || document;
            const elements = target.querySelectorAll ? target.querySelectorAll('[class]') : [];
            elements.forEach(el => {
                const cls = el.getAttribute('class');
                if (cls) {
                    const tokens = cls.split(/\\s+/);
                    for (const t of tokens) {
                        if (t) this.processClassToken(t);
                    }
                }
            });
        }

        static autoInject() {
            if (typeof document === 'undefined') return;
            this.scan(document);

            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(mutations => {
                    for (const m of mutations) {
                        if (m.type === 'attributes' && m.attributeName === 'class' && m.target) {
                            const cls = m.target.getAttribute('class');
                            if (cls) {
                                cls.split(/\\s+/).forEach(t => t && this.processClassToken(t));
                            }
                        } else if (m.addedNodes) {
                            m.addedNodes.forEach(node => {
                                if (node.nodeType === 1) {
                                    if (node.getAttribute && node.getAttribute('class')) {
                                        node.getAttribute('class').split(/\\s+/).forEach(t => t && this.processClassToken(t));
                                    }
                                    if (node.querySelectorAll) this.scan(node);
                                }
                            });
                        }
                    }
                });
                const targetNode = document.body || document.documentElement;
                if (targetNode) {
                    observer.observe(targetNode, {
                        childList: true,
                        subtree: true,
                        attributes: true,
                        attributeFilter: ['class']
                    });
                }
            }
        }
    }

    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        window.UniversalCSS = UniversalCSS;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => UniversalCSS.autoInject());
        } else {
            UniversalCSS.autoInject();
        }
    }

    return {
        UniversalCSS,
        compile: (cls) => UniversalCSS.compile(cls),
        decompile: (bin, sel) => UniversalCSS.decompile(bin, sel),
        scan: (root) => UniversalCSS.scan(root),
        autoInject: () => UniversalCSS.autoInject(),
        VERSION,
        MASK,
        OP,
        COLOR_NAMES,
        COLOR_SHADES,
        COLOR_PALETTE,
        FONT_SIZE_MAP,
        FONT_SIZE_REMS,
        remFromUnits,
        TitanUniversalCss100Encoder,
        TitanUniversalCss100Decoder
    };
}));
`;

const bundlePath = path.join(distDir, 'universal-css.js');
fs.writeFileSync(bundlePath, standaloneBundle, 'utf8');

// Basic minification (remove multiline comments, consecutive blank lines)
const minifiedBundle = standaloneBundle
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');

const minBundlePath = path.join(distDir, 'universal-css.min.js');
fs.writeFileSync(minBundlePath, minifiedBundle, 'utf8');

console.log('✅ Universal CSS Standalone Bundles Built:');
console.log('   📦 ' + bundlePath + ' (' + (fs.statSync(bundlePath).size / 1024).toFixed(1) + ' KB)');
console.log('   ⚡ ' + minBundlePath + ' (' + (fs.statSync(minBundlePath).size / 1024).toFixed(1) + ' KB)');
