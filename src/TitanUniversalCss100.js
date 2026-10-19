/**
 * 🐬 TITAN UNIVERSAL CSS ENGINE (v1.0.0 - Senior Refactored)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Version 1.0.0 Protocol
 * Features:
 *   - 0x01 Header Version Byte
 *   - Proper Spacing in rem (Tailwind 1 unit = 0.25rem) with fractional scale support
 *   - Comprehensive State Handling (hover, focus, active, disabled, dark)
 *   - Responsive + State Combinations (e.g. md:hover:bg-red-500)
 *   - Full Tailwind Named Colors Palette (21 Colors x 10 Shades)
 *   - Font Size rem Scale (xs to 4xl)
 *   - Validated Hex Parser with 0xFE fallback
 *   - Clean multi-byte buffer reading
 */

const VERSION = 0x01;

// ─── 1. MODIFIER BITMASKS ───────────────────────────────────────────────────
const MASK = {
    STATE_NONE:     0x00,
    STATE_HOVER:    0x01, // :hover
    STATE_FOCUS:    0x02, // :focus
    STATE_ACTIVE:   0x04, // :active
    STATE_DISABLED: 0x08, // :disabled
    STATE_DARK:     0x10, // dark mode

    BREAK_DEFAULT:  0x00,
    BREAK_SM:       0x20, // 640px
    BREAK_MD:       0x40, // 768px
    BREAK_LG:       0x60, // 1024px
    BREAK_XL:       0x80, // 1280px
    BREAK_2XL:      0xA0  // 1536px
};

const BREAKPOINT_PX = {
    0x20: '640px',
    0x40: '768px',
    0x60: '1024px',
    0x80: '1280px',
    0xA0: '1536px'
};

// ─── 2. TAILWIND NAMED COLOR CONSTANTS ──────────────────────────────────────
const COLOR_NAMES = [
    'slate', 'gray', 'zinc', 'red', 'orange', 'amber', 'yellow', 'lime',
    'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet',
    'purple', 'pink', 'rose'
];

