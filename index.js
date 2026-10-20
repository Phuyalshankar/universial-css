'use strict';

const {
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
} = require('./src/TitanUniversalCss100');

/**
 * Universal CSS Standalone API (v1.0.1)
 * Ultra-compact Binary Tailwind & CSS Engine
 */
class UniversalCSS {
    static compiledClasses = new Set();
    static styleSheet = null;

    /**
     * Compile arbitrary Tailwind / CSS classes to Binary Buffer or Uint8Array
     * @param {string} classString 
     * @returns {Buffer|Uint8Array}
     */
    static compile(classString) {
        const encoder = new TitanUniversalCss100Encoder();
        encoder.encodeClasses(classString);
        return encoder.toBuffer();
    }

    /**
     * Decompile Binary Buffer to standard CSS
     * @param {Buffer|Uint8Array} binaryBuffer 
     * @param {string} selector 
     * @returns {string}
     */
    static decompile(binaryBuffer, selector = '.u-node') {
        return TitanUniversalCss100Decoder.decodeToCSS(binaryBuffer, selector);
    }

    /**
     * Get or create runtime style sheet element
     */
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

    /**
     * Compile a single class token and inject into stylesheet
     * @param {string} token 
     * @returns {string} generated CSS rule
     */
    static processClassToken(token) {
        if (!token || typeof token !== 'string') return '';
        const clean = token.trim();
        if (!clean || this.compiledClasses.has(clean)) return '';
        this.compiledClasses.add(clean);

        const esc = clean.replace(/([\[\]:#./%])/g, '\\$1');
        const bin = this.compile(clean);
        const css = this.decompile(bin, '.' + esc);
        if (css && css.trim()) {
            const sheet = this.getStyleSheet();
            if (sheet) sheet.appendChild(document.createTextNode('\n' + css.trim()));
            return css;
        }
        return '';
    }

    /**
     * Scan DOM root and process all classes
     * @param {Node} root 
     */
    static scan(root) {
        if (typeof document === 'undefined') return;
        const target = root || document;
        const elements = target.querySelectorAll ? target.querySelectorAll('[class]') : [];
        elements.forEach(el => {
            const cls = el.getAttribute('class');
            if (cls) {
                const tokens = cls.split(/\s+/);
                for (const t of tokens) {
                    if (t) this.processClassToken(t);
                }
            }
        });
    }

    /**
     * Auto-inject helper for Browsers (Reads document, compiles on the fly, observes changes)
     */
    static autoInject() {
        if (typeof document === 'undefined') return;
        this.scan(document);

        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(mutations => {
                for (const m of mutations) {
                    if (m.type === 'attributes' && m.attributeName === 'class' && m.target) {
                        const cls = m.target.getAttribute('class');
                        if (cls) {
                            cls.split(/\s+/).forEach(t => t && this.processClassToken(t));
                        }
                    } else if (m.addedNodes) {
                        m.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.getAttribute && node.getAttribute('class')) {
                                    node.getAttribute('class').split(/\s+/).forEach(t => t && this.processClassToken(t));
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

// Auto-run if running directly in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.UniversalCSS = UniversalCSS;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => UniversalCSS.autoInject());
    } else {
        UniversalCSS.autoInject();
    }
}

module.exports = {
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
