# 📜 Universal CSS Binary Protocol Specification (v1.0.0)

This document formalizes the **Universal CSS Binary Representation (UB)** for encoding Tailwind and modern CSS utilities into ultra-compact, zero-copy binary streams.

---

## 1. Stream & Packet Architecture

Universal CSS byte streams operate in **Big-Endian (Network Byte Order)**. Every stream contains sequential property descriptors terminated by an `END (0xFF)` marker.

### Property Descriptor Format

Each styled utility token is encoded as a variable-length binary sequence:

```
┌─────────────────┬─────────────────┬──────────────────────────────────────────┐
│ Modifier (1B)   │ Opcode (1B)     │ Value / Payload (0 to N Bytes)           │
│ [State | Break] │ [Property ID]   │ [Immediate UInt8, UInt16, RGB, or String]│
└─────────────────┴─────────────────┴──────────────────────────────────────────┘
```

---

## 2. Modifier Byte Bitmask (Offset 0)

A single byte carries both the responsive media query breakpoint and pseudo-state flags.

```
Bit:   7   6   5   4   3   2   1   0
     ┌───┬───┬───┬───┬───┬───┬───┬───┐
     │  Breakpoint  │ D │ S │ A │ F │ H │
     └──────────────┴───┴───┴───┴───┴───┘
```

### Breakpoint Flags (Bits 7–5)
| Value | Flag | Minimum Viewport Width |
|---|---|---|
| `0x00` | `DEFAULT` | Base (all screens) |
| `0x20` | `BREAK_SM` | `@media (min-width: 640px)` |
| `0x40` | `BREAK_MD` | `@media (min-width: 768px)` |
| `0x60` | `BREAK_LG` | `@media (min-width: 1024px)` |
| `0x80` | `BREAK_XL` | `@media (min-width: 1280px)` |
| `0xA0` | `BREAK_2XL`| `@media (min-width: 1536px)` |

### State Flags (Bits 4–0)
| Bit | Flag | CSS Equivalent |
|---|---|---|
| Bit 0 (`0x01`) | `STATE_HOVER` | `:hover` |
| Bit 1 (`0x02`) | `STATE_FOCUS` | `:focus` |
| Bit 2 (`0x04`) | `STATE_ACTIVE` | `:active` |
| Bit 3 (`0x08`) | `STATE_DISABLED` | `:disabled` |
| Bit 4 (`0x10`) | `STATE_DARK` | `.dark &` or `@media (prefers-color-scheme: dark)` |

---

## 3. Opcode Range Allocation Map

| Range | Subsystem | Description |
|---|---|---|
| `0x01 – 0x1F` | **Display & Layout** | Flexbox, CSS Grid, Display modes, Alignment, Justification |
| `0x20 – 0x3F` | **Spacing** | Margins (`m-*`), Paddings (`p-*`), Space-between |
| `0x40 – 0x4F` | **Sizing** | Width, Height, Min/Max (Pixels, %, Screen, Auto) |
| `0x50 – 0x5F` | **Colors & Backgrounds**| RGB 24-bit, ARGB 32-bit, Gradients |
| `0x60 – 0x6F` | **Borders & Corners** | Border widths, styles, radii (`rounded-*`) |
| `0x70 – 0x7F` | **Typography** | Font size (px), Weight (100–900), Text alignment, Font family |
| `0x80 – 0x8F` | **Transforms** | Scale percentage, Rotation degrees, Translation px |
| `0x90 – 0x9F` | **Transitions & Keyframes**| Transition properties, Duration (ms), Timing functions, Spin/Pulse |
| `0xA0 – 0xAF` | **Filters & Visuals** | Blur px, Shadows (sm to 2xl), Opacity (0–100) |
| `0xB0 – 0xBF` | **Positioning** | Absolute, Relative, Fixed, Sticky, Inset offsets, Z-Index |
| `0xC0 – 0xCF` | **Interactivity** | Cursors, User-select, Pointer-events, Overflow |
| `0xFE` | **Raw Escape Hatch** | Length-prefixed string (2B Length + UTF-8 bytes) for custom `calc()` or plugins |
| `0xFF` | **Stream End** | Stream terminator |

---

## 4. Default Theme Scale vs. Custom Configs

Universal CSS assumes the **Tailwind Default Theme Scale** for immediate math:
- Spacing factor: `1 unit = 4px` (`0.25rem`). Example: `p-6` -> Value `6` -> `6 * 4px = 24px` (`1.5rem`).
- Sizing factor: Fixed pixel utilities encode as `UInt16` (0 to 65,535 px).

### Handling Custom Themes & Non-Standard Spacing
If an application defines a customized `tailwind.config.js` or uses non-standard fractional calculations (e.g. `w-[calc(100%-32px)]` or arbitrary values):
- The encoder switches to **Opcode `0xFE` (`RAW_CSS_STRING`)**.
- Format: `[Modifier: 1B] [Opcode: 0xFE] [Length: 2B BE] [UTF-8 String Bytes]`.
- This guarantees **zero-drop 100% preservation** of any custom CSS without silent failures.

---

## 5. Backward Compatibility & Versioning

- Opcodes `0x00` through `0xDF` are reserved for standardized W3C and Tailwind primitives.
- New opcodes are appended sequentially within their assigned range; existing opcodes are immutable.
- Unknown opcodes encountered by legacy decoders must skip remaining payload bytes based on length prefixes or break to prevent frame corruption.