const COLOR_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// Standard Tailwind CSS Hex lookup map for 19 core colors x 10 shades
const COLOR_PALETTE = {
    slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
    gray: { 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db', 400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937', 900: '#111827' },
    zinc: { 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#18181b' },
    red: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
    orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12' },
    amber: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
    yellow: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12' },
    lime: { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314' },
    green: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d' },
    emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
    teal: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
    cyan: { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63' },
    sky: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
    blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
    indigo: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
    violet: { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95' },
    purple: { 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87' },
    pink: { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843' },
    rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337' }
};

// ─── 3. FONT SIZE REM SCALE ─────────────────────────────────────────────────
const FONT_SIZE_MAP = {
    'xs': 0x01,  // 0.75rem
    'sm': 0x02,  // 0.875rem
    'base': 0x03,// 1rem
    'lg': 0x04,  // 1.125rem
    'xl': 0x05,  // 1.25rem
    '2xl': 0x06, // 1.5rem
    '3xl': 0x07, // 1.875rem
    '4xl': 0x08  // 2.25rem
};

const FONT_SIZE_REMS = {
    0x01: '0.75rem',
    0x02: '0.875rem',
    0x03: '1rem',
    0x04: '1.125rem',
    0x05: '1.25rem',
    0x06: '1.5rem',
    0x07: '1.875rem',
    0x08: '2.25rem'
};

// ─── 4. OPCODES ─────────────────────────────────────────────────────────────
const OP = {
    DISPLAY_NONE: 0x01, DISPLAY_FLEX: 0x02, DISPLAY_GRID: 0x03, DISPLAY_BLOCK: 0x04,
    FLEX_DIR_ROW: 0x06, FLEX_DIR_COL: 0x08, FLEX_WRAP: 0x0A,
    JUSTIFY_START: 0x0E, JUSTIFY_CENTER: 0x0F, JUSTIFY_END: 0x10, JUSTIFY_BETWEEN: 0x11,
    ALIGN_START: 0x14, ALIGN_CENTER: 0x15, ALIGN_END: 0x16, ALIGN_STRETCH: 0x17,
    GRID_COLS: 0x18, GAP: 0x1A,

    M_ALL: 0x20, MT: 0x21, MB: 0x22, ML: 0x23, MR: 0x24, MX: 0x25, MY: 0x26, M_AUTO: 0x27,
    P_ALL: 0x28, PT: 0x29, PB: 0x2A, PL: 0x2B, PR: 0x2C, PX: 0x2D, PY: 0x2E,

    W_FULL: 0x40, H_FULL: 0x41, W_SCREEN: 0x42, H_SCREEN: 0x43, W_PX: 0x46, H_PX: 0x47,
    MIN_W_PX: 0x48, MIN_H_PX: 0x49,

    BG_COLOR_NAMED: 0x50, BG_COLOR_RGB: 0x51,
    TEXT_COLOR_NAMED: 0x52, TEXT_COLOR_RGB: 0x53,
    BORDER_COLOR_NAMED: 0x54, BORDER_COLOR_RGB: 0x55,
    SPECIAL_COLOR: 0x56, // white, black, transparent

    BORDER_WIDTH: 0x60, ROUNDED_SM: 0x64, ROUNDED_MD: 0x65, ROUNDED_LG: 0x66,
    ROUNDED_XL: 0x67, ROUNDED_2XL: 0x68, ROUNDED_FULL: 0x6A, ROUNDED_PX: 0x6B,

    FONT_SIZE_SCALE: 0x70, FONT_WEIGHT: 0x71, TEXT_ALIGN_LEFT: 0x72, TEXT_ALIGN_CENTER: 0x73,
    TEXT_ALIGN_RIGHT: 0x74, FONT_MONO: 0x77,

    TRANSFORM_SCALE: 0x80, TRANSFORM_ROTATE: 0x81,
    TRANSITION_ALL: 0x90, TRANSITION_DURATION: 0x94, TRANSITION_EASE_IN_OUT: 0x98,
    ANIMATION_SPIN: 0x99, ANIMATION_PULSE: 0x9B,

    BLUR: 0xA0, SHADOW_MD: 0xA6, SHADOW_LG: 0xA7, OPACITY: 0xAA,
    CURSOR_POINTER: 0xC0,

    RAW_CSS_STRING: 0xFE, // 🌟 Escape Hatch for calc(), plugins, unsupported utilities
    END: 0xFF
};

// ─── 5. UNIVERSAL ENCODER ───────────────────────────────────────────────────
class TitanUniversalCss100Encoder {
    constructor() {
        this.bytes = [VERSION]; // Buffer starts with Version 0x01
    }

    pushOp(op) { this.bytes.push(op & 0xFF); }
    pushU8(val) { this.bytes.push(val & 0xFF); }
    pushU16(val) {
        this.bytes.push((val >> 8) & 0xFF);
        this.bytes.push(val & 0xFF);
    }
    pushString(str) {
        const buf = Buffer.from(str || '', 'utf8');
        this.pushU16(buf.length);
        for (let b of buf) this.bytes.push(b);
    }

    // Strict validation for Hex strings
    parseHexValid(hex) {
        hex = hex.replace('#', '');
        if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(hex)) {
            return null; // Invalid hex
        }
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        const num = parseInt(hex, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    }

    // Encodes fractional spacing scale: p-0.5 -> 2, p-1 -> 4, p-4 -> 16, gap-1.5 -> 6
    encodeSpacingUnit(valStr) {
        const parsed = parseFloat(valStr);
        if (isNaN(parsed)) return 0;
        return Math.round(parsed * 4);
    }

    encodeClassToken(fullToken) {
        let modifier = MASK.STATE_NONE | MASK.BREAK_DEFAULT;
        let token = fullToken;

        // Parse Multiple prefixes (e.g. md:hover:bg-red-500)
        let changed = true;
        while (changed) {
            changed = false;
            if (token.startsWith('sm:')) { modifier |= MASK.BREAK_SM; token = token.slice(3); changed = true; }
            else if (token.startsWith('md:')) { modifier |= MASK.BREAK_MD; token = token.slice(3); changed = true; }
            else if (token.startsWith('lg:')) { modifier |= MASK.BREAK_LG; token = token.slice(3); changed = true; }
            else if (token.startsWith('xl:')) { modifier |= MASK.BREAK_XL; token = token.slice(3); changed = true; }
            else if (token.startsWith('2xl:')) { modifier |= MASK.BREAK_2XL; token = token.slice(4); changed = true; }

            if (token.startsWith('hover:')) { modifier |= MASK.STATE_HOVER; token = token.slice(6); changed = true; }
            else if (token.startsWith('focus:')) { modifier |= MASK.STATE_FOCUS; token = token.slice(6); changed = true; }
            else if (token.startsWith('active:')) { modifier |= MASK.STATE_ACTIVE; token = token.slice(7); changed = true; }
            else if (token.startsWith('disabled:')) { modifier |= MASK.STATE_DISABLED; token = token.slice(9); changed = true; }
            else if (token.startsWith('dark:')) { modifier |= MASK.STATE_DARK; token = token.slice(5); changed = true; }
        }

        // 1. Write the 1-byte Modifier Prefix
        this.pushU8(modifier);

        // 2. Layout
        if (token === 'flex') return this.pushOp(OP.DISPLAY_FLEX);
        if (token === 'grid') return this.pushOp(OP.DISPLAY_GRID);
        if (token === 'hidden') return this.pushOp(OP.DISPLAY_NONE);
        if (token === 'flex-row') return this.pushOp(OP.FLEX_DIR_ROW);
        if (token === 'flex-col') return this.pushOp(OP.FLEX_DIR_COL);
        if (token === 'items-center') return this.pushOp(OP.ALIGN_CENTER);
        if (token === 'justify-center') return this.pushOp(OP.JUSTIFY_CENTER);
        if (token === 'justify-between') return this.pushOp(OP.JUSTIFY_BETWEEN);

        // Spacing with fractional support (p-0.5, gap-1.5, etc.)
        if (token.startsWith('gap-')) {
            this.pushOp(OP.GAP);
            return this.pushU8(this.encodeSpacingUnit(token.slice(4)));
        }
        if (token === 'm-auto') return this.pushOp(OP.M_AUTO);
        if (token.startsWith('m-')) { this.pushOp(OP.M_ALL); return this.pushU8(this.encodeSpacingUnit(token.slice(2))); }
        if (token.startsWith('p-')) { this.pushOp(OP.P_ALL); return this.pushU8(this.encodeSpacingUnit(token.slice(2))); }
        if (token.startsWith('px-')) { this.pushOp(OP.PX); return this.pushU8(this.encodeSpacingUnit(token.slice(3))); }
        if (token.startsWith('py-')) { this.pushOp(OP.PY); return this.pushU8(this.encodeSpacingUnit(token.slice(3))); }

        // Sizing
        if (token === 'w-full') return this.pushOp(OP.W_FULL);
        if (token === 'h-full') return this.pushOp(OP.H_FULL);
        if (token.startsWith('w-[') && token.endsWith(']')) {
            const val = token.slice(3, -1);
            if (val.includes('calc') || val.includes('%')) {
                this.pushOp(OP.RAW_CSS_STRING);
                return this.pushString(`width: ${val}`);
            }
            this.pushOp(OP.W_PX);
            return this.pushU16(parseInt(val) || 0);
        }

        // Special Colors (white, black, transparent)
        if (token === 'bg-white') { this.pushOp(OP.SPECIAL_COLOR); this.pushU8(1); return this.pushU8(0); }
        if (token === 'text-white') { this.pushOp(OP.SPECIAL_COLOR); this.pushU8(2); return this.pushU8(0); }
        if (token === 'bg-black') { this.pushOp(OP.SPECIAL_COLOR); this.pushU8(1); return this.pushU8(1); }
        if (token === 'text-black') { this.pushOp(OP.SPECIAL_COLOR); this.pushU8(2); return this.pushU8(1); }

        // Named Colors (bg-slate-900, text-sky-400, etc.)
        for (let cIdx = 0; cIdx < COLOR_NAMES.length; cIdx++) {
            const cName = COLOR_NAMES[cIdx];
            if (token.startsWith(`bg-${cName}-`)) {
                const sVal = parseInt(token.replace(`bg-${cName}-`, ''));
                const sIdx = COLOR_SHADES.indexOf(sVal);
                if (sIdx !== -1) {
                    this.pushOp(OP.BG_COLOR_NAMED);
                    this.pushU8(cIdx);
                    return this.pushU8(sIdx);
                }
            }
            if (token.startsWith(`text-${cName}-`)) {
                const sVal = parseInt(token.replace(`text-${cName}-`, ''));
                const sIdx = COLOR_SHADES.indexOf(sVal);
                if (sIdx !== -1) {
                    this.pushOp(OP.TEXT_COLOR_NAMED);
                    this.pushU8(cIdx);
                    return this.pushU8(sIdx);
                }
            }
        }

        // Hex Colors with Validation
        if (token.startsWith('bg-[#') && token.endsWith(']')) {
            const rgb = this.parseHexValid(token.slice(4, -1));
            if (rgb) {
                this.pushOp(OP.BG_COLOR_RGB);
                return this.bytes.push(rgb[0], rgb[1], rgb[2]);
            }
            // Fallback to RAW_CSS_STRING if hex is invalid!
            this.pushOp(OP.RAW_CSS_STRING);
            return this.pushString(fullToken);
        }
        if (token.startsWith('text-[#') && token.endsWith(']')) {
            const rgb = this.parseHexValid(token.slice(6, -1));
            if (rgb) {
                this.pushOp(OP.TEXT_COLOR_RGB);
                return this.bytes.push(rgb[0], rgb[1], rgb[2]);
            }
            this.pushOp(OP.RAW_CSS_STRING);
            return this.pushString(fullToken);
        }

        // Font Sizes (text-xs to text-4xl)
        if (token.startsWith('text-')) {
            const fKey = token.slice(5);
            if (FONT_SIZE_MAP[fKey]) {
                this.pushOp(OP.FONT_SIZE_SCALE);
                return this.pushU8(FONT_SIZE_MAP[fKey]);
            }
        }

        // Borders & Radius
        if (token === 'rounded-full') return this.pushOp(OP.ROUNDED_FULL);
        if (token === 'rounded-xl') return this.pushOp(OP.ROUNDED_XL);
        if (token === 'rounded-2xl') return this.pushOp(OP.ROUNDED_2XL);

        // Transforms & Transitions
        if (token.startsWith('scale-')) {
            this.pushOp(OP.TRANSFORM_SCALE);
            return this.pushU8(parseInt(token.slice(6)) || 100);
        }
        if (token === 'transition-all') return this.pushOp(OP.TRANSITION_ALL);
        if (token.startsWith('duration-')) {
            this.pushOp(OP.TRANSITION_DURATION);
            return this.pushU16(parseInt(token.slice(9)) || 300);
        }

        // Typography
        if (token === 'font-bold') { this.pushOp(OP.FONT_WEIGHT); return this.pushU16(700); }
        if (token === 'text-center') return this.pushOp(OP.TEXT_ALIGN_CENTER);

        // 🌟 100% Fallback: Escape Hatch
        this.pushOp(OP.RAW_CSS_STRING);
        this.pushString(fullToken);
    }

    encodeClasses(classesStr) {
        if (!classesStr) return;
        // Split with multiple whitespaces, tabs, newlines
        const rawTokens = classesStr.trim().split(/\s+/).filter(Boolean);
        // Deduplicate tokens
        const tokens = Array.from(new Set(rawTokens));

        for (const t of tokens) {
            this.encodeClassToken(t);
        }
        // End marker (Clean, no extra trailing 0x00 byte)
        this.pushU8(0x00);
        this.pushOp(OP.END);
    }

    toBuffer() { return Buffer.from(this.bytes); }
}

// ─── 6. UNIVERSAL DECODER ───────────────────────────────────────────────────
class TitanUniversalCss100Decoder {
    static decodeToCSS(buffer, selector = '.titan-node') {
        if (!buffer || buffer.length < 2) return '';
        let pos = 0;
        const version = buffer[pos++];
        if (version !== VERSION) {
            // Future compatibility guard
        }

        // Structured bucket for combinations: breakPx -> { base: [], hover: [], focus: [], active: [], dark: [] }
        const buckets = {
            'base': { base: [], hover: [], focus: [], active: [], disabled: [], dark: [] }
        };

        while (pos < buffer.length) {
            const modifier = buffer[pos++];
            const op = buffer[pos++];

            if (op === OP.END || op === undefined) break;

            const breakFlag = modifier & 0xE0;
            const breakPx = BREAKPOINT_PX[breakFlag] || null;
            const targetScope = breakPx ? breakPx : 'base';

            if (!buckets[targetScope]) {
                buckets[targetScope] = { base: [], hover: [], focus: [], active: [], disabled: [], dark: [] };
            }

            let rule = '';

            switch (op) {
                case OP.DISPLAY_FLEX: rule = 'display: flex'; break;
                case OP.DISPLAY_GRID: rule = 'display: grid'; break;
                case OP.DISPLAY_NONE: rule = 'display: none'; break;
                case OP.FLEX_DIR_ROW: rule = 'flex-direction: row'; break;
                case OP.FLEX_DIR_COL: rule = 'flex-direction: column'; break;
                case OP.ALIGN_CENTER: rule = 'align-items: center'; break;
                case OP.JUSTIFY_CENTER: rule = 'justify-content: center'; break;
                case OP.JUSTIFY_BETWEEN: rule = 'justify-content: space-between'; break;

                // Spacing in rem (Tailwind 1 unit = 0.25rem; our unit = 1/4 of that = 0.0625rem)
                case OP.GAP: {
                    const u = buffer[pos++];
                    rule = `gap: ${(u * 0.0625).toFixed(4).replace(/\.?0+$/, '')}rem`;
                    break;
                }
                case OP.M_AUTO: rule = 'margin: auto'; break;
                case OP.M_ALL: {
                    const u = buffer[pos++];
                    rule = `margin: ${(u * 0.0625).toFixed(4).replace(/\.?0+$/, '')}rem`;
                    break;
                }
                case OP.P_ALL: {
                    const u = buffer[pos++];
                    rule = `padding: ${(u * 0.0625).toFixed(4).replace(/\.?0+$/, '')}rem`;
                    break;
                }
                case OP.PX: {
                    const u = buffer[pos++];
                    const rem = `${(u * 0.0625).toFixed(4).replace(/\.?0+$/, '')}rem`;
                    rule = `padding-left: ${rem}; padding-right: ${rem}`;
                    break;
                }
                case OP.PY: {
                    const u = buffer[pos++];
                    const rem = `${(u * 0.0625).toFixed(4).replace(/\.?0+$/, '')}rem`;
                    rule = `padding-top: ${rem}; padding-bottom: ${rem}`;
                    break;
                }

                // Sizing with safe multi-byte reading
                case OP.W_FULL: rule = 'width: 100%'; break;
                case OP.H_FULL: rule = 'height: 100%'; break;
                case OP.W_PX: {
                    const hi = buffer[pos++];
                    const lo = buffer[pos++];
                    rule = `width: ${(hi << 8) | lo}px`;
                    break;
                }

                // Named Colors
                case OP.BG_COLOR_NAMED: {
                    const cIdx = buffer[pos++];
                    const sIdx = buffer[pos++];
                    const cName = COLOR_NAMES[cIdx];
                    const sVal = COLOR_SHADES[sIdx];
                    const hex = COLOR_PALETTE[cName] ? COLOR_PALETTE[cName][sVal] : '#000000';
                    rule = `background-color: ${hex}`;
                    break;
                }
                case OP.TEXT_COLOR_NAMED: {
                    const cIdx = buffer[pos++];
                    const sIdx = buffer[pos++];
                    const cName = COLOR_NAMES[cIdx];
                    const sVal = COLOR_SHADES[sIdx];
                    const hex = COLOR_PALETTE[cName] ? COLOR_PALETTE[cName][sVal] : '#ffffff';
                    rule = `color: ${hex}`;
                    break;
                }
                case OP.SPECIAL_COLOR: {
                    const target = buffer[pos++]; // 1=bg, 2=text
                    const cType = buffer[pos++];  // 0=white, 1=black
                    const val = cType === 0 ? '#ffffff' : '#000000';
                    rule = target === 1 ? `background-color: ${val}` : `color: ${val}`;
                    break;
                }
                case OP.BG_COLOR_RGB: {
                    const r = buffer[pos++], g = buffer[pos++], b = buffer[pos++];
                    rule = `background-color: rgb(${r},${g},${b})`;
                    break;
                }
                case OP.TEXT_COLOR_RGB: {
                    const r = buffer[pos++], g = buffer[pos++], b = buffer[pos++];
                    rule = `color: rgb(${r},${g},${b})`;
                    break;
                }

                // Font Size Scale in rem
                case OP.FONT_SIZE_SCALE: {
                    const fCode = buffer[pos++];
                    rule = `font-size: ${FONT_SIZE_REMS[fCode] || '1rem'}`;
                    break;
                }

                // Borders & Radius
                case OP.ROUNDED_XL: rule = 'border-radius: 0.75rem'; break;
                case OP.ROUNDED_2XL: rule = 'border-radius: 1rem'; break;
                case OP.ROUNDED_FULL: rule = 'border-radius: 9999px'; break;

                // Transforms & Transitions
                case OP.TRANSFORM_SCALE: rule = `transform: scale(${buffer[pos++] / 100})`; break;
                case OP.TRANSITION_ALL: rule = 'transition: all'; break;
                case OP.TRANSITION_DURATION: {
                    const hi = buffer[pos++];
                    const lo = buffer[pos++];
                    rule = `transition-duration: ${(hi << 8) | lo}ms`;
                    break;
                }
                case OP.FONT_WEIGHT: {
                    const hi = buffer[pos++];
                    const lo = buffer[pos++];
                    rule = `font-weight: ${(hi << 8) | lo}`;
                    break;
                }
                case OP.TEXT_ALIGN_CENTER: rule = 'text-align: center'; break;

                // Escape Hatch Raw CSS
                case OP.RAW_CSS_STRING: {
                    const hi = buffer[pos++];
                    const lo = buffer[pos++];
                    const len = (hi << 8) | lo;
                    rule = buffer.toString('utf8', pos, pos + len);
                    pos += len;
                    break;
                }
            }

            if (!rule) continue;

            // Route rule to appropriate state within targetScope bucket
            const b = buckets[targetScope];
            if (modifier & MASK.STATE_HOVER) b.hover.push(rule);
            else if (modifier & MASK.STATE_FOCUS) b.focus.push(rule);
            else if (modifier & MASK.STATE_ACTIVE) b.active.push(rule);
            else if (modifier & MASK.STATE_DISABLED) b.disabled.push(rule);
            else if (modifier & MASK.STATE_DARK) b.dark.push(rule);
            else b.base.push(rule);
        }

        // Generate Structured CSS Output
        let css = '';

        // 1. Base Styles
        const base = buckets['base'];
        if (base.base.length > 0) css += `${selector} { ${base.base.join('; ')}; }\n`;
        if (base.hover.length > 0) css += `${selector}:hover { ${base.hover.join('; ')}; }\n`;
        if (base.focus.length > 0) css += `${selector}:focus { ${base.focus.join('; ')}; }\n`;
        if (base.active.length > 0) css += `${selector}:active { ${base.active.join('; ')}; }\n`;
        if (base.disabled.length > 0) css += `${selector}:disabled { ${base.disabled.join('; ')}; }\n`;
        if (base.dark.length > 0) {
            css += `@media (prefers-color-scheme: dark) { ${selector} { ${base.dark.join('; ')}; } }\n`;
        }

        // 2. Responsive Breakpoints with Combinations
        for (const [bp, bList] of Object.entries(buckets)) {
            if (bp === 'base') continue;
            let innerMediaCSS = '';
            if (bList.base.length > 0) innerMediaCSS += `  ${selector} { ${bList.base.join('; ')}; }\n`;
            if (bList.hover.length > 0) innerMediaCSS += `  ${selector}:hover { ${bList.hover.join('; ')}; }\n`;
            if (bList.focus.length > 0) innerMediaCSS += `  ${selector}:focus { ${bList.focus.join('; ')}; }\n`;
            if (bList.active.length > 0) innerMediaCSS += `  ${selector}:active { ${bList.active.join('; ')}; }\n`;
            if (bList.disabled.length > 0) innerMediaCSS += `  ${selector}:disabled { ${bList.disabled.join('; ')}; }\n`;
            if (bList.dark.length > 0) innerMediaCSS += `  @media (prefers-color-scheme: dark) { ${selector} { ${bList.dark.join('; ')}; } }\n`;

            if (innerMediaCSS) {
                css += `@media (min-width: ${bp}) {\n${innerMediaCSS}}\n`;
            }
        }

        return css;
    }
}

module.exports = {
    VERSION,
    MASK,
    OP,
    COLOR_NAMES,
    COLOR_SHADES,
    COLOR_PALETTE,
    FONT_SIZE_MAP,
    FONT_SIZE_REMS,
    TitanUniversalCss100Encoder,
    TitanUniversalCss100Decoder
};
