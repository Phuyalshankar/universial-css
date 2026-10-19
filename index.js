const {
    MASK,
    OP,
    TitanUniversalCss100Encoder,
    TitanUniversalCss100Decoder
} = require('./src/TitanUniversalCss100');

/**
 * Universal CSS API
 */
class UniversalCSS {
    /**
     * Compile arbitrary Tailwind / CSS classes to Binary Buffer
     * @param {string} classString 
     * @returns {Buffer}
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
     * Auto-inject helper for Browsers (Reads document and compiles on the fly)
     */
    static autoInject() {
        if (typeof document === 'undefined') return;
        const elements = document.querySelectorAll('[class]');
        let combinedCSS = '';

        elements.forEach((el, index) => {
            const cls = el.getAttribute('class');
            if (!cls) return;
            const uid = `ucss-${index}`;
            el.classList.add(uid);
            const bin = this.compile(cls);
            combinedCSS += this.decompile(bin, `.${uid}`);
        });

        const styleEl = document.createElement('style');
        styleEl.id = 'universal-css-runtime';
        styleEl.textContent = combinedCSS;
        document.head.appendChild(styleEl);
    }
}

// Auto-run if running directly in a browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    window.UniversalCSS = UniversalCSS;
    document.addEventListener('DOMContentLoaded', () => {
        UniversalCSS.autoInject();
    });
}

module.exports = {
    UniversalCSS,
    compile: UniversalCSS.compile,
    decompile: UniversalCSS.decompile,
    MASK,
    OP
};
